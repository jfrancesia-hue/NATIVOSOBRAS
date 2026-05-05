import { FileText } from "lucide-react";
import { analyzePortfolio, generateExecutiveReport } from "@/lib/ai-engine";
import { getAlertas, getEvidencias, getObras, getProveedores } from "@/lib/data";
import { PrintButton } from "./print-button";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function InformePage() {
  const [obras, alertas, evidencias, proveedores] = await Promise.all([getObras(), getAlertas(), getEvidencias(), getProveedores()]);
  const ai = analyzePortfolio(obras, alertas, evidencias, proveedores);
  const aiReport = generateExecutiveReport(obras, alertas, evidencias, proveedores);
  const presupuesto = obras.reduce((acc, obra) => acc + Number(obra.presupuesto_total), 0);
  const ejecutado = obras.reduce((acc, obra) => acc + Number(obra.monto_ejecutado), 0);

  return (
    <>
      <section className="page-header no-print">
        <div>
          <h1>Informe ejecutivo</h1>
          <p>Resumen listo para imprimir o exportar como PDF desde el navegador.</p>
        </div>
        <PrintButton />
      </section>
      <section className="report-page">
        <div className="report-header">
          <FileText size={30} />
          <div>
            <h1>Nativos Obras360</h1>
            <p>Informe ejecutivo de control de obra publica</p>
          </div>
        </div>
        <div className="report-kpis">
          <div><span>Obras</span><strong>{obras.length}</strong></div>
          <div><span>Presupuesto</span><strong>{money.format(presupuesto)}</strong></div>
          <div><span>Ejecutado</span><strong>{money.format(ejecutado)}</strong></div>
          <div><span>Alertas</span><strong>{alertas.length}</strong></div>
        </div>
        <h2>Resumen generado por IA</h2>
        <div className="report-list ai-report-print">
          {aiReport.map((line) => (
            <div key={line}>
              <strong>Decision</strong>
              <span>{line}</span>
            </div>
          ))}
        </div>
        <h2>Obras criticas</h2>
        <div className="report-list">
          {ai.insights.map((insight) => (
            <div key={insight.obraId}>
              <strong>{insight.obraNombre}</strong>
              <span>{insight.riskScore}% riesgo IA / {insight.certificateDecision} / {insight.recommendedAction}</span>
            </div>
          ))}
        </div>
        <h2>Evidencias recientes</h2>
        <div className="report-list">
          {evidencias.slice(0, 3).map((evidencia) => (
            <div key={evidencia.id}>
              <strong>{evidencia.porcentaje}% informado</strong>
              <span>{evidencia.descripcion}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
