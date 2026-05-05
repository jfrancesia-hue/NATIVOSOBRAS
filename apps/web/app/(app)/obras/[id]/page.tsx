import { ArrowLeft, Bot, Camera, CheckCircle2, FileText, MapPinned, Plus, ShieldAlert, ShieldCheck } from "lucide-react";
import { analyzeObra } from "@/lib/ai-engine";
import { constructionImages } from "@/lib/constructionImages";
import { getAlertas, getEvidencias, getObraById } from "@/lib/data";
import { EmptyState, PageHeader, obraPinPosition } from "../../components";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function ObraDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [obra, evidencias, alertas] = await Promise.all([getObraById(id), getEvidencias(id), getAlertas()]);
  const alertasObra = alertas.filter((alerta) => alerta.obra_id === id);

  if (!obra) {
    return <EmptyState title="Obra no encontrada" description="No hay informacion visible para esta obra." />;
  }

  const ai = analyzeObra(obra, evidencias, alertasObra);

  return (
    <>
      <PageHeader
        eyebrow="Detalle tecnico de obra"
        title={obra.nombre}
        description={`${obra.organismo_responsable} / ${obra.estado}`}
        image={constructionImages.maquinariaVial}
      >
          <a className="ghost-button" href="/obras"><ArrowLeft size={16} /> Volver</a>
          <a className="ghost-button" href={`/obras/${obra.id}/avances/nuevo`}>
            <Plus size={18} />
            Cargar avance
          </a>
          <a className="button" href="/informe">
            <FileText size={18} />
            Informe ejecutivo
          </a>
      </PageHeader>

      <section className="detail-hero">
        <div className="detail-card accent-blue">
          <span>Presupuesto</span>
          <strong>{money.format(Number(obra.presupuesto_total))}</strong>
          <small>Ejecutado: {money.format(Number(obra.monto_ejecutado))}</small>
        </div>
        <div className="detail-card accent-teal">
          <span>Avance fisico</span>
          <strong>{Number(obra.avance_fisico)}%</strong>
          <small>Financiero: {Number(obra.avance_financiero)}%</small>
        </div>
        <div className={`detail-card accent-${obra.semaforo}`}>
          <span>Semaforo</span>
          <strong>{obra.semaforo}</strong>
          <small>{alertasObra.length} alertas activas</small>
        </div>
      </section>

      <section className={`obra-ai-panel ${ai.level}`}>
        <div>
          <span className="eyebrow"><Bot size={16} /> Analisis IA de obra</span>
          <h2>{ai.certificateDecision}</h2>
          <p>{ai.diagnosis}</p>
          <div className="ai-action-row">
            <span><ShieldAlert size={18} /> Riesgo {ai.riskScore}%</span>
            <span><FileText size={18} /> Desvio {ai.financialGap}%</span>
            <span><Camera size={18} /> {ai.evidenceHealth}</span>
          </div>
        </div>
        <div className="obra-ai-steps">
          {ai.nextSteps.map((step) => (
            <span key={step}><CheckCircle2 size={16} /> {step}</span>
          ))}
        </div>
      </section>

      <section className="grid two-cols">
        <div className="panel">
          <h2><MapPinned size={20} /> Ubicacion y control territorial</h2>
          <div className="map map-large">
            <span className={`pin ${obra.semaforo}`} style={obraPinPosition(Number(obra.lat), Number(obra.lng))} />
          </div>
        </div>
        <div className="panel">
          <h2><ShieldCheck size={20} /> Alertas de auditoria</h2>
          <div className="alert-list">
            {alertasObra.length === 0 ? <EmptyState title="Sin alertas" description="La obra no tiene desvios activos." /> : null}
            {alertasObra.map((alerta) => (
              <div className="card alert-card" key={alerta.id}>
                <span className={`status ${alerta.severidad}`}><span className={`dot ${alerta.severidad}`} />{alerta.titulo}</span>
                <p>{alerta.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2><Camera size={20} /> Galeria de evidencias</h2>
        <div className="evidence-grid">
          {evidencias.map((evidencia) => (
            <article className="evidence-card" key={evidencia.id}>
              <div className="evidence-photo" style={{ backgroundImage: `url(${evidencia.foto})` }} />
              <div>
                <strong>{evidencia.porcentaje}% informado</strong>
                <p>{evidencia.descripcion}</p>
                <small>{evidencia.inspector} / {new Date(evidencia.fecha).toLocaleString("es-AR")}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
