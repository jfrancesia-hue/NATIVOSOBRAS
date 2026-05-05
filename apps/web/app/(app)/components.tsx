export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="metric">{value}</div>
    </div>
  );
}

export function obraPinPosition(lat: number, lng: number) {
  const left = Math.min(88, Math.max(8, ((lng + 73) / 20) * 100));
  const top = Math.min(88, Math.max(8, ((lat + 22) / -34) * 100));
  return { left: `${left}%`, top: `${top}%` };
}
