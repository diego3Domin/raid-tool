import {
  getAllChampions,
  getUniqueFactions,
  getUniqueAffinities,
  getUniqueRarities,
  getUniqueRoles,
} from "@/lib/champions";
import { ChampionIndex } from "./champion-index";

export const metadata = {
  title: "Champions | RAID Tool",
  description: "Browse, search, and filter all RAID: Shadow Legends champions.",
};

export default function ChampionsPage() {
  const champions = getAllChampions();
  const factions = getUniqueFactions();
  const affinities = getUniqueAffinities();
  const rarities = getUniqueRarities();
  const roles = getUniqueRoles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page header — epic atmospheric title */}
      <div className="mb-10 relative">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(200, 150, 62, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <h1
          className="mb-2 text-5xl font-black uppercase tracking-tight"
          style={{
            background: 'linear-gradient(180deg, #E8C460 0%, #C8963E 50%, #9A6E25 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 16px rgba(200, 150, 62, 0.4))',
          }}
        >
          Champions
        </h1>
        <p className="text-sm text-[#7A7570] mt-2 font-medium">
          Browse the complete collection of RAID champions
        </p>
        {/* Forged divider with accent */}
        <div className="mt-4 w-32 relative">
          <div className="h-[2px] bg-gradient-to-r from-[#C8963E] via-[#9A6E25] to-transparent"></div>
          <div className="h-[1px] bg-gradient-to-r from-[#E8C460] to-transparent -mt-[1px]"></div>
          <div className="absolute -left-1 -top-[3px] w-1 h-[8px] bg-[#C8963E] shadow-[0_0_6px_rgba(200,150,62,0.6)]"></div>
        </div>
      </div>
      <ChampionIndex
        champions={champions}
        factions={factions}
        affinities={affinities}
        rarities={rarities}
        roles={roles}
      />
    </div>
  );
}
