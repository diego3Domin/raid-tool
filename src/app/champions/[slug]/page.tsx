import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllChampions, getChampionBySlug } from "@/lib/champions";
import { getFilteredGuidesForChampion } from "@/lib/guides";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RARITY_COLORS, RARITY_BORDER_COLORS } from "@/lib/constants";
import { AffinityIcon } from "@/components/affinity-icon";
import { FactionIcon } from "@/components/faction-icon";
import { MasteryTreeDiagram } from "@/components/mastery-tree-diagram";

export async function generateStaticParams() {
  return getAllChampions().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const champion = getChampionBySlug(slug);
  if (!champion) return { title: "Champion Not Found | RAID Tool" };
  const title = `${champion.name} — Stats, Skills, Builds | RAID Tool`;
  const description = `${champion.name} is a ${champion.rarity} ${champion.affinity} ${champion.role} from ${champion.faction}. View stats, skills, tier placements, and build guides.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(champion.avatar_url && { images: [{ url: champion.avatar_url, alt: champion.name }] }),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const RATING_LABELS: Record<string, string> = {
  overall: "Overall",
  clan_boss: "Clan Boss",
  hydra: "Hydra",
  chimera: "Chimera",
  arena_offense: "Arena",
  dungeons: "Dungeons",
  spider: "Spider",
  dragon: "Dragon",
  fire_knight: "Fire Knight",
  ice_golem: "Ice Golem",
  iron_twins: "Iron Twins",
  sand_devil: "Sand Devil",
  phantom_grove: "Phantom Shogun",
  doom_tower: "Doom Tower",
  faction_wars: "Faction Wars",
};

/** Content areas for tier placements display */
const TIER_CONTENT_AREAS = [
  { key: "clan_boss", label: "Clan Boss" },
  { key: "hydra", label: "Hydra" },
  { key: "chimera", label: "Chimera" },
  { key: "arena_offense", label: "Arena" },
  { key: "spider", label: "Spider" },
  { key: "dragon", label: "Dragon" },
  { key: "fire_knight", label: "Fire Knight" },
  { key: "ice_golem", label: "Ice Golem" },
  { key: "iron_twins", label: "Iron Twins" },
  { key: "sand_devil", label: "Sand Devil" },
  { key: "phantom_grove", label: "Phantom Shogun" },
  { key: "doom_tower", label: "Doom Tower" },
  { key: "faction_wars", label: "Faction Wars" },
] as const;

/** Convert a numeric rating (0-5) to a tier letter */
function ratingToTier(rating: number | undefined): string | null {
  if (rating == null || rating === 0) return null;
  if (rating >= 4.5) return "S";
  if (rating >= 3.5) return "A";
  if (rating >= 2.5) return "B";
  if (rating >= 1.5) return "C";
  if (rating >= 0.5) return "D";
  return "F";
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: "bg-[#8B1A1A]/20", text: "text-red-400", border: "border-[#8B1A1A]" },
  A: { bg: "bg-[#C8963E]/20", text: "text-[#E8C460]", border: "border-[#C8963E]" },
  B: { bg: "bg-purple-900/30", text: "text-purple-400", border: "border-purple-600" },
  C: { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-600" },
  D: { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-600" },
  F: { bg: "bg-zinc-800/30", text: "text-zinc-400", border: "border-zinc-600" },
};

export default async function ChampionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const champion = getChampionBySlug(slug);
  if (!champion) notFound();

  const guides = getFilteredGuidesForChampion(slug, champion.ratings);
  const stats = champion.stats["6"];
  const rarityClass = RARITY_COLORS[champion.rarity] ?? "bg-zinc-600";
  const rarityBorderColor = RARITY_BORDER_COLORS[champion.rarity] ?? "#52525B";

  const ratings = Object.entries(champion.ratings).filter(
    ([, v]) => v != null
  );

  const tierPlacements = TIER_CONTENT_AREAS.map((area) => ({
    ...area,
    tier: ratingToTier((champion.ratings as Record<string, number | undefined>)[area.key]),
    rating: (champion.ratings as Record<string, number | undefined>)[area.key],
  }));

  const hasTierData = tierPlacements.some((t) => t.tier !== null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back link + Compare link */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/champions"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#7A7570] transition-all duration-200 hover:text-[#C8963E]"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">&larr;</span>
          Back to Champions
        </Link>
        <Link
          href={`/compare?champions=${champion.slug}`}
          className="text-sm font-medium text-[#7A7570] transition-colors hover:text-[#C8963E]"
        >
          Compare &rarr;
        </Link>
      </div>

      {/* Champion header */}
      <div
        className="mb-10 border-2 bg-[#141418] p-5 sm:p-8 rounded-sm relative overflow-hidden"
        style={{
          borderColor: rarityBorderColor,
          boxShadow: `
            0 8px 24px rgba(0, 0, 0, 0.8),
            0 2px 4px rgba(0, 0, 0, 0.9),
            inset 0 1px 0 rgba(200, 150, 62, 0.1),
            0 0 0 1px ${rarityBorderColor}30
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${rarityBorderColor}30 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${rarityBorderColor} 0%, transparent 100%)`,
          }}
        />

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8 relative z-10">
          <div
            className="h-32 w-32 sm:h-48 sm:w-48 shrink-0 overflow-hidden rounded-sm border-2 bg-black/90"
            style={{
              borderColor: rarityBorderColor,
              boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.8),
                inset 0 2px 8px rgba(0, 0, 0, 0.8),
                0 0 24px ${rarityBorderColor}40
              `,
            }}
          >
            {champion.avatar_url ? (
              <img
                src={champion.avatar_url}
                alt={champion.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-black text-[#2A2A30]">
                {champion.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start justify-center gap-4">
            <h1
              className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-center sm:text-left"
              style={{
                background: `linear-gradient(180deg, ${rarityBorderColor}FF 0%, ${rarityBorderColor}CC 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 2px 12px ${rarityBorderColor}60)`,
              }}
            >
              {champion.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <Badge
                className={`text-[10px] sm:text-xs border ${rarityClass}`}
                style={{
                  borderColor: rarityBorderColor,
                  boxShadow: `0 2px 8px ${rarityBorderColor}40`,
                }}
              >
                {champion.rarity}
              </Badge>
              <AffinityIcon affinity={champion.affinity} size={24} showLabel />
              <span className="hidden sm:inline text-[#2A2A30]">&bull;</span>
              <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-[#7A7570]">{champion.role}</span>
              <span className="hidden sm:inline text-[#2A2A30]">&bull;</span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <FactionIcon faction={champion.faction} size={24} />
                <span className="text-sm sm:text-base font-semibold text-[#7A7570]">{champion.faction}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Placements Grid */}
      {hasTierData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tier Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {tierPlacements.map((area) => {
                const tier = area.tier;
                const colors = tier ? TIER_COLORS[tier] : null;
                return (
                  <div
                    key={area.key}
                    className={`flex items-center justify-between rounded-sm border p-3 ${
                      colors
                        ? `${colors.bg} ${colors.border}`
                        : "border-[#2A2A30] bg-[#1A1A20]"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#7A7570]">
                      {area.label}
                    </span>
                    {tier ? (
                      <span className={`text-lg font-black ${colors!.text}`}>
                        {tier}
                      </span>
                    ) : (
                      <span className="text-sm text-[#3A3630]">&mdash;</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Base Stats (6-Star)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stat</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["HP", stats.hp],
                    ["ATK", stats.atk],
                    ["DEF", stats.def],
                    ["SPD", stats.spd],
                    ["C.Rate", `${stats.crit_rate}%`],
                    ["C.DMG", `${stats.crit_dmg}%`],
                    ["RES", stats.res],
                    ["ACC", stats.acc],
                  ].map(([label, value]) => (
                    <TableRow key={label as string}>
                      <TableCell className="font-medium">
                        {label as string}
                      </TableCell>
                      <TableCell className="text-right">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Stats not yet available for this champion.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Ratings */}
        {ratings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Area</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratings.map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        {RATING_LABELS[key] ?? key}
                      </TableCell>
                      <TableCell className="text-right">
                        <RatingDisplay value={value as number} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Skills */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Skills & Abilities</CardTitle>
        </CardHeader>
        <CardContent>
          {champion.skills.length > 0 ? (
            <div className="space-y-3">
              {champion.skills.map((skill, i) => (
                <div
                  key={i}
                  className="skill-card border-l-4 border-[#4A5568] bg-[#1A1A20]/70 p-4 rounded-sm transition-all duration-200 relative overflow-hidden group hover:border-[#C8963E]"
                  style={{
                    boxShadow: `
                      inset 0 1px 2px rgba(0, 0, 0, 0.4),
                      0 2px 4px rgba(0, 0, 0, 0.3)
                    `,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-bold text-base uppercase tracking-wide text-[#E8E4DF]">
                      {skill.name}
                    </h3>
                    {skill.cooldown && (
                      <span
                        className="bg-[#0A0A0F] border-2 border-[#2A2A30] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#7A7570]"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        CD: {skill.cooldown}
                      </span>
                    )}
                    {skill.multiplier && (
                      <span
                        className="bg-[#C8963E]/20 border-2 border-[#C8963E]/60 px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#C8963E]"
                        style={{
                          boxShadow: '0 0 8px rgba(200, 150, 62, 0.3)',
                        }}
                      >
                        {skill.multiplier}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-[#7A7570]">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Skills data coming soon for this champion.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Build Guides */}
      {guides.length > 0 ? (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wide text-[#E8E4DF]">
            Build Guides
          </h2>
          {guides.map((guide, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <span>{guide.content_area} Build</span>
                  <Badge
                    variant="outline"
                    className="border-[#C8963E]/40 bg-[#C8963E]/10 text-[#C8963E] text-xs"
                  >
                    {guide.mastery_tree}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Gear Sets */}
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A7570]">
                    Gear Sets
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.gear_sets.map((set) => (
                      <Badge
                        key={set}
                        variant="secondary"
                        className="bg-[#1A1A20] border border-[#2A2A30] text-[#E8E4DF] text-xs"
                      >
                        {set}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stat Priorities */}
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A7570]">
                    Stat Priority
                  </h4>
                  <div className="flex flex-wrap items-center gap-1">
                    {guide.stat_priorities.map((stat, j) => (
                      <span key={stat} className="flex items-center gap-1">
                        <span className="text-sm font-medium text-[#E8E4DF]">{stat}</span>
                        {j < guide.stat_priorities.length - 1 && (
                          <span className="text-[#3A3630] mx-0.5">&gt;</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-sm border border-[#2A2A30] bg-[#1A1A20] p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7570]">
                      Gauntlets
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#E8E4DF]">
                      {guide.gauntlets_main}
                    </p>
                  </div>
                  <div className="rounded-sm border border-[#2A2A30] bg-[#1A1A20] p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7570]">
                      Chestplate
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#E8E4DF]">
                      {guide.chestplate_main}
                    </p>
                  </div>
                  <div className="rounded-sm border border-[#2A2A30] bg-[#1A1A20] p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7570]">
                      Boots
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#E8E4DF]">
                      {guide.boots_main}
                    </p>
                  </div>
                </div>

                {/* Mastery Tree */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7A7570]">
                    Mastery Tree
                  </h4>
                  <MasteryTreeDiagram masteryTree={guide.mastery_tree} role={champion.role} />
                </div>

                {/* Skill Booking Order */}
                {guide.skill_booking_order && guide.skill_booking_order.length > 0 && (
                  <div>
                    <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A7570]">
                      Skill Book Priority
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.skill_booking_order.map((skillIdx, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="border-[#4A5568] text-[#E8E4DF] text-xs"
                        >
                          A{skillIdx + 1}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategy Notes */}
                <div className="border-t border-[#2A2A30] pt-3">
                  <p className="text-sm leading-relaxed text-[#7A7570]">
                    {guide.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6 border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Build Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No guides yet &mdash; be the first to submit one.
            </p>
            <p className="mt-2 text-xs text-[#7A7570]/60">
              Gear sets, stat priorities, and mastery recommendations will appear here once guides are available.
            </p>
          </CardContent>
        </Card>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            name: champion.name,
            description: `${champion.name} — ${champion.rarity} ${champion.affinity} ${champion.role} from ${champion.faction}`,
            ...(champion.avatar_url && { image: champion.avatar_url }),
            isPartOf: {
              "@type": "WebSite",
              name: "RAID Tool",
            },
          }),
        }}
      />
    </div>
  );
}

function RatingDisplay({ value }: { value: number }) {
  const maxStars = 5;
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.25 && value - fullStars < 0.75;
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-1.5" title={`${value} / ${maxStars}`}>
      <span className="text-[#C8963E]">
        {"★".repeat(fullStars)}
        {hasHalf && (
          <span className="relative inline-block" style={{ width: "1em" }}>
            <span className="absolute inset-0 overflow-hidden" style={{ width: "0.5em" }}>★</span>
            <span className="text-[#3A3630]">★</span>
          </span>
        )}
        {emptyStars > 0 && (
          <span className="text-[#3A3630]">{"★".repeat(emptyStars)}</span>
        )}
      </span>
      <span className="text-xs font-semibold text-[#7A7570]">({value})</span>
    </span>
  );
}
