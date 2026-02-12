# RAID Tool

Community champion reference and build guide platform for RAID: Shadow Legends.

**Full project spec, features, data model, and roadmap:** See `MASTERPLAN.md`

## Tech Stack
See `MASTERPLAN.md` > Tech Stack for full details.
- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Data:** Hybrid — static JSON for champion data, Supabase for user/community data
- **Hosting:** Vercel (`raid-tool.vercel.app`)

## Project Structure
```
src/
  app/           # Next.js App Router pages
  components/    # Reusable UI components
  lib/
    supabase/    # Supabase client (client.ts, server.ts)
  types/         # TypeScript type definitions
  data/          # Static champion JSON data
scripts/         # Data seeding and utility scripts
```

## Conventions
- Use Next.js App Router (not Pages Router). Server components by default, `"use client"` only when needed.
- Use shadcn/ui components over custom implementations. Install via `npx shadcn@latest add <component>`.
- Supabase client: use `lib/supabase/server.ts` in server components/actions, `lib/supabase/client.ts` in client components.
- All database tables use snake_case. TypeScript types use PascalCase.
- Keep components small and focused. One component per file.
- Colocate page-specific components in the route folder. Shared components go in `src/components/`.

## Design Rules
See `MASTERPLAN.md` > Design / Theme for full details.
- **Dark Souls-inspired medieval aesthetic** — near-black backgrounds (#0A0A0F), ember/blood/steel palette.
- **Typography:** Cinzel (serif) for headings, Geist Sans for body.
- **Accent colors:** Ember gold (#C8963E), blood red (#8B1A1A), steel gray (#4A5568).
- **Navigation:** Top navbar — `Champions | Tier Lists | Guides` center, auth right. `My Roster` when logged in.
- **Mobile:** Mobile-friendly, not mobile-first. Desktop is the primary experience.
- Never use light mode or light backgrounds.

## Auth
- **Provider:** Supabase Auth — email/password + Google OAuth
- **Public:** Champions, tier lists (read), guides (read), comparison, landing page
- **Auth required:** Roster, voting, guide submission, profile/settings
- RLS enabled on all Supabase tables.

## Champion Data
See `MASTERPLAN.md` > Champion Data for full details.
- ~996 champions seeded from InTeleria + HellHades APIs.
- Images will be self-hosted (currently hotlinked — migration in progress).
- Champion seeding script: `scripts/seed-champions.ts` (run with `npx tsx`).
- Automated weekly sync via GitHub Actions cron.

## Core Features (4 total)
1. **Champion Index + Detail** — Browse, search, filter, compare. Stats, skills, ratings, tier placements, gear/mastery recs, similar champions.
2. **Tier Lists** — Community-voted rankings per content area (13 areas), seeded from HH data.
3. **Guides** — Structured build templates (gear, stats, masteries, skill books). Community-written.
4. **Roster** — Personal champion tracking with full build details.

## Cut Features (not in scope)
Team Builder, Gear Optimizer, Clan Boss Calculator, Fusion Tracker, AI-generated guides. See `MASTERPLAN.md` > Cut Features for rationale.

## Planning Files

- **`MASTERPLAN.md`** — Long-term project spec. Full vision, features, data model, tech stack, and phased roadmap. Reference for "why" and "what" decisions. Do NOT build directly from this file.
- **`DAY1-FOUNDATION-CHAMPION-INDEX.md`** — Historical record of the original Phase 1 prototype work. Completed. Do not modify.
- **`DAY1-REVISED.md`** — The active work plan. Contains the specific checklist of chunks to execute. **Build from this file.** Check off items as completed.

## Current Focus

**Active plan:** `DAY1-REVISED.md`
- Phase 1: Champion Index + Detail (launch-ready)
- Work through chunks 1–9 in order.
- Check off each item (`- [ ]` → `- [x]`) as completed.
- Do not work on Phase 2+ features (tier lists, guides, roster) until Phase 1 is deployed.
