"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/champions", label: "Champions" },
  { href: "/team-builder", label: "Team Builder" },
  { href: "/tier-lists", label: "Tier Lists" },
  { href: "/guides", label: "Guides" },
];

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-gold">
            RAID Tool
          </span>
        </Link>

        {/* Nav links — center */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth — right */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {user.display_name}
            </Link>
            <Link
              href="/roster"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
