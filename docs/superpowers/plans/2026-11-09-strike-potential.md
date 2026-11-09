# Strike Potential Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A dashboard panel `#potential` that estimates russia's long-range strike potential per weapon group (production vs launches, reserve), compares it with 2025 and projects it 6 months ahead in pessimistic / realistic / optimistic scenarios.

**Architecture:** Hand-maintained `public/potential.json` (estimates, 2025 + Jan–Sep 2026 monthly launch totals, scenario settings) + the cumulative Air Force `timeline` the dashboard already receives (`LATEST.timeline`) → pure maths in `lib/potential.ts` → client panel `components/dash/Potential.tsx` fetched with `useJson`, like the night-attack cost panel (`Attack` in `Panels.tsx`).

**Tech Stack:** Next.js (App Router), React client components, TypeScript, plain SVG charts, `tsx` self-checks, `scripts/validate.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-09-strike-potential-design.md`. Visual reference: the throwaway mock `components/dash/PotentialMock.tsx` (uncommitted; Task 3 deletes it).

## Global Constraints

- Every number on screen is a range or carries its date and source; HUR figures are attributed, plans labelled “план”.
- Ukrainian first; house style lowercase “росія/russia”; four languages: panel strings via `tr(uk, en, de, fr)`, `potential.json` text via `i18n/{en,de,fr}.json`.
- Groups: `dr` drones (strike + decoys), `bal` ballistic, `cr` cruise and anti-ship. Type ids are the `prices.json` / timeline `mix.type` ids.
- Horizon 6 months after the issue's month; optimistic cut 20% by default; launches in the forecast = average of the last 3 full months.
- No invented starting stock for drones: show “added since <first tracked month>”.
- **Do not run `next build` while the dev server on :5001 runs** (it corrupts `.next/dev`); check with `npx tsc --noEmit` + `npm run validate` + the browser.
- Work on a branch `feat/strike-potential` (we are on `main`).

## Decision vs spec

The spec says the server merges every issue's `timeline`. Not needed: `publish.mjs` copies forward every timeline day the new file lacks, so `digest.json`'s `timeline` is already cumulative, and the dashboard already gets it as `LATEST.timeline`. The panel filters it to `date <= D.date`. No server or `DashIssue` change.

## Review Focus

1. **A timeline day with `launched` but no `mix`** (3–8 Oct, 1 Nov): the remainder `launched − Σmix − missilesUntyped` must count as drones, not vanish. → Task 1 test `remainder is drones`.
2. **A dashboard date before any estimate / before tracking starts** (an old issue): the panel must render “no estimate” rows and no forecast, not crash or show NaN. → Task 1 test `no estimate → null`; Task 3 step checks `/dashboard/2026-10-05`.
3. **The 1st of a month** (partial month with 1 day): production prorated by 1/30-ish, no division by zero, the bar marked partial. → Task 1 test `partial month`.
4. **A month with only untyped missiles**: split half/half, not dropped. → Task 1 test `untyped without typed`.
5. **A new weapon type in the Air Force report** (e.g. `geran-5`) that no group lists: must fail `validate`, not silently drop out. → Task 2 step.

---

### Task 0: Branch and clean-up of the spike

- [ ] **Step 1:** `git checkout -b feat/strike-potential` — expected: on the new branch, `git status` shows `components/dash/PotentialMock.tsx` untracked and `Dashboard.tsx` modified (the spike), nothing else. Leave the spike in place for now; Task 3 replaces it.

### Task 1: The model — `lib/potential.ts`

**Files:**
- Create: `lib/potential.ts` (types, maths, self-check at the bottom like `lib/records.ts:41`)

**Interfaces:**
- Consumes: `TimelineEntry` from `@/types/digest`.
- Produces:

```ts
export type GroupId = "dr" | "bal" | "cr";
export type Scenario = "pes" | "real" | "opt";
export type Range = { lo: number; hi: number };
export type Estimate = { group: GroupId; type?: string; kind: "production" | "stock" | "plan"; low: number; high: number; date: string; src: string; url: string; note?: string };
/** hand monthly totals; `msl` = missiles the source does not split into ballistic/cruise */
export type HandMonth = { month: string; dr?: number; bal?: number; cr?: number; msl?: number; src: string; url: string };
export type PotentialData = {
  schema: 1; horizon: number; method: string;
  groups: { id: GroupId; label: string; unit: string; types: string[]; cut?: number }[];
  estimates: Estimate[]; launches: HandMonth[];
  scenarios: Record<Scenario, { label: string; note: string; cut?: number }>;
};
export type MonthRow = { month: string; launched: number; src: "hand" | "tracked"; partial: boolean; prod: Range | null };
export type GroupResult = {
  id: GroupId;
  months: MonthRow[];                        // first hand month … issue month, ascending
  forecast: { month: string; launched: number; prod: Record<Scenario, number> }[]; // `horizon` months after the issue month; [] without a production estimate
  now: Range | null; yearAgo: Range | null;  // group production in effect at the issue month / 12 months earlier
  plan: Estimate | null;                     // latest group-level plan ≤ date
  stock: Estimate | null;                    // latest group-level stock ≤ date
  lastFull: MonthRow | null; lastFullYearAgo: MonthRow | null;
  reserveNow: Range | null; reserveSince: string | null; // since = first tracked month when there is no stock estimate
  reserveEnd: Record<Scenario, Range> | null;
  perNight: number;                          // forecast monthly launches / 30
  maxNight: number;                          // biggest single tracked day of this group ≤ date
};
export function dayGroups(e: TimelineEntry, groups: PotentialData["groups"]): Record<GroupId, number> & { untyped: number };
export function monthLaunches(P: PotentialData, tl: TimelineEntry[], date: string): Map<string, { dr: number; bal: number; cr: number; src: "hand" | "tracked"; days: number }>;
export function potential(P: PotentialData, tl: TimelineEntry[], date: string): Record<GroupId, GroupResult>;
```

Rules the implementer cannot guess:
- **Day split** (`dayGroups`): sum `mix` by the group whose `types` lists the type; `untyped = missilesUntyped ?? 0`; `rest = launched − Σmix − untyped`, if `> 0` add to `dr`.
- **Untyped split** (in `monthLaunches`): per month, split the month's untyped (and a hand row's `msl`) between `bal` and `cr` in proportion to that month's typed `bal`/`cr`; if both are 0, half/half. Round at display time only.
- **Hand vs tracked:** a month with a hand row uses the hand row; otherwise the timeline days of that month `<= date`. Months come from both sources, ascending, up to `date`'s month.
- **Partial:** the issue month is `partial` unless `date` is its last day; its `prod` is prorated by `day / daysInMonth`.
- **Production step:** a month uses the latest group-level (`type` absent) `production` estimate whose `date` ≤ the month's last day; none → `null`.
- **Growth** `g = (mid(now) / mid(yearAgo))^(1/12) − 1`, `0` when `yearAgo` is null.
- **Scenarios** for forecast month `k = 0…horizon−1`: `real = mid(now)`; `opt = now.lo × (1 − (group.cut ?? scenarios.opt.cut ?? 0.2))`; `pes = (plan ? mid(plan) : now.hi) × (1 + g)^k`.
- **Forecast launches** = mean of the last 3 non-partial months' launches (fewer if fewer exist).
- **Reserve:** with a stock estimate: `stock.low/high + Σ (prod.lo/hi − launched)` over months *after* the stock's month (issue month prorated). Without: the same sum from the first tracked month, `reserveSince` = that month. `reserveEnd[s]` = `reserveNow` + rest of the issue month (realistic prod − forecast launches, prorated) + `Σ_k (prod[s][k] − forecastLaunches)` (same added to lo and hi).
- **`maxNight`**: max of `dayGroups(e)[id]` over tracked days ≤ date, with that day's untyped split half/half into `bal`/`cr`.

- [ ] **Step 1: Write the self-check** at the bottom of `lib/potential.ts`, guarded by `process.argv[1]?.endsWith("potential.ts")`, using `node:assert/strict`, on a fixture with groups `dr: ["shahed","shahed-jet","decoy","drone-mixed"]`, `bal: ["iskander-m","kn23","kinzhal","s300"]`, `cr: ["kh101","kalibr","kh22","kh59","kh31","kh35","onyx","zircon"]`:

```ts
// day split
assert.deepEqual(dayGroups({ date: "2026-10-14", launched: 167, mix: [{ type: "shahed-jet", n: 77 }, { type: "drone-mixed", n: 51 }], missilesUntyped: 39 }, G), { dr: 128, bal: 0, cr: 0, untyped: 39 });
// remainder is drones
assert.equal(dayGroups({ date: "2026-10-07", launched: 130, missilesUntyped: 53 }, G).dr, 77);
// untyped without typed → half/half; untyped with typed → proportional (3 bal : 1 cr)
const m1 = monthLaunches(P0, [{ date: "2026-10-07", launched: 10, missilesUntyped: 10 }], "2026-10-31").get("2026-10")!;
assert.deepEqual([m1.bal, m1.cr], [5, 5]);
const m2 = monthLaunches(P0, [{ date: "2026-10-07", launched: 8, mix: [{ type: "iskander-m", n: 3 }, { type: "kh101", n: 1 }], missilesUntyped: 4 }], "2026-10-31").get("2026-10")!;
assert.deepEqual([m2.bal, m2.cr], [6, 2]);
// hand row wins over tracked; msl split like untyped
const P1 = { ...P0, launches: [{ month: "2026-10", dr: 1000, bal: 30, cr: 10, msl: 40, src: "x", url: "u" }] };
const { dr, bal, cr, src } = monthLaunches(P1, TL, "2026-10-31").get("2026-10")!;
assert.deepEqual({ dr, bal, cr, src }, { dr: 1000, bal: 60, cr: 20, src: "hand" });
// no estimate → null production, empty forecast, no reserve
const r0 = potential({ ...P0, estimates: [] }, TL, "2026-10-31").bal;
assert.equal(r0.now, null); assert.deepEqual(r0.forecast, []); assert.equal(r0.reserveEnd, null);
// production step: estimate dated 2026-07-15 applies from July, June uses the 2025 one
// partial month: on 2026-11-01 the issue month is partial and prod = estimate × 1/30
// scenarios: real = mid, opt = lo × 0.8 (group cut overrides), pes = mid(plan) × (1+g)^k with g from yearAgo
// reserve: stock {low 100, high 200, date 2026-10-20} + November balance only; drones without stock → reserveSince = first tracked month
```

Fixture names: `G` = the three groups, `P0` = `PotentialData` with `G`, no estimates, no launches, `opt.cut` 0.2, horizon 6; `TL` = a few October/November 2026 days with mix. Write the four commented cases as asserts with the fixture's exact numbers (fixture: `bal` production 2025-06-01 `{40,60}`, 2026-07-15 `{60,100}`, plan 2026-08-01 `{110,110}`, stock as above; `opt.cut` 0.2, `bal.cut` 0.3).

- [ ] **Step 2:** `npx tsx lib/potential.ts` — expected: fails (functions not defined).
- [ ] **Step 3: Implement** the three functions to the rules above. Pure, no React, no `fs`.
- [ ] **Step 4:** `npx tsx lib/potential.ts` — expected: exits 0, prints `ok` (add a final `console.log("ok")`); `npx tsc --noEmit` — no errors.
- [ ] **Step 5: Commit** `git add lib/potential.ts && git commit -m "potential: model of strike potential per weapon group"`.

### Task 2: The data — `public/potential.json` + validate

**Files:**
- Create: `public/potential.json`
- Modify: `scripts/validate.mjs` (after the `rd(f)` loop, line ~61; add `"potential.json"` to the residue walk list, line ~73)

**Interfaces:**
- Consumes: `PotentialData` shape (Task 1).
- Produces: `/potential.json` for Task 3.

- [ ] **Step 1: Research and fill `potential.json`** (Ukrainian text). Every entry needs `src` (who, via whom, date) and a working `url`; a value that cannot be sourced is left out, never estimated by us — a missing month is a gap on the chart, and the final report lists the gaps.
  - `groups`: the three groups with the type lists above, `label`, `unit` (“дронів” / “ракет”).
  - `estimates`: group-level `production` for 2025 and for now (HUR via RBC-Ukraine 4.11.2026: >200 missiles/month, ≤110 ballistic; Iskander-M ~65, Kalibr ~29, Kh-101 plan >80; drones: 2025 ~2,700 Geran-2 + ~2,500 decoys, 2026 figures from HUR / Pravda 10.08.2026); `plan` (drones 11,000 for Aug 2026); `stock` (ballistic ≤700, Iskander-M ~115; cruise “several thousand”: Kalibr >450, Oniks >600, Zircon >120 — Oct 2026). Type-level entries (with `type`) for every per-model figure, for the table.
  - `launches`: one row per month Jan 2025 – Sep 2026 (Air Force monthly totals, ISIS monthly analysis, etc.); `msl` where the source does not split missiles.
  - `scenarios`: `pes` / `real` / `opt` labels and one-line notes (spec wording), `opt.cut: 0.2`; `horizon: 6`; `method`: the spec's caveats paragraph.
- [ ] **Step 2: Add validate checks** (exit 1 with a message on failure): every estimate has `date` (YYYY-MM-DD), `src`, `url`, `low ≤ high`, `group` ∈ group ids, `kind` ∈ production|stock|plan; every `launches[].month` is YYYY-MM, unique, has `src`+`url`; `scenarios` has `pes`, `real`, `opt`; every `mix.type` in `digest.json` and `issues/*.json` timelines is listed by exactly one group (message names the type and file).
- [ ] **Step 3: Verify:** `npm run validate` → `ok: …`. Then add `{ "type": "geran-9", "n": 1 }` to one `mix` in `public/digest.json`, run `npm run validate` → fails naming `geran-9` and `digest.json`; restore with `git checkout public/digest.json`.
- [ ] **Step 4: Commit** `git add public/potential.json scripts/validate.mjs && git commit -m "potential: estimates and monthly launch totals, validate"`.

### Task 3: The panel — `components/dash/Potential.tsx`

**Files:**
- Create: `components/dash/Potential.tsx` (export `function Potential()`)
- Modify: `components/dash/Panels.tsx` — export the existing `pick`, `Grid`, `MN`, `A` (no behaviour change)
- Modify: `components/dash/Dashboard.tsx` — `<Potential />` right after `<Attack />`; remove the spike import and `<PotentialMock />`
- Delete: `components/dash/PotentialMock.tsx`
- Modify: `app/globals.css` only if a class is missing (prefix `.pot-`)

**Interfaces:**
- Consumes: `potential(P, LATEST.timeline ?? [], D.date)` (Task 1), `useJson<PotentialData>("/potential.json")`, `useApp()` (`D`, `LATEST`, `lang`), `useChartW()`, `useSticky` for the group and scenario choice, `flags`, `fmt` from `@/lib/text`.
- Produces: the `#potential` section.

- [ ] **Step 1: Build the panel to the mock's layout** (`PotentialMock.tsx` is the reference for structure, classes and colours): `section.panel.atk#potential` → h2 “Ударний потенціал росії — оцінка” → group `.seg` → `.atk-top` (now mid “/ міс.”, range, last full month launches and %, balance into/out of reserve, year-ago figures) → 4 `.tiles` (production ×ratio, last full month launches vs same month 2025, launch share now vs then, reserve now or “додано в запас з <month>”) → chart (`.cv-svg`, width `useChartW()`; pale bars = hand, solid = tracked, dashed outline = partial; production band `--c2`; plan dotted line; forecast zone `--track`; scenario lines `--unv`/`--ink`/`--ok`, the chosen one thicker; dashed forecast-launch line; month labels every 3rd; `.cv-leg`) → scenario `.seg` + note → 4 `.tiles` (reserve at horizon with lo–hi, nights at today's pace, attacks like the biggest night, production at horizon) → `details.cv-tbl` of every estimate (type label from group/type, value, “план” for `kind: plan`, date, linked source) → `.cv-src` with `P.method`. Loading / error states as in `Recruit` (`Panels.tsx:258`). A group with `now === null` shows “немає оцінки виробництва на цю дату” instead of tiles 1/3 and the forecast. No “МАКЕТ” tag.
- [ ] **Step 2: Remove the spike** (delete `PotentialMock.tsx`, its import and element).
- [ ] **Step 3: Verify:** `npx tsc --noEmit` clean; on the running dev server (`localhost:5001`) open `/dashboard#potential`: all three groups and three scenarios switch, numbers match `npx tsx -e` output of `potential()` for the same date; `/dashboard/2026-10-05` renders without NaN; phone width (resize 375) — no horizontal scroll; dark theme readable; `/en/dashboard`, `/de/dashboard`, `/fr/dashboard` show the panel; console has no errors.
- [ ] **Step 4: Commit** `git add -A components/dash app/globals.css && git commit -m "potential: dashboard panel"`.

### Task 4: Translations, editor stats, docs

**Files:**
- Modify: `i18n/en.json`, `i18n/de.json`, `i18n/fr.json` (via the scripts)
- Modify: `scripts/stats.ts` — a “Strike potential” block
- Modify: `CLAUDE.md` — one bullet under Architecture (panel, data file, model, self-check) and `potential.json` under Data

- [ ] **Step 1:** `npm run i18n:missing`, fill English (glossary as in existing entries; lowercase russia), `npm run i18n:merge`; same with `:de` and `:fr`. Expected: `node scripts/i18n.mjs build` lists `potential.json` as fully translated in all three.
- [ ] **Step 2:** In `stats.ts`, print per group for the date: last full month launches, production mid (range), balance, reserve now (or “added since”), realistic reserve at horizon — from `potential()` reading `public/potential.json` and `digest.json`'s timeline. Run `npx tsx scripts/stats.ts` → the block appears; `npx tsx scripts/stats.ts --test` still passes.
- [ ] **Step 3:** Update `CLAUDE.md`; run `graphify update .`.
- [ ] **Step 4: Final check:** `npx tsx lib/potential.ts`, `npm run validate`, `npx tsc --noEmit` all pass; browser check of `/en/dashboard#potential` shows English text. (Production `next build` only with the dev server stopped, or on Vercel's preview.)
- [ ] **Step 5: Commit** `git add -A i18n scripts/stats.ts CLAUDE.md graphify-out && git commit -m "potential: translations, editor stats, docs"`.
