import { Champion } from "@/types/champion";
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
  return [...new Set(champions.map((c) => c.rarity))];
}

export function getUniqueRoles(): string[] {
  return [...new Set(champions.map((c) => c.role))].sort();
}
