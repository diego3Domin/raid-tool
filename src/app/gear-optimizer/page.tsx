"use client";

import { useState, useMemo } from "react";
import { getAllChampions } from "@/lib/champions";
import {
  GEAR_SETS,
  STAT_PRIORITIES,
  STAT_LABELS,
  CONTENT_GEAR_PROFILES,
  SLOT_MAIN_STATS,
  GEAR_SLOTS,
  GearSet,
  StatPriority,
} from "@/lib/gear";
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
import { Badge } from "@/components/ui/badge";

const allChampions = getAllChampions();

export default function GearOptimizerPage() {
  const [search, setSearch] = useState("");
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(null);
  const [contentArea, setContentArea] = useState<string>("");
  const [priorities, setPriorities] = useState<StatPriority[]>([]);
  const [showResults, setShowResults] = useState(false);

  const selectedChampion = selectedChampionId
    ? allChampions.find((c) => c.id === selectedChampionId)
    : undefined;

  const searchResults = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return allChampions.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  const contentProfile = contentArea ? CONTENT_GEAR_PROFILES[contentArea] : undefined;

  const togglePriority = (stat: StatPriority) => {
    setPriorities((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  };

  const applyContentProfile = () => {
    if (contentProfile) {
      setPriorities(contentProfile.primaryStats);
    }
  };

  // Recommendation engine
  const recommendations = useMemo(() => {
    if (!showResults || priorities.length === 0) return null;

    const scored: { set: GearSet; score: number; reasons: string[] }[] = [];

    for (const gearSet of GEAR_SETS) {
      let score = 0;
      const reasons: string[] = [];
      const bonus = gearSet.bonus.toLowerCase();

      // Score based on stat alignment
      for (const [i, stat] of priorities.entries()) {
        const weight = priorities.length - i; // higher priority = more weight
        const statLower = stat.toLowerCase().replace("%", "").replace(".", "");

        if (bonus.includes("atk") && (stat === "ATK%" || stat === "C.DMG")) {
          score += weight;
          reasons.push(`Boosts ${STAT_LABELS[stat]}`);
        }
        if (bonus.includes("def") && stat === "DEF%") {
          score += weight;
          reasons.push("Boosts DEF");
        }
        if (bonus.includes("hp") && stat === "HP%") {
          score += weight;
          reasons.push("Boosts HP");
        }
        if (bonus.includes("spd") && stat === "SPD") {
          score += weight * 1.5; // Speed is universally valuable
          reasons.push("Boosts Speed");
        }
        if (bonus.includes("c.rate") && stat === "C.RATE") {
          score += weight;
          reasons.push("Boosts Crit Rate");
        }
        if (bonus.includes("c.dmg") && stat === "C.DMG") {
          score += weight;
          reasons.push("Boosts Crit Damage");
        }
        if (bonus.includes("acc") && stat === "ACC") {
          score += weight;
          reasons.push("Boosts Accuracy");
        }
        if (bonus.includes("res") && stat === "RES") {
          score += weight;
          reasons.push("Boosts Resistance");
        }
      }

      // Bonus for content-recommended sets
      if (contentProfile?.recommendedSets.includes(gearSet.name)) {
        score += 3;
        reasons.push(`Recommended for ${contentArea}`);
      }

      // Bonus for utility sets that pair well
      if (bonus.includes("heal") && priorities.includes("HP%")) {
        score += 1;
        reasons.push("Synergy with HP focus");
      }
      if (bonus.includes("ignore") && priorities.includes("C.DMG")) {
        score += 2;
        reasons.push("DEF ignore synergizes with damage");
      }

      if (score > 0) {
        // Deduplicate reasons
        const unique = [...new Set(reasons)];
        scored.push({ set: gearSet, score, reasons: unique });
      }
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [showResults, priorities, contentProfile, contentArea]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#D4A43C]">Gear Optimizer</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Configuration */}
        <div className="space-y-4 lg:col-span-2">
          {/* Champion Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Champion</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedChampion ? (
                <div className="flex items-center gap-3">
                  {selectedChampion.avatar_url ? (
                    <img
                      src={selectedChampion.avatar_url}
                      alt={selectedChampion.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-lg font-bold text-muted-foreground">
                      {selectedChampion.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{selectedChampion.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedChampion.rarity} &middot; {selectedChampion.affinity} &middot; {selectedChampion.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedChampionId(null);
                      setSearch("");
                    }}
                    className="ml-auto text-xs text-destructive hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div>
                  <Input
                    placeholder="Search champion..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <ul className="mt-1 rounded-md border border-border">
                      {searchResults.map((c) => (
                        <li key={c.id}>
                          <button
                            onClick={() => {
                              setSelectedChampionId(c.id);
                              setSearch("");
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                          >
                            {c.avatar_url ? (
                              <img src={c.avatar_url} alt={c.name} className="h-6 w-6 rounded object-cover" />
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px]">{c.name.charAt(0)}</div>
                            )}
                            <span>{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.rarity} &middot; {c.role}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Area */}
          <Card>
            <CardHeader>
              <CardTitle>Content Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Select value={contentArea} onValueChange={(v) => setContentArea(v)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select content" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CONTENT_GEAR_PROFILES).map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {contentProfile && (
                  <Button size="sm" variant="outline" onClick={applyContentProfile}>
                    Apply Suggested Priorities
                  </Button>
                )}
              </div>
              {contentProfile && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {contentProfile.description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stat Priorities */}
          <Card>
            <CardHeader>
              <CardTitle>
                Stat Priorities
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (select in order of importance)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {STAT_PRIORITIES.map((stat) => {
                  const idx = priorities.indexOf(stat);
                  const active = idx >= 0;
                  return (
                    <button
                      key={stat}
                      onClick={() => togglePriority(stat)}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-[#D4A43C] bg-[#D4A43C]/20 text-[#D4A43C]"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {active && (
                        <span className="mr-1.5 text-xs">{idx + 1}.</span>
                      )}
                      {STAT_LABELS[stat]}
                    </button>
                  );
                })}
              </div>
              {priorities.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Priority order: {priorities.map((s) => STAT_LABELS[s]).join(" → ")}
                  </p>
                  <button
                    onClick={() => setPriorities([])}
                    className="text-xs text-destructive hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate button */}
          <Button
            onClick={() => setShowResults(true)}
            disabled={priorities.length === 0}
            className="w-full"
          >
            Get Gear Recommendations
          </Button>

          {/* Results */}
          {recommendations && recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Gear Sets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map(({ set, score, reasons }, i) => (
                  <div
                    key={set.name}
                    className="flex items-start gap-3 rounded-md border border-border p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#D4A43C]/20 text-sm font-bold text-[#D4A43C]">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{set.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {set.pieces}-piece
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {set.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{set.bonus}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {reasons.map((r) => (
                          <span
                            key={r}
                            className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {recommendations && recommendations.length === 0 && (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">
                  No matching gear sets found for the selected priorities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Slot guide */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Gear Slot Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {GEAR_SLOTS.map((slot) => (
                <div key={slot}>
                  <p className="text-sm font-medium">{slot}</p>
                  <p className="text-xs text-muted-foreground">
                    Main: {SLOT_MAIN_STATS[slot].join(", ")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {contentProfile && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">
                  Suggested Sets for {contentArea}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {contentProfile.recommendedSets.map((name) => (
                    <Badge key={name} variant="outline">
                      {name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
