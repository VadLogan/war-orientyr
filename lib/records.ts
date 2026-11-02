// Records set on an issue's day: a russian loss category above every earlier day of losses.series, or a strike farther
// from the front than every earlier one in strikes.json. Most days have none — then the digest shows no block.
import type { Digest } from "@/types/digest";
import { stkDist, type Strikes } from "./strikes";

export const REC_KEYS = ["personnel", "tanks", "armoured", "artillery", "mlrs", "uav", "auto"] as const;
/** Earlier days a loss record needs; while the series is young every other day would be a "record". */
const MIN_DAYS = 30;

export type LossRecord = { key: (typeof REC_KEYS)[number]; v: number; prev: number; prevDate: string; since: string };
export type StrikeRecord = { km: number; place: string; prev: number; prevPlace: string; prevDate: string };
export type DayRecords = { losses: LossRecord[]; strike: StrikeRecord | null };

export function dayRecords(D: Digest, S: Strikes): DayRecords | null {
  const series = (D.losses?.series ?? []).filter((r) => r.ru && r.date <= D.date).sort((a, b) => (a.date < b.date ? -1 : 1));
  const today = series.at(-1)?.date === D.date ? series.at(-1)! : null, before = series.slice(0, -1);
  const losses: LossRecord[] = [];
  if (today && before.length >= MIN_DAYS)
    for (const key of REC_KEYS) {
      const v = today.ru![key];
      if (typeof v !== "number") continue;
      let best: { v: number; d: string } | null = null;
      for (const r of before) { const x = r.ru![key]; if (typeof x === "number" && (!best || x > best.v)) best = { v: x, d: r.date }; }
      if (best && v > best.v) losses.push({ key, v, prev: best.v, prevDate: best.d, since: series[0].date });
    }

  let strike: StrikeRecord | null = null, top: { km: number; place: string; d: string } | null = null;
  for (const x of S.stk.items) {
    const km = stkDist(S.base, x), d = x.issue ?? x.date;
    if (km == null || d > D.date) continue;
    if (d < D.date) { if (!top || km > top.km) top = { km, place: x.place, d }; }
    else if (!strike || km > strike.km) strike = { km, place: x.place, prev: 0, prevPlace: "", prevDate: "" };
  }
  if (strike && top && strike.km > top.km) Object.assign(strike, { prev: top.km, prevPlace: top.place, prevDate: top.d });
  else strike = null;

  return losses.length || strike ? { losses, strike } : null;
}

/** Self-check: `npx tsx lib/records.ts` */
if (typeof process !== "undefined" && process.argv[1]?.endsWith("records.ts")) {
  const day = (date: string, personnel: number) => ({ date, ru: { personnel } });
  const series = Array.from({ length: 31 }, (_, i) => day(`2026-09-${String(i + 1).padStart(2, "0")}`.replace("09-31", "10-01"), 100 + (i % 5)));
  const S = { stk: { items: [] }, base: { base: [] } } as unknown as Strikes;
  const D = (date: string, s: typeof series) => ({ date, losses: { series: s } }) as unknown as Digest;
  const rec = dayRecords(D("2026-10-02", [...series, day("2026-10-02", 200)]), S);
  console.assert(rec?.losses[0]?.v === 200 && rec.losses[0].prev === 104, "record found");
  console.assert(dayRecords(D("2026-10-02", [...series, day("2026-10-02", 104)]), S) === null, "tie is no record");
  console.assert(dayRecords(D("2026-09-20", series.slice(0, 20)), S) === null, "too little history");
  console.log("records ok");
}
