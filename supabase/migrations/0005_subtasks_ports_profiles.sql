-- Terra Cellars · Gestio IT
-- Subtasques de tickets, ports de xarxa per traçar cablejat, i correccio de perfils

-- ---------------------------------------------------------------------------
-- Subtasques: petits passos dins d'un ticket (p.ex. "fer X" i despres "fer Y"
-- per arribar al mateix objectiu)
-- ---------------------------------------------------------------------------
create table public.ticket_subtasks (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index ticket_subtasks_ticket_idx on public.ticket_subtasks (ticket_id);

alter table public.ticket_subtasks enable row level security;

create policy "ticket_subtasks_all_authenticated" on public.ticket_subtasks
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Ports de xarxa: cada punt del mapa (switch, rack, presa ethernet, patch
-- panel...) pot tenir ports individuals. Cada port es pot connectar a un
-- altre port perque es pugui traçar per on passa cada cable (d'on ve, on va).
-- ---------------------------------------------------------------------------
create table public.map_pin_ports (
  id uuid primary key default gen_random_uuid(),
  pin_id uuid not null references public.map_pins (id) on delete cascade,
  port_label text not null,
  connected_port_id uuid references public.map_pin_ports (id) on delete set null,
  vlan text,
  notes text,
  created_at timestamptz not null default now(),
  unique (pin_id, port_label)
);

create index map_pin_ports_pin_idx on public.map_pin_ports (pin_id);
create index map_pin_ports_connected_idx on public.map_pin_ports (connected_port_id);

alter table public.map_pin_ports enable row level security;

create policy "map_pin_ports_all_authenticated" on public.map_pin_ports
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Perfils: permetre que qualsevol membre de l'equip pugui corregir el nom
-- d'un company (mateix nivell de confiança que la resta de taules), no nomes
-- el propi. Abans nomes es podia editar un mateix.
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_authenticated" on public.profiles
  for update to authenticated using (true) with check (true);

-- El trigger de nous usuaris feia servir l'email com a nom quan no hi havia
-- metadata; corregim els dos usuaris actuals (el nom es dedueix del seu propi
-- email corporatiu, no s'inventa cap dada nova).
update public.profiles set full_name = 'Jordi Ribellas' where email = 'jribellas@terracellars.es' and full_name = email;
update public.profiles set full_name = 'Xavier Martori' where email = 'xavier.martori@terracellars.es' and full_name = email;
