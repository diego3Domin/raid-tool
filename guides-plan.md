# Plan: Filter Guides by Rating Threshold

## Context

The guide data layer is complete — 996 champions with 1,503 guides in `src/data/guides.json`, displayed on champion detail pages. However, guides currently show for every content area regardless of how the champion actually performs. A champion rated C-tier in Arena shouldn't show an Arena build guide — it's misleading.

**Decision**: Only show guides for content areas where the champion is rated **B-tier (≥2.5) or higher**. The standalone `/guides` page is redundant — guides only make sense in the context of individual champions — so it's being removed.

## Rating-to-Content-Area Mapping

| Guide Content Area | Rating Field(s) | Filter Logic |
|---|---|---|
| General | *(none)* | **Always show** |
| Clan Boss | `clan_boss` | Show if ≥ 2.5 |
| Arena | `arena_offense`, `arena_defense` | Show if **max** of both ≥ 2.5 |
| Dungeons | `dungeons` | Show if ≥ 2.5 |
| Hydra | `hydra` | Show if ≥ 2.5 |
| Doom Tower | `doom_tower` | Show if ≥ 2.5 |
| Faction Wars | `faction_wars` | Show if ≥ 2.5 |

Tier reference: S ≥ 4.5, A ≥ 3.5, **B ≥ 2.5**, C ≥ 1.5, D ≥ 0.5, F < 0.5

## Schema (unchanged)

```typescript
interface ChampionGuide {
  content_area: GuideContentArea;
  gear_sets: string[];
  stat_priorities: string[];
  gauntlets_main: string;
  chestplate_main: string;
  boots_main: string;
  skill_booking_order?: number[];
  mastery_tree: MasteryTree;
  notes: string;
}
```

## Files to Modify

| File | Change |
|---|---|
| `src/lib/guides.ts` | Add `getFilteredGuidesForChampion()` + rating mapping const |
| `src/app/champions/[slug]/page.tsx` | Use filtered function (~line 102) |
| `src/app/guides/page.tsx` | Replace with redirect to `/champions` |
| `src/components/navbar.tsx` | Remove Guides from `navLinks` (line 6) |
| `src/app/page.tsx` | Change Build Guides `href` to `/champions` |

## Implementation Details

### 1. `src/lib/guides.ts` — Add filtering function

Add a `CONTENT_AREA_RATING_KEY` mapping and a new `getFilteredGuidesForChampion(slug, ratings)` function:
- Calls existing `getGuidesForChampion(slug)` to get all guides
- Filters out guides where the champion's rating for that content area is below 2.5
- Always keeps "General" guides
- For "Arena", uses `Math.max(ratings.arena_offense ?? 0, ratings.arena_defense ?? 0)`

### 2. `src/app/champions/[slug]/page.tsx` — Use filtered guides

- Import `getFilteredGuidesForChampion` instead of `getGuidesForChampion`
- Pass the champion's `ratings` object (~line 102)
- No rendering changes needed

### 3. `src/app/guides/page.tsx` — Redirect

Replace the full page with `redirect("/champions")` from `next/navigation`.

### 4. `src/components/navbar.tsx` — Remove link

Remove `{ href: "/guides", label: "Guides" }` from `navLinks` array.

### 5. `src/app/page.tsx` — Update card href

Change Build Guides card `href: "/guides"` → `href: "/champions"`.

## Verification

- `npx tsc --noEmit` passes
- `npx next build` passes
- `/guides` redirects to `/champions`
- Navbar shows only "Champions | Tier Lists"
- Landing page Build Guides card links to `/champions`
- Champion with mixed ratings (e.g. Abbess: overall 4, clan_boss 2.5, arena 4, dungeons 4, hydra 3.5) shows General + all B+ area guides
- Champion with all low ratings shows only the General guide
