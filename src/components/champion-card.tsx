import Link from "next/link";
import { Champion } from "@/types/champion";
import { Badge } from "@/components/ui/badge";

const RARITY_COLORS: Record<string, string> = {
  Common: "bg-zinc-600",
  Uncommon: "bg-green-700",
  Rare: "bg-blue-700",
  Epic: "bg-purple-700",
  Legendary: "bg-gold-dark text-background",
  Mythical: "bg-crimson",
};

const AFFINITY_COLORS: Record<string, string> = {
  Magic: "text-blue-400",
  Force: "text-red-400",
  Spirit: "text-green-400",
  Void: "text-purple-400",
};

export function ChampionCard({ champion }: { champion: Champion }) {
  const rarityClass = RARITY_COLORS[champion.rarity] ?? "bg-zinc-600";
  const affinityClass = AFFINITY_COLORS[champion.affinity] ?? "text-muted-foreground";

  return (
    <Link
      href={`/champions/${champion.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-gold/50 hover:bg-accent"
    >
      {/* Avatar */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {champion.avatar_url ? (
          <img
            src={champion.avatar_url}
            alt={champion.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
            {champion.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {champion.name}
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {champion.faction}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
          <Badge variant="secondary" className={`text-[10px] ${rarityClass}`}>
            {champion.rarity}
          </Badge>
          <span className={`text-[10px] font-medium ${affinityClass}`}>
            {champion.affinity}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {champion.role}
          </span>
        </div>
      </div>
    </Link>
  );
}
