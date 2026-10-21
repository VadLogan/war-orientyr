"use client";
import type { LossRow } from "@/types/digest";
import { dayN, fmt, num, shortD } from "@/lib/text";
import { useApp } from "../ctx";
import { useSticky } from "./hooks";
import LineChart, { Legend, type Ser } from "./LineChart";
import { RangeSeg, rangeStart } from "./Timeline";
import { flags } from "@/components/Flag";

const LCATS = ["personnel", "tanks", "armoured", "artillery", "mlrs", "auto", "uav", "aa"] as const;

/** Losses: each side's claims about the other, per day. */
export default function Losses() {
  const { t, lang, D, LATEST } = useApp();
  const [cat, setCat] = useSticky<string>("lsCat", "personnel");
  const [range, setRange] = useSticky("lsRange", "30");
  const [table, setTable] = useSticky("lsTable", false);
  const B = LATEST;
  if (!B.losses) return null;
  const en = lang === "en";
  const all = ((B.losses.series || []) as LossRow[]).filter((e) => e && /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a, b) => (a.date < b.date ? -1 : 1));
  const row = all.find((e) => e.date === D.date) || null;
  // russia's MoD publishes around midday, after the morning issue — show its latest claim up to this date
  const uaRow = all.filter((e) => e.date <= D.date && e.ua && e.ua.personnel != null).pop() || null;
  const tot = B.losses.gsTotal;
  const tv = (v: number | undefined | null, approx?: boolean) => (v == null ? "—" : (approx ? "≈ " : "") + fmt(v, lang));

  const ser: Ser<LossRow>[] = [
    { name: t.lsRuName, color: "var(--s1)", get: (e) => num(e.ru && e.ru[cat]), src: "ru" },
    { name: t.lsUaName, color: "var(--s2)", get: (e) => num(e.ua && e.ua[cat]), src: "ua" },
  ];
  if (cat === "personnel") ser.push({ name: en ? "of which USF (killed)" : "у т.ч. СБС (знищено особового складу)", color: "var(--c3)", get: (e) => num(e.sbs && e.sbs.killed), src: "sbs" });
  const end = dayN(B.date), start = rangeStart(all, range, end);
  const rows = all.filter((e) => { const n = dayN(e.date); return n >= start && n <= end && ser.some((s) => s.get(e) != null); });
  const uaNone = !all.some((e) => num(e.ua && e.ua[cat]) != null);
  const note = (uaNone ? t.lsNoUa + " " : "") + t.lsGaps + (cat === "personnel"
    ? en ? " USF is part of the General Staff total; shown only for days with USF board data." : " Втрати від СБС — частина загальних втрат за Генштабом; показано лише дні, для яких є дані табло СБС."
    : "");

  return (
    <section className="tlwrap" id="losses">
      <div className="tl-head"><h2>{t.ls}</h2><p>{t.lsSub}</p></div>
      <p className="ls-caveat">{flags(B.losses.caveat || "")}</p>
      <div className="tiles ls-tiles">
        <div className="tile"><small>{t.lsRuDay}</small><b>{tv(row?.ru?.personnel)}</b><span>{t.lsRuSrc} · {row ? shortD(row.date) : "—"}</span></div>
        <div className="tile"><small>{flags(t.lsUaDay)}</small><b>{tv(uaRow?.ua?.personnel, true)}</b><span>{t.lsUaSrc} · {uaRow ? shortD(uaRow.date) : "—"}</span></div>
        <div className="tile"><small>{t.lsRuTotal}</small><b>{tot && tot.personnel != null ? fmt(tot.personnel, lang) : "—"}</b><span>{flags((tot && tot.source) || "")}{tot && tot.date ? " · " + shortD(tot.date) : ""}</span></div>
      </div>
      <div className="tl-controls">
        <div className="seg" role="group" aria-label={t.lsCatL}>{LCATS.map((k) => <button type="button" key={k} aria-pressed={cat === k} onClick={() => setCat(k)}>{t.lc[k]}</button>)}</div>
        <RangeSeg value={range} set={setRange} />
        <span className="spacer" />
        <div className="seg"><button type="button" aria-pressed={table} onClick={() => setTable(!table)}>{t.table}</button></div>
      </div>
      <div className="panel tl-panel">
        <Legend ser={ser} bars />
        <LineChart key={cat + range + D.date} rows={rows} ser={ser} start={start} end={end} table={table} aria={t.ls} bars label={(e) => shortD(e.date)}
          srcOf={(e, s) => (e.src && e.src[s.src]) || ""}
          fmtV={(s, v) => (v == null ? "—" : (s.src === "ua" && cat === "personnel" ? "≈ " : "") + fmt(v, lang))} />
        <p className="sub" style={{ margin: 0 }}>{flags(note)}</p>
      </div>
      <details className="method"><summary>{t.lsMethod}</summary><p>{flags((B.losses.method && B.losses.method.ru) || "")}</p><p>{flags((B.losses.method && B.losses.method.ua) || "")}</p></details>
    </section>
  );
}
