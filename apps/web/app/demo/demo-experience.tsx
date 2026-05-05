"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  Camera,
  CheckCircle2,
  FileText,
  MapPin,
  Printer,
  Radar,
  Smartphone,
  Truck
} from "lucide-react";

const works = [
  {
    id: "hospital",
    name: "Hospital Modular Norte",
    status: "Riesgo rojo",
    tone: "red",
    physical: 41,
    paid: 70,
    text: "Pagado 70%, avance fisico 41%. Desvio critico detectado.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/FEMA_-_44130_-_Construction_equipment_and_workers_repairing_a_road_in_Texas.jpg/900px-FEMA_-_44130_-_Construction_equipment_and_workers_repairing_a_road_in_Texas.jpg"
  },
  {
    id: "ruta",
    name: "Ruta Provincial 18",
    status: "En rango",
    tone: "green",
    physical: 52,
    paid: 48,
    text: "Avance fisico y financiero alineados, proveedor dentro del SLA.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Going-to-the-Sun_Road%2C_construction_crew_paving_around_milepost_33.jpg/900px-Going-to-the-Sun_Road%2C_construction_crew_paving_around_milepost_33.jpg"
  },
  {
    id: "cloacas",
    name: "Red Cloacal Este",
    status: "Observacion",
    tone: "yellow",
    physical: 38,
    paid: 54,
    text: "Sin evidencia reciente. Requiere seguimiento del inspector.",
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/A1%2C_Going-to-the-Sun_Road%2C_construction_crew%2C_Knife_River%2C_paving_below_East_Tunnel%2C_2011.jpg/900px-A1%2C_Going-to-the-Sun_Road%2C_construction_crew%2C_Knife_River%2C_paving_below_East_Tunnel%2C_2011.jpg"
  }
];

const flow = [
  { icon: Camera, title: "Evidencia GPS", text: "Foto, inspector, fecha y radio de geocerca." },
  { icon: Radar, title: "Comparacion automatica", text: "Fisico contra financiero y contrato." },
  { icon: BellRing, title: "Alerta ejecutiva", text: "Riesgo rojo con accion recomendada." },
  { icon: FileText, title: "Informe PDF", text: "Resumen listo para auditoria y cliente." }
];

export function DemoExperience() {
  const [activeId, setActiveId] = useState(works[0].id);
  const [alerts, setAlerts] = useState(3);
  const [percent, setPercent] = useState(46);
  const [photoReady, setPhotoReady] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [saved, setSaved] = useState(false);

  const active = useMemo(() => works.find((work) => work.id === activeId) ?? works[0], [activeId]);

  return (
    <main className="demo-product-page">
      <section className="demo-product-hero">
        <nav className="demo-product-nav">
          <a className="landing-brand" href="/">
            <span className="brand-mark">N</span>
            <span>Nativos Obras360</span>
          </a>
          <div>
            <a className="ghost-button" href="/dashboard">Tablero completo</a>
            <button className="button" type="button" onClick={() => window.print()}>
              <Printer size={18} />
              Imprimir demo
            </button>
          </div>
        </nav>

        <div className="demo-product-grid">
          <div className="demo-copy">
            <span className="eyebrow">Demo comercial interactiva</span>
            <h1>Una sala de control para vender transparencia, velocidad y control real.</h1>
            <p>
              Proba el mapa, cambia de obra, simula una alerta, carga una evidencia mobile y genera una salida de informe.
            </p>
            <div className="demo-hero-actions">
              <button className="button" type="button" onClick={() => setAlerts((value) => value + 1)}>
                <BellRing size={18} />
                Simular alerta
              </button>
              <a className="ghost-button" href="/login">Entrar a produccion</a>
            </div>
          </div>

          <div className="demo-command">
            <div className="demo-command-photo" style={{ backgroundImage: `url('${active.photo}')` }}>
              <span className={`demo-risk ${active.tone}`}>{active.status}</span>
              <button className="demo-pin one" type="button" onClick={() => setActiveId("hospital")} aria-label="Ver Hospital Modular Norte">
                <MapPin size={18} />
              </button>
              <button className="demo-pin two" type="button" onClick={() => setActiveId("ruta")} aria-label="Ver Ruta Provincial 18">
                <Truck size={18} />
              </button>
              <button className="demo-pin three" type="button" onClick={() => setActiveId("cloacas")} aria-label="Ver Red Cloacal Este">
                <MapPin size={18} />
              </button>
            </div>
            <div className="demo-command-card">
              <span className="eyebrow">Obra seleccionada</span>
              <h2>{active.name}</h2>
              <p>{active.text}</p>
              <div className="demo-bars">
                <label>Avance fisico <b>{active.physical}%</b></label>
                <span><i style={{ width: `${active.physical}%` }} /></span>
                <label>Ejecutado <b>{active.paid}%</b></label>
                <span><i className="orange" style={{ width: `${active.paid}%` }} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-studio">
        <div className="demo-kpis">
          <article><strong>18</strong><span>obras activas</span></article>
          <article><strong>47%</strong><span>avance promedio</span></article>
          <article><strong>$1.640M</strong><span>ejecutado</span></article>
          <article><strong>{alerts}</strong><span>alertas vivas</span></article>
        </div>

        <div className="demo-panels">
          <article className="demo-panel">
            <h2>Flujo que entiende el cliente</h2>
            <div className="demo-flow-compact">
              {flow.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title}>
                    <Icon size={22} />
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="demo-panel phone-panel">
            <div className="phone-shell compact">
              <div className="phone-top">Inspector / {active.name}</div>
              <div className="phone-body">
                <Smartphone size={24} />
                <strong>Cargar avance</strong>
                <p>Porcentaje informado: <b>{percent}%</b></p>
                <input type="range" min="0" max="100" value={percent} onChange={(event) => setPercent(Number(event.target.value))} />
                <div className="phone-pill-row">
                  <button className={photoReady ? "phone-pill done" : "phone-pill"} type="button" onClick={() => setPhotoReady(true)}>
                    {photoReady ? "Foto lista" : "Tomar foto"}
                  </button>
                  <button className={gpsReady ? "phone-pill done" : "phone-pill"} type="button" onClick={() => setGpsReady(true)}>
                    {gpsReady ? "GPS validado" : "Validar GPS"}
                  </button>
                </div>
                <button className="button" type="button" onClick={() => setSaved(true)}>
                  Guardar evidencia
                </button>
                {saved ? (
                  <div className="demo-save-ok">
                    <CheckCircle2 size={18} />
                    Evento registrado: {percent}% con foto y GPS.
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
