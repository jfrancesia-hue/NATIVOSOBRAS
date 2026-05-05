export type UserRole = "superadmin" | "ministro" | "inspector" | "proveedor" | "auditor";

export type ObraEstado = "planificada" | "en_ejecucion" | "pausada" | "finalizada";

export type Semaforo = "verde" | "amarillo" | "rojo";

export type Coordenada = {
  lat: number;
  lng: number;
};

export type Obra = {
  id: string;
  tenant_id: string;
  nombre: string;
  organismo_responsable: string;
  estado: ObraEstado;
  presupuesto_total: number;
  monto_ejecutado: number;
  avance_fisico: number;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  lat: number;
  lng: number;
};

export type AvanceObra = {
  id: string;
  obra_id: string;
  inspector_id: string;
  porcentaje: number;
  descripcion: string;
  foto_url: string;
  lat: number;
  lng: number;
  fecha: string;
};

export type Alerta = {
  id: string;
  obra_id: string;
  tipo: "sobrecosto" | "atraso" | "sin_avances" | "proveedor_riesgo";
  severidad: Semaforo;
  titulo: string;
  descripcion: string;
  activa: boolean;
  created_at: string;
};

export function calcularSemaforo(avanceFisico: number, montoEjecutado: number, presupuestoTotal: number): Semaforo {
  if (presupuestoTotal <= 0) return "amarillo";
  const avanceFinanciero = (montoEjecutado / presupuestoTotal) * 100;
  const desvio = avanceFinanciero - avanceFisico;
  if (avanceFinanciero > avanceFisico || desvio > 20) return "rojo";
  if (desvio > 10) return "amarillo";
  return "verde";
}

export function calcularDesvio(avanceFisico: number, montoEjecutado: number, presupuestoTotal: number) {
  const avanceFinanciero = presupuestoTotal > 0 ? (montoEjecutado / presupuestoTotal) * 100 : 0;
  return {
    avanceFinanciero: Math.round(avanceFinanciero * 10) / 10,
    desvio: Math.round((avanceFinanciero - avanceFisico) * 10) / 10
  };
}

export function redondear(valor: number, decimales = 2) {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

export function calcularDistanciaMetros(origen: Coordenada, destino: Coordenada) {
  const radioTierra = 6371000;
  const toRad = (valor: number) => (valor * Math.PI) / 180;
  const deltaLat = toRad(destino.lat - origen.lat);
  const deltaLng = toRad(destino.lng - origen.lng);
  const lat1 = toRad(origen.lat);
  const lat2 = toRad(destino.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return redondear(radioTierra * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), 1);
}

export function validarCargaEnSitio(obra: Coordenada, carga: Coordenada, radioPermitidoMetros: number) {
  const distanciaMetros = calcularDistanciaMetros(obra, carga);
  return {
    distanciaMetros,
    valida: distanciaMetros <= radioPermitidoMetros
  };
}
