"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/champions", label: "Champions" },
  { href: "/tier-lists", label: "Tier Lists" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 bg-[#0A0A0F] border-b-2 border-[#C8963E]/20"
      style={{
        boxShadow: `
          0 4px 12px rgba(0, 0, 0, 0.8),
          0 1px 0 rgba(200, 150, 62, 0.1),
          inset 0 -1px 0 rgba(200, 150, 62, 0.15)
        `,
        backgroundImage: `
          linear-gradient(180deg, rgba(26, 26, 32, 0.3) 0%, transparent 100%),
          linear-gradient(0deg, rgba(200, 150, 62, 0.03) 0%, transparent 100%)
        `,
      }}
    >
      <nav className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
          <span
            className="text-[#C8963E] text-lg sm:text-xl font-black uppercase tracking-wider transition-all duration-200 hover:text-[#E8C460]"
            style={{
              fontFamily: 'var(--font-cinzel-decorative), serif',
              textShadow: '0 2px 8px rgba(200, 150, 62, 0.3)',
            }}
          >
            RAID Tool
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wide text-[#7A7570] transition-colors hover:text-[#C8963E] focus-visible:outline-none focus-visible:text-[#C8963E]"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Placeholder for future auth (desktop) */}
        <div className="hidden sm:block shrink-0" />

        {/* Hamburger button (mobile) */}
        <button
          className="sm:hidden flex items-center justify-center w-11 h-11 text-[#7A7570] hover:text-[#C8963E] transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#2A2A30] bg-[#0A0A0F]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors ${
                pathname === link.href || pathname?.startsWith(link.href + "/")
                  ? "text-[#C8963E] bg-[#C8963E]/5"
                  : "text-[#7A7570] hover:text-[#C8963E] hover:bg-[#1A1A20]"
              }`}
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
