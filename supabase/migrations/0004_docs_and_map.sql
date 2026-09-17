-- Terra Cellars · Gestio IT
-- Descripcio de categories + mapa interactiu de l'empresa (planols i punts)

alter table public.categories add column description text;

-- ---------------------------------------------------------------------------
-- floor_plans: planols pujats (planta, sala de servidors...)
-- ---------------------------------------------------------------------------
create table public.floor_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- map_pins: punts interactius sobre un planol (camera, switch, rack, presa
-- ethernet, punt wifi, taula, proveidor ISP, cablejat...)
-- ---------------------------------------------------------------------------
create table public.map_pins (
  id uuid primary key default gen_random_uuid(),
  floor_plan_id uuid not null references public.floor_plans (id) on delete cascade,
  type text not null default 'altres' check (
    type in ('camera', 'switch', 'rack', 'ethernet', 'wifi', 'taula', 'isp', 'cablejat', 'altres')
  ),
  label text not null,
  x_percent numeric not null check (x_percent >= 0 and x_percent <= 100),
  y_percent numeric not null check (y_percent >= 0 and y_percent <= 100),
  asset_id uuid references public.assets (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index map_pins_floor_plan_idx on public.map_pins (floor_plan_id);

alter table public.floor_plans enable row level security;
alter table public.map_pins enable row level security;

create policy "floor_plans_all_authenticated" on public.floor_plans
  for all to authenticated using (true) with check (true);

create policy "map_pins_all_authenticated" on public.map_pins
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage: bucket privat per als planols, nomes accessible per usuaris logats
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('floor-plans', 'floor-plans', false)
on conflict (id) do nothing;

create policy "floor_plans_storage_select" on storage.objects
  for select to authenticated using (bucket_id = 'floor-plans');

create policy "floor_plans_storage_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'floor-plans');

create policy "floor_plans_storage_update" on storage.objects
  for update to authenticated using (bucket_id = 'floor-plans');

create policy "floor_plans_storage_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'floor-plans');
