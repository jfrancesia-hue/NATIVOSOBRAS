import { calcularDesvio, calcularSemaforo } from "@nativos/domain";

export function evaluarObra(input: {
  avanceFisico: number;
  montoEjecutado: number;
  presupuestoTotal: number;
  fechaFinEstimada?: string;
  ultimoAvance?: string | null;
}) {
  const financiero = calcularDesvio(input.avanceFisico, input.montoEjecutado, input.presupuestoTotal);
  const semaforo = calcularSemaforo(input.avanceFisico, input.montoEjecutado, input.presupuestoTotal);
  const alertas: Array<{ tipo: string; severidad: "verde" | "amarillo" | "rojo"; titulo: string; descripcion: string }> = [];

  if (semaforo === "rojo") {
    alertas.push({
      tipo: "sobrecosto",
      severidad: "rojo",
      titulo: "Ejecucion financiera adelantada",
      descripcion: `El avance financiero es ${financiero.avanceFinanciero}% y el avance fisico ${input.avanceFisico}%.`
    });
  }

  if (input.fechaFinEstimada && new Date(input.fechaFinEstimada) < new Date() && input.avanceFisico < 100) {
    alertas.push({
      tipo: "atraso",
      severidad: "amarillo",
      titulo: "Obra atrasada",
      descripcion: "La fecha fin estimada ya vencio y la obra no esta finalizada."
    });
  }

  if (input.ultimoAvance) {
    const dias = Math.floor((Date.now() - new Date(input.ultimoAvance).getTime()) / 86400000);
    if (dias > 14) {
      alertas.push({
        tipo: "sin_avances",
        severidad: "amarillo",
        titulo: "Sin avances recientes",
        descripcion: `La ultima carga de avance fue hace ${dias} dias.`
      });
    }
  }

  return { ...financiero, semaforo, alertas };
}

export function puntuarOferta(input: {
  monto: number;
  presupuestoReferencia: number;
  plazoDias: number;
  calificacionProveedor: number;
}) {
  const precioScore = input.presupuestoReferencia > 0 ? Math.max(0, 100 - (input.monto / input.presupuestoReferencia) * 60) : 0;
  const plazoScore = Math.max(0, 30 - input.plazoDias / 10);
  const proveedorScore = Math.min(10, input.calificacionProveedor);
  return Math.round((precioScore + plazoScore + proveedorScore) * 100) / 100;
}
