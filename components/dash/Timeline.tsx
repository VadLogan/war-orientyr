"use client";
import type { TimelineEntry } from "@/types/digest";
import { dayN, fmt, num, shortD, TL } from "@/lib/text";
import { useApp } from "../ctx";
import { useSticky } from "./hooks";
import LineChart, { Legend, type Ser } from "./LineChart";
import { flags } from "@/components/Flag";

/* ---------- direction toggles (shared by the directions panel and the timeline) ---------- */
export type DirSel = Set<string> | null;
const DCOL = ["--c1", "--c2", "--c3", "--c4", "--c5", "--m-dg", "--m-isw", "--s2", "--unv", "--m-onlydgg", "--ok", "--muted"];
export function dirOrder(all: TimelineEntry[]) {
  const tot: Record<string, number> = {};
  all.forEach((e) => { if (e.directions) for (const k in e.directions) { const v = num(e.directions[k]); if (v != null) tot[k] = (tot[k] || 0) + v; } });
  return Object.keys(tot).sort((a, b) => tot[b] - tot[a] || a.localeCompare(b));
}
const dirCol = (order: string[], n: string) => { let i = order.indexOf(n); if (i < 0) i = order.length; return `var(${DCOL[i % DCOL.length]})`; };
const dirOn = (sel: DirSel, n: string, def: string[]) => (sel ? sel.has(n) : def.includes(n));

function DirCtl({ names, sel, setSel }: { names: string[]; sel: DirSel; setSel: (s: DirSel) => void }) {
  const { t } = useApp();
  return (
    <span className="dctl">
      <button type="button" className="linkbtn" onClick={() => setSel(new Set([...(sel || []), ...names]))}>{t.dAll}</button>
      {sel && <button type="button" className="linkbtn" onClick={() => setSel(null)}>{t.dReset}</button>}
    </span>
  );
}
const toggle = (sel: DirSel, names: string[], n: string) => {
  const s = new Set(sel || names.slice(0, 5));
  if (s.has(n)) s.delete(n); else s.add(n);
  return s;
};

const RANGES = ["7", "30", "90", "all"] as const;
export function rangeStart(all: { date: string }[], range: string, end: number) {
  return range === "all" ? Math.min(end, all.length ? dayN(all[0].date) : end) : end - +range + 1;
}
export function RangeSeg({ value, set }: { value: string; set: (v: string) => void }) {
  const { t } = useApp();
  const L: Record<string, string> = { "7": t.r7, "30": t.r30, "90": t.r90, all: t.rAll };
  return <div className="seg" role="group" aria-label={t.range}>{RANGES.map((k) => <button type="button" key={k} aria-pressed={value === k} onClick={() => set(k)}>{L[k]}</button>)}</div>;
}

type Metric = "drones" | "pct" | "clashes" | "dirs";
export function Timeline({ sel, setSel }: { sel: DirSel; setSel: (s: DirSel) => void }) {
  const { t, lang, LATEST, D } = useApp();
  const [metric, setMetric] = useSticky<Metric>("tlMetric", "drones");
  const [range, setRange] = useSticky("tlRange", "30");
  const [table, setTable] = useSticky("tlTable", false);
  const all = TL(LATEST), order = dirOrder(all);
  const g = (v: unknown) => num(v);
  let ser: Ser<TimelineEntry>[];
  if (metric === "drones") ser = [{ name: t.sLaunched, color: "var(--s2)", get: (e) => g(e.launched), src: "air" }, { name: t.sIntercepted, color: "var(--s1)", get: (e) => g(e.intercepted), src: "air" }];
  else if (metric === "pct") ser = [{ name: t.sPct, color: "var(--s1)", pct: true, get: (e) => { const l = g(e.launched), i = g(e.intercepted); return l && i != null ? Math.round((i / l) * 1000) / 10 : null; }, src: "air" }];
  else if (metric === "clashes") ser = [{ name: t.sClashes, color: "var(--s1)", get: (e) => g(e.clashes), src: "front" }];
  else { const def = order.slice(0, 5); ser = order.filter((k) => dirOn(sel, k, def)).map((k) => ({ name: k, color: dirCol(order, k), get: (e) => (e.directions ? g(e.directions[k]) : null), src: "front" })); }
  const end = dayN(LATEST.date), start = rangeStart(all, range, end);
  const rows = all.filter((e) => { const n = dayN(e.date); return n >= start && n <= end && ser.some((s) => s.get(e) != null); });
  const dec = (v: number) => String(v).replace(".", lang === "en" ? "." : ",");
  const M: [Metric, string][] = [["drones", t.mDrones], ["pct", t.mPct], ["clashes", t.mClashes], ["dirs", t.mDirs]];
  const def = order.slice(0, 5);

  return (
    <section className="tlwrap" id="timeline">
      <div className="tl-head"><h2>{t.tl}</h2><p>{t.tlSub}</p></div>
      <div className="tl-controls">
        <div className="seg" role="group" aria-label={t.metric}>{M.map(([k, l]) => <button type="button" key={k} aria-pressed={metric === k} onClick={() => setMetric(k)}>{l}</button>)}</div>
        <RangeSeg value={range} set={setRange} />
        <span className="spacer" />
        <div className="seg"><button type="button" aria-pressed={table} onClick={() => setTable(!table)}>{t.table}</button></div>
      </div>
      <div className="panel tl-panel">
        {metric === "dirs" ? (
          <div className="tl-legend">
            {order.map((n) => <button type="button" className="dchip" key={n} aria-pressed={dirOn(sel, n, def)} onClick={() => setSel(toggle(sel, order, n))}><i style={{ background: dirCol(order, n) }} />{flags(n)}</button>)}
            <DirCtl names={order} sel={sel} setSel={setSel} />
          </div>
        ) : <Legend ser={ser} bars={metric === "drones"} />}
        <LineChart key={metric + range + D.date} rows={rows} ser={ser} start={start} end={end} table={table} aria={t.tl} bars={metric === "drones"}
          extra={metric === "drones" ? (e) => { const l = g(e.launched), i = g(e.intercepted); if (!l || i == null) return null; return [dec(Math.round((i / l) * 1000) / 10) + "%", t.sPctShort]; } : null}
          label={(e) => shortD(e.date) + (e.night && (metric === "drones" || metric === "pct") ? ` · ${t.night} ${e.night}` : "")}
          srcOf={(e, s) => (e.src && e.src[s.src]) || ""}
          fmtV={(s, v) => (v == null ? "—" : s.pct ? dec(v) + "%" : fmt(v, lang))} />
        <p className="sub" style={{ margin: 0 }}>{metric === "dirs" && ser.length ? t.dirsNote(ser.length) : ""}</p>
      </div>
    </section>
  );
}

/** "Attacks by direction" panel: today's counts vs the previous issue, plus a 14-day chart of the selected directions. */
export function Directions({ sel, setSel }: { sel: DirSel; setSel: (s: DirSel) => void }) {
  const { t, lang, D, LATEST } = useApp();
  const F = D.front || {};
  const all = TL(LATEST), order = dirOrder(all);
  const dirs = (F.directions || []).slice().sort((a, b) => b.attacks - a.attacks);
  const names = dirs.map((d) => d.name), def = names.slice(0, 5);
  const PV = all.filter((e) => e.date < D.date && (e.directions || e.clashes != null)).pop() || null;
  const pvD = PV ? shortD(PV.date) : "";
  const pvOf = (n: string) => (PV && PV.directions && num(PV.directions[n]) != null ? PV.directions[n] : null);
  const totX = PV && num(PV.clashes) != null && F.clashesTotal != null ? F.clashesTotal - PV.clashes! : null;

  const on = dirs.filter((d) => dirOn(sel, d.name, def));
  const ser: Ser<TimelineEntry>[] = on.map((d) => ({ name: d.name, color: dirCol(order, d.name), get: (e) => (e.directions ? num(e.directions[d.name]) : null), src: "front" }));
  const end = dayN(D.date);
  const rows = all.filter((e) => { const n = dayN(e.date); return n >= end - 13 && n <= end && ser.some((s) => s.get(e) != null); });
  const start = rows.length ? Math.min(dayN(rows[0].date), end - 1) : end - 1;

  return (
    <div>
      <section className="panel">
        <h2>{t.pClashes}</h2>
        <p className="sub">{flags(F.source || "")}{flags(F.period ? " · " + F.period : "")}</p>
        {F.clashesTotal != null && <p className="sub" style={{ margin: 0, color: "var(--ink)" }}>{t.dTot(fmt(F.clashesTotal, lang), pvD, totX)}</p>}
        <div className="dleg">
          {!dirs.length ? <span>{t.none}</span> : <>
            {dirs.map((d) => {
              const pv = pvOf(d.name), x = pv != null ? d.attacks - pv : null;
              return (
                <button type="button" className="dchip" key={d.name} aria-pressed={dirOn(sel, d.name, def)} onClick={() => setSel(toggle(sel, names, d.name))}
                  title={pv != null ? t.dTip(d.name, d.attacks, pvD, pv, x) : d.name + ": " + d.attacks + (PV ? " · " + t.dMiss : "")}>
                  <i style={{ background: dirCol(order, d.name) }} />{flags(d.name)} <b>{fmt(d.attacks, lang)}</b>{" "}
                  <span className={"dl " + (x! > 0 ? "up" : x! < 0 ? "down" : "")}>{x == null ? (PV ? t.dNew : "") : (x > 0 ? "+" : x < 0 ? "−" : "±") + fmt(Math.abs(x), lang)}</span>
                </button>
              );
            })}
            <DirCtl names={names} sel={sel} setSel={setSel} />
          </>}
        </div>
        {!dirs.length ? <div className="tl-plot" /> : !on.length ? <div className="tl-plot"><p className="tl-empty">{t.dOff}</p></div> : (
          <LineChart key={D.date} rows={rows} ser={ser} start={start} end={end} aria={t.pClashes} label={(e) => shortD(e.date)}
            srcOf={(e) => (e.src && e.src.front) || ""} fmtV={(s, v) => (v == null ? "—" : fmt(v, lang))} />
        )}
        <p className="sub" style={{ margin: 0 }}>{t.dTopNote}</p>
      </section>
    </div>
  );
}
