"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRoster } from "@/lib/roster";
import { useTeams } from "@/lib/teams";
import { getAllChampions } from "@/lib/champions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const allChampions = getAllChampions();
const championById = new Map(allChampions.map((c) => [c.id, c]));

// Pick 8 featured legendaries with avatars
const featuredChampions = allChampions
  .filter((c) => c.rarity === "Legendary" && c.avatar_url)
  .slice(0, 8);

export default function DashboardPage() {
  const { user } = useAuth();
  const { roster } = useRoster();
  const { teams } = useTeams();

  const rosterChampions = useMemo(() => {
    return roster
      .map((r) => championById.get(r.champion_id))
      .filter(Boolean)
      .slice(0, 10);
  }, [roster]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Clean brutal header */}
      <div className="mb-10">
        <h1 className="mb-2 text-[#C8963E] text-6xl font-black uppercase tracking-tighter">
          RAID Tool
        </h1>
        <p className="text-base font-medium text-[#7A7570] mt-4">
          Your all-in-one companion toolkit for <span className="text-[#E8E4DF] font-semibold">RAID: Shadow Legends</span>
        </p>
        <div className="h-[1px] w-32 bg-[#C8963E]/30 mt-4"></div>
      </div>

      {user ? (
        /* Logged-in dashboard */
        <div className="space-y-6">
          {/* Stat cards — clean data panels */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-[#C8963E]/30 hover:border-[#C8963E]/60 transition-colors group">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-[#7A7570] group-hover:text-[#C8963E] transition-colors">
                  Roster Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#C8963E] text-5xl font-black">{roster.length}</p>
                <p className="text-xs text-[#7A7570] uppercase tracking-wide font-semibold mt-1">
                  champion{roster.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#4A5568]/30 hover:border-[#4A5568]/60 transition-colors group">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-[#7A7570] group-hover:text-[#4A5568] transition-colors">
                  Saved Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#4A5568] text-5xl font-black">{teams.length}</p>
                <p className="text-xs text-[#7A7570] uppercase tracking-wide font-semibold mt-1">
                  team{teams.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#8B1A1A]/30 hover:border-[#8B1A1A]/60 transition-colors group">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-[#7A7570] group-hover:text-[#8B1A1A] transition-colors">
                  Champion Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#8B1A1A] text-5xl font-black">{allChampions.length}</p>
                <p className="text-xs text-[#7A7570] uppercase tracking-wide font-semibold mt-1">champions indexed</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent roster */}
          {rosterChampions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My Roster
                  <Button asChild size="sm" variant="outline">
                    <Link href="/roster">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {rosterChampions.map((c) => (
                    <Link
                      key={c!.id}
                      href={`/champions/${c!.slug}`}
                      className="group flex flex-col items-center gap-1"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-lg border border-border bg-muted transition-colors group-hover:border-[#D4A43C]">
                        {c!.avatar_url ? (
                          <img
                            src={c!.avatar_url}
                            alt={c!.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                            {c!.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="max-w-[56px] truncate text-[10px] text-muted-foreground">
                        {c!.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved teams */}
          {teams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Saved Teams
                  <Button asChild size="sm" variant="outline">
                    <Link href="/team-builder">Team Builder</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {teams.slice(0, 5).map((team) => (
                    <li
                      key={team.id}
                      className="flex items-center justify-between rounded-md border border-border p-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.content_category}
                          {team.content_detail
                            ? ` — ${team.content_detail}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {team.slots.map((s, i) => {
                          const c = championById.get(s.champion_id);
                          return c?.avatar_url ? (
                            <img
                              key={i}
                              src={c.avatar_url}
                              alt={c.name}
                              className="h-6 w-6 rounded object-cover"
                            />
                          ) : (
                            <div
                              key={i}
                              className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px]"
                            >
                              {c?.name.charAt(0) ?? "?"}
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Quick links */}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/champions">Browse Champions</Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Logged-out dashboard */
        <div className="space-y-6">
          {/* Featured champions */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Champions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
                {featuredChampions.map((c) => (
                  <Link
                    key={c.id}
                    href={`/champions/${c.slug}`}
                    className="group flex flex-col items-center gap-1"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-lg border border-border bg-muted transition-colors group-hover:border-[#D4A43C]">
                      <img
                        src={c.avatar_url!}
                        alt={c.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="max-w-[56px] truncate text-[10px] text-muted-foreground">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Champion Database */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Champion Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                Browse {allChampions.length}+ champions with stats, skills,
                and ratings.
              </p>
              <Button asChild size="sm">
                <Link href="/champions">Browse Champions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
