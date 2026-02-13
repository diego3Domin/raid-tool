import Link from "next/link";
import { Champion } from "@/types/champion";
import { Badge } from "@/components/ui/badge";
import { RARITY_COLORS, RARITY_BORDER_COLORS } from "@/lib/constants";
import { FactionIcon } from "@/components/faction-icon";
import { AffinityIcon } from "@/components/affinity-icon";

export function ChampionCard({ champion }: { champion: Champion }) {
  const rarityClass = RARITY_COLORS[champion.rarity] ?? "bg-zinc-600";
  const rarityBorderColor = RARITY_BORDER_COLORS[champion.rarity] ?? "#52525B";

  return (
    <Link
      href={`/champions/${champion.slug}`}
      aria-label={`${champion.name} — ${champion.rarity} ${champion.affinity} ${champion.role}`}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-[#141418] border-2 transition-all duration-200 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
      style={{
        borderColor: rarityBorderColor,
        boxShadow: `
          0 4px 12px rgba(0, 0, 0, 0.6),
          0 2px 4px rgba(0, 0, 0, 0.8),
          inset 0 1px 0 rgba(200, 150, 62, 0.06),
          0 0 0 1px ${rarityBorderColor}40
        `,
      }}
    >
      {/* Rarity glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-sm"
        style={{
          boxShadow: `
            inset 0 0 20px ${rarityBorderColor}20,
            0 0 16px ${rarityBorderColor}30,
            0 0 32px ${rarityBorderColor}15
          `,
        }}
      />

      {/* Avatar */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
        {champion.avatar_url ? (
          <img
            src={champion.avatar_url}
            alt={champion.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-700">
            {champion.name.charAt(0)}
          </div>
        )}

        {/* Top edge rarity accent */}
        <div className="absolute top-0 left-0 right-0 h-1 opacity-80" style={{ background: rarityBorderColor }} />

        {/* Rarity badge — bottom-right */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className={`text-[9px] font-bold uppercase tracking-wider border ${rarityClass}`}
            style={{
              borderColor: rarityBorderColor,
              boxShadow: `0 2px 8px ${rarityBorderColor}40`,
            }}
          >
            {champion.rarity}
          </Badge>
        </div>
      </div>

      {/* Info section */}
      <div className="flex flex-1 flex-col gap-1 p-3 bg-[#1A1A20]/70 border-t border-[#2A2A30] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
        <h3 className="truncate text-xs sm:text-sm font-bold uppercase tracking-tight text-[#E8E4DF] transition-colors group-hover:text-[#C8963E]">
          {champion.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <AffinityIcon affinity={champion.affinity} size={20} />
            <FactionIcon faction={champion.faction} size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-[#7A7570] text-center">
            {champion.role}
          </span>
        </div>
      </div>
    </Link>
  );
}
