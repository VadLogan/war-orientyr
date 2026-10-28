"use client";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Delaunay, geoConicConformal, geoPath, select, zoom, zoomIdentity, type GeoPermissibleObjects, type GeoProjection, type ZoomBehavior, type ZoomTransform } from "d3";
import type { UIStrings } from "@/lib/ui";
import { dayN, fmt, houseStyle as hsBase } from "@/lib/text";
import { distLabel, kmBetween, type Strike, type StrikesBase, type StrikesData } from "@/lib/strikes";
import { useApp } from "../ctx";
import { LOCK } from "../digest/Item";
import { useElWidth, useJson, useSticky } from "./hooks";
import type { MapsData } from "./Panels";
import { DIRS, dirOf, areaTiles, Cities, countV, fitFront, lastDay, Layers, makeGeo, Mark, MarkIco, mp, PAIR_SRC, Sw, SRC_COL, Tiles, VerdictBar, VG, vgOf, type Ev, type Geo, type Rings } from "./mapParts";
import { flags } from "@/components/Flag";


/* ---------- shared: d3-zoom on an SVG, transform kept in (sticky) React state ---------- */
function useZoom(key: string, ready: boolean, ext: [number, number], tExt: [[number, number], [number, number]]) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zb = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [t, setT] = useSticky<ZoomTransform>(key, zoomIdentity);
  const tx = JSON.stringify(tExt);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const z = zoom<SVGSVGElement, unknown>().scaleExtent(ext).translateExtent(tExt).on("zoom", (ev) => setT(ev.transform));
    zb.current = z;
    select(svg).call(z).call(z.transform, t);
    return () => { select(svg).on(".zoom", null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, ready]);
  const sel = () => select(svgRef.current!);
  return {
    svgRef, t,
    by: (k: number, ms = 250) => sel().transition().duration(ms).call(zb.current!.scaleBy, k),
    to: (tr: ZoomTransform, ms = 300) => (ms ? sel().transition().duration(ms).call(zb.current!.transform, tr) : sel().call(zb.current!.transform, tr)),
    pan: (x: number, y: number) => sel().call(zb.current!.translateBy, x, y),
    scale: (k: number) => sel().call(zb.current!.scaleBy, k),
  };
}
function ZoomButtons({ z }: { z: ReturnType<typeof useZoom> }) {
  const { t } = useApp();
  return (
    <div className="map-zoom">
      <button type="button" aria-label={t.mZoomIn} title={t.mZoomIn} onClick={() => z.by(1.6)}>+</button>
      <button type="button" aria-label={t.mZoomOut} title={t.mZoomOut} onClick={() => z.by(1 / 1.6)}>−</button>
      <button type="button" aria-label={t.mReset} title={t.mReset} onClick={() => z.to(zoomIdentity)}>⟲</button>
    </div>
  );
}
/** Tooltip inside a .map-wrap: placed at the pointer, flipped to stay inside the map. */
type Tip = { x: number; y: number; body: ReactNode } | null;
function MapTip({ tip, wrap }: { tip: Tip; wrap: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current, w = wrap.current;
    if (!el || !w || !tip) return;
    const r = w.getBoundingClientRect(), tw = el.offsetWidth, th = el.offsetHeight;
    let l = tip.x - r.left + 12, tp = tip.y - r.top + 12;
    if (l + tw > r.width) l = tip.x - r.left - tw - 12;
    if (tp + th > r.height) tp = tip.y - r.top - th - 12;
    el.style.left = Math.max(4, l) + "px";
    el.style.top = Math.max(4, tp) + "px";
  });
  return tip ? <div className="map-tip" ref={ref}>{tip.body}</div> : null;
}
const tipHandlers = (setTip: (t: Tip) => void, body: () => ReactNode) => ({
  tabIndex: 0,
  onPointerEnter: (ev: React.PointerEvent) => setTip({ x: ev.clientX, y: ev.clientY, body: body() }),
  onPointerMove: (ev: React.PointerEvent) => setTip({ x: ev.clientX, y: ev.clientY, body: body() }),
  onPointerLeave: () => setTip(null),
  onFocus: (ev: React.FocusEvent) => { const b = (ev.target as Element).getBoundingClientRect(); setTip({ x: b.right, y: b.bottom, body: body() }); },
  onBlur: () => setTip(null),
});

/* ---------- Maps: how DeepState / ISW / DIVGEN draw the front ---------- */
const ALL_V: Record<VG, boolean> = { occ: true, grey: true, edge: true, ua: true, far: true, out: true };
const PERS = [7, 14, 30];
function useMapGeo(M: MapsData | null, W: number, H: number): Geo | null {
  return useMemo(() => (M ? makeGeo(M, W, H) : null), [M, W, H]);
}


export function MapsCompare() {
  const { t, lang, MAPS, D } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  const [mode, setMode] = useSticky("mapMode", "cmp");
  const [sect, setSect] = useSticky("mapSect", true);
  // General Staff: russian attacks per direction in the issue's day (names come translated on English pages)
  const gsBy = new Map((D.front?.directions || []).map((x) => [x.name, x.attacks]));
  const gsOf = (d: (typeof DIRS)[number]) => gsBy.get(d.uk) ?? gsBy.get(d.en);
  const [pair, setPair] = useSticky("mapPair", "dg_ds");
  const [ev, setEv] = useSticky("mapEv", true);
  const [per, setPer] = useSticky("mapPer", 30);
  const [vf, setVf] = useSticky("mapVf", ALL_V);
  const [ref, setRef] = useSticky<"ds" | "isw">("mapRef", "ds");
  const [dir, setDir] = useSticky<string | null>("mapDir", null);
  const [off, setOff] = useSticky("mapOff", 0); // claims window: days back from the snapshot's newest claim
  const [hl, setHl] = useState<string | number | null>(null);
  const [sel, setSel] = useState<Ev | null>(null); // claim picked in the list or on the map: ring + card stay until closed
  const [tip, setTip] = useState<Tip>(null);
  // snapshot shown: starts at the page date's one, then steps through the archive here, without leaving the page
  const pageSnap = MAPS.match(/(\d{4}-\d{2}-\d{2})\.json$/)?.[1] ?? null;
  const [snap, setSnap] = useState(pageSnap);
  useEffect(() => setSnap(pageSnap), [pageSnap]);
  const arch = useJson<{ dates: string[] }>(pageSnap ? "/maps/archive/index.json" : null);
  const snaps = (arch.data?.dates || []).slice().sort(), si = snap ? snaps.indexOf(snap) : -1;
  const { data: M, err } = useJson<MapsData>(snap ? `/maps/archive/${snap}.json` : MAPS);
  const wrapRef = useRef<HTMLDivElement>(null);
  const w = useElWidth(wrapRef);
  const W = Math.max(300, w || 800), H = Math.round(Math.min(640, Math.max(340, W * 0.66)));
  const z = useZoom("mapZ", !!M, [1, 40], [[-W * 0.2, -H * 0.2], [W * 1.2, H * 1.2]]);
  const geo = useMapGeo(M, W, H);
  const F = (n: number) => fmt(Math.round(n), lang);
  const sk = { ds: "deepstate", isw: "isw", dg: "divgen" } as const;
  const SegBtn = <T extends string | number>(k: T, l: string, cur: T, set: (v: T) => void) => <button type="button" key={k} aria-pressed={cur === k} onClick={() => set(k)}>{l}</button>;

  const last = M ? lastDay(M) : 0, first = M ? Math.min(...M.events.map((e) => dayN(e.d))) : 0;
  const maxOff = Math.max(0, last - first - per + 1), o = Math.min(off, maxOff), end = last - o;
  const inPer = M ? M.events.filter((e) => { const n = dayN(e.d); return n > end - per && n <= end; }) : [];
  const dayStr = (n: number) => dmy(new Date(n * 864e5).toISOString().slice(0, 10)).slice(0, 5);
  const pickPer = (n: number) => { setPer(n); setOff(0); };
  const pickDir = (d: string | null) => {
    setDir(d); setSel(null);
    if (!M || !geo) return;
    if (!d) { z.to(fitFront(M, geo, W, H), 400); return; }
    const pts = inPer.filter((e) => evDir.get(e) === d).map((e) => geo.proj([e.lng, e.lat])!);
    const a = DIRS.find((x) => x.id === d)!;
    pts.push(geo.proj([a.lng, a.lat])!);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs) - 30, x1 = Math.max(...xs) + 30, y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 30;
    const kk = Math.min(40, 0.85 / Math.max((x1 - x0) / W, (y1 - y0) / H));
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(kk).translate(-(x0 + x1) / 2, -(y0 + y1) / 2), 500);
  };
  const evDir = useMemo(() => new Map((M?.events || []).map((e) => [e, dirOf(e)])), [M]);
  const dirCnt: Record<string, number> = {};
  inPer.forEach((e) => { const d = evDir.get(e); if (d) dirCnt[d] = (dirCnt[d] || 0) + 1; });
  const dirShown = DIRS.filter((d) => dirCnt[d.id] || gsOf(d) != null || d.id === dir);
  const gsMax = Math.max(1, ...DIRS.map((d) => gsOf(d) ?? 0));
  const dirRank = [...dirShown].sort((a, b) => (gsOf(b) ?? -1) - (gsOf(a) ?? -1) || (dirCnt[b.id] || 0) - (dirCnt[a.id] || 0));
  // direction sectors: Voronoi cells of the anchors, shown only in a band along the DeepState line (SVG mask)
  const cells = useMemo(() => {
    if (!geo) return null;
    const pts = DIRS.map((d) => geo.proj([d.lng, d.lat])!);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const v = Delaunay.from(pts).voronoi([Math.min(...xs) - 120, Math.min(...ys) - 120, Math.max(...xs) + 120, Math.max(...ys) + 40]);
    return DIRS.map((_, i) => v.renderCell(i));
  }, [geo]);
  const inDir = dir ? inPer.filter((e) => evDir.get(e) === dir) : inPer;
  const cnt = countV(inDir, ref);
  const shown = ev ? inDir.filter((e) => vf[vgOf(e[ref])]).sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0)) : [];
  const selOn = sel && shown.some((e) => e.id === sel.id && e.d === sel.d) ? sel : null;
  const dirty = per !== 30 || o > 0 || !!dir || VG.some((g) => !vf[g]);
  const pickV = (g: VG) => setVf(VG.every((x) => vf[x] === (x === g)) ? ALL_V : (Object.fromEntries(VG.map((x) => [x, x === g])) as Record<VG, boolean>));
  const toggleV = (g: VG) => setVf({ ...vf, [g]: !vf[g] });

  let legend: ReactNode[] = [], srcLine: ReactNode = null, method = "";
  if (M) {
    const S = M.sources;
    srcLine = <>{t.mSnap}{" "}{(["ds", "isw", "dg"] as const).map((k, i) => { const s = S[sk[k]]; return <Fragment key={k}>{i > 0 && "; "}<a href={s.url} target="_blank" rel="noopener">{t.src[k]}</a> — {s.asOfLabel} ({flags(t.srcKind[k])})</Fragment>; })}. {t.kmCrimea(F(M.areas.crimea))}</>;
    method = hs(M.method || "") + " " + (["deepstate", "isw", "divgen"] as const).map((k) => hs(S[k].note)).join(" ");
    if (mode === "ds") legend.push(<Sw key="a" c="--m-occ" l={t.lg.ds} />, <Sw key="b" c="--m-grey" l={t.lg.dsGrey} />);
    else if (mode === "isw") legend.push(<Sw key="a" c="--m-isw" l={t.lg.isw} />, <Sw key="b" c="--m-iswadv" l={t.lg.iswAdv} />);
    else if (mode === "dg") legend.push(<Sw key="a" c="--m-dg" l={t.lg.dg} />);
    else {
      const [a, b] = PAIR_SRC[pair];
      legend.push(<Sw key="a" c={SRC_COL[a]} l={t.lg[a as "ds"]} cls="line" />, <Sw key="b" c={SRC_COL[b]} l={t.lg[b as "ds"]} cls="line" />, <Sw key="c" c="--m-onlydg" l={t.lg.onlyA(t.src[a as "ds"])} />);
      if (pair === "dg_ds") legend.push(<Sw key="d" c="--m-onlydgg" l={t.lg.onlyGrey} />);
      legend.push(<Sw key="e" c="--m-onlyds" l={t.lg.onlyB(t.src[b as "ds"])} />);
    }
  }
  const onKey = (e: KeyboardEvent) => {
    const st = 60 / z.t.k;
    if (e.key === "+" || e.key === "=") z.scale(1.4); else if (e.key === "-") z.scale(1 / 1.4);
    else if (e.key === "ArrowLeft") z.pan(st, 0); else if (e.key === "ArrowRight") z.pan(-st, 0);
    else if (e.key === "ArrowUp") z.pan(0, st); else if (e.key === "ArrowDown") z.pan(0, -st);
    else if (e.key === "Escape" && sel) setSel(null);
    else return;
    e.preventDefault();
  };
  const focusEv = (e: Ev) => {
    if (!geo) return;
    setSel(e);
    const [x, y] = geo.proj([e.lng, e.lat])!;
    // the point lands right of centre, clear of the claim card in the top-left corner
    z.to(zoomIdentity.translate(W * 0.62, H * 0.55).scale(Math.max(z.t.k, 12)).translate(-x, -y), 500);
    wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  // first open: frame the front instead of the whole country (a zoom kept from earlier in the session stays)
  const framed = useRef(false);
  useEffect(() => {
    if (framed.current || !M || !geo) return;
    framed.current = true;
    if (z.t.k === 1 && z.t.x === 0 && z.t.y === 0) z.to(fitFront(M, geo, W, H), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [M, geo]);
  const k = z.t.k;
  const evTip = (e: Ev) => () => <>
    <div className="d">{dmy(e.d)}</div><div>{flags(hs(e.t))}</div>
    <div className="s">{"DeepState: " + t.evSt.ds[e.ds as "occ"] + " (" + t.evAsOf(M!.sources.deepstate.asOfLabel) + ")"}</div>
    <div className="s">{"ISW: " + t.evSt.isw[e.isw as "occ"] + " (" + t.evAsOf(M!.sources.isw.asOfLabel) + ")"}</div>
    <div className="s">{"DIVGEN #" + e.id}</div>
  </>;

  return (
    <section className="tlwrap mp" id="maps">
      <div className="mp-head"><h2>{t.mpH}</h2><p>{flags(t.mpLede)}</p></div>
      <div className="tiles map-tiles">{M && <Tiles items={areaTiles(M, t, F, mode, pair)} />}</div>
      <div className="mp-grid">
        <aside className="mp-rail">
          <fieldset>
            <legend>{t.mpSnapH}</legend>
            <div className="mp-step">
              <button type="button" aria-label={t.mpPrevD} title={t.mpPrevD} disabled={si <= 0} onClick={() => setSnap(snaps[si - 1])}>‹</button>
              <span><b>{snap ? dmy(snap) : "—"}</b>{M && <small>{t.mpSnapSrc(M.sources.deepstate.asOfLabel)}</small>}</span>
              <button type="button" aria-label={t.mpNextD} title={t.mpNextD} disabled={si < 0 || si >= snaps.length - 1} onClick={() => setSnap(snaps[si + 1])}>›</button>
            </div>
            {snap !== pageSnap && pageSnap && <button type="button" className="linkbtn" onClick={() => setSnap(pageSnap)}>{t.mpSnapBack(dmy(pageSnap))}</button>}
          </fieldset>
          <fieldset>
            <legend>{t.mpView}</legend>
            <div className="seg mp-seg4" role="group" aria-label={t.mpView}>{SegBtn("ds", t.src.ds, mode, setMode)}{SegBtn("isw", "ISW", mode, setMode)}{SegBtn("dg", "DIVGEN", mode, setMode)}{SegBtn("cmp", t.mCmp, mode, setMode)}</div>
            {mode === "cmp" && <label className="mp-field">{t.mpPair}
              <select value={pair} onChange={(e) => setPair(e.target.value)}>{(["dg_ds", "dg_isw", "isw_ds"] as const).map((p) => <option key={p} value={p}>{t.pairs[p]}</option>)}</select>
            </label>}
          </fieldset>
          <fieldset>
            <legend><label className="mp-chk"><input type="checkbox" checked={ev} onChange={() => setEv(!ev)} />{t.mpClaims}</label></legend>
            <div className="mp-sub">{t.mpPer}</div>
            <div className="seg" role="group" aria-label={t.mpPer}>{PERS.map((n) => SegBtn(n, t.mpDays(n), per, pickPer))}</div>
            {M && <>
              <div className="mp-sub">{t.mpWin}</div>
              <div className="mp-step">
                <button type="button" aria-label={t.mpEarlier} title={t.mpEarlier} disabled={o >= maxOff} onClick={() => setOff(Math.min(maxOff, o + per))}>‹</button>
                <span><b>{dayStr(end - per + 1)} – {dayStr(end)}</b></span>
                <button type="button" aria-label={t.mpLater} title={t.mpLater} disabled={o <= 0} onClick={() => setOff(Math.max(0, o - per))}>›</button>
              </div>
              {o > 0 && <button type="button" className="linkbtn" onClick={() => setOff(0)}>{t.mpNewest}</button>}
            </>}
            <div className="mp-sub">{t.mpDir}</div>
            <label className="mp-chk"><input type="checkbox" checked={sect} onChange={() => setSect(!sect)} /><span>{t.mpSect}</span></label>
            <div className="mp-dirs" role="group" aria-label={t.mpDir}>
              <button type="button" aria-pressed={!dir} onClick={() => pickDir(null)}>{t.mpAllDir}</button>
            </div>
            <div className="mp-dirlist" role="group" aria-label={t.mpDir}>
              <div className="mp-dirlist-h"><span>{t.mpDirAtt}</span><span>{t.mpDirCl}</span></div>
              {dirRank.map((d) => { const g = gsOf(d), l = lang === "en" ? d.en : d.uk; return (
                <button type="button" key={d.id} aria-pressed={dir === d.id} onClick={() => pickDir(dir === d.id ? null : d.id)}
                  aria-label={`${l}: ${g != null ? t.mpGs(g, "") : t.mpGsNone}; ${t.mpDirClaims(dirCnt[d.id] || 0)}`}>
                  <span className="nm">{l}</span>
                  <span className="bar" aria-hidden="true"><i style={{ width: g ? Math.max(3, (g / gsMax) * 100) + "%" : 0 }} /></span>
                  <span className="at">{g ?? "—"}</span>
                  <span className="cl">{dirCnt[d.id] || 0}</span>
                </button>
              ); })}
            </div>
            {dir && (() => { const d = DIRS.find((x) => x.id === dir)!, g = gsOf(d); return (
              <div className="mp-dsum"><b>{lang === "en" ? d.en : d.uk}</b><span>{g != null ? t.mpGs(g, D.front?.period) : t.mpGsNone}</span><span>{t.mpDirClaims(dirCnt[dir] || 0)}</span></div>
            ); })()}
            {sect && <p className="mp-note">{t.mpSectNote}</p>}
            <div className="mp-sub">{t.mpRef}</div>
            <div className="seg" role="group" aria-label={t.mpRef}>{SegBtn("ds", "DeepState", ref, setRef)}{SegBtn("isw", "ISW", ref, setRef)}</div>
            <div className="mp-sub">{t.mpVerd}</div>
            <div className="mp-verd">{VG.map((g) => (
              <label key={g} className="mp-chk"><input type="checkbox" checked={vf[g]} disabled={!ev} onChange={() => toggleV(g)} /><MarkIco g={g} /><span>{t.evLg[g]}</span><span className="n">{cnt[g]}</span></label>
            ))}</div>
            {dirty && <button type="button" className="linkbtn" onClick={() => { setPer(30); setOff(0); setVf(ALL_V); pickDir(null); }}>{t.mpReset}</button>}
          </fieldset>
        </aside>
        <div className="mp-main">
          <div className="mp-bar-top">
            <div className="map-legend">{legend}</div>
            {M && ev && <span className="map-src">{t.mpShown(shown.length, inPer.length)}</span>}
          </div>
          <div className="map-wrap" ref={wrapRef}>
            {err ? <p className="map-src" style={{ padding: 16 }}>{t.mErr}</p> : !M || !geo ? <p className="map-src" style={{ padding: 16 }}>{t.mLoading}</p> : <>
              <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.map} ref={z.svgRef} onKeyDown={onKey}>
                <g transform={z.t.toString()}>
                  <Layers M={M} geo={geo} mode={mode} pair={pair} />
                  {sect && cells && M.layers.ds_occ && <>
                    <mask id="mp-band" maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
                      <path d={geo.d(M.layers.ds_occ)} fill="none" stroke="#fff" strokeWidth={26} strokeLinejoin="round" />
                      {/* the occupied outline also runs along the state border and the coast: cut those out, keep the front */}
                      <path d={geo.d(M.base.find((bb) => bb.ua)?.c)} fill="none" stroke="#000" strokeWidth={30} strokeLinejoin="round" />
                    </mask>
                    <g className="mp-sect" mask="url(#mp-band)">{cells.map((c, i) => (
                      <path key={DIRS[i].id} d={c} className={dir === DIRS[i].id ? "on" : undefined} style={{ fillOpacity: dir === DIRS[i].id ? 0.5 : 0.06 + 0.6 * ((gsOf(DIRS[i]) ?? 0) / gsMax) }} />
                    ))}</g>
                  </>}
                  <Cities M={M} geo={geo} k={k} />
                  {(ev || sect) && <g className="mp-dlab">{dirShown.map((d, i) => {
                    // labels east of the front, alternately above and below the anchor, so neighbours don't overlap
                    const [x, y] = geo.proj([d.lng, d.lat])!, on = dir === d.id, l = lang === "en" ? d.en : d.uk, dy = i % 2 ? 16 : -16, g = gsOf(d), lw = l.length * 5.9 + 14 + (g != null ? String(g).length * 7 + 8 : 0);
                    return (
                      <g key={d.id} transform={`translate(${x},${y}) scale(${1 / k})`} className={on ? "on" : undefined} onClick={() => pickDir(on ? null : d.id)} role="button" tabIndex={0} aria-pressed={on} aria-label={`${t.mpDir}: ${l}`}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickDir(on ? null : d.id); } }}>
                        <line x1={0} y1={0} x2={22} y2={dy} />
                        {on && <rect className="halo" x={19} y={dy - 13} width={lw + 6} height={26} rx={4} />}
                        <rect x={22} y={dy - 10} width={lw} height={20} rx={2} />
                        <text x={29} y={dy + 4}>{l}{g != null && <tspan className="n" dx={6}>{g}</tspan>}</text>
                      </g>
                    );
                  })}</g>}
                  <g className="evs">{[...shown].sort((a, b) => +(a === selOn || a.id === hl) - +(b === selOn || b.id === hl)).map((e) => {
                    const [x, y] = geo.proj([e.lng, e.lat])!;
                    return <g key={e.id + "" + e.d} transform={`translate(${x},${y}) scale(${1 / k})`} style={{ cursor: "pointer" }} onClick={() => setSel(e)} {...tipHandlers(setTip, evTip(e))}><Mark g={vgOf(e[ref])} hl={e === selOn || e.id === hl} /></g>;
                  })}</g>
                  {selOn && (() => { const [x, y] = geo.proj([selOn.lng, selOn.lat])!; return (
                    <g className="mp-focus" transform={`translate(${x},${y}) scale(${1 / k})`} aria-hidden="true">
                      <circle className="pulse" r={12} />
                      <circle r={17} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
                      <path d="M-30,0H-21M21,0H30M0,-30V-21M0,21V30" stroke="var(--accent)" strokeWidth={2.5} />
                    </g>
                  ); })()}
                </g>
              </svg>
              <div className="map-zoom">
                <button type="button" aria-label={t.mZoomIn} title={t.mZoomIn} onClick={() => z.by(1.6)}>+</button>
                <button type="button" aria-label={t.mZoomOut} title={t.mZoomOut} onClick={() => z.by(1 / 1.6)}>−</button>
                <button type="button" aria-label={t.mFront} title={t.mFront} onClick={() => z.to(fitFront(M, geo, W, H), 400)}>◎</button>
                <button type="button" aria-label={t.mReset} title={t.mReset} onClick={() => z.to(zoomIdentity)}>⟲</button>
              </div>
              {selOn && <div className="mp-sel" role="status">
                <button type="button" aria-label={t.art.close} title={t.art.close} onClick={() => setSel(null)}>×</button>
                <div className="d">{dmy(selOn.d)} · DIVGEN #{selOn.id}</div>
                <div className="tx">{flags(hs(selOn.t))}</div>
                <div className="v"><MarkIco g={vgOf(selOn.ds)} /> DeepState: {t.evSt.ds[selOn.ds as "occ"]}</div>
                <div className="v"><MarkIco g={vgOf(selOn.isw)} /> ISW: {t.evSt.isw[selOn.isw as "occ"]}</div>
              </div>}
              <MapTip tip={tip} wrap={wrapRef} />
            </>}
          </div>
          {M && ev && <VerdictBar t={t} head={t.mpBar(inPer.length, per, t.src[ref])} cnt={cnt} on={vf} pick={pickV} />}
          {M && ev && <div className="mp-list">
            <div className="mp-list-h"><b>{t.mpList}</b></div>
            {shown.length ? <div className="mp-list-sc"><table>
              <thead><tr><th>{t.mpDate}</th><th>{t.mpClaim}</th><th>DeepState</th><th>ISW</th></tr></thead>
              <tbody>{shown.map((e) => (
                <tr key={e.id + "" + e.d} className={e === selOn ? "sel" : e.id === hl ? "hl" : undefined} onPointerEnter={() => setHl(e.id)} onPointerLeave={() => setHl(null)}>
                  <td className="d">{dmy(e.d).slice(0, 5)}</td>
                  <td><button type="button" className="linkbtn" onFocus={() => setHl(e.id)} onBlur={() => setHl(null)} aria-current={e === selOn || undefined} onClick={() => focusEv(e)}>{flags(hs(e.t))}</button></td>
                  <td><MarkIco g={vgOf(e.ds)} /> {t.evSt.ds[e.ds as "occ"]}</td>
                  <td><MarkIco g={vgOf(e.isw)} /> {t.evSt.isw[e.isw as "occ"]}</td>
                </tr>
              ))}</tbody>
            </table></div> : <p className="map-src" style={{ padding: "12px 16px" }}>{t.mpNone}</p>}
          </div>}
          <p className="map-src">{srcLine}</p>
          <details className="method"><summary>{t.mMethod}</summary><p>{flags(method)}</p></details>
        </div>
      </div>
    </section>
  );
}

/* ---------- Strikes on russia: strikes.json + maps/strikes-base.json; occupied overlay from maps.json ---------- */
const STK_GRP: Record<string, string> = { oil: "oil", gas: "oil", port: "oil", military: "mil", airfield: "mil", navy: "mil", "defence-industry": "mil", logistics: "log", energy: "en", other: "log" };
const STK_COL: Record<string, string> = { oil: "--c2", mil: "--c1", log: "--c3", en: "--c4" };
const TG_COL: Record<string, string> = { fuel: "--c2", en: "--c4", air: "--c5", mil: "--c1", dc: "--c3" };
const TG_MATCH: Record<string, string[]> = { fuel: ["oil"], en: ["en"], air: ["mil"], mil: ["mil"], dc: ["mil", "en", "log"] };
const STK_RECENT = 5;
type Target = { cat: string; name: string; sub: string; lat: number; lng: number; approx?: boolean; src: string };
const grpOf = (x: Strike) => STK_GRP[x.kind] || "log";
const dmy = (d: string) => d.split("-").reverse().join(".");

export function StrikesMap() {
  const { t: TT, lang, D, goItem } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  const sd = useJson<StrikesData>("/strikes.json"), sb = useJson<StrikesBase>("/maps/strikes-base.json");
  const strikes = useMemo(() => (sd.data && sb.data ? { stk: sd.data, base: sb.data } : null), [sd.data, sb.data]);
  const stkErr = sd.err || sb.err;
  const t = TT.stk, en = lang === "en";
  const [per, setPer] = useSticky("stkPer", "30");
  const [grp, setGrp] = useSticky<Record<string, boolean>>("stkGrp", { oil: true, mil: true, log: true, en: true });
  const [more, setMore] = useSticky("stkMore", 40);
  const [open, setOpen] = useSticky("stkOpen", false);
  const [tgOn, setTgOn] = useSticky("tgOn", false);
  const [tgCat, setTgCat] = useSticky<Record<string, boolean>>("tgCat", { fuel: true, en: true, air: true, mil: true, dc: true });
  const [tip, setTip] = useState<Tip>(null);
  const maps = useJson<MapsData>("/maps/maps.json");
  const tg = useJson<{ items: Target[]; note?: string }>(tgOn ? "/maps/targets.json" : null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLElement>(null);
  const w = useElWidth(wrapRef);
  const W = Math.max(300, w || 800), H = Math.round(Math.min(560, Math.max(320, W * 0.56)));
  const z = useZoom("stkZ", !!strikes, [0.4, 12], [[-W * 1.5, -H * 0.8], [W * 2.5, H * 1.6]]);

  const S = strikes;
  const end = dayN(D.date);
  const all = S ? (S.stk.items || []).filter((x) => dayN(x.date) <= end) : [];
  const years = [...new Set(all.map((x) => x.date.slice(0, 4)))].sort().reverse();
  const pers: [string, string][] = [["30", t.p30], ...years.map((y) => [y, y] as [string, string]), ["all", t.pAll]];
  const p = pers.some((x) => x[0] === per) ? per : "30";
  const inPer = (x: Strike) => (p === "all" ? true : p === "30" ? dayN(x.date) > end - 30 : x.date.startsWith(p));
  const pool = all.filter(inPer);
  const gc: Record<string, number> = { oil: 0, mil: 0, log: 0, en: 0 };
  pool.forEach((x) => gc[grpOf(x)]++);
  const items = pool.filter((x) => grp[grpOf(x)]).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const conf = items.filter((x) => x.confirmed).length, places = new Set(items.map((x) => x.object)).size;
  const numbered = items.length <= 30;
  const far = [...new Set(items.filter((x) => x.lng > 61).map((x) => hs(x.place).split(",")[0]))];
  const dl = (x: { lat: number; lng: number }) => (S ? distLabel(S.base, x, lang) : "");

  const geo = useMemo(() => {
    if (!S) return null;
    const ua = S.base.base.find((b) => b.ua)!;
    const fitF = { type: "FeatureCollection", features: [mp(ua.c)].concat(items.filter((x) => x.lng <= 61).map((x) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [x.lng, x.lat] } }) as GeoPermissibleObjects)) } as GeoPermissibleObjects;
    const proj = geoConicConformal().parallels([45, 55]).rotate([-38, 0]).fitExtent([[28, 28], [W - 64, H - 28]], fitF);
    const path = geoPath(proj);
    return { proj, d: (c?: Rings) => (c && c.length ? path(mp(c)) || "" : "") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S, W, H, items.map((x) => x.id || x.date + x.object).join()]);

  const pickPer = (k: string) => { setPer(k); setMore(40); setOpen(false); z.to(zoomIdentity, 0); };
  const pickGrp = (k: string) => { const g = { ...grp, [k]: !grp[k] }; if (!Object.values(g).some(Boolean)) g[k] = true; setGrp(g); setMore(40); };
  const pickTg = (k: string) => { const g = { ...tgCat, [k]: !tgCat[k] }; if (!Object.values(g).some(Boolean)) g[k] = true; setTgCat(g); };
  const tc: Record<string, number> = { fuel: 0, en: 0, air: 0, mil: 0, dc: 0 };
  (tg.data?.items || []).forEach((x) => tc[x.cat]++);
  const k = z.t.k;
  const Diamond = ({ r, fill, stroke }: { r: number; fill: string; stroke: string }) => (
    <svg width={2 * r} height={2 * r} viewBox={`-${r + 1} -${r + 1} ${2 * r + 2} ${2 * r + 2}`} style={{ marginRight: 6, verticalAlign: -1 }}><path d={`M0,-${r}L${r},0L0,${r}L-${r},0Z`} fill={fill} stroke={stroke} strokeWidth={stroke === "none" ? undefined : 1.6} /></svg>
  );
  const lim = open ? more : STK_RECENT, shown = items.slice(0, lim);

  return (
    <section className="tlwrap" id="strikemap" ref={secRef}>
      <div className="tl-head"><h2>{t.title}</h2><p>{t.sub}</p></div>
      <div className="tl-controls">
        <div className="seg" role="group" aria-label={t.period}>{S && pers.map(([kk, l]) => <button type="button" key={kk} aria-pressed={p === kk} onClick={() => pickPer(kk)}>{l}</button>)}</div>
        <span className="spacer" />
        <div className="seg" role="group" aria-label={t.types}>{S && ["oil", "mil", "log", "en"].map((g) => (
          <button type="button" key={g} aria-pressed={grp[g]} onClick={() => pickGrp(g)}>
            <i style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", marginRight: 6, background: `var(${STK_COL[g]})` }} />{t.g[g as "oil"]} <span style={{ opacity: 0.7 }}>{gc[g]}</span>
          </button>
        ))}</div>
      </div>
      <div className="tl-controls">
        <div className="seg"><button type="button" aria-pressed={tgOn} onClick={() => setTgOn(!tgOn)}>◆ {t.tgLbl}</button></div>
        <div className="seg" role="group" aria-label={t.tgLbl} hidden={!tgOn}>{["fuel", "en", "air", "mil", "dc"].map((c) => (
          <button type="button" key={c} aria-pressed={tgCat[c]} onClick={() => pickTg(c)}>
            <svg width="10" height="10" viewBox="-6 -6 12 12" style={{ marginRight: 6, verticalAlign: -1 }}><path d="M0,-5L5,0L0,5L-5,0Z" fill={`var(${TG_COL[c]})`} /></svg>{t.tg[c as "fuel"]} <span style={{ opacity: 0.7 }}>{tg.data ? tc[c] : ""}</span>
          </button>
        ))}</div>
      </div>
      <div className="tiles map-tiles">{S && <Tiles items={[
        [t.tTotal, fmt(items.length, lang), p === "30" ? t.p30 : p === "all" ? t.pAll : p], [t.tConf, fmt(conf, lang), t.tConfSub], [t.tObj, fmt(places, lang), t.tObjSub]]} />}</div>
      <div className="map-legend">{S && <>
        <span title={t.lgConfT}><i className="dot" style={{ background: "var(--c2)" }} />{t.lgConf}</span>
        <span><i className="dot" style={{ background: "var(--surface)", border: "2px dashed var(--c2)", width: 8, height: 8 }} />{t.lgUnconf}</span>
        {maps.data && <Sw c="--m-occ" l={t.occ} />}
        {!numbered && <span>{t.dotsNote}</span>}
        {tgOn && <>
          <span><Diamond r={6} fill="var(--surface)" stroke="var(--muted)" />{t.tgLg}</span>
          <span><Diamond r={6} fill="var(--muted)" stroke="var(--muted)" />{t.tgLgHit}</span>
          {tg.err && <span>{t.tgErr}</span>}
        </>}
        {far.length > 0 && <span>{t.far(far.join(", "))}</span>}
      </>}</div>
      <div className="map-wrap" ref={wrapRef}>
        {stkErr ? <p className="map-src" style={{ padding: 16 }}>{t.err}</p> : !S || !geo ? <p className="map-src" style={{ padding: 16 }}>{t.loading}</p> : <>
          <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.title} ref={z.svgRef}>
            <g transform={z.t.toString()}>
              {S.base.base.map((b, i) => <path key={i} d={geo.d(b.c)} fill={b.ua ? "var(--m-ua)" : "var(--m-land)"} fillOpacity={1} stroke="var(--m-border)" strokeWidth={b.ua ? 1.4 : 0.8} fillRule="evenodd" />)}
              {maps.data?.layers?.ds_occ && <path d={geo.d(maps.data.layers.ds_occ)} fill="var(--m-occ)" fillOpacity={0.3} stroke="var(--m-occ)" strokeWidth={0.6} fillRule="evenodd" />}
              {tgOn && tg.data && <g className="tgt">{tg.data.items.filter((x) => tgCat[x.cat]).map((x, i) => {
                const pp = geo.proj([x.lng, x.lat]);
                if (!pp) return null;
                const col = `var(${TG_COL[x.cat]})`;
                const hits = all.filter((s) => TG_MATCH[x.cat].includes(grpOf(s)) && s.lat != null && kmBetween(s, x) <= 10).sort((a, b) => (a.date < b.date ? 1 : -1));
                return (
                  <g key={i} className="stk tgm" transform={`translate(${pp[0]},${pp[1]}) scale(${1 / k})`} {...tipHandlers(setTip, () => <>
                    <div className="d">{flags(`◆ ${t.tg[x.cat as "fuel"]} · ${hs(x.name)}`)}</div><div>{flags(x.sub + (x.approx ? " · ≈" : ""))}</div>
                    {dl(x) && <div style={{ fontWeight: 600 }}>{"📏 " + dl(x)}</div>}
                    <div className="s">{hits.length ? t.tgHit(hits.length, dmy(hits[0].date)) : t.tgNo}</div><div className="s">{(t.tgSrc as Record<string, string>)[x.src] || x.src}</div>
                  </>)}>
                    <path d="M0,-5.5L5.5,0L0,5.5L-5.5,0Z" fill={hits.length ? col : "var(--surface)"} fillOpacity={hits.length ? 0.55 : 0.9} stroke={col} strokeWidth={1.5} />
                  </g>
                );
              })}</g>}
              <g>{items.slice().reverse().map((x) => {
                const n = items.indexOf(x), [px, py] = geo.proj([x.lng, x.lat])!, c = !!x.confirmed, col = `var(${STK_COL[grpOf(x)]})`;
                return (
                  <g key={n} className="stk" transform={`translate(${px},${py}) scale(${1 / k})`} style={{ cursor: x.item || x.url ? "pointer" : "default" }}
                    onClick={() => { if (x.item) goItem(x.issue, x.item); else if (x.url) window.open(x.url, "_blank", "noopener"); }}
                    {...tipHandlers(setTip, () => <>
                      <div className="d">{flags(`${numbered ? n + 1 + ". " : ""}${dmy(x.date)} · ${hs(x.object)}`)}</div>
                      <div>{flags(hs(x.place) + (x.approx ? " ≈" : ""))}</div>
                      {dl(x) && <div style={{ fontWeight: 600 }}>{"📏 " + dl(x)}</div>}
                      <div>{flags(hs(x.result))}</div>
                      <div className="s">{flags(c ? t.confBy(x.confirmed!.by, x.confirmed!.when) : t.unconf)}</div>
                      {x.local && <div className="s">{(TT.loc as Record<string, string>)[x.local] || x.local}</div>}
                    </>)}>
                    {numbered ? <>
                      <circle r={10} fill={c ? col : "var(--surface)"} stroke={c ? "var(--surface)" : col} strokeWidth={2} strokeDasharray={c ? undefined : "3 2"} />
                      <text className={c ? "" : "u"} textAnchor="middle" dy="0.35em" style={{ fill: c ? "#fff" : col }}>{n + 1}</text>
                    </> : <circle r={5} fill={c ? col : "var(--surface)"} fillOpacity={0.85} stroke={c ? "var(--surface)" : col} strokeWidth={1.2} />}
                  </g>
                );
              })}</g>
            </g>
          </svg>
          <ZoomButtons z={z} />
          <MapTip tip={tip} wrap={wrapRef} />
        </>}
      </div>
      <ol className="stk-list">
        {!S ? null : shown.length ? shown.map((x, n) => {
          const c = !!x.confirmed, col = STK_COL[grpOf(x)], d = dl(x);
          return (
            <li key={n}>
              <span className={"stk-n" + (c ? "" : " u")} style={c ? { background: `var(${col})` } : { color: `var(${col})`, borderColor: `var(${col})` }}>{numbered ? n + 1 : ""}</span>
              <div>
                <span><b>{dmy(x.date).slice(0, 5)}</b>{x.date.slice(0, 4) !== D.date.slice(0, 4) && <b>.{x.date.slice(0, 4)}</b>}{x.night && <> <span style={{ color: "var(--muted)" }}>({t.night} {x.night})</span></>} · <b>{flags(hs(x.object))}</b>, {flags(hs(x.place))}{x.approx ? " ≈" : ""}</span>
                <span>{flags(hs(x.result))}</span>
                <span className="stk-meta">
                  {d && <span title={t.distNote(S.base.ctrlAsOf || "")}>📏 {d}</span>}
                  <span className={"chip " + (c ? "ok" : "unv")}>{c ? t.conf : t.unconf}</span>
                  {c && <span>{flags(t.confBy(x.confirmed!.by, x.confirmed!.when))}</span>}
                  {x.local && <span className={"chip " + (LOCK[x.local] || "ru")}>{(TT.loc as Record<string, string>)[x.local] || x.local}</span>}
                  {x.item && <a href="#" onClick={(e) => { e.preventDefault(); goItem(x.issue || "", x.item!); }}>{t.toFeed}</a>}
                  {x.url && <a href={x.url} target="_blank" rel="noopener">{t.src}</a>}
                </span>
              </div>
            </li>
          );
        }) : <li><span /><div>{t.none}</div></li>}
        {S && items.length > STK_RECENT && (
          <li><span /><div style={{ flexDirection: "row", flexWrap: "wrap", gap: "6px 16px", alignItems: "baseline" }}>
            {!open && <span style={{ color: "var(--muted)" }}>{t.recent(shown.length, items.length)}</span>}
            {open && items.length > shown.length && <button type="button" className="linkbtn" onClick={() => setMore(more + 60)}>{t.more(items.length - shown.length)}</button>}
            <button type="button" className="linkbtn" aria-expanded={open} onClick={() => { setOpen(!open); setMore(40); if (open) secRef.current?.scrollIntoView({ block: "start" }); }}>{open ? t.collapse : t.showAll(items.length)}</button>
          </div></li>
        )}
      </ol>
      <details className="method"><summary>{t.about}</summary>
        <p className="map-src">{flags(S ? t.distNote(S.base.ctrlAsOf || "") + " " + (S.stk.coverage ? (en ? S.stk.coverage.en : S.stk.coverage.uk) + " " : "") + (items.some((x) => x.approx) && !S.stk.coverage ? t.approx + "." : "") + (tgOn && tg.data && tg.data.note ? " ◆ " + tg.data.note : "") : "")}</p>
      </details>
    </section>
  );
}
