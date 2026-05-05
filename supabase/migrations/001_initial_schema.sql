create extension if not exists "pgcrypto";

create type public.user_role as enum ('superadmin', 'ministro', 'inspector', 'proveedor', 'auditor');
create type public.obra_estado as enum ('planificada', 'en_ejecucion', 'pausada', 'finalizada');
create type public.alerta_tipo as enum ('sobrecosto', 'atraso', 'sin_avances', 'proveedor_riesgo');
create type public.semaforo as enum ('verde', 'amarillo', 'rojo');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  jurisdiccion text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  nombre text not null,
  role public.user_role not null,
  proveedor_id uuid,
  created_at timestamptz not null default now()
);

create table public.proveedores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  razon_social text not null,
  cuit text not null,
  email text,
  calificacion numeric(4,2) not null default 0,
  cumplimiento numeric(5,2) not null default 0,
  desviacion_promedio numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (tenant_id, cuit)
);

alter table public.profiles
  add constraint profiles_proveedor_fk foreign key (proveedor_id) references public.proveedores(id);

create table public.obras (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  nombre text not null,
  organismo_responsable text not null,
  estado public.obra_estado not null default 'planificada',
  presupuesto_total numeric(14,2) not null check (presupuesto_total >= 0),
  monto_ejecutado numeric(14,2) not null default 0 check (monto_ejecutado >= 0),
  fecha_inicio date not null,
  fecha_fin_estimada date not null check (fecha_fin_estimada >= fecha_inicio),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  proveedor_id uuid references public.proveedores(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.obra_inspectores (
  obra_id uuid not null references public.obras(id) on delete cascade,
  inspector_id uuid not null references public.profiles(id) on delete cascade,
  primary key (obra_id, inspector_id)
);

create table public.avances_obra (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  inspector_id uuid not null references public.profiles(id),
  porcentaje numeric(5,2) not null check (porcentaje between 0 and 100),
  descripcion text not null,
  foto_url text not null,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  fecha timestamptz not null default now()
);

create table public.alertas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  obra_id uuid references public.obras(id) on delete cascade,
  tipo public.alerta_tipo not null,
  severidad public.semaforo not null,
  titulo text not null,
  descripcion text not null,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.licitaciones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  obra_id uuid not null references public.obras(id) on delete cascade,
  titulo text not null,
  fecha_cierre timestamptz not null,
  estado text not null default 'abierta',
  created_at timestamptz not null default now()
);

create table public.ofertas (
  id uuid primary key default gen_random_uuid(),
  licitacion_id uuid not null references public.licitaciones(id) on delete cascade,
  proveedor_id uuid not null references public.proveedores(id) on delete cascade,
  monto numeric(14,2) not null check (monto >= 0),
  plazo_dias integer not null check (plazo_dias > 0),
  puntaje numeric(6,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (licitacion_id, proveedor_id)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  ip inet,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.current_profile()
returns public.profiles
language sql stable
as $$
  select p from public.profiles p where p.id = auth.uid()
$$;

create or replace function public.current_role()
returns public.user_role
language sql stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql stable
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger obras_touch_updated_at
before update on public.obras
for each row execute function public.touch_updated_at();

create or replace view public.obras_resumen as
select
  o.*,
  coalesce(max(a.porcentaje), 0) as avance_fisico,
  case
    when o.presupuesto_total <= 0 then 0
    else round((o.monto_ejecutado / o.presupuesto_total) * 100, 2)
  end as avance_financiero,
  case
    when o.presupuesto_total > 0 and ((o.monto_ejecutado / o.presupuesto_total) * 100) - coalesce(max(a.porcentaje), 0) > 20 then 'rojo'::public.semaforo
    when o.presupuesto_total > 0 and ((o.monto_ejecutado / o.presupuesto_total) * 100) > coalesce(max(a.porcentaje), 0) then 'rojo'::public.semaforo
    when o.fecha_fin_estimada < current_date and o.estado <> 'finalizada' then 'amarillo'::public.semaforo
    else 'verde'::public.semaforo
  end as semaforo
from public.obras o
left join public.avances_obra a on a.obra_id = o.id
group by o.id;

alter view public.obras_resumen set (security_invoker = true);

create index obras_tenant_estado_idx on public.obras (tenant_id, estado);
create index obras_proveedor_idx on public.obras (proveedor_id);
create index avances_obra_fecha_idx on public.avances_obra (obra_id, fecha desc);
create index avances_inspector_fecha_idx on public.avances_obra (inspector_id, fecha desc);
create index alertas_tenant_activa_idx on public.alertas (tenant_id, activa, created_at desc);
create unique index alertas_obra_tipo_activa_unique_idx on public.alertas (obra_id, tipo) where activa;
create index proveedores_tenant_calificacion_idx on public.proveedores (tenant_id, calificacion desc);
create index audit_events_tenant_created_idx on public.audit_events (tenant_id, created_at desc);
create index licitaciones_tenant_estado_idx on public.licitaciones (tenant_id, estado, fecha_cierre);

create or replace function public.registrar_audit_event()
returns trigger language plpgsql security definer as $$
declare
  tenant uuid;
  entity_id uuid;
begin
  entity_id := coalesce(new.id, old.id);

  if tg_table_name in ('obras', 'proveedores') then
    tenant := coalesce(new.tenant_id, old.tenant_id);
  elsif tg_table_name = 'avances_obra' then
    select o.tenant_id into tenant
    from public.obras o
    where o.id = coalesce(new.obra_id, old.obra_id);
  end if;

  insert into public.audit_events (tenant_id, actor_id, action, entity, entity_id, metadata)
  values (tenant, auth.uid(), tg_op, tg_table_name, entity_id, jsonb_build_object('new', to_jsonb(new), 'old', to_jsonb(old)));
  return coalesce(new, old);
end;
$$;

create trigger audit_obras after insert or update or delete on public.obras
for each row execute function public.registrar_audit_event();

create trigger audit_avances after insert or update or delete on public.avances_obra
for each row execute function public.registrar_audit_event();

create trigger audit_proveedores after insert or update or delete on public.proveedores
for each row execute function public.registrar_audit_event();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.proveedores enable row level security;
alter table public.obras enable row level security;
alter table public.obra_inspectores enable row level security;
alter table public.avances_obra enable row level security;
alter table public.alertas enable row level security;
alter table public.licitaciones enable row level security;
alter table public.ofertas enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles own tenant" on public.profiles
for select using (tenant_id = public.current_tenant_id() or public.current_role() = 'superadmin');

create policy "tenant read" on public.tenants
for select using (id = public.current_tenant_id() or public.current_role() = 'superadmin');

create policy "obras tenant read" on public.obras
for select using (
  tenant_id = public.current_tenant_id()
  and (
    public.current_role() in ('superadmin', 'ministro', 'auditor')
    or exists (select 1 from public.obra_inspectores oi where oi.obra_id = id and oi.inspector_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.proveedor_id = obras.proveedor_id)
  )
);

create policy "obras admin write" on public.obras
for all using (public.current_role() in ('superadmin', 'ministro') and tenant_id = public.current_tenant_id())
with check (public.current_role() in ('superadmin', 'ministro') and tenant_id = public.current_tenant_id());

create policy "obra inspectores read" on public.obra_inspectores
for select using (
  public.current_role() in ('superadmin', 'ministro', 'auditor')
  or inspector_id = auth.uid()
);

create policy "obra inspectores admin write" on public.obra_inspectores
for all using (
  public.current_role() in ('superadmin', 'ministro')
  and exists (select 1 from public.obras o where o.id = obra_id and o.tenant_id = public.current_tenant_id())
)
with check (
  public.current_role() in ('superadmin', 'ministro')
  and exists (select 1 from public.obras o where o.id = obra_id and o.tenant_id = public.current_tenant_id())
);

create policy "avances read by tenant" on public.avances_obra
for select using (
  exists (select 1 from public.obras o where o.id = obra_id and o.tenant_id = public.current_tenant_id())
);

create policy "inspectores insert avances" on public.avances_obra
for insert with check (
  public.current_role() = 'inspector'
  and inspector_id = auth.uid()
  and exists (select 1 from public.obra_inspectores oi where oi.obra_id = obra_id and oi.inspector_id = auth.uid())
);

create policy "tenant read proveedores" on public.proveedores
for select using (tenant_id = public.current_tenant_id());

create policy "proveedores admin write" on public.proveedores
for all using (public.current_role() in ('superadmin', 'ministro') and tenant_id = public.current_tenant_id())
with check (public.current_role() in ('superadmin', 'ministro') and tenant_id = public.current_tenant_id());

create policy "tenant read alertas" on public.alertas
for select using (tenant_id = public.current_tenant_id());

create policy "admin manage alertas" on public.alertas
for all using (public.current_role() in ('superadmin', 'ministro', 'auditor') and tenant_id = public.current_tenant_id())
with check (public.current_role() in ('superadmin', 'ministro', 'auditor') and tenant_id = public.current_tenant_id());

create policy "tenant read licitaciones" on public.licitaciones
for select using (tenant_id = public.current_tenant_id());

create policy "admin manage licitaciones" on public.licitaciones
for all using (public.current_role() in ('superadmin', 'ministro') and tenant_id = public.current_tenant_id())
with check (public.current_role() in ('superadmin', 'ministro') and tenant_id = public.current_tenant_id());

create policy "proveedor insert ofertas" on public.ofertas
for insert with check (
  public.current_role() = 'proveedor'
  and exists (
    select 1 from public.licitaciones l
    join public.profiles p on p.id = auth.uid()
    where l.id = licitacion_id and l.tenant_id = public.current_tenant_id() and p.proveedor_id = proveedor_id
  )
);

create policy "tenant read ofertas" on public.ofertas
for select using (
  exists (select 1 from public.licitaciones l where l.id = licitacion_id and l.tenant_id = public.current_tenant_id())
);

create policy "auditoria read" on public.audit_events
for select using (tenant_id = public.current_tenant_id() and public.current_role() in ('superadmin', 'auditor'));

insert into storage.buckets (id, name, public)
values ('avances-obra', 'avances-obra', false)
on conflict (id) do nothing;

create policy "inspectores upload avances" on storage.objects
for insert with check (
  bucket_id = 'avances-obra'
  and public.current_role() = 'inspector'
  and exists (
    select 1
    from public.obra_inspectores oi
    where oi.obra_id::text = split_part(name, '/', 1)
      and oi.inspector_id = auth.uid()
  )
);

create policy "tenant read avance fotos" on storage.objects
for select using (
  bucket_id = 'avances-obra'
  and public.current_role() in ('superadmin', 'ministro', 'inspector', 'auditor')
  and exists (
    select 1
    from public.obras o
    where o.id::text = split_part(name, '/', 1)
      and o.tenant_id = public.current_tenant_id()
  )
);
