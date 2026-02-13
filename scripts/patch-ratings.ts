/**
 * Quick patch script: fetches latest ratings from HellHades API
 * and merges them into existing champions.json without re-fetching skills.
 *
 * Usage: npx tsx scripts/patch-ratings.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019\u201C\u201D]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface HHChampion {
  champion: string;
  overall_user?: number;
  clan_boss?: number;
  hydra?: number;
  chimera?: number;
  spider?: number;
  dragon?: number;
  fire_knight?: number;
  ice_golem?: number;
  iron_twins?: number;
  sand_devil?: number;
  phantom_grove?: number;
  doom_tower?: number;
  arena_rating?: number;
  dungeon_overall?: number;
  fw_primary_rating?: number;
}

async function main() {
  console.log("Fetching ratings from HellHades...");
  const res = await fetch("https://hellhades.com/wp-json/hh-api/v3/champions?mode=all");
  if (!res.ok) throw new Error(`HellHades returned ${res.status}`);
  const json = await res.json();
  const hhChampions: HHChampion[] = json.champions;
  console.log(`  Got ${hhChampions.length} champions from HellHades`);

  // Build lookup by fuzzy name
  const hhByFuzzy = new Map<string, HHChampion>();
  for (const hh of hhChampions) {
    hhByFuzzy.set(normalizeName(hh.champion), hh);
  }

  // Load existing data
  const dataPath = resolve(__dirname, "../src/data/champions.json");
  const champions = JSON.parse(readFileSync(dataPath, "utf-8"));
  console.log(`  Loaded ${champions.length} champions from JSON`);

  let updated = 0;
  for (const champ of champions) {
    const hh = hhByFuzzy.get(normalizeName(champ.name));
    if (!hh) continue;

    const toNum = (v: unknown) => (typeof v === "number" && v > 0 ? v : undefined);

    champ.ratings = {
      overall: toNum(hh.overall_user) ?? champ.ratings?.overall,
      clan_boss: toNum(hh.clan_boss),
      hydra: toNum(hh.hydra),
      chimera: toNum(hh.chimera),
      arena_offense: toNum(hh.arena_rating),
      dungeons: toNum(hh.dungeon_overall),
      spider: toNum(hh.spider),
      dragon: toNum(hh.dragon),
      fire_knight: toNum(hh.fire_knight),
      ice_golem: toNum(hh.ice_golem),
      iron_twins: toNum(hh.iron_twins),
      sand_devil: toNum(hh.sand_devil),
      phantom_grove: toNum(hh.phantom_grove),
      doom_tower: toNum(hh.doom_tower),
      faction_wars: toNum(hh.fw_primary_rating),
    };

    // Strip undefined keys to keep JSON clean
    for (const [k, v] of Object.entries(champ.ratings)) {
      if (v === undefined) delete champ.ratings[k];
    }

    updated++;
  }

  writeFileSync(dataPath, JSON.stringify(champions, null, 2));
  console.log(`\nPatched ratings for ${updated}/${champions.length} champions`);
}

main().catch(console.error);
