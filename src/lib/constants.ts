export const RARITY_COLORS: Record<string, string> = {
  Common: "bg-zinc-600 text-slate-200",
  Uncommon: "bg-green-700 text-white",
  Rare: "bg-blue-700 text-white",
  Epic: "bg-purple-700 text-white",
  Legendary: "bg-[#C8963E] text-[#0A0A0F]",
  Mythical: "bg-[#8B1A1A] text-white",
};

export const RARITY_BORDER_COLORS: Record<string, string> = {
  Common: "#52525B",
  Uncommon: "#16A34A",
  Rare: "#3B82F6",
  Epic: "#A855F7",
  Legendary: "#C8963E",
  Mythical: "#8B1A1A",
};

// Game progression order: weakest → strongest
export const RARITY_ORDER: string[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythical",
];

export const AFFINITY_COLORS: Record<string, string> = {
  Magic: "text-blue-400",
  Force: "text-red-400",
  Spirit: "text-green-400",
  Void: "text-purple-400",
};
