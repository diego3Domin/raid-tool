"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Champion } from "@/types/champion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RARITY_BORDER_COLORS } from "@/lib/constants";

const STAT_ROWS = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "ATK" },
  { key: "def", label: "DEF" },
  { key: "spd", label: "SPD" },
  { key: "crit_rate", label: "C.Rate" },
  { key: "crit_dmg", label: "C.DMG" },
  { key: "res", label: "RES" },
  { key: "acc", label: "ACC" },
] as const;

const RATING_ROWS = [
  { key: "overall", label: "Overall" },
  { key: "clan_boss", label: "Clan Boss" },
  { key: "arena_offense", label: "Arena" },
  { key: "dungeons", label: "Dungeons" },
  { key: "hydra", label: "Hydra" },
  { key: "doom_tower", label: "Doom Tower" },
] as const;

interface Props {
  champions: Champion[];
}

export function CompareClient({ champions }: Props) {
  const searchParams = useSearchParams();
  const initialSlugs = searchParams.get("champions")?.split(",").filter(Boolean) ?? [];

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialSlugs.slice(0, 3)
  );
  const [search, setSearch] = useState("");

  const championMap = useMemo(
    () => new Map(champions.map((c) => [c.slug, c])),
    [champions]
  );

  const selected = selectedSlugs
    .map((slug) => championMap.get(slug))
    .filter(Boolean) as Champion[];

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return champions
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) &&
          !selectedSlugs.includes(c.slug)
      )
      .slice(0, 8);
  }, [search, champions, selectedSlugs]);

  function addChampion(slug: string) {
    if (selectedSlugs.length >= 3) return;
    setSelectedSlugs((prev) => [...prev, slug]);
    setSearch("");
  }

  function removeChampion(slug: string) {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  }

  function getHighest(key: string, type: "stat" | "rating"): number {
    let max = -Infinity;
    for (const c of selected) {
      const val =
        type === "stat"
          ? (c.stats["6"] as unknown as Record<string, number>)?.[key]
          : (c.ratings as unknown as Record<string, number | undefined>)[key];
      if (val != null && val > max) max = val;
    }
    return max;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-10 relative">
        <h1
          className="mb-2 text-3xl sm:text-4xl md:text-5xl"
          style={{
            background: 'linear-gradient(180deg, #E8C460 0%, #C8963E 50%, #9A6E25 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 16px rgba(200, 150, 62, 0.4))',
          }}
        >
          Compare Champions
        </h1>
        <p className="text-sm text-[#7A7570]">
          Select up to 3 champions to compare side by side
        </p>
        <div className="mt-4 w-32 relative">
          <div className="h-[2px] bg-gradient-to-r from-[#C8963E] via-[#9A6E25] to-transparent" />
          <div className="h-[1px] bg-gradient-to-r from-[#E8C460] to-transparent -mt-[1px]" />
        </div>
      </div>

      {/* Champion Selector */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">
            {selected.length === 0
              ? "Add Champions to Compare"
              : `Comparing ${selected.length} Champion${selected.length !== 1 ? "s" : ""}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Selected champions */}
          <div className="mb-4 flex flex-wrap gap-3">
            {selected.map((c) => (
              <div
                key={c.slug}
                className="flex items-center gap-2 rounded-sm border-2 bg-[#1A1A20] px-3 py-2"
                style={{
                  borderColor: RARITY_BORDER_COLORS[c.rarity] ?? "#2A2A30",
                }}
              >
                {c.avatar_url && (
                  <img src={c.avatar_url} alt="" className="h-8 w-8 rounded-sm object-cover" />
                )}
                <span className="text-sm font-bold text-[#E8E4DF]">{c.name}</span>
                <button
                  onClick={() => removeChampion(c.slug)}
                  className="ml-1 text-[#7A7570] hover:text-[#E8E4DF]"
                  aria-label={`Remove ${c.name}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Search input */}
          {selected.length < 3 && (
            <div className="relative">
              <Input
                placeholder="Search champions to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-20 mt-1 w-full sm:w-72 rounded-sm border-2 border-[#2A2A30] bg-[#141418] shadow-lg">
                  {searchResults.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => addChampion(c.slug)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[#1A1A20] transition-colors"
                    >
                      {c.avatar_url && (
                        <img src={c.avatar_url} alt="" className="h-6 w-6 rounded-sm object-cover" />
                      )}
                      <span className="font-medium text-[#E8E4DF]">{c.name}</span>
                      <span className="text-xs text-[#7A7570]">
                        {c.rarity} {c.affinity} {c.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <>
          {/* Stat Comparison */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Stats Comparison (6-Star)</CardTitle>
            </CardHeader>
            <CardContent className="-mx-4 sm:mx-0 overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm">
                <thead>
                  <tr className="border-b border-[#2A2A30]">
                    <th className="sticky left-0 z-10 bg-[#141418] py-3 pr-4 pl-4 sm:pl-0 text-left text-xs font-bold uppercase tracking-wider text-[#7A7570] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-[#2A2A30] sm:after:hidden">
                      Stat
                    </th>
                    {selected.map((c) => (
                      <th key={c.slug} className="py-3 px-2 sm:px-4 text-right text-xs font-bold uppercase tracking-wider text-[#7A7570]">
                        <Link href={`/champions/${c.slug}`} className="hover:text-[#C8963E]">
                          {c.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STAT_ROWS.map((row) => {
                    const highest = getHighest(row.key, "stat");
                    return (
                      <tr key={row.key} className="border-b border-[#2A2A30]/50">
                        <td className="sticky left-0 z-10 bg-[#141418] py-2 pr-4 pl-4 sm:pl-0 font-semibold text-[#E8E4DF] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-[#2A2A30]/50 sm:after:hidden">{row.label}</td>
                        {selected.map((c) => {
                          const val = (c.stats["6"] as unknown as Record<string, number>)?.[row.key];
                          const isHighest = val === highest && selected.length > 1;
                          return (
                            <td
                              key={c.slug}
                              className={`py-2 px-2 sm:px-4 text-right font-mono ${
                                isHighest ? "font-bold text-[#C8963E]" : "text-[#7A7570]"
                              }`}
                            >
                              {val != null ? val : "\u2014"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Rating Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Ratings Comparison</CardTitle>
            </CardHeader>
            <CardContent className="-mx-4 sm:mx-0 overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm">
                <thead>
                  <tr className="border-b border-[#2A2A30]">
                    <th className="sticky left-0 z-10 bg-[#141418] py-3 pr-4 pl-4 sm:pl-0 text-left text-xs font-bold uppercase tracking-wider text-[#7A7570] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-[#2A2A30] sm:after:hidden">
                      Content Area
                    </th>
                    {selected.map((c) => (
                      <th key={c.slug} className="py-3 px-2 sm:px-4 text-right text-xs font-bold uppercase tracking-wider text-[#7A7570]">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATING_ROWS.map((row) => {
                    const highest = getHighest(row.key, "rating");
                    return (
                      <tr key={row.key} className="border-b border-[#2A2A30]/50">
                        <td className="sticky left-0 z-10 bg-[#141418] py-2 pr-4 pl-4 sm:pl-0 font-semibold text-[#E8E4DF] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-[#2A2A30]/50 sm:after:hidden">{row.label}</td>
                        {selected.map((c) => {
                          const val = (c.ratings as unknown as Record<string, number | undefined>)[row.key];
                          const isHighest = val === highest && selected.length > 1;
                          return (
                            <td
                              key={c.slug}
                              className={`py-2 px-2 sm:px-4 text-right ${
                                isHighest ? "font-bold text-[#C8963E]" : "text-[#7A7570]"
                              }`}
                            >
                              {val != null ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="hidden sm:inline">
                                    <span className="text-[#C8963E]">{"★".repeat(Math.floor(val))}</span>
                                    <span className="text-[#3A3630]">{"★".repeat(5 - Math.floor(val))}</span>
                                  </span>
                                  <span className="text-xs">({val})</span>
                                </span>
                              ) : (
                                "\u2014"
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      {selected.length < 2 && selected.length > 0 && (
        <div className="py-12 text-center text-[#7A7570]">
          <p className="text-lg">Add at least 2 champions to compare</p>
        </div>
      )}

      {selected.length === 0 && (
        <div className="py-12 text-center text-[#7A7570]">
          <p className="text-lg mb-4">Search for champions above to start comparing</p>
          <Button variant="outline" asChild>
            <Link href="/champions">Browse Champions</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
