"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";

export interface RosterEntry {
  champion_id: string;
  stars: number;
  level: number;
  ascension: number;
  gear_sets: string[];
  masteries: string[];
  skill_books: Record<string, number>;
}

interface RosterContextType {
  roster: RosterEntry[];
  addChampion: (championId: string) => void;
  removeChampion: (championId: string) => void;
  updateEntry: (championId: string, updates: Partial<RosterEntry>) => void;
  isInRoster: (championId: string) => boolean;
}

const RosterContext = createContext<RosterContextType | null>(null);

function getStorageKey(userId: string) {
  return `raid-tool-roster-${userId}`;
}

export function RosterProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [roster, setRoster] = useState<RosterEntry[]>([]);

  useEffect(() => {
    if (!user) {
      setRoster([]);
      return;
    }
    const stored = localStorage.getItem(getStorageKey(user.id));
    if (stored) {
      try {
        setRoster(JSON.parse(stored));
      } catch {
        setRoster([]);
      }
    } else {
      setRoster([]);
    }
  }, [user]);

  const persist = useCallback(
    (updated: RosterEntry[]) => {
      setRoster(updated);
      if (user) {
        localStorage.setItem(getStorageKey(user.id), JSON.stringify(updated));
      }
    },
    [user]
  );

  const addChampion = useCallback(
    (championId: string) => {
      if (roster.some((r) => r.champion_id === championId)) return;
      const entry: RosterEntry = {
        champion_id: championId,
        stars: 6,
        level: 60,
        ascension: 6,
        gear_sets: [],
        masteries: [],
        skill_books: {},
      };
      persist([...roster, entry]);
    },
    [roster, persist]
  );

  const removeChampion = useCallback(
    (championId: string) => {
      persist(roster.filter((r) => r.champion_id !== championId));
    },
    [roster, persist]
  );

  const updateEntry = useCallback(
    (championId: string, updates: Partial<RosterEntry>) => {
      persist(
        roster.map((r) =>
          r.champion_id === championId ? { ...r, ...updates } : r
        )
      );
    },
    [roster, persist]
  );

  const isInRoster = useCallback(
    (championId: string) => roster.some((r) => r.champion_id === championId),
    [roster]
  );

  return (
    <RosterContext.Provider
      value={{ roster, addChampion, removeChampion, updateEntry, isInRoster }}
    >
      {children}
    </RosterContext.Provider>
  );
}

export function useRoster() {
  const ctx = useContext(RosterContext);
  if (!ctx) throw new Error("useRoster must be used within RosterProvider");
  return ctx;
}
