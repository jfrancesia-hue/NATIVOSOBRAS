import { ArrowRight, BarChart3, CheckCircle2, FileText, HardHat, Landmark, MapPinned, ShieldCheck, Smartphone } from "lucide-react";
import { RoiCalculator } from "./roi-calculator";

const metrics = [
  { value: "15-30%", label: "ahorro potencial en gasto operativo" },
  { value: "24/7", label: "trazabilidad de avances y auditoria" },
  { value: "GPS", label: "validacion territorial obligatoria" }
];

const modules = [
  { kind: "camera", title: "Avances con evidencia", text: "Fotos privadas, timestamp, GPS y porcentaje informado por inspector." },
  { kind: "alert", title: "Alertas automaticas", text: "Desvios entre avance fisico y financiero, atrasos y obras sin reporte." },
  { kind: "shield", title: "Auditoria total", text: "Registro de eventos por usuario, entidad y tenant con RLS activo." }
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
            <span className="eyebrow industrial">Obra publica / control territorial / presupuesto</span>
            <h1>Nativos Obras360</h1>
            <p>
              Una plataforma GovTech para que gobiernos provinciales y municipales vean en tiempo real si la plata
              ejecutada coincide con el avance fisico de cada obra.
            </p>
            <div className="toolbelt" aria-label="Herramientas principales">
              <span><i className="tool-icon helmet-tool" /> Seguridad</span>
              <span><i className="tool-icon cone-tool" /> Alertas</span>
              <span><i className="tool-icon ruler-tool" /> Medicion</span>
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
                  Hospital Modular Norte
                  <strong>Riesgo alto</strong>
                </div>
              </div>
              <div className="command-grid">
                <div>
                  <span>Avance fisico</span>
                  <strong>41%</strong>
                </div>
                <div>
                  <span>Ejecutado</span>
                  <strong>70%</strong>
                </div>
                <div>
                  <span>Desvio</span>
                  <strong className="rojo">+29%</strong>
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

      <section className="client-problem-band">
        <div className="section-heading">
          <span className="eyebrow">Lo que ve el cliente</span>
          <h2>El problema no es solo construir: es saber si lo pagado coincide con lo construido</h2>
          <p>Obras360 transforma fotos, GPS, presupuesto y auditoria en decisiones ejecutivas simples.</p>
        </div>
        <div className="client-cards">
          <article>
            <span className="client-icon orange"><i className="tool-icon crane-tool" /></span>
            <h3>Gestion politica</h3>
            <p>Ministros e intendentes ven criticidad, ahorro potencial y prioridades sin recorrer planillas.</p>
          </article>
          <article>
            <span className="client-icon cyan"><i className="tool-icon shovel-tool" /></span>
            <h3>Territorio</h3>
            <p>Inspectores cargan avances con foto, GPS obligatorio, timestamp y comentario tecnico.</p>
          </article>
          <article>
            <span className="client-icon blue"><i className="tool-icon blueprint-tool" /></span>
            <h3>Auditoria</h3>
            <p>Cada cambio queda trazado: quien, cuando, desde donde y sobre que obra.</p>
          </article>
        </div>
      </section>

      <section className="product-band" id="sistema">
        <div className="section-heading">
          <span className="eyebrow">Operacion completa</span>
          <h2>Del territorio al despacho, sin perder trazabilidad</h2>
          <p>Inspectores cargan evidencia desde el celular; ministros y auditores ven el riesgo en tiempo real.</p>
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
                <strong>41% avance / 70% ejecutado</strong>
                <small>Riesgo alto</small>
              </div>
              <div className="risk-card mid">
                <span>Red Cloacal Este</span>
                <strong>38% avance / 54% ejecutado</strong>
                <small>Observacion</small>
              </div>
              <div className="risk-card ok">
                <span>Ruta Provincial 18</span>
                <strong>52% avance / 48% ejecutado</strong>
                <small>En rango</small>
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
              <span>Foto validada</span>
              <span>GPS dentro del radio</span>
              <span>46% informado</span>
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
