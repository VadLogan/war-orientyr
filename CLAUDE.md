# WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

Daily war digest (UA/EN), ported from a single-file Artifact to Next.js. See README.md (Ukrainian) for the remaining plan.

## Commands
- `npm run dev` — localhost:3000
- `npm run validate` — parses all `public/` JSON, checks digest.json schema keys and that `issues/index.json` contains digest's date. Run after any data change.
- `npm run build` — no test suite; validate + build is the check.

## Architecture
- `app/page.tsx` — server component: reads `public/digest.json` + `issues/index.json` at build time, applies `styleData`, renders `<App>`.
- `components/App.tsx` — client root: owns lang (`localStorage` `wd-lang`), view, current issue, hash routing (`#dashboard`, `#YYYY-MM-DD`, `#dashboard-YYYY-MM-DD`); archive issues fetched on demand. Shared state via `components/ctx.ts` (`useApp()`).
- `components/digest/` — Digest tab (`Digest.tsx`, `Item.tsx`). `components/Mast.tsx`, `components/Tooltip.tsx` (global `[data-tip]`).
- `components/dash/` — Dashboard: `Panels.tsx` (civilians, tiles, attack cost, recruitment, land cost, fire), `Timeline.tsx` (timeline + directions, shared selection), `Losses.tsx`, `LineChart.tsx` (shared chart), `SourceMatrix.tsx`, `Maps.tsx` (maps comparison + strikes map, d3-geo/d3-zoom, lazy-loaded). `hooks.ts`: `useSticky` (state kept across tab switches), `useJson`, width hooks.
- `lib/` — `ui.ts` (UI strings), `text.ts` (house style, plural, dates, formatting), `icons.ts`, `strikes.ts`. `types/digest.ts` — data shape.
- Charts are JSX `<svg>`; d3 (npm) only for geo projection and zoom.
- `app/globals.css` — styles copied unchanged from original index.html; components keep the original class names.

## Data (`public/`)
- Updated daily: `digest.json`, `issues/<YYYY-MM-DD>.json`, `issues/index.json`, `strikes.json`; sometimes `prices.json`, `recruit.json`, `maps/maps.json`.
- Static: `landcost.json`, `maps/strikes-base.json`, `maps/targets.json`.
- Artifact is still the primary publisher; repo copy is synced manually, then validate + commit → Vercel deploys.

## Tools
- `tools/maps/extract.js` — browser-console snippet to pull map polygons from DeepState / ISW (ArcGIS) / DIVGEN; delta+DP-encoded rings, FNV hash.
- `tools/maps/build.py` — shapely/pyproj; decodes the `*.txt` extracts and builds `maps/maps.json`.

## Conventions
- UI strings live in `UI.uk` / `UI.en` in `lib/ui.ts`. Content is Ukrainian-first.
- Deploy: Vercel (`@vercel/analytics`, `@vercel/speed-insights` in layout).
- Knowledge graph: `graphify-out/` (`.graphifyignore` excludes data JSON). Run `graphify update .` after code changes.
