import Link from "next/link";
import { Champion } from "@/types/champion";
import { Badge } from "@/components/ui/badge";
import { RARITY_COLORS, AFFINITY_COLORS } from "@/lib/constants";

export function ChampionCard({ champion }: { champion: Champion }) {
  const rarityClass = RARITY_COLORS[champion.rarity] ?? "bg-zinc-600";
  const affinityClass = AFFINITY_COLORS[champion.affinity] ?? "text-muted-foreground";

  // Map rarity to border color — thin, clean
  const rarityBorderColor = {
    Common: "#52525B",
    Uncommon: "#16A34A",
    Rare: "#3B82F6",
    Epic: "#A855F7",
    Legendary: "#C8963E",
    Mythical: "#8B1A1A",
  }[champion.rarity] ?? "#52525B";

  return (
    <Link
      href={`/champions/${champion.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-[#141418] border transition-all duration-200 hover:border-opacity-100 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8963E]"
      style={{
        borderColor: rarityBorderColor,
        borderWidth: '2px',
        borderTopWidth: '2px',
      }}
    >
      {/* Avatar */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/60">
        {champion.avatar_url ? (
          <img
            src={champion.avatar_url}
            alt={champion.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-700">
            {champion.name.charAt(0)}
          </div>
        )}

        {/* Rarity badge — top-right */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className={`text-[9px] font-bold uppercase tracking-wider ${rarityClass}`}>
            {champion.rarity}
          </Badge>
        </div>
      </div>

      {/* Info section */}
      <div className="flex flex-1 flex-col gap-1 p-3 bg-[#1A1A20]/50">
        <h3 className="truncate text-sm font-bold uppercase tracking-tight text-[#E8E4DF] transition-colors group-hover:text-[#C8963E]">
          {champion.name}
        </h3>
        <p className="truncate text-xs font-medium text-[#7A7570]">
          {champion.faction}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className={`text-xs font-bold uppercase tracking-wide ${affinityClass}`}>
            {champion.affinity}
          </span>
          <span className="text-[#2A2A30]">•</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7570]">
            {champion.role}
          </span>
        </div>
      </div>
    </Link>
  );
}
