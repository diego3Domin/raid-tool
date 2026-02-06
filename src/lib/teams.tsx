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

export interface TeamSlot {
  champion_id: string;
  speed?: number;
}

export interface Team {
  id: string;
  name: string;
  content_category: string;
  content_detail: string;
  content_stage?: string;
  slots: TeamSlot[];
  ai_explanation?: string;
  created_at: string;
}

interface TeamsContextType {
  teams: Team[];
  saveTeam: (team: Omit<Team, "id" | "created_at">) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  getTeam: (id: string) => Team | undefined;
}

const TeamsContext = createContext<TeamsContextType | null>(null);

function getStorageKey(userId: string) {
  return `raid-tool-teams-${userId}`;
}

export function TeamsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!user) {
      setTeams([]);
      return;
    }
    const stored = localStorage.getItem(getStorageKey(user.id));
    if (stored) {
      try {
        setTeams(JSON.parse(stored));
      } catch {
        setTeams([]);
      }
    } else {
      setTeams([]);
    }
  }, [user]);

  const persist = useCallback(
    (updated: Team[]) => {
      setTeams(updated);
      if (user) {
        localStorage.setItem(getStorageKey(user.id), JSON.stringify(updated));
      }
    },
    [user]
  );

  const saveTeam = useCallback(
    (team: Omit<Team, "id" | "created_at">) => {
      const newTeam: Team = {
        ...team,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      persist([...teams, newTeam]);
      return newTeam;
    },
    [teams, persist]
  );

  const updateTeam = useCallback(
    (id: string, updates: Partial<Team>) => {
      persist(teams.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    [teams, persist]
  );

  const deleteTeam = useCallback(
    (id: string) => {
      persist(teams.filter((t) => t.id !== id));
    },
    [teams, persist]
  );

  const getTeam = useCallback(
    (id: string) => teams.find((t) => t.id === id),
    [teams]
  );

  return (
    <TeamsContext.Provider value={{ teams, saveTeam, updateTeam, deleteTeam, getTeam }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error("useTeams must be used within TeamsProvider");
  return ctx;
}

// Content types and their default team sizes
export const CONTENT_TYPES: Record<
  string,
  { details: string[]; defaultSize: number; hasStages: boolean }
> = {
  "Clan Boss": {
    details: ["Normal", "Hard", "Brutal", "Nightmare", "Ultra-Nightmare"],
    defaultSize: 5,
    hasStages: false,
  },
  Hydra: {
    details: ["Normal", "Hard", "Brutal", "Nightmare"],
    defaultSize: 6,
    hasStages: false,
  },
  Chimera: {
    details: ["Normal", "Hard", "Brutal", "Nightmare"],
    defaultSize: 5,
    hasStages: false,
  },
  Dungeons: {
    details: ["Dragon", "Spider", "Fire Knight", "Ice Golem", "Minotaur"],
    defaultSize: 5,
    hasStages: true,
  },
  Arena: {
    details: ["Offense", "Defense"],
    defaultSize: 4,
    hasStages: false,
  },
  "Doom Tower": {
    details: ["Normal", "Hard"],
    defaultSize: 5,
    hasStages: true,
  },
  "Faction Wars": {
    details: [],
    defaultSize: 5,
    hasStages: false,
  },
  "Iron Twins": {
    details: [],
    defaultSize: 5,
    hasStages: true,
  },
  "Sand Devil": {
    details: [],
    defaultSize: 5,
    hasStages: true,
  },
  Shogun: {
    details: [],
    defaultSize: 5,
    hasStages: true,
  },
};
