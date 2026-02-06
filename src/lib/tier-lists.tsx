"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type Tier = "S" | "A" | "B" | "C" | "D" | "F";

export const TIERS: Tier[] = ["S", "A", "B", "C", "D", "F"];

export const TIER_COLORS: Record<Tier, string> = {
  S: "bg-[#8B1A1A] text-white border border-[#8B1A1A] font-black",
  A: "bg-orange-700 text-white border border-orange-700 font-black",
  B: "bg-yellow-700 text-[#0A0A0F] border border-yellow-700 font-black",
  C: "bg-green-700 text-white border border-green-700 font-black",
  D: "bg-blue-700 text-white border border-blue-700 font-black",
  F: "bg-gray-700 text-[#E8E4DF] border border-gray-700 font-black",
};

export interface TierPlacement {
  champion_id: string;
  tier: Tier;
}

export interface TierList {
  id: string;
  name: string;
  content_area: string;
  placements: TierPlacement[];
  updated_at: string;
}

export interface CommunityVote {
  user_id: string;
  champion_id: string;
  content_area: string;
  tier: Tier;
}

interface TierListsContextType {
  tierLists: TierList[];
  communityVotes: CommunityVote[];
  saveTierList: (list: Omit<TierList, "id" | "updated_at">) => TierList;
  updateTierList: (id: string, updates: Partial<TierList>) => void;
  deleteTierList: (id: string) => void;
  getTierList: (id: string) => TierList | undefined;
  castVote: (userId: string, championId: string, contentArea: string, tier: Tier) => void;
  getUserVote: (userId: string, championId: string, contentArea: string) => CommunityVote | undefined;
  getAggregatedVotes: (contentArea: string) => Map<string, Tier>;
}

const TierListsContext = createContext<TierListsContextType | null>(null);

const CURATED_KEY = "raid-tool-tier-lists";
const VOTES_KEY = "raid-tool-community-votes";

export function TierListsProvider({ children }: { children: ReactNode }) {
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [communityVotes, setCommunityVotes] = useState<CommunityVote[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURATED_KEY);
      if (stored) setTierLists(JSON.parse(stored));
    } catch { /* empty */ }
    try {
      const stored = localStorage.getItem(VOTES_KEY);
      if (stored) setCommunityVotes(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  const persistLists = useCallback((updated: TierList[]) => {
    setTierLists(updated);
    localStorage.setItem(CURATED_KEY, JSON.stringify(updated));
  }, []);

  const persistVotes = useCallback((updated: CommunityVote[]) => {
    setCommunityVotes(updated);
    localStorage.setItem(VOTES_KEY, JSON.stringify(updated));
  }, []);

  const saveTierList = useCallback(
    (list: Omit<TierList, "id" | "updated_at">) => {
      const newList: TierList = {
        ...list,
        id: crypto.randomUUID(),
        updated_at: new Date().toISOString(),
      };
      persistLists([...tierLists, newList]);
      return newList;
    },
    [tierLists, persistLists]
  );

  const updateTierList = useCallback(
    (id: string, updates: Partial<TierList>) => {
      persistLists(
        tierLists.map((t) =>
          t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
        )
      );
    },
    [tierLists, persistLists]
  );

  const deleteTierList = useCallback(
    (id: string) => {
      persistLists(tierLists.filter((t) => t.id !== id));
    },
    [tierLists, persistLists]
  );

  const getTierList = useCallback(
    (id: string) => tierLists.find((t) => t.id === id),
    [tierLists]
  );

  const castVote = useCallback(
    (userId: string, championId: string, contentArea: string, tier: Tier) => {
      const filtered = communityVotes.filter(
        (v) => !(v.user_id === userId && v.champion_id === championId && v.content_area === contentArea)
      );
      persistVotes([...filtered, { user_id: userId, champion_id: championId, content_area: contentArea, tier }]);
    },
    [communityVotes, persistVotes]
  );

  const getUserVote = useCallback(
    (userId: string, championId: string, contentArea: string) =>
      communityVotes.find(
        (v) => v.user_id === userId && v.champion_id === championId && v.content_area === contentArea
      ),
    [communityVotes]
  );

  const getAggregatedVotes = useCallback(
    (contentArea: string): Map<string, Tier> => {
      const votesForArea = communityVotes.filter((v) => v.content_area === contentArea);
      const grouped = new Map<string, Tier[]>();
      for (const v of votesForArea) {
        const existing = grouped.get(v.champion_id) ?? [];
        existing.push(v.tier);
        grouped.set(v.champion_id, existing);
      }
      // Majority vote per champion
      const result = new Map<string, Tier>();
      for (const [champId, tiers] of grouped) {
        const counts = new Map<Tier, number>();
        for (const t of tiers) counts.set(t, (counts.get(t) ?? 0) + 1);
        let maxTier: Tier = "F";
        let maxCount = 0;
        for (const [t, c] of counts) {
          if (c > maxCount) {
            maxCount = c;
            maxTier = t;
          }
        }
        result.set(champId, maxTier);
      }
      return result;
    },
    [communityVotes]
  );

  return (
    <TierListsContext.Provider
      value={{
        tierLists,
        communityVotes,
        saveTierList,
        updateTierList,
        deleteTierList,
        getTierList,
        castVote,
        getUserVote,
        getAggregatedVotes,
      }}
    >
      {children}
    </TierListsContext.Provider>
  );
}

export function useTierLists() {
  const ctx = useContext(TierListsContext);
  if (!ctx) throw new Error("useTierLists must be used within TierListsProvider");
  return ctx;
}

export const CONTENT_AREAS = [
  "Clan Boss",
  "Hydra",
  "Chimera",
  "Dragon",
  "Spider",
  "Fire Knight",
  "Ice Golem",
  "Arena",
  "Doom Tower",
  "Faction Wars",
  "Iron Twins",
  "Sand Devil",
  "Shogun",
];
