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
      {/* Page header — epic medieval title */}
      <div className="mb-10 relative">
        <h1 className="mb-2 bg-gradient-to-r from-[#E8C460] via-[#D4A43C] to-[#A67C1E] bg-clip-text text-5xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_4px_12px_rgba(212,164,60,0.4)]">
          Champions
        </h1>
        {/* Ornate divider */}
        <div className="h-[2px] w-32 bg-gradient-to-r from-[#D4A43C] to-transparent"></div>
        <div className="h-[1px] w-32 bg-gradient-to-r from-[#E8C460] to-transparent -mt-[1px]"></div>
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
