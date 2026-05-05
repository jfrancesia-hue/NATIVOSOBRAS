import { Activity, Camera, MapPinned, ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="auth-main">
      <section className="auth-shell">
        <div className="auth-visual">
          <a className="auth-brand" href="/">
            <span className="brand-mark">N</span>
            <span>Nativos Obras360</span>
          </a>
          <div className="auth-visual-copy">
            <span className="eyebrow">Acceso institucional</span>
            <h1>Control de obra publica con evidencia, alertas y auditoria.</h1>
            <p>Un ingreso seguro para equipos que necesitan ver avance fisico, ejecucion financiera y riesgos en tiempo real.</p>
          </div>
          <div className="auth-insight-card">
            <div>
              <span>Riesgo operativo</span>
              <strong>+29%</strong>
            </div>
            <div className="auth-mini-bars">
              <span><i style={{ width: "41%" }} /></span>
              <span><i className="orange" style={{ width: "70%" }} /></span>
            </div>
            <small>Hospital Modular Norte / evidencia requerida</small>
          </div>
          <div className="auth-feature-row">
            <span><Camera size={18} /> Foto + GPS</span>
            <span><MapPinned size={18} /> Geocerca</span>
            <span><ShieldCheck size={18} /> RLS activo</span>
          </div>
        </div>

        <div className="auth-card-side">
          <div className="auth-status">
            <span><Activity size={16} /> Plataforma operativa</span>
            <small>Produccion con Supabase Auth</small>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
