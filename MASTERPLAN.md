# RAID: Shadow Legends - Tool Project Plan

## Vision

**RAID Tool** is an all-in-one companion toolkit for RAID: Shadow Legends players. It combines champion browsing, team building, account/roster management, and guides into a single, cohesive experience.

- **Audience:** Public community — any RAID player can use it.
- **Access model:** Open browsing for all reference content (champions, guides, comparisons). User accounts only required for saving personal data (rosters, builds, teams).
- **Core differentiator:** A smoother, more intuitive UX than existing tools. Easy to learn, easy to use. Existing tools (HellHades, AyumiLove, etc.) are functional but clunky and dated — RAID Tool prioritizes modern design and frictionless usability.


## Core Features

### Must-Haves (Launch)
1. **Champion Index** — Browse, search, and filter all champions with stats, skills, and ratings.
   - **Filters (dropdowns):** Faction, Affinity (Magic/Force/Spirit/Void), Rarity (Common–Legendary), Role (Attack/Defense/HP/Support)
   - **Text search** by champion name
   - **Champion images:** Hotlinked from external sources (InTeleria, wiki, etc.)
2. **Team Builder** — Build and save teams for specific game content. Includes speed tune turn order display.
   - **Content types:**
     - **Clan Boss** (per difficulty: Normal through Ultra-Nightmare)
     - **Hydra** (per difficulty)
     - **Chimera** (per difficulty)
     - **Dungeons** (Dragon, Spider, Fire Knight, Ice Golem, Minotaur — per stage, e.g., Dragon 25)
     - **Arena** (Offense / Defense)
     - **Doom Tower** (Normal / Hard, per floor/boss)
     - **Faction Wars** (per faction)
     - **Iron Twins** (per stage)
     - **Sand Devil** (per stage)
     - **Shogun** (per stage)
   - **Speed Tuning:** Visual turn order display based on champion speeds so users can verify their tune is correct.
   - **AI Explanations:** When a team or speed tune is suggested/built, an AI-generated explanation describes why the composition works — champion synergies, skill combos, buff/debuff chains, and why the turn order matters for that specific content.
   - **Champion source:** All champions by default, with a toggle to filter to "My Roster only."
   - **Team size:** Auto-set based on content type (CB=5, Hydra=6, Arena=4, etc.) with manual override. _Note: These sizes are approximate defaults — verify against current game data during implementation._
3. **My Roster** — Track which champions you own, their level, rank, gear, and masteries.
   - **Entry method:** Search by name and add one by one, then fill in build details.
   - **RSL Helper JSON import** (post-launch): Upload account export to auto-populate roster.
   - Manual edits always available on top of imported data.
4. **Guides / Tier Lists** — Champion ratings, build guides, and tier lists by content area.
   - **Tier Lists:** Official curated tier list (admin-maintained) + separate community-voted tier list.
   - **Guides:** Rich text editor (WYSIWYG) for creating build guides.

### Nice-to-Haves (Post-Launch)
5. **Gear Optimizer** — Suggest best gear sets for a champion based on stat priorities.
6. **Clan Boss Calculator** — Damage calculator and advanced speed tune suggestions for CB teams (extends the basic turn order display in Team Builder).
7. **Fusion Tracker** — Track progress on ongoing fusion events.
8. **Community Features** — User-submitted builds, ratings, comments, and voting.
9. **RSL Helper JSON Import** — Upload RSL Helper account export to auto-populate roster data.

## Champion Data

- **Approach:** Hybrid — seed from external community sources (InTeleria, HellHades APIs), then layer on our own ratings, guides, and metadata.
- **Freshness:** Critical — new champions should be available within days of release. Automated sync/scrape pipeline needed.
- **Previous version:** ~990 champions seeded from InTeleria + HellHades APIs.
- **Storage:** Own database with champion base data + custom fields (ratings, guides, tier placements, user-submitted builds).


## Tech Stack

- **Frontend:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (Postgres DB + Auth + Realtime + Storage)
- **ORM/Client:** Supabase JS client (direct DB access from Next.js server components + API routes)
- **AI:** Claude API (Anthropic) — generate team synergy explanations based on champion skills and composition context.
- **Deployment:** TBD (covered in Deployment section)


## Design / Theme

- **Theme:** Dark mode with gaming/medieval aesthetic (matches RAID's visual identity).
- **Component Library:** shadcn/ui (Radix + Tailwind) — consistent, accessible, fully customizable.
- **Typography & Colors:** TBD during implementation, but dark backgrounds with accent colors (golds, purples, reds) to fit the medieval/fantasy vibe.
- **Navigation:** Top navbar — logo/brand left, main nav links center (Champions, Team Builder, Roster, Tier Lists, Guides), login/profile right. Collapses to hamburger on mobile.


## Pages / Routes

| Route | Description |
|---|---|
| `/` | **Dashboard** — Featured champions, recent guides, roster summary (if logged in), quick links. |
| `/champions` | **Champion Index** — Browse, search, filter all champions. |
| `/champions/[slug]` | **Champion Detail** — Full stats, skills, ratings, recommended builds, tier placements. |
| `/team-builder` | **Team Builder** — Create and save teams by content area (dungeons, CB, arena, etc.). |
| `/roster` | **My Roster** — View and manage owned champions (requires auth). |
| `/tier-lists` | **Tier Lists** — Champion rankings by content area. |
| `/guides` | **Guides** — Build guides and strategy content. |
| `/profile` | **Profile / Settings** — Account settings, preferences (requires auth). |
| `/login` | **Login / Sign Up** — Supabase auth flow. |


## Data Model

### Champions (seeded from external sources)
- `id`, `name`, `slug`, `faction`, `affinity`, `rarity`, `role`, `avatar_url`
- **Stats** (per star level): HP, ATK, DEF, SPD, C.Rate, C.DMG, RES, ACC
- **Skills**: name, description, multiplier, cooldown, effects
- **Ratings** (`champion_ratings`): Numeric scores (e.g., 1–5) per content area, seeded from external data sources (InTeleria, HellHades). These are imported reference data.

### Users (Supabase Auth)
- `id`, `email`, `display_name`, `avatar_url`, `admin_role` (boolean, default false), `created_at`

### User Roster (per user, per champion)
- `user_id`, `champion_id`
- `stars`, `level`, `ascension`
- `gear` (set types + individual piece stats)
- `masteries` (selected mastery tree nodes)
- `skill_books` (books used per skill)

### Teams
- `id`, `user_id`, `name`
- `content_category` (e.g., "dungeon", "clan_boss", "hydra", "arena", "chimera", etc.)
- `content_detail` (e.g., "Dragon", "Ultra-Nightmare", "Offense")
- `content_stage` (e.g., 25, null for non-staged content)
- **Team Slots**: champion_id, position/role, speed, notes
- **Speed Tune**: calculated turn order based on slot speeds
- **AI Explanation**: generated synergy breakdown (why this team works, skill combos, buff/debuff chains)

### Guides
- `id`, `champion_id`, `author_id`, `title`, `content`, `build_recommendation`
- Tags, upvotes/downvotes

### Tier Lists
- `content_area`, `champion_id`, `tier` (S/A/B/C/D/F), `notes`
- _Distinct from `champion_ratings`: Tier lists are curated (admin) and community-voted S/A/B/C/D/F rankings maintained by us. Ratings are numeric scores imported from external sources._


## Deployment

- **Hosting:** Vercel (free tier) — best-in-class Next.js support, automatic SSL, edge network.
- **Database:** Supabase (free tier) — hosted Postgres.
- **CI/CD:** Manual deploys for now. Can add auto-deploy from GitHub later.
- **Domain:** TBD.


## Milestones (1-Hour Chunks)

Each chunk is a self-contained unit of work that can be built autonomously in ~1 hour.

---

### Phase 1 — Foundation + Champion Index

**Chunk 1.1 — Project Scaffolding**
- [ ] Initialize Next.js (App Router) + TypeScript
- [ ] Install and configure Tailwind CSS v4
- [ ] Install and configure shadcn/ui
- [ ] Install Supabase JS client (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Set up folder structure (`src/app`, `src/components`, `src/lib`, `src/types`, `scripts/`)
- [ ] Initialize Git repo
- [ ] Add `.gitignore` (include `node_modules/`, `.env.local`, `.next/`, etc.)
- [ ] Add `.env.local.example` with placeholder keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] **Verify:** App runs on `localhost` with a blank page and no errors

**Chunk 1.2 — Dark Theme + Navbar**
- [ ] Configure shadcn/ui dark theme with custom color palette (slate-900/950 backgrounds, gold/purple/red accents)
- [ ] Build the top navbar component (logo left, nav links center, login button right)
- [ ] Apply global dark styles, typography, and spacing
- _Note: Mobile hamburger menu deferred — desktop-first per Resolved Questions #3._
- [ ] **Verify:** Every page shows the themed navbar on desktop.

**Chunk 1.3 — Supabase Schema**
> **BLOCKED: Needs user input** — Before starting this chunk, the user must create a Supabase project and provide the project URL + anon key.

- [ ] Create Supabase project (or connect to existing)
- [ ] Create tables: `champions`, `champion_stats`, `champion_skills`, `champion_ratings`
  - _Note: Exact column types, PKs, FKs, and indexes to be determined during implementation based on external data shape._
- [ ] Set up RLS policies (public read for champion tables)
- [ ] Configure `.env.local` with Supabase keys
- [ ] Wire up server and client Supabase helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
- [ ] **Verify:** Can query Supabase from the app. Tables exist and are accessible.

**Chunk 1.4 — Champion Data Seeding** ⚠️ RISK
- [ ] Research InTeleria / HellHades API endpoints and data formats
- [ ] **Verify API accessibility first** — confirm endpoints return data and are not blocked/rate-limited before building the full pipeline
- [ ] Build seeding script (`scripts/seed-champions.ts`)
- [ ] Fetch, normalize, and upsert champion data (base info + stats + skills)
- [ ] Seed ~990+ champions into Supabase
- [ ] **Verify:** All champions in the database with stats and skills populated.

> **Fallback:** If external APIs are inaccessible or unreliable, seed 10–20 mock champions with representative data so Chunks 1.5 and 1.6 can proceed. Replace with real data once API issues are resolved.

**Chunk 1.5 — Champion Index Page**
- [ ] Build `/champions` page — server component fetching all champions
- [ ] Champion card component (avatar, name, rarity, faction, affinity, role)
- [ ] Card grid layout
- [ ] Text search input (filter by name)
- [ ] Dropdown filters: Faction, Affinity, Rarity, Role (using shadcn/ui Select)
- [ ] Pagination (paginated grid with page controls) to handle ~990+ champions without performance issues
- [ ] **Verify:** Browse, search, filter, and paginate ~990 champions on `/champions`.

**Chunk 1.6 — Champion Detail Page**
- [ ] Build `/champions/[slug]` page — server component fetching single champion
- [ ] Display: avatar, name, faction, affinity, rarity, role
- [ ] Stats table with star-level toggle
- [ ] Skills list with descriptions, multipliers, cooldowns
- [ ] Tier placements / ratings by content area
- [ ] Placeholder sections for "Recommended Builds" and "Guides"
- [ ] **Verify:** Click any champion card → full detail page with all data.

---

### Phase 2 — Auth + Roster + Team Builder

**Chunk 2.1 — Auth System**
- [ ] Set up Supabase Auth (email/password + Google OAuth)
- [ ] Build `/login` page with sign up / sign in forms
- [ ] Auth state management (session provider, middleware for protected routes)
- [ ] Update navbar to show logged-in user / logout button
- [ ] **Verify:** Users can sign up, log in, log out. Navbar reflects auth state.

**Chunk 2.2 — User Profile + Settings**
- [ ] Build `/profile` page (protected route)
- [ ] Display and edit: display name, avatar
- [ ] Account settings (change password, delete account)
- [ ] **Verify:** Logged-in users can view and edit their profile.

**Chunk 2.3 — Roster: Schema + Add Champions**
- [ ] Create `user_roster` table in Supabase (with RLS — users can only access their own)
- [ ] Build `/roster` page (protected route)
- [ ] Search-and-add flow: search champions by name, click to add to roster
- [ ] Display roster as a grid/list of owned champions
- [ ] **Verify:** Users can search for and add champions to their roster.

**Chunk 2.4 — Roster: Build Details**
- [ ] Edit view for a rostered champion: stars, level, ascension
- [ ] Gear section: select gear sets, input individual piece stats
- [ ] Masteries section: select mastery tree nodes
- [ ] Skill books section: track books used per skill
- [ ] **Verify:** Users can fully spec out any champion in their roster.

**Chunk 2.5 — Team Builder: Core**
- [ ] Create `teams` and `team_slots` tables in Supabase (with RLS)
- [ ] Build `/team-builder` page (works for all users, saving requires auth)
- [ ] Content type selector: category → detail → stage (e.g., Dungeon → Dragon → 25)
- [ ] Auto-set team size based on content type, with manual override
- [ ] Add champions to team slots (search from all champions, toggle to "My Roster only")
- [ ] **Verify:** Users can create a team, pick content type, and add champions to slots.

**Chunk 2.6 — Team Builder: Speed Tune + AI**
- [ ] Speed input per team slot
- [ ] Visual turn order display based on champion speeds
- [ ] Integrate Claude API for AI explanations
- [ ] Generate and display synergy breakdown when team is built
- [ ] Save / load teams
- [ ] **Verify:** Full team builder with speed tuning and AI explanations.

**Chunk 2.7 — Dashboard**
- [ ] Build `/` dashboard page
- [ ] Logged out: featured champions, quick links to Champions and Team Builder
- [ ] Logged in: roster summary (total champions, recent additions), saved teams, quick links
- [ ] **Verify:** Dashboard shows relevant content based on auth state.

---

### Phase 3 — Guides, Tier Lists & Community

**Chunk 3.1 — Tier Lists: Curated**
- [ ] Create `tier_lists` table in Supabase
- [ ] Build `/tier-lists` page
- [ ] Implement admin role checks (gate admin UI behind `admin_role` on the users table)
- [ ] Admin interface to create/edit official tier lists (content area → champion → tier S/A/B/C/D/F)
- [ ] Public view: filter by content area, see champions grouped by tier
- [ ] **Verify:** Admin can manage tier lists. Non-admin users cannot access admin UI. Public users can browse them.

**Chunk 3.2 — Tier Lists: Community Voted**
- [ ] Add voting system (users vote on champion tier per content area)
- [ ] Aggregate votes into a community tier list view
- [ ] Display alongside the curated list (tabs or toggle)
- [ ] **Verify:** Users can vote on champion tiers. Community list auto-generates from votes.

**Chunk 3.3 — Guides: WYSIWYG Editor + Publishing**
- [ ] Create `guides` table in Supabase
- [ ] Build `/guides` page (list view)
- [ ] Guide creation form with rich text editor (WYSIWYG) — _Editor library TBD (likely Tiptap or similar), to be decided during implementation._
- [ ] Fields: title, champion, build recommendation, tags, content body
- [ ] **Verify:** Users can write and publish guides with rich text formatting.

**Chunk 3.4 — Guides: Detail View + Community Interaction**
- [ ] Guide detail page with full content display
- [ ] Upvote/downvote system
- [ ] Comments section
- [ ] Link guides to champion detail pages
- [ ] **Verify:** Users can read, vote on, and comment on guides. Guides appear on champion pages.

---

### Phase 4 — Advanced Tools

**Chunk 4.1 — Gear Optimizer: Data Model + UI Shell**
- [ ] Define gear data model (sets, slots, main stats, substats)
- [ ] Build gear optimizer page shell
- [ ] Champion selector + stat priority inputs
- [ ] **Verify:** UI in place for gear optimization, data model ready.

**Chunk 4.2 — Gear Optimizer: Recommendation Engine**
- [ ] Build recommendation logic (match gear sets to stat priorities)
- [ ] Display suggested gear sets with reasoning
- [ ] **Verify:** Working gear suggestions based on champion and stat priorities.

**Chunk 4.3 — Clan Boss Calculator**
- [ ] Build CB calculator page
- [ ] Advanced speed tune input (speeds, buffs, debuff considerations)
- [ ] Damage estimation based on team comp and speeds
- [ ] Extend Team Builder's basic speed tune with CB-specific suggestions
- [ ] **Verify:** CB-specific calculator with damage estimates and speed tune suggestions.

**Chunk 4.4 — Fusion Tracker**
- [ ] Build fusion tracker page
- [ ] Input current fusion event champions and requirements
- [ ] Track progress (fragments collected, events completed)
- [ ] **Verify:** Users can track their progress on active fusion events.

## Resolved Questions

1. **Data source reliability** — Fallback chain if InTeleria/HellHades APIs go down: (1) find and integrate alternative RAID data sources, (2) allow community contributions to submit/update champion data, (3) manual admin entry as a last resort.
2. **Monetization** — Free to start. If running costs grow, explore options (donations, premium tier, ads) at that point. No monetization built into v1.
3. **Mobile support** — Desktop-first. Mobile responsiveness will be added later, not a launch requirement.

