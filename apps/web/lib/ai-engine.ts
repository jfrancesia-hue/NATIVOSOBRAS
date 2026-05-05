type Semaforo = "verde" | "amarillo" | "rojo";

export type AiObra = {
  id: string;
  nombre: string;
  organismo_responsable: string;
  estado: string;
  presupuesto_total: number | string;
  monto_ejecutado: number | string;
  avance_fisico: number | string;
  avance_financiero: number | string;
  semaforo: string;
  lat?: number | string;
  lng?: number | string;
};

export type AiAlerta = {
  id: string;
  obra_id: string;
  severidad: string;
  titulo: string;
  descripcion: string;
};

export type AiEvidencia = {
  id: string;
  obra_id: string;
  porcentaje: number | string;
  descripcion: string;
  foto?: string | null;
  inspector?: string | null;
  fecha: string;
};

export type AiProveedor = {
  razon_social: string;
  cuit: string;
  calificacion: number | string;
  cumplimiento: number | string;
  desviacion_promedio?: number | string | null;
  obras?: number | string;
};

export type ObraAiInsight = {
  obraId: string;
  obraNombre: string;
  riskScore: number;
  level: Semaforo;
  financialGap: number;
  estimatedExposure: number;
  diagnosis: string;
  recommendedAction: string;
  certificateDecision: string;
  evidenceHealth: string;
  nextSteps: string[];
  explanation: string[];
};

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function num(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function daysSince(value: string | null | undefined) {
  if (!value) return 999;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 999;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function levelFromScore(score: number): Semaforo {
  if (score >= 70) return "rojo";
  if (score >= 42) return "amarillo";
  return "verde";
}

export function analyzeObra(obra: AiObra, evidencias: AiEvidencia[] = [], alertas: AiAlerta[] = []): ObraAiInsight {
  const avanceFisico = num(obra.avance_fisico);
  const avanceFinanciero = num(obra.avance_financiero);
  const presupuesto = num(obra.presupuesto_total);
  const gap = Math.round((avanceFinanciero - avanceFisico) * 10) / 10;
  const latestEvidence = evidencias
    .filter((evidencia) => evidencia.obra_id === obra.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  const obraAlertas = alertas.filter((alerta) => alerta.obra_id === obra.id);
  const evidenceAge = daysSince(latestEvidence?.fecha);
  const severeAlerts = obraAlertas.filter((alerta) => alerta.severidad === "rojo").length;
  const evidenceLag = latestEvidence ? avanceFisico - num(latestEvidence.porcentaje) : 18;
  const pausedPenalty = obra.estado === "pausada" && avanceFinanciero > 0 ? 18 : 0;
  const score = clamp(
    18 +
      Math.max(0, gap) * 1.55 +
      severeAlerts * 14 +
      Math.min(22, evidenceAge * 1.8) +
      Math.max(0, evidenceLag) * 0.7 +
      pausedPenalty
  );
  const level = levelFromScore(score);
  const estimatedExposure = Math.max(0, Math.round((presupuesto * Math.max(0, gap)) / 100));

  const diagnosis =
    level === "rojo"
      ? "Riesgo operativo alto: la ejecucion financiera, las alertas y la evidencia no estan alineadas."
      : level === "amarillo"
        ? "Riesgo moderado: conviene pedir validacion antes de aprobar nuevas decisiones."
        : "Evolucion consistente: mantener monitoreo automatico y frecuencia normal de inspeccion.";

  const recommendedAction =
    gap >= 20
      ? "Bloquear aprobacion automatica, pedir evidencia georreferenciada y enviar auditoria al certificado."
      : evidenceAge > 10
        ? "Solicitar nueva evidencia desde campo y priorizar visita del inspector."
        : severeAlerts > 0
          ? "Escalar alertas abiertas y generar informe de seguimiento."
          : "Mantener monitoreo y programar revision semanal.";

  const certificateDecision =
    gap >= 20
      ? "No aprobar certificado sin evidencia adicional"
      : gap >= 10
        ? "Aprobar solo con validacion de inspector"
        : "Certificado habilitado con control normal";

  const evidenceHealth =
    !latestEvidence
      ? "Sin evidencia reciente cargada"
      : evidenceAge > 10
        ? `Ultima evidencia hace ${evidenceAge} dias`
        : `Evidencia vigente hace ${evidenceAge} dias`;

  return {
    obraId: obra.id,
    obraNombre: obra.nombre,
    riskScore: Math.round(score),
    level,
    financialGap: gap,
    estimatedExposure,
    diagnosis,
    recommendedAction,
    certificateDecision,
    evidenceHealth,
    nextSteps: [
      gap >= 20 ? "Pausar certificado y pedir respaldo tecnico" : "Comparar avance fisico contra certificado",
      evidenceAge > 10 ? "Enviar inspector o solicitar foto nueva" : "Verificar consistencia de ultima evidencia",
      severeAlerts > 0 ? "Generar informe para auditoria" : "Mantener seguimiento automatico"
    ],
    explanation: [
      `Fisico ${avanceFisico}% vs financiero ${avanceFinanciero}%`,
      `Desvio estimado ${gap > 0 ? "+" : ""}${gap}%`,
      estimatedExposure > 0 ? `Exposicion aproximada ${money.format(estimatedExposure)}` : "Sin exposicion financiera relevante"
    ]
  };
}

export function analyzePortfolio(obras: AiObra[], alertas: AiAlerta[], evidencias: AiEvidencia[], proveedores: AiProveedor[] = []) {
  const insights = obras
    .map((obra) => analyzeObra(obra, evidencias, alertas))
    .sort((a, b) => b.riskScore - a.riskScore);
  const blockedCertificates = insights.filter((insight) => insight.financialGap >= 20);
  const inspectionRoute = insights.filter((insight) => insight.level !== "verde").slice(0, 4);
  const providerRisks = proveedores.map(analyzeProveedor).sort((a, b) => b.riskScore - a.riskScore);
  const critical = insights.filter((insight) => insight.level === "rojo").length;

  return {
    insights,
    priority: insights[0] ?? null,
    blockedCertificates,
    inspectionRoute,
    providerRisks,
    summary: {
      critical,
      blocked: blockedCertificates.length,
      inspections: inspectionRoute.length,
      providerRisk: providerRisks.filter((provider) => provider.level !== "verde").length
    },
    executiveBrief: insights[0]
      ? `Prioridad IA: ${insights[0].obraNombre}. ${insights[0].recommendedAction}`
      : "Sin obras suficientes para generar prioridad IA."
  };
}

export function analyzeEvidence(evidencia: AiEvidencia) {
  const age = daysSince(evidencia.fecha);
  const description = evidencia.descripcion.toLowerCase();
  const weakDescription = description.length < 45;
  const mentionsDelay = /demora|atras|paus|falta|material|problema|reclamo/.test(description);
  const score = clamp(92 - (weakDescription ? 18 : 0) - (age > 10 ? 16 : 0) - (mentionsDelay ? 12 : 0));
  const level = score < 62 ? "rojo" : score < 78 ? "amarillo" : "verde";
  return {
    score,
    level,
    label: level === "verde" ? "Evidencia confiable" : level === "amarillo" ? "Revisar evidencia" : "Evidencia debil",
    findings: [
      evidencia.foto ? "Foto disponible para vision IA" : "Falta foto",
      age > 10 ? `Captura antigua: ${age} dias` : `Captura reciente: ${age} dias`,
      weakDescription ? "Descripcion tecnica insuficiente" : "Descripcion tecnica util",
      mentionsDelay ? "Texto menciona posible demora o faltante" : "Sin palabras criticas detectadas"
    ]
  };
}

export function analyzeProveedor(proveedor: AiProveedor) {
  const calificacion = num(proveedor.calificacion);
  const cumplimiento = num(proveedor.cumplimiento);
  const desvio = num(proveedor.desviacion_promedio);
  const score = clamp((10 - calificacion) * 8 + (100 - cumplimiento) * 0.7 + desvio * 1.8);
  const level = levelFromScore(score);
  return {
    cuit: proveedor.cuit,
    name: proveedor.razon_social,
    riskScore: Math.round(score),
    level,
    recommendation:
      level === "rojo"
        ? "Revisar contratos activos, pedir plan de recupero y limitar nuevas adjudicaciones."
        : level === "amarillo"
          ? "Solicitar seguimiento quincenal y controlar desvios en certificados."
          : "Proveedor habilitado para operar con monitoreo normal.",
    reasons: [
      `Calificacion ${calificacion}/10`,
      `Cumplimiento ${cumplimiento}%`,
      `Desvio promedio ${desvio}%`
    ]
  };
}

export function generateExecutiveReport(obras: AiObra[], alertas: AiAlerta[], evidencias: AiEvidencia[], proveedores: AiProveedor[] = []) {
  const portfolio = analyzePortfolio(obras, alertas, evidencias, proveedores);
  return [
    portfolio.executiveBrief,
    `Certificados a frenar: ${portfolio.summary.blocked}. Inspecciones sugeridas: ${portfolio.summary.inspections}.`,
    portfolio.priority ? `Decision recomendada: ${portfolio.priority.certificateDecision}.` : "Cargar mas datos para decision automatica.",
    portfolio.providerRisks[0] ? `Proveedor a revisar: ${portfolio.providerRisks[0].name}.` : "Sin proveedores cargados para scoring."
  ];
}
