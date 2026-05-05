# Produccion

## Ambientes

Crear tres proyectos Supabase separados:

- `dev`
- `staging`
- `production`

No reutilizar `SUPABASE_SERVICE_ROLE_KEY` entre ambientes. La service role vive solo en `apps/api`.

Despues del primer `pnpm install`, commitear `pnpm-lock.yaml` y cambiar CI/Docker/Vercel a `--frozen-lockfile`.

## Supabase

1. Aplicar migraciones:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

2. Crear usuarios desde Supabase Auth.
3. Insertar su fila en `profiles` con `tenant_id` y `role`.
4. Crear asignaciones en `obra_inspectores` para inspectores.
5. Confirmar que el bucket `avances-obra` existe y no es publico.
6. Mantener el formato de objetos `obra_id/inspector_id/timestamp.jpg`; la API valida ese path antes de registrar avances.

## API

Variables requeridas:

```txt
NODE_ENV=production
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
API_PORT=4000
API_CORS_ORIGINS=https://app.tudominio.gob.ar
```

Endpoints publicos:

- `GET /health`
- `GET /ready`

Todos los demas requieren `Authorization: Bearer <access_token>`.

## Web

Variables requeridas en Vercel:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_DEMO_MODE=false
```

Configurar Supabase Auth:

- Site URL: dominio de la web.
- Email signup deshabilitado para operacion institucional.
- Invitaciones o alta manual de usuarios.

## Mobile

Variables EAS:

```txt
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=
```

Build:

```bash
cd apps/mobile
eas build --profile production --platform android
eas build --profile production --platform ios
```

## Checklist antes de salir

- RLS habilitado en todas las tablas.
- Usuarios reales tienen `profiles`.
- No hay `NEXT_PUBLIC_DEMO_MODE=true` en produccion.
- CORS de API solo permite dominios oficiales.
- Storage `avances-obra` no es publico.
- Logs de API llegan al proveedor de observabilidad.
- Backups diarios de Supabase activados.
- `MAX_AVANCE_DISTANCE_METERS` calibrado por jurisdiccion y tipo de obra.
- Prueba end-to-end: login web, alta obra, asignacion inspector, carga mobile con foto/GPS, alerta generada.

## Operacion

El runbook de incidentes y mantenimiento queda en [RUNBOOK.md](RUNBOOK.md).
