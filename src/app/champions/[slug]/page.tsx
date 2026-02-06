import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllChampions, getChampionBySlug } from "@/lib/champions";
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
import { RARITY_COLORS, AFFINITY_COLORS } from "@/lib/constants";

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
  return {
    title: `${champion.name} | RAID Tool`,
    description: `${champion.name} — ${champion.rarity} ${champion.affinity} ${champion.role} from ${champion.faction}`,
  };
}

const RATING_LABELS: Record<string, string> = {
  overall: "Overall",
  campaign: "Campaign",
  clan_boss: "Clan Boss",
  arena_offense: "Arena Offense",
  arena_defense: "Arena Defense",
  dungeons: "Dungeons",
  hydra: "Hydra",
  faction_wars: "Faction Wars",
  doom_tower: "Doom Tower",
};

export default async function ChampionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const champion = getChampionBySlug(slug);
  if (!champion) notFound();

  const stats = champion.stats["6"];
  const affinityClass = AFFINITY_COLORS[champion.affinity] ?? "";
  const rarityClass = RARITY_COLORS[champion.rarity] ?? "bg-zinc-600";

  const ratings = Object.entries(champion.ratings).filter(
    ([, v]) => v != null
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/champions"
        className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#7A7570] transition-colors hover:text-[#C8963E]"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">&larr;</span>
        Back to Champions
      </Link>

      {/* Clean champion header */}
      <div className="mb-10 border border-[#2A2A30] bg-[#141418] p-8 rounded-sm">
        <div className="flex gap-8">
          {/* Avatar — clean, no frame */}
          <div className="h-48 w-48 shrink-0 overflow-hidden rounded-sm border border-[#C8963E]/40 bg-black/80">
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

          {/* Name & meta — heavy condensed */}
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-[#C8963E] text-5xl font-black uppercase tracking-tighter leading-tight">
              {champion.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`text-xs ${rarityClass}`}>{champion.rarity}</Badge>
              <span className={`text-base font-bold uppercase tracking-wide ${affinityClass}`}>
                {champion.affinity}
              </span>
              <span className="text-[#2A2A30]">•</span>
              <span className="text-base font-bold uppercase tracking-wide text-[#7A7570]">{champion.role}</span>
              <span className="text-[#2A2A30]">•</span>
              <span className="text-base font-semibold text-[#7A7570]">{champion.faction}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stats */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Base Stats (6-Star)</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

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

      {/* Skills — clean cards with left accent */}
      {champion.skills.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Skills & Abilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {champion.skills.map((skill, i) => (
              <div key={i} className="border-l-2 border-[#4A5568] bg-[#1A1A20]/50 p-4 rounded-sm hover:border-[#C8963E] transition-colors">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-bold text-base uppercase tracking-wide text-[#E8E4DF]">
                    {skill.name}
                  </h3>
                  {skill.cooldown && (
                    <span className="bg-[#1A1A20] border border-[#2A2A30] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#7A7570]">
                      CD: {skill.cooldown}
                    </span>
                  )}
                  {skill.multiplier && (
                    <span className="bg-[#C8963E]/20 border border-[#C8963E]/40 px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#C8963E]">
                      {skill.multiplier}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[#7A7570]">
                  {skill.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Placeholder sections */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Recommended Builds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon — gear sets, masteries, and build recommendations.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Community-written guides and strategies for {champion.name}.
            </p>
            <Link
              href="/guides"
              className="text-sm text-primary hover:underline"
            >
              Browse Guides &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RatingDisplay({ value }: { value: number }) {
  const maxStars = 5;
  const filled = Math.round(value);
  return (
    <span className="text-[#C8963E]" title={`${value} / ${maxStars}`}>
      {"★".repeat(filled)}
      {"☆".repeat(maxStars - filled)}
    </span>
  );
}
