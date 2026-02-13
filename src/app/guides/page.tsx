import Link from "next/link";
import { getAllChampions } from "@/lib/champions";
import { getAllGuidedChampionSlugs, getGuideCount, getGuidesForChampion } from "@/lib/guides";
import { GUIDE_CONTENT_AREAS } from "@/types/guide";
import { RARITY_BORDER_COLORS } from "@/lib/constants";

export const metadata = {
  title: "Build Guides | RAID Tool",
  description:
    "Browse 1500+ champion build guides for RAID: Shadow Legends. Gear sets, stat priorities, masteries, and skill booking order for every content area.",
};

const CONTENT_AREA_META: Record<string, { icon: string; description: string }> = {
  General: { icon: "\u2694", description: "All-purpose builds for everyday use" },
  "Clan Boss": { icon: "\u{1F409}", description: "Maximize damage against the Demon Lord" },
  Arena: { icon: "\u{1F3C6}", description: "Dominate PvP offense and defense" },
  Dungeons: { icon: "\u{1F3F0}", description: "Clear Dragon, Spider, Fire Knight & more" },
  Hydra: { icon: "\u{1F419}", description: "Multi-headed boss team strategies" },
  "Doom Tower": { icon: "\u{1F5FC}", description: "Conquer waves and secret rooms" },
  "Faction Wars": { icon: "\u{1F6E1}", description: "Faction-locked stage progression" },
};

export default function GuidesPage() {
  const allChampions = getAllChampions();
  const guidedSlugs = getAllGuidedChampionSlugs();
  const totalGuides = getGuideCount();

  // Build featured champions: those with guides, sorted by overall rating
  const featuredChampions = guidedSlugs
    .map((slug) => {
      const champ = allChampions.find((c) => c.slug === slug);
      if (!champ || !champ.avatar_url) return null;
      const guides = getGuidesForChampion(slug);
      return { ...champ, guideCount: guides.length };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => (b.ratings.overall ?? 0) - (a.ratings.overall ?? 0))
    .slice(0, 12);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-24">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse at top center, rgba(200, 150, 62, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(139, 26, 26, 0.05) 0%, transparent 40%)
            `,
          }}
        />
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="mb-6 text-4xl sm:text-5xl md:text-6xl leading-[0.9]"
            style={{
              background: "linear-gradient(180deg, #E8C460 0%, #C8963E 40%, #9A6E25 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 4px 24px rgba(200, 150, 62, 0.5))",
            }}
          >
            Build Guides
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-[#7A7570]">
            Gear sets, stat priorities, masteries, and skill booking order — structured builds for
            every champion and content area.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <p className="text-3xl font-black text-[#C8963E]">{guidedSlugs.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570]">Champions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#C8963E]">{totalGuides.toLocaleString()}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570]">Builds</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#C8963E]">{GUIDE_CONTENT_AREAS.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570]">
                Content Areas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area Cards */}
      <section className="border-t border-[#2A2A30] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-10 text-center text-2xl sm:text-3xl"
            style={{
              background: "linear-gradient(180deg, #E8E4DF 0%, #7A7570 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Browse by Content Area
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDE_CONTENT_AREAS.map((area) => {
              const meta = CONTENT_AREA_META[area];
              return (
                <Link
                  key={area}
                  href="/champions"
                  className="group relative overflow-hidden rounded-sm border-2 border-[#2A2A30] bg-[#141418] p-5 transition-all hover:border-[#C8963E]/50"
                  style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)" }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8963E]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{meta?.icon ?? "\u2694"}</span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-tight text-[#E8E4DF] group-hover:text-[#C8963E]">
                        {area}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#7A7570]">
                        {meta?.description ?? "Champion builds for this content area"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Champion Builds */}
      <section className="border-t border-[#2A2A30] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-8 text-center text-2xl sm:text-3xl"
            style={{
              background: "linear-gradient(180deg, #E8E4DF 0%, #7A7570 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Top Rated Champions with Guides
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {featuredChampions.map((c) => (
              <Link
                key={c.id}
                href={`/champions/${c.slug}`}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className="aspect-square w-full overflow-hidden rounded-sm border-2 bg-[#141418] transition-all group-hover:shadow-[0_0_16px_rgba(200,150,62,0.3)]"
                  style={{
                    borderColor: `${RARITY_BORDER_COLORS[c.rarity] ?? "#2A2A30"}80`,
                  }}
                >
                  <img
                    src={c.avatar_url}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="max-w-full truncate text-[10px] font-semibold uppercase tracking-wide text-[#7A7570] group-hover:text-[#C8963E]">
                    {c.name}
                  </span>
                  <span className="text-[9px] text-[#7A7570]/60">
                    {c.guideCount} {c.guideCount === 1 ? "build" : "builds"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2A2A30] px-4 py-16 text-center">
        <p className="mb-6 text-lg text-[#7A7570]">
          Every champion page includes detailed build guides for each content area.
        </p>
        <Link
          href="/champions"
          className="inline-flex items-center gap-2 rounded-sm border-2 border-[#C8963E] bg-[#C8963E] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#0A0A0F] transition-all hover:bg-[#E8C460] hover:border-[#E8C460]"
          style={{
            boxShadow: "0 4px 16px rgba(200, 150, 62, 0.4)",
          }}
        >
          Browse All Champions
        </Link>
      </section>
    </div>
  );
}
