"use client";

import { useState, useMemo } from "react";
import { Champion } from "@/types/champion";
import { ChampionCard } from "@/components/champion-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 48;

interface ChampionIndexProps {
  champions: Champion[];
  factions: string[];
  affinities: string[];
  rarities: string[];
  roles: string[];
}

export function ChampionIndex({
  champions,
  factions,
  affinities,
  rarities,
  roles,
}: ChampionIndexProps) {
  const [search, setSearch] = useState("");
  const [faction, setFaction] = useState("all");
  const [affinity, setAffinity] = useState("all");
  const [rarity, setRarity] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return champions.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query)) return false;
      if (faction !== "all" && c.faction !== faction) return false;
      if (affinity !== "all" && c.affinity !== affinity) return false;
      if (rarity !== "all" && c.rarity !== rarity) return false;
      if (role !== "all" && c.role !== role) return false;
      return true;
    });
  }, [champions, search, faction, affinity, rarity, role]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safeCurrentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search champions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
        <Select value={faction} onValueChange={handleFilterChange(setFaction)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Faction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factions</SelectItem>
            {factions.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={affinity} onValueChange={handleFilterChange(setAffinity)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Affinity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Affinities</SelectItem>
            {affinities.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={rarity} onValueChange={handleFilterChange(setRarity)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            {rarities.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={role} onValueChange={handleFilterChange(setRole)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} champion{filtered.length !== 1 ? "s" : ""} found
        {totalPages > 1 && ` — Page ${safeCurrentPage} of ${totalPages}`}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {paginated.map((champion) => (
          <ChampionCard key={champion.id} champion={champion} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (safeCurrentPage <= 4) {
              pageNum = i + 1;
            } else if (safeCurrentPage >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = safeCurrentPage - 3 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={pageNum === safeCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
