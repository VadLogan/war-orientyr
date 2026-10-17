"use client";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { geoConicConformal, geoPath, select, zoom, zoomIdentity, type GeoPermissibleObjects, type ZoomBehavior, type ZoomTransform } from "d3";
import { dayN, fmt, houseStyle as hsBase } from "@/lib/text";
import { distLabel, kmBetween, type Strike, type StrikesBase, type StrikesData } from "@/lib/strikes";
import { useApp } from "../ctx";
import { LOCK } from "../digest/Item";
import { useElWidth, useJson, useSticky } from "./hooks";
import type { MapsData } from "./Panels";
import { flags } from "@/components/Flag";

type Rings = number[][][][];
const mp = (c: Rings) => ({ type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: c } }) as GeoPermissibleObjects;

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
const Tiles = ({ items }: { items: [string, ReactNode, string][] }) => (
  <>{items.map(([l, v, s]) => <div className="tile" key={l}><small>{flags(l)}</small><b>{v}</b><span>{flags(s)}</span></div>)}</>
);

/* ---------- Maps: how DeepState / ISW / DIVGEN draw the front ---------- */
const SRC_COL: Record<string, string> = { ds: "--m-occ", isw: "--m-isw", dg: "--m-dg" };
const PAIR_SRC: Record<string, [string, string]> = { dg_ds: ["dg", "ds"], dg_isw: ["dg", "isw"], isw_ds: ["isw", "ds"] };
const LY: Record<string, string> = { ds: "ds_occ", isw: "isw", dg: "dg_ru" };
const EVC: Record<string, string> = { occ: "--m-occ", grey: "--m-grey", edge: "--muted", ua: "--m-dg", far: "--m-onlydg" };
const EVF: Record<string, string> = { occ: "var(--m-occ)", grey: "var(--m-grey)", adv: "var(--m-grey)", edge: "var(--muted)", ua: "var(--m-dg)", far: "var(--m-onlydg)", out: "var(--muted)" };
const Sw = ({ c, l, cls = "" }: { c: string; l: string; cls?: string }) => <span><i className={cls} style={cls === "line" ? { borderColor: `var(${c})` } : { background: `var(${c})` }} />{flags(l)}</span>;

export function MapsCompare() {
  const { t, lang } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  const [mode, setMode] = useSticky("mapMode", "cmp");
  const [pair, setPair] = useSticky("mapPair", "isw_ds");
  const [ev, setEv] = useSticky("mapEv", true);
  const [tip, setTip] = useState<Tip>(null);
  const { data: M, err } = useJson<MapsData>("/maps/maps.json");
  const wrapRef = useRef<HTMLDivElement>(null);
  const w = useElWidth(wrapRef);
  const W = Math.max(300, w || 800), H = Math.round(Math.min(600, Math.max(340, W * 0.62)));
  const z = useZoom("mapZ", !!M, [1, 40], [[-W * 0.2, -H * 0.2], [W * 1.2, H * 1.2]]);
  const geo = useMemo(() => {
    if (!M) return null;
    const ua = M.base.find((b) => b.ua)!;
    const proj = geoConicConformal().parallels([45, 52]).rotate([-31.5, 0]).fitExtent([[12, 12], [W - 12, H - 12]], mp(ua.c));
    const path = geoPath(proj);
    return { proj, d: (c?: Rings) => (c && c.length ? path(mp(c)) || "" : "") };
  }, [M, W, H]);

  const SegBtn = (k: string, l: string, cur: string, set: (v: string) => void) => <button type="button" key={k} aria-pressed={cur === k} onClick={() => set(k)}>{l}</button>;
  const head = (
    <>
      <div className="tl-head"><h2>{t.map}</h2><p>{flags(t.mapSub)}</p></div>
    </>
  );
  const F = (n: number) => fmt(Math.round(n), lang);
  const sk = { ds: "deepstate", isw: "isw", dg: "divgen" } as const;

  let tiles: [string, ReactNode, string][] = [], evc = "", srcLine: ReactNode = null, method = "", legend: ReactNode[] = [];
  let ref: "ds" | "isw" = "ds";
  if (M) {
    const A = M.areas, S = M.sources;
    const nc: Record<string, number> = { ds: A.ds_nc, isw: A.isw_nc, dg: A.dg_nc };
    const order = Object.keys(nc).sort((a, b) => nc[b] - nc[a]);
    tiles = (["ds", "isw", "dg"] as const).map((k) => [t.tArea(t.src[k]), F(nc[k]), t.kmNC]);
    if (mode === "cmp") { const [a, b] = PAIR_SRC[pair]; tiles.push([t.tPair(t.src[a as "ds"], t.src[b as "ds"]), F(A[pair + "_a"]) + " / " + F(A[pair + "_b"]), pair === "dg_ds" ? t.kmPairGrey(F(A.only_dg_grey)) : t.kmPair]); }
    else tiles.push([t.tSpread, F(nc[order[0]] - nc[order[2]]), t.kmSpread(t.src[order[0] as "ds"], t.src[order[2] as "ds"])]);
    ref = mode === "isw" ? "isw" : mode === "cmp" ? (pair === "dg_isw" ? "isw" : "ds") : "ds";
    const cnt: Record<string, number> = {};
    M.events.forEach((e) => { const k = e[ref] as string; cnt[k] = (cnt[k] || 0) + 1; });
    evc = ev ? t.evCount(M.events.length, t.src[ref], cnt) + " " + t.evRef(t.src[ref]) + "." : "";
    srcLine = <>{t.mSnap}{" "}{(["ds", "isw", "dg"] as const).map((k, i) => { const s = S[sk[k]]; return <Fragment key={k}>{i > 0 && "; "}<a href={s.url} target="_blank" rel="noopener">{t.src[k]}</a> — {s.asOfLabel} ({flags(t.srcKind[k])})</Fragment>; })}. {t.kmCrimea(F(A.crimea))}</>;
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
    if (ev) Object.keys(EVC).forEach((k) => legend.push(<Sw key={"ev" + k} c={EVC[k]} l={t.evLg[k as "occ"]} cls="dot" />));
  }

  const front = () => {
    if (!M || !geo) return;
    const pts = M.events.filter((e) => e.ds !== "out").map((e) => geo.proj([e.lng, e.lat])!);
    if (!pts.length) return;
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20, y0 = Math.min(...ys) - 20, y1 = Math.max(...ys) + 20;
    const k = Math.min(40, 0.9 / Math.max((x1 - x0) / W, (y1 - y0) / H));
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2), 400);
  };
  const onKey = (e: KeyboardEvent) => {
    const st = 60 / z.t.k;
    if (e.key === "+" || e.key === "=") z.scale(1.4); else if (e.key === "-") z.scale(1 / 1.4);
    else if (e.key === "ArrowLeft") z.pan(st, 0); else if (e.key === "ArrowRight") z.pan(-st, 0);
    else if (e.key === "ArrowUp") z.pan(0, st); else if (e.key === "ArrowDown") z.pan(0, -st);
    else return;
    e.preventDefault();
  };

  let layers: ReactNode = null;
  if (M && geo) {
    const L = M.layers;
    const P = (c: Rings | undefined, fill: string, op: number, stroke?: string, sw?: number, key?: string) =>
      c && c.length ? <path key={key} d={geo.d(c)} fill={fill} fillOpacity={op} stroke={stroke || "none"} strokeWidth={sw || 0} fillRule="evenodd" /> : null;
    const [a, b] = PAIR_SRC[pair];
    layers = <>
      {M.base.map((bb, i) => P(bb.c, bb.ua ? "var(--m-ua)" : "var(--m-land)", 1, "var(--m-border)", bb.ua ? 1.4 : 0.8, "b" + i))}
      {mode === "ds" ? <>{P(L.ds_occ, "var(--m-occ)", 0.38, "var(--m-occ)", 1)}{P(L.ds_grey, "var(--m-grey)", 0.45, "var(--m-grey)", 0.6)}</>
        : mode === "isw" ? <>{P(L.isw, "var(--m-isw)", 0.35, "var(--m-isw)", 1)}{P(L.isw_adv, "var(--m-iswadv)", 0.55, "var(--m-iswadv)", 0.6)}</>
        : mode === "dg" ? P(L.dg_ru, "var(--m-dg)", 0.33, "var(--m-dg)", 1)
        : <>
          {pair === "dg_ds" ? <>{P(L.dg_ds_a, "var(--m-onlydg)", 0.75)}{P(L.only_dg_grey, "var(--m-onlydgg)", 0.85)}</> : P(L[pair + "_a"], "var(--m-onlydg)", 0.75)}
          {P(L[pair + "_b"], "var(--m-onlyds)", 0.7)}{P(L[LY[b]], "none", 0, `var(${SRC_COL[b]})`, 1.4)}{P(L[LY[a]], "none", 0, `var(${SRC_COL[a]})`, 1.2)}
        </>}
    </>;
  }
  const k = z.t.k;

  return (
    <section className="tlwrap" id="maps">
      {head}
      <div className="tiles map-tiles"><Tiles items={tiles} /></div>
      <div className="tl-controls">
        <div className="seg" role="group" aria-label={t.map}>{SegBtn("ds", t.src.ds, mode, setMode)}{SegBtn("isw", t.src.isw, mode, setMode)}{SegBtn("dg", t.src.dg, mode, setMode)}{SegBtn("cmp", t.mCmp, mode, setMode)}</div>
        <div className="seg" role="group" hidden={mode !== "cmp"}>{(["dg_ds", "dg_isw", "isw_ds"] as const).map((p) => SegBtn(p, t.pairs[p], pair, setPair))}</div>
        <span className="spacer" />
        <div className="seg"><button type="button" aria-pressed={ev} onClick={() => setEv(!ev)}>{t.mEv}</button></div>
        <div className="seg"><button type="button" onClick={front}>{t.mFront}</button></div>
      </div>
      <div className="map-legend">{legend}</div>
      <div className="map-wrap" ref={wrapRef}>
        {err ? <p className="map-src" style={{ padding: 16 }}>{t.mErr}</p> : !M || !geo ? <p className="map-src" style={{ padding: 16 }}>{t.mLoading}</p> : <>
          <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.map} ref={z.svgRef} onKeyDown={onKey}>
            <g transform={z.t.toString()}>
              {layers}
              <g className="city">{M.cities.map((c) => { const [x, y] = geo.proj([c.lng, c.lat])!; return [
                <circle key={c.n + "c"} cx={x} cy={y} r={2.6 / k} fill="var(--m-city)" />,
                <text key={c.n + "t"} x={x + 5 / k} y={y + 4 / k} fontSize={11 / k} style={{ strokeWidth: 3 / k + "px" }}>{c.n}</text>,
              ]; })}</g>
              {ev && <g className="evs">{M.events.map((e) => {
                const [x, y] = geo.proj([e.lng, e.lat])!;
                return <circle key={e.id + "" + e.d} cx={x} cy={y} r={4.5 / Math.sqrt(k)} fill={EVF[e[ref] as string] || "var(--m-dg)"} stroke="var(--surface)" strokeWidth={1.5} style={{ cursor: "pointer" }}
                  {...tipHandlers(setTip, () => <>
                    <div className="d">{e.d.split("-").reverse().join(".")}</div><div>{flags(hs(e.t))}</div>
                    <div className="s">{"DeepState: " + t.evSt.ds[e.ds as "occ"] + " (" + t.evAsOf(M.sources.deepstate.asOfLabel) + ")"}</div>
                    <div className="s">{"ISW: " + t.evSt.isw[e.isw as "occ"] + " (" + t.evAsOf(M.sources.isw.asOfLabel) + ")"}</div>
                    <div className="s">{"DIVGEN #" + e.id}</div>
                  </>)} />;
              })}</g>}
            </g>
          </svg>
          <ZoomButtons z={z} />
          <MapTip tip={tip} wrap={wrapRef} />
        </>}
      </div>
      <p className="map-src">{flags(evc)}</p>
      <p className="map-src">{srcLine}</p>
      <details className="method"><summary>{t.mMethod}</summary><p>{flags(method)}</p></details>
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
