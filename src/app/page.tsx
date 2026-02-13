import Link from "next/link";
import { getAllChampions } from "@/lib/champions";

const allChampions = getAllChampions();
const totalChampions = allChampions.length;
const featuredChampions = allChampions
  .filter((c) => c.rarity === "Legendary" && c.avatar_url)
  .sort((a, b) => (b.ratings.overall ?? 0) - (a.ratings.overall ?? 0))
  .slice(0, 12);

const features = [
  {
    title: "Champion Database",
    description: `Browse ${totalChampions}+ champions with stats, skills, and ratings. Search, filter, and compare side-by-side.`,
    href: "/champions",
    cta: "Browse Champions",
    icon: "\u2694",
  },
  {
    title: "Tier Lists",
    description: "Community-voted rankings across 13 content areas. Find the best champions for every dungeon and boss.",
    href: "/tier-lists",
    cta: "Coming Soon",
    icon: "\u{1F3C6}",
  },
  {
    title: "Build Guides",
    description: "Structured champion builds with gear sets, stat priorities, masteries, and skill booking order.",
    href: "/guides",
    cta: "Browse Guides",
    icon: "\u{1F4D6}",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-28">
        {/* Atmospheric background effects */}
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
            className="mb-6 text-4xl sm:text-5xl md:text-7xl leading-[0.9]"
            style={{
              background: 'linear-gradient(180deg, #E8C460 0%, #C8963E 40%, #9A6E25 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 24px rgba(200, 150, 62, 0.5))',
            }}
          >
            Your RAID
            <br />
            Companion
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-[#7A7570]">
            The community-driven champion reference for{" "}
            <span className="font-semibold text-[#E8E4DF]">RAID: Shadow Legends</span>.
            Stats, skills, tier lists, and build guides — all in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/champions"
              className="inline-flex items-center gap-2 rounded-sm border-2 border-[#C8963E] bg-[#C8963E] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#0A0A0F] transition-all hover:bg-[#E8C460] hover:border-[#E8C460]"
              style={{
                boxShadow: '0 4px 16px rgba(200, 150, 62, 0.4), 0 0 24px rgba(200, 150, 62, 0.2)',
              }}
            >
              Browse {totalChampions} Champions
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-sm border-2 border-[#2A2A30] bg-[#141418] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#7A7570] transition-all hover:border-[#C8963E]/50 hover:text-[#C8963E]"
            >
              Compare Champions
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Champions Showcase */}
      <section className="border-t border-[#2A2A30] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-8 text-center text-2xl sm:text-3xl"
            style={{
              background: 'linear-gradient(180deg, #E8E4DF 0%, #7A7570 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Top Rated Champions
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {featuredChampions.map((c) => (
              <Link
                key={c.id}
                href={`/champions/${c.slug}`}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className="aspect-square w-full overflow-hidden rounded-sm border-2 border-[#C8963E]/30 bg-[#141418] transition-all group-hover:border-[#C8963E] group-hover:shadow-[0_0_16px_rgba(200,150,62,0.3)]"
                >
                  {c.avatar_url ? (
                    <img
                      src={c.avatar_url}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#2A2A30]">
                      {c.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="max-w-full truncate text-[10px] font-semibold uppercase tracking-wide text-[#7A7570] group-hover:text-[#C8963E]">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-t border-[#2A2A30] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-10 text-center text-2xl sm:text-3xl"
            style={{
              background: 'linear-gradient(180deg, #E8E4DF 0%, #7A7570 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Everything You Need
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative overflow-hidden rounded-sm border-2 border-[#2A2A30] bg-[#141418] p-6 transition-all hover:border-[#C8963E]/50"
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8963E]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-[#E8E4DF] group-hover:text-[#C8963E]">
                  {feature.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#7A7570]">
                  {feature.description}
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8963E]">
                  {feature.cta} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-t border-[#2A2A30] px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 sm:gap-16">
          <div className="text-center">
            <p className="text-3xl font-black text-[#C8963E]">{totalChampions}+</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570]">Champions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-[#C8963E]">13</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570]">Content Areas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-[#C8963E]">17</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570]">Factions</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#2A2A30] px-4 py-16 text-center">
        <p className="mb-6 text-lg text-[#7A7570]">
          Ready to find the perfect champions for your team?
        </p>
        <Link
          href="/champions"
          className="inline-flex items-center gap-2 rounded-sm border-2 border-[#C8963E] bg-[#C8963E] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#0A0A0F] transition-all hover:bg-[#E8C460] hover:border-[#E8C460]"
          style={{
            boxShadow: '0 4px 16px rgba(200, 150, 62, 0.4)',
          }}
        >
          Explore All Champions
        </Link>
      </section>
    </div>
  );
}
