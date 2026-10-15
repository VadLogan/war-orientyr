# WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

Daily war digest (UA/EN), ported from a single-file Artifact to Next.js. See README.md (Ukrainian) for the remaining plan.

## Commands
- `npm run dev` — localhost:3000
- `npm run publish -- <new-digest.json> [--force]` — new issue: copies the current `public/digest.json` to `issues/<date>.json`, installs the new file as `digest.json`, adds its date to `issues/index.json`. Same date = correction (no archiving); older date refused.
- `npm run validate` — parses all `public/` JSON, checks digest.json schema keys and that `issues/index.json` contains digest's date. Run after any data change.
- `npm run build` — no test suite; validate + build is the check.

## Architecture
- Routes (all statically generated, `dynamicParams = false`): `/[date]`, `/dashboard/[date]`, `/en/[date]`, `/en/dashboard/[date]`; no date = latest issue. Files: `app/(uk)/…` and `app/(en)/en/…` — two route groups, each with its own root layout so `<html lang>` is static. Page files are thin wrappers around `components/DigestPage.tsx` / `components/dash/DashPage.tsx`.
- `proxy.ts` — language choice: a visitor without a `lang` cookie whose Accept-Language doesn’t start with uk/ru is redirected from a Ukrainian page to its `/en` twin; the UA/EN switch (`components/LangLink.tsx`) sets the cookie. `/en/…` is never redirected.
- `lib/data.ts` — server-only data access (reads `public/` at build time, `styleData` applied; source matrix precomputed). `lib/page.ts` — `resolve()`, `dateParams()`, `pageMeta()` (title, hreflang, canonical). `lib/routes.ts` — `href(lang, view, date, latest)`.
- Digest is Server Components only (`components/digest/`, `Mast.tsx`, `Shell.tsx`); client islands: `digest/ChkToggle.tsx`, `IssueSelect.tsx`, `HashRedirect.tsx` (old `#date`/`#dashboard` links → paths). Keep dashboard imports out of digest modules, or the dashboard JS ships on digest pages.
- Dashboard is a client tree: `dash/DashProvider.tsx` (context from `ctx.ts`, router-based navigation, gets trimmed `DashIssue` data from the server), `Panels.tsx`, `Timeline.tsx`, `Losses.tsx`, `LineChart.tsx`, `SourceMatrix.tsx`, `Maps.tsx` (d3-geo/d3-zoom, lazy). Client JSON fetches must use absolute paths (`/prices.json`). `hooks.ts`: `useSticky`, `useJson`, width hooks.
- `lib/ui.ts` (UI strings), `lib/text.ts` (house style, plural, dates), `lib/icons.ts`, `lib/strikes.ts`; `types/digest.ts`.
- `app/globals.css` — original styles; components keep the original class names. Active links use `aria-current`.

## Data (`public/`)
- Updated daily: `digest.json`, `issues/<YYYY-MM-DD>.json`, `issues/index.json`, `strikes.json`; sometimes `prices.json`, `recruit.json`, `maps/maps.json`.
- Static: `landcost.json`, `maps/strikes-base.json`, `maps/targets.json`.
- English: `i18n/en.json` is a translation memory (Ukrainian string → English). `npm run predev`/`prebuild` run `scripts/i18n.mjs build`, which writes `public/en/**` (gitignored) — a mirror of every data file, only when all its strings are translated. `/en` pages read the mirror and fall back to Ukrainian (with the "written in Ukrainian" note) when it is missing. House style for English (lowercase russia, country flags) is applied at render time (`houseStyle(str, "en")` in `lib/text.ts`).
- New data → `npm run i18n:missing` (writes `i18n/missing.json` with empty values) → fill in English → `npm run i18n:merge` → commit `i18n/en.json`. Translate raw strings; keep lowercase “russia/russian/kremlin”, British spelling, glossary as in existing entries (Ukraine’s General Staff, Air Force, russia’s MoD, USF, direction names Pokrovsk, Kostiantynivka…).
- Artifact is still the primary publisher; repo copy is synced manually, then validate + commit → Vercel rebuilds (pages are generated at build time, so data changes need a deploy).

## Tools
- `tools/maps/extract.js` — browser-console snippet to pull map polygons from DeepState / ISW (ArcGIS) / DIVGEN; delta+DP-encoded rings, FNV hash.
- `tools/maps/build.py` — shapely/pyproj; decodes the `*.txt` extracts and builds `maps/maps.json`.

## Conventions
- UI strings live in `UI.uk` / `UI.en` in `lib/ui.ts`. Content is Ukrainian-first.
- Deploy: Vercel (`@vercel/analytics`, `@vercel/speed-insights` in layout).
- Knowledge graph: `graphify-out/` (`.graphifyignore` excludes data JSON). Run `graphify update .` after code changes.
