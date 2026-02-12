import Link from "next/link";

export const metadata = {
  title: "Tier Lists | RAID Tool",
  description: "Community-voted champion tier lists for every content area in RAID: Shadow Legends.",
};

export default function TierListsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="mb-6 text-6xl">&#9876;</div>
      <h1
        className="mb-4 text-3xl sm:text-4xl"
        style={{
          background: 'linear-gradient(180deg, #E8C460 0%, #C8963E 50%, #9A6E25 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 16px rgba(200, 150, 62, 0.4))',
        }}
      >
        Tier Lists
      </h1>
      <p className="mb-2 text-lg text-[#7A7570]">
        Community-voted champion rankings across 13 content areas.
      </p>
      <p className="mb-8 text-sm text-[#7A7570]/70">
        Vote on champion tiers, see where each champion ranks, and find the best picks for every dungeon, arena, and boss.
      </p>
      <div className="inline-block rounded-sm border-2 border-[#C8963E]/30 bg-[#141418] px-6 py-3">
        <p className="text-sm font-bold uppercase tracking-wider text-[#C8963E]">
          Coming Soon
        </p>
      </div>
      <div className="mt-8">
        <Link
          href="/champions"
          className="text-sm font-medium text-[#7A7570] transition-colors hover:text-[#C8963E]"
        >
          &larr; Browse Champions
        </Link>
      </div>
    </div>
  );
}
