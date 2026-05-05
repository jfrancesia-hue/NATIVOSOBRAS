import { NextResponse } from "next/server";
import { analyzePortfolio, generateExecutiveReport } from "@/lib/ai-engine";
import { getAlertas, getEvidencias, getObras, getProveedores } from "@/lib/data";

export async function GET() {
  const [obras, alertas, evidencias, proveedores] = await Promise.all([getObras(), getAlertas(), getEvidencias(), getProveedores()]);
  const portfolio = analyzePortfolio(obras, alertas, evidencias, proveedores);
  const report = generateExecutiveReport(obras, alertas, evidencias, proveedores);

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    summary: portfolio.summary,
    priority: portfolio.priority,
    blocked_certificates: portfolio.blockedCertificates,
    inspection_route: portfolio.inspectionRoute,
    provider_risks: portfolio.providerRisks,
    report
  });
}
