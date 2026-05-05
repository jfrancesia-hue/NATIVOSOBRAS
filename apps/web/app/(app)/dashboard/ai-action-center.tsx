"use client";

import { useMemo, useState } from "react";
import { Bot, Camera, FileWarning, MapPinned, MessageSquareWarning, PauseCircle, Send, ShieldAlert } from "lucide-react";
import type { ObraAiInsight } from "@/lib/ai-engine";

const playbooks = [
  {
    id: "certificado",
    title: "Frenar certificado dudoso",
    trigger: "Pago supera avance fisico por mas de 20 puntos.",
    impact: "Evita aprobar gasto sin evidencia suficiente.",
    actions: ["Bloquear aprobacion automatica", "Pedir foto georreferenciada", "Enviar informe a auditoria"],
    icon: PauseCircle
  },
  {
    id: "inspector",
    title: "Enviar inspector al punto critico",
    trigger: "No hay evidencia reciente o el GPS se aleja del frente de obra.",
    impact: "Reduce visitas innecesarias y prioriza territorio.",
    actions: ["Generar ruta de inspeccion", "Asignar responsable", "Solicitar carga desde app mobile"],
    icon: MapPinned
  },
  {
    id: "evidencia",
    title: "Validar evidencia con IA",
    trigger: "Foto repetida, baja calidad o inconsistente con porcentaje informado.",
    impact: "Detecta avances declarados sin respaldo visual.",
    actions: ["Comparar contra ultima evidencia", "Marcar anomalia", "Pedir nueva captura"],
    icon: Camera
  },
  {
    id: "proveedor",
    title: "Escalar proveedor en riesgo",
    trigger: "Atrasos, reclamos o desviacion promedio fuera de rango.",
    impact: "Anticipa conflicto contractual antes de paralizacion.",
    actions: ["Enviar advertencia formal", "Revisar historial", "Preparar acta de seguimiento"],
    icon: ShieldAlert
  }
];

type AiActionCenterProps = {
  insights: ObraAiInsight[];
  providerRisks: Array<{ name: string; riskScore: number; recommendation: string }>;
};

export function AiActionCenter({ insights, providerRisks }: AiActionCenterProps) {
  const [selectedId, setSelectedId] = useState(playbooks[0].id);
  const selected = useMemo(() => playbooks.find((playbook) => playbook.id === selectedId) ?? playbooks[0], [selectedId]);
  const priority = insights[0];
  const provider = providerRisks[0];
  const Icon = selected.icon;

  return (
    <section className="ai-action-center">
      <div className="ai-action-head">
        <span className="eyebrow">Soluciones inmediatas con IA</span>
        <h2>Que puede resolver la plataforma en los proximos 10 minutos?</h2>
        <p>Playbooks operativos para obra publica y privada: riesgo, evidencia, pagos, proveedores y territorio.</p>
      </div>
      <div className="ai-live-strip">
        <article>
          <span>Obra prioritaria</span>
          <strong>{priority?.obraNombre ?? "Sin datos"}</strong>
          <small>{priority ? `${priority.riskScore}% riesgo IA / ${priority.certificateDecision}` : "Cargar datos para activar scoring"}</small>
        </article>
        <article>
          <span>Proveedor observado</span>
          <strong>{provider?.name ?? "Sin proveedor"}</strong>
          <small>{provider ? `${provider.riskScore}% riesgo / ${provider.recommendation}` : "Cargar historial de proveedores"}</small>
        </article>
      </div>
      <div className="ai-playbook-grid">
        <div className="ai-playbook-list">
          {playbooks.map((playbook) => {
            const PlaybookIcon = playbook.icon;
            return (
              <button className={playbook.id === selectedId ? "active" : ""} type="button" key={playbook.id} onClick={() => setSelectedId(playbook.id)}>
                <PlaybookIcon size={20} />
                <span>{playbook.title}</span>
              </button>
            );
          })}
        </div>
        <article className="ai-playbook-detail">
          <div className="ai-playbook-title">
            <Icon size={32} />
            <div>
              <strong>{selected.title}</strong>
              <span>{selected.trigger}</span>
            </div>
          </div>
          <p>{selected.impact}</p>
          <div className="ai-action-steps">
            {selected.actions.map((action, index) => (
              <div key={action}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{action}</strong>
              </div>
            ))}
          </div>
          <div className="ai-generated-output">
            <Bot size={20} />
            <div>
              <strong>Salida generada por IA</strong>
              <p>Orden operativa, mensaje al responsable e informe breve listos para enviar.</p>
            </div>
            <button type="button">
              <Send size={16} />
              Generar
            </button>
          </div>
        </article>
      </div>
      <div className="ai-solution-row">
        <span><FileWarning size={18} /> Control de certificados</span>
        <span><MessageSquareWarning size={18} /> Reclamos y redeterminaciones</span>
        <span><MapPinned size={18} /> Rutas de inspeccion</span>
      </div>
    </section>
  );
}
