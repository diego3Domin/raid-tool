export const GUIDE_CONTENT_AREAS = [
  "General",
  "Clan Boss",
  "Arena",
  "Dungeons",
  "Hydra",
  "Doom Tower",
  "Faction Wars",
] as const;

export type GuideContentArea = (typeof GUIDE_CONTENT_AREAS)[number];

export const MASTERY_TREES = [
  "Offense + Support",
  "Offense + Defense",
  "Defense + Support",
  "Defense + Offense",
  "Support + Offense",
  "Support + Defense",
] as const;

export type MasteryTree = (typeof MASTERY_TREES)[number];

export interface ChampionGuide {
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
