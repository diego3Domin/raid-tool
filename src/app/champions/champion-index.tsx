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
import { RARITY_ORDER } from "@/lib/constants";

const PAGE_SIZE = 48;

type SortOption =
  | "name-asc"
  | "name-desc"
  | "rarity-desc"
  | "rarity-asc"
  | "rating-desc"
  | "rating-asc";

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Name A–Z",
  "name-desc": "Name Z–A",
  "rarity-desc": "Rarity High–Low",
  "rarity-asc": "Rarity Low–High",
  "rating-desc": "Rating High–Low",
  "rating-asc": "Rating Low–High",
};

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
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);

  const hasActiveFilters =
    search !== "" ||
    faction !== "all" ||
    affinity !== "all" ||
    rarity !== "all" ||
    role !== "all";

  function clearAllFilters() {
    setSearch("");
    setFaction("all");
    setAffinity("all");
    setRarity("all");
    setRole("all");
    setPage(1);
  }

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    let result = champions.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query)) return false;
      if (faction !== "all" && c.faction !== faction) return false;
      if (affinity !== "all" && c.affinity !== affinity) return false;
      if (rarity !== "all" && c.rarity !== rarity) return false;
      if (role !== "all" && c.role !== role) return false;
      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rarity-desc":
          return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
        case "rarity-asc":
          return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
        case "rating-desc":
          return (b.ratings.overall ?? 0) - (a.ratings.overall ?? 0);
        case "rating-asc":
          return (a.ratings.overall ?? 0) - (b.ratings.overall ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [champions, search, faction, affinity, rarity, role, sort]);

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
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <Input
          placeholder="Search champions..."
          aria-label="Search champions by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="col-span-2 sm:w-64"
        />
        <Select value={faction} onValueChange={handleFilterChange(setFaction)}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by faction">
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
          <SelectTrigger className="w-full sm:w-36" aria-label="Filter by affinity">
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
          <SelectTrigger className="w-full sm:w-36" aria-label="Filter by rarity">
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
          <SelectTrigger className="w-full sm:w-36" aria-label="Filter by role">
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
        <Select value={sort} onValueChange={(v) => { setSort(v as SortOption); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Sort champions">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="col-span-2 sm:col-span-1 text-[#C8963E] hover:text-[#E8C460] hover:bg-[#C8963E]/10"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} champion{filtered.length !== 1 ? "s" : ""} found
        {totalPages > 1 && ` — Page ${safeCurrentPage} of ${totalPages}`}
      </p>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-[#7A7570]">
            No champions found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search term.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="mt-4"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {paginated.map((champion) => (
            <ChampionCard key={champion.id} champion={champion} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Champion pagination">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              aria-label="Previous page"
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">&larr;</span>
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
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === safeCurrentPage ? "page" : undefined}
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
              aria-label="Next page"
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">&rarr;</span>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
