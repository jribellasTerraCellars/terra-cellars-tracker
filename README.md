# Terra Cellars · Gestió IT

Aplicació interna per fer seguiment de tasques i incidències d'IT: tauler kanban amb drag & drop, vista de planificació diària i estadístiques (tasques completades per setmana, usuaris que més incidències obren).

Stack: React + Vite + TypeScript + Tailwind CSS, Supabase (Postgres + Auth), TanStack Query, dnd-kit, Recharts. Desplegat a Vercel des d'un repositori de GitHub.

## 1. Crear el projecte a Supabase

1. Ves a [supabase.com](https://supabase.com), crea un compte/organització si no en tens, i crea un projecte nou.
2. Un cop creat, ves a **SQL Editor** i executa el contingut de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). Això crea totes les taules, els triggers i les polítiques de seguretat (RLS), més unes categories inicials.
3. Ves a **Project Settings → Data API** i copia:
   - `Project URL`
   - `anon public` key
4. Crea els usuaris de l'equip IT a **Authentication → Users → Add user** (correu + contrasenya). En donar-se d'alta, es crea automàticament la seva fila a `profiles` (rol `tecnic` per defecte). Per fer algú `admin`, edita la columna `role` de `profiles` des de **Table Editor**.

## 2. Configurar les variables d'entorn en local

Copia `.env.local.example` a `.env.local` i emplena els valors del pas anterior:

```bash
cp .env.local.example .env.local
```

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. Executar en local

```bash
npm install
npm run dev
```

L'aplicació queda disponible a `http://localhost:5173`.

## 4. Desplegament (GitHub + Vercel)

1. Puja aquest projecte a un repositori de GitHub.
2. A [vercel.com](https://vercel.com), crea un projecte nou important aquest repositori (Vercel detecta Vite automàticament).
3. A **Settings → Environment Variables** del projecte de Vercel, afegeix `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY` amb els mateixos valors del pas 1.
4. Desplega. El fitxer [`vercel.json`](vercel.json) ja inclou la reescriptura necessària perquè les rutes de React Router funcionin correctament.

## Estructura

```
src/
  assets/        logo i recursos estàtics
  components/    Layout, Modal, TicketModal, KanbanBoard, TicketCard
  context/       AuthContext (sessió Supabase), ThemeContext (mode clar/fosc)
  hooks/         hooks de dades amb TanStack Query (tickets, requesters, categories, profiles)
  lib/           client de Supabase i constants de domini
  pages/         Login, Dashboard, Stats, Settings
  types/         tipus TypeScript del model de dades
supabase/
  migrations/    schema SQL inicial
```

## Model de dades

- **profiles**: personal IT amb login (creat automàticament en donar d'alta un usuari a Supabase Auth).
- **requesters**: usuaris interns que demanen feina (sense login).
- **categories**: etiquetes generals (Xarxa, AD, Azure, M365...).
- **projects**: agrupació opcional de tickets.
- **tickets**: tasca o incidència, amb tipus, prioritat, estat, categoria, projecte, sol·licitant, assignat, dates i temps estimat/real.
