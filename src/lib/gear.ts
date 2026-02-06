// Gear data model for RAID: Shadow Legends

export type GearSlot = "Weapon" | "Helmet" | "Shield" | "Gauntlets" | "Chestplate" | "Boots";

export type MainStat =
  | "ATK" | "ATK%" | "DEF" | "DEF%" | "HP" | "HP%"
  | "SPD" | "C.RATE" | "C.DMG" | "RES" | "ACC";

export type SubStat = MainStat;

export const GEAR_SLOTS: GearSlot[] = [
  "Weapon", "Helmet", "Shield", "Gauntlets", "Chestplate", "Boots",
];

// Which main stats each slot can have
export const SLOT_MAIN_STATS: Record<GearSlot, MainStat[]> = {
  Weapon: ["ATK"],
  Helmet: ["HP"],
  Shield: ["DEF"],
  Gauntlets: ["HP%", "ATK%", "DEF%", "C.RATE", "C.DMG"],
  Chestplate: ["HP%", "ATK%", "DEF%", "RES", "ACC"],
  Boots: ["HP%", "ATK%", "DEF%", "SPD"],
};

export const ALL_SUBSTATS: SubStat[] = [
  "ATK", "ATK%", "DEF", "DEF%", "HP", "HP%",
  "SPD", "C.RATE", "C.DMG", "RES", "ACC",
];

export interface GearSet {
  name: string;
  pieces: 2 | 4;
  bonus: string;
  category: "Offense" | "Defense" | "Utility" | "Mythical";
}

export const GEAR_SETS: GearSet[] = [
  // 4-piece offense
  { name: "Lifesteal", pieces: 4, bonus: "30% heal from damage dealt", category: "Offense" },
  { name: "Destroy", pieces: 4, bonus: "Reduce Max HP by 40% of damage", category: "Offense" },
  { name: "Retaliation", pieces: 4, bonus: "25% chance to counter-attack", category: "Offense" },
  { name: "Savage", pieces: 4, bonus: "Ignore 25% DEF", category: "Offense" },
  { name: "Relentless", pieces: 4, bonus: "18% chance of extra turn", category: "Offense" },
  { name: "Fury", pieces: 4, bonus: "Increase DMG by 5% per debuff", category: "Offense" },
  { name: "Stun", pieces: 4, bonus: "18% chance to stun on AoE", category: "Offense" },
  { name: "Toxic", pieces: 4, bonus: "Place 2.5% Poison on hit", category: "Offense" },
  { name: "Frost", pieces: 4, bonus: "20% chance to Freeze", category: "Offense" },
  { name: "Daze", pieces: 4, bonus: "25% chance to place Sleep", category: "Offense" },
  { name: "Cursed", pieces: 4, bonus: "50% chance to place 50% Heal Reduction", category: "Offense" },
  { name: "Bloodthirst", pieces: 4, bonus: "Lifesteal + extra turn on kill", category: "Offense" },
  { name: "Lethal", pieces: 4, bonus: "Increase C.DMG by 10% per dead ally", category: "Offense" },
  { name: "Stone Skin", pieces: 4, bonus: "Start battle with Stone Skin buff", category: "Defense" },
  { name: "Swift Parry", pieces: 4, bonus: "Unkillable buff at start", category: "Defense" },
  { name: "Guardian", pieces: 4, bonus: "Take 10% of ally damage", category: "Defense" },
  { name: "Regeneration", pieces: 4, bonus: "Heal 15% HP per turn", category: "Defense" },
  { name: "Stalwart", pieces: 4, bonus: "Reduce AoE damage by 30%", category: "Defense" },
  { name: "Reflex", pieces: 4, bonus: "30% chance to reduce cooldowns", category: "Utility" },
  { name: "Immunity", pieces: 4, bonus: "Block Debuffs for 2 turns", category: "Defense" },
  // 2-piece sets
  { name: "Offense", pieces: 2, bonus: "+15% ATK", category: "Offense" },
  { name: "Defense", pieces: 2, bonus: "+15% DEF", category: "Defense" },
  { name: "Life", pieces: 2, bonus: "+15% HP", category: "Defense" },
  { name: "Speed", pieces: 2, bonus: "+12% SPD", category: "Utility" },
  { name: "Critical Rate", pieces: 2, bonus: "+12% C.RATE", category: "Offense" },
  { name: "Critical Damage", pieces: 2, bonus: "+6% C.DMG (Mythical)", category: "Offense" },
  { name: "Accuracy", pieces: 2, bonus: "+40 ACC", category: "Utility" },
  { name: "Resistance", pieces: 2, bonus: "+40 RES", category: "Defense" },
  { name: "Perception", pieces: 2, bonus: "+40 ACC, +5% SPD", category: "Utility" },
  { name: "Cruel", pieces: 2, bonus: "+15% ATK, ignore 5% DEF", category: "Offense" },
  { name: "Immortal", pieces: 2, bonus: "+15% HP, heal 3%/turn", category: "Defense" },
  { name: "Divine Offense", pieces: 2, bonus: "+15% ATK, 5% Shield", category: "Offense" },
  { name: "Divine Critical Rate", pieces: 2, bonus: "+12% C.RATE, 5% Shield", category: "Offense" },
  { name: "Divine Life", pieces: 2, bonus: "+15% HP, 5% Shield", category: "Defense" },
  { name: "Divine Speed", pieces: 2, bonus: "+12% SPD, 5% Shield", category: "Utility" },
  { name: "Resilience", pieces: 2, bonus: "+10% HP, +10% DEF", category: "Defense" },
  { name: "Deflection", pieces: 2, bonus: "Transfer 1 debuff to attacker", category: "Defense" },
  { name: "Avenging", pieces: 2, bonus: "+10% C.RATE for counter-attacks", category: "Offense" },
  { name: "Bolster", pieces: 2, bonus: "Shield equal to 6% Max HP", category: "Defense" },
  { name: "Curing", pieces: 2, bonus: "+20% healing received", category: "Defense" },
  { name: "Untouchable", pieces: 2, bonus: "+40 RES, +5% SPD", category: "Defense" },
];

// Stat priorities for recommendations
export type StatPriority = "SPD" | "HP%" | "ATK%" | "DEF%" | "C.RATE" | "C.DMG" | "ACC" | "RES";

export const STAT_PRIORITIES: StatPriority[] = [
  "SPD", "HP%", "ATK%", "DEF%", "C.RATE", "C.DMG", "ACC", "RES",
];

export const STAT_LABELS: Record<StatPriority, string> = {
  "SPD": "Speed",
  "HP%": "HP%",
  "ATK%": "ATK%",
  "DEF%": "DEF%",
  "C.RATE": "Crit Rate",
  "C.DMG": "Crit Damage",
  "ACC": "Accuracy",
  "RES": "Resistance",
};

// Content-specific gear recommendations
export const CONTENT_GEAR_PROFILES: Record<string, {
  description: string;
  primaryStats: StatPriority[];
  recommendedSets: string[];
}> = {
  "Clan Boss": {
    description: "Sustain, speed-tuned, Poison/debuff focused",
    primaryStats: ["SPD", "DEF%", "HP%", "ACC"],
    recommendedSets: ["Lifesteal", "Speed", "Accuracy", "Perception", "Immortal"],
  },
  "Arena Offense": {
    description: "Nuke or speed lead — fast, high damage",
    primaryStats: ["SPD", "ATK%", "C.RATE", "C.DMG"],
    recommendedSets: ["Savage", "Cruel", "Speed", "Critical Damage", "Offense"],
  },
  "Arena Defense": {
    description: "Tanky, disruptive, hard to nuke",
    primaryStats: ["SPD", "HP%", "DEF%", "RES"],
    recommendedSets: ["Stone Skin", "Swift Parry", "Immunity", "Resilience", "Resistance"],
  },
  "Dragon": {
    description: "Speed clear with AoE damage + sustain",
    primaryStats: ["SPD", "ATK%", "C.RATE", "ACC"],
    recommendedSets: ["Savage", "Speed", "Accuracy", "Lifesteal"],
  },
  "Spider": {
    description: "HP burn, enemy MAX HP, or AoE burst",
    primaryStats: ["SPD", "ACC", "HP%", "C.RATE"],
    recommendedSets: ["Speed", "Accuracy", "Perception", "Lifesteal"],
  },
  "Fire Knight": {
    description: "Multi-hit A1, turn meter reduction",
    primaryStats: ["SPD", "ACC", "ATK%", "C.RATE"],
    recommendedSets: ["Reflex", "Speed", "Accuracy", "Retaliation"],
  },
  "Ice Golem": {
    description: "Sustain through reflects, revive support",
    primaryStats: ["SPD", "HP%", "DEF%", "ACC"],
    recommendedSets: ["Regeneration", "Lifesteal", "Immortal", "Resilience"],
  },
  "Hydra": {
    description: "Complex mechanics — sustain + damage",
    primaryStats: ["SPD", "HP%", "ACC", "C.RATE"],
    recommendedSets: ["Relentless", "Reflex", "Speed", "Perception"],
  },
  "Doom Tower": {
    description: "Boss-dependent — varies widely",
    primaryStats: ["SPD", "HP%", "ACC", "DEF%"],
    recommendedSets: ["Speed", "Perception", "Lifesteal", "Regeneration"],
  },
  "Iron Twins": {
    description: "Shield break + sustain",
    primaryStats: ["SPD", "HP%", "DEF%", "ACC"],
    recommendedSets: ["Destroy", "Speed", "Immortal", "Resilience"],
  },
};
