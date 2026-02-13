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

  // Take top 20 candidates for main pool
  const pool = scored.slice(0, 20);
  if (pool.length <= count) return pool;

  // Rarity-aware diversification
  const sameRarity = pool.filter((r) => r.champion.rarity === target.rarity);
  const lowerRarity = pool.filter(
    (r) => RARITY_ORDER.indexOf(r.champion.rarity) < targetRarityIdx
  );
  // Best Rare from full scored list (not just top 20) for budget pick
  const rareIdx = RARITY_ORDER.indexOf("Rare");
  const bestRare =
    targetRarityIdx > rareIdx
      ? scored.find((r) => r.champion.rarity === "Rare")
      : null;

  const selected = new Set<string>();
  const result: SimilarChampionResult[] = [];

  // Pick up to 2 same-rarity peers
  for (const r of sameRarity) {
    if (result.length >= 2) break;
    result.push(r);
    selected.add(r.champion.id);
  }

  // Pick up to 2 lower-rarity budget alternatives
  for (const r of lowerRarity) {
    if (result.length >= 4) break;
    if (selected.has(r.champion.id)) continue;
    result.push(r);
    selected.add(r.champion.id);
  }

  // Guarantee at least 1 Rare champion for budget accessibility
  if (bestRare && !selected.has(bestRare.champion.id)) {
    result.push(bestRare);
    selected.add(bestRare.champion.id);
  }

  // Fill remaining from top scores (respect count limit)
  for (const r of pool) {
    if (result.length >= count) break;
    if (selected.has(r.champion.id)) continue;
    result.push(r);
    selected.add(r.champion.id);
  }

  // Soft affinity diversification: if one affinity dominates (>4 of 6),
  // swap the weakest same-affinity pick for the best different-affinity
  // alternative — but only if the replacement is close in quality.
  const affinityCounts = new Map<string, number>();
  for (const r of result) {
    affinityCounts.set(r.champion.affinity, (affinityCounts.get(r.champion.affinity) ?? 0) + 1);
  }
  const maxAffinityCount = Math.max(...affinityCounts.values());
  if (maxAffinityCount > 4) {
    const dominantAffinity = [...affinityCounts.entries()].find(
      ([, c]) => c === maxAffinityCount
    )![0];

    // Find best different-affinity candidate not already selected
    const altCandidate = pool.find(
      (r) => r.champion.affinity !== dominantAffinity && !selected.has(r.champion.id)
    );

    if (altCandidate) {
      // Find weakest same-affinity champion in result
      const sameAffinityResults = result
        .filter((r) => r.champion.affinity === dominantAffinity)
        .sort((a, b) => a.score - b.score);
      const weakest = sameAffinityResults[0];

      // Only swap if the replacement is within 85% of the score being dropped
      if (weakest && altCandidate.score >= weakest.score * 0.85) {
        const idx = result.indexOf(weakest);
        selected.delete(weakest.champion.id);
        result[idx] = altCandidate;
        selected.add(altCandidate.champion.id);
      }
    }
  }

  // Sort final result by score, trim to count
  result.sort((a, b) => b.score - a.score);
  return result.slice(0, count);
}
