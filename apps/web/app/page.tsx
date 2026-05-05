import { ArrowRight, BarChart3, Bot, BrainCircuit, CheckCircle2, FileText, HardHat, MapPinned, PauseCircle, ScanSearch, ShieldAlert, Sparkles, Smartphone, TrendingUp } from "lucide-react";
import { RoiCalculator } from "./roi-calculator";

const metrics = [
  { value: "IA", label: "prioriza obras con riesgo real antes de la crisis" },
  { value: "24/7", label: "copiloto ejecutivo para decisiones y auditoria" },
  { value: "GPS", label: "evidencia territorial validada automaticamente" }
];

const modules = [
  { kind: "brain", title: "Prediccion de desvios", text: "La IA cruza avance fisico, pagos, plazos y evidencia para anticipar riesgo presupuestario." },
  { kind: "scan", title: "Lectura de evidencia", text: "Fotos, GPS y comentarios se convierten en senales: avance probable, faltantes y anomalias." },
  { kind: "bot", title: "Copiloto ejecutivo", text: "El sistema sugiere acciones: pedir evidencia, pausar pagos, escalar auditoria o visitar obra." }
];

const aiUseCases = [
  { icon: BrainCircuit, title: "Semaforo predictivo", text: "No espera a que alguien revise una planilla: detecta patrones de atraso y sobre-ejecucion." },
  { icon: ScanSearch, title: "Auditoria asistida", text: "Resume evidencia, contratos y cambios para que un auditor entienda el caso en minutos." },
  { icon: TrendingUp, title: "Riesgo financiero", text: "Marca obras donde el dinero avanza mas rapido que el progreso fisico reportado." },
  { icon: Bot, title: "Proxima mejor accion", text: "Recomienda que hacer hoy: pedir foto, enviar inspector, bloquear certificado o informar autoridad." }
];

const immediateSolutions = [
  { icon: PauseCircle, title: "Pausar pagos con riesgo", text: "La IA propone frenar certificados cuando el avance financiero supera la evidencia fisica." },
  { icon: MapPinned, title: "Mandar inspector donde importa", text: "Prioriza recorridos segun riesgo, ausencia de fotos, distancia GPS y criticidad politica o contractual." },
  { icon: ShieldAlert, title: "Detectar proveedor problematico", text: "Cruza cumplimiento, reclamos, atrasos, desvio promedio y obras simultaneas." },
  { icon: FileText, title: "Generar informe listo", text: "Arma un resumen ejecutivo con evidencia, decisiones sugeridas y respaldo para auditoria." }
];

export default function LandingPage() {
  return (
    <main className="landing">
      <section className="hero">
        <header className="landing-nav">
          <a className="landing-brand" href="/">
            <span className="brand-mark">N</span>
            <span>Nativos Obras360</span>
          </a>
          <div className="landing-actions">
            <a href="/login">Ingresar</a>
            <a className="button" href="/dashboard">
              Abrir plataforma
              <ArrowRight size={18} />
            </a>
          </div>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow industrial">IA para obra publica / riesgo / evidencia / presupuesto</span>
            <h1>Que obra necesita atencion hoy?</h1>
            <p>
              Nativos Obras360 no es otro tablero para ordenar datos: es una capa de inteligencia que detecta
              desvios, interpreta evidencia y recomienda decisiones antes de que una obra se transforme en problema.
            </p>
            <div className="toolbelt" aria-label="Herramientas principales">
              <span><BrainCircuit size={18} /> IA predictiva</span>
              <span><ScanSearch size={18} /> Evidencia inteligente</span>
              <span><Sparkles size={18} /> Accion recomendada</span>
            </div>
            <div className="hero-cta">
              <a className="button hero-button" href="/login">
                Ingresar al sistema
                <ArrowRight size={18} />
              </a>
              <a className="ghost-button" href="#calculadora">Calcular ahorro</a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Vista previa del sistema">
            <div className="real-photo-card">
              <div className="photo-credit">Obra vial fiscalizada</div>
              <div className="floating-chip chip-camera">
                <span className="custom-icon mini camera-icon"><span /></span>
                Foto + GPS
              </div>
              <div className="floating-chip chip-alert">
                <span className="custom-icon mini alert-icon"><span /></span>
                Riesgo detectado
              </div>
            </div>

            <div className="command-center">
              <div className="command-top">
                <div>
                  <strong>Centro de control</strong>
                  <small>Operacion provincial</small>
                </div>
                <span className="live-pill"><HardHat size={14} /> en obra</span>
              </div>
              <div className="command-map">
                <span className="route route-a" />
                <span className="route route-b" />
                <span className="map-node node-red" />
                <span className="map-node node-green" />
                <span className="map-node node-yellow" />
                <div className="map-callout">
                  <MapPinned size={16} />
                  IA detecto riesgo
                  <strong>Pago 70% / avance 41%</strong>
                </div>
              </div>
              <div className="command-grid">
                <div>
                  <span>Riesgo IA</span>
                  <strong>92%</strong>
                </div>
                <div>
                  <span>Accion</span>
                  <strong>Auditar</strong>
                </div>
                <div>
                  <span>Ahorro estimado</span>
                  <strong className="rojo">$84M</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="construction-strip" aria-label="Obras reales monitoreadas">
        <article>
          <span>Vialidad</span>
          <strong>Seguimiento de rutas, puentes y pavimento</strong>
        </article>
        <article>
          <span>Infraestructura urbana</span>
          <strong>Redes, hospitales, escuelas y saneamiento</strong>
        </article>
        <article>
          <span>Auditoria territorial</span>
          <strong>Foto, GPS, avance y contrato en una vista</strong>
        </article>
      </section>

      <section className="ai-command-band">
        <div className="section-heading">
          <span className="eyebrow">Diferencial real</span>
          <h2>La IA convierte una pila de datos de obra en decisiones concretas</h2>
          <p>El cliente no compra otro Excel: compra menos sorpresa, menos recorrido innecesario y mas control sobre certificados, evidencia y plazos.</p>
        </div>
        <div className="ai-command-layout">
          <div className="ai-photo-panel">
            <span>Analisis en campo</span>
            <strong>La foto, el GPS y el contrato hablan entre si.</strong>
          </div>
          <div className="ai-cards">
            {aiUseCases.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={24} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="immediate-solutions-band">
        <div className="section-heading">
          <span className="eyebrow">Soluciones que duelen hoy</span>
          <h2>Funciones para que el cliente diga: esto lo necesito esta semana</h2>
          <p>Obra publica y privada necesitan decidir rapido: pagar, frenar, visitar, intimar, justificar o informar.</p>
        </div>
        <div className="immediate-grid">
          {immediateSolutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <article key={solution.title}>
                <Icon size={28} />
                <h3>{solution.title}</h3>
                <p>{solution.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="client-problem-band">
        <div className="section-heading">
          <span className="eyebrow">Lo que resuelve</span>
          <h2>El problema no es organizar obras: es saber donde actuar primero</h2>
          <p>Obras360 transforma fotos, GPS, presupuesto, contratos y auditoria en alertas explicadas por IA.</p>
        </div>
        <div className="client-cards">
          <article>
            <span className="client-icon orange"><i className="tool-icon crane-tool" /></span>
            <h3>Gestion politica aumentada</h3>
            <p>Ministros e intendentes reciben prioridades explicadas: impacto, evidencia y accion sugerida.</p>
          </article>
          <article>
            <span className="client-icon cyan"><i className="tool-icon shovel-tool" /></span>
            <h3>Territorio inteligente</h3>
            <p>La app de campo no solo carga: valida ubicacion, evidencia minima y senales de avance.</p>
          </article>
          <article>
            <span className="client-icon blue"><i className="tool-icon blueprint-tool" /></span>
            <h3>Auditoria asistida</h3>
            <p>La IA arma una lectura del caso con eventos, evidencia, pagos y desvio probable.</p>
          </article>
        </div>
      </section>

      <section className="product-band" id="sistema">
        <div className="section-heading">
          <span className="eyebrow">Operacion inteligente</span>
          <h2>Del territorio al despacho, con IA mirando los desvios</h2>
          <p>Inspectores cargan evidencia; la IA prioriza riesgos y recomienda la siguiente accion.</p>
        </div>

        <div className="product-layout">
          <div className="dashboard-shot">
            <div className="shot-header">
              <span />
              <span />
              <span />
            </div>
            <div className="shot-kpis">
              <div><strong>18</strong><small>obras activas</small></div>
              <div><strong>47%</strong><small>avance promedio</small></div>
              <div><strong>$1.640M</strong><small>ejecutado</small></div>
            </div>
            <div className="risk-board">
              <div className="risk-card high">
                <span>Hospital Modular Norte</span>
                <strong>IA: 92% riesgo de sobre-ejecucion</strong>
                <small>Accion: auditar certificado</small>
              </div>
              <div className="risk-card mid">
                <span>Red Cloacal Este</span>
                <strong>IA: evidencia insuficiente</strong>
                <small>Accion: pedir foto + visita</small>
              </div>
              <div className="risk-card ok">
                <span>Ruta Provincial 18</span>
                <strong>IA: avance consistente</strong>
                <small>Accion: mantener frecuencia</small>
              </div>
            </div>
          </div>

          <div className="mobile-shot">
            <div className="mobile-top">
              <Smartphone size={18} />
              Inspector
            </div>
            <div className="mobile-card">
              <strong>Cargar avance</strong>
              <span>Foto interpretada por IA</span>
              <span>GPS dentro del radio</span>
              <span>Alerta si falta evidencia</span>
            </div>
            <button type="button">Guardar evidencia</button>
          </div>
        </div>
      </section>

      <RoiCalculator />

      <section className="module-band">
        {modules.map((module) => {
          return (
            <article key={module.title} className="module-item">
              <span className={`custom-icon ${module.kind}-icon`}><span /></span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          );
        })}
      </section>

      <section className="sales-flow-band">
        <div className="section-heading">
          <span className="eyebrow">Adopcion operativa</span>
          <h2>Un flujo de trabajo que el equipo entiende en cinco minutos</h2>
        </div>
        <div className="sales-flow">
          <div><BarChart3 size={24} /><strong>1. Tablero</strong><span>KPIs, mapa y criticidad.</span></div>
          <div><MapPinned size={24} /><strong>2. Detalle de obra</strong><span>Avance, presupuesto y alertas.</span></div>
          <div><Smartphone size={24} /><strong>3. Evidencia mobile</strong><span>Foto + GPS + timestamp.</span></div>
          <div><FileText size={24} /><strong>4. Informe PDF</strong><span>Resumen ejecutivo imprimible.</span></div>
        </div>
      </section>

      <section className="closing-band">
        <div>
          <CheckCircle2 size={28} />
          <h2>Control presupuestario, transparencia y decision rapida en una sola plataforma.</h2>
        </div>
        <a className="button" href="/login">
          Ingresar al sistema
          <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}
