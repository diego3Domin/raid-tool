/**
 * Generate structured build guides for all RAID champions.
 * Uses champion data (role, ratings, affinity) + RAID game knowledge heuristics.
 *
 * Usage: npx tsx scripts/generate-guides.ts
 */

import * as fs from "fs";
import * as path from "path";

interface Champion {
  name: string;
  slug: string;
  role: string;
  rarity: string;
  affinity: string;
  faction: string;
  ratings: Record<string, number>;
  skills: Array<{ name: string; description?: string }>;
}

interface ChampionGuide {
  content_area: string;
  gear_sets: string[];
  stat_priorities: string[];
  gauntlets_main: string;
  chestplate_main: string;
  boots_main: string;
  skill_booking_order?: number[];
  mastery_tree: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// RAID Game Knowledge — Role-based build templates
// ---------------------------------------------------------------------------

const ROLE_TEMPLATES: Record<string, {
  gear_sets: string[];
  stat_priorities: string[];
  gauntlets_main: string;
  chestplate_main: string;
  boots_main: string;
  mastery_tree: string;
}> = {
  // ATK-based damage dealers
  "Attack": {
    gear_sets: ["Savage", "Cruel"],
    stat_priorities: ["SPD", "ATK%", "C.RATE", "C.DMG"],
    gauntlets_main: "C.RATE",
    chestplate_main: "ATK%",
    boots_main: "SPD",
    mastery_tree: "Offense + Support",
  },
  // DEF-based champions
  "Defense": {
    gear_sets: ["Speed", "Resilience"],
    stat_priorities: ["SPD", "DEF%", "HP%", "ACC"],
    gauntlets_main: "DEF%",
    chestplate_main: "DEF%",
    boots_main: "SPD",
    mastery_tree: "Defense + Support",
  },
  // HP-based champions
  "HP": {
    gear_sets: ["Immortal", "Speed"],
    stat_priorities: ["SPD", "HP%", "DEF%", "ACC"],
    gauntlets_main: "HP%",
    chestplate_main: "HP%",
    boots_main: "SPD",
    mastery_tree: "Defense + Support",
  },
  // Support/debuffers
  "Support": {
    gear_sets: ["Speed", "Perception"],
    stat_priorities: ["SPD", "ACC", "HP%", "DEF%"],
    gauntlets_main: "HP%",
    chestplate_main: "HP%",
    boots_main: "SPD",
    mastery_tree: "Support + Defense",
  },
};

// Fallback for unusual roles (ATK, DEF from HH data)
const ROLE_ALIASES: Record<string, string> = {
  "ATK": "Attack",
  "DEF": "Defense",
};

// Content-area specific overrides
const CONTENT_BUILDS: Record<string, {
  gear_sets_atk: string[];
  gear_sets_def: string[];
  gear_sets_hp: string[];
  gear_sets_support: string[];
  stat_focus: string[];
  note_suffix: string;
}> = {
  "Clan Boss": {
    gear_sets_atk: ["Savage", "Cruel"],
    gear_sets_def: ["Speed", "Accuracy"],
    gear_sets_hp: ["Speed", "Immortal"],
    gear_sets_support: ["Speed", "Perception"],
    stat_focus: ["SPD", "DEF%", "HP%", "ACC"],
    note_suffix: "Speed-tune to your Clan Boss team composition — this is mandatory for advanced CB. Unkillable/Myth teams prioritize damage sets (Savage/Cruel) on DPS and Speed/Accuracy for debuffers. Traditional teams without unkillable may prefer Lifesteal for sustain.",
  },
  "Arena": {
    gear_sets_atk: ["Lethal", "Cruel"],
    gear_sets_def: ["Stoneskin", "Resilience"],
    gear_sets_hp: ["Stoneskin", "Immortal"],
    gear_sets_support: ["Speed", "Perception"],
    stat_focus: ["SPD", "ATK%", "C.RATE", "C.DMG"],
    note_suffix: "Speed is king in Arena — go first or build tanky enough to survive the opener. Lethal/Savage sets maximize burst damage for nukers. Stoneskin dominates the defensive meta — build high resistance on defense teams.",
  },
  "Dungeons": {
    gear_sets_atk: ["Savage", "Speed"],
    gear_sets_def: ["Speed", "Accuracy"],
    gear_sets_hp: ["Regeneration", "Immortal"],
    gear_sets_support: ["Speed", "Perception"],
    stat_focus: ["SPD", "ACC", "HP%", "C.RATE"],
    note_suffix: "Balance speed with survivability for consistent dungeon clears. Spider benefits from HP Burn or Enemy MAX HP champions. Fire Knight rewards multi-hitters in Relentless. Ice Golem needs block buffs or buff removal.",
  },
  "Hydra": {
    gear_sets_atk: ["Savage", "Perception"],
    gear_sets_def: ["Speed", "Perception"],
    gear_sets_hp: ["Regeneration", "Perception"],
    gear_sets_support: ["Relentless", "Perception"],
    stat_focus: ["SPD", "ACC", "HP%", "DEF%"],
    note_suffix: "Accuracy is critical for landing debuffs on Hydra heads — aim for 350+ on Normal, 400+ on Hard. Relentless is strong for champions with key cooldowns or frequent debuffs. Build tanky to survive head slams and AoE damage.",
  },
  "Doom Tower": {
    gear_sets_atk: ["Savage", "Perception"],
    gear_sets_def: ["Speed", "Perception"],
    gear_sets_hp: ["Regeneration", "Perception"],
    gear_sets_support: ["Speed", "Perception"],
    stat_focus: ["SPD", "ACC", "HP%", "DEF%"],
    note_suffix: "Doom Tower requires boss-specific builds. Bommal needs Destroy set. Celestial Griffin needs high resistance (300+). Frost Spider needs HP Burn immunity or strong healing. Waves benefit from crowd control and high accuracy.",
  },
  "Faction Wars": {
    gear_sets_atk: ["Lifesteal", "Speed"],
    gear_sets_def: ["Speed", "Immortal"],
    gear_sets_hp: ["Lifesteal", "Immortal"],
    gear_sets_support: ["Speed", "Perception"],
    stat_focus: ["SPD", "HP%", "ACC", "DEF%"],
    note_suffix: "Faction Wars limits your roster to one faction, so survivability and self-sustain are key. Having a reviver, healer, and crowd control matters more than gear sets. Damage dealers can use Savage/Cruel if survivability is covered by the team.",
  },
};

// ---------------------------------------------------------------------------
// Notes generation — role + ratings based
// ---------------------------------------------------------------------------

function getRoleCategory(role: string): string {
  return ROLE_ALIASES[role] || role;
}

const MIN_RATING = 2.5; // B-tier threshold

/** Returns all content areas where the champion qualifies (rating >= B-tier) */
function getQualifyingContentAreas(ratings: Record<string, number>): string[] {
  const areas: string[] = [];
  if ((ratings.clan_boss || 0) >= MIN_RATING) areas.push("Clan Boss");
  if (Math.max(ratings.arena_offense || 0, ratings.arena_defense || 0) >= MIN_RATING) areas.push("Arena");
  if ((ratings.dungeons || 0) >= MIN_RATING) areas.push("Dungeons");
  if ((ratings.hydra || 0) >= MIN_RATING) areas.push("Hydra");
  if ((ratings.doom_tower || 0) >= MIN_RATING) areas.push("Doom Tower");
  if ((ratings.faction_wars || 0) >= MIN_RATING) areas.push("Faction Wars");
  return areas;
}

function generateGeneralNote(champ: Champion): string {
  const role = getRoleCategory(champ.role);
  const overall = champ.ratings.overall || 0;

  const tierWord = overall >= 4.5 ? "top-tier" : overall >= 4 ? "strong" : overall >= 3 ? "solid" : "niche";

  const roleDesc: Record<string, string> = {
    "Attack": `${champ.name} is a ${tierWord} damage dealer who excels at dealing burst or sustained damage.`,
    "Defense": `${champ.name} is a ${tierWord} defensive champion who provides tankiness and control for the team.`,
    "HP": `${champ.name} is a ${tierWord} HP-based champion who brings durability and sustain to the roster.`,
    "Support": `${champ.name} is a ${tierWord} support champion who provides buffs, debuffs, or healing to the team.`,
  };

  let note = roleDesc[role] || `${champ.name} is a ${tierWord} ${champ.rarity.toLowerCase()} champion.`;

  // Add role-specific build advice
  if (role === "Attack") {
    note += " Prioritize critical rate to 100%, then stack critical damage and attack for maximum output. Speed boots ensure consistent turn cycling.";
  } else if (role === "Defense") {
    note += " Build with high defense and HP substats for survivability. Accuracy is important if the kit includes debuffs or crowd control.";
  } else if (role === "HP") {
    note += " Stack HP% and defense substats for maximum survivability. Speed keeps the champion cycling abilities frequently.";
  } else if (role === "Support") {
    note += " Speed and accuracy are the top priorities to ensure debuffs land and abilities cycle quickly. Build tanky enough to survive.";
  }

  return note;
}

function generateContentNote(champ: Champion, area: string): string {
  const role = getRoleCategory(champ.role);
  const contentBuild = CONTENT_BUILDS[area];
  if (!contentBuild) return `Build ${champ.name} for ${area} content with appropriate gear sets.`;

  const roleVerb: Record<string, string> = {
    "Attack": "deals heavy damage in",
    "Defense": "provides defensive utility in",
    "HP": "offers strong survivability in",
    "Support": "enables the team in",
  };

  return `${champ.name} ${roleVerb[role] || "performs well in"} ${area}. ${contentBuild.note_suffix}`;
}

// ---------------------------------------------------------------------------
// Guide generation
// ---------------------------------------------------------------------------

function generateGuideForChampion(champ: Champion): ChampionGuide[] {
  const role = getRoleCategory(champ.role);
  const template = ROLE_TEMPLATES[role] || ROLE_TEMPLATES["Attack"];
  const guides: ChampionGuide[] = [];

  // Skill booking order: prioritize later skills (usually A3 > A2 > A1)
  const numSkills = champ.skills?.length || 0;
  let skillOrder: number[] | undefined;
  if (numSkills >= 3) {
    skillOrder = [numSkills - 1, numSkills - 2]; // Book last skill first, then second-to-last
  } else if (numSkills === 2) {
    skillOrder = [1]; // Book A2
  }

  // 1. General build
  const generalGuide: ChampionGuide = {
    content_area: "General",
    gear_sets: [...template.gear_sets],
    stat_priorities: [...template.stat_priorities],
    gauntlets_main: template.gauntlets_main,
    chestplate_main: template.chestplate_main,
    boots_main: template.boots_main,
    mastery_tree: template.mastery_tree,
    notes: generateGeneralNote(champ),
  };
  if (skillOrder) generalGuide.skill_booking_order = skillOrder;

  // Adjust for starter champions (use Lifesteal for farming)
  if (["kael", "athel", "elhain", "galek"].includes(champ.slug)) {
    generalGuide.gear_sets = ["Lifesteal", "Speed"];
    generalGuide.notes = generalGuide.notes.replace(
      /Prioritize/,
      "As a starter champion, Lifesteal gear is essential for early progression. Prioritize"
    );
  }

  // Adjust for very high rarity + HP/DEF-scaling attack champs in Arena
  if (role === "Attack" && champ.ratings.arena_offense >= 4.5) {
    generalGuide.gear_sets = ["Savage", "Cruel"];
  }

  guides.push(generalGuide);

  // 2. Specialized content builds — one per qualifying area (B-tier / ≥2.5)
  const qualifyingAreas = getQualifyingContentAreas(champ.ratings);
  for (const area of qualifyingAreas) {
    const contentBuild = CONTENT_BUILDS[area];
    if (!contentBuild) continue;

    const gearKey = `gear_sets_${role === "Attack" ? "atk" : role === "Defense" ? "def" : role === "HP" ? "hp" : "support"}` as keyof typeof contentBuild;
    const gearSets = (contentBuild[gearKey] as string[]) || contentBuild.gear_sets_atk;

    // Build stat priorities based on content area + role
    let statPriorities: string[];
    if (area === "Arena" && role === "Attack") {
      statPriorities = ["SPD", "ATK%", "C.RATE", "C.DMG"];
    } else if (area === "Clan Boss") {
      if (role === "Attack") {
        statPriorities = ["SPD", "ATK%", "C.RATE", "C.DMG", "DEF%"];
      } else {
        statPriorities = ["SPD", "DEF%", "HP%", "ACC"];
      }
    } else if (area === "Hydra") {
      if (role === "Attack") {
        statPriorities = ["SPD", "ACC", "C.RATE", "C.DMG", "HP%"];
      } else {
        statPriorities = ["SPD", "ACC", "HP%", "DEF%"];
      }
    } else {
      statPriorities = [...(contentBuild.stat_focus as string[])];
    }

    // Main stat adjustments for content area
    let gauntlets = template.gauntlets_main;
    let chestplate = template.chestplate_main;
    const boots = "SPD"; // Always speed boots for specialized builds

    if (area === "Clan Boss") {
      gauntlets = role === "Attack" ? "C.RATE" : "HP%";
      chestplate = role === "Attack" ? "ATK%" : "DEF%";
    } else if (area === "Arena" && role === "Attack") {
      gauntlets = "C.RATE";
      chestplate = "ATK%";
    } else if (area === "Hydra") {
      gauntlets = role === "Attack" ? "C.RATE" : "HP%";
      chestplate = role === "Attack" ? "ATK%" : "ACC";
    } else if (area === "Dungeons") {
      gauntlets = role === "Attack" ? "C.RATE" : template.gauntlets_main;
      chestplate = role === "Support" ? "ACC" : template.chestplate_main;
    }

    // Mastery tree based on content area + role
    let masteryTree = template.mastery_tree;
    if (area === "Clan Boss" && role === "Attack") {
      masteryTree = "Offense + Defense";
    } else if (area === "Arena" && role === "Attack") {
      masteryTree = "Offense + Support";
    } else if (area === "Hydra") {
      masteryTree = role === "Attack" ? "Offense + Support" : template.mastery_tree;
    } else if (area === "Dungeons" && role === "Support") {
      masteryTree = "Support + Defense";
    }

    const contentGuide: ChampionGuide = {
      content_area: area,
      gear_sets: gearSets as string[],
      stat_priorities: statPriorities,
      gauntlets_main: gauntlets,
      chestplate_main: chestplate,
      boots_main: boots,
      mastery_tree: masteryTree,
      notes: generateContentNote(champ, area),
    };
    if (skillOrder) contentGuide.skill_booking_order = skillOrder;

    guides.push(contentGuide);
  }

  // Dedup: drop specialized builds that are identical to General (ignoring content_area and notes)
  const generalGuideKey = guideBuildKey(guides[0]);
  return guides.filter((g, i) => i === 0 || guideBuildKey(g) !== generalGuideKey);
}

/** Fingerprint for comparing build mechanics (ignores content_area and notes) */
function guideBuildKey(g: ChampionGuide): string {
  return JSON.stringify([
    g.gear_sets,
    g.stat_priorities,
    g.gauntlets_main,
    g.chestplate_main,
    g.boots_main,
    g.mastery_tree,
    g.skill_booking_order ?? null,
  ]);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const championsPath = path.join(__dirname, "../src/data/champions.json");
const guidesPath = path.join(__dirname, "../src/data/guides.json");

const champions: Champion[] = JSON.parse(fs.readFileSync(championsPath, "utf-8"));

// Filter to champions with ratings
const withRatings = champions.filter(
  (c) => c.ratings && c.ratings.overall && c.ratings.overall > 0
);

console.log(`Generating guides for ${withRatings.length} champions...`);

const guides: Record<string, ChampionGuide[]> = {};
let totalGuides = 0;
let withSpecialized = 0;
let dedupRemoved = 0;

for (const champ of withRatings) {
  const qualifyingAreas = getQualifyingContentAreas(champ.ratings);
  const champGuides = generateGuideForChampion(champ);
  // +1 for General, compare to qualifying areas to count deduped
  dedupRemoved += (1 + qualifyingAreas.length) - champGuides.length;
  guides[champ.slug] = champGuides;
  totalGuides += champGuides.length;
  if (champGuides.length > 1) withSpecialized++;
}

fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2));

console.log(`\nDone!`);
console.log(`  Champions: ${Object.keys(guides).length}`);
console.log(`  Total guides: ${totalGuides}`);
console.log(`  With specialized build: ${withSpecialized}`);
console.log(`  General only: ${Object.keys(guides).length - withSpecialized}`);
console.log(`  Deduped (identical to General): ${dedupRemoved}`);
console.log(`\nWritten to: ${guidesPath}`);
