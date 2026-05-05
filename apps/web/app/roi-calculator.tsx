"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function RoiCalculator() {
  const [presupuesto, setPresupuesto] = useState(2800);
  const [ahorro, setAhorro] = useState(18);

  const resultado = useMemo(() => {
    const base = presupuesto * 1_000_000;
    return {
      ahorroEstimado: base * (ahorro / 100),
      recuperoMensual: (base * (ahorro / 100)) / 12
    };
  }, [presupuesto, ahorro]);

  return (
    <section className="roi-card" id="calculadora">
      <div>
        <span className="eyebrow">Calculadora ejecutiva</span>
        <h2>Cuanto puede recuperar una gestion con control temprano</h2>
        <p>Modelo simple para estimar ahorro potencial por deteccion de desvios, atrasos y sobre-ejecucion.</p>
      </div>

      <div className="roi-controls">
        <label>
          Presupuesto anual de obra publica
          <strong>{money.format(presupuesto * 1_000_000)}</strong>
          <input type="range" min="200" max="12000" step="100" value={presupuesto} onChange={(event) => setPresupuesto(Number(event.target.value))} />
        </label>
        <label>
          Ahorro estimado
          <strong>{ahorro}%</strong>
          <input type="range" min="5" max="30" step="1" value={ahorro} onChange={(event) => setAhorro(Number(event.target.value))} />
        </label>
      </div>

      <div className="roi-result">
        <span>Ahorro anual potencial</span>
        <strong>{money.format(resultado.ahorroEstimado)}</strong>
        <small>{money.format(resultado.recuperoMensual)} promedio mensual recuperable</small>
      </div>
    </section>
  );
}
