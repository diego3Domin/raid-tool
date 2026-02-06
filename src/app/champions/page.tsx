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
      <h1 className="mb-6 text-3xl font-bold text-gold">Champions</h1>
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
