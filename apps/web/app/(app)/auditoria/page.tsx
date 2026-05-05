import { getAuditEvents } from "@/lib/data";
import { EmptyState } from "../components";

export default async function AuditoriaPage() {
  const eventos = await getAuditEvents();

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Auditoria total</h1>
          <p>Trazabilidad de eventos criticos: quien hizo que, cuando y sobre que entidad.</p>
        </div>
      </section>
      <section className="panel">
        {eventos.length === 0 ? <EmptyState title="Sin eventos de auditoria" description="Las altas y cambios sobre obras, avances y proveedores se registraran aca." /> : null}
        {eventos.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Accion</th>
              <th>Entidad</th>
              <th>Actor</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.action}</td>
                <td>{evento.entity}</td>
                <td>{evento.actor_id ?? "sistema"}</td>
                <td>{new Date(evento.created_at).toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : null}
      </section>
    </>
  );
}
