"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface GuideComment {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface Guide {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  champion_id?: string;
  tags: string[];
  body: string; // HTML from Tiptap
  upvotes: string[]; // user IDs
  downvotes: string[]; // user IDs
  comments: GuideComment[];
  created_at: string;
  updated_at: string;
}

interface GuidesContextType {
  guides: Guide[];
  saveGuide: (guide: Omit<Guide, "id" | "upvotes" | "downvotes" | "comments" | "created_at" | "updated_at">) => Guide;
  updateGuide: (id: string, updates: Partial<Guide>) => void;
  deleteGuide: (id: string) => void;
  getGuide: (id: string) => Guide | undefined;
  vote: (guideId: string, userId: string, direction: "up" | "down") => void;
  addComment: (guideId: string, userId: string, userName: string, content: string) => void;
}

const GuidesContext = createContext<GuidesContextType | null>(null);

const STORAGE_KEY = "raid-tool-guides";

export function GuidesProvider({ children }: { children: ReactNode }) {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setGuides(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  const persist = useCallback((updated: Guide[]) => {
    setGuides(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const saveGuide = useCallback(
    (guide: Omit<Guide, "id" | "upvotes" | "downvotes" | "comments" | "created_at" | "updated_at">) => {
      const now = new Date().toISOString();
      const newGuide: Guide = {
        ...guide,
        id: crypto.randomUUID(),
        upvotes: [],
        downvotes: [],
        comments: [],
        created_at: now,
        updated_at: now,
      };
      persist([newGuide, ...guides]);
      return newGuide;
    },
    [guides, persist]
  );

  const updateGuide = useCallback(
    (id: string, updates: Partial<Guide>) => {
      persist(
        guides.map((g) =>
          g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
        )
      );
    },
    [guides, persist]
  );

  const deleteGuide = useCallback(
    (id: string) => {
      persist(guides.filter((g) => g.id !== id));
    },
    [guides, persist]
  );

  const getGuide = useCallback(
    (id: string) => guides.find((g) => g.id === id),
    [guides]
  );

  const vote = useCallback(
    (guideId: string, userId: string, direction: "up" | "down") => {
      persist(
        guides.map((g) => {
          if (g.id !== guideId) return g;
          let upvotes = g.upvotes.filter((id) => id !== userId);
          let downvotes = g.downvotes.filter((id) => id !== userId);
          if (direction === "up") upvotes.push(userId);
          else downvotes.push(userId);
          return { ...g, upvotes, downvotes };
        })
      );
    },
    [guides, persist]
  );

  const addComment = useCallback(
    (guideId: string, userId: string, userName: string, content: string) => {
      persist(
        guides.map((g) => {
          if (g.id !== guideId) return g;
          const comment: GuideComment = {
            id: crypto.randomUUID(),
            user_id: userId,
            user_name: userName,
            content,
            created_at: new Date().toISOString(),
          };
          return { ...g, comments: [...g.comments, comment] };
        })
      );
    },
    [guides, persist]
  );

  return (
    <GuidesContext.Provider
      value={{ guides, saveGuide, updateGuide, deleteGuide, getGuide, vote, addComment }}
    >
      {children}
    </GuidesContext.Provider>
  );
}

export function useGuides() {
  const ctx = useContext(GuidesContext);
  if (!ctx) throw new Error("useGuides must be used within GuidesProvider");
  return ctx;
}
