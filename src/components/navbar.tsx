"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/champions", label: "Champions" },
  { href: "/team-builder", label: "Team Builder" },
  { href: "/gear-optimizer", label: "Gear" },
  { href: "/clan-boss", label: "Clan Boss" },
  { href: "/fusion-tracker", label: "Fusions" },
  { href: "/tier-lists", label: "Tier Lists" },
  { href: "/guides", label: "Guides" },
];

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#D4A43C]">
            RAID Tool
          </span>
        </Link>

        {/* Nav links — center */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A43C]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth — right */}
        {user ? (
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/profile"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A43C]"
            >
              {user.display_name}
            </Link>
            <Link
              href="/roster"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A43C]"
            >
              My Roster
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
