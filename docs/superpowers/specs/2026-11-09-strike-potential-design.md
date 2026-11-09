# Strike potential — design

Date: 2026-11-09. Status: draft for approval.

## Intent

Readers see russia launch 150–500 drones and a handful of missiles a night. The digest tells them how many came and how many were shot down, but not the bigger question: **how much can russia launch, and is that growing?** This feature estimates russia's current long-range strike potential — what it produces, what it launches, what it keeps back — compares it with 2025, and projects it forward in three scenarios.

The user's framing: *estimate the current situation and how it grows, compare the months we track with 2025, and predict what happens next in a realistic, a pessimistic and an optimistic scenario.*

## The model

For every weapon group and every month:

```
balance(month)  = production(month) − launches(month)
reserve(month)  = reserve(previous month) + balance(month)
```

- **Production** — open estimates (mostly HUR), each with a date, a low and a high value, and a source. A month uses the latest estimate dated on or before it (a step, no interpolation).
- **Launches** — the Air Force counts we already collect (`timeline` in the issues) for the months we track (from October 2026); for every month of 2025 and January–September 2026, monthly totals per group entered by hand from published summaries (Air Force monthly totals, ISIS monthly analysis and similar), each with a source. The chart therefore has no gap between 2025 and the tracked months. *(The user's decision.)* Where a summary gives only "missiles" without a split, it's split like untyped missiles (below).
- **Reserve** — anchored on the latest dated stock estimate (e.g. HUR: Iskander-M ~115, October 2026) and rolled forward with the balance. Groups with no stock estimate (drones) show **"added to the reserve since <first tracked month>"** instead of a total — never an invented starting stock.
- Everything is a range (low/high). Arithmetic on ranges: low production − launches = low balance, etc. Launches are a single number.

### Weapon groups

Air Force reports mix types (e.g. `drone-mixed` = Shaheds + Gerbera decoys), so the model works on groups that the launch data can actually fill:

| Group | Timeline / `prices.json` types | Production estimates cover |
|---|---|---|
| Drones (strike + decoys) | `shahed`, `shahed-jet`, `decoy`, `drone-mixed` | Geran-2, jet Gerans (-3/-4/-5), Gerbera/Parody |
| Ballistic missiles | `iskander-m`, `kn23`, `kinzhal`, `s300` | Iskander-M, KN-23 (supplied), Kinzhal |
| Cruise and anti-ship missiles | `kh101`, `kalibr`, `kh22`, `kh59`, `kh31`, `kh35`, `onyx`, `zircon` | Kh-101, Kalibr, Iskander-K, Oniks, Zircon, Kh-59/69 |

Within the drones group, the decoy share is shown as a note on the estimate (HUR's own split, e.g. ~5,000 of 11,000 planned in August), because decoys inflate the count without adding strike power. Per-type detail (e.g. Iskander-M on its own) is shown in the estimates table wherever a type-level estimate exists; the balance/reserve maths stays at group level.

**Untyped missiles** (`missilesUntyped`, ~100 in October 2026): split across the two missile groups in proportion to that month's typed missiles; in a month with no typed missiles, counted half and half. The method note says so. *(My call.)*

**`front` launches** (Shaheds against front-line towns that do not make the overnight report) and glide bombs (KAB) are out of scope; the method note says the launch figures are a lower bound.

## Scenarios

Three production paths from the latest tracked month to the horizon. Launches in the forecast follow the average of the last three tracked months (one launch path for every scenario), so the scenarios differ only in what russia can make — which is what the user named as the uncertainty.

| Scenario (from Ukraine's side) | Production path |
|---|---|
| **Pessimistic** — russia meets its plans | from the first forecast month at the published *plan* figure (or today's *high* estimate where no plan is published), then growing each month by the 2025 → 2026 growth rate (yearly ratio of the two production estimates, as a monthly rate) |
| **Realistic** | stays at today's estimate (midpoint of low/high) |
| **Optimistic** — disruption | today's *low* estimate minus a disruption cut, 20% by default (sanctions, Ukrainian strikes on plants such as Alabuga and Votkinsk, faulty batches like the Kh-101 recall) *(the 20% is my call, editable)* |

Each scenario's parameters (target value or monthly growth %, disruption %) live in the data file with a one-line reason and source, so the editor can change them without code. **Horizon: 6 months** from the latest tracked month (through the winter energy-strike season). *(My call.)*

Outputs per scenario and group: reserve at the horizon, and how many nights at today's launch tempo — and how many nights at the issue's biggest single attack so far — that reserve would cover.

## Comparison with 2025

For each group: monthly production estimate then vs now (×N), monthly launches same month of 2025 vs now, and the **launch ratio** (launches ÷ production — under 1 means russia is stockpiling). 2025 numbers are monthly totals entered by hand, each with a source.

## Where it lives and what the reader sees

A new **dashboard panel `#potential`** ("Ударний потенціал росії — оцінка"), placed right after the night-attack cost panel (`#atk`), in all four languages. *(My call: it shares the attack data and context with `#atk`; a page of its own with SEO can come later if the panel earns it.)*

Top to bottom:
1. **Headline line** — one sentence per group, generated: "Drones: russia makes ~X a month, launched Y in <month> — Z added to the reserve. A year ago: X′ / Y′."
2. **Chart** — per group (group tabs): monthly launches as bars (2025 hand totals, tracked months), production as a low–high band, forecast as three lines fanning out from the last tracked month (pessimistic / realistic / optimistic), the current month marked as partial. Reuses `LineChart.tsx` where it fits.
3. **Scenario switch** — three buttons; the reserve tiles below follow the chosen one (realistic by default).
4. **Reserve tiles** — per group: reserve now (or "added since"), at the horizon, nights it covers.
5. **Estimates table** — every production/stock estimate used: type, value (low–high), date, source link. Plan figures marked "plan".
6. **Method and caveats** — HUR is a party to the war; plans are not output; launch counts are a lower bound; decoys counted with drones; untyped-missile split.

The dashboard for an older issue (`/dashboard/<date>`) shows the potential as of that date: only launches and estimates dated on or before it.

## Data and code

- **`public/potential.json`** (new, hand-maintained, Ukrainian text): `groups` (id, label, types[]), `estimates[]` (`group`, `type?`, `kind`: production | stock | plan, `low`, `high`, `date`, `src`, `url`, `note?`), `launches[]` (hand monthly totals: `month`, `group`, `n`, `src`, `url`), `scenarios` (per scenario and group: parameters + reason), `method` text. The first version is filled with the sources found on 2026-11-09 (HUR via RBC-Ukraine 4.11.2026, Pravda 10.08.2026, ISIS monthly Shahed analysis, the 2025 HUR figures).
- **Launches from tracked data**: computed on the server — every issue's `timeline` merged by date (newest issue wins for a date), summed per month and group, passed to the dashboard in the issue data (`DashIssue`). The client fetches `potential.json` with `useJson` like `prices.json`.
- **`lib/potential.ts`** — the pure maths (month launches, balance, reserve, scenario paths, nights covered), shared by server and client, self-check `npx tsx lib/potential.ts` (asserts on a small fixture).
- **validate**: `potential.json` parses; `low ≤ high`; every estimate has a date, `src` and `url`; every timeline `mix.type` in any issue belongs to exactly one group (a new type fails the build instead of silently dropping out); scenario parameters exist for every group.
- **i18n**: `potential.json` texts go through `i18n/en|de|fr.json` like `prices.json` (daily-data bucket); panel strings via `tr(uk, en, de, fr)`.
- **`scripts/stats.ts`**: also prints the month's balance per group, so the main editor sees it.

## Goals

- One honest number per group for "what russia makes vs what it launches", with the range and the source visible.
- A visible trend against 2025.
- Three scenarios to the horizon that an editor can retune in the JSON.
- Updates itself daily from data we already collect; estimates updated by hand when HUR publishes.

## Non-goals

- The full 2022–2026 history (Kaggle dataset) — not now.
- Glide bombs, artillery, front-line FPV drones.
- Per-model inventory accounting (only groups do the maths).
- Scraping HUR or news automatically.
- A separate page, OG image or digest section.

## Anti-goals (would make it a failure even if it works)

- False precision: a single number with no range, date or source.
- Presenting HUR estimates or plans as facts.
- Counting decoys as strike power without saying so.
- An invented starting stock for drones.
- A headline claim ("russia is running out", "russia will launch N") the model can't support.

## Left to the builder

- Chart details (colours from `dirCol`-style palette, label placement, phone layout).
- Exact copy of the generated sentences (house style: lowercase russia, Ukrainian first).
- Whether `stats.ts` reuses `lib/potential.ts` directly.

## Risks

- Only ~1.3 tracked months today (from 3 Oct 2026); the hand-entered 2025 and Jan–Sep 2026 totals carry the trend at first. Hand totals and our own counts may be counted slightly differently (e.g. day vs night reports) — the chart marks where hand totals end and tracked data begins.
- Estimates disagree (e.g. Kh-101: HUR 80+ planned vs independent 100–120); the band must show the spread, not average it away.
