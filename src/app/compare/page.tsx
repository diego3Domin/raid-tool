import { Suspense } from "react";
import { getAllChampions } from "@/lib/champions";
import { CompareClient } from "./compare-client";

export const metadata = {
  title: "Compare Champions | RAID Tool",
  description: "Compare up to 3 RAID: Shadow Legends champions side by side — stats, skills, and ratings.",
};

export default function ComparePage() {
  const champions = getAllChampions();
  return (
    <Suspense>
      <CompareClient champions={champions} />
    </Suspense>
  );
}
