-- Terra Cellars · Gestio IT
-- Modul d'actius (inclou equips de xarxa), ampliacio d'empleats, backups i proveidors

-- ---------------------------------------------------------------------------
-- requesters -> ampliacio a "empleats"
-- ---------------------------------------------------------------------------
alter table public.requesters
  add column position text,
  add column ad_username text,
  add column start_date date,
  add column end_date date,
  add column employment_status text not null default 'actiu'
    check (employment_status in ('actiu', 'baixa', 'alta_en_proces', 'baixa_en_proces'));

-- ---------------------------------------------------------------------------
-- assets: inventari d'actius, inclou equips de xarxa
-- ---------------------------------------------------------------------------
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'altres' check (
    type in ('servidor', 'pc', 'impressora', 'nvr', 'switch', 'router', 'punt_acces', 'firewall', 'altres')
  ),
  brand text,
  model text,
  serial_number text,
  location text,
  status text not null default 'actiu' check (status in ('actiu', 'en_reparacio', 'de_baixa', 'en_estoc')),
  ip_address text,
  vlan text,
  purchase_date date,
  warranty_until date,
  assigned_to uuid references public.requesters (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index assets_type_idx on public.assets (type);
create index assets_status_idx on public.assets (status);
create index assets_assigned_to_idx on public.assets (assigned_to);

-- ---------------------------------------------------------------------------
-- backup_jobs: seguiment de backups i continuitat
-- ---------------------------------------------------------------------------
create table public.backup_jobs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  asset_id uuid references public.assets (id) on delete set null,
  frequency text not null default 'diaria' check (frequency in ('diaria', 'setmanal', 'mensual')),
  backup_type text not null default 'complet' check (backup_type in ('complet', 'incremental')),
  destination text,
  last_success_at timestamptz,
  last_status text not null default 'pendent' check (last_status in ('exit', 'error', 'pendent')),
  retention_notes text,
  responsible uuid references public.requesters (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- suppliers: proveidors i el seu contracte principal
-- ---------------------------------------------------------------------------
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'altres' check (
    category in ('isp', 'manteniment_hardware', 'software', 'neteja', 'seguretat', 'altres')
  ),
  contact_name text,
  phone text,
  email text,
  contract_start date,
  contract_end date,
  renewal_notice_days integer,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tickets: vincles opcionals a actiu, proveidor i backup
-- ---------------------------------------------------------------------------
alter table public.tickets
  add column asset_id uuid references public.assets (id) on delete set null,
  add column supplier_id uuid references public.suppliers (id) on delete set null,
  add column backup_job_id uuid references public.backup_jobs (id) on delete set null;

create index tickets_asset_idx on public.tickets (asset_id);

-- ---------------------------------------------------------------------------
-- RLS: mateix criteri que la resta de l'app (equip IT intern de confianca)
-- ---------------------------------------------------------------------------
alter table public.assets enable row level security;
alter table public.backup_jobs enable row level security;
alter table public.suppliers enable row level security;

create policy "assets_all_authenticated" on public.assets
  for all to authenticated using (true) with check (true);

create policy "backup_jobs_all_authenticated" on public.backup_jobs
  for all to authenticated using (true) with check (true);

create policy "suppliers_all_authenticated" on public.suppliers
  for all to authenticated using (true) with check (true);
