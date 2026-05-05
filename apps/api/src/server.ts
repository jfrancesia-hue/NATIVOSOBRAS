import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { z } from "zod";
import { validarCargaEnSitio } from "@nativos/domain";
import { asyncHandler } from "./async-handler.js";
import { requireAuth, requireRole } from "./auth.js";
import { evaluarObra, puntuarOferta } from "./business.js";
import { corsOrigins, env } from "./env.js";
import { logger, requestId, securityHeaders } from "./http.js";
import { supabaseAdmin } from "./supabase.js";

type OfertaConProveedor = {
  id: string;
  monto: number | string;
  plazo_dias: number | string;
  proveedores?: { calificacion?: number | string } | null;
};

type LicitacionConOfertas = {
  id: string;
  tenant_id: string;
  obras?: { presupuesto_total?: number | string } | null;
  ofertas?: OfertaConProveedor[];
};

type EvaluacionAlerta = {
  tipo: string;
  severidad: "verde" | "amarillo" | "rojo";
  titulo: string;
  descripcion: string;
};

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(requestId);
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origen CORS no autorizado"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "nativos-obras360-api" });
});

app.get("/ready", asyncHandler(async (_req, res) => {
  const { error } = await supabaseAdmin.from("tenants").select("id").limit(1);
  if (error) return res.status(503).json({ ok: false, dependency: "supabase" });
  res.json({ ok: true });
}));

app.use(requireAuth);

app.post("/obras/:id/evaluar", requireRole(["superadmin", "ministro", "auditor"]), asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

  const { data: obra, error } = await supabaseAdmin
    .from("obras_resumen")
    .select("id, tenant_id, presupuesto_total, monto_ejecutado, avance_fisico, fecha_fin_estimada")
    .eq("id", id)
    .eq("tenant_id", req.auth!.tenantId)
    .single();

  if (error || !obra) return res.status(404).json({ error: "Obra no encontrada" });

  const { data: ultimo } = await supabaseAdmin
    .from("avances_obra")
    .select("fecha")
    .eq("obra_id", id)
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  const resultado = evaluarObra({
    avanceFisico: Number(obra.avance_fisico ?? 0),
    montoEjecutado: Number(obra.monto_ejecutado ?? 0),
    presupuestoTotal: Number(obra.presupuesto_total ?? 0),
    fechaFinEstimada: obra.fecha_fin_estimada,
    ultimoAvance: ultimo?.fecha ?? null
  });

  let alertasCreadas = 0;

  if (resultado.alertas.length > 0) {
    const alertasEvaluadas: EvaluacionAlerta[] = resultado.alertas;
    const tipos = alertasEvaluadas.map((alerta) => alerta.tipo);
    const { data: existentes } = await supabaseAdmin.from("alertas").select("tipo").eq("obra_id", obra.id).eq("activa", true).in("tipo", tipos);
    const tiposActivos = new Set((existentes ?? []).map((alerta: { tipo: string }) => alerta.tipo));
    const nuevas = alertasEvaluadas.filter((alerta) => !tiposActivos.has(alerta.tipo));

    if (nuevas.length > 0) {
      const insertResult = await supabaseAdmin.from("alertas").insert(
        nuevas.map((alerta) => ({
          tenant_id: obra.tenant_id,
          obra_id: obra.id,
          tipo: alerta.tipo,
          severidad: alerta.severidad,
          titulo: alerta.titulo,
          descripcion: alerta.descripcion
        }))
      );

      if (insertResult.error) {
        logger.warn({ err: insertResult.error, obraId: obra.id }, "alert_insert_failed");
      } else {
        alertasCreadas = nuevas.length;
      }
    }
  }

  res.json({ ...resultado, alertasCreadas });
}));

app.post("/avances", asyncHandler(async (req, res) => {
  const payload = z
    .object({
      obra_id: z.string().uuid(),
      inspector_id: z.string().uuid(),
      porcentaje: z.number().min(0).max(100),
      descripcion: z.string().min(3),
      foto_url: z.string().min(3).max(500),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180)
    })
    .parse(req.body);

  if (req.auth!.role !== "inspector" || payload.inspector_id !== req.auth!.userId) {
    return res.status(403).json({ error: "Solo el inspector autenticado puede cargar sus avances" });
  }

  if (!payload.foto_url.startsWith(`${payload.obra_id}/`)) {
    return res.status(422).json({ error: "La foto no corresponde al path esperado de la obra" });
  }

  const { data: asignacion } = await supabaseAdmin
    .from("obra_inspectores")
    .select("obra_id")
    .eq("obra_id", payload.obra_id)
    .eq("inspector_id", req.auth!.userId)
    .maybeSingle();

  if (!asignacion) return res.status(403).json({ error: "Obra no asignada al inspector" });

  const { data: obra } = await supabaseAdmin.from("obras").select("tenant_id, lat, lng").eq("id", payload.obra_id).single();
  if (!obra || obra.tenant_id !== req.auth!.tenantId) return res.status(404).json({ error: "Obra no encontrada" });

  const validacionSitio = validarCargaEnSitio(
    { lat: Number(obra.lat), lng: Number(obra.lng) },
    { lat: payload.lat, lng: payload.lng },
    env.MAX_AVANCE_DISTANCE_METERS
  );

  if (!validacionSitio.valida) {
    return res.status(422).json({
      error: "La ubicacion informada esta fuera del radio permitido para esta obra",
      distanciaMetros: validacionSitio.distanciaMetros,
      radioPermitidoMetros: env.MAX_AVANCE_DISTANCE_METERS
    });
  }

  const { data, error } = await supabaseAdmin.from("avances_obra").insert(payload).select().single();
  if (error) return res.status(400).json({ error: error.message });

  await supabaseAdmin.from("audit_events").insert({
    tenant_id: req.auth!.tenantId,
    actor_id: payload.inspector_id,
    action: "carga_avance",
    entity: "avances_obra",
    entity_id: data.id,
    metadata: { ...payload, distanciaMetros: validacionSitio.distanciaMetros }
  });

  res.status(201).json(data);
}));

app.post("/licitaciones/:id/puntuar", asyncHandler(async (req, res) => {
  if (!["superadmin", "ministro"].includes(req.auth!.role)) {
    return res.status(403).json({ error: "Rol no autorizado" });
  }

  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

  const { data: licitacion, error } = await supabaseAdmin
    .from("licitaciones")
    .select("id, tenant_id, obras(presupuesto_total), ofertas(id, monto, plazo_dias, proveedores(calificacion))")
    .eq("id", id)
    .eq("tenant_id", req.auth!.tenantId)
    .single();

  if (error || !licitacion) return res.status(404).json({ error: "Licitacion no encontrada" });

  const licitacionTyped = licitacion as LicitacionConOfertas;
  const presupuesto = Number(licitacionTyped.obras?.presupuesto_total ?? 0);
  const ofertas = (licitacionTyped.ofertas ?? []).map((oferta) => ({
    id: oferta.id,
    puntaje: puntuarOferta({
      monto: Number(oferta.monto),
      presupuestoReferencia: presupuesto,
      plazoDias: Number(oferta.plazo_dias),
      calificacionProveedor: Number(oferta.proveedores?.calificacion ?? 0)
    })
  }));

  await Promise.all(ofertas.map((oferta) => supabaseAdmin.from("ofertas").update({ puntaje: oferta.puntaje }).eq("id", oferta.id)));
  res.json({ ofertas: ofertas.sort((a, b) => b.puntaje - a.puntaje) });
}));

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof z.ZodError) return res.status(422).json({ error: err.flatten() });
  logger.error({ err }, "api_error");
  res.status(500).json({ error: "Error interno" });
});

app.listen(env.API_PORT, () => {
  logger.info({ port: env.API_PORT }, "Nativos Obras360 API escuchando");
});
