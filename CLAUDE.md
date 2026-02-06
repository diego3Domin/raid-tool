# RAID Tool

All-in-one companion toolkit for RAID: Shadow Legends.

**Full project spec, features, data model, and roadmap:** See `MASTERPLAN.md`

## Tech Stack
See `MASTERPLAN.md` > Tech Stack for full details.
- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Backend:** Supabase (Postgres, Auth, Realtime)
- **AI:** Claude API (Anthropic) for team synergy explanations
- **Hosting:** Vercel + Supabase (free tiers)

## Project Structure
```
src/
  app/           # Next.js App Router pages
  components/    # Reusable UI components
  lib/
    supabase/    # Supabase client (client.ts, server.ts)
  types/         # TypeScript type definitions
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
- **Dark theme only** — gaming/medieval aesthetic with dark backgrounds (slate-900/950).
- **Accent colors:** golds, purples, reds for the fantasy vibe.
- **Navigation:** Top navbar with logo left, nav links center, auth right. Hamburger on mobile.
- Never use light mode or light backgrounds.

## Supabase
See `MASTERPLAN.md` > Data Model for full schema.
- Champions data is **publicly readable** (no auth required).
- User-specific data (roster, teams, guides) requires auth.
- Row Level Security (RLS) must be enabled on all tables.
- Auth methods: email/password + Google OAuth.

## Champion Data
See `MASTERPLAN.md` > Champion Data for sourcing strategy and freshness requirements.
- ~990+ champions seeded from external sources (InTeleria, HellHades).
- Images are hotlinked from external URLs, not stored locally.
- Champion seeding script lives in `scripts/seed-champions.ts`.

## Pages & Routes
See `MASTERPLAN.md` > Pages / Routes for the full route table.

## Features
See `MASTERPLAN.md` > Core Features for the full feature list and details.

## Planning Files

- **`MASTERPLAN.md`** — Long-term project spec. Contains the full vision, all features, data model, tech stack, and the complete 4-phase roadmap. Reference this for "why" and "what" decisions. Do NOT build directly from this file.
- **`DAY1-FOUNDATION-CHAMPION-INDEX.md`** — The active work plan. Contains the specific checklist of tasks to execute right now. **Build from this file.** Check off items as they are completed.

## Current Focus

**Active plan:** `DAY1-FOUNDATION-CHAMPION-INDEX.md`
- Work through chunks 1.1–1.6 in order.
- Check off each item (`- [ ]` → `- [x]`) as it is completed.
- Do not work on features outside this file (auth, roster, team builder, etc. are future phases).
