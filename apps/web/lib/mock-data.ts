export const obras = [
  {
    id: "demo-1",
    nombre: "Hospital Modular Norte",
    organismo_responsable: "Ministerio de Infraestructura",
    estado: "en_ejecucion",
    presupuesto_total: 980000000,
    monto_ejecutado: 690000000,
    avance_fisico: 41,
    avance_financiero: 70.4,
    semaforo: "rojo",
    lat: -34.6037,
    lng: -58.3816
  },
  {
    id: "demo-2",
    nombre: "Ruta Provincial 18",
    organismo_responsable: "Vialidad Provincial",
    estado: "en_ejecucion",
    presupuesto_total: 1510000000,
    monto_ejecutado: 720000000,
    avance_fisico: 52,
    avance_financiero: 47.7,
    semaforo: "verde",
    lat: -32.8895,
    lng: -68.8458
  },
  {
    id: "demo-3",
    nombre: "Red Cloacal Este",
    organismo_responsable: "Municipio",
    estado: "pausada",
    presupuesto_total: 430000000,
    monto_ejecutado: 230000000,
    avance_fisico: 38,
    avance_financiero: 53.5,
    semaforo: "rojo",
    lat: -31.4201,
    lng: -64.1888
  }
];

export const alertas = [
  { id: "a1", obra_id: "demo-1", severidad: "rojo", titulo: "Ejecucion financiera adelantada", descripcion: "Hospital Modular Norte: pagado 70%, avance 41%." },
  { id: "a2", obra_id: "demo-3", severidad: "amarillo", titulo: "Sin avances recientes", descripcion: "Red Cloacal Este no registra avances hace 18 dias." },
  { id: "a3", obra_id: "demo-3", severidad: "rojo", titulo: "Obra pausada con presupuesto activo", descripcion: "Red Cloacal Este mantiene pagos recientes sin avances fisicos." }
];

export const proveedores = [
  { razon_social: "Constructora Andina SA", cuit: "30-70111222-8", calificacion: 8.7, cumplimiento: 91, desviacion_promedio: 6.4, obras: 12 },
  { razon_social: "InfraSur SRL", cuit: "30-70999111-4", calificacion: 6.2, cumplimiento: 72, desviacion_promedio: 18.9, obras: 5 },
  { razon_social: "Obras del Litoral SA", cuit: "30-71555444-2", calificacion: 7.8, cumplimiento: 84, desviacion_promedio: 9.1, obras: 8 }
];

export const evidencias = [
  {
    id: "ev-1",
    obra_id: "demo-1",
    porcentaje: 41,
    fecha: "2026-05-05 11:40",
    inspector: "Mariana Quiroga",
    descripcion: "Estructura principal completada parcialmente. Sector B con demora de materiales.",
    lat: -34.6038,
    lng: -58.3815,
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/FEMA_-_44130_-_Construction_equipment_and_workers_repairing_a_road_in_Texas.jpg/640px-FEMA_-_44130_-_Construction_equipment_and_workers_repairing_a_road_in_Texas.jpg"
  },
  {
    id: "ev-2",
    obra_id: "demo-1",
    porcentaje: 36,
    fecha: "2026-04-28 09:18",
    inspector: "Mariana Quiroga",
    descripcion: "Hormigonado de base y replanteo de instalaciones sanitarias.",
    lat: -34.6039,
    lng: -58.3812,
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/A1%2C_Going-to-the-Sun_Road%2C_construction_crew%2C_Knife_River%2C_paving_below_East_Tunnel%2C_2011.jpg/640px-A1%2C_Going-to-the-Sun_Road%2C_construction_crew%2C_Knife_River%2C_paving_below_East_Tunnel%2C_2011.jpg"
  },
  {
    id: "ev-3",
    obra_id: "demo-2",
    porcentaje: 52,
    fecha: "2026-05-04 09:15",
    inspector: "Diego Salvatierra",
    descripcion: "Avance de carpeta asfaltica en tramo central.",
    lat: -32.8896,
    lng: -68.8457,
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Going-to-the-Sun_Road%2C_construction_crew_paving_around_milepost_33.jpg/640px-Going-to-the-Sun_Road%2C_construction_crew_paving_around_milepost_33.jpg"
  }
];

export const notificaciones = [
  { id: "n1", tipo: "whatsapp", titulo: "Mensaje a inspector", detalle: "Solicitar evidencia nueva en Hospital Modular Norte", estado: "pendiente" },
  { id: "n2", tipo: "email", titulo: "Informe semanal", detalle: "Enviar resumen ejecutivo al Ministerio", estado: "programado" },
  { id: "n3", tipo: "alerta", titulo: "Escalar riesgo rojo", detalle: "Notificar a auditoria por desvio mayor al 20%", estado: "activo" }
];
