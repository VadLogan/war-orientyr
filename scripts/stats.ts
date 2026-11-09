// Numbers for the main editor: the issue's day against yesterday, the 7- and 30-day averages and the whole series
// ("most since…", records), and — on the 1st of a month, or with --month — last month against every earlier month.
//   npx tsx scripts/stats.ts [YYYY-MM-DD] [--month]     (default: the date of public/digest.json)
// Reads public/digest.json (timeline, losses.series), strikes.json and maps/strikes-base.json. Only facts already in the data.
import fs from "node:fs";
import { dayRecords } from "../lib/records";
import { potential, type PotentialData } from "../lib/potential";
import { stkDist, type Strikes } from "../lib/strikes";
import type { Digest } from "../types/digest";

const pub = (f: string) => JSON.parse(fs.readFileSync(new URL("../public/" + f, import.meta.url), "utf8"));
type Row = { date: string; v: number };
/** count: a month is its sum and daily average; avg: only the average (shares); max: only the month's top day (farthest strike). */
type Metric = { name: string; rows: Row[]; kind?: "count" | "avg" | "max" };

/** Day value against the rows before it: previous day, averages, and the latest earlier day at least as high (low). */
export function compare(rows: Row[], date: string) {
  const i = rows.findIndex((r) => r.date === date);
  if (i < 0) return null;
  const v = rows[i].v, before = rows.slice(0, i), avg = (n: number) => { const s = before.slice(-n); return s.length ? s.reduce((a, r) => a + r.v, 0) / s.length : null; };
  const hi = [...before].reverse().find((r) => r.v >= v), lo = [...before].reverse().find((r) => r.v <= v);
  return { v, prev: before.at(-1) ?? null, avg7: avg(7), avg30: avg(30), n: before.length, since: rows[0]?.date,
    mostSince: (before.length ? hi ?? "record" : null) as Row | "record" | null, leastSince: (before.length ? lo ?? "record" : null) as Row | "record" | null };
}

const pct = (a: number, b: number | null) => (b ? `${a >= b ? "+" : ""}${Math.round((a / b - 1) * 100)}%` : "—");
const r1 = (x: number | null) => (x == null ? "—" : String(Math.round(x * 10) / 10));
function line(m: Metric, date: string) {
  const c = compare(m.rows, date);
  if (!c) return `${m.name}: no value for ${date}`;
  const rec = (s: Row | "record" | null, w: string) => (s === "record" ? `${w} in the series (since ${c.since})` : s ? `${w} since ${s.date} (${s.v})` : "");
  return `${m.name}: ${c.v} | prev ${c.prev ? `${c.prev.v} (${c.prev.date}) ${pct(c.v, c.prev.v)}` : "—"} | avg7 ${r1(c.avg7)} ${pct(c.v, c.avg7)} | avg30 ${r1(c.avg30)} ${pct(c.v, c.avg30)} | `
    + [rec(c.mostSince, "most"), rec(c.leastSince, "least")].filter(Boolean).join("; ") + ` | ${c.n} earlier days`;
}

/** Per-month sum / days / average / max day of a metric. */
export function months(rows: Row[]) {
  const by = new Map<string, Row[]>();
  for (const r of rows) by.set(r.date.slice(0, 7), [...(by.get(r.date.slice(0, 7)) ?? []), r]);
  return [...by].map(([m, rs]) => { const sum = rs.reduce((a, r) => a + r.v, 0), max = rs.reduce((a, r) => (r.v > a.v ? r : a));
    return { m, days: rs.length, sum, avg: sum / rs.length, max }; });
}

function main() {
  const args = process.argv.slice(2), D = pub("digest.json") as Digest, date = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? D.date;
  const S: Strikes = { stk: pub("strikes.json"), base: pub("maps/strikes-base.json") };
  const T = (D.timeline ?? []) as any[], L = (D.losses?.series ?? []).filter((r: any) => r.ru) as any[];
  const of = (src: any[], get: (r: any) => unknown): Row[] => src.map((r) => ({ date: r.date, v: get(r) })).filter((r): r is Row => typeof r.v === "number").sort((a, b) => (a.date < b.date ? -1 : 1));
  // strikes count on the issue that first reported them (as lib/records.ts does), else on their own date
  const stkDays = new Map<string, number>(), far = new Map<string, number>();
  for (const x of S.stk.items) { const d = x.issue ?? x.date; stkDays.set(d, (stkDays.get(d) ?? 0) + 1); const km = stkDist(S.base, x); if (km != null && km > (far.get(d) ?? -1)) far.set(d, km); }
  const metrics: Metric[] = [
    { name: "drones+missiles launched", rows: of(T, (r) => r.launched) },
    { name: "shot down %", kind: "avg", rows: of(T, (r) => (r.launched ? Math.round((1000 * r.intercepted) / r.launched) / 10 : null)) },
    { name: "hit locations", rows: of(T, (r) => r.hitLocations) },
    { name: "clashes", rows: of(T, (r) => r.clashes) },
    ...["shell", "kab", "air", "kamikaze", "mlrs"].map((k) => ({ name: "fire." + k, rows: of(T, (r) => r.fire?.[k]) })),
    ...["personnel", "tanks", "armoured", "artillery", "mlrs", "uav", "auto"].map((k) => ({ name: "ru losses." + k, rows: of(L, (r) => r.ru[k]) })),
    { name: "ua losses (russian MoD claim).personnel", rows: of(L, (r) => r.ua?.personnel) },
    { name: "strikes on russia (strikes.json, by date)", rows: [...stkDays].map(([d, v]) => ({ date: d, v })).sort((a, b) => (a.date < b.date ? -1 : 1)) },
    { name: "farthest strike of the day, km from the front", kind: "max", rows: [...far].map(([d, v]) => ({ date: d, v })).sort((a, b) => (a.date < b.date ? -1 : 1)) },
  ];

  console.log(`# Day ${date} — against earlier days of each series`);
  for (const m of metrics) console.log(line(m, date));
  const R = dayRecords({ ...D, date } as Digest, S);
  console.log(`\n# Records shown on the site (lib/records.ts): ${R ? JSON.stringify(R) : "none"}`);

  // strike potential panel (lib/potential.ts): last full month, output, balance, reserve now and in the realistic scenario
  console.log(`\n# Strike potential (public/potential.json + timeline; estimates, not an inventory)`);
  const n = (x: number) => String(Math.round(x)), rg = (r: { lo: number; hi: number }) => `${n(r.lo)}–${n(r.hi)}`;
  for (const g of Object.values(potential(pub("potential.json") as PotentialData, D.timeline ?? [], date))) {
    const lf = g.lastFull, mid = g.now && (g.now.lo + g.now.hi) / 2;
    console.log(`${g.id}: output ${g.now ? rg(g.now) : "—"}/month | ${lf ? `${lf.month} launched ${lf.launched == null ? "—" : n(lf.launched)} (${lf.src})` : "no full month"}`
      + (mid && lf?.launched != null ? ` | balance ${n(mid - lf.launched)} (${Math.round((lf.launched / mid) * 100)}% of output)` : "")
      + ` | reserve ${g.reserveNow ? rg(g.reserveNow) + (g.reserveSince ? ` added since ${g.reserveSince}` : "") : "—"}`
      + (g.reserveEnd && g.forecast.length ? ` | realistic ${g.forecast.at(-1)!.month}: ${rg(g.reserveEnd.real)}` : ""));
  }

  if (date.endsWith("-01") || args.includes("--month")) {
    const cur = date.slice(0, 7), last = new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 2, 1)).toISOString().slice(0, 7);
    const mo = date.endsWith("-01") ? last : cur;
    console.log(`\n# Month ${mo} against every earlier month in the data (days = days with a value; strikes.json before autumn 2026 is an incomplete archive)`);
    for (const m of metrics) {
      const ms = months(m.rows.filter((r) => r.date.slice(0, 7) <= mo)), k = ms.findIndex((x) => x.m === mo);
      if (k < 0) continue;
      const x = ms[k], prev = ms[k - 1], score = (y: (typeof ms)[number]) => (m.kind === "max" ? y.max.v : m.kind === "avg" ? y.avg : y.sum);
      const by = m.kind === "max" ? "top day" : m.kind === "avg" ? "average" : "total";
      const best = ms.reduce((a, y) => (score(y) > score(a) ? y : a)), rank = [...ms].sort((a, b) => score(b) - score(a)).indexOf(x) + 1;
      const fmtM = (y: (typeof ms)[number]) => m.kind === "max" ? `top ${y.max.v} on ${y.max.date}` : m.kind === "avg" ? `avg ${r1(y.avg)} (${y.days} d)` : `total ${r1(y.sum)}, avg ${r1(y.avg)}/day (${y.days} d), top day ${y.max.v} on ${y.max.date}`;
      console.log(`${m.name}: ${mo} ${fmtM(x)} | ` + (prev ? `prev month ${prev.m} ${fmtM(prev)} (${pct(score(x), score(prev))}) | rank by ${by} ${rank} of ${ms.length}; best ${best.m} (${r1(score(best))})` : "no earlier month in the data"));
    }
  }
}

if (process.argv[1]?.endsWith("stats.ts")) {
  if (process.argv.includes("--test")) {
    const rows = [5, 9, 3, 7, 8].map((v, i) => ({ date: `2026-10-0${i + 1}`, v }));
    const c = compare(rows, "2026-10-05")!;
    console.assert(c.prev?.v === 7 && (c.mostSince as Row).date === "2026-10-02" && c.avg7 === 6, "compare");
    console.assert(compare(rows, "2026-10-02")!.mostSince === "record", "record");
    console.assert(months(rows)[0].sum === 32 && months(rows)[0].max.v === 9, "months");
    console.log("stats ok");
  } else main();
}
