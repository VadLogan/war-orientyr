// The price of a kilometre: russian losses (Ukraine's General Staff) per km² of net occupied-area gain (DeepState).
// Pure maths, shared by the dashboard (browser) and the server (digest/maps mentions). Self-check: npx tsx lib/landcost.ts
import type { LossRow } from "@/types/digest";
import { dayN, nDay, num } from "./text";

export type LandCfg = { baseline: { km2: number; url: string; source: string }; anchor: { date: string; totals: Record<string, number>; url: string; source: string } };

/** A period's snapshots: E = the newest archived map, S = the archived map the period starts at (newest on or before it).
 *  `per`: "all" (since 24.02.2022), a number of days ("30", "7") or a start date. */
export function lcPeriod(dates: string[], per: string) {
  const E = dates.at(-1);
  const want = per === "all" || !E ? null : per.length === 10 ? per : nDay(dayN(E) - +per);
  const S = want == null ? null : [...dates].reverse().find((d) => d <= want && d < E!) || (dates[0] < E! ? dates[0] : null);
  return { E, S };
}

/** Losses and area for the period; `areas` = the current map's, `oldAreas` = the snapshot at S (unused for "all"). */
export function lcCalc(o: { C: LandCfg; areas: Record<string, number>; oldAreas?: Record<string, number> | null; series: LossRow[]; gsPersonnel: number | null; per: string; S: string | null; E?: string }) {
  const { C, areas: Ar, series, per, S, E } = o, base = C.baseline.km2;
  const sum = (rows: LossRow[], k: string) => rows.reduce((s, e) => s + (num(e.ru![k]) || 0), 0);
  const avg = o.gsPersonnel != null && Ar.ds_occ > base ? o.gsPersonnel / (Ar.ds_occ - base) : null;
  if (per === "all") {
    const ser = series.filter((e) => e && e.ru && e.date > C.anchor.date);
    const tot = (k: string) => { const a = C.anchor.totals[k]; return a == null ? null : a + sum(ser, k); };
    return { pers: o.gsPersonnel, tot, net: Ar.ds_occ - base, netI: Ar.isw - base, avg, a0: base, days: 0, span: 0 };
  }
  const rows = series.filter((e) => e && e.ru && e.date > S! && e.date <= E!);
  return { pers: sum(rows, "personnel") as number | null, tot: (k: string) => sum(rows, k) as number | null, net: Ar.ds_occ - o.oldAreas!.ds_occ, netI: 0, avg, a0: o.oldAreas!.ds_occ, days: rows.length, span: dayN(E!) - dayN(S!) };
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("landcost.ts")) {
  const C: LandCfg = { baseline: { km2: 44000, url: "", source: "" }, anchor: { date: "2026-01-01", totals: { tanks: 100 }, url: "", source: "" } };
  const series = [{ date: "2026-01-02", ru: { personnel: 10, tanks: 1 } }, { date: "2026-01-05", ru: { personnel: 20, tanks: 2 } }];
  const a = lcCalc({ C, areas: { ds_occ: 44100, isw: 44050 }, series, gsPersonnel: 1000, per: "all", S: null });
  console.assert(a.net === 100 && a.tot("tanks") === 103 && a.avg === 10, "all", a);
  const p = lcPeriod(["2026-01-01", "2026-01-03", "2026-01-08"], "7");
  console.assert(p.S === "2026-01-01" && p.E === "2026-01-08", "period", p);
  const b = lcCalc({ C, areas: { ds_occ: 44100, isw: 0 }, oldAreas: { ds_occ: 44090 }, series, gsPersonnel: 1000, per: "7", ...p });
  console.assert(b.net === 10 && b.pers === 30 && b.days === 2 && b.span === 7, "7 days", b);
  console.log("landcost ok");
}
