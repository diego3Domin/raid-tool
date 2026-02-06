import Link from "next/link";
import { Champion } from "@/types/champion";
import { Badge } from "@/components/ui/badge";
import { RARITY_COLORS, AFFINITY_COLORS } from "@/lib/constants";

export function ChampionCard({ champion }: { champion: Champion }) {
  const rarityClass = RARITY_COLORS[champion.rarity] ?? "bg-zinc-600";
  const affinityClass = AFFINITY_COLORS[champion.affinity] ?? "text-muted-foreground";

  return (
    <Link
      href={`/champions/${champion.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/50 transition-all duration-200 hover:border-[#D4A43C]/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-[#D4A43C]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A43C] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      {/* Avatar */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
        {champion.avatar_url ? (
          <img
            src={champion.avatar_url}
            alt={champion.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-600">
            {champion.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate text-sm font-semibold text-slate-100 transition-colors group-hover:text-[#D4A43C]">
          {champion.name}
        </h3>
        <p className="truncate text-xs text-slate-500">
          {champion.faction}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
          <Badge variant="secondary" className={`text-[10px] ${rarityClass}`}>
            {champion.rarity}
          </Badge>
          <span className={`text-[10px] font-medium ${affinityClass}`}>
            {champion.affinity}
          </span>
          <span className="text-[10px] text-slate-500">
            {champion.role}
          </span>
        </div>
      </div>
    </Link>
  );
}
