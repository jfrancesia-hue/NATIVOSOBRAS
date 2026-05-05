export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function KpiCard({ label, value, icon, tone = "default" }: { label: string; value: string | number; icon?: any; tone?: "default" | "warning" | "success" | "blue" }) {
  return (
    <div className={`card metric-card tone-${tone}`}>
      <span className="kpi-tool">{icon}</span>
      <div className="label">{label}</div>
      <div className="metric">{value}</div>
    </div>
  );
}

export function RiskBadge({ value }: { value: string }) {
  return (
    <span className={`risk-badge ${value}`}>
      <span className={`dot ${value}`} />
      {value}
    </span>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.replace("_", " ");
  return <span className={`status-badge ${value}`}>{normalized}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  children
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  children?: any;
}) {
  return (
    <section className={image ? "page-hero construction-hero" : "page-header premium-page-header"} style={image ? { backgroundImage: `linear-gradient(90deg, rgba(15, 36, 55, 0.86), rgba(15, 36, 55, 0.34)), url(${image})` } : undefined}>
      <div>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children ? <div className="header-actions">{children}</div> : null}
    </section>
  );
}

export function obraPinPosition(lat: number, lng: number) {
  const left = Math.min(88, Math.max(8, ((lng + 73) / 20) * 100));
  const top = Math.min(88, Math.max(8, ((lat + 22) / -34) * 100));
  return { left: `${left}%`, top: `${top}%` };
}
