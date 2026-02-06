"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRoster } from "@/lib/roster";
import { getAllChampions } from "@/lib/champions";
import { Champion } from "@/types/champion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const allChampions = getAllChampions();

export default function RosterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { roster, addChampion, removeChampion } = useRoster();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const rosterChampions = useMemo(() => {
    const ids = new Set(roster.map((r) => r.champion_id));
    return allChampions.filter((c) => ids.has(c.id));
  }, [roster]);

  const searchResults = useMemo(() => {
    if (!search) return [];
    const query = search.toLowerCase();
    return allChampions
      .filter(
        (c) =>
          c.name.toLowerCase().includes(query) &&
          !roster.some((r) => r.champion_id === c.id)
      )
      .slice(0, 10);
  }, [search, roster]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gold">My Roster</h1>
        <Button onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? "Done" : "+ Add Champion"}
        </Button>
      </div>

      {/* Search & Add */}
      {showSearch && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <Input
            placeholder="Search champions to add..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {searchResults.length > 0 && (
            <ul className="mt-2 space-y-1">
              {searchResults.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
                >
                  <ChampionSearchRow champion={c} />
                  <Button
                    size="sm"
                    onClick={() => {
                      addChampion(c.id);
                      setSearch("");
                    }}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {search && searchResults.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              No champions found matching &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Roster grid */}
      {rosterChampions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">Your roster is empty.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click &ldquo;+ Add Champion&rdquo; to start building your roster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {rosterChampions.map((c) => (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card"
            >
              <Link href={`/roster/${c.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-muted">
                  {c.avatar_url ? (
                    <img
                      src={c.avatar_url}
                      alt={c.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                      {c.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.rarity} • {c.role}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => removeChampion(c.id)}
                className="absolute right-1 top-1 hidden rounded bg-destructive px-1.5 py-0.5 text-xs text-white group-hover:block"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        {roster.length} champion{roster.length !== 1 ? "s" : ""} in roster
      </p>
    </div>
  );
}

function ChampionSearchRow({ champion }: { champion: Champion }) {
  return (
    <div className="flex items-center gap-3">
      {champion.avatar_url ? (
        <img
          src={champion.avatar_url}
          alt={champion.name}
          className="h-8 w-8 rounded object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
          {champion.name.charAt(0)}
        </div>
      )}
      <div>
        <span className="text-sm font-medium">{champion.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {champion.rarity} • {champion.faction}
        </span>
      </div>
    </div>
  );
}
