export type Affinity = "Magic" | "Force" | "Spirit" | "Void";
export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythical";
export type Role = "Attack" | "Defense" | "HP" | "Support";

export interface ChampionStats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  crit_rate: number;
  crit_dmg: number;
  res: number;
  acc: number;
}

export interface ChampionSkill {
  name: string;
  description: string;
  multiplier?: string;
  cooldown?: number;
  effects?: string[];
}

export interface ChampionRating {
  overall?: number;
  clan_boss?: number;
  hydra?: number;
  chimera?: number;
  arena_offense?: number;
  dungeons?: number;
  spider?: number;
  dragon?: number;
  fire_knight?: number;
  ice_golem?: number;
  iron_twins?: number;
  sand_devil?: number;
  phantom_grove?: number;
  doom_tower?: number;
  faction_wars?: number;
}

export interface Champion {
  id: string;
  name: string;
  slug: string;
  faction: string;
  affinity: Affinity;
  rarity: Rarity;
  role: Role;
  avatar_url?: string;
  stats: Record<string, ChampionStats>; // keyed by star level e.g. "6"
  skills: ChampionSkill[];
  ratings: ChampionRating;
}
