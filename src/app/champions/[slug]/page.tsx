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
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Champions
      </Link>

      {/* Hero section */}
      <div className="mb-8 flex gap-6">
        {/* Avatar */}
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {champion.avatar_url ? (
            <img
              src={champion.avatar_url}
              alt={champion.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
              {champion.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name & meta */}
        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            {champion.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={rarityClass}>{champion.rarity}</Badge>
            <span className={`font-medium ${affinityClass}`}>
              {champion.affinity}
            </span>
            <span className="text-muted-foreground">{champion.role}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{champion.faction}</span>
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

      {/* Skills */}
      {champion.skills.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {champion.skills.map((skill, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">
                    {skill.name}
                  </h3>
                  {skill.cooldown && (
                    <span className="text-xs text-muted-foreground">
                      CD: {skill.cooldown} turns
                    </span>
                  )}
                  {skill.multiplier && (
                    <span className="text-xs text-[#D4A43C]">
                      {skill.multiplier}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
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
    <span className="text-[#D4A43C]" title={`${value} / ${maxStars}`}>
      {"★".repeat(filled)}
      {"☆".repeat(maxStars - filled)}
    </span>
  );
}
