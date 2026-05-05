# Runbook operativo

## Incidente: la API responde 503 en `/ready`

1. Verificar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
2. Revisar disponibilidad del proyecto Supabase.
3. Confirmar que la tabla `tenants` existe y las migraciones fueron aplicadas.

## Incidente: inspector no puede cargar avances

1. Confirmar que el usuario tiene `profiles.role = inspector`.
2. Confirmar asignacion en `obra_inspectores`.
3. Revisar que la ubicacion este dentro de `MAX_AVANCE_DISTANCE_METERS`.
4. Confirmar permisos del bucket `avances-obra`.

## Incidente: dashboard vacio

1. Confirmar login y fila en `profiles`.
2. Validar que RLS permita ver obras del tenant.
3. Revisar que `NEXT_PUBLIC_DEMO_MODE=false` en produccion.
4. Ejecutar una consulta sobre `obras_resumen` con el usuario afectado.

## Mantenimiento semanal

- Revisar alertas activas con mas de 7 dias.
- Revisar proveedores con calificacion menor a 7.
- Exportar `audit_events` para respaldo externo si el organismo lo requiere.
- Verificar almacenamiento de fotos y crecimiento del bucket.
