"use client";

import { useState, useMemo } from "react";
import { getAllChampions } from "@/lib/champions";
import {
  CB_DIFFICULTIES,
  CBSlot,
  simulateTurnOrder,
  estimateDamage,
  formatDamage,
} from "@/lib/clan-boss";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allChampions = getAllChampions();
const championById = new Map(allChampions.map((c) => [c.id, c]));

const ROLES: CBSlot["role"][] = ["DPS", "Support", "Debuffer", "Tank"];

const DEFAULT_SLOT: Omit<CBSlot, "name"> = {
  speed: 171,
  role: "DPS",
  estimatedDamagePerHit: 20000,
  hitsPerTurn: 1,
  poisonChance: 0,
  poisonCount: 0,
};

export default function ClanBossPage() {
  const [difficulty, setDifficulty] = useState<typeof CB_DIFFICULTIES[number]>(CB_DIFFICULTIES[3]); // Nightmare
  const [slots, setSlots] = useState<CBSlot[]>([
    { name: "Champion 1", ...DEFAULT_SLOT },
    { name: "Champion 2", ...DEFAULT_SLOT, speed: 172 },
    { name: "Champion 3", ...DEFAULT_SLOT, speed: 173, role: "Debuffer", poisonChance: 50, poisonCount: 2 },
    { name: "Champion 4", ...DEFAULT_SLOT, speed: 174, role: "Support", estimatedDamagePerHit: 10000 },
    { name: "Champion 5", ...DEFAULT_SLOT, speed: 176, role: "Tank", estimatedDamagePerHit: 15000 },
  ]);
  const [search, setSearch] = useState("");
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchResults = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return allChampions.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  const updateSlot = (index: number, updates: Partial<CBSlot>) => {
    setSlots(slots.map((s, i) => (i === index ? { ...s, ...updates } : s)));
    setShowResults(false);
  };

  const assignChampion = (index: number, championId: string) => {
    const champ = championById.get(championId);
    if (!champ) return;
    const stats = champ.stats["6"];
    updateSlot(index, {
      name: champ.name,
      championId,
      speed: stats?.spd ?? 171,
      estimatedDamagePerHit: stats?.atk ?? 20000,
    });
    setSearch("");
    setEditingSlot(null);
  };

  // Turn order simulation (30 actions)
  const turnOrder = useMemo(() => {
    return simulateTurnOrder(
      slots.map((s) => ({ name: s.name, speed: s.speed })),
      difficulty.speed,
      30
    );
  }, [slots, difficulty]);

  // Damage estimation
  const damageResult = useMemo(() => {
    if (!showResults) return null;
    return estimateDamage(slots, difficulty, 100);
  }, [showResults, slots, difficulty]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#D4A43C]">Clan Boss Calculator</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Configuration */}
        <div className="space-y-4 lg:col-span-2">
          {/* Difficulty */}
          <Card>
            <CardHeader>
              <CardTitle>Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CB_DIFFICULTIES.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => { setDifficulty(d); setShowResults(false); }}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      difficulty.name === d.name
                        ? "border-[#D4A43C] bg-gold/20 text-[#D4A43C]"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                CB Speed: {difficulty.speed} | HP: {formatDamage(difficulty.hp)}
              </p>
            </CardContent>
          </Card>

          {/* Team Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Team (5 Champions)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {slots.map((slot, i) => {
                const champ = slot.championId ? championById.get(slot.championId) : undefined;
                return (
                  <div key={i} className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-3">
                      {champ?.avatar_url ? (
                        <img src={champ.avatar_url} alt={champ.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-sm font-bold text-muted-foreground">
                          {i + 1}
                        </div>
                      )}
                      <div className="flex-1">
                        {editingSlot === i ? (
                          <div>
                            <Input
                              placeholder="Search champion..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              autoFocus
                            />
                            {searchResults.length > 0 && (
                              <ul className="mt-1 rounded-md border border-border">
                                {searchResults.map((c) => (
                                  <li key={c.id}>
                                    <button
                                      onClick={() => assignChampion(i, c.id)}
                                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-accent"
                                    >
                                      {c.avatar_url && <img src={c.avatar_url} alt={c.name} className="h-5 w-5 rounded object-cover" />}
                                      {c.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingSlot(i); setSearch(""); }}
                            className="text-sm font-medium hover:text-[#D4A43C]"
                          >
                            {slot.name}
                          </button>
                        )}
                      </div>
                      <Select
                        value={slot.role}
                        onValueChange={(v) => updateSlot(i, { role: v as CBSlot["role"] })}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Speed</label>
                        <Input
                          type="number"
                          value={slot.speed}
                          onChange={(e) => updateSlot(i, { speed: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">DMG/Hit</label>
                        <Input
                          type="number"
                          value={slot.estimatedDamagePerHit}
                          onChange={(e) => updateSlot(i, { estimatedDamagePerHit: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Hits/Turn</label>
                        <Input
                          type="number"
                          value={slot.hitsPerTurn}
                          onChange={(e) => updateSlot(i, { hitsPerTurn: Number(e.target.value) || 1 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Poison %</label>
                        <Input
                          type="number"
                          value={slot.poisonChance}
                          onChange={(e) => updateSlot(i, { poisonChance: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Poisons</label>
                        <Input
                          type="number"
                          value={slot.poisonCount}
                          onChange={(e) => updateSlot(i, { poisonCount: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Calculate */}
          <Button onClick={() => setShowResults(true)} className="w-full">
            Calculate Damage Estimate
          </Button>

          {/* Results */}
          {damageResult && (
            <Card>
              <CardHeader>
                <CardTitle>Damage Estimate — {difficulty.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#D4A43C]">
                      {formatDamage(damageResult.totalDamage)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Damage</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{damageResult.cbTurns}</p>
                    <p className="text-xs text-muted-foreground">CB Turns</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      ~{damageResult.estimatedKeys}
                    </p>
                    <p className="text-xs text-muted-foreground">Keys Needed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {damageResult.perChampion.map((pc) => (
                    <div
                      key={pc.name}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                    >
                      <span className="text-sm font-medium">{pc.name}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-muted-foreground">
                          Direct: {formatDamage(pc.directDamage)}
                        </span>
                        {pc.poisonDamage > 0 && (
                          <span className="text-green-400">
                            Poison: {formatDamage(pc.poisonDamage)}
                          </span>
                        )}
                        <span className="font-medium">
                          Total: {formatDamage(pc.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  * Simplified estimate based on 100 actions. Actual damage depends on
                  buffs, debuffs, skill rotation, masteries, and gear.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Turn Order */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Turn Order (First 30)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {turnOrder.map((t) => (
                  <div
                    key={t.turn}
                    className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${
                      t.isCB
                        ? "bg-destructive/10 text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="w-6 text-right font-mono">{t.turn}.</span>
                    <span className={t.isCB ? "font-bold" : "font-medium"}>
                      {t.actor}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Speed Tune Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">1:1 Ratio:</strong> All champions go once
                per CB turn. Need all speeds &gt; CB speed.
              </p>
              <p>
                <strong className="text-foreground">2:1 Ratio:</strong> Champions go twice
                per CB turn. Need speeds approximately 2x CB speed.
              </p>
              <p>
                <strong className="text-foreground">{difficulty.name} CB Speed:</strong>{" "}
                {difficulty.speed}. For 1:1, aim for {difficulty.speed + 1}–{difficulty.speed + 10}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
