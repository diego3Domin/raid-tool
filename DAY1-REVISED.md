# Active Work Plan — Phase 1: Champion Index + Detail (Launch-Ready)

**Goal:** Ship the champion reference as a standalone, publicly accessible site on Vercel.

**Status:** All 9 chunks complete. Site live at [raid-tool.vercel.app](https://raid-tool.vercel.app). GitHub Actions pending `workflow` scope auth.

---

## Chunk 1 — Data: Skills Gap Research + Scraping ✅

- [x] Research alternative skills data sources (RAID Wiki, AyumiLove, InTeleria detail pages, HellHades API)
- [x] Test accessibility and data format of each source
- [x] Build `scripts/scrape-skills.ts` — scrapes InTeleria champion detail pages for skills (786/996)
- [x] Fix HellHades seed script bug: changed `hh.heroId` → `hh.id` (WordPress post ID)
- [x] Build `scripts/backfill-skills.ts` — fills remaining gaps via corrected HellHades API (+197)
- [x] **Result:** 983/996 champions have skills (98.7%), up from 38

**13 still missing:** April O'Neil, Arbais the Stonethorn, Big 'Un (x2), Fren'zi The Cackler, Gharol Bloodmaul, He-Man, Kro'kmar the Devourer, Ma'Shalled (x2), Mezomel Luperfang, Packmaster Shy'ek, Siegfrund the Nephilim — name mismatches or collab/new champions without API data.

**Research findings (background agent):**
- HellHades API: 100% coverage when using `id` field (not `heroId`)
- vnoctem Google Sheet: multiplier formulas for ~634 champions (Phase 2 enrichment)
- AyumiLove: blocked by Cloudflare
- RAID Wiki: inconsistent multiplier data, slow to scrape
- GitHub repos (goctionni, PatPat1567): all outdated/stale

---

## Chunk 2 — Data: Self-Host Champion Images ✅

- [x] Build `scripts/download-images.ts` — downloads images with rate limiting, progressive save, resume support
- [x] Download all 994 champion images from InTeleria/HellHades URLs
- [x] Store in `public/champions/` (30MB total, 994 images + 1 placeholder SVG)
- [x] Update `champions.json` — all `avatar_url` fields now point to local paths (`/champions/{slug}.{ext}`)
- [x] Create `public/champions/placeholder.svg` for missing avatars
- [x] Handle 2 champions without source URLs: Noldua The Gloaming, Solanar The Gleaming → placeholder
- [x] **Result:** Zero external image dependencies. All 996 champions have a local image path.

---

## Chunk 3 — Champion Detail: Tier Placements + Gear/Mastery Recs ✅

- [x] Add "Tier Placements" grid to `src/app/champions/[slug]/page.tsx`
  - 7 content areas: Clan Boss, Hydra, Arena, Dungeons, Doom Tower, Faction Wars, Campaign
  - Rating-to-tier conversion: ≥4.5→S, ≥3.5→A, ≥2.5→B, ≥1.5→C, ≥0.5→D, else→F
  - Color-coded badges (S=gold, A=green, B=blue, C=purple, D=orange, F=red)
- [x] Add "Recommended Build" placeholder section
- [x] Add "Compare →" link in champion detail header
- [x] Add OG meta tags and JSON-LD structured data per champion page
- [x] **Result:** Every champion detail page shows tier placements grid. Build section shows "No guides yet."

---

## Chunk 4 — Champion Comparison Page ✅

- [x] Build `/compare` route — `src/app/compare/page.tsx` (server) + `compare-client.tsx` (client)
- [x] Champion selector with live search (add up to 3 champions)
- [x] URL parameter support: `?champions=slug1,slug2` for deep linking
- [x] Side-by-side stat table: HP, ATK, DEF, SPD, C.Rate, C.DMG, RES, ACC
- [x] Side-by-side ratings comparison with star display
- [x] Highest values highlighted in ember gold
- [x] Wrapped in `<Suspense>` for `useSearchParams()` compatibility with static generation
- [x] **Result:** Select 2–3 champions, see clear stat/rating comparison.

---

## Chunk 5 — Marketing Landing Page ✅

- [x] Rewrite `src/app/page.tsx` as server component (removed all localStorage providers)
- [x] Hero section with gradient text headline + 2 CTA buttons (Browse Champions, Compare Champions)
- [x] Featured Champions showcase: top 12 legendaries by overall rating
- [x] Feature Highlights grid: Champion Database, Tier Lists (coming soon), Build Guides (coming soon)
- [x] Stats bar: 996+ champions, 13 content areas, 17 factions
- [x] Footer CTA: "Explore All Champions"
- [x] **Result:** Landing page loads, looks polished, CTAs work.

---

## Chunk 6 — SEO ✅

- [x] Per-champion `<title>` and `<meta description>` via `generateMetadata`
- [x] Open Graph meta tags (og:title, og:description, og:image) per champion
- [x] Twitter card meta tags per champion
- [x] JSON-LD structured data (`Article` schema) on every champion page
- [x] `src/app/sitemap.ts` — dynamic XML sitemap (1000+ URLs, weekly change frequency)
- [x] `src/app/robots.ts` — allows all crawling, points to sitemap
- [x] `metadataBase` set to `https://raid-tool.vercel.app` in root layout
- [x] **Result:** Sitemap at `/sitemap.xml`, robots at `/robots.txt`, OG tags on all pages.

---

## Chunk 7 — Mobile-Friendly Polish ✅

- [x] **Navbar:** Smaller text (`text-xs sm:text-sm`), tighter gaps (`gap-3 sm:gap-6`), shorter height on mobile
- [x] **Champion index filters:** 2-column CSS grid on mobile, flex-wrap on `sm+`; search spans full width
- [x] **Champion cards:** Smaller name text (`text-xs sm:text-sm`) with truncation
- [x] **Pagination:** Arrow icons (`← →`) on mobile, full text ("Previous"/"Next") on desktop
- [x] **Champion detail:** Responsive heading (`text-2xl sm:text-3xl md:text-5xl`), smaller badges, hidden dot separators on mobile
- [x] **Comparison page:** `overflow-x-auto` with `min-w-[360px]` tables, compact padding, stars hidden on mobile (show numeric only)
- [x] **Landing page:** Responsive hero text (`text-4xl sm:text-5xl md:text-7xl`), 3-col featured grid on mobile
- [x] **Coming Soon pages:** Responsive headings (`text-3xl sm:text-4xl`)
- [x] **Result:** All pages usable on 375px viewport. No horizontal scroll on main content.

---

## Chunk 8 — Deployment ✅

- [x] Created GitHub repo: [github.com/diego3Domin/raid-tool](https://github.com/diego3Domin/raid-tool)
- [x] Pushed all code to `main` branch
- [x] Deployed to Vercel via CLI: [raid-tool.vercel.app](https://raid-tool.vercel.app)
- [x] Build passes: 1007 static pages generated (996 champion detail + index + compare + landing + tier-lists + guides + login + sitemap + robots)
- [ ] Connect GitHub repo to Vercel for auto-deploys (requires Vercel dashboard → Settings → Git)
- [ ] Push GitHub Actions workflow (requires `gh auth refresh -s workflow` — pending auth)
- [ ] **Verify:** Auto-deploy on push. Cron job scheduled.

**GitHub Actions workflow** (`sync-champions.yml`) is committed locally but blocked from pushing — GitHub requires the `workflow` OAuth scope. Run `gh auth refresh -h github.com -s workflow` and complete the device auth to unblock.

**Workflow details:**
- Runs every Monday at 06:00 UTC (also manually triggerable)
- Steps: seed champions → download images → backfill skills → commit & push if changed
- Auto-redeploy via Vercel GitHub integration (once connected)

---

## Chunk 9 — Navbar + Route Cleanup ✅

- [x] Rewrote `src/components/navbar.tsx` as server component (removed `useAuth` dependency)
- [x] Nav links: Champions | Tier Lists | Guides (center), placeholder for future auth (right)
- [x] Created "Coming Soon" pages for `/tier-lists` and `/guides`
- [x] Replaced `/login/page.tsx` with "Coming Soon" page (removed `useAuth`)
- [x] Deleted cut feature routes: `fusion-tracker`, `gear-optimizer`, `clan-boss`, `team-builder`, `roster`, `profile`, `guides/[id]`
- [x] Removed all 6 localStorage providers from `layout.tsx`: AuthProvider, RosterProvider, TeamsProvider, TierListsProvider, GuidesProvider, FusionsProvider
- [x] **Result:** Navigation is clean. No dead links. Cut features inaccessible.

---

## Research (parallel) — Partial

- [x] **Skills data sources** — Comprehensive research completed (see Chunk 1 findings above)
- [ ] **Mastery tree data** — Not yet researched. Check RAID Wiki, data miners, community spreadsheets.
- [ ] **Skill effect taxonomy** — Not yet researched. Parse skill descriptions into structured tags (Decrease DEF, Poison, Stun, etc.)
- [ ] Document findings in a `RESEARCH.md` file for reference.

---

## Scripts Created

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/seed-champions.ts` | Full re-seed from InTeleria + HellHades APIs | `npx tsx scripts/seed-champions.ts` |
| `scripts/scrape-skills.ts` | Scrape skills from InTeleria detail pages | `npx tsx scripts/scrape-skills.ts` |
| `scripts/backfill-skills.ts` | Fill missing skills via HellHades API | `npx tsx scripts/backfill-skills.ts` |
| `scripts/download-images.ts` | Download champion images locally | `npx tsx scripts/download-images.ts` |

---

## Key Bugs Fixed

1. **HellHades skills API bug** — Seed script used `hh.heroId` (game ID) instead of `hh.id` (WordPress post ID). Fixed in `seed-champions.ts` line 420. This was the root cause of only 38/996 champions having skills.
2. **TypeScript `ChampionStats` cast** — Compare page needed `unknown` intermediate cast for indexed access: `(c.stats["6"] as unknown as Record<string, number>)`
3. **`useSearchParams()` Suspense** — Compare page needed `<Suspense>` boundary for static generation compatibility.
4. **Stale `.next` cache** — Deleted routes still referenced in `.next/dev/types/validator.ts`. Fixed by clearing `.next/` directory.
5. **Provider dependency chain** — Removing 6 localStorage providers broke all pages using `useAuth`. Fixed by rewriting affected pages and deleting cut-feature routes.

---

## Remaining TODO (not Phase 1)

- [ ] Complete GitHub → Vercel auto-deploy integration (Vercel dashboard)
- [ ] Push `sync-champions.yml` workflow (needs `workflow` OAuth scope)
- [ ] Mastery tree data research
- [ ] Skill effect taxonomy research
- [ ] Phase 2: Supabase + Auth + Tier Lists
