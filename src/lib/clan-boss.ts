// Clan Boss speed tune calculations
// Based on RAID: Shadow Legends turn mechanics

export const CB_DIFFICULTIES = [
  { name: "Normal", speed: 130, hp: 7_500_000 },
  { name: "Hard", speed: 150, hp: 18_000_000 },
  { name: "Brutal", speed: 160, hp: 35_000_000 },
  { name: "Nightmare", speed: 170, hp: 50_000_000 },
  { name: "Ultra-Nightmare", speed: 190, hp: 75_000_000 },
] as const;

export interface CBSlot {
  name: string;
  championId?: string;
  speed: number;
  role: "DPS" | "Support" | "Debuffer" | "Tank";
  estimatedDamagePerHit: number;
  hitsPerTurn: number;
  poisonChance: number; // 0–100
  poisonCount: number; // how many poisons per proc
}

export interface TurnEntry {
  turn: number;
  actor: string;
  actorIndex: number;
  isCB: boolean;
}

/**
 * Simulate turn order for a given number of total actions.
 * Uses simplified RAID speed bar mechanic:
 * Each tick, every entity gains speed to their turn meter.
 * When TM >= 1000, they take a turn.
 */
export function simulateTurnOrder(
  slots: { name: string; speed: number }[],
  cbSpeed: number,
  totalActions: number
): TurnEntry[] {
  const entities = [
    ...slots.map((s, i) => ({ name: s.name, speed: s.speed, tm: 0, index: i, isCB: false })),
    { name: "Clan Boss", speed: cbSpeed, tm: 0, index: -1, isCB: true },
  ];

  const turns: TurnEntry[] = [];
  let actionCount = 0;

  while (actionCount < totalActions) {
    // Fill turn meters
    let minTicksToAction = Infinity;
    for (const e of entities) {
      const ticksNeeded = Math.ceil((1000 - e.tm) / e.speed);
      if (ticksNeeded < minTicksToAction) minTicksToAction = ticksNeeded;
    }

    for (const e of entities) {
      e.tm += e.speed * minTicksToAction;
    }

    // Find who goes next (highest TM, ties broken by speed)
    const ready = entities
      .filter((e) => e.tm >= 1000)
      .sort((a, b) => b.tm - a.tm || b.speed - a.speed);

    for (const actor of ready) {
      if (actionCount >= totalActions) break;
      turns.push({
        turn: actionCount + 1,
        actor: actor.name,
        actorIndex: actor.index,
        isCB: actor.isCB,
      });
      actor.tm -= 1000;
      actionCount++;
    }
  }

  return turns;
}

/**
 * Estimate damage over a number of turns.
 * Simplified model: direct damage + poison damage.
 */
export function estimateDamage(
  slots: CBSlot[],
  cbDifficulty: typeof CB_DIFFICULTIES[number],
  turnsToSimulate: number
): {
  totalDamage: number;
  perChampion: { name: string; directDamage: number; poisonDamage: number; total: number }[];
  cbTurns: number;
  estimatedKeys: number;
} {
  const turnOrder = simulateTurnOrder(
    slots.map((s) => ({ name: s.name, speed: s.speed })),
    cbDifficulty.speed,
    turnsToSimulate
  );

  const POISON_DMG_PER_TICK = cbDifficulty.hp * 0.025; // 2.5% poison per tick
  const perChampion = slots.map((s) => ({
    name: s.name,
    directDamage: 0,
    poisonDamage: 0,
    total: 0,
  }));

  let activePoisonsOwner: number[] = []; // indices of who placed each poison
  let cbTurns = 0;

  for (const turn of turnOrder) {
    if (turn.isCB) {
      cbTurns++;
      // Poisons tick on CB turn
      for (const ownerIdx of activePoisonsOwner) {
        perChampion[ownerIdx].poisonDamage += POISON_DMG_PER_TICK;
      }
      // Poisons last ~2 turns simplified
      if (cbTurns % 2 === 0) activePoisonsOwner = [];
    } else {
      const slot = slots[turn.actorIndex];
      const directDmg = slot.estimatedDamagePerHit * slot.hitsPerTurn;
      perChampion[turn.actorIndex].directDamage += directDmg;

      // Poison placement
      if (slot.poisonChance > 0 && Math.random() * 100 < slot.poisonChance) {
        for (let i = 0; i < slot.poisonCount; i++) {
          activePoisonsOwner.push(turn.actorIndex);
        }
      }
    }
  }

  for (const pc of perChampion) {
    pc.total = pc.directDamage + pc.poisonDamage;
  }

  const totalDamage = perChampion.reduce((sum, pc) => sum + pc.total, 0);
  const estimatedKeys = Math.max(1, Math.ceil(cbDifficulty.hp / Math.max(totalDamage, 1)));

  return { totalDamage, perChampion, cbTurns, estimatedKeys };
}

export function formatDamage(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}
