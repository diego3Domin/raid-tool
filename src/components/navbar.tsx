import Link from "next/link";

const navLinks = [
  { href: "/champions", label: "Champions" },
  { href: "/tier-lists", label: "Tier Lists" },
  { href: "/guides", label: "Guides" },
];

export function Navbar() {
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
        <Link href="/" className="group flex shrink-0 items-center">
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

        {/* Nav links */}
        <div className="flex items-center gap-3 sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#7A7570] transition-colors hover:text-[#C8963E] focus-visible:outline-none focus-visible:text-[#C8963E]"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Placeholder for future auth */}
        <div className="shrink-0" />
      </nav>
    </header>
  );
}
