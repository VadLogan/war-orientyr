# WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

Daily war digest (UA/EN), ported from a single-file Artifact to Next.js. See README.md (Ukrainian) for the remaining plan.

## Commands
- `npm run dev` — localhost:3000
- `npm run publish -- <new-digest.json> [--force]` — new issue: copies the current `public/digest.json` to `issues/<date>.json`, installs the new file as `digest.json`, adds its date to `issues/index.json`. Same date = correction (no archiving); older date refused.
- `npm run validate` — parses all `public/` JSON, checks digest.json schema keys, that `issues/index.json` contains digest's date, and that every strike in digest.json's `deepstrikes` section is in `strikes.json` (by `id` or `item`; notes without emoji / ℹ️ and `geo: null` items exempt). Run after any data change; `prebuild` runs it too, so Vercel won't deploy a stale strikes map.
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
- Updated daily: `digest.json`, `issues/<YYYY-MM-DD>.json`, `issues/index.json`, `strikes.json`; sometimes `prices.json`, `recruit.json`, `maps/maps.json` + `maps/archive/`.
- Articles: `articles/<YYYY-MM-DD>/<name>/` — `preview.uk.json` (required) / `preview.en.json` = `{title, lead?, button?, url?, image?, imageAlt?}`; `article.uk.json` / `article.en.json` = `{title?, lead?, image?: {src, alt, caption}, blocks: [{type: p|h2, text} | {type: table, columns, rows} | {type: chart, kind: bar, title, subtitle, rows: [{country, flag, n, share, makers, highlight}], note, source}], sources?: [{title, url, note}]}` (types in `types/digest.ts`); an image file (the one `image` names, else the first jpg/png/webp/avif/gif). Every folder under an issue's date = a card on that issue after the headline and lede, before the first section (`Mast.tsx`, folder-name order). Card links to `url`, else to `/articles/<date>/<name>` (+ `/en/…`, `components/ArticlePage.tsx`; generated only when `article.uk.json` exists). English files fall back to Ukrainian; i18n scripts skip `articles/`. `<name>` is the URL: a-z, 0-9, -. validate checks it.
- Static: `landcost.json`, `maps/strikes-base.json`, `maps/targets.json`.
- Data vs text: every data file in `public/` is shared by both languages; English is only text. `i18n/en.json` (committed) maps each Ukrainian string to English; `lib/i18n.mjs` (`texts`, `translate`) applies it — used by the script and the app. Digest pages are translated on the server (`lib/data.ts`). For files the dashboard fetches in the browser, `scripts/i18n.mjs build` (run by `predev`/`prebuild`) writes text-only subsets to `public/i18n/en/<file>` (gitignored); `useJson` fetches data + text and combines them. A file that is not fully translated stays Ukrainian (digest pages show the "written in Ukrainian" note). House style for English (lowercase russia, country flags) is applied at render time (`houseStyle(str, "en")` in `lib/text.ts`).
- New data → `npm run i18n:missing` (writes `i18n/missing.json` with empty values) → fill in English → `npm run i18n:merge` → commit `i18n/en.json`. Translate raw strings; keep lowercase “russia/russian/kremlin”, British spelling, glossary as in existing entries (Ukraine’s General Staff, Air Force, russia’s MoD, USF, direction names Pokrovsk, Kostiantynivka…).
- Artifact is still the primary publisher; repo copy is synced manually (including `strikes.json` — the map's only source; digest items' `geo` is not read), then validate + commit → Vercel rebuilds (pages are generated at build time, so data changes need a deploy).

## Tools
- Maps (`<MapsCompare />`): `cd ../war-orientyr-scrappers && npm run maps` — scrapes DeepState / DIVGEN / ISW, encodes layers, stages them in `tools/maps/in/` (gitignored), runs `tools/maps/build.py` (shapely/pyproj via `uv run`), cross-source check (`check.ts`: freshness, area jumps, pair disagreements, DIVGEN claims unconfirmed by DS/ISW), then replaces `public/maps/maps.json`, archives it as `public/maps/archive/<date>.json` (+ `archive/index.json`) and runs validate. `<MapsCompare />` on `/dashboard/<date>` loads the newest archived snapshot on or before that date (`getMapsUrl` in `lib/data.ts` → ctx `MAPS`); the strikes map and price-of-a-kilometre panel stay on `maps.json`. Every script is described in `../war-orientyr-scrappers/README.md`. Logs + report: `../war-orientyr-scrappers/logs/<date>.log|.report.json`. Commit `public/maps/maps.json` after reviewing the report.

## Conventions
- UI strings live in `UI.uk` / `UI.en` in `lib/ui.ts`. Content is Ukrainian-first.
- Deploy: Vercel (`@vercel/analytics`, `@vercel/speed-insights` in layout).
- Knowledge graph: `graphify-out/` (`.graphifyignore` excludes data JSON). Run `graphify update .` after code changes.
