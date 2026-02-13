export interface MasteryNode {
  id: string;
  name: string;
  tree: "Offense" | "Defense" | "Support";
  tier: number;
  description: string;
}

// ── Offense Tree (17 nodes) ───────────────────────────────

export const OFFENSE_TREE: MasteryNode[] = [
  // Tier 1
  { id: "blade_disciple", name: "Blade Disciple", tree: "Offense", tier: 1, description: "Increases ally ATK by 75" },
  { id: "keen_strike", name: "Keen Strike", tree: "Offense", tier: 1, description: "Increases C.RATE by 5%" },
  // Tier 2
  { id: "heart_of_glory", name: "Heart of Glory", tree: "Offense", tier: 2, description: "+5% DMG when HP is above 50%" },
  { id: "single_out", name: "Single Out", tree: "Offense", tier: 2, description: "+8% DMG vs targets with higher MAX HP" },
  { id: "life_drinker", name: "Life Drinker", tree: "Offense", tier: 2, description: "+5% Lifesteal" },
  // Tier 3
  { id: "bring_it_down", name: "Bring It Down", tree: "Offense", tier: 3, description: "+6% DMG vs targets with higher DEF" },
  { id: "methodical", name: "Methodical", tree: "Offense", tier: 3, description: "+3% DMG per buff or debuff on target" },
  { id: "whirlwind_of_death", name: "Whirlwind of Death", tree: "Offense", tier: 3, description: "Increases C.RATE by 6%" },
  // Tier 4
  { id: "cycle_of_violence", name: "Cycle of Violence", tree: "Offense", tier: 4, description: "5% chance to reduce skill cooldown on critical hit" },
  { id: "kill_streak", name: "Kill Streak", tree: "Offense", tier: 4, description: "+6% DMG per kill in the round" },
  { id: "blood_shield", name: "Blood Shield", tree: "Offense", tier: 4, description: "15% chance to place a Shield buff on kill" },
  // Tier 5
  { id: "ruthless_ambush", name: "Ruthless Ambush", tree: "Offense", tier: 5, description: "+6% DMG on first hit each round" },
  { id: "opportunist", name: "Opportunist", tree: "Offense", tier: 5, description: "+6% DMG vs stunned, frozen, or sleeping targets" },
  { id: "wrath_of_the_slain", name: "Wrath of the Slain", tree: "Offense", tier: 5, description: "+5% DMG per dead ally" },
  // Tier 6 (Capstones)
  { id: "warmaster", name: "Warmaster", tree: "Offense", tier: 6, description: "60% chance to deal bonus DMG equal to 10% of enemy MAX HP per hit (75K cap vs bosses)" },
  { id: "giant_slayer", name: "Giant Slayer", tree: "Offense", tier: 6, description: "30% chance per hit to deal bonus DMG equal to 5% of enemy MAX HP (75K cap vs bosses)" },
  { id: "helmsmasher", name: "Helmsmasher", tree: "Offense", tier: 6, description: "25% chance to ignore 100% of target's DEF" },
];

// ── Defense Tree (17 nodes) ───────────────────────────────

export const DEFENSE_TREE: MasteryNode[] = [
  // Tier 1
  { id: "tough_skin", name: "Tough Skin", tree: "Defense", tier: 1, description: "Increases DEF by 75" },
  { id: "blastproof", name: "Blastproof", tree: "Defense", tier: 1, description: "Reduces AoE damage taken by 5%" },
  // Tier 2
  { id: "rejuvenation", name: "Rejuvenation", tree: "Defense", tier: 2, description: "Heals 3% HP per turn" },
  { id: "shadow_heal", name: "Shadow Heal", tree: "Defense", tier: 2, description: "Heals 5% HP when hit with a critical hit" },
  { id: "mighty_endurance", name: "Mighty Endurance", tree: "Defense", tier: 2, description: "Reduces damage taken by 5%" },
  // Tier 3
  { id: "resurgent", name: "Resurgent", tree: "Defense", tier: 3, description: "5% chance to remove a random debuff each turn" },
  { id: "harvest_despair", name: "Harvest Despair", tree: "Defense", tier: 3, description: "25% chance to place a Stun when removing a buff from an enemy" },
  { id: "delay_death", name: "Delay Death", tree: "Defense", tier: 3, description: "+10% chance to survive a fatal hit with 1 HP" },
  // Tier 4
  { id: "retribution", name: "Retribution", tree: "Defense", tier: 4, description: "25% chance to counterattack when hit" },
  { id: "deterrence", name: "Deterrence", tree: "Defense", tier: 4, description: "25% chance to counterattack when an ally is hit" },
  { id: "unshakeable", name: "Unshakeable", tree: "Defense", tier: 4, description: "Increases RES by 50" },
  // Tier 5
  { id: "fearsome_presence", name: "Fearsome Presence", tree: "Defense", tier: 5, description: "Decreases enemy ACC by 30" },
  { id: "stubbornness", name: "Stubbornness", tree: "Defense", tier: 5, description: "Increases RES by 10 for each hit taken per round" },
  { id: "iron_skin", name: "Iron Skin", tree: "Defense", tier: 5, description: "Increases DEF by 120" },
  // Tier 6 (Capstones)
  { id: "bulwark", name: "Bulwark", tree: "Defense", tier: 6, description: "15% chance to place a random debuff on the attacker when hit" },
  { id: "unbreakable_will", name: "Unbreakable Will", tree: "Defense", tier: 6, description: "50% chance to resist a debuff when HP is below 25%" },
  { id: "selfless_defender", name: "Selfless Defender", tree: "Defense", tier: 6, description: "25% chance to intercept damage dealt to an ally" },
];

// ── Support Tree (17 nodes) ──────────────────────────────

export const SUPPORT_TREE: MasteryNode[] = [
  // Tier 1
  { id: "pinpoint_accuracy", name: "Pinpoint Accuracy", tree: "Support", tier: 1, description: "Increases ACC by 10" },
  { id: "steadfast", name: "Steadfast", tree: "Support", tier: 1, description: "Increases HP by 810" },
  // Tier 2
  { id: "charged_focus", name: "Charged Focus", tree: "Support", tier: 2, description: "Increases ACC by 20" },
  { id: "arcane_celerity", name: "Arcane Celerity", tree: "Support", tier: 2, description: "15% chance to increase Turn Meter by 10% when placing a buff" },
  { id: "exalt_in_death", name: "Exalt in Death", tree: "Support", tier: 2, description: "Transfers all buffs to a random ally on death" },
  // Tier 3
  { id: "rapid_response", name: "Rapid Response", tree: "Support", tier: 3, description: "15% chance to increase Turn Meter by 10% when hit" },
  { id: "swarm_smiter", name: "Swarm Smiter", tree: "Support", tier: 3, description: "+5% DMG for each alive ally" },
  { id: "lore_of_steel", name: "Lore of Steel", tree: "Support", tier: 3, description: "+15% to set bonuses from artifacts" },
  // Tier 4
  { id: "evil_eye", name: "Evil Eye", tree: "Support", tier: 4, description: "Reduces enemy Turn Meter by 2.5% on default skill" },
  { id: "master_hexer", name: "Master Hexer", tree: "Support", tier: 4, description: "+10% chance to extend debuff duration by 1 turn" },
  { id: "spirit_haste", name: "Spirit Haste", tree: "Support", tier: 4, description: "Increases SPD by 12 for each dead ally" },
  // Tier 5
  { id: "lasting_gifts", name: "Lasting Gifts", tree: "Support", tier: 5, description: "+10% chance to extend buff duration by 1 turn" },
  { id: "sniper", name: "Sniper", tree: "Support", tier: 5, description: "+5% chance when placing debuffs" },
  { id: "merciful_aid", name: "Merciful Aid", tree: "Support", tier: 5, description: "+15% to healing" },
  // Tier 6 (Capstones)
  { id: "eagle_eye", name: "Eagle-Eye", tree: "Support", tier: 6, description: "Increases ACC by 50" },
  { id: "oppressor", name: "Oppressor", tree: "Support", tier: 6, description: "Reduces enemy Turn Meter by 5% on critical hit" },
  { id: "cycle_of_magic", name: "Cycle of Magic", tree: "Support", tier: 6, description: "15% chance to reduce a random skill cooldown by 1 turn when hit" },
];

// ── Helpers ───────────────────────────────────────────────

export const ALL_TREES: Record<string, MasteryNode[]> = {
  Offense: OFFENSE_TREE,
  Defense: DEFENSE_TREE,
  Support: SUPPORT_TREE,
};

export function getNodesByTier(tree: MasteryNode[], tier: number): MasteryNode[] {
  return tree.filter((n) => n.tier === tier);
}

// ── Build Templates ──────────────────────────────────────

type TreeName = "Offense" | "Defense" | "Support";

interface MasteryBuild {
  primaryTree: TreeName;
  secondaryTree: TreeName;
  selectedNodes: string[];
}

const BUILD_TEMPLATES: Record<string, MasteryBuild> = {
  // ATK champions — General, Arena, Dungeons, Hydra
  offense_support: {
    primaryTree: "Offense",
    secondaryTree: "Support",
    selectedNodes: [
      // Offense T1–T6
      "blade_disciple", "heart_of_glory", "whirlwind_of_death",
      "cycle_of_violence", "wrath_of_the_slain", "warmaster",
      // Support T1–T5
      "pinpoint_accuracy", "charged_focus", "swarm_smiter",
      "evil_eye", "lasting_gifts",
    ],
  },
  // ATK champions — Clan Boss
  offense_defense: {
    primaryTree: "Offense",
    secondaryTree: "Defense",
    selectedNodes: [
      // Offense T1–T6
      "blade_disciple", "heart_of_glory", "single_out",
      "bring_it_down", "kill_streak", "warmaster",
      // Defense T1–T5
      "tough_skin", "rejuvenation", "shadow_heal",
      "delay_death", "retribution",
    ],
  },
  // DEF/HP tanks
  defense_support: {
    primaryTree: "Defense",
    secondaryTree: "Support",
    selectedNodes: [
      // Defense T1–T6
      "tough_skin", "rejuvenation", "harvest_despair",
      "retribution", "fearsome_presence", "bulwark",
      // Support T1–T5
      "pinpoint_accuracy", "charged_focus", "swarm_smiter",
      "evil_eye", "lasting_gifts",
    ],
  },
  // Support champions
  support_defense: {
    primaryTree: "Support",
    secondaryTree: "Defense",
    selectedNodes: [
      // Support T1–T6
      "pinpoint_accuracy", "charged_focus", "swarm_smiter",
      "evil_eye", "lasting_gifts", "eagle_eye",
      // Defense T1–T5
      "tough_skin", "rejuvenation", "shadow_heal",
      "delay_death", "retribution",
    ],
  },
  // Support + Offense variant
  support_offense: {
    primaryTree: "Support",
    secondaryTree: "Offense",
    selectedNodes: [
      // Support T1–T6
      "pinpoint_accuracy", "charged_focus", "swarm_smiter",
      "evil_eye", "lasting_gifts", "oppressor",
      // Offense T1–T5
      "blade_disciple", "heart_of_glory", "whirlwind_of_death",
      "kill_streak", "ruthless_ambush",
    ],
  },
  // Defense + Offense variant
  defense_offense: {
    primaryTree: "Defense",
    secondaryTree: "Offense",
    selectedNodes: [
      // Defense T1–T6
      "tough_skin", "rejuvenation", "harvest_despair",
      "retribution", "fearsome_presence", "bulwark",
      // Offense T1–T5
      "blade_disciple", "heart_of_glory", "whirlwind_of_death",
      "kill_streak", "ruthless_ambush",
    ],
  },
};

// Default fallback build
const FALLBACK_BUILD: MasteryBuild = BUILD_TEMPLATES.offense_support;

/**
 * Derive a recommended mastery build from the guide's mastery tree string
 * (e.g. "Offense + Support") and the champion's role (e.g. "Attack").
 */
export function getMasteryBuild(masteryTree: string, _role: string): MasteryBuild {
  // Convert "Offense + Support" → "offense_support"
  const key = masteryTree
    .toLowerCase()
    .replace(/\s*\+\s*/g, "_")
    .trim();

  return BUILD_TEMPLATES[key] ?? FALLBACK_BUILD;
}
