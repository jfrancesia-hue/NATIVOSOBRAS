import { Bot, Camera, ScanSearch } from "lucide-react";
import { analyzeEvidence } from "@/lib/ai-engine";
import { getEvidencias } from "@/lib/data";
import { EmptyState } from "../components";

export default async function EvidenciasPage() {
  const evidencias = await getEvidencias();

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Galeria de evidencias</h1>
          <p>Fotos de avance con inspector, fecha, porcentaje y ubicacion.</p>
        </div>
      </section>
      <section className="evidence-grid">
        {evidencias.length === 0 ? (
          <EmptyState title="Sin evidencias cargadas" description="Cuando los inspectores registren avances, las fotos con GPS apareceran aca." />
        ) : null}
        {evidencias.map((evidencia) => {
          const ai = analyzeEvidence(evidencia);
          return (
            <article className={`evidence-card ai-evidence-card ${ai.level}`} key={evidencia.id}>
              <div className="evidence-photo" style={{ backgroundImage: `url(${evidencia.foto})` }}>
                <span><Camera size={16} /> GPS validado</span>
              </div>
              <div>
                <strong>{evidencia.porcentaje}% de avance</strong>
                <p>{evidencia.descripcion}</p>
                <small>{evidencia.inspector} / {new Date(evidencia.fecha).toLocaleString("es-AR")}</small>
                <div className="evidence-ai-check">
                  <b><Bot size={15} /> {ai.score}% IA</b>
                  <span><ScanSearch size={15} /> {ai.label}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
