-- Terra Cellars · Gestio IT
-- Uptime d'internet (registrat per un agent propi, sense dependre de tercers)
-- i una taula generica per metriques externes (Navision, UniFi) quan es connectin.

-- ---------------------------------------------------------------------------
-- uptime_daily: una fila per dia, actualitzada a cada comprovacio. Aixi la
-- taula no creix mai mes d'una fila/dia (no s'hi desa cada check individual).
-- ---------------------------------------------------------------------------
create table public.uptime_daily (
  day date primary key,
  checks_total integer not null default 0,
  checks_up integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.uptime_daily enable row level security;

create policy "uptime_daily_select" on public.uptime_daily
  for select to authenticated using (true);

-- Funcio atomica que fa servir l'agent per registrar cada comprovacio.
-- Nomes suma comptadors sobre la fila del dia (upsert), mai insereix files noves per check.
create or replace function public.record_uptime_check(is_up boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.uptime_daily (day, checks_total, checks_up)
  values (current_date, 1, case when is_up then 1 else 0 end)
  on conflict (day) do update
    set checks_total = public.uptime_daily.checks_total + 1,
        checks_up = public.uptime_daily.checks_up + (case when is_up then 1 else 0 end),
        updated_at = now();
end;
$$;

grant execute on function public.record_uptime_check(boolean) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- external_metrics: taula generica per desar xifres puntuals vingudes de
-- sistemes externs (Navision, UniFi...). No es defineixen camps de negoci
-- fixos perque encara no sabem exactament quines dades es demanaran.
-- ---------------------------------------------------------------------------
create table public.external_metrics (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('navision', 'unifi')),
  metric_key text not null,
  metric_value numeric,
  details jsonb,
  captured_at timestamptz not null default now()
);

create index external_metrics_source_key_idx on public.external_metrics (source, metric_key, captured_at desc);

alter table public.external_metrics enable row level security;

create policy "external_metrics_select" on public.external_metrics
  for select to authenticated using (true);

create policy "external_metrics_insert" on public.external_metrics
  for insert to anon, authenticated with check (true);
