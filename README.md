# Nativos Obras360

Plataforma GovTech para gestion, control y auditoria de obra publica en gobiernos provinciales y municipales de Argentina.

## Stack

- Web: Next.js App Router
- Mobile: Expo React Native
- Backend: Supabase PostgreSQL, Auth, Storage y RLS
- API segura: Node.js + Express
- Monorepo: pnpm workspaces

## Estructura

```txt
apps/
  api/       API Express para reglas de negocio y service role
  mobile/    App Expo para inspectores
  web/       Dashboard ejecutivo y gestion operativa
packages/
  domain/    Tipos y calculos compartidos
supabase/
  migrations/001_initial_schema.sql
  seed.sql
```

## Primer arranque

1. Instalar dependencias:

```bash
pnpm install
```

2. Copiar variables:

```bash
cp .env.example .env
```

3. Crear proyecto Supabase y ejecutar:

```bash
supabase db push
supabase db reset
```

4. Levantar servicios:

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:mobile
```

## Produccion

La guia de salida a produccion esta en [docs/PRODUCTION.md](docs/PRODUCTION.md).
El runbook operativo esta en [docs/RUNBOOK.md](docs/RUNBOOK.md).

Antes de publicar, configurar Supabase Auth, crear perfiles en `profiles`, cargar variables de entorno por ambiente y dejar `NEXT_PUBLIC_DEMO_MODE=false`.

## Experiencia comercial

- `/`: pagina de inicio comercial con propuesta de valor, calculadora de ahorro y acceso al sistema.
- `/dashboard`: tablero operativo conectado a Supabase cuando las variables de entorno estan configuradas.
- `/demo`: recorrido comercial opcional, no usado como flujo principal de produccion.
- `demo-interactiva.html`: respaldo standalone para presentaciones sin backend ni build.

## Modulos incluidos

- Gestion de obras con estado, ubicacion, presupuesto y organismo responsable.
- Control de avance por inspector con foto privada en Storage, GPS obligatorio, porcentaje y comentario.
- Comparacion automatica entre avance fisico y avance financiero.
- Alertas por sobrecosto, atraso y falta de avances recientes.
- Dashboard ejecutivo con KPIs, ranking critico y mapa operativo.
- Registro de proveedores, calificacion y base de licitaciones/ofertas.
- Auditoria total con tabla `audit_events`.
- Seguridad multi-tenant con roles y RLS en Supabase.
- Geocerca para cargas de avance: el backend rechaza reportes fuera del radio configurado por `MAX_AVANCE_DISTANCE_METERS`.

## Roles

- `superadmin`: control total.
- `ministro`: gestion y dashboard ejecutivo.
- `inspector`: carga avances solo en obras asignadas.
- `proveedor`: participa en licitaciones.
- `auditor`: lectura de trazabilidad y control.

## Nota de implementacion

La web solo muestra datos demo cuando `NEXT_PUBLIC_DEMO_MODE=true`. En produccion debe quedar en `false` y toda la informacion viene de Supabase con RLS activo.
