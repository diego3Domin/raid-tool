"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "display_name" | "avatar_url">>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "raid-tool-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (email: string, _password: string) => {
    // Mock login — accepts any credentials
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      display_name: email.split("@")[0],
    };
    persistUser(mockUser);
  };

  const signup = async (email: string, _password: string, displayName: string) => {
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      display_name: displayName,
    };
    persistUser(mockUser);
  };

  const logout = () => {
    persistUser(null);
  };

  const updateProfile = (updates: Partial<Pick<User, "display_name" | "avatar_url">>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    persistUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
