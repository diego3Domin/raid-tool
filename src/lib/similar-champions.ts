import { Champion, ChampionRating } from "@/types/champion";
import { getAllChampions } from "@/lib/champions";
import { RARITY_ORDER } from "@/lib/constants";

/** Weights by content importance — higher = more identity-defining */
const RATING_WEIGHTS: Record<keyof ChampionRating, number> = {
  overall: 0,
  clan_boss: 3,
  hydra: 3,
  arena_offense: 3,
  spider: 2,
  fire_knight: 2,
  iron_twins: 2,
  doom_tower: 2,
  dungeons: 1,
  dragon: 1,
  ice_golem: 1,
  sand_devil: 1,
  phantom_grove: 1,
  chimera: 1,
  faction_wars: 1,
};

const WEIGHTED_KEYS = Object.entries(RATING_WEIGHTS).filter(
  ([, w]) => w > 0
) as [keyof ChampionRating, number][];

const RATING_LABELS: Record<string, string> = {
  clan_boss: "Clan Boss",
  hydra: "Hydra",
  chimera: "Chimera",
  arena_offense: "Arena",
  spider: "Spider",
  dragon: "Dragon",
  fire_knight: "Fire Knight",
  ice_golem: "Ice Golem",
  iron_twins: "Iron Twins",
  sand_devil: "Sand Devil",
  phantom_grove: "Phantom Shogun",
  doom_tower: "Doom Tower",
  faction_wars: "Faction Wars",
  dungeons: "Dungeons",
};

export interface SimilarChampionResult {
  champion: Champion;
  score: number;
  sharedStrengths: string[];
}

/** Calculate weighted similarity score between two champions (0–1 scale before bonuses) */
function calculateSimilarity(a: Champion, b: Champion): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, weight] of WEIGHTED_KEYS) {
    const rA = a.ratings[key];
    const rB = b.ratings[key];
    if (rA == null || rB == null) continue;
    const similarity = (5 - Math.abs(rA - rB)) / 5;
    weightedSum += similarity * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  let score = weightedSum / totalWeight;

  // Role bonus: same role = 1.25x
  if (a.role === b.role) score *= 1.25;

  // Affinity bonus: light tiebreaker only
  if (a.affinity === b.affinity) score *= 1.03;

  return score;
}

/** Find content areas where both champions rate >= 3.5 */
function findSharedStrengths(a: Champion, b: Champion): string[] {
  const strengths: string[] = [];
  for (const [key] of WEIGHTED_KEYS) {
    const rA = a.ratings[key];
    const rB = b.ratings[key];
    if (rA != null && rB != null && rA >= 3.5 && rB >= 3.5) {
      strengths.push(RATING_LABELS[key] ?? key);
    }
  }
  return strengths;
}

/** Check if a champion has any meaningful ratings (>= 2) */
function hasRatings(champion: Champion): boolean {
  return WEIGHTED_KEYS.some(([key]) => {
    const r = champion.ratings[key];
    return r != null && r >= 2;
  });
}

/**
 * Get similar champions with rarity-aware diversification.
 * Returns up to `count` results (default 6).
 */
export function getSimilarChampions(
  target: Champion,
  count = 6
): SimilarChampionResult[] {
  if (!hasRatings(target)) return [];

  const allChampions = getAllChampions();
  const targetRarityIdx = RARITY_ORDER.indexOf(target.rarity);

  // Score all candidates
  const scored: SimilarChampionResult[] = [];
  for (const champ of allChampions) {
    if (champ.id === target.id) continue;
    if (!hasRatings(champ)) continue;

    const score = calculateSimilarity(target, champ);
    if (score > 0) {
      scored.push({
        champion: champ,
        score,
        sharedStrengths: findSharedStrengths(target, champ),
      });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top 30 candidates as pool
  const pool = scored.slice(0, 30);
  if (pool.length <= count) return pool;

  const rareIdx = RARITY_ORDER.indexOf("Rare");
  const selected = new Set<string>();
  const result: SimilarChampionResult[] = [];

  function pick(r: SimilarChampionResult) {
    result.push(r);
    selected.add(r.champion.id);
  }

  function bestFrom(
    predicate: (r: SimilarChampionResult) => boolean,
    source = pool
  ): SimilarChampionResult | undefined {
    return source.find((r) => !selected.has(r.champion.id) && predicate(r));
  }

  // 1. Top 2 by score — always the best matches
  for (const r of pool) {
    if (result.length >= 2) break;
    pick(r);
  }

  // 2. Best from a different affinity than those already picked
  const pickedAffinities = new Set(result.map((r) => r.champion.affinity));
  const diffAffinity = bestFrom((r) => !pickedAffinities.has(r.champion.affinity));
  if (diffAffinity) pick(diffAffinity);

  // 3. Best from a lower rarity than target (budget alternative)
  const hasLowerRarity = result.some(
    (r) => RARITY_ORDER.indexOf(r.champion.rarity) < targetRarityIdx
  );
  if (!hasLowerRarity) {
    const budget = bestFrom(
      (r) => RARITY_ORDER.indexOf(r.champion.rarity) < targetRarityIdx
    );
    if (budget) pick(budget);
  }

  // 4. Guarantee a Rare champion if target is above Rare
  const hasRare = result.some((r) => r.champion.rarity === "Rare");
  if (targetRarityIdx > rareIdx && !hasRare) {
    const rare = bestFrom((r) => r.champion.rarity === "Rare", scored);
    if (rare) pick(rare);
  }

  // 5. Fill remaining slots from pool by score
  for (const r of pool) {
    if (result.length >= count) break;
    if (selected.has(r.champion.id)) continue;
    pick(r);
  }

  // Sort final result by score, trim to count
  result.sort((a, b) => b.score - a.score);
  return result.slice(0, count);
}
