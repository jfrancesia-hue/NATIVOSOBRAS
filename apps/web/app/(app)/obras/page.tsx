import { Filter, MapPinned } from "lucide-react";
import { imageForIndex } from "@/lib/constructionImages";
import { getObras } from "@/lib/data";
import { EmptyState, PageHeader, RiskBadge, StatusBadge } from "../components";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function ObrasPage() {
  const obras = await getObras();

  return (
    <>
      <PageHeader
        eyebrow="Cartera de infraestructura"
        title="Obras activas, presupuesto y riesgo en una sola vista"
        description="Listado ejecutivo para municipios, ministerios y constructoras con avance fisico, financiero y semaforo operativo."
      />
      <section className="filter-bar">
        {["Estado", "Municipio", "Tipo de obra", "Riesgo"].map((filter) => (
          <button type="button" key={filter}><Filter size={15} /> {filter}</button>
        ))}
      </section>
      <section className="works-grid">
        {obras.length === 0 ? <EmptyState title="Sin obras" description="Todavia no hay obras visibles para tu rol." /> : null}
        {obras.map((obra, index) => (
          <a className="work-card" href={`/obras/${obra.id}`} key={obra.id}>
            <div className="work-card-image" style={{ backgroundImage: `url(${imageForIndex(index)})` }}>
              <RiskBadge value={obra.semaforo} />
            </div>
            <div className="work-card-body">
              <div className="work-card-title">
                <div>
                  <strong>{obra.nombre}</strong>
                  <span><MapPinned size={14} /> {obra.organismo_responsable}</span>
                </div>
                <StatusBadge value={obra.estado} />
              </div>
              <div className="work-budget">
                <span>Presupuesto</span>
                <b>{money.format(Number(obra.presupuesto_total))}</b>
              </div>
              <div className="progress-comparison">
                <label>Avance fisico <b>{Number(obra.avance_fisico)}%</b></label>
                <div><span style={{ width: `${Number(obra.avance_fisico)}%` }} /></div>
                <label>Avance financiero <b>{Number(obra.avance_financiero)}%</b></label>
                <div><span className="financial" style={{ width: `${Number(obra.avance_financiero)}%` }} /></div>
              </div>
            </div>
          </a>
        ))}
      </section>
    </>
  );
}
