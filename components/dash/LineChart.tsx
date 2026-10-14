"use client";
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { dayN, fmt, nDay, niceMax, shortD } from "@/lib/text";
import { useApp } from "../ctx";
import { useElWidth } from "./hooks";

export type Ser<R> = { name: string; color: string; get: (e: R) => number | null; src: string; pct?: boolean };
type Props<R extends { date: string }> = {
  rows: R[]; ser: Ser<R>[]; start: number; end: number; aria: string;
  table?: boolean; bars?: boolean;
  label: (e: R) => string;
  srcOf: (e: R, s: Ser<R>) => string;
  fmtV: (s: Ser<R>, v: number | null) => string;
  extra?: ((e: R) => [string, string] | null) | null;
};

export function Legend<R>({ ser, bars }: { ser: Ser<R>[]; bars?: boolean }) {
  return <div className={"tl-legend" + (bars ? " bars" : "")}>{ser.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}</div>;
}

/** Timeline-style chart: one bar group or point per day, hover/keyboard readout, click opens that day's issue. */
export default function LineChart<R extends { date: string }>(c: Props<R>) {
  const { t, lang, D, LATEST, DATES, selectDate } = useApp();
  const plotRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const w = useElWidth(plotRef);
  const { rows, ser, start, end, bars } = c;

  const W = Math.max(280, w || 600), H = W < 520 ? 220 : 260, m = { l: 44, r: 14, t: 14, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
  const span = Math.max(1, end - start), bw = iw / (end - start + 1);
  const x = bars ? (n: number) => m.l + (n - start + 0.5) * bw : (n: number) => m.l + (end === start ? iw / 2 : ((n - start) / span) * iw);
  let vmax = 0;
  rows.forEach((e) => ser.forEach((s) => { const v = s.get(e); if (v != null && v > vmax) vmax = v; }));
  const pct = ser[0] && ser[0].pct;
  const ymax = pct ? 100 : niceMax(vmax * 1.08);
  const gw = Math.max(2, bw * (bw > 14 ? 0.78 : 0.9)), sw = Math.max(1, gw / ser.length - (ser.length > 1 && gw / ser.length > 4 ? 1 : 0));
  const y = (v: number) => m.t + ih - (v / ymax) * ih;
  const canOpen = (e: R) => DATES.includes(e.date) && e.date !== D.date;
  const cur = focus != null ? rows[focus] : undefined;

  useLayoutEffect(() => {
    const tip = tipRef.current, svg = svgRef.current, plot = plotRef.current;
    if (!tip || !svg || !plot || !cur) return;
    const px = x(dayN(cur.date)), scale = svg.getBoundingClientRect().width / W, tw = tip.offsetWidth;
    let left = px * scale + 12;
    if (left + tw > plot.clientWidth) left = px * scale - tw - 12;
    tip.style.left = Math.max(0, left) + "px";
    tip.style.top = m.t * scale + "px";
  });

  if (c.table) {
    if (!rows.length) return <div className="tl-plot" ref={plotRef}><p className="tl-empty">{t.few}</p></div>;
    return (
      <div className="tl-plot" ref={plotRef}>
        <div className="tl-table"><table>
          <thead><tr><th>{t.colDate}</th>{ser.map((s) => <th className="n" key={s.name}>{s.name}</th>)}<th>{t.srcL}</th></tr></thead>
          <tbody>{rows.slice().reverse().map((e) => (
            <tr key={e.date}><td>{c.label(e)}</td>{ser.map((s) => <td className="n" key={s.name}>{c.fmtV(s, s.get(e))}</td>)}
              <td className="src">{[...new Set(ser.map((s) => c.srcOf(e, s)).filter(Boolean))].join("; ")}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
    );
  }

  const ticks: { n: number; anchor: "start" | "middle" | "end" }[] = [];
  const maxT = W < 520 ? 4 : 7, stp = Math.max(1, Math.ceil(span / (maxT - 1)));
  for (let n = end; n >= start; n -= stp)
    ticks.push({ n, anchor: end === start ? "middle" : n === end ? "end" : n - stp < start && x(n) - m.l < 24 ? "start" : "middle" });

  const marks: React.ReactNode[] = [], dots: React.ReactNode[] = [];
  const showDots = rows.length <= 60 && !bars;
  if (bars)
    ser.forEach((s, si) => rows.forEach((e) => {
      const v = s.get(e);
      if (v == null) return;
      const x0 = x(dayN(e.date)) - gw / 2 + si * (gw / ser.length), h = Math.max(v > 0 ? 1 : 0, ih - (y(v) - m.t));
      marks.push(<rect key={si + e.date} x={x0.toFixed(1)} y={(m.t + ih - h).toFixed(1)} width={sw.toFixed(1)} height={h.toFixed(1)} rx={sw > 6 ? 2 : 0} fill={s.color} />);
    }));
  else
    ser.forEach((s) => {
      let d = "", prev: number | null = null;
      rows.forEach((e) => {
        const v = s.get(e), n = dayN(e.date);
        if (v == null) { prev = null; return; }
        d += (prev != null && n - prev === 1 ? "L" : "M") + x(n).toFixed(1) + " " + y(v).toFixed(1);
        prev = n;
        if (showDots) dots.push(<circle key={s.name + e.date} cx={x(n)} cy={y(v)} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />);
      });
      if (d) marks.push(<path key={s.name} d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />);
    });

  const sn = dayN(D.date);
  const sx = x(sn);
  const selMark = D.date === LATEST.date || sn < start || sn > end ? null : (
    <><line className="sel" x1={sx} x2={sx} y1={m.t} y2={m.t + ih} />
      <text className="sel-l" x={sx > W - 130 ? sx - 4 : sx + 4} textAnchor={sx > W - 130 ? "end" : "start"} y={m.t + 10}>{t.selected}</text></>
  );

  const nearest = (clientX: number) => {
    const r = svgRef.current!.getBoundingClientRect(), px = ((clientX - r.left) / r.width) * W;
    let bi: number | null = null, bd = 1e9;
    rows.forEach((e, i) => { const d = Math.abs(x(dayN(e.date)) - px); if (d < bd) { bd = d; bi = i; } });
    return bi;
  };
  const onKey = (ev: KeyboardEvent) => {
    if (!rows.length) return;
    let i = focus == null ? rows.length - 1 : focus;
    if (ev.key === "ArrowLeft") i = Math.max(0, i - 1);
    else if (ev.key === "ArrowRight") i = Math.min(rows.length - 1, i + 1);
    else if (ev.key === "Home") i = 0;
    else if (ev.key === "End") i = rows.length - 1;
    else if (ev.key === "Escape") { setFocus(null); return; }
    else if (ev.key === "Enter") { const e = rows[i]; if (e && canOpen(e)) selectDate(e.date); return; }
    else return;
    ev.preventDefault();
    setFocus(i);
  };
  const px = cur ? x(dayN(cur.date)) : 0;
  const src = cur ? [...new Set(ser.map((s) => c.srcOf(cur, s)).filter(Boolean))].join("; ") : "";
  const xv = cur && c.extra ? c.extra(cur) : null;

  return (
    <div className="tl-plot" ref={plotRef}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} tabIndex={0} role="img" aria-label={c.aria || t.tl}
        style={{ cursor: cur && canOpen(cur) ? "pointer" : "default" }}
        onPointerMove={(ev: PointerEvent) => setFocus(nearest(ev.clientX))}
        onPointerDown={(ev: PointerEvent) => setFocus(nearest(ev.clientX))}
        onPointerLeave={(ev: PointerEvent) => { if (ev.pointerType === "mouse") setFocus(null); }}
        onClick={(ev) => { const i = nearest(ev.clientX), e = i != null ? rows[i] : null; if (e && canOpen(e)) selectDate(e.date); }}
        onFocus={() => setFocus(rows.length ? rows.length - 1 : null)}
        onBlur={() => setFocus(null)}
        onKeyDown={onKey}>
        <g className="grid">{[0, 1, 2, 3, 4].map((k) => { const v = (ymax * k) / 4; return <line key={k} x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} />; })}</g>
        <g className="axis">
          {[0, 1, 2, 3, 4].map((k) => { const v = (ymax * k) / 4; return <text key={k} x={m.l - 8} y={y(v) + 4} textAnchor="end">{fmt(Math.round(v), lang)}{pct ? "%" : ""}</text>; })}
          {ticks.map(({ n, anchor }) => <text key={"x" + n} x={x(n)} y={H - 6} textAnchor={anchor}>{shortD(nDay(n))}</text>)}
        </g>
        {bars && <rect className="xb" y={m.t} height={ih} width={bw} x={px - bw / 2} fill="var(--ink)" fillOpacity=".07" visibility={cur ? "visible" : "hidden"} />}
        <line className="xh" x1={px} x2={px} y1={m.t} y2={m.t + ih} visibility={cur ? "visible" : "hidden"} strokeOpacity={bars ? 0 : undefined} />
        {selMark}
        {marks}
        <g>{dots}</g>
        <g className="hi">{cur && !bars && ser.map((s) => { const v = s.get(cur); return v == null ? null : <circle key={s.name} cx={px} cy={y(v)} r={6} fill={s.color} stroke="var(--surface)" strokeWidth={2} />; })}</g>
        <rect x={m.l} y={m.t} width={iw} height={ih} fill="transparent" />
      </svg>
      {rows.length < 2 && <p className="tl-empty" style={{ marginTop: 8 }}>{t.few}</p>}
      {cur && (
        <div className={"ctip" + (bars ? " bars" : "")} ref={tipRef}>
          <div className="d">{c.label(cur)}</div>
          {ser.map((s) => <div className="r" key={s.name}><i style={{ background: s.color }} /><b>{c.fmtV(s, s.get(cur))}</b><span>{s.name}</span></div>)}
          {xv && <div className="r x"><b>{xv[0]}</b><span>{xv[1]}</span></div>}
          {src && <div className="s">{src}</div>}
          {canOpen(cur) && <div className="s" style={{ color: "var(--accent)" }}>{t.openIssue}</div>}
        </div>
      )}
    </div>
  );
}
