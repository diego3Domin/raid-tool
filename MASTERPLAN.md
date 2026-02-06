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
2. **Team Builder** — Build and save teams for specific game content. Includes speed tune turn order display and AI-powered team suggestions.
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
   - **AI Team Suggestions:** When a user selects a content type, the AI analyzes their roster and suggests the best possible team composition from champions they actually own. Includes recommended turn order, gear set suggestions, and an explanation of why the team works (synergies, buff/debuff chains, skill combos). Available only for logged-in users with a roster.
   - **AI Explanations:** When a team is manually built, an AI-generated explanation describes why the composition works — champion synergies, skill combos, buff/debuff chains, and why the turn order matters for that specific content. Works for all users (not roster-dependent).
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

**Chunk 1.1 — Project Scaffolding** ✅
- [x] Initialize Next.js (App Router) + TypeScript
- [x] Install and configure Tailwind CSS v4
- [x] Install and configure shadcn/ui
- [x] Install Supabase JS client (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Set up folder structure (`src/app`, `src/components`, `src/lib`, `src/types`, `scripts/`)
- [x] Initialize Git repo
- [x] Add `.gitignore` (include `node_modules/`, `.env.local`, `.next/`, etc.)
- [x] Add `.env.local.example` with placeholder keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [x] **Verify:** App runs on `localhost` with a blank page and no errors

**Chunk 1.2 — Dark Theme + Navbar** ✅
- [x] Configure shadcn/ui dark theme with custom color palette (slate-900/950 backgrounds, gold/purple/red accents)
- [x] Build the top navbar component (logo left, nav links center, login button right)
- [x] Apply global dark styles, typography, and spacing
- _Note: Mobile hamburger menu deferred — desktop-first per Resolved Questions #3._
- [x] **Verify:** Every page shows the themed navbar on desktop.

**Chunk 1.3 — Data Layer** ✅
> _Supabase deferred — using local JSON data for Day 1. Will wire up Supabase later._

- [x] Define TypeScript types for champions (`src/types/champion.ts`)
- [x] Create local data access layer (`src/lib/champions.ts`) reading from JSON
- [x] Create `src/data/` directory for local champion data
- [ ] _Deferred: Create Supabase project, tables, RLS policies, and helpers_

**Chunk 1.4 — Champion Data Seeding** ✅
- [x] Research InTeleria / HellHades API endpoints and data formats
- [x] **Verify API accessibility first** — both APIs confirmed working
- [x] Build seeding script (`scripts/seed-champions.ts`)
- [x] Fetch, normalize, and merge champion data (InTeleria: 964 base stats, HellHades: 1021 ratings)
- [x] Seed 1002 unique champions to `src/data/champions.json` (964 with full stats + avatars, 39 with skills)
- [x] **Verify:** All champions in local JSON with stats populated.

**Chunk 1.5 — Champion Index Page** ✅
- [x] Build `/champions` page — server component fetching all champions
- [x] Champion card component (avatar, name, rarity, faction, affinity, role)
- [x] Card grid layout
- [x] Text search input (filter by name)
- [x] Dropdown filters: Faction, Affinity, Rarity, Role (using shadcn/ui Select)
- [x] Pagination (paginated grid with page controls) to handle ~990+ champions without performance issues
- [x] **Verify:** Browse, search, filter, and paginate 1002 champions on `/champions`.

**Chunk 1.6 — Champion Detail Page** ✅
- [x] Build `/champions/[slug]` page — server component fetching single champion
- [x] Display: avatar, name, faction, affinity, rarity, role
- [x] Stats table (6-star base stats)
- [x] Skills list with descriptions, multipliers, cooldowns
- [x] Ratings by content area (star display)
- [x] Placeholder sections for "Recommended Builds" and "Guides"
- [x] **Verify:** 1002 champion detail pages generated statically. Build clean.

---

### Phase 2 — Auth + Roster + Team Builder ✅

> _Supabase deferred — using mock auth + localStorage for all user data._

**Chunk 2.1 — Auth System** ✅
- [x] Set up mock auth system (React Context + localStorage)
- [x] Build `/login` page with sign up / sign in forms
- [x] Auth state management (AuthProvider, useAuth hook)
- [x] Update navbar to show logged-in user / logout button
- [x] **Verify:** Users can sign up, log in, log out. Navbar reflects auth state.

**Chunk 2.2 — User Profile + Settings** ✅
- [x] Build `/profile` page (protected route)
- [x] Display and edit: display name
- [x] Account settings (delete account — clears all localStorage)
- [x] **Verify:** Logged-in users can view and edit their profile.

**Chunk 2.3 — Roster: Schema + Add Champions** ✅
- [x] Create RosterProvider with localStorage persistence (keyed per user)
- [x] Build `/roster` page (protected route)
- [x] Search-and-add flow: search champions by name, click to add to roster
- [x] Display roster as a grid of owned champions with remove button
- [x] **Verify:** Users can search for and add champions to their roster.

**Chunk 2.4 — Roster: Build Details** ✅
- [x] Edit view for a rostered champion: stars, level, ascension
- [x] Gear section: select gear sets (toggle from 40+ set options)
- [x] Masteries section: placeholder (coming soon)
- [x] Skill books section: placeholder (coming soon)
- [x] **Verify:** Users can configure builds for any champion in their roster.

**Chunk 2.5 — Team Builder: Core** ✅
- [x] Create TeamsProvider with localStorage persistence (keyed per user)
- [x] Build `/team-builder` page (works for all users, saving requires auth)
- [x] Content type selector: category → detail → stage (e.g., Dungeon → Dragon → 25)
- [x] Auto-set team size based on content type (10 content types configured)
- [x] Add champions to team slots via search
- [x] **Verify:** Users can create a team, pick content type, and add champions to slots.

**Chunk 2.6 — Team Builder: Speed Tune + AI** ✅
- [x] Speed input per team slot
- [x] Visual turn order display based on champion speeds
- [x] AI synergy explanation — mock placeholder (Claude API deferred)
- [x] Generate and display synergy breakdown when team is built
- [ ] "Suggest Best Team" button (logged-in users with roster): AI analyzes user's roster + selected content type and suggests the optimal team composition with turn order, gear recommendations, and synergy explanation _(deferred — requires Claude API)_
- [x] Save / load teams
- [x] **Verify:** Full team builder with speed tuning and AI explanation placeholder.

**Chunk 2.7 — Dashboard** ✅
- [x] Build `/` dashboard page
- [x] Logged out: featured champions (8 legendaries), quick links to Champions and Team Builder
- [x] Logged in: roster summary, saved teams, quick links
- [x] **Verify:** Dashboard shows relevant content based on auth state.

---

### Phase 3 — Guides, Tier Lists & Community ✅

> _Supabase deferred — using localStorage for all data. Tiptap chosen for WYSIWYG editor._

**Chunk 3.1 — Tier Lists: Curated** ✅
- [x] Create TierListsProvider with localStorage persistence
- [x] Build `/tier-lists` page with Curated tab
- [x] Implement admin role checks (`admin_role` on User, `admin@raid.tool` for testing)
- [x] Admin interface to create/edit tier lists (content area → search champion → assign tier S/A/B/C/D/F)
- [x] Public view: filter by content area, see champions grouped by tier
- [x] **Verify:** Admin can manage tier lists. Non-admin users see read-only view. Build clean.

**Chunk 3.2 — Tier Lists: Community Voted** ✅
- [x] Add voting system (users vote on champion tier per content area)
- [x] Aggregate votes into community tier list view (majority vote per champion)
- [x] Display alongside curated list (tabs: Curated / Community)
- [x] **Verify:** Users can vote on champion tiers. Community list auto-generates from votes.

**Chunk 3.3 — Guides: WYSIWYG Editor + Publishing** ✅
- [x] Create GuidesProvider with localStorage persistence
- [x] Build `/guides` page (list view with tag filtering, vote scores, champion avatars)
- [x] Guide creation form with Tiptap rich text editor (bold, italic, headings, lists, blockquote, code)
- [x] Fields: title, champion (optional), tags, content body
- [x] **Verify:** Users can write and publish guides with rich text formatting.

**Chunk 3.4 — Guides: Detail View + Community Interaction** ✅
- [x] Guide detail page (`/guides/[id]`) with full HTML content display
- [x] Upvote/downvote system with visual indicators
- [x] Comments section with real-time posting
- [x] Link guides to champion detail pages (replaced placeholder on `/champions/[slug]`)
- [x] **Verify:** Users can read, vote on, and comment on guides. Guides linked from champion pages.

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

