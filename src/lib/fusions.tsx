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

export interface FusionRequirement {
  id: string;
  name: string;
  type: "champion" | "fragment" | "event";
  targetCount: number;
  currentCount: number;
}

export interface Fusion {
  id: string;
  name: string;
  champion_name: string;
  champion_id?: string;
  end_date?: string;
  requirements: FusionRequirement[];
  notes: string;
  created_at: string;
}

interface FusionsContextType {
  fusions: Fusion[];
  saveFusion: (fusion: Omit<Fusion, "id" | "created_at">) => Fusion;
  updateFusion: (id: string, updates: Partial<Fusion>) => void;
  deleteFusion: (id: string) => void;
  updateRequirement: (fusionId: string, reqId: string, currentCount: number) => void;
}

const FusionsContext = createContext<FusionsContextType | null>(null);

function getStorageKey(userId: string) {
  return `raid-tool-fusions-${userId}`;
}

export function FusionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [fusions, setFusions] = useState<Fusion[]>([]);

  useEffect(() => {
    if (!user) {
      setFusions([]);
      return;
    }
    try {
      const stored = localStorage.getItem(getStorageKey(user.id));
      if (stored) setFusions(JSON.parse(stored));
      else setFusions([]);
    } catch {
      setFusions([]);
    }
  }, [user]);

  const persist = useCallback(
    (updated: Fusion[]) => {
      setFusions(updated);
      if (user) {
        localStorage.setItem(getStorageKey(user.id), JSON.stringify(updated));
      }
    },
    [user]
  );

  const saveFusion = useCallback(
    (fusion: Omit<Fusion, "id" | "created_at">) => {
      const newFusion: Fusion = {
        ...fusion,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      persist([newFusion, ...fusions]);
      return newFusion;
    },
    [fusions, persist]
  );

  const updateFusion = useCallback(
    (id: string, updates: Partial<Fusion>) => {
      persist(fusions.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    },
    [fusions, persist]
  );

  const deleteFusion = useCallback(
    (id: string) => {
      persist(fusions.filter((f) => f.id !== id));
    },
    [fusions, persist]
  );

  const updateRequirement = useCallback(
    (fusionId: string, reqId: string, currentCount: number) => {
      persist(
        fusions.map((f) => {
          if (f.id !== fusionId) return f;
          return {
            ...f,
            requirements: f.requirements.map((r) =>
              r.id === reqId ? { ...r, currentCount: Math.min(currentCount, r.targetCount) } : r
            ),
          };
        })
      );
    },
    [fusions, persist]
  );

  return (
    <FusionsContext.Provider value={{ fusions, saveFusion, updateFusion, deleteFusion, updateRequirement }}>
      {children}
    </FusionsContext.Provider>
  );
}

export function useFusions() {
  const ctx = useContext(FusionsContext);
  if (!ctx) throw new Error("useFusions must be used within FusionsProvider");
  return ctx;
}
