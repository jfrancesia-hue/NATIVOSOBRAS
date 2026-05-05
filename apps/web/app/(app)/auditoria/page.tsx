import { Clock, Database, UserRound } from "lucide-react";
import { getAuditEvents } from "@/lib/data";
import { EmptyState, PageHeader } from "../components";

export default async function AuditoriaPage() {
  const eventos = await getAuditEvents();

  return (
    <>
      <PageHeader
        eyebrow="Trazabilidad institucional"
        title="Auditoria clara para decisiones y control posterior"
        description="Registro ordenado por usuario, obra, fecha y evento para reconstruir cada decision relevante."
      />
      <section className="audit-filter-bar">
        {["Usuario", "Obra", "Fecha", "Evento"].map((filter) => (
          <button type="button" key={filter}>{filter}</button>
        ))}
      </section>
      <section className="panel audit-panel">
        {eventos.length === 0 ? <EmptyState title="Sin eventos de auditoria" description="Las altas y cambios sobre obras, avances y proveedores se registraran aca." /> : null}
        {eventos.length > 0 ? (
          <div className="audit-timeline">
            {eventos.map((evento) => (
              <article key={evento.id}>
                <span className="audit-dot"><Database size={18} /></span>
                <div>
                  <strong>{evento.action}</strong>
                  <p>{evento.entity}</p>
                  <small><UserRound size={14} /> {evento.actor_id ?? "sistema"} <Clock size={14} /> {new Date(evento.created_at).toLocaleString("es-AR")}</small>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
