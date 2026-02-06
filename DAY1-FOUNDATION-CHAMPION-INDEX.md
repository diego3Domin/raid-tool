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

---

## Phase 2 — Auth + Roster + Team Builder

> _Supabase deferred — using mock auth + localStorage for all user data._

### Chunk 2.1 — Auth System ✅
- [x] Set up mock auth system (React Context + localStorage)
- [x] Build `/login` page with sign up / sign in forms
- [x] Auth state management (AuthProvider, useAuth hook)
- [x] Update navbar to show logged-in user / logout button
- [x] **Verify:** Users can sign up, log in, log out. Navbar reflects auth state.

### Chunk 2.2 — User Profile + Settings ✅
- [x] Build `/profile` page (protected route)
- [x] Display and edit: display name
- [x] Account settings (delete account — clears all localStorage)
- [x] **Verify:** Logged-in users can view and edit their profile.

### Chunk 2.3 — Roster: Schema + Add Champions ✅
- [x] Create RosterProvider with localStorage persistence (keyed per user)
- [x] Build `/roster` page (protected route)
- [x] Search-and-add flow: search champions by name, click to add to roster
- [x] Display roster as a grid of owned champions with remove button
- [x] **Verify:** Users can search for and add champions to their roster.

### Chunk 2.4 — Roster: Build Details ✅
- [x] Edit view for a rostered champion: stars, level, ascension
- [x] Gear section: select gear sets (toggle from 40+ set options)
- [x] Masteries section: placeholder (coming soon)
- [x] Skill books section: placeholder (coming soon)
- [x] **Verify:** Users can configure builds for any champion in their roster.

### Chunk 2.5 — Team Builder: Core ✅
- [x] Create TeamsProvider with localStorage persistence (keyed per user)
- [x] Build `/team-builder` page (works for all users, saving requires auth)
- [x] Content type selector: category → detail → stage (e.g., Dungeon → Dragon → 25)
- [x] Auto-set team size based on content type (10 content types configured)
- [x] Add champions to team slots via search
- [x] **Verify:** Users can create a team, pick content type, and add champions to slots.

### Chunk 2.6 — Team Builder: Speed Tune + AI ✅
- [x] Speed input per team slot
- [x] Visual turn order display based on champion speeds
- [x] AI synergy explanation — mock placeholder (Claude API deferred)
- [x] Generate and display synergy breakdown when team is built
- [x] Save / load teams
- [x] **Verify:** Full team builder with speed tuning and AI explanation placeholder.

### Chunk 2.7 — Dashboard ✅
- [x] Build `/` dashboard page
- [x] Logged out: featured champions (8 legendaries), quick links to Champions and Team Builder
- [x] Logged in: roster summary, saved teams, quick links
- [x] **Verify:** Dashboard shows relevant content based on auth state.

---

## Phase 3 — Guides, Tier Lists & Community

> _Supabase still deferred — using localStorage for all user data._

### Chunk 3.1 — Tier Lists: Curated ✅
- [x] Create tier list data layer (TierListsProvider + localStorage persistence)
- [x] Build `/tier-lists` page with Curated tab
- [x] Implement admin role checks (`admin_role` on User, `admin@raid.tool` email for testing)
- [x] Admin interface to create/edit tier lists (content area → search champion → assign tier S/A/B/C/D/F)
- [x] Public view: filter by content area, see champions grouped by tier
- [x] **Verify:** Admin can manage tier lists. Non-admin users see read-only view. Build clean.

### Chunk 3.2 — Tier Lists: Community Voted ✅
- [x] Add voting system (users vote on champion tier per content area)
- [x] Aggregate votes into community tier list view (majority vote per champion)
- [x] Display alongside curated list (tabs: Curated / Community)
- [x] **Verify:** Users can vote on champion tiers. Community list auto-generates from votes. Build clean.

### Chunk 3.3 — Guides: WYSIWYG Editor + Publishing ✅
- [x] Create guides data layer (GuidesProvider + localStorage persistence)
- [x] Build `/guides` page (list view with tag filtering, vote score, champion avatars)
- [x] Guide creation form with Tiptap rich text editor (bold, italic, headings, lists, blockquote, code)
- [x] Fields: title, champion (optional), tags, content body
- [x] **Verify:** Users can write and publish guides with rich text formatting. Build clean.

### Chunk 3.4 — Guides: Detail View + Community Interaction ✅
- [x] Guide detail page (`/guides/[id]`) with full HTML content display
- [x] Upvote/downvote system with visual indicators
- [x] Comments section with real-time posting
- [x] Link guides to champion detail pages (replaced placeholder on `/champions/[slug]`)
- [x] **Verify:** Users can read, vote on, and comment on guides. Guides linked from champion pages. Build clean.

---

## Phase 4 — Advanced Tools

### Chunk 4.1 — Gear Optimizer: Data Model + UI Shell ✅
- [x] Define gear data model (sets, slots, main stats, substats) — `src/lib/gear.ts` with 40+ gear sets, 6 slots, stat types
- [x] Build gear optimizer page shell — `/gear-optimizer`
- [x] Champion selector + stat priority inputs
- [x] **Verify:** UI in place for gear optimization, data model ready.

### Chunk 4.2 — Gear Optimizer: Recommendation Engine ✅
- [x] Build recommendation logic (match gear sets to stat priorities)
- [x] Display suggested gear sets with reasoning
- [x] Content-specific gear profiles (10 content areas with recommended sets)
- [x] **Verify:** Working gear suggestions based on champion and stat priorities.

### Chunk 4.3 — Clan Boss Calculator ✅
- [x] Build CB calculator page — `/clan-boss`
- [x] Advanced speed tune input (speeds, buffs, debuff considerations)
- [x] Damage estimation based on team comp and speeds
- [x] Turn order simulation (speed bar mechanics, 30 actions)
- [x] **Verify:** CB-specific calculator with damage estimates and speed tune suggestions.

### Chunk 4.4 — Fusion Tracker ✅
- [x] Build fusion tracker page — `/fusion-tracker`
- [x] Input current fusion event champions and requirements
- [x] Track progress (fragments collected, events completed)
- [x] Progress bars per requirement + overall fusion progress
- [x] **Verify:** Users can track their progress on active fusion events.
