import Link from "next/link";

export const metadata = {
  title: "Login | RAID Tool",
  description: "Sign in to RAID Tool to access roster tracking, voting, and guide submission.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4 relative">
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(200, 150, 62, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div className="w-full rounded-sm border-2 border-[#2A2A30] border-t-4 border-t-[#C8963E] bg-[#141418] p-8 text-center"
        style={{
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.9)',
        }}
      >
        <h1
          className="mb-4 text-3xl"
          style={{
            background: 'linear-gradient(180deg, #E8C460 0%, #C8963E 50%, #9A6E25 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Sign In
        </h1>
        <p className="mb-6 text-sm text-[#7A7570]">
          Authentication is coming soon. Once available, you&apos;ll be able to save your roster, vote on tier lists, and submit build guides.
        </p>
        <div className="inline-block rounded-sm border-2 border-[#C8963E]/30 bg-[#1A1A20] px-6 py-3">
          <p className="text-sm font-bold uppercase tracking-wider text-[#C8963E]">
            Coming Soon
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/champions"
            className="text-sm font-medium text-[#7A7570] transition-colors hover:text-[#C8963E]"
          >
            &larr; Browse Champions
          </Link>
        </div>
      </div>
    </div>
  );
}
