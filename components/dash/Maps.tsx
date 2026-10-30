"use client";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Delaunay, geoMercator, geoPath, select, zoom, zoomIdentity, type GeoPermissibleObjects, type GeoProjection, type ZoomBehavior, type ZoomTransform } from "d3";
import type { UIStrings } from "@/lib/ui";
import { dayN, fmt, houseStyle as hsBase, nDay, shortD } from "@/lib/text";
import { distLabel, kmBetween, stkDist, type Strike, type StrikesBase, type StrikesData } from "@/lib/strikes";
import { useApp } from "../ctx";
import { LOCK } from "../digest/Item";
import { useElWidth, useJson, useSticky } from "./hooks";
import type { MapsData } from "./Panels";
import { DIRS, dirOf, areaTiles, Cities, countV, fitFront, lastDay, Layers, makeGeo, Mark, MarkIco, mp, PAIR_SRC, Sw, SRC_COL, Tiles, VerdictBar, VG, vgOf, type Ev, type Geo, type Rings } from "./mapParts";
import { flags } from "@/components/Flag";
import { byPlace, GCOL, GRPS, grpOf, placeKey, STK_CITIES, StkIco, StkMark, type Grp } from "./strikeParts";


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
function ZoomButtons({ z, children }: { z: ReturnType<typeof useZoom>; children?: ReactNode }) {
  const { t } = useApp();
  return (
    <div className="map-zoom">
      <button type="button" aria-label={t.mZoomIn} title={t.mZoomIn} onClick={() => z.by(1.6)}>+</button>
      <button type="button" aria-label={t.mZoomOut} title={t.mZoomOut} onClick={() => z.by(1 / 1.6)}>−</button>
      <button type="button" aria-label={t.mReset} title={t.mReset} onClick={() => z.to(zoomIdentity)}>⟲</button>
      {children}
    </div>
  );
}
/** The filter rail toggled resizes the box and the projection refits to it: call the returned function before toggling,
 *  and the map keeps its centre and scale (px per degree) instead of jumping. */
function useKeepView(z: ReturnType<typeof useZoom>, geo: Geo | null, W: number, H: number, ext: [number, number]) {
  const keep = useRef<{ c: [number, number]; s: number; W: number; H: number } | null>(null);
  useEffect(() => {
    const v = keep.current;
    if (!v || !geo) return;
    keep.current = null;
    if (v.W === W && v.H === H) return; // geo changed for another reason (data, filters): the toggle didn't resize
    const k = Math.min(ext[1], Math.max(ext[0], v.s / geo.proj.scale())), [x, y] = geo.proj(v.c)!;
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-x, -y), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);
  return () => { if (geo) keep.current = { c: geo.proj.invert!([(W / 2 - z.t.x) / z.t.k, (H / 2 - z.t.y) / z.t.k])!, s: z.t.k * geo.proj.scale(), W, H }; };
}
/** Entering or leaving full screen (button or Esc) shows the whole map. */
function useWholeOnFs(fs: boolean, z: ReturnType<typeof useZoom>) {
  const was = useRef(fs);
  useEffect(() => {
    if (was.current !== fs) z.to(zoomIdentity, 0);
    was.current = fs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fs]);
}
/** Full screen as a fixed overlay (the Fullscreen API is missing on iPhone): Esc leaves it, the page behind stops
 *  scrolling, and `vh` gives the map the window height. Pair with `.mp-grid.fs` and FsButton. */
function useFullscreen() {
  const [fs, setFs] = useState(false);
  const [vh, setVh] = useState(800);
  useEffect(() => {
    if (!fs) return;
    const size = () => setVh(window.innerHeight);
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") setFs(false); };
    size();
    const ov = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", size); window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ov; window.removeEventListener("resize", size); window.removeEventListener("keydown", key); };
  }, [fs]);
  return { fs, setFs, vh };
}
function FsButton({ fs, onClick }: { fs: boolean; onClick: () => void }) {
  const { t } = useApp();
  return (
    <button type="button" aria-label={fs ? t.mpFsExit : t.mpFs} title={fs ? t.mpFsExit : t.mpFs} aria-pressed={fs} onClick={onClick}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        {fs ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
      </svg>
    </button>
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

/** Web-mercator raster basemaps drawn over the (then unfilled) vector land. */
const BASEMAPS: Record<string, { url: (z: number, x: number, y: number) => string; max: number; attr: string }> = {
  r: { url: (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`, max: 18, attr: "Imagery © Esri, Maxar, Earthstar Geographics" },
  t: { url: (z, x, y) => `https://${"abc"[(x + y) % 3]}.tile.opentopomap.org/${z}/${x}/${y}.png`, max: 17, attr: "© OpenStreetMap contributors, SRTM · OpenTopoMap (CC-BY-SA)" },
};
/** Tiles covering the W×H view of a d3.geoMercator `proj` under zoom `t`, in screen coordinates.
 *  A coarse level (z−3) goes underneath so zooming never shows gaps while the sharp tiles load. */
function Tiles256({ id, proj, t, W, H }: { id: string; proj: GeoProjection; t: ZoomTransform; W: number; H: number }) {
  const bm = BASEMAPS[id], [tx, ty] = proj.translate(), S = t.k * proj.scale() * 2 * Math.PI;
  const ox = t.x + t.k * tx - S / 2, oy = t.y + t.k * ty - S / 2;
  const zz = Math.max(0, Math.min(bm.max, Math.round(Math.log2(S / 256) + (typeof devicePixelRatio === "number" && devicePixelRatio > 1.5 ? 0.5 : 0))));
  const out: ReactNode[] = [];
  for (const z of [Math.max(0, zz - 3), zz]) {
    const n = 2 ** z, ts = S / n;
    for (let i = Math.max(0, Math.floor(-ox / ts)); i <= Math.min(n - 1, Math.floor((W - ox) / ts)); i++)
      for (let j = Math.max(0, Math.floor(-oy / ts)); j <= Math.min(n - 1, Math.floor((H - oy) / ts)); j++)
        out.push(<image key={`${z}/${i}/${j}`} href={bm.url(z, i, j)} x={ox + i * ts} y={oy + j * ts} width={ts + 0.5} height={ts + 0.5} preserveAspectRatio="none" />);
  }
  return <g className={"map-tiles-" + id}>{out}</g>;
}
const BaseSeg = ({ bm, set, label }: { bm: string; set: (v: string) => void; label: Record<"s" | "t" | "r", string> }) => (
  <div className="seg" role="group">{(["s", "t", "r"] as const).map((k) => <button type="button" key={k} aria-pressed={bm === k} onClick={() => set(k)}>{label[k]}</button>)}</div>
);
/** Shows/hides the filter rail (kept per map for the session). */
const RailBtn = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
  <div className="seg"><button type="button" className="mp-railbtn" aria-expanded={on} aria-pressed={on} onClick={() => set(!on)}>☰ {label}</button></div>
);
const Attr = ({ bm }: { bm: string }) => (BASEMAPS[bm] ? <span className="map-attr">{BASEMAPS[bm].attr}</span> : null);

export function MapsCompare() {
  const { t, lang, MAPS, D } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  const [mode, setMode] = useSticky("mapMode", "cmp");
  const [sect, setSect] = useSticky("mapSect", true);
  // General Staff: russian attacks per direction in the issue's day (names come translated on English pages)
  const gsBy = new Map((D.front?.directions || []).map((x) => [x.name, x.attacks]));
  const gsOf = (d: (typeof DIRS)[number]) => gsBy.get(d.uk) ?? gsBy.get(d[lang]);
  const [pair, setPair] = useSticky("mapPair", "dg_ds");
  const [ev, setEv] = useSticky("mapEv", true);
  const [bm, setBm] = useSticky("mapBase", "t");
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
  const { fs, setFs, vh } = useFullscreen();
  const [rail, setRail] = useSticky("mapRail", true);
  const [flOpen, setFlOpen] = useSticky("mapFlOpen", true); // claims panel on the full-screen map
  const W = Math.max(300, w || 800), H = fs ? Math.max(340, vh - 96) : Math.round(Math.min(640, Math.max(340, W * 0.66)));
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
  /** Zoom to the box around these points ([lng, lat]). */
  const frame = (ll: [number, number][]) => {
    if (!geo || !ll.length) return;
    const pts = ll.map((p) => geo.proj(p)!);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs) - 30, x1 = Math.max(...xs) + 30, y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 30;
    const kk = Math.min(40, 0.85 / Math.max((x1 - x0) / W, (y1 - y0) / H));
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(kk).translate(-(x0 + x1) / 2, -(y0 + y1) / 2), 500);
  };
  const pickDir = (d: string | null) => {
    setDir(d); setSel(null);
    if (!M || !geo) return;
    if (!d) { z.to(fitFront(M, geo, W, H), 400); return; }
    const a = DIRS.find((x) => x.id === d)!;
    frame([...inPer.filter((e) => evDir.get(e) === d).map((e) => [e.lng, e.lat] as [number, number]), [a.lng, a.lat]]);
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
  // a bar segment shows only that verdict and brings its claims into view; clicking it again shows all
  const pickV = (g: VG) => {
    if (VG.every((x) => vf[x] === (x === g))) { setVf(ALL_V); return; }
    setVf(Object.fromEntries(VG.map((x) => [x, x === g])) as Record<VG, boolean>); setSel(null);
    frame(inDir.filter((e) => vgOf(e[ref]) === g).map((e) => [e.lng, e.lat]));
    wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
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
  const focusEv = (e: Ev, scroll = true) => {
    if (!geo) return;
    setSel(e);
    const [x, y] = geo.proj([e.lng, e.lat])!;
    // the point lands right of centre, clear of the claim card in the top-left corner
    z.to(zoomIdentity.translate(W * 0.62, H * 0.55).scale(Math.max(z.t.k, 12)).translate(-x, -y), 500);
    if (scroll) wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const selI = selOn ? shown.indexOf(selOn) : -1; // shown is newest first
  // first open: frame the front instead of the whole country (a zoom kept from earlier in the session stays)
  // hiding/showing the filter rail resizes the box: re-frame the selected direction or the front
  const refit = useRef(false);
  useEffect(() => {
    if (!refit.current || !M || !geo) return;
    refit.current = false;
    if (dir) pickDir(dir); else z.to(fitFront(M, geo, W, H), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);
  const toggleFs = () => setFs(!fs);
  useWholeOnFs(fs, z);
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
      <div className={"mp-grid" + (fs ? " fs" : "")} role={fs ? "dialog" : undefined} aria-modal={fs || undefined} aria-label={fs ? t.map : undefined}>
        <aside className="mp-rail" hidden={!rail}>
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
              {dirRank.map((d) => { const g = gsOf(d), l = d[lang]; return (
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
              <div className="mp-dsum"><b>{d[lang]}</b><span>{g != null ? t.mpGs(g, D.front?.period) : t.mpGsNone}</span><span>{t.mpDirClaims(dirCnt[dir] || 0)}</span></div>
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
            <RailBtn on={rail} set={(v) => { refit.current = true; setRail(v); }} label={t.mpFilters} />
            <div className="map-legend">{legend}</div>
            <BaseSeg bm={bm} set={setBm} label={t.mBase} />
            {M && ev && <span className="map-src">{t.mpShown(shown.length, inPer.length)}</span>}
          </div>
          <div className="map-wrap" ref={wrapRef}>
            {err ? <p className="map-src" style={{ padding: 16 }}>{t.mErr}</p> : !M || !geo ? <p className="map-src" style={{ padding: 16 }}>{t.mLoading}</p> : <>
              <svg className={"map-svg bm-" + bm} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.map} ref={z.svgRef} onKeyDown={onKey}>
                {BASEMAPS[bm] && <Tiles256 id={bm} proj={geo.proj} t={z.t} W={W} H={H} />}
                <g transform={z.t.toString()}>
                  <Layers M={M} geo={geo} mode={mode} pair={pair} plain={bm === "s"} />
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
                  <Cities M={M} geo={geo} k={k} hidden={bm === "t"} />
                  {(ev || sect) && <g className="mp-dlab">{dirShown.map((d, i) => {
                    // labels east of the front, alternately above and below the anchor, so neighbours don't overlap
                    const [x, y] = geo.proj([d.lng, d.lat])!, on = dir === d.id, l = d[lang], dy = i % 2 ? 16 : -16, g = gsOf(d), lw = l.length * 5.9 + 14 + (g != null ? String(g).length * 7 + 8 : 0);
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
                <FsButton fs={fs} onClick={toggleFs} />
              </div>
              <div className="mp-ov">{/* top-left: claims list (full screen), the picked claim's card right under it */}
              {fs && ev && <div className={"mp-fl" + (flOpen ? " open" : "")}>
                <button type="button" className="mp-fl-h" aria-expanded={flOpen} onClick={() => setFlOpen(!flOpen)}><b>{t.mpList}</b> <span>{shown.length}</span><i aria-hidden="true">{flOpen ? "▾" : "▸"}</i></button>
                {flOpen && <ol>{shown.map((e) => (
                  <li key={e.id + "" + e.d}><button type="button" aria-current={e === selOn || undefined} onPointerEnter={() => setHl(e.id)} onPointerLeave={() => setHl(null)} onClick={() => focusEv(e, false)}>
                    <MarkIco g={vgOf(e[ref])} /><span className="d">{dmy(e.d).slice(0, 5)}</span><span>{flags(hs(e.t))}</span>
                  </button></li>
                ))}</ol>}
              </div>}
              {selOn && <div className="mp-sel" role="status">
                <button type="button" aria-label={t.art.close} title={t.art.close} onClick={() => setSel(null)}>×</button>
                <div className="d">{dmy(selOn.d)} · DIVGEN #{selOn.id}</div>
                <div className="tx">{flags(hs(selOn.t))}</div>
                <div className="v"><MarkIco g={vgOf(selOn.ds)} /> DeepState: {t.evSt.ds[selOn.ds as "occ"]}</div>
                <div className="v"><MarkIco g={vgOf(selOn.isw)} /> ISW: {t.evSt.isw[selOn.isw as "occ"]}</div>
                <div className="nav">
                  <button type="button" aria-label={t.mpNextEv} title={t.mpNextEv} disabled={selI <= 0} onClick={() => focusEv(shown[selI - 1], false)}>‹</button>
                  <span>{selI + 1} / {shown.length}</span>
                  <button type="button" aria-label={t.mpPrevEv} title={t.mpPrevEv} disabled={selI >= shown.length - 1} onClick={() => focusEv(shown[selI + 1], false)}>›</button>
                </div>
              </div>}
              </div>
              <Attr bm={bm} />
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

/* ---------- Strikes on russia (/strikes): strikes.json + maps/strikes-base.json; occupied overlay from maps.json ---------- */
const TG_COL: Record<string, string> = { fuel: "--c2", en: "--c4", air: "--c5", mil: "--c1", dc: "--c3" };
const TG_MATCH: Record<string, Grp[]> = { fuel: ["oil"], en: ["en"], air: ["mil"], mil: ["mil", "vpk"], dc: ["vpk", "en", "log"] };
const ALL_G = Object.fromEntries(GRPS.map((g) => [g, true])) as Record<Grp, boolean>;
type Target = { cat: string; name: string; sub: string; lat: number; lng: number; approx?: boolean; src: string };
const dmy = (d: string) => d.split("-").reverse().join(".");
const byDate = (a: Strike, b: Strike) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
const FAR_LNG = 61;

/** `onReady`: on /strikes the server HTML stays until the data is here; nothing renders before that. */
export function StrikesMap({ onReady }: { onReady?: () => void }) {
  const { t: TT, lang, D, goItem } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  const sd = useJson<StrikesData>("/strikes.json"), sb = useJson<StrikesBase>("/maps/strikes-base.json");
  const S = useMemo(() => (sd.data && sb.data ? { stk: sd.data, base: sb.data } : null), [sd.data, sb.data]);
  const stkErr = sd.err || sb.err;
  const t = TT.stk;
  const [per, setPer] = useSticky("stkPer", "30");
  const [grp, setGrp] = useSticky<Record<Grp, boolean>>("stkGrps", ALL_G);
  const [st, setSt] = useSticky<"all" | "conf" | "unconf">("stkSt", "all");
  const [lc, setLc] = useSticky("stkLoc", "all");
  const [sel, setSel] = useState<string | null>(null);
  const [more, setMore] = useSticky("stkMore", 40);
  const [tgOn, setTgOn] = useSticky("tgOn", false);
  const [bm, setBm] = useSticky("stkBase", "t");
  const [tgCat, setTgCat] = useSticky<Record<string, boolean>>("tgCat", { fuel: true, en: true, air: true, mil: true, dc: true });
  const [tip, setTip] = useState<Tip>(null);
  const maps = useJson<MapsData>("/maps/maps.json");
  const tg = useJson<{ items: Target[]; note?: string }>(tgOn ? "/maps/targets.json" : null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const w = useElWidth(wrapRef, !!S); // nothing renders before the data on /strikes: attach once the map is there
  const { fs, setFs, vh } = useFullscreen();
  const [rail, setRail] = useSticky("stkRail", true);
  const [flOpen, setFlOpen] = useSticky("stkFlOpen", true); // strikes panel on the full-screen map
  const W = Math.max(300, w || 800), H = fs ? Math.max(340, vh - 96) : Math.round(Math.min(620, Math.max(340, W * 0.7)));
  const z = useZoom("stkPageZ", !!S, [0.4, 12], [[-W * 1.5, -H * 0.8], [W * 2.5, H * 1.6]]);

  const end = dayN(D.date);
  const all = S ? (S.stk.items || []).filter((x) => x.lat != null && dayN(x.date) <= end) : [];
  const years = [...new Set(all.map((x) => x.date.slice(0, 4)))].sort().reverse();
  const pers: [string, string][] = [["7", t.p7], ["30", t.p30], ...years.map((y) => [y, y] as [string, string]), ["all", t.pAll]];
  const p = pers.some((x) => x[0] === per) ? per : "30";
  const inPer = (x: Strike) => (p === "all" ? true : p === "30" || p === "7" ? dayN(x.date) > end - +p : x.date.startsWith(p));
  const pass = (x: Strike) => (st === "all" || (st === "conf") === !!x.confirmed) && (lc === "all" || (x.local || "none") === lc);
  const pool = all.filter((x) => inPer(x) && pass(x));
  const gc = Object.fromEntries(GRPS.map((g) => [g, 0])) as Record<Grp, number>;
  pool.forEach((x) => gc[grpOf(x)]++);
  const items = pool.filter((x) => grp[grpOf(x)]).sort(byDate);
  const locs = [...new Set(all.filter(inPer).map((x) => x.local || "none"))].sort();
  const conf = items.filter((x) => x.confirmed).length, objs = new Set(items.map((x) => x.object)).size;
  const places = byPlace(items);
  const farX = items.filter((x) => x.lng > FAR_LNG);
  const dl = (x: { lat: number; lng: number }) => (S ? distLabel(S.base, x, lang) : "");
  const farthest = S ? items.reduce<{ x: Strike; d: number } | null>((a, x) => { const d = stkDist(S.base, x) ?? 0; return !a || d > a.d ? { x, d } : a; }, null) : null;
  const dirty = p !== "30" || st !== "all" || lc !== "all" || GRPS.some((g) => !grp[g]);

  const geo = useMemo(() => {
    if (!S) return null;
    const ua = S.base.base.find((b) => b.ua)!;
    const fitF = { type: "FeatureCollection", features: [mp(ua.c)].concat(items.filter((x) => x.lng <= FAR_LNG).map((x) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [x.lng, x.lat] } }) as GeoPermissibleObjects)) } as GeoPermissibleObjects;
    const proj = geoMercator().fitExtent([[28, 28], [W - 64, H - 28]], fitF);
    const path = geoPath(proj);
    return { proj, d: (c?: Rings) => (c && c.length ? path(mp(c)) || "" : "") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S, W, H, items.map((x) => x.id || x.date + x.object).join()]);
  const keepView = useKeepView(z, geo, W, H, [0.4, 12]);
  useWholeOnFs(fs, z);

  /** Select a place and bring it into view (from the list or the off-map buttons). */
  const focus = (x: Strike) => {
    const k = placeKey(x);
    setSel(k);
    if (!geo) return;
    const [px, py] = geo.proj([x.lng, x.lat])!, s = Math.max(z.t.k, 1.6);
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(s).translate(-px, -py), 400);
    wrapRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const reset = () => { setPer("30"); setGrp(ALL_G); setSt("all"); setLc("all"); setSel(null); setMore(40); z.to(zoomIdentity, 0); };
  const pickPer = (kk: string) => { setPer(kk); setMore(40); setSel(null); z.to(zoomIdentity, 0); };
  const pickGrp = (g: Grp) => { const n = { ...grp, [g]: !grp[g] }; if (!GRPS.some((x) => n[x])) n[g] = true; setGrp(n); setMore(40); };
  const pickTg = (c: string) => { const n = { ...tgCat, [c]: !tgCat[c] }; if (!Object.values(n).some(Boolean)) n[c] = true; setTgCat(n); };
  const tc: Record<string, number> = { fuel: 0, en: 0, air: 0, mil: 0, dc: 0 };
  (tg.data?.items || []).forEach((x) => tc[x.cat]++);
  const k = z.t.k;
  const selXs = sel ? items.filter((x) => placeKey(x) === sel) : [];
  const Diamond = ({ r, fill, stroke }: { r: number; fill: string; stroke: string }) => (
    <svg className="mk" width={2 * r + 2} height={2 * r + 2} viewBox={`-${r + 1} -${r + 1} ${2 * r + 2} ${2 * r + 2}`} aria-hidden="true"><path d={`M0,-${r}L${r},0L0,${r}L-${r},0Z`} fill={fill} stroke={stroke} strokeWidth={1.6} /></svg>
  );
  const locName = (l: string) => (l === "none" ? t.locNone : (TT.loc as Record<string, string>)[l] || l);

  // timeline bins: days up to two months, then weeks, then months
  const t0 = items.length ? Math.min(...items.map((x) => dayN(x.date))) : end;
  const from = p === "7" || p === "30" ? end - +p + 1 : /^\d{4}$/.test(p) ? dayN(p + "-01-01") : t0;
  const to = /^\d{4}$/.test(p) ? Math.min(end, dayN(p + "-12-31")) : end;
  const span = to - from + 1, unit = span <= 62 ? 1 : span <= 400 ? 7 : 30;
  const nb = Math.max(1, Math.ceil(span / unit));
  const bins = Array.from({ length: nb }, (_, i) => ({ d0: from + i * unit, xs: [] as Strike[] }));
  items.forEach((x) => { const i = Math.floor((dayN(x.date) - from) / unit); if (bins[i]) bins[i].xs.push(x); });
  const bMax = Math.max(1, ...bins.map((b) => b.xs.length)), lblEvery = Math.ceil(nb / 7);
  // tooltip: full date (or date range) + total, then every target group in the bin
  const binTip = (b: { d0: number; xs: Strike[] }) => {
    const iso = nDay(b.d0), d1 = Math.min(to, b.d0 + unit - 1);
    const when = unit === 1 ? dmy(iso) : unit === 30 ? binLbl(b.d0) : shortD(iso) + "–" + dmy(nDay(d1));
    const rows = GRPS.flatMap((g) => {
      const xs = b.xs.filter((x) => grpOf(x) === g), cf = xs.filter((x) => x.confirmed).length;
      return xs.length ? [{ g, s: `${t.g[g]}: ${xs.length}` + (cf ? ` · ${t.conf} ${cf}` : "") }] : [];
    });
    const head = `${when} · ${t.nStrikes(b.xs.length)}`;
    return { text: [head, ...rows.map((r) => r.s)].join("\n"), rich: <div className="tipc" hidden><b>{head}</b>{rows.map((r) => <span key={r.g}><StkIco g={r.g} size={12} />{r.s}</span>)}</div> };
  };
  const binLbl = (d0: number) => { const iso = nDay(d0); return unit === 30 ? iso.slice(5, 7) + "." + iso.slice(0, 4) : shortD(iso); };

  useEffect(() => { if (S) onReady?.(); }, [S, onReady]);
  const shown = items.slice(0, more);
  const days: [string, Strike[]][] = [];
  shown.forEach((x) => { const l = days.at(-1); if (l && l[0] === x.date) l[1].push(x); else days.push([x.date, [x]]); });

  if (onReady && !S) return null;
  return (
    <section className="tlwrap mp stk-page" id="strikemap">
      <div className="mp-head"><h2>{t.title}</h2><p>{flags(t.sub)}</p></div>
      <div className="tiles map-tiles">{S && <Tiles items={[
        [t.tTotal, fmt(items.length, lang), pers.find((x) => x[0] === p)![1]],
        [t.tConf, items.length ? <>{fmt(conf, lang)}<sub>{Math.round((conf / items.length) * 100)}%</sub></> : "0", t.tConfSub],
        [t.tObj, fmt(objs, lang), t.tObjRep(items.length - objs)],
        [t.tFar, farthest && farthest.d ? <>{fmt(farthest.d, lang)}<sub>{t.km}</sub></> : "—", farthest ? hs(farthest.x.place).split(",")[0] + " · " + dmy(farthest.x.date).slice(0, 5) : ""],
      ]} />}</div>
      <div className={"mp-grid" + (fs ? " fs" : "")} role={fs ? "dialog" : undefined} aria-modal={fs || undefined} aria-label={fs ? t.title : undefined}>
        <aside className="mp-rail" hidden={!rail}>
          <fieldset>
            <legend>{t.period}</legend>
            <div className="mp-dirs" role="group" aria-label={t.period}>{pers.map(([kk, l]) => <button type="button" key={kk} aria-pressed={p === kk} onClick={() => pickPer(kk)}>{l}</button>)}</div>
          </fieldset>
          <fieldset>
            <legend>{t.types}</legend>
            <div className="mp-verd">{GRPS.map((g) => (
              <label key={g} className="mp-chk"><input type="checkbox" checked={grp[g]} onChange={() => pickGrp(g)} /><StkIco g={g} size={16} /><span>{t.g[g]}</span><span className="n">{gc[g]}</span></label>
            ))}</div>
          </fieldset>
          <fieldset>
            <legend>{t.stH}</legend>
            <div className="seg" role="group" aria-label={t.stH}>{([["all", t.all], ["conf", t.stConf], ["unconf", t.stUnconf]] as const).map(([kk, l]) =>
              <button type="button" key={kk} aria-pressed={st === kk} onClick={() => { setSt(kk); setSel(null); }}>{l}</button>)}</div>
            <div className="mp-sub">{TT.loc.label}</div>
            <div className="mp-dirs" role="group" aria-label={TT.loc.label}>
              {["all", ...locs].map((l) => <button type="button" key={l} aria-pressed={lc === l} onClick={() => { setLc(l); setSel(null); }}>{l === "all" ? t.all : locName(l)}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend><label className="mp-chk"><input type="checkbox" checked={tgOn} onChange={() => setTgOn(!tgOn)} />{t.tgLbl}</label></legend>
            {tgOn && <div className="mp-verd">{["fuel", "en", "air", "mil", "dc"].map((c) => (
              <label key={c} className="mp-chk"><input type="checkbox" checked={tgCat[c]} onChange={() => pickTg(c)} /><Diamond r={6} fill={`var(${TG_COL[c]})`} stroke={`var(${TG_COL[c]})`} /><span>{t.tg[c as "fuel"]}</span><span className="n">{tg.data ? tc[c] : ""}</span></label>
            ))}</div>}
            {tgOn && tg.err && <p className="mp-note">{t.tgErr}</p>}
            {dirty && <button type="button" className="linkbtn" onClick={reset}>{t.reset}</button>}
          </fieldset>
        </aside>

        <div className="mp-main">
          <div className="mp-bar-top"><RailBtn on={rail} set={(v) => { keepView(); setRail(v); }} label={TT.mpFilters} /><b className="stk-h3">{t.byUnit[unit === 1 ? "d" : unit === 7 ? "w" : "m"]}</b><BaseSeg bm={bm} set={setBm} label={TT.mBase} /><span className="map-src">{t.shown(items.length, all.filter(inPer).length)}</span></div>
          <div className="stk-tl" role="img" aria-label={t.tlAria(items.length)}>
            <div className="bars" style={{ gridTemplateColumns: `repeat(${nb}, minmax(0, 1fr))` }}>{bins.map((b) => (
              <div key={b.d0} data-tip={binTip(b).text} style={{ height: (b.xs.length / bMax) * 100 + "%" }}>
                {binTip(b).rich}
                {GRPS.flatMap((g) => [true, false].map((c) => { const n = b.xs.filter((x) => grpOf(x) === g && !!x.confirmed === c).length;
                  return n ? <span key={g + c} style={c ? { flex: n, background: GCOL[g] } : { flex: n, boxShadow: `inset 0 0 0 1.5px ${GCOL[g]}`, background: "var(--surface)" }} /> : null; }))}
              </div>
            ))}</div>
            <div className="lbls" style={{ gridTemplateColumns: `repeat(${nb}, minmax(0, 1fr))` }}>{bins.map((b, i) => <span key={b.d0}>{i % lblEvery ? "" : binLbl(b.d0)}</span>)}</div>
            <p className="map-src">{t.tlNote}</p>
          </div>

          <div className="map-wrap" ref={wrapRef}>
            {stkErr ? <p className="map-src" style={{ padding: 16 }}>{t.err}</p> : !S || !geo ? <p className="map-src" style={{ padding: 16 }}>{t.loading}</p> : <>
              <svg className={"map-svg bm-" + bm} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.title} ref={z.svgRef}>
                {BASEMAPS[bm] && <Tiles256 id={bm} proj={geo.proj} t={z.t} W={W} H={H} />}
                <g transform={z.t.toString()}>
                  {S.base.base.map((b, i) => <path key={i} d={geo.d(b.c)} fill={b.ua ? "var(--m-ua)" : "var(--m-land)"} fillOpacity={bm === "s" ? 1 : 0} stroke="var(--m-border)" strokeWidth={b.ua ? 1.4 : 0.8} fillRule="evenodd" />)}
                  {maps.data?.layers?.ds_occ && <path d={geo.d(maps.data.layers.ds_occ)} fill="var(--m-occ)" fillOpacity={0.3} stroke="var(--m-occ)" strokeWidth={0.6} fillRule="evenodd" />}
                  <g className="city stk-city" aria-hidden="true">{STK_CITIES.filter((c) => c.t === 1 || k >= 2).map((c) => { const [x, y] = geo.proj([c.lng, c.lat])!; return (
                    <g key={c.en} transform={`translate(${x},${y}) scale(${1 / k})`}>
                      {c.cap ? <rect x={-3.5} y={-3.5} width={7} height={7} fill="var(--surface)" stroke="var(--m-city)" strokeWidth={1.8} /> : <circle r={2.6} fill="var(--m-city)" />}
                      <text x={6} y={4} fontSize={c.cap ? 13 : 11} fontWeight={c.cap ? 700 : 500}>{c[lang]}</text>
                    </g>
                  ); })}</g>
                  {tgOn && tg.data && <g className="tgt">{tg.data.items.filter((x) => tgCat[x.cat]).map((x, i) => {
                    const pp = geo.proj([x.lng, x.lat]);
                    if (!pp) return null;
                    const col = `var(${TG_COL[x.cat]})`;
                    const hits = all.filter((s) => TG_MATCH[x.cat].includes(grpOf(s)) && kmBetween(s, x) <= 10).sort(byDate);
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
                  <g>{[...places].sort((a, b) => +(a.k === sel) - +(b.k === sel) || b.xs.length - a.xs.length).map(({ k: pk, xs }) => {
                    const x = xs[0], [px, py] = geo.proj([x.lng, x.lat])!, on = pk === sel;
                    return (
                      <g key={pk} className="stk" transform={`translate(${px},${py}) scale(${1 / k})`} style={{ cursor: "pointer" }} role="button"
                        aria-label={`${hs(x.place)}: ${t.nStrikes(xs.length)}`} aria-pressed={on}
                        onClick={() => setSel(on ? null : pk)} onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(on ? null : pk); } }}
                        {...tipHandlers(setTip, () => <>
                          <div className="d">{flags(hs(x.place) + (x.approx ? " ≈" : ""))}</div>
                          {xs.slice(0, 3).map((y, i) => <div key={i}>{flags(`${dmy(y.date).slice(0, 5)} · ${hs(y.object)}`)}</div>)}
                          {xs.length > 3 && <div className="s">{t.andMore(xs.length - 3)}</div>}
                          {dl(x) && <div className="s">{"📏 " + dl(x)}</div>}
                        </>)}>
                        <StkMark g={grpOf(x)} conf={!!x.confirmed} n={xs.length} hl={on} />
                      </g>
                    );
                  })}</g>
                </g>
              </svg>
              <ZoomButtons z={z}><FsButton fs={fs} onClick={() => setFs(!fs)} /></ZoomButtons>
              {farX.length > 0 && !sel && !fs && <div className="stk-far"><span>{t.offMap}</span>{byPlace(farX).map(({ k: fk, xs }) => (
                <button type="button" key={fk} onClick={() => focus(xs[0])}><StkIco g={grpOf(xs[0])} conf={!!xs[0].confirmed} size={14} />{hs(xs[0].place).split(",")[0]} · {xs.length > 1 ? t.nStrikes(xs.length) : dmy(xs[0].date).slice(0, 5)}</button>
              ))}</div>}
              <div className="mp-ov">{/* top-left: strikes list (full screen), the picked place's card right under it */}
              {fs && <div className={"mp-fl" + (flOpen ? " open" : "")}>
                <button type="button" className="mp-fl-h" aria-expanded={flOpen} onClick={() => setFlOpen(!flOpen)}><b>{t.list}</b> <span>{items.length}</span><i aria-hidden="true">{flOpen ? "▾" : "▸"}</i></button>
                {flOpen && <ol>{items.map((x, i) => (
                  <li key={i}><button type="button" aria-current={placeKey(x) === sel || undefined} onClick={() => focus(x)}>
                    <StkIco g={grpOf(x)} conf={!!x.confirmed} size={14} /><span className="d">{dmy(x.date).slice(0, 5)}</span><span>{flags(hs(x.object))}, {flags(hs(x.place))}</span>
                  </button></li>
                ))}</ol>}
              </div>}
              {selXs.length > 0 && <div className="mp-sel stk-sel" role="status">
                <button type="button" aria-label={TT.art.close} title={TT.art.close} onClick={() => setSel(null)}>×</button>
                <span className="d">{t.nStrikesHere(selXs.length)}</span>
                <span className="tx">{flags(hs(selXs[0].place))}{selXs[0].approx ? " ≈" : ""}</span>
                {dl(selXs[0]) && <span className="d">📏 {dl(selXs[0])}</span>}
                {selXs.map((x, i) => (
                  <span className="v" key={i}><StkIco g={grpOf(x)} conf={!!x.confirmed} size={14} /><span><b>{dmy(x.date).slice(0, 5)}</b> · {flags(hs(x.object))}
                    {x.item && <> · <a href="#" onClick={(e) => { e.preventDefault(); goItem(x.issue || "", x.item!); }}>{t.toFeed}</a></>}</span></span>
                ))}
              </div>}
              </div>
              <Attr bm={bm} />
              <MapTip tip={tip} wrap={wrapRef} />
            </>}
          </div>

          <div className="stk-lg">
            <div><h3>{t.lgType}</h3>{GRPS.map((g) => <span key={g}><StkIco g={g} /><span>{t.g[g]} <small>— {t.gHint[g]}</small></span></span>)}</div>
            <div><h3>{t.lgStatus}</h3>
              <span title={t.lgConfT}><StkIco g="oil" />{t.lgConf}</span>
              <span><StkIco g="oil" conf={false} />{t.lgUnconf}</span>
              <span><StkIco g="oth" conf={false} />{t.lgUnknown}</span>
            </div>
            <div><h3>{t.lgMark}</h3>
              <span><StkIco g="mil" />{t.lgOne}</span>
              <span><StkIco g="mil" n={3} />{t.lgMany}</span>
              <span><b className="stk-approx">≈</b>{t.approx}</span>
            </div>
            <div><h3>{t.lgTerr}</h3>
              {maps.data && <span><i style={{ background: "var(--m-occ)", opacity: 0.45 }} />{t.occ}</span>}
              <span><i style={{ background: "var(--m-ua)", border: "1px solid var(--m-border)" }} />{t.lgUa}</span>
              <span><i style={{ background: "var(--m-land)", border: "1px solid var(--m-border)" }} />{t.lgRu}</span>
              <span><Diamond r={6} fill="var(--surface)" stroke="var(--muted)" />{t.tgLg}</span>
              <span><Diamond r={6} fill="var(--muted)" stroke="var(--muted)" />{t.tgLgHit}</span>
            </div>
          </div>

          <h3 className="stk-h3">{t.list} · {fmt(items.length, lang)}</h3>
          <ol className="stk-list">
            {!S ? null : !items.length ? <li><span /><div>{t.none} {dirty && <button type="button" className="linkbtn" onClick={reset}>{t.reset}</button>}</div></li>
              : days.map(([d, xs]) => <Fragment key={d}>
                <li className="stk-day"><b>{dmy(d).slice(0, 5)}{d.slice(0, 4) !== D.date.slice(0, 4) && "." + d.slice(0, 4)}</b><span>{t.nStrikes(xs.length)}</span></li>
                {xs.map((x, n) => {
                  const c = !!x.confirmed, dd = dl(x);
                  return (
                    <li key={n} className={placeKey(x) === sel ? "sel" : undefined}>
                      <StkIco g={grpOf(x)} conf={c} size={20} />
                      <div>
                        <span><button type="button" className="stk-obj" onClick={() => focus(x)}>{flags(hs(x.object))}</button>, {flags(hs(x.place))}{x.approx ? " ≈" : ""}{x.night && <span style={{ color: "var(--muted)" }}> ({t.night} {x.night})</span>}</span>
                        <span>{flags(hs(x.result))}</span>
                        <span className="stk-meta">
                          {dd && <span title={t.distNote(S.base.ctrlAsOf || "")}>📏 {dd}</span>}
                          <span className={"chip " + (c ? "ok" : "unv")}>{c ? t.conf : t.unconf}</span>
                          {c && <span>{flags(t.confBy(x.confirmed!.by, x.confirmed!.when))}</span>}
                          {x.local && <span className={"chip " + (LOCK[x.local] || "ru")}>{locName(x.local)}</span>}
                          {x.item && <a href="#" onClick={(e) => { e.preventDefault(); goItem(x.issue || "", x.item!); }}>{t.toFeed}</a>}
                          {x.url && <a href={x.url} target="_blank" rel="noopener">{t.src}</a>}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </Fragment>)}
            {items.length > shown.length && <li><span /><div><button type="button" className="linkbtn" onClick={() => setMore(more + 60)}>{t.more(items.length - shown.length)}</button></div></li>}
          </ol>
          <details className="method"><summary>{t.about}</summary>
            <p className="map-src">{flags(S ? t.distNote(S.base.ctrlAsOf || "") + " " + (S.stk.coverage ? (S.stk.coverage[lang] ?? S.stk.coverage.en) + " " : "") + (tgOn && tg.data && tg.data.note ? " ◆ " + tg.data.note : "") : "")}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
