import { ArrowRight, Banknote, Bot, Building2, Camera, CheckCircle2, ClipboardCheck, FileText, HardHat, MapPinned, PauseCircle, ScanSearch, ShieldAlert, TrendingUp } from "lucide-react";
import { constructionImages } from "@/lib/constructionImages";
import { RoiCalculator } from "./roi-calculator";

const metrics = [
  { value: "18", label: "obras activas monitoreadas" },
  { value: "$2.9B", label: "presupuesto bajo control" },
  { value: "6", label: "certificaciones observadas" },
  { value: "24/7", label: "trazabilidad tecnica y documental" }
];

const platformPillars = [
  { icon: Building2, title: "Seguimiento de obra", text: "Avance fisico, financiero, ubicacion y estado operativo en una vista clara." },
  { icon: Camera, title: "Evidencia verificable", text: "Fotos de campo, inspector, fecha, GPS y validacion para sostener cada certificacion." },
  { icon: Bot, title: "Copiloto tecnico", text: "Priorizacion de riesgos, obras sin inspeccion reciente y acciones recomendadas." },
  { icon: FileText, title: "Informe ejecutivo", text: "Resumen listo para autoridades, auditoria, comite tecnico o direccion de obra." }
];

const useCases = [
  { icon: PauseCircle, title: "Riesgo de sobrecertificacion", text: "Detecta cuando el avance financiero supera al avance fisico informado." },
  { icon: MapPinned, title: "Inspecciones priorizadas", text: "Ordena visitas por criticidad, evidencia pendiente, distancia y plazo contractual." },
  { icon: ShieldAlert, title: "Proveedor observado", text: "Cruza cumplimiento, desvios recurrentes y desempeno historico de empresas." },
  { icon: ScanSearch, title: "Auditoria asistida", text: "Convierte fotos, alertas y eventos en una lectura tecnica accionable." }
];

export default function LandingPage() {
  return (
    <main className="public-site">
      <section className="public-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 36, 55, 0.9), rgba(15, 36, 55, 0.42)), url(${constructionImages.heroObraPublica})` }}>
        <header className="public-nav">
          <a className="public-brand" href="/">
            <span><HardHat size={20} /></span>
            <strong>Nativos Obras360</strong>
          </a>
          <nav>
            <a href="#plataforma">Plataforma</a>
            <a href="#ia">IA tecnica</a>
            <a href="#calculadora">ROI</a>
          </nav>
          <div className="public-actions">
            <a href="/login">Ingresar</a>
            <a className="button" href="/dashboard">Abrir plataforma <ArrowRight size={18} /></a>
          </div>
        </header>

        <div className="public-hero-content">
          <div>
            <span className="eyebrow">GovTech + construccion + auditoria</span>
            <h1>Control inteligente de obras publicas y privadas</h1>
            <p>
              Seguimiento fisico, financiero y documental para que cada peso invertido se traduzca en avance real,
              con evidencia de campo, alertas claras e informes ejecutivos.
            </p>
            <div className="public-hero-actions">
              <a className="button" href="/login">Ingresar al sistema <ArrowRight size={18} /></a>
              <a className="ghost-button" href="/informe">Generar informe</a>
            </div>
          </div>

          <aside className="public-control-card">
            <div className="public-card-top">
              <span>Obra observada</span>
              <strong>Hospital Modular Norte</strong>
            </div>
            <div className="public-progress-pair">
              <label>Avance fisico <b>41%</b></label>
              <div><span style={{ width: "41%" }} /></div>
              <label>Avance financiero <b>70%</b></label>
              <div><span className="financial" style={{ width: "70%" }} /></div>
            </div>
            <div className="public-recommendation">
              <ShieldAlert size={20} />
              <div>
                <strong>Accion recomendada</strong>
                <p>Revisar certificacion, pedir evidencia GPS y enviar inspector.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="public-metrics">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="public-section public-split" id="plataforma">
        <div>
          <span className="eyebrow">Plataforma operativa</span>
          <h2>Una vista seria para ministerios, municipios y constructoras</h2>
          <p>
            Nativos Obras360 ordena el trabajo de inspeccion, auditoria y control presupuestario sin convertir
            la gestion en una planilla mas.
          </p>
          <div className="public-checks">
            <span><CheckCircle2 size={17} /> Avance fisico vs financiero</span>
            <span><CheckCircle2 size={17} /> Evidencia fotografica validada</span>
            <span><CheckCircle2 size={17} /> Alertas por riesgo operativo</span>
          </div>
        </div>
        <div className="public-photo-stack">
          <img src={constructionImages.inspectorCampo} alt="Inspector tecnico revisando una obra" />
          <article>
            <MapPinned size={22} />
            <strong>Inspeccion en campo</strong>
            <span>Foto, GPS, fecha y avance informado.</span>
          </article>
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-head">
          <span className="eyebrow">Componentes clave</span>
          <h2>Construccion real, datos claros y decisiones accionables</h2>
        </div>
        <div className="public-pillar-grid">
          {platformPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title}>
                <Icon size={24} />
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="public-section public-ia-band" id="ia">
        <div className="public-section-head">
          <span className="eyebrow">IA tecnica, no ciencia ficcion</span>
          <h2>Un copiloto operativo para saber que revisar hoy</h2>
          <p>La IA prioriza obras, certificaciones, proveedores y evidencias con lenguaje tecnico entendible.</p>
        </div>
        <div className="public-use-grid">
          {useCases.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={25} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <RoiCalculator />

      <section className="public-section public-report-preview">
        <div>
          <span className="eyebrow">Informe ejecutivo</span>
          <h2>Listo para ministro, intendente, auditoria o direccion de obra</h2>
          <p>Resumen de obras criticas, ahorro estimado, certificaciones observadas y proveedores en riesgo.</p>
        </div>
        <article>
          <div><Banknote size={20} /><strong>Ahorro estimado</strong><span>$84M</span></div>
          <div><TrendingUp size={20} /><strong>Brecha fisico-financiera</strong><span>+29%</span></div>
          <div><ClipboardCheck size={20} /><strong>Decision</strong><span>Auditar certificado</span></div>
        </article>
      </section>
    </main>
  );
}
