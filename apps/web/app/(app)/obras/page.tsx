import { getObras } from "@/lib/data";
import { EmptyState } from "../components";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function ObrasPage() {
  const obras = await getObras();

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Gestion de obras</h1>
          <p>Seguimiento integral por organismo, estado, presupuesto y avance fisico.</p>
        </div>
      </section>
      <section className="panel">
        {obras.length === 0 ? <EmptyState title="Sin obras" description="Todavia no hay obras visibles para tu rol." /> : null}
        {obras.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Organismo</th>
                <th>Estado</th>
                <th>Presupuesto</th>
                <th>Avance</th>
                <th>Semaforo</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((obra) => (
                <tr key={obra.id}>
                <td>{obra.nombre}</td>
                  <td>{obra.organismo_responsable}</td>
                  <td>{obra.estado}</td>
                  <td>{money.format(Number(obra.presupuesto_total))}</td>
                  <td>{Number(obra.avance_fisico)}%</td>
                <td>
                  <span className={`status ${obra.semaforo}`}>
                    <span className={`dot ${obra.semaforo}`} />
                    {obra.semaforo}
                  </span>
                </td>
                <td>
                  <a className="text-link" href={`/obras/${obra.id}`}>Ver detalle</a>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </>
  );
}
