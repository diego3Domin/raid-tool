import Link from "next/link";
import { Champion } from "@/types/champion";
import { getSimilarChampions } from "@/lib/similar-champions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RARITY_COLORS, RARITY_BORDER_COLORS } from "@/lib/constants";
import { AffinityIcon } from "@/components/affinity-icon";

export function SimilarChampionsSection({ champion }: { champion: Champion }) {
  const similar = getSimilarChampions(champion);

  if (similar.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Similar Champions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {similar.map(({ champion: champ, sharedStrengths }) => {
            const rarityClass = RARITY_COLORS[champ.rarity] ?? "bg-zinc-600";
            const borderColor =
              RARITY_BORDER_COLORS[champ.rarity] ?? "#52525B";

            return (
              <Link
                key={champ.id}
                href={`/champions/${champ.slug}`}
                className="group flex flex-col overflow-hidden rounded-sm border-2 bg-[#141418] transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E]"
                style={{ borderColor }}
              >
                {/* Avatar */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/80">
                  {champ.avatar_url ? (
                    <img
                      src={champ.avatar_url}
                      alt={champ.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#2A2A30]">
                      {champ.name.charAt(0)}
                    </div>
                  )}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-80"
                    style={{ background: borderColor }}
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1.5 p-2.5 bg-[#1A1A20]/70 border-t border-[#2A2A30]">
                  <h4 className="truncate text-xs font-bold uppercase tracking-tight text-[#E8E4DF] transition-colors group-hover:text-[#C8963E]">
                    {champ.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`text-[8px] px-1 py-0 font-bold uppercase ${rarityClass}`}
                      style={{ borderColor }}
                    >
                      {champ.rarity}
                    </Badge>
                    <AffinityIcon affinity={champ.affinity} size={14} />
                    <span className="text-[9px] font-semibold uppercase text-[#7A7570]">
                      {champ.role}
                    </span>
                  </div>
                  {sharedStrengths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {sharedStrengths.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[9px] sm:text-[8px] font-medium uppercase tracking-wide text-[#C8963E]/80 bg-[#C8963E]/10 px-1 py-0.5 rounded-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Compare link */}
        <div className="mt-4 text-center">
          <Link
            href={`/compare?champions=${champion.slug},${similar.map((s) => s.champion.slug).join(",")}`}
            className="text-xs font-medium text-[#7A7570] transition-colors hover:text-[#C8963E]"
          >
            Compare all &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
