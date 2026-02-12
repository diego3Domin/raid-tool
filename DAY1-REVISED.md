# Active Work Plan — Phase 1: Champion Index + Detail (Launch-Ready)

Goal: Ship the champion reference as a standalone, publicly accessible site on Vercel.

---

## Chunk 1 — Data: Skills Gap Research + Scraping
- [x] Research alternative skills data sources (RAID Wiki, AyumiLove, InTeleria detail pages, other APIs)
- [x] Test accessibility and data format of each source
- [x] Build/update seed script to fetch skills for all ~996 champions
- [x] Re-seed `champions.json` with complete skills data
- [x] **Verify:** Skills populated for 900+ champions (vs. current ~38) — **786/996 achieved** (205 newer champions not on InTeleria)

## Chunk 2 — Data: Self-Host Champion Images
- [x] Download all ~996 champion images from InTeleria/HellHades URLs
- [x] Store in `public/champions/` (30MB, 994 images + 1 placeholder SVG)
- [x] Update `champions.json` to reference local image paths
- [x] Created `scripts/download-images.ts` for image downloading
- [x] Handle the 2 champions missing avatars (placeholder image) — Noldua The Gloaming, Solanar The Gleaming
- [x] **Verify:** All champion images load from self-hosted URLs. No external image dependencies.

## Chunk 3 — Champion Detail: Tier Placements + Gear/Mastery Recs
- [x] Add "Tier Placements" section to detail page — show S/A/B/C/D/F tier across 7 content areas (derived from rating data)
- [x] Add "Recommended Build" section — placeholder that will populate from community guides once Phase 3 is complete
- [x] **Verify:** Every champion detail page shows tier placements grid. Build section shows "No guides yet — be the first to submit one."

## Chunk 4 — Champion Comparison Page
- [x] Build `/compare` route
- [x] Champion selector (search/add up to 3 champions)
- [x] Side-by-side stat table (HP, ATK, DEF, SPD, C.Rate, C.DMG, RES, ACC)
- [x] Side-by-side ratings comparison across content areas
- [x] Add "Compare" button/link on champion detail pages
- [x] **Verify:** Select 2–3 champions, see clear stat/rating comparison.

## Chunk 5 — Marketing Landing Page
- [x] Build `/` as a marketing landing page (replace current dashboard)
- [x] Hero section with tagline and CTA to browse champions
- [x] Feature highlights (champion reference, tier lists, build guides)
- [x] Featured champions showcase (top 12 legendaries)
- [x] Responsive layout (looks good on desktop and mobile)
- [x] **Verify:** Landing page loads, looks polished, CTA links work.

## Chunk 6 — SEO
- [x] Add unique `<title>` and `<meta description>` per champion page
- [x] Add Open Graph meta tags (og:title, og:description, og:image) per champion page
- [x] Add JSON-LD structured data on champion pages
- [x] Generate XML sitemap covering all champion pages
- [x] Add `robots.txt`
- [x] Set `metadataBase` for proper OG image resolution
- [x] **Verify:** Sitemap accessible at `/sitemap.xml`. robots.txt configured.

## Chunk 7 — Mobile-Friendly Polish
- [x] Review and fix champion index filters on mobile (2-column grid on small screens, full-width on sm+)
- [x] Review champion cards on small screens (smaller text, proper truncation)
- [x] Review champion detail page layout on mobile (responsive heading sizes, smaller badges)
- [x] Review comparison page on mobile (horizontal scroll for tables, compact padding)
- [x] Review landing page on mobile (responsive hero text, 3-col featured grid)
- [x] Navbar: smaller text + gaps on mobile
- [x] Pagination: arrow icons on mobile, full text on desktop
- [x] **Verify:** All pages usable on 375px viewport. No horizontal scroll on main content.

## Chunk 8 — Deployment
- [ ] Set up Vercel project (connect GitHub repo)
- [ ] Configure environment variables (if any needed at this stage)
- [ ] Deploy to `raid-tool.vercel.app`
- [ ] Test all pages on production URL
- [ ] Set up GitHub Actions workflow for automated weekly champion data sync (cron trigger -> run seed script -> commit + push -> auto-redeploy)
- [ ] **Verify:** Site live at Vercel URL. All pages load. Cron job scheduled.

## Chunk 9 — Navbar + Route Cleanup
- [x] Update navbar to show: `Champions | Tier Lists | Guides`
- [x] Remove/hide all cut feature routes (team-builder, gear-optimizer, clan-boss, fusion-tracker, roster, profile)
- [x] Remove unused localStorage providers (all 6 removed from layout)
- [x] Add "Coming Soon" state for Tier Lists and Guides pages
- [x] **Verify:** Navigation is clean. No dead links. Cut features inaccessible.

---

## Research (parallel with above chunks)

- [ ] **Mastery tree data** — Find complete mastery node data (names, tiers, trees, prerequisites). Check RAID Wiki, data miners, community spreadsheets.
- [ ] **Skill effect taxonomy** — Investigate if skill descriptions can be parsed into structured tags (Decrease DEF, Poison, Stun, etc.) for the "Similar Champions" feature.
- [ ] Document findings in a `RESEARCH.md` file for reference.
