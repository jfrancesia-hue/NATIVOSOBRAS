import { Activity, Building2, Camera, HardHat, MapPinned, ShieldCheck } from "lucide-react";
import { constructionImages } from "@/lib/constructionImages";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="auth-main">
      <section className="auth-shell">
        <div className="auth-visual" style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 36, 55, 0.26), rgba(15, 36, 55, 0.88)), url(${constructionImages.planosObra})` }}>
          <a className="auth-brand" href="/">
            <span className="brand-mark"><HardHat size={20} /></span>
            <span>Nativos Obras360</span>
          </a>
          <div className="auth-visual-copy">
            <span className="eyebrow">Acceso institucional</span>
            <h1>Gestion tecnica de obras con evidencia y control presupuestario.</h1>
            <p>Ingreso seguro para equipos de infraestructura, municipios, auditorias y constructoras.</p>
          </div>
          <div className="auth-insight-card">
            <div>
              <span>Riesgo de sobrecertificacion</span>
              <strong>+29%</strong>
            </div>
            <div className="auth-mini-bars">
              <span><i style={{ width: "41%" }} /></span>
              <span><i className="orange" style={{ width: "70%" }} /></span>
            </div>
            <small>Hospital Modular Norte / evidencia requerida</small>
          </div>
          <div className="auth-feature-row">
            <span><Building2 size={18} /> Obras</span>
            <span><Camera size={18} /> Foto + GPS</span>
            <span><MapPinned size={18} /> Geocerca</span>
            <span><ShieldCheck size={18} /> Auditoria</span>
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
