import { Champion } from "@/types/champion";
import { RARITY_ORDER } from "@/lib/constants";
import championsData from "@/data/champions.json";

const champions: Champion[] = championsData as Champion[];

export function getAllChampions(): Champion[] {
  return champions;
}

export function getChampionBySlug(slug: string): Champion | undefined {
  return champions.find((c) => c.slug === slug);
}

export function getUniqueFactions(): string[] {
  return [...new Set(champions.map((c) => c.faction))].sort();
}

export function getUniqueAffinities(): string[] {
  return [...new Set(champions.map((c) => c.affinity))].sort();
}

export function getUniqueRarities(): string[] {
  const unique = [...new Set(champions.map((c) => c.rarity))];
  return unique.sort((a, b) => RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b));
}

export function getUniqueRoles(): string[] {
  return [...new Set(champions.map((c) => c.role))].sort();
}
