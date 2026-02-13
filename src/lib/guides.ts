import type { ChampionGuide, GuideContentArea } from "@/types/guide";
import type { ChampionRating } from "@/types/champion";
import guidesData from "@/data/guides.json";

const guides = guidesData as Record<string, ChampionGuide[]>;

/** Maps guide content areas to the champion rating field(s) used for filtering */
const CONTENT_AREA_TO_RATING: Record<GuideContentArea, keyof ChampionRating | "arena" | null> = {
  General: null,
  "Clan Boss": "clan_boss",
  Arena: "arena",
  Dungeons: "dungeons",
  Hydra: "hydra",
  "Doom Tower": "doom_tower",
  "Faction Wars": "faction_wars",
};

const MIN_RATING = 2.5;

export function getGuidesForChampion(slug: string): ChampionGuide[] {
  return guides[slug] ?? [];
}

/** Returns guides filtered to content areas where the champion is rated B-tier (≥2.5) or higher */
export function getFilteredGuidesForChampion(slug: string, ratings: ChampionRating): ChampionGuide[] {
  const allGuides = getGuidesForChampion(slug);
  return allGuides.filter((guide) => {
    const ratingKey = CONTENT_AREA_TO_RATING[guide.content_area];
    if (ratingKey === null) return true; // Always show General
    if (ratingKey === "arena") {
      return (ratings.arena_offense ?? 0) >= MIN_RATING;
    }
    return (ratings[ratingKey] ?? 0) >= MIN_RATING;
  });
}

export function getAllGuidedChampionSlugs(): string[] {
  return Object.keys(guides);
}

export function getGuideCount(): number {
  return Object.values(guides).reduce((sum, arr) => sum + arr.length, 0);
}
