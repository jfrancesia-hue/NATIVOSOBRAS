import { Bot, ShieldAlert } from "lucide-react";
import { analyzeProveedor } from "@/lib/ai-engine";
import { getProveedores } from "@/lib/data";
import { EmptyState } from "../components";

export default async function ProveedoresPage() {
  const proveedores = await getProveedores();

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Proveedores y licitaciones</h1>
          <p>Registro de empresas, desempeno historico y comparacion automatica de ofertas.</p>
        </div>
      </section>
      <section className="panel">
        {proveedores.length === 0 ? <EmptyState title="Sin proveedores" description="Carga proveedores para comparar desempeno y ofertas." /> : null}
        {proveedores.length > 0 ? (
          <div className="provider-grid">
            {proveedores.map((proveedor) => {
              const ai = analyzeProveedor(proveedor);
              const riesgo = ai.level;
              return (
                <article className="provider-card" key={proveedor.cuit}>
                  <div className="provider-top">
                    <div>
                      <strong>{proveedor.razon_social}</strong>
                      <span>{proveedor.cuit}</span>
                    </div>
                    <span className={`score ${riesgo}`}>{Number(proveedor.calificacion)}</span>
                  </div>
                  <div className="provider-bars">
                    <label>Cumplimiento <b>{Number(proveedor.cumplimiento)}%</b></label>
                    <div><span style={{ width: `${Number(proveedor.cumplimiento)}%` }} /></div>
                    <label>Desvio promedio <b>{Number(proveedor.desviacion_promedio ?? 0)}%</b></label>
                    <div><span className="orange" style={{ width: `${Math.min(100, Number(proveedor.desviacion_promedio ?? 0) * 4)}%` }} /></div>
                  </div>
                  <span className={`status ${riesgo}`}>
                    <span className={`dot ${riesgo}`} />
                    {riesgo === "verde" ? "Proveedor confiable" : "Requiere seguimiento"}
                  </span>
                  <div className="provider-ai">
                    <strong><Bot size={16} /> Riesgo IA {ai.riskScore}%</strong>
                    <p>{ai.recommendation}</p>
                    <span><ShieldAlert size={15} /> {ai.reasons.join(" / ")}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </>
  );
}
