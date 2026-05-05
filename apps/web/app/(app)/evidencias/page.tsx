import { Camera } from "lucide-react";
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
        {evidencias.map((evidencia) => (
          <article className="evidence-card" key={evidencia.id}>
            <div className="evidence-photo" style={{ backgroundImage: `url(${evidencia.foto})` }}>
              <span><Camera size={16} /> GPS validado</span>
            </div>
            <div>
              <strong>{evidencia.porcentaje}% de avance</strong>
              <p>{evidencia.descripcion}</p>
              <small>{evidencia.inspector} / {new Date(evidencia.fecha).toLocaleString("es-AR")}</small>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
