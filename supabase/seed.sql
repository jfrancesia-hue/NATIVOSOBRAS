insert into public.tenants (id, nombre, jurisdiccion)
values ('00000000-0000-0000-0000-000000000001', 'Provincia Demo', 'Argentina')
on conflict do nothing;

insert into public.proveedores (id, tenant_id, razon_social, cuit, email, calificacion, cumplimiento, desviacion_promedio)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Constructora Andina SA', '30-70111222-8', 'licitaciones@andina.example', 8.7, 91, 6.4),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'InfraSur SRL', '30-70999111-4', 'ofertas@infrasur.example', 6.2, 72, 18.9)
on conflict do nothing;

insert into public.obras (id, tenant_id, nombre, organismo_responsable, estado, presupuesto_total, monto_ejecutado, fecha_inicio, fecha_fin_estimada, lat, lng, proveedor_id)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Hospital Modular Norte', 'Ministerio de Infraestructura', 'en_ejecucion', 980000000, 690000000, '2026-02-01', '2026-11-30', -34.6037, -58.3816, '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ruta Provincial 18', 'Vialidad Provincial', 'en_ejecucion', 1510000000, 720000000, '2026-01-15', '2026-10-15', -32.8895, -68.8458, '10000000-0000-0000-0000-000000000002')
on conflict do nothing;
