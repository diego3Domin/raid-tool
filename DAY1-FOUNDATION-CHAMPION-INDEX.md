# Day 1 Plan — Phase 1: Foundation + Champion Index

Target: 5 hours | Chunks 1.1–1.6

---

## Chunk 1.1 — Project Scaffolding (~30 min)
- [ ] Initialize Next.js (App Router) + TypeScript
- [ ] Install and configure Tailwind CSS v4
- [ ] Install and configure shadcn/ui
- [ ] Install Supabase JS client (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Set up folder structure (`src/app`, `src/components`, `src/lib`, `src/types`, `scripts/`)
- [ ] Initialize Git repo
- [ ] Add `.gitignore` (include `node_modules/`, `.env.local`, `.next/`, etc.)
- [ ] Add `.env.local.example` with placeholder keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] **Verify:** App runs on `localhost` with a blank page and no errors

## Chunk 1.2 — Dark Theme + Navbar (~45 min)
- [ ] Configure shadcn/ui dark theme with custom color palette (slate-900/950 backgrounds, gold/purple/red accents)
- [ ] Build the top navbar component (logo left, nav links center, login button right)
- [ ] Apply global dark styles, typography, and spacing
- _Note: Mobile hamburger menu deferred — desktop-first per Resolved Questions #3 in MASTERPLAN.md._
- [ ] **Verify:** Every page shows the themed navbar on desktop.

## Chunk 1.3 — Supabase Schema (~30 min)
> **BLOCKED: Needs user input** — Before starting this chunk, the user must create a Supabase project and provide the project URL + anon key. These go into `.env.local`.

- [ ] Create Supabase project (or connect to existing)
- [ ] Create tables: `champions`, `champion_stats`, `champion_skills`, `champion_ratings`
  - _Note: Exact column types, PKs, FKs, and indexes to be determined during implementation based on external data shape._
- [ ] Set up RLS policies (public read for champion tables)
- [ ] Configure `.env.local` with Supabase keys
- [ ] Wire up server and client Supabase helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
- [ ] **Verify:** Can query Supabase from the app. Tables exist and are accessible.

## Chunk 1.4 — Champion Data Seeding (~60-90 min) ⚠️ RISK
- [ ] Research InTeleria / HellHades API endpoints and data formats
- [ ] **Verify API accessibility first** — confirm endpoints return data and are not blocked/rate-limited before building the full pipeline
- [ ] Build seeding script (`scripts/seed-champions.ts`)
- [ ] Fetch, normalize, and upsert champion data (base info + stats + skills)
- [ ] Seed ~990+ champions into Supabase
- [ ] **Verify:** All champions in the database with stats and skills populated.

> **Fallback:** If external APIs are inaccessible or unreliable, seed 10–20 mock champions with representative data so Chunks 1.5 and 1.6 can proceed. Replace with real data once API issues are resolved.

## Chunk 1.5 — Champion Index Page (~45 min)
- [ ] Build `/champions` page — server component fetching all champions
- [ ] Champion card component (avatar, name, rarity, faction, affinity, role)
- [ ] Card grid layout
- [ ] Text search input (filter by name)
- [ ] Dropdown filters: Faction, Affinity, Rarity, Role (using shadcn/ui Select)
- [ ] Pagination (paginated grid with page controls) to handle ~990+ champions without performance issues
- [ ] **Verify:** Browse, search, filter, and paginate ~990 champions on `/champions`.

## Chunk 1.6 — Champion Detail Page (~45 min)
- [ ] Build `/champions/[slug]` page — server component fetching single champion
- [ ] Display: avatar, name, faction, affinity, rarity, role
- [ ] Stats table with star-level toggle
- [ ] Skills list with descriptions, multipliers, cooldowns
- [ ] Tier placements / ratings by content area
- [ ] Placeholder sections for "Recommended Builds" and "Guides"
- [ ] **Verify:** Click any champion card → full detail page with all data.
