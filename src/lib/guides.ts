import type { ChampionGuide } from "@/types/guide";
import guidesData from "@/data/guides.json";

const guides = guidesData as Record<string, ChampionGuide[]>;

export function getGuidesForChampion(slug: string): ChampionGuide[] {
  return guides[slug] ?? [];
}

export function getAllGuidedChampionSlugs(): string[] {
  return Object.keys(guides);
}

export function getGuideCount(): number {
  return Object.values(guides).reduce((sum, arr) => sum + arr.length, 0);
}
