/**
 * Champion Data Seeding Script
 *
 * Fetches champion data from InTeleria (base stats) and HellHades (ratings + skills),
 * merges them, and writes to src/data/champions.json.
 *
 * Usage: npx tsx scripts/seed-champions.ts
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

// --- Types ---

interface InTeleriaChampion {
  name: string; // contains HTML
  image: string; // contains HTML <img>
  faction: string;
  rarity: string;
  affinity: string;
  type: string; // role: Attack, Defense, Support, HP
  HP: number;
  ATK: number;
  DEF: number;
  SPD: number;
  CRATE: number;
  CDMG: number;
  RES: number;
  ACC: number;
  rating_avg: string;
}

interface HellHadesChampion {
  id: number;
  shortname: string;
  heroId: number;
  champion: string;
  affinity_index: string;
  faction_index: string;
  rarity: string;
  role: string;
  url: string;
  overall_user: number;
  clan_boss?: number;
  hydra?: number;
  chimera?: number;
  spider?: number;
  dragon?: number;
  fire_knight?: number;
  ice_golem?: number;
  iron_twins?: number;
  sand_devil?: number;
  arena_rating?: number;
  dungeon_overall?: number;
}

interface HellHadesSkill {
  type: string;
  name: string;
  cooldown: string | number;
  description: string;
  multiplier?: { attacks?: number }[];
}

interface Champion {
  id: string;
  name: string;
  slug: string;
  faction: string;
  affinity: string;
  rarity: string;
  role: string;
  avatar_url: string;
  stats: Record<string, {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    crit_rate: number;
    crit_dmg: number;
    res: number;
    acc: number;
  }>;
  skills: {
    name: string;
    description: string;
    multiplier?: string;
    cooldown?: number;
    effects?: string[];
  }[];
  ratings: {
    overall?: number;
    campaign?: number;
    clan_boss?: number;
    arena_offense?: number;
    arena_defense?: number;
    dungeons?: number;
    hydra?: number;
    faction_wars?: number;
    doom_tower?: number;
  };
}

// --- Helpers ---

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014");
}

function extractNameFromHtml(html: string): string {
  // InTeleria name field contains HTML like: <a href="...">Champion Name</a>...
  const match = html.match(/>([^<]+)</);
  const raw = match ? match[1].trim() : html.trim();
  return decodeHtmlEntities(raw);
}

function extractImageFromHtml(html: string): string {
  const match = html.match(/src=['"]([^'"]+)['"]/);
  return match ? match[1] : "";
}

const HH_FACTION_MAP: Record<string, string> = {
  "banner-lords": "Banner Lords",
  "high-elves": "High Elves",
  "the-sacred-order": "The Sacred Order",
  "barbarians": "Barbarians",
  "ogryn-tribes": "Ogryn Tribes",
  "lizardmen": "Lizardmen",
  "skinwalkers": "Skinwalkers",
  "orcs": "Orcs",
  "demonspawn": "Demonspawn",
  "undead-hordes": "Undead Hordes",
  "dark-elves": "Dark Elves",
  "knight-revenant": "Knight Revenant",
  "dwarves": "Dwarves",
  "shadowkin": "Shadowkin",
  "sylvan-watchers": "Sylvan Watchers",
  "knights-of-magaava": "Knights of Magaava",
};

const HH_ROLE_MAP: Record<string, string> = {
  "Atk": "Attack",
  "Def": "Defense",
  "Supp": "Support",
  "HP": "HP",
};

// Some InTeleria champions use abbreviated or non-standard role values
const ROLE_NORMALIZE: Record<string, string> = {
  "Attack": "Attack",
  "Defense": "Defense",
  "Support": "Support",
  "HP": "HP",
  "ATK": "Attack",
  "DEF": "Defense",
  "TBC": "Support", // placeholder — default to Support
  "Atk": "Attack",
  "Def": "Defense",
  "Supp": "Support",
};

// --- Fetch Functions ---

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchInTeleria(): Promise<InTeleriaChampion[]> {
  console.log("Fetching from InTeleria...");
  const res = await fetch("https://www.inteleria.com/wp-json/in-champions/v1/champions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ length: 1200 }),
  });
  if (!res.ok) throw new Error(`InTeleria returned ${res.status}`);
  const json = await res.json();
  const data: InTeleriaChampion[] = json.data;
  console.log(`  Got ${data.length} champions from InTeleria`);
  return data;
}

async function fetchHellHades(): Promise<HellHadesChampion[]> {
  console.log("Fetching from HellHades...");
  const res = await fetch("https://hellhades.com/wp-json/hh-api/v3/champions?mode=all");
  if (!res.ok) throw new Error(`HellHades returned ${res.status}`);
  const json = await res.json();
  const data: HellHadesChampion[] = json.champions;
  console.log(`  Got ${data.length} entries from HellHades`);
  return data;
}

async function fetchHellHadesSkills(heroId: number): Promise<HellHadesSkill[]> {
  try {
    const res = await fetch(`https://hellhades.com/wp-json/hh-api/v3/raid/skills/${heroId}`);
    if (!res.ok) return [];
    const data = await res.json();
    // Response is a nested array [[skill1, skill2, ...]]
    const skills = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : Array.isArray(data) ? data : [];
    return skills;
  } catch {
    return [];
  }
}

// --- Main ---

async function main() {
  console.log("=== RAID Champion Data Seeder ===\n");

  // Step 1: Fetch base data from InTeleria
  let inteleria: InTeleriaChampion[] = [];
  try {
    inteleria = await fetchInTeleria();
  } catch (err) {
    console.error("InTeleria fetch failed:", err);
  }

  // Step 2: Fetch ratings from HellHades
  let hellhades: HellHadesChampion[] = [];
  try {
    hellhades = await fetchHellHades();
  } catch (err) {
    console.error("HellHades fetch failed:", err);
  }

  if (inteleria.length === 0 && hellhades.length === 0) {
    console.error("\nBoth APIs failed. Generating mock data as fallback...");
    generateMockData();
    return;
  }

  // Build a lookup of HellHades data by normalized champion name
  const hhByName = new Map<string, HellHadesChampion>();
  for (const hh of hellhades) {
    hhByName.set(hh.champion.toLowerCase().trim(), hh);
  }

  // Step 3: Build merged champion list (InTeleria as primary, HellHades for enrichment)
  const champions: Champion[] = [];
  const seenSlugs = new Set<string>();

  // Process InTeleria champions
  for (const it of inteleria) {
    const name = extractNameFromHtml(it.name);
    if (!name) continue;

    let slug = slugify(name);
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${it.affinity.toLowerCase()}`;
    }
    seenSlugs.add(slug);

    const avatarUrl = extractImageFromHtml(it.image);
    const hh = hhByName.get(name.toLowerCase().trim());

    const champion: Champion = {
      id: slug,
      name,
      slug,
      faction: it.faction,
      affinity: it.affinity,
      rarity: it.rarity,
      role: ROLE_NORMALIZE[it.type] ?? it.type,
      avatar_url: avatarUrl,
      stats: {
        "6": {
          hp: it.HP,
          atk: it.ATK,
          def: it.DEF,
          spd: it.SPD,
          crit_rate: Math.round(it.CRATE * 100),
          crit_dmg: Math.round(it.CDMG * 100),
          res: it.RES,
          acc: it.ACC,
        },
      },
      skills: [],
      ratings: {
        overall: hh?.overall_user ?? (it.rating_avg ? parseFloat(it.rating_avg) : undefined),
        clan_boss: hh?.clan_boss ?? undefined,
        arena_offense: hh?.arena_rating ?? undefined,
        dungeons: hh?.dungeon_overall ?? undefined,
        hydra: hh?.hydra ?? undefined,
      },
    };

    champions.push(champion);
  }

  // Add HellHades-only champions (ones not in InTeleria)
  for (const hh of hellhades) {
    const name = hh.champion.trim();
    const slug = slugify(name);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const champion: Champion = {
      id: slug,
      name,
      slug,
      faction: HH_FACTION_MAP[hh.faction_index] ?? hh.faction_index,
      affinity: hh.affinity_index,
      rarity: hh.rarity,
      role: HH_ROLE_MAP[hh.role] ?? hh.role,
      avatar_url: "",
      stats: {},
      skills: [],
      ratings: {
        overall: hh.overall_user ?? undefined,
        clan_boss: hh.clan_boss ?? undefined,
        arena_offense: hh.arena_rating ?? undefined,
        dungeons: hh.dungeon_overall ?? undefined,
        hydra: hh.hydra ?? undefined,
      },
    };

    champions.push(champion);
  }

  console.log(`\nMerged total: ${champions.length} unique champions`);

  // Step 4: Fetch skills from HellHades (batch with rate limiting)
  console.log("\nFetching skills from HellHades (this may take a few minutes)...");
  let skillsFetched = 0;
  const BATCH_SIZE = 20;
  const BATCH_DELAY = 500; // ms between batches

  for (let i = 0; i < champions.length; i += BATCH_SIZE) {
    const batch = champions.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (champ) => {
        const hh = hhByName.get(champ.name.toLowerCase().trim());
        if (!hh) return;

        const skills = await fetchHellHadesSkills(hh.heroId);
        if (skills.length > 0) {
          champ.skills = skills.map((s) => ({
            name: s.name,
            description: stripHtml(s.description),
            cooldown: s.cooldown ? (typeof s.cooldown === "number" ? s.cooldown : parseInt(s.cooldown)) || undefined : undefined,
          }));
          skillsFetched++;
        }
      })
    );

    if (i + BATCH_SIZE < champions.length) {
      process.stdout.write(`  ${Math.min(i + BATCH_SIZE, champions.length)}/${champions.length} processed\r`);
      await new Promise((r) => setTimeout(r, BATCH_DELAY));
    }
  }

  console.log(`\nSkills fetched for ${skillsFetched} champions`);

  // Step 5: Write to file
  const outPath = resolve(__dirname, "../src/data/champions.json");
  writeFileSync(outPath, JSON.stringify(champions, null, 2));
  console.log(`\nWrote ${champions.length} champions to ${outPath}`);
}

function generateMockData() {
  const mockChampions: Champion[] = [
    {
      id: "athel", name: "Athel", slug: "athel", faction: "The Sacred Order",
      affinity: "Magic", rarity: "Rare", role: "Attack", avatar_url: "",
      stats: { "6": { hp: 13710, atk: 1398, def: 1002, spd: 100, crit_rate: 15, crit_dmg: 57, res: 30, acc: 0 } },
      skills: [
        { name: "Strike Down", description: "Attacks 1 enemy. Has a 30% chance of placing a 25% [Weaken] debuff for 2 turns.", cooldown: undefined },
        { name: "Higher Blessing", description: "Attacks all enemies. Places a 25% [Increase ATK] buff on all allies for 2 turns.", cooldown: 4 },
        { name: "Divine Blades", description: "Attacks 1 enemy 3 times.", cooldown: 5 },
      ],
      ratings: { overall: 3.5, clan_boss: 3, arena_offense: 3, dungeons: 3 },
    },
    {
      id: "kael", name: "Kael", slug: "kael", faction: "Dark Elves",
      affinity: "Magic", rarity: "Rare", role: "Attack", avatar_url: "",
      stats: { "6": { hp: 13710, atk: 1200, def: 1002, spd: 103, crit_rate: 15, crit_dmg: 57, res: 30, acc: 0 } },
      skills: [
        { name: "Dark Bolt", description: "Attacks 1 enemy. Has a 40% chance of placing a 2.5% [Poison] debuff for 2 turns.", cooldown: undefined },
        { name: "Acid Rain", description: "Attacks all enemies. Has a 40% chance of placing a 2.5% [Poison] debuff for 2 turns.", cooldown: 4 },
        { name: "Disintegrate", description: "Attacks 1 enemy 4 times. Each hit has a 75% chance of placing a 5% [Poison] debuff for 2 turns.", cooldown: 5 },
      ],
      ratings: { overall: 4, clan_boss: 4, arena_offense: 3, dungeons: 4 },
    },
  ];

  const outPath = resolve(__dirname, "../src/data/champions.json");
  writeFileSync(outPath, JSON.stringify(mockChampions, null, 2));
  console.log(`Wrote ${mockChampions.length} mock champions to ${outPath}`);
}

main().catch(console.error);
