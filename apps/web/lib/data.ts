import {
  alertas as demoAlertas,
  evidencias as demoEvidencias,
  notificaciones as demoNotificaciones,
  obras as demoObras,
  proveedores as demoProveedores
} from "./mock-data";
import { createSupabaseServerClient } from "./supabase-server";

const demoEnabled = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function getObras() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoEnabled ? demoObras : [];

  const { data, error } = await supabase
    .from("obras_resumen")
    .select("id, nombre, organismo_responsable, estado, presupuesto_total, monto_ejecutado, avance_fisico, avance_financiero, semaforo, lat, lng")
    .order("updated_at", { ascending: false });

  if (error || !data || data.length === 0) return demoEnabled ? demoObras : [];
  return data;
}

export async function getAlertas() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoEnabled ? demoAlertas : [];

  const { data, error } = await supabase
    .from("alertas")
    .select("id, obra_id, severidad, titulo, descripcion, activa")
    .eq("activa", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return demoEnabled ? demoAlertas : [];
  return data.length > 0 ? data : demoEnabled ? demoAlertas : [];
}

export async function getProveedores() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoEnabled ? demoProveedores : [];

  const { data, error } = await supabase
    .from("proveedores")
    .select("razon_social, cuit, calificacion, cumplimiento, desviacion_promedio")
    .order("calificacion", { ascending: false });

  if (error || !data || data.length === 0) return demoEnabled ? demoProveedores : [];
  return data;
}

export async function getAuditEvents() {
  const supabase = await createSupabaseServerClient();
  if (!supabase && demoEnabled) {
    return [
      { id: "demo-audit-1", action: "creacion_obra", entity: "obras", actor_id: "ministro", created_at: "2026-05-05 10:12" },
      { id: "demo-audit-2", action: "carga_avance", entity: "avances_obra", actor_id: "inspector", created_at: "2026-05-05 11:40" }
    ];
  }
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("audit_events")
    .select("id, action, entity, actor_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return data;
}

export async function getObraById(id: string) {
  const obras = await getObras();
  return obras.find((obra) => obra.id === id) ?? null;
}

export async function getEvidencias(obraId?: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!demoEnabled) return [];
    return obraId ? demoEvidencias.filter((evidencia) => evidencia.obra_id === obraId) : demoEvidencias;
  }

  let query = supabase
    .from("avances_obra")
    .select("id, obra_id, porcentaje, descripcion, foto_url, fecha, inspector_id")
    .order("fecha", { ascending: false })
    .limit(60);

  if (obraId) query = query.eq("obra_id", obraId);

  const { data, error } = await query;
  if (error || !data) return demoEnabled ? (obraId ? demoEvidencias.filter((evidencia) => evidencia.obra_id === obraId) : demoEvidencias) : [];

  if (data.length === 0 && demoEnabled) {
    return obraId ? demoEvidencias.filter((evidencia) => evidencia.obra_id === obraId) : demoEvidencias;
  }

  return data.map((evidencia) => ({
    id: evidencia.id,
    obra_id: evidencia.obra_id,
    porcentaje: Number(evidencia.porcentaje),
    descripcion: evidencia.descripcion,
    foto: evidencia.foto_url,
    inspector: evidencia.inspector_id ?? "Inspector",
    fecha: evidencia.fecha
  }));
}

export async function getNotificaciones() {
  const alertas = await getAlertas();
  if (alertas.length === 0 && demoEnabled) return demoNotificaciones;

  return alertas.map((alerta) => ({
    id: alerta.id,
    tipo: alerta.severidad === "rojo" ? "alerta" : "email",
    titulo: alerta.titulo,
    detalle: alerta.descripcion,
    estado: "activa" in alerta && alerta.activa === false ? "cerrada" : "activa"
  }));
}
