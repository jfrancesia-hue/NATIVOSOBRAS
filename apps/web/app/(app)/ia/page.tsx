import { Bot, Camera, ClipboardCheck, FileText, MapPinned, PauseCircle, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { analyzeEvidence, analyzePortfolio, generateExecutiveReport } from "@/lib/ai-engine";
import { getAlertas, getEvidencias, getObras, getProveedores } from "@/lib/data";
import { EmptyState } from "../components";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function IaPage() {
  const [obras, alertas, evidencias, proveedores] = await Promise.all([getObras(), getAlertas(), getEvidencias(), getProveedores()]);
  const portfolio = analyzePortfolio(obras, alertas, evidencias, proveedores);
  const report = generateExecutiveReport(obras, alertas, evidencias, proveedores);
  const evidenceChecks = evidencias.slice(0, 4).map((evidencia) => ({ evidencia, ai: analyzeEvidence(evidencia) }));

  return (
    <>
      <section className="page-header ai-page-header">
        <div>
          <span className="eyebrow">Centro IA</span>
          <h1>Decisiones automaticas para obra publica y privada</h1>
          <p>La plataforma prioriza riesgos, recomienda acciones, controla certificados, analiza evidencia y arma informes ejecutivos.</p>
        </div>
        <a className="button" href="/informe">
          <FileText size={18} />
          Ver informe
        </a>
      </section>

      <section className="ai-command-room">
        <div className="ai-command-copy">
          <span><Bot size={18} /> Copiloto operativo</span>
          <h2>{portfolio.priority ? portfolio.priority.obraNombre : "Sin prioridad generada"}</h2>
          <p>{portfolio.executiveBrief}</p>
          <div className="ai-command-actions">
            <strong>{portfolio.priority?.certificateDecision ?? "Cargar obras para activar decision"}</strong>
            <small>{portfolio.priority?.recommendedAction ?? "La IA necesita avance fisico, financiero y evidencia."}</small>
          </div>
        </div>
        <div className="ai-command-metrics">
          <article><strong>{portfolio.summary.critical}</strong><span>obras criticas</span></article>
          <article><strong>{portfolio.summary.blocked}</strong><span>certificados a frenar</span></article>
          <article><strong>{portfolio.summary.inspections}</strong><span>visitas sugeridas</span></article>
          <article><strong>{portfolio.summary.providerRisk}</strong><span>proveedores en riesgo</span></article>
        </div>
      </section>

      <section className="ai-function-grid">
        <article>
          <PauseCircle size={26} />
          <h3>Control de certificados</h3>
          <p>Detecta avance financiero adelantado y recomienda bloquear, aprobar con validacion o liberar.</p>
          {portfolio.blockedCertificates.length === 0 ? <small>Sin certificados criticos ahora.</small> : null}
          {portfolio.blockedCertificates.slice(0, 3).map((item) => (
            <small key={item.obraId}>{item.obraNombre}: exposicion {money.format(item.estimatedExposure)}</small>
          ))}
        </article>
        <article>
          <MapPinned size={26} />
          <h3>Rutas de inspeccion</h3>
          <p>Ordena visitas por riesgo, evidencia vieja, alertas y desvio financiero.</p>
          {portfolio.inspectionRoute.map((item) => (
            <small key={item.obraId}>{item.obraNombre}: riesgo {item.riskScore}%</small>
          ))}
        </article>
        <article>
          <Camera size={26} />
          <h3>Vision sobre evidencias</h3>
          <p>Evalua si una carga sirve para sostener avance, auditoria o pago.</p>
          {evidenceChecks.length === 0 ? <small>Sin evidencias para analizar.</small> : null}
          {evidenceChecks.slice(0, 3).map(({ evidencia, ai }) => (
            <small key={evidencia.id}>{evidencia.porcentaje}%: {ai.label}</small>
          ))}
        </article>
        <article>
          <ShieldAlert size={26} />
          <h3>Riesgo de proveedores</h3>
          <p>Cruza cumplimiento, calificacion, desvio promedio y exposicion operativa.</p>
          {portfolio.providerRisks.slice(0, 3).map((item) => (
            <small key={item.cuit}>{item.name}: riesgo {item.riskScore}%</small>
          ))}
        </article>
      </section>

      <section className="grid two-cols">
        <div className="panel ai-panel">
          <h2><TrendingUp size={20} /> Ranking IA de obras</h2>
          {portfolio.insights.length === 0 ? <EmptyState title="Sin datos para IA" description="Carga obras y evidencias para generar scoring." /> : null}
          <div className="ai-risk-list">
            {portfolio.insights.map((item) => (
              <a className={`ai-risk-card ${item.level}`} href={`/obras/${item.obraId}`} key={item.obraId}>
                <div>
                  <strong>{item.obraNombre}</strong>
                  <span>{item.diagnosis}</span>
                </div>
                <b>{item.riskScore}%</b>
              </a>
            ))}
          </div>
        </div>
        <div className="panel ai-panel">
          <h2><Sparkles size={20} /> Informe generado por IA</h2>
          <div className="ai-report-lines">
            {report.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="ai-report-actions">
            <span><ClipboardCheck size={16} /> Auditoria</span>
            <span><FileText size={16} /> Acta</span>
            <span><Bot size={16} /> Resumen ejecutivo</span>
          </div>
        </div>
      </section>
    </>
  );
}
