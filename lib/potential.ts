// russia's strike potential per weapon group: production (open estimates) against launches (hand monthly totals +
// the Air Force timeline), the reserve it leaves, and three production scenarios to a horizon. Pure; shared by the
// dashboard panel (`components/dash/Potential.tsx`) and `scripts/stats.ts`. Self-check: `npx tsx lib/potential.ts`.
import type { TimelineEntry } from "@/types/digest";

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
/** `launched` null = no figure for that month (a gap on the chart) */
export type MonthRow = { month: string; launched: number | null; src: "hand" | "tracked" | null; partial: boolean; prod: Range | null };
export type GroupResult = {
  id: GroupId;
  months: MonthRow[];
  forecast: { month: string; launched: number; prod: Record<Scenario, number> }[];
  now: Range | null; yearAgo: Range | null;
  plan: Estimate | null; stock: Estimate | null;
  lastFull: MonthRow | null; lastFullYearAgo: MonthRow | null;
  reserveNow: Range | null; reserveSince: string | null;
  reserveEnd: Record<Scenario, Range> | null;
  perNight: number; maxNight: number;
};
type MonthL = Record<GroupId, number | null> & { src: "hand" | "tracked"; days: number };

const ym = (d: string) => d.slice(0, 7);
const daysIn = (m: string) => new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate();
const addM = (m: string, k: number) => { const d = new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7) - 1 + k, 1)); return d.toISOString().slice(0, 7); };
const mid = (r: Range) => (r.lo + r.hi) / 2;
const IDS: GroupId[] = ["dr", "bal", "cr"];

/** One timeline day by group; what the report leaves untyped beyond `missilesUntyped` counts as drones. */
export function dayGroups(e: TimelineEntry, groups: PotentialData["groups"]): Record<GroupId, number> & { untyped: number } {
  const r = { dr: 0, bal: 0, cr: 0, untyped: e.missilesUntyped ?? 0 };
  let typed = 0;
  for (const m of e.mix ?? []) { const g = groups.find((x) => x.types.includes(m.type)); if (g) r[g.id] += m.n; typed += m.n; }
  const rest = (e.launched ?? 0) - typed - r.untyped;
  if (rest > 0) r.dr += rest;
  return r;
}

/** Missiles of no named type, split between ballistic and cruise in proportion to the typed ones (half/half when none). */
const split = (bal: number, cr: number, n: number) => (bal + cr ? [n * bal / (bal + cr), n * cr / (bal + cr)] : [n / 2, n / 2]);

/** Launches per month up to `date`: a hand row wins once its month is over; otherwise the timeline days of that month on or before `date`. */
export function monthLaunches(P: PotentialData, tl: TimelineEntry[], date: string): Map<string, MonthL> {
  const out = new Map<string, MonthL>(), acc = new Map<string, { dr: number; bal: number; cr: number; untyped: number; days: number }>();
  for (const e of tl) {
    if (e.date > date) continue;
    const d = dayGroups(e, P.groups), a = acc.get(ym(e.date)) ?? { dr: 0, bal: 0, cr: 0, untyped: 0, days: 0 };
    a.dr += d.dr; a.bal += d.bal; a.cr += d.cr; a.untyped += d.untyped; a.days++;
    acc.set(ym(e.date), a);
  }
  for (const [m, a] of acc) { const [b, c] = split(a.bal, a.cr, a.untyped); out.set(m, { dr: a.dr, bal: a.bal + b, cr: a.cr + c, src: "tracked", days: a.days }); }
  for (const h of P.launches) {
    if (h.month > ym(date) || (h.month === ym(date) && +date.slice(8, 10) < daysIn(h.month))) continue; // the month must be over
    const [b, c] = h.msl ? split(h.bal ?? 0, h.cr ?? 0, h.msl) : [0, 0];
    out.set(h.month, { dr: h.dr ?? null, bal: h.bal == null && !b ? null : (h.bal ?? 0) + b, cr: h.cr == null && !c ? null : (h.cr ?? 0) + c, src: "hand", days: daysIn(h.month) });
  }
  return out;
}

export function potential(P: PotentialData, tl: TimelineEntry[], date: string): Record<GroupId, GroupResult> {
  const ML = monthLaunches(P, tl, date), dm = ym(date), day = +date.slice(8, 10), dim = daysIn(dm), partial = day < dim;
  const keys = [...ML.keys()].sort(), months: string[] = [];
  if (keys.length) for (let m = keys[0]; m <= dm; m = addM(m, 1)) months.push(m);
  const firstTracked = keys.find((m) => ML.get(m)!.src === "tracked") ?? null;
  const days = tl.filter((e) => e.date <= date).map((e) => dayGroups(e, P.groups));
  const res = {} as Record<GroupId, GroupResult>;
  for (const id of IDS) {
    const grp = P.groups.find((g) => g.id === id), E = P.estimates.filter((e) => e.group === id && !e.type);
    const latest = (kind: Estimate["kind"], upTo: string) => E.filter((e) => e.kind === kind && e.date <= upTo).sort((a, b) => (a.date < b.date ? -1 : 1)).at(-1) ?? null;
    const prodAt = (m: string): Range | null => { const end = m + "-" + String(daysIn(m)).padStart(2, "0"), e = latest("production", end < date ? end : date); return e && { lo: e.low, hi: e.high }; };
    const rows: MonthRow[] = months.map((m) => {
      const l = ML.get(m), p = prodAt(m), part = m === dm && partial, f = part ? day / dim : 1;
      return { month: m, launched: l?.[id] ?? null, src: l?.src ?? null, partial: part, prod: p && { lo: p.lo * f, hi: p.hi * f } };
    });
    const now = prodAt(dm), yearAgo = prodAt(addM(dm, -12)), plan = latest("plan", date), stock = latest("stock", date);
    const full = rows.filter((r) => !r.partial), lastFull = [...full].reverse().find((r) => r.launched != null) ?? null;
    const lastFullYearAgo = (lastFull && rows.find((r) => r.month === addM(lastFull.month, -12) && r.launched != null)) || null;
    const l3 = full.slice(-3).map((r) => r.launched).filter((v): v is number => v != null);
    const fl = l3.length ? l3.reduce((a, b) => a + b, 0) / l3.length : 0;
    const g = now && yearAgo ? Math.pow(mid(now) / mid(yearAgo), 1 / 12) - 1 : 0;
    const cut = grp?.cut ?? P.scenarios.opt.cut ?? 0.2;
    const forecast = now ? Array.from({ length: P.horizon }, (_, k) => ({ month: addM(dm, k + 1), launched: fl,
      prod: { real: mid(now), opt: now.lo * (1 - cut), pes: (plan ? (plan.low + plan.high) / 2 : now.hi) * Math.pow(1 + g, k) } })) : [];
    // reserve: the stock estimate rolled forward from the month after it; without one, what was added since tracking began
    const from = stock ? addM(ym(stock.date), 1) : firstTracked;
    let reserveNow: Range | null = null;
    if (now && from) {
      reserveNow = stock ? { lo: stock.low, hi: stock.high } : { lo: 0, hi: 0 };
      for (const r of rows) if (r.month >= from && r.prod && r.launched != null) { reserveNow.lo += r.prod.lo - r.launched; reserveNow.hi += r.prod.hi - r.launched; }
    }
    const rest = now && partial ? (mid(now) - fl) * (dim - day) / dim : 0;
    const reserveEnd = reserveNow && (Object.fromEntries((["pes", "real", "opt"] as Scenario[]).map((s) => {
      const add = rest + forecast.reduce((a, f) => a + f.prod[s] - f.launched, 0);
      return [s, { lo: reserveNow!.lo + add, hi: reserveNow!.hi + add }];
    })) as Record<Scenario, Range>);
    const maxNight = days.reduce((a, d) => Math.max(a, d[id] + (id === "dr" ? 0 : d.untyped / 2)), 0);
    res[id] = { id, months: rows, forecast, now, yearAgo, plan, stock, lastFull, lastFullYearAgo, reserveNow, reserveSince: stock ? null : reserveNow && from, reserveEnd, perNight: fl / 30, maxNight };
  }
  return res;
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("potential.ts")) {
  // no node:assert: this module also ships to the browser
  const assert = {
    ok: (c: unknown, m = "") => { if (!c) throw new Error("assert: " + m); },
    equal: (a: unknown, b: unknown) => { if (a !== b) throw new Error(`assert: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`); },
    deepEqual: (a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`assert: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); },
  };
  const near = (a: number, b: number, m = "") => assert.ok(Math.abs(a - b) < 1e-6, `${m}: ${a} ≠ ${b}`);
  const G: PotentialData["groups"] = [
    { id: "dr", label: "дрони", unit: "дронів", types: ["shahed", "shahed-jet", "decoy", "drone-mixed"] },
    { id: "bal", label: "балістичні", unit: "ракет", types: ["iskander-m", "kn23", "kinzhal", "s300"], cut: 0.3 },
    { id: "cr", label: "крилаті", unit: "ракет", types: ["kh101", "kalibr", "kh22", "kh59", "kh31", "kh35", "onyx", "zircon"] },
  ];
  const sc = { label: "", note: "" };
  const P0: PotentialData = { schema: 1, horizon: 6, method: "", groups: G, estimates: [], launches: [], scenarios: { pes: sc, real: sc, opt: { ...sc, cut: 0.2 } } };
  const TL: TimelineEntry[] = [
    { date: "2026-10-07", launched: 100, mix: [{ type: "drone-mixed", n: 90 }, { type: "iskander-m", n: 6 }, { type: "kh101", n: 2 }], missilesUntyped: 2 },
    { date: "2026-10-20", launched: 200, mix: [{ type: "shahed-jet", n: 150 }, { type: "iskander-m", n: 10 }, { type: "kalibr", n: 14 }] },
    { date: "2026-11-01", launched: 50, mix: [{ type: "drone-mixed", n: 46 }, { type: "iskander-m", n: 4 }] },
  ];
  const est = (group: GroupId, kind: Estimate["kind"], low: number, high: number, date: string, type?: string): Estimate => ({ group, kind, low, high, date, type, src: "s", url: "u" });
  const P2: PotentialData = { ...P0,
    estimates: [est("bal", "production", 40, 60, "2025-06-01"), est("bal", "production", 60, 100, "2026-07-15"), est("bal", "production", 65, 65, "2026-07-15", "iskander-m"),
      est("bal", "plan", 110, 110, "2026-08-01"), est("bal", "stock", 100, 200, "2026-10-20"), est("dr", "production", 300, 300, "2026-07-15")],
    launches: [{ month: "2026-06", bal: 30, src: "s", url: "u" }, { month: "2026-07", bal: 40, src: "s", url: "u" }] };

  // day split
  assert.deepEqual(dayGroups({ date: "2026-10-14", launched: 167, mix: [{ type: "shahed-jet", n: 77 }, { type: "drone-mixed", n: 51 }], missilesUntyped: 39 }, G), { dr: 128, bal: 0, cr: 0, untyped: 39 });
  // remainder is drones
  assert.equal(dayGroups({ date: "2026-10-07", launched: 130, missilesUntyped: 53 }, G).dr, 77);
  // untyped without typed → half/half; with typed → proportional (3 bal : 1 cr)
  const m1 = monthLaunches(P0, [{ date: "2026-10-07", launched: 10, missilesUntyped: 10 }], "2026-10-31").get("2026-10")!;
  assert.deepEqual([m1.bal, m1.cr], [5, 5]);
  const m2 = monthLaunches(P0, [{ date: "2026-10-07", launched: 8, mix: [{ type: "iskander-m", n: 3 }, { type: "kh101", n: 1 }], missilesUntyped: 4 }], "2026-10-31").get("2026-10")!;
  assert.deepEqual([m2.bal, m2.cr], [6, 2]);
  // hand row wins over tracked; msl split like untyped
  const P1 = { ...P0, launches: [{ month: "2026-10", dr: 1000, bal: 30, cr: 10, msl: 40, src: "x", url: "u" }] };
  const { dr, bal, cr, src } = monthLaunches(P1, TL, "2026-10-31").get("2026-10")!;
  assert.deepEqual({ dr, bal, cr, src }, { dr: 1000, bal: 60, cr: 20, src: "hand" });
  // a hand row for the issue's own month is not used before the month is over (no future data on an old issue)
  const early = monthLaunches(P1, TL, "2026-10-10").get("2026-10")!;
  assert.deepEqual([early.src, early.dr], ["tracked", 266 - 176]);
  assert.equal(monthLaunches(P1, TL, "2026-10-31").get("2026-10")!.src, "hand");
  // a hand row without the group's figure is a gap, not 0
  assert.equal(monthLaunches(P2, TL, "2026-11-01").get("2026-06")!.dr, null);
  // tracked month: Oct = dr 90+176, bal 16+1, cr 16+1
  const oct = monthLaunches(P0, TL, "2026-11-01").get("2026-10")!;
  assert.deepEqual([oct.dr, oct.bal, oct.cr, oct.src, oct.days], [266, 17, 17, "tracked", 2]);
  // no estimate → null production, empty forecast, no reserve
  const r0 = potential(P0, TL, "2026-10-31").bal;
  assert.equal(r0.now, null); assert.deepEqual(r0.forecast, []); assert.equal(r0.reserveEnd, null); assert.equal(r0.reserveNow, null);

  const R = potential(P2, TL, "2026-11-01"), B = R.bal;
  // months: consecutive Jun … Nov, gaps for Aug/Sep
  assert.deepEqual(B.months.map((m) => [m.month, m.launched]), [["2026-06", 30], ["2026-07", 40], ["2026-08", null], ["2026-09", null], ["2026-10", 17], ["2026-11", 4]]);
  // production step: Jun uses the 2025 estimate, Jul the 2026-07-15 one; the type-level Iskander figure is ignored
  assert.deepEqual(B.months[0].prod, { lo: 40, hi: 60 }); assert.deepEqual(B.months[1].prod, { lo: 60, hi: 100 });
  // partial month: on the 1st, Nov prod = estimate × 1/30
  assert.equal(B.months[5].partial, true); assert.equal(B.months[4].partial, false);
  near(B.months[5].prod!.lo, 2, "partial lo"); near(B.months[5].prod!.hi, 100 / 30, "partial hi");
  assert.deepEqual([B.now, B.yearAgo], [{ lo: 60, hi: 100 }, { lo: 40, hi: 60 }]);
  assert.equal(B.lastFull!.month, "2026-10"); assert.equal(B.lastFullYearAgo, null);
  // scenarios: real = mid, opt = lo × (1 − 0.3 group cut), pes = plan × (1+g)^k, g = 1.6^(1/12) − 1
  const g = Math.pow(1.6, 1 / 12) - 1;
  assert.equal(B.forecast.length, 6); assert.equal(B.forecast[0].month, "2026-12"); assert.equal(B.forecast[5].month, "2027-05");
  near(B.forecast[0].prod.real, 80, "real"); near(B.forecast[0].prod.opt, 42, "opt"); near(B.forecast[0].prod.pes, 110, "pes0"); near(B.forecast[1].prod.pes, 110 * (1 + g), "pes1");
  // forecast launches: last 3 full months Aug/Sep/Oct, gaps skipped → 17
  near(B.forecast[0].launched, 17, "forecast launches"); near(B.perNight, 17 / 30, "per night");
  // reserve: stock from Oct (its month) + November only (prorated prod − 4 launched)
  near(B.reserveNow!.lo, 98, "reserve lo"); near(B.reserveNow!.hi, 200 + 100 / 30 - 4, "reserve hi"); assert.equal(B.reserveSince, null);
  near(B.reserveEnd!.real.lo, 98 + (80 - 17) * 29 / 30 + 6 * (80 - 17), "reserve end real");
  assert.equal(B.maxNight, 10);
  // drones: no stock → added since the first tracked month: Oct (300 − 266) + Nov (10 − 46)
  near(R.dr.reserveNow!.lo, -2, "drones reserve"); assert.equal(R.dr.reserveSince, "2026-10"); assert.equal(R.dr.maxNight, 176);
  // no future estimates: on 2026-07-10 the estimate dated 2026-07-15 is not known yet
  assert.deepEqual(potential(P2, TL, "2026-07-10").bal.now, { lo: 40, hi: 60 });
  // a 1-day-old month never divides by zero; a 2025 date with no data gives empty rows
  assert.deepEqual(potential(P2, [], "2025-01-15").dr.months, []);
  console.log("ok");
}
