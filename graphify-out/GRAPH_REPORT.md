# Graph Report - IA  (2026-09-21)

## Corpus Check
- Corpus is ~20,972 words - fits in a single context window. You may not need a graph.

## Summary
- 394 nodes · 805 edges · 25 communities (17 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Entity Modals (Asset/Backup/Supplier)
- Package Dependencies
- Floor Plan & Port Tracing
- Local Agents & Integrations
- Kanban Board & Tickets
- App Shell & Routing
- Avatars & Reference Data
- TS App Config
- Initial Schema & Triggers
- TS Node Config
- Stats & Uptime Charts
- ERP Tables Migration
- Subtasks & Ports Migration
- Lint Config
- Docs & Map Migration
- Uptime Migration
- Uptime Agent Script
- Vite Env Types
- TS Project Refs
- Vite Icons
- Terra Cellars Branding
- Vercel Rewrites
- Categories Table
- Icon Sprite

## God Nodes (most connected - your core abstractions)
1. `react` - 20 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `TicketModal()` - 12 edges
5. `supabase` - 11 edges
6. `@tanstack/react-query` - 10 edges
7. `public.tickets` - 10 edges
8. `Terra Cellars Gestio IT (internal IT ticket app)` - 10 edges
9. `useAuth()` - 9 edges
10. `useAssets()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Supabase (agent data sink)` --semantically_similar_to--> `Supabase (Postgres + Auth)`  [INFERRED] [semantically similar]
  agents/README.md → README.md
- `Env vars SUPABASE_URL and SUPABASE_ANON_KEY` --semantically_similar_to--> `Env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY`  [INFERRED] [semantically similar]
  agents/uptime-agent/README.md → README.md
- `favicon.svg (Vite bolt icon)` --semantically_similar_to--> `vite.svg (Vite logo with parentheses)`  [INFERRED] [semantically similar]
  public/favicon.svg → src/assets/vite.svg
- `index.html (Vite HTML entry point)` --conceptually_related_to--> `Terra Cellars Gestio IT (internal IT ticket app)`  [INFERRED]
  index.html → README.md
- `src/main.tsx (React entry module)` --conceptually_related_to--> `Stack: React + Vite + TypeScript + Tailwind, TanStack Query, dnd-kit, Recharts`  [INFERRED]
  index.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Local agents sharing outbound-only Supabase pattern** — agents_uptime_agent_readme_uptime_agent, agents_navision_agent_readme_navision_agent, agents_unifi_agent_readme_unifi_agent, agents_readme_outbound_only_pattern [EXTRACTED 1.00]
- **Ticket app core data model tables** — readme_profiles_table, readme_requesters_table, readme_categories_table, readme_projects_table, readme_tickets_table [EXTRACTED 1.00]

## Communities (25 total, 8 thin omitted)

### Community 0 - "Entity Modals (Asset/Backup/Supplier)"
Cohesion: 0.09
Nodes (49): AssetModal(), BackupJobModal(), Modal(), SupplierModal(), useAssets(), useCreateAsset(), useDeleteAsset(), useUpdateAsset() (+41 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.05
Nodes (41): dependencies, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, react, react-dom, react-router-dom (+33 more)

### Community 2 - "Floor Plan & Port Tracing"
Cohesion: 0.11
Nodes (32): FloorPlanCanvas(), PinModal(), PinModalProps, PortsPanel(), useCreateMapPin(), useDeleteFloorPlan(), useDeleteMapPin(), useFloorPlanImageUrl() (+24 more)

### Community 3 - "Local Agents & Integrations"
Cohesion: 0.09
Nodes (37): external_metrics table (source=navision), Navision pending requirements (read-only service user, metrics definition, company name), NAV 2018 Web Services (OData v4 / SOAP), Navision agent (pending), Local network agents (agents folder), Outbound-only security pattern (HTTPS to Supabase, no inbound ports), Supabase (agent data sink), external_metrics table (source=unifi) (+29 more)

### Community 4 - "Kanban Board & Tickets"
Cohesion: 0.12
Nodes (26): date-fns, @dnd-kit/core, KanbanBoard(), TicketCard(), SubtasksPanel(), TicketModalProps, useCreateSubtask(), useDeleteSubtask() (+18 more)

### Community 5 - "App Shell & Routing"
Cohesion: 0.12
Nodes (26): react, react-dom, react-router-dom, @supabase/supabase-js, App(), RequireAuth(), src_assets_logo, Layout() (+18 more)

### Community 6 - "Avatars & Reference Data"
Cohesion: 0.16
Nodes (21): Avatar(), AVATAR_PALETTE, colorFor(), SIZE_CLASSES, TicketModal(), useCategories(), useCreateCategory(), useCreateRequester() (+13 more)

### Community 7 - "TS App Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "Initial Schema & Triggers"
Cohesion: 0.17
Nodes (15): auth.users, public.handle_new_user, public.handle_ticket_update, on_auth_user_created, on_ticket_update, public.categories, public.profiles, public.projects (+7 more)

### Community 9 - "TS Node Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - "Stats & Uptime Charts"
Cohesion: 0.17
Nodes (11): recharts, @tanstack/react-query, useUptimeDaily(), completedOn(), isSameDayLocal(), MonthView(), Period, PERIOD_LABELS (+3 more)

### Community 11 - "ERP Tables Migration"
Cohesion: 0.31
Nodes (9): public.requesters, assets_assigned_to_idx, assets_status_idx, assets_type_idx, public.assets, public.backup_jobs, public.suppliers, public.tickets (+1 more)

### Community 12 - "Subtasks & Ports Migration"
Cohesion: 0.36
Nodes (7): public.map_pins, map_pin_ports_connected_idx, map_pin_ports_pin_idx, public.map_pin_ports, public.ticket_subtasks, public.tickets, ticket_subtasks_ticket_idx

### Community 13 - "Lint Config"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 14 - "Docs & Map Migration"
Cohesion: 0.60
Nodes (4): public.assets, map_pins_floor_plan_idx, public.floor_plans, public.map_pins

### Community 15 - "Uptime Migration"
Cohesion: 0.50
Nodes (3): external_metrics_source_key_idx, public.external_metrics, public.uptime_daily

### Community 16 - "Uptime Agent Script"
Cohesion: 0.67
Nodes (3): CHECK_TARGETS, checkTarget(), main()

## Knowledge Gaps
- **106 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `CHECK_TARGETS` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 131 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Shell & Routing` to `Entity Modals (Asset/Backup/Supplier)`, `Package Dependencies`, `Floor Plan & Port Tracing`, `Kanban Board & Tickets`, `Avatars & Reference Data`, `Stats & Uptime Charts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `@tanstack/react-query` connect `Stats & Uptime Charts` to `Entity Modals (Asset/Backup/Supplier)`, `Package Dependencies`, `Floor Plan & Port Tracing`, `Kanban Board & Tickets`, `App Shell & Routing`, `Avatars & Reference Data`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Entity Modals (Asset/Backup/Supplier)` be split into smaller, more focused modules?**
  _Cohesion score 0.08708357685563997 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Should `Floor Plan & Port Tracing` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Should `Local Agents & Integrations` be split into smaller, more focused modules?**
  _Cohesion score 0.08858858858858859 - nodes in this community are weakly interconnected._