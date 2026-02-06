# Day 1 Plan — Phase 1: Foundation + Champion Index

Target: 5 hours | Chunks 1.1–1.6

---

## Chunk 1.1 — Project Scaffolding (~30 min) ✅
- [x] Initialize Next.js (App Router) + TypeScript
- [x] Install and configure Tailwind CSS v4
- [x] Install and configure shadcn/ui
- [x] Install Supabase JS client (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Set up folder structure (`src/app`, `src/components`, `src/lib`, `src/types`, `scripts/`)
- [x] Initialize Git repo
- [x] Add `.gitignore` (include `node_modules/`, `.env.local`, `.next/`, etc.)
- [x] Add `.env.local.example` with placeholder keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [x] **Verify:** App runs on `localhost` with a blank page and no errors

## Chunk 1.2 — Dark Theme + Navbar (~45 min) ✅
- [x] Configure shadcn/ui dark theme with custom color palette (slate-900/950 backgrounds, gold/purple/red accents)
- [x] Build the top navbar component (logo left, nav links center, login button right)
- [x] Apply global dark styles, typography, and spacing
- _Note: Mobile hamburger menu deferred — desktop-first per Resolved Questions #3 in MASTERPLAN.md._
- [x] **Verify:** Every page shows the themed navbar on desktop.

## Chunk 1.3 — Data Layer (~30 min) ✅
> _Supabase deferred — using local JSON data for Day 1. Will wire up Supabase later._

- [x] Define TypeScript types for champions (`src/types/champion.ts`)
- [x] Create local data access layer (`src/lib/champions.ts`) reading from JSON
- [x] Create `src/data/` directory for local champion data
- [ ] _Deferred: Create Supabase project, tables, RLS policies, and helpers_

## Chunk 1.4 — Champion Data Seeding (~60-90 min) ✅
- [x] Research InTeleria / HellHades API endpoints and data formats
- [x] **Verify API accessibility first** — both APIs confirmed working
- [x] Build seeding script (`scripts/seed-champions.ts`)
- [x] Fetch, normalize, and merge champion data (InTeleria: 964 base stats, HellHades: 1021 ratings)
- [x] Seed 1002 unique champions to `src/data/champions.json` (964 with full stats + avatars, 39 with skills)
- [x] **Verify:** All champions in local JSON with stats populated.

## Chunk 1.5 — Champion Index Page (~45 min) ✅
- [x] Build `/champions` page — server component fetching all champions
- [x] Champion card component (avatar, name, rarity, faction, affinity, role)
- [x] Card grid layout
- [x] Text search input (filter by name)
- [x] Dropdown filters: Faction, Affinity, Rarity, Role (using shadcn/ui Select)
- [x] Pagination (paginated grid with page controls) to handle ~990+ champions without performance issues
- [x] **Verify:** Browse, search, filter, and paginate 1002 champions on `/champions`.

## Chunk 1.6 — Champion Detail Page (~45 min) ✅
- [x] Build `/champions/[slug]` page — server component fetching single champion
- [x] Display: avatar, name, faction, affinity, rarity, role
- [x] Stats table (6-star base stats)
- [x] Skills list with descriptions, multipliers, cooldowns
- [x] Ratings by content area (star display)
- [x] Placeholder sections for "Recommended Builds" and "Guides"
- [x] **Verify:** 1002 champion detail pages generated statically. Build clean.
