-- Terra Cellars · Gestio IT
-- Schema inicial: perfils, sol·licitants, categories, projectes i tickets

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: un per cada usuari de Supabase Auth (personal IT amb login)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null default 'tecnic' check (role in ('admin', 'tecnic')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Crea automaticament un perfil quan es dona d'alta un usuari a Supabase Auth
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'tecnic',
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- requesters: usuaris interns que demanen feina (sense login)
-- ---------------------------------------------------------------------------
create table public.requesters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- categories: etiquetes a grans trets (Xarxa, AD, Azure, M365, Impressores...)
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#5C1F2E'
);

-- ---------------------------------------------------------------------------
-- projects: agrupacio opcional de tickets
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'actiu' check (status in ('actiu', 'pausat', 'tancat')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tickets: tasca o incidencia
-- ---------------------------------------------------------------------------
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null default 'tasca' check (type in ('tasca', 'incidencia')),
  priority text not null default 'mitjana' check (priority in ('baixa', 'mitjana', 'alta', 'urgent')),
  status text not null default 'pendent' check (status in ('pendent', 'en_curs', 'bloquejat', 'fet', 'cancelat')),
  category_id uuid references public.categories (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  requester_id uuid references public.requesters (id) on delete set null,
  assigned_to uuid references public.profiles (id) on delete set null,
  due_date date,
  planned_date date,
  estimated_minutes integer,
  actual_minutes integer,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index tickets_status_idx on public.tickets (status);
create index tickets_planned_date_idx on public.tickets (planned_date);
create index tickets_due_date_idx on public.tickets (due_date);
create index tickets_requester_idx on public.tickets (requester_id);
create index tickets_category_idx on public.tickets (category_id);

-- Manté updated_at i completed_at al dia
create function public.handle_ticket_update()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if new.status = 'fet' and old.status is distinct from 'fet' then
    new.completed_at = now();
  elsif new.status is distinct from 'fet' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

create trigger on_ticket_update
  before update on public.tickets
  for each row execute procedure public.handle_ticket_update();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Equip IT intern i de confiança: qualsevol usuari autenticat pot llegir i
-- gestionar tot el contingut operatiu. Els perfils nomes els pot editar
-- el propi usuari (el rol s'administra manualment des del panell de Supabase).
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.requesters enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.tickets enable row level security;

create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "requesters_all_authenticated" on public.requesters
  for all to authenticated using (true) with check (true);

create policy "categories_all_authenticated" on public.categories
  for all to authenticated using (true) with check (true);

create policy "projects_all_authenticated" on public.projects
  for all to authenticated using (true) with check (true);

create policy "tickets_all_authenticated" on public.tickets
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Dades inicials de categories habituals per a IT
-- ---------------------------------------------------------------------------
insert into public.categories (name, color) values
  ('Xarxa', '#2563A6'),
  ('Active Directory', '#5C1F2E'),
  ('Azure', '#2F6F5E'),
  ('Microsoft 365', '#B7791F'),
  ('Impressores', '#656D76'),
  ('Servidors', '#B3261E'),
  ('Altres', '#2B3A45');
