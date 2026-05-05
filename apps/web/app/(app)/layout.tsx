import { Bell, Building2, ClipboardCheck, FileText, Gauge, Images, LogOut, ShieldCheck } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Tablero", icon: Gauge },
  { href: "/obras", label: "Obras", icon: Building2 },
  { href: "/evidencias", label: "Evidencias", icon: Images },
  { href: "/proveedores", label: "Proveedores", icon: ClipboardCheck },
  { href: "/notificaciones", label: "Alertas", icon: Bell },
  { href: "/informe", label: "Informe", icon: FileText },
  { href: "/auditoria", label: "Auditoria", icon: ShieldCheck }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">N</span>
          <div>
            <strong>Nativos</strong>
            <small>Obras360</small>
          </div>
        </div>
        <div className="sidebar-command">
          <span className="sidebar-tool helmet-tool" />
          <div>
            <strong>Centro de obra</strong>
            <small>GPS / evidencia / presupuesto</small>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.href} href={item.href}>
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <a className="logout-link" href="/logout">
          <LogOut size={18} />
          Salir
        </a>
      </aside>
      <main className="app-main">{children}</main>
    </>
  );
}
