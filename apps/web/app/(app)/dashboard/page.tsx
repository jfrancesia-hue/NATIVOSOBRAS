import { AlertTriangle, Banknote, Bot, BrainCircuit, Building2, FileWarning, Images, MapPinned, Plus, ScanSearch, TrendingUp } from "lucide-react";
import { analyzePortfolio } from "@/lib/ai-engine";
import { constructionImages } from "@/lib/constructionImages";
import { getAlertas, getEvidencias, getObras, getProveedores } from "@/lib/data";
import { EmptyState, KpiCard, PageHeader, RiskBadge, obraPinPosition } from "../components";
import { AiActionCenter } from "./ai-action-center";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function DashboardPage() {
  const [obras, alertas, evidencias, proveedores] = await Promise.all([getObras(), getAlertas(), getEvidencias(), getProveedores()]);
  const ai = analyzePortfolio(obras, alertas, evidencias, proveedores);
  const priority = ai.priority;
  const activas = obras.filter((obra) => obra.estado === "en_ejecucion").length;
  const presupuesto = obras.reduce((acc, obra) => acc + Number(obra.presupuesto_total), 0);
  const ejecutado = obras.reduce((acc, obra) => acc + Number(obra.monto_ejecutado), 0);
  const avancePromedio = Math.round(obras.reduce((acc, obra) => acc + Number(obra.avance_fisico), 0) / Math.max(1, obras.length));

  return (
    <>
      <PageHeader
        eyebrow="Tablero ejecutivo"
        title="Control inteligente de obras publicas y privadas"
        description="Seguimiento fisico, financiero y documental para que cada peso invertido se traduzca en avance real."
        image={constructionImages.heroObraPublica}
      >
        <a className="button" href="/obras/nueva">
          <Plus size={18} />
          Nueva obra
        </a>
        <a className="ghost-button" href="/informe">Generar informe</a>
      </PageHeader>

      <section className="grid kpis">
        <KpiCard label="Obras activas" value={activas} icon={<Building2 size={20} />} tone="blue" />
        <KpiCard label="Avance promedio" value={`${avancePromedio}%`} icon={<TrendingUp size={20} />} tone="success" />
        <KpiCard label="Presupuesto controlado" value={money.format(presupuesto)} icon={<Banknote size={20} />} />
        <KpiCard label="Ejecutado" value={money.format(ejecutado)} icon={<Banknote size={20} />} />
        <KpiCard label="Alertas criticas" value={ai.summary.critical} icon={<AlertTriangle size={20} />} tone="warning" />
        <KpiCard label="Certificaciones observadas" value={ai.summary.blocked} icon={<FileWarning size={20} />} tone="warning" />
      </section>

      <section className="ai-decision-panel">
        <div className="ai-decision-main">
          <span className="eyebrow">Copiloto operativo de obra</span>
          <h2>{priority ? `Prioridad de hoy: ${priority.obraNombre}` : "Prioridad de hoy: cargar datos operativos"}</h2>
          <p>
            {priority?.diagnosis ?? "La IA necesita obras, evidencias y proveedores para activar recomendaciones accionables."}
          </p>
          <div className="ai-action-row">
            <span><BrainCircuit size={18} /> Riesgo de sobrecertificacion {priority?.riskScore ?? 0}%</span>
            <span><TrendingUp size={18} /> Brecha fisico-financiera {priority?.financialGap ?? 0}%</span>
            <span><ScanSearch size={18} /> {priority?.evidenceHealth ?? "Sin evidencia"}</span>
          </div>
        </div>
        <div className="ai-decision-side">
          <Bot size={28} />
          <strong>Accion recomendada</strong>
          <p>{priority?.recommendedAction ?? "Cargar una obra y su primer avance para generar la accion recomendada."}</p>
        </div>
      </section>

      <AiActionCenter insights={ai.insights.slice(0, 4)} providerRisks={ai.providerRisks.slice(0, 3)} />

      <section className="grid two-cols">
        <div className="panel">
          <h2>Obras con riesgo operativo</h2>
          {obras.length === 0 ? (
            <EmptyState title="Sin obras cargadas" description="Crea la primera obra para activar el tablero ejecutivo." />
          ) : (
            <div className="ops-card-list">
              {obras.map((obra) => (
                <a className={`ops-card ${obra.semaforo}`} href={`/obras/${obra.id}`} key={obra.id}>
                  <div>
                    <strong>{obra.nombre}</strong>
                    <span>{obra.organismo_responsable}</span>
                  </div>
                  <div className="ops-progress">
                    <label>Fisico {Number(obra.avance_fisico)}%</label>
                    <div><span style={{ width: `${Number(obra.avance_fisico)}%` }} /></div>
                    <label>Financiero {Number(obra.avance_financiero)}%</label>
                    <div><span className="orange" style={{ width: `${Number(obra.avance_financiero)}%` }} /></div>
                  </div>
                  <RiskBadge value={obra.semaforo} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2>
            <MapPinned size={20} /> Ubicacion de obras
          </h2>
          <div className="map">
            {obras.map((obra) => (
              <span key={obra.id} className={`pin ${obra.semaforo}`} title={obra.nombre} style={obraPinPosition(Number(obra.lat), Number(obra.lng))} />
            ))}
          </div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>
          <AlertTriangle size={20} /> Alertas y acciones recomendadas
        </h2>
        <div className="alert-list">
          {alertas.length === 0 ? <EmptyState title="Sin alertas activas" description="No hay desvios abiertos para el tenant actual." /> : null}
          {alertas.map((alerta) => (
            <div className="card" key={alerta.id}>
              <span className={`status ${alerta.severidad}`}>
                <span className={`dot ${alerta.severidad}`} />
                {alerta.titulo}
              </span>
              <p>{alerta.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel evidence-preview-panel" style={{ marginTop: 16 }}>
        <h2><Images size={20} /> Ultimas evidencias cargadas</h2>
        <div className="evidence-mini-grid">
          {evidencias.slice(0, 3).map((evidencia) => (
            <article key={evidencia.id} style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 36, 55, 0.05), rgba(15, 36, 55, 0.78)), url(${evidencia.foto})` }}>
              <strong>{evidencia.porcentaje}% informado</strong>
              <span>{evidencia.inspector} / {new Date(evidencia.fecha).toLocaleDateString("es-AR")}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
