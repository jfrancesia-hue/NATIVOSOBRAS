import { Bell, Mail, MessageCircle, Siren } from "lucide-react";
import { getNotificaciones } from "@/lib/data";
import { EmptyState, PageHeader } from "../components";

const iconByTipo = {
  whatsapp: MessageCircle,
  email: Mail,
  alerta: Siren
};

export default async function NotificacionesPage() {
  const notificaciones = await getNotificaciones();

  return (
    <>
      <PageHeader
        eyebrow="Centro de alertas"
        title="Prioridades, impacto y accion recomendada"
        description="Semaforo claro para escalar riesgos de obra, pedir evidencia y sostener decisiones tecnicas con trazabilidad."
      />
      <section className="notification-grid">
        {notificaciones.length === 0 ? (
          <EmptyState title="Sin alertas para notificar" description="Las notificaciones operativas se generan desde alertas activas del tenant." />
        ) : null}
        {notificaciones.map((notificacion) => {
          const Icon = iconByTipo[notificacion.tipo as keyof typeof iconByTipo] ?? Bell;
          return (
            <article className={`notification-card ${notificacion.tipo}`} key={notificacion.id}>
              <span className="notification-icon"><Icon size={22} /></span>
              <div>
                <strong>{notificacion.titulo}</strong>
                <p>{notificacion.detalle}</p>
                <small>Causa: desvio operativo / Impacto: decision pendiente / Accion: {notificacion.estado}</small>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
