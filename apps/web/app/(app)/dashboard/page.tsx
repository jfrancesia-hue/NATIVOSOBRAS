import { AlertTriangle, Bot, BrainCircuit, MapPinned, Plus, ScanSearch, TrendingUp } from "lucide-react";
import { analyzePortfolio } from "@/lib/ai-engine";
import { getAlertas, getEvidencias, getObras, getProveedores } from "@/lib/data";
import { EmptyState, KpiCard, obraPinPosition } from "../components";
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
      <section className="page-header">
        <div>
          <h1>Tablero ejecutivo</h1>
          <p>Control presupuestario, avance fisico y alertas operativas en tiempo real.</p>
        </div>
        <a className="button" href="/obras/nueva">
          <Plus size={18} />
          Nueva obra
        </a>
      </section>

      <section className="grid kpis">
        <KpiCard label="Obras activas" value={activas} />
        <KpiCard label="Avance promedio" value={`${avancePromedio}%`} />
        <KpiCard label="Presupuesto total" value={money.format(presupuesto)} />
        <KpiCard label="Ejecutado" value={money.format(ejecutado)} />
        <KpiCard label="Riesgo IA critico" value={ai.summary.critical} />
        <KpiCard label="Certificados a frenar" value={ai.summary.blocked} />
      </section>

      <section className="ai-decision-panel">
        <div className="ai-decision-main">
          <span className="eyebrow">Copiloto IA</span>
          <h2>{priority ? `Prioridad de hoy: ${priority.obraNombre}` : "Prioridad de hoy: cargar datos operativos"}</h2>
          <p>
            {priority?.diagnosis ?? "La IA necesita obras, evidencias y proveedores para activar recomendaciones accionables."}
          </p>
          <div className="ai-action-row">
            <span><BrainCircuit size={18} /> Riesgo predictivo {priority?.riskScore ?? 0}%</span>
            <span><TrendingUp size={18} /> Desvio {priority?.financialGap ?? 0}%</span>
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
          <h2>Ranking de obras criticas</h2>
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
                  <span className={`status ${obra.semaforo}`}>
                    <span className={`dot ${obra.semaforo}`} />
                    {obra.semaforo}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2>
            <MapPinned size={20} /> Mapa operativo
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
          <AlertTriangle size={20} /> Alertas activas
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
    </>
  );
}
