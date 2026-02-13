# Plan: Create Guide Data Schema for RAID Expert Agent

## Context

The champion detail pages currently show "No guides yet — be the first to submit one." We want the `raid-shadow-legends-expert` agent to pre-populate structured build guides for ~800+ champions using its game knowledge. This gives the site real value before community-written guides exist (Phase 3).

The data follows the MASTERPLAN guide schema (gear sets, stat priorities, skill booking order) plus strategy notes prose. It's stored as static JSON (like `champions.json`) and displayed on champion detail pages.

## What We're Building

1. **Guide schema + data file** — `src/data/guides.json` keyed by champion slug
2. **TypeScript types** — `src/types/guide.ts` matching the schema
3. **Data access layer** — `src/lib/guides.ts` with helper functions
4. **Update champion detail page** — Replace "No guides yet" placeholder with actual build data
5. **RAID expert instructions** — A template/prompt the agent follows when writing guides

## Schema Design

Each guide entry follows the MASTERPLAN fields plus strategy notes:

```typescript
interface ChampionGuide {
  content_area: string;           // "General" | "Clan Boss" | "Arena" | "Dungeons" | "Hydra" | "Doom Tower" | "Faction Wars"
  gear_sets: string[];            // e.g., ["Lifesteal", "Speed"] — from GEAR_SETS in gear.ts
  stat_priorities: string[];      // Ordered: e.g., ["SPD", "DEF%", "HP%", "ACC"] — from STAT_PRIORITIES
  gauntlets_main: string;         // Main stat for gauntlets slot
  chestplate_main: string;        // Main stat for chestplate slot
  boots_main: string;             // Main stat for boots slot
  skill_booking_order?: number[]; // Skill indices to book first (0-indexed)
  mastery_tree: string;           // "Offense + Support" | "Defense + Support" | etc.
  notes: string;                  // Strategy prose: why this build, how to use, team synergies
}
```

`guides.json` structure — keyed by champion slug, array of guides per champion:

```json
{
  "kael": [
    {
      "content_area": "General",
      "gear_sets": ["Lifesteal", "Accuracy"],
      "stat_priorities": ["SPD", "ATK%", "C.RATE", "ACC"],
      "gauntlets_main": "C.RATE",
      "chestplate_main": "ATK%",
      "boots_main": "SPD",
      "skill_booking_order": [2, 1],
      "mastery_tree": "Offense + Support",
      "notes": "Kael is one of the best starter champions..."
    }
  ]
}
```

## Files to Create/Modify

### 1. `src/types/guide.ts` (CREATE)
- `ChampionGuide` interface
- Export valid content areas, mastery tree options as const arrays

### 2. `src/data/guides.json` (CREATE)
- Start empty: `{}`
- RAID expert agent populates incrementally

### 3. `src/lib/guides.ts` (MODIFY — replace prototype localStorage code)
- `getGuidesForChampion(slug: string): ChampionGuide[]`
- `getAllGuidedChampionSlugs(): string[]`
- Reads from `src/data/guides.json`

### 4. `src/app/champions/[slug]/page.tsx` (MODIFY)
- Import `getGuidesForChampion`
- Replace "No guides yet" placeholder with guide cards when data exists
- Show: gear sets, stat priorities, main stats, mastery tree, strategy notes
- Keep placeholder for champions without guides

### 5. RAID Expert Agent Usage
After the schema is built, the `raid-shadow-legends-expert` agent will be prompted with:
- The schema and valid values (gear sets, stat priorities, main stats per slot)
- Champion data (name, role, skills, ratings)
- Instruction to write 1-2 guides per champion (General build + best content area)
- Notes should be 2-4 sentences: why this build, how to use, key synergies

## Existing Code to Reuse

| File | What to Reuse |
|------|---------------|
| `src/lib/gear.ts` | `GEAR_SETS` (55+ sets), `STAT_PRIORITIES`, `SLOT_MAIN_STATS` |
| `src/lib/champions.ts` | `getChampionBySlug()`, `getAllChampions()` |
| `src/lib/constants.ts` | `RARITY_COLORS`, `RARITY_BORDER_COLORS` |
| `src/app/champions/[slug]/page.tsx` | Existing card layout pattern, `TIER_COLORS` |

## Implementation Steps

1. Create `src/types/guide.ts` with `ChampionGuide` interface and const arrays
2. Create `src/data/guides.json` (empty `{}`)
3. Rewrite `src/lib/guides.ts` — replace localStorage prototype with JSON reader
4. Update champion detail page to display guide cards when data exists
5. Test with a few manually-added sample guides
6. Use `raid-shadow-legends-expert` agent to batch-populate guides

## Verification

- `npx tsc --noEmit` passes
- `npx next build` passes
- Champion detail pages show guide cards for champions with data
- Champions without guides still show placeholder
- RAID expert agent can write valid guide entries that display correctly
