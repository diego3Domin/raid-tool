# RAID Tool — Master Plan

## Vision

**RAID Tool** is a community champion reference and build guide platform for RAID: Shadow Legends. It serves as both a public utility for the RAID community and a portfolio showcase.

- **Audience:** Any RAID player. Public browsing, accounts for personal features.
- **Access model:** All reference content (champions, tier lists, guides) is freely browsable. Accounts required only for saving personal data (roster, voting, commenting, submitting guides).
- **Core differentiator:** A modern, polished UX that existing tools (HellHades, AyumiLove) lack — combined with strong SEO so players find us when Googling champion builds.
- **Portfolio angle:** Dark Souls-inspired medieval design, clean architecture, real community features backed by Supabase.


## Core Features

### 1. Champion Index + Detail (Priority 1 — Launch Feature)

**Index page** (`/champions`):
- Browse, search, and filter all ~996 champions
- **Filters:** Faction, Affinity (Magic/Force/Spirit/Void), Rarity (Common–Mythical), Role (Attack/Defense/HP/Support)
- **Text search** by champion name
- **Sorting:** Name A–Z/Z–A, Rarity High–Low/Low–High, Rating High–Low/Low–High
- **Pagination** to handle ~996+ champions
- **Self-hosted champion images** (downloaded from InTeleria/HellHades, served from our own CDN)

**Detail page** (`/champions/[slug]`):
- Full champion profile: avatar, name, faction, affinity, rarity, role
- **Stats table** (6-star base stats: HP, ATK, DEF, SPD, C.Rate, C.DMG, RES, ACC)
- **Skills list** with descriptions, multipliers, cooldowns (fill gaps from alternative data source)
- **Ratings by content area** (half-star precision display)
- **Tier placements** — show where this champion ranks (S/A/B/C/D/F) across all content areas in one view
- **Recommended gear sets + masteries** per content area (sourced from community guides when available)
- **Similar champions** — skill-based similarity (champions with comparable skill effects/debuffs)
- **Linked guides** — community build guides for this champion

**Comparison feature** (`/compare`):
- Select 2–3 champions, see stats and ratings side-by-side in a table
- Accessible from champion detail pages ("Compare with...")

**SEO:**
- Unique meta titles/descriptions per champion page (e.g., "Drexthar Bloodtwin Build Guide — RAID Tool")
- Open Graph images (auto-generated or champion avatar-based)
- JSON-LD structured data (VideoGame schema)
- XML sitemap for all champion pages
- Champion-name-based URLs (already using slugs)

### 2. Tier Lists (Priority 2)

- **Seeded from HellHades rating data** — pre-populate tier placements from existing HH ratings in our champion data
- **Community voting** — logged-in users vote on champion tier (S/A/B/C/D/F) per content area. Votes aggregate over time to adjust tiers.
- **Granular content areas** (13 areas):
  - Clan Boss, Hydra, Chimera
  - Dragon, Spider, Fire Knight, Ice Golem
  - Arena
  - Doom Tower
  - Faction Wars
  - Iron Twins, Sand Devil, Shogun
- **No admin-curated tier list** — community-driven only, seeded from data
- **Public** — browsable without login. Login required to vote.

### 3. Guides (Priority 3)

- **Community-written** champion build guides (no AI generation at launch)
- **Structured build templates** — no free-form rich text editor. Fields:
  - Champion (required)
  - Content area (which content this build is for)
  - Gear sets (dropdowns from gear set list)
  - Stat priorities (ranked list: e.g., SPD > ACC > DEF > HP)
  - Mastery picks (selected mastery nodes)
  - Skill booking order (which skills to book first)
- **Champion build guides only** — focused scope, no free-form strategy articles
- **Upvote/downvote** system for quality sorting
- **Login required** to submit or vote on guides. Browsable without login.

### 4. Roster (Priority 4)

- **Full build tracking** per owned champion:
  - Stars, level, ascension
  - Gear sets + gear piece stats
  - Mastery selections
  - Skill book tracking
- **Search-and-add flow:** search champions by name, add to roster
- **Requires login** — roster data stored in Supabase per user
- _Future: RSL Helper JSON import to auto-populate roster data_


## Cut Features

These were prototyped with localStorage but are **removed from scope**. Code may remain in the codebase but is hidden from navigation and not maintained.

| Feature | Reason |
|---|---|
| **Team Builder + AI Synergy** | Deprioritized. May return in a future phase once core features are solid. |
| **Gear Optimizer** | Other tools (HellHades optimizer, RSL Helper) already do this well. Not worth duplicating. |
| **Clan Boss Calculator** | Redundant with existing community tools. |
| **Fusion Tracker** | Cut for now. Not a core reference feature. |
| **AI-Generated Guides** | Deferred. Community-written guides come first. AI generation may be added later. |


## Champion Data

- **Source:** Hybrid seed from InTeleria (base stats, avatars) + HellHades (ratings, skills)
- **Count:** ~996 champions, deduped via fuzzy name matching
- **Skills gap:** ~958 champions have empty skills arrays (HH API limitation). **Action: research alternative data sources** (RAID Wiki, AyumiLove, or other scrapeable endpoints) to fill skill data for all champions.
- **Images:** Self-hosted. Download all champion images from source URLs and serve from Supabase Storage or Vercel/public directory. Eliminates dependency on external URL stability.
- **Freshness:** New champions released every 1–2 weeks. **Automated weekly cron job** (GitHub Actions) runs the seed script, detects new champions, and triggers redeployment.
- **Storage:** Champion base data lives in static JSON (`src/data/champions.json`) for fast static page generation. User-generated data (tier votes, guides, roster) lives in Supabase.


## Tech Stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Data approach:** Hybrid — static JSON for champion reference data, Supabase for user/community data
- **Auth:** Supabase Auth — email/password + Google OAuth
- **Hosting:** Vercel (free tier) — `raid-tool.vercel.app` initially, custom domain later
- **CI/CD:** GitHub Actions for automated champion data sync (weekly cron)


## Design / Theme

- **Aesthetic:** Dark Souls-inspired medieval — dark backgrounds, ember/blood/steel color palette
- **Typography:** Cinzel (serif) for headings, Geist Sans for body text
- **Colors:** Ember gold (#C8963E) primary, blood red (#8B1A1A) destructive, steel gray (#4A5568) secondary. Near-black background (#0A0A0F).
- **Component library:** shadcn/ui (new-york variant, dark theme)
- **Mobile:** Mobile-friendly, not mobile-first. Should look decent and be usable on phones, but desktop is the optimized experience.
- **Navigation:** Top navbar — logo left, nav links center (`Champions | Tier Lists | Guides`), auth right. `My Roster` link appears when logged in.


## Pages / Routes

| Route | Description | Auth |
|---|---|---|
| `/` | **Landing page** — Hero section, feature highlights, screenshots, CTA to browse champions. Marketing/portfolio-oriented. | Public |
| `/champions` | **Champion Index** — Browse, search, filter, sort all champions. | Public |
| `/champions/[slug]` | **Champion Detail** — Stats, skills, ratings, tier placements, gear/mastery recs, similar champions, linked guides. | Public |
| `/compare` | **Champion Comparison** — Select 2–3 champions, side-by-side stat/rating table. | Public |
| `/tier-lists` | **Tier Lists** — Community-voted champion rankings by content area (13 areas). | Public (vote: auth) |
| `/guides` | **Guides** — Browse community build guides, filter by champion/content area. | Public |
| `/guides/new` | **Submit Guide** — Structured build template form. | Auth required |
| `/roster` | **My Roster** — View and manage owned champions with full build details. | Auth required |
| `/login` | **Login / Sign Up** — Supabase auth (email/password + Google OAuth). | Public |
| `/profile` | **Profile / Settings** — Account settings. | Auth required |


## Data Model

### Champions (static JSON — `src/data/champions.json`)
- `id`, `name`, `slug`, `faction`, `affinity`, `rarity`, `role`, `avatar_url`
- **Stats** (per star level): HP, ATK, DEF, SPD, C.Rate, C.DMG, RES, ACC
- **Skills**: name, description, multiplier, cooldown, effects
- **Ratings**: Numeric scores (1–5) per content area (overall, clan_boss, arena, dungeons, hydra, faction_wars, doom_tower)

### Users (Supabase Auth + `profiles` table)
- `id` (UUID, from Supabase Auth), `email`, `display_name`, `avatar_url`, `created_at`

### Tier Votes (`tier_votes` table — Supabase)
- `id`, `user_id`, `champion_id`, `content_area`, `tier` (S/A/B/C/D/F), `created_at`, `updated_at`
- Unique constraint: one vote per user per champion per content area
- RLS: users can only insert/update their own votes, all votes readable publicly (aggregated)

### Guides (`guides` table — Supabase)
- `id`, `author_id`, `champion_id`, `content_area`
- `gear_sets` (array of gear set names)
- `stat_priorities` (ordered array: e.g., ["SPD", "ACC", "DEF", "HP"])
- `mastery_picks` (array of mastery node identifiers)
- `skill_booking_order` (ordered array of skill indices)
- `upvotes`, `downvotes`, `created_at`, `updated_at`

### Guide Votes (`guide_votes` table — Supabase)
- `id`, `user_id`, `guide_id`, `vote` (+1 or -1), `created_at`
- Unique constraint: one vote per user per guide

### User Roster (`roster_champions` table — Supabase)
- `id`, `user_id`, `champion_id`
- `stars`, `level`, `ascension`
- `gear_sets` (array), `gear_stats` (JSONB — slot-level stats)
- `masteries` (array of selected mastery node identifiers)
- `skill_books` (JSONB — books used per skill index)
- `created_at`, `updated_at`
- RLS: users can only read/write their own roster


## Auth

- **Provider:** Supabase Auth
- **Methods:** Email/password + Google OAuth
- **Public access:** Champion index, champion detail, comparison, tier lists (read), guides (read), landing page
- **Auth required:** Roster (all), voting (tier lists + guides), submitting guides, profile/settings
- **RLS:** Enabled on all Supabase tables. Users can only modify their own data.


## SEO Strategy

- **Meta tags:** Unique `<title>` and `<meta description>` per champion page, tier list page, and guide page
- **Open Graph:** OG image per champion (avatar-based), OG title/description for social sharing
- **Structured data:** JSON-LD markup (VideoGame/SoftwareApplication schema) on key pages
- **Sitemap:** Auto-generated XML sitemap covering all champion pages, tier list pages, and guide pages
- **URLs:** Human-readable slugs (already in place: `/champions/drexthar-bloodtwin`)
- **Performance:** Static generation for champion pages (fast TTFB, good Core Web Vitals)


## Deployment

- **Hosting:** Vercel (free tier) — `raid-tool.vercel.app` initially
- **Database:** Supabase (free tier) — hosted Postgres
- **Custom domain:** TBD — will add once site is polished (e.g., `raidtool.gg` or similar)
- **CI/CD:** GitHub Actions for automated weekly champion data sync


## Milestones

### Phase 1 — Champion Index + Detail (Launch-Ready)
Ship the champion reference as a standalone, publicly accessible site.

- [ ] Research and scrape skills data from alternative source (fill 958/996 empty skills)
- [ ] Download and self-host all champion images
- [ ] Add tier placements section to champion detail page (derived from rating data)
- [ ] Add recommended gear/mastery section to detail page (placeholder until guides exist)
- [ ] Build `/compare` route — champion comparison (side-by-side stat table)
- [ ] Build marketing landing page (`/`)
- [ ] Implement SEO: meta tags, OG images, JSON-LD, sitemap
- [ ] Mobile-friendly polish pass (responsive filters, cards, detail page)
- [ ] Deploy to Vercel (`raid-tool.vercel.app`)
- [ ] Set up GitHub Actions cron for weekly champion data sync

### Phase 2 — Supabase + Auth + Tier Lists
Add real backend and the first community feature.

- [ ] Set up Supabase project (create tables, RLS policies, auth config)
- [ ] Implement real auth (replace mock localStorage auth): email/password + Google OAuth
- [ ] Build `tier_votes` table and API
- [ ] Seed tier list data from HellHades ratings
- [ ] Build tier list UI: browse by content area, community-voted rankings
- [ ] Add voting UI (logged-in users vote S–F per champion per content area)
- [ ] Connect tier placements on champion detail page to live vote data
- [ ] Update navbar: `Champions | Tier Lists | Guides`

### Phase 3 — Guides (Structured Build Templates)
Add community build guides with structured fields.

- [ ] Build `guides` + `guide_votes` tables in Supabase
- [ ] Build guide submission form: structured template (gear sets, stat priorities, mastery picks, skill booking)
- [ ] Build guide browse page: filter by champion, content area, sort by votes
- [ ] Build guide display on champion detail page
- [ ] Add upvote/downvote system with Supabase
- [ ] Link gear/mastery recommendations on champion detail page to top-voted guides

### Phase 4 — Roster
Add personal champion tracking.

- [ ] Build `roster_champions` table in Supabase with RLS
- [ ] Build roster page: search-and-add, grid of owned champions
- [ ] Build roster champion detail: stars, level, ascension, gear, masteries, skill books
- [ ] Add "Add to Roster" button on champion detail pages
- [ ] Add `My Roster` nav link (visible when logged in)

### Phase 5 — Advanced Features (Pending Research)
These depend on data availability. Research first, build if feasible.

- [ ] **Research:** Find scrapeable mastery tree data (all nodes, connections, prerequisites per tree)
- [ ] **Research:** Find parseable skill effect data (debuff types, buff types, AoE vs single target)
- [ ] **Visual mastery tree diagram** — interactive tree with highlighted recommended nodes (if data available)
- [ ] **Skill-based champion similarity** — "Similar Champions" section on detail page (if skill effect data available)
- [ ] **Fallback if data unavailable:** Text-based mastery lists, role+rarity-based similarity


## Research Tasks

These must be investigated before certain features can be built:

1. **Alternative skills data source** — InTeleria, RAID Wiki, AyumiLove, or other sources that have skill descriptions/multipliers/cooldowns for all ~996 champions. The HellHades API only returns skills for ~38 champions.
2. **Mastery tree data** — Complete mastery node data (name, tier, tree, prerequisites, effects) for all 3 trees (Offense, Defense, Support). Needed for the visual mastery tree diagram and structured guide templates.
3. **Skill effect taxonomy** — Parsed skill effects (Decrease DEF, Stun, Poison, etc.) to power the "Similar Champions" feature. May need to be extracted from skill descriptions via parsing or AI.


## Resolved Questions

1. **Data source reliability** — Champion images will be self-hosted to eliminate external URL dependency. Champion data refreshed via automated weekly cron.
2. **Monetization** — Free. No monetization in v1.
3. **Mobile support** — Mobile-friendly, not mobile-first. Desktop is the primary experience.
4. **Auth scope** — All reference content public. Login only for personal features (roster, voting, guide submission).
5. **Gear optimizer** — Cut. External tools (HellHades, RSL Helper) handle this adequately.
6. **Team builder** — Cut for now. May return in a future phase.
7. **AI guides** — Deferred. Community guides first, AI generation may be layered on later.
8. **Tier list curation** — No admin-curated tier list. Community-voted only, seeded from HellHades data.
9. **Guide format** — Structured templates only (no free-form rich text). Ensures consistency and comparability.
10. **Domain** — Vercel subdomain first (`raid-tool.vercel.app`). Custom domain later.
