"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/champions", label: "Champions" },
  // Hidden until polished:
  // { href: "/team-builder", label: "Team Builder" },
  // { href: "/gear-optimizer", label: "Gear" },
  // { href: "/clan-boss", label: "Clan Boss" },
  // { href: "/fusion-tracker", label: "Fusions" },
  // { href: "/tier-lists", label: "Tier Lists" },
  // { href: "/guides", label: "Guides" },
];

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0F] border-b border-[#C8963E]/15">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo — clean, bold, condensed */}
        <Link href="/" className="group flex shrink-0 items-center">
          <span className="text-[#C8963E] text-lg font-black uppercase tracking-tighter transition-colors hover:text-[#9A6E25]">
            RAID Tool
          </span>
        </Link>

        {/* Nav links — simple text */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wide text-[#7A7570] transition-colors hover:text-[#C8963E] focus-visible:outline-none focus-visible:text-[#C8963E]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth — right */}
        {user ? (
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/profile"
              className="text-sm font-semibold text-[#7A7570] transition-colors hover:text-[#C8963E] focus-visible:outline-none focus-visible:text-[#C8963E]"
            >
              {user.display_name}
            </Link>
            <Link
              href="/roster"
              className="text-sm font-semibold text-[#7A7570] transition-colors hover:text-[#C8963E] focus-visible:outline-none focus-visible:text-[#C8963E]"
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
