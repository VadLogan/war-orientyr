"use client";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Delaunay, geoMercator, geoPath, select, zoom, zoomIdentity, type GeoPermissibleObjects, type GeoProjection, type ZoomBehavior, type ZoomTransform } from "d3";
import type { UIStrings } from "@/lib/ui";
import { dayN, dirCol, dirOrder, fmt, houseStyle as hsBase, nDay, shortD, TL } from "@/lib/text";
import { distLabel, kmBetween, stkDist, type Strike, type StrikesBase, type StrikesData } from "@/lib/strikes";
import { useApp } from "../ctx";
import { LOCK } from "../digest/Item";
import { fetchJson, useElWidth, useJson, useSticky } from "./hooks";
import type { MapsData } from "./Panels";
import type { Analytics } from "@/lib/data";
import { LandCostNote, PotentialNote } from "./AnNotes";
import { DIRS, dirOf, areaTiles, Cities, countV, fitFront, lastDay, Layers, lineChanges, lineDiff, makeGeo, Mark, MarkIco, mp, PAIR_SRC, Sw, SRC_COL, Tiles, VerdictBar, VG, vgOf, type Ev, type Geo, type Rings } from "./mapParts";
import { flags } from "@/components/Flag";
import { toArea, type LL } from "@/lib/geo";
import { href, MAP_SECS, mapSecHref, utm, type MapSec } from "@/lib/routes";
import { byPlace, GCOL, GRPS, grpOf, placeKey, STK_CITIES, StkIco, StkMark, type Grp } from "./strikeParts";
import { reaching, WEAPONS, WPN_GROUPS, wpnImg, wpnName } from "@/lib/weapons";


/* ---------- shared: d3-zoom on an SVG, transform kept in (sticky) React state ---------- */
function useZoom(key: string, ready: boolean, ext: [number, number], tExt: [[number, number], [number, number]]) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zb = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [t, setT] = useSticky<ZoomTransform>(key, zoomIdentity);
  const [hint, setHint] = useState(false);
  const tx = JSON.stringify(tExt);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // the wheel zooms only with Ctrl/⌘ (a trackpad pinch sends Ctrl) or in full screen, so the page scrolls past the map
    const free = (e: WheelEvent) => e.ctrlKey || e.metaKey || !!svg.closest(".mp-grid.fs");
    const z = zoom<SVGSVGElement, unknown>().scaleExtent(ext).translateExtent(tExt).on("zoom", (ev) => setT(ev.transform))
      .filter((e) => (e.type === "wheel" ? free(e) : !e.ctrlKey && !e.button))
      // ponytail: a pinch sends small Ctrl deltas, a Ctrl+mouse-wheel notch ~100: only the pinch gets d3's ×10
      .wheelDelta((e) => -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey && Math.abs(e.deltaY) < 50 ? 10 : 1));
    zb.current = z;
    select(svg).call(z).call(z.transform, t);
    let tm = 0;
    const onWheel = (e: WheelEvent) => { if (free(e)) return; setHint(true); clearTimeout(tm); tm = window.setTimeout(() => setHint(false), 1400); };
    svg.addEventListener("wheel", onWheel, { passive: true });
    return () => { select(svg).on(".zoom", null); svg.removeEventListener("wheel", onWheel); clearTimeout(tm); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, ready]);
  const sel = () => select(svgRef.current!);
  return {
    svgRef, t, hint,
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
const PRESETS: { id: string; mode: string; pair?: string; ev: boolean; dse: boolean; per: number }[] = [
  { id: "new", mode: "ds", ev: false, dse: true, per: 7 },
  { id: "claims", mode: "cmp", pair: "dg_ds", ev: true, dse: true, per: 30 },
  { id: "cmp", mode: "cmp", ev: false, dse: false, per: 30 },
];
const dsKey = (e: { id: number; lat: number; lng: number }) => `${e.id}/${e.lat}/${e.lng}`;
// one DeepState update note that names several places, or several kinds of change (an advance + a map fix),
// = one event per place and kind (one marker each); lists show the note once — the place russia claimed earliest
// stands for it — with every kind it holds
type DsE = NonNullable<MapsData["dsEvents"]>[number];
const dsUpd = (e: DsE) => `${e.id}/${e.d}`;
function dsOnce(xs: DsE[], key = dsUpd): DsE[] {
  const by = new Map<string, DsE>();
  for (const e of xs) { const o = by.get(key(e)); if (!o || (e.ru && (!o.ru || e.ru.d < o.ru.d))) by.set(key(e), e); }
  return xs.filter((e) => by.get(key(e)) === e);
}
const dsKinds = (all: DsE[], e: DsE) => [...new Set(all.filter((x) => dsUpd(x) === dsUpd(e)).map((x) => x.k))];
type Stop = { pts: [number, number][]; ll: [number, number]; d0: string; d: string; j: number; n: number };
let railInit = false; // the rail starts hidden on phones once per page load; after that it's the reader's choice
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

/** DeepState change: russian advance = red triangle up, Ukrainian = blue triangle down, map refined = grey dot. */
const DsMark = ({ k, hl }: { k: "ru" | "ua" | "fix"; hl?: boolean }) => {
  const r = hl ? 9 : 5.5, y = k === "ua" ? -1 : 1;
  if (k === "fix") return <circle r={r * 0.7} fill="var(--m-grey)" stroke="var(--surface)" strokeWidth={1.5} />;
  return <path d={`M0,${-r * y}L${r},${r * 0.8 * y}L-${r},${r * 0.8 * y}Z`} fill={k === "ua" ? "var(--m-onlyds)" : "var(--m-occ)"} stroke="var(--surface)" strokeWidth={1.5} />;
};
/** A UI string with its values in bold: call it with "{0}", "{1}"… and pass the values. */
const Bold = ({ s, v }: { s: string; v: ReactNode[] }) => <>{s.split(/\{(\d)\}/).map((x, i) => (i % 2 ? <b key={i}>{v[+x]}</b> : x))}</>;
/** How far russia's claim ran ahead of (or behind) DeepState: the finding of a matched change, so a badge. */
const Lag = ({ n, t }: { n: number; t: UIStrings }) => <b className={"mp-lag" + (n > 0 ? " ahead" : n < 0 ? " behind" : "")}>{t.dsLagT(n)}</b>;
const DsIco = ({ k }: { k: "ru" | "ua" | "fix" }) => <svg className="mk" width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true"><DsMark k={k} /></svg>;

/** `dir0`: start framed on this direction (a /maps/<direction> page) unless the link's hash names one. `onReady`: the data is here. */
export function MapsCompare({ dir0, sec0, onReady, an }: { dir0?: string; sec0?: MapSec; onReady?: () => void; an?: Analytics | null } = {}) {
  const { t, lang, MAPS, D, LATEST } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  // the open section under the map. On the latest issue's plain /maps (or a /maps/<section> page) it is the URL: a switch
  // pushes /maps/<section> (Next keeps its router in step, analytics count a page view; the map stays as it is) and Back
  // closes it; on a dated or direction page the URL can't say it, so it stays in state
  const [sec, setSec] = useState<MapSec | null>(sec0 ?? null);
  const secUrl = D.date === LATEST.date && !dir0;
  const secRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!secUrl) return;
    const on = () => setSec(MAP_SECS.find((x) => location.pathname.endsWith("/maps/" + x)) ?? null);
    addEventListener("popstate", on);
    return () => removeEventListener("popstate", on);
  }, [secUrl]);
  const pickSec = (x: MapSec) => {
    const next = sec === x ? null : x;
    setSec(next);
    if (secUrl) history.pushState(null, "", (next ? mapSecHref(lang, next) : href(lang, "maps", null, "")) + location.hash);
    if (next) requestAnimationFrame(() => secRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
  };
  // a first visit opens on "what changed" (the preset "new"): DeepState's line, its week of changes, no claims
  const [mode, setMode] = useSticky("mapMode", "ds");
  const [sect, setSect] = useSticky("mapSect", true);
  const [dOff, setDOff] = useSticky<string[]>("mapDirOff", []); // directions switched off on the map
  const dVis = (id: string) => sect && !dOff.includes(id);
  const toggleD = (id: string) => setDOff(dOff.includes(id) ? dOff.filter((x) => x !== id) : [...dOff, id]);
  // General Staff: russian attacks per direction in the issue's day (names come translated on English pages)
  const gsBy = new Map((D.front?.directions || []).map((x) => [x.name, x.attacks]));
  const gsOf = (d: (typeof DIRS)[number]) => gsBy.get(d.uk) ?? gsBy.get(d[lang]);
  // each direction keeps its dashboard colour (timeline names come translated on English/German pages)
  const dOrder = useMemo(() => LATEST.dirOrder ?? dirOrder(TL(LATEST)), [LATEST]);
  const dcol = (d: (typeof DIRS)[number]) => dirCol(dOrder, dOrder.includes(d.uk) ? d.uk : d[lang]);
  const [pair, setPair] = useSticky("mapPair", "dg_ds");
  const [ev, setEv] = useSticky("mapEv", false);
  const [dse, setDse] = useSticky("mapDsE", true); // DeepState advances + when russia claimed them
  const [bm, setBm] = useSticky("mapBase", "t");
  const [per, setPer] = useSticky("mapPer", 7);
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
  const ps0 = useRef(pageSnap); // another issue picked: its snapshot (not on mount, where a shared link's snapshot may be set)
  useEffect(() => { if (ps0.current !== pageSnap) { ps0.current = pageSnap; setSnap(pageSnap); } }, [pageSnap]);
  const arch = useJson<{ dates: string[] }>(pageSnap ? "/maps/archive/index.json" : null);
  const snaps = (arch.data?.dates || []).slice().sort(), si = snap ? snaps.indexOf(snap) : -1;
  const { data: M, err } = useJson<MapsData>(snap ? `/maps/archive/${snap}.json` : MAPS);
  useEffect(() => { if (M || err) onReady?.(); }, [M, err, onReady]);
  // the week on the front: DeepState's changes in the 7 days up to the snapshot, its area against the snapshot a week before
  const wkEnd = snap ? dayN(snap) : 0;
  const prevSnap = snap ? snaps.filter((d) => dayN(d) <= wkEnd - 7).at(-1) ?? null : null;
  const PM = useJson<MapsData>(prevSnap ? `/maps/archive/${prevSnap}.json` : null).data;
  // changes of DeepState's line against the snapshot `chg` days earlier: red/blue patches, the old line dashed, rings
  const [chg, setChg] = useSticky("mapChg", 7);
  const ago = (n: number) => (snap ? snaps.filter((d) => dayN(d) <= wkEnd - n).at(-1) ?? null : null);
  const mSnap = ago(30), MM = useJson<MapsData>(mSnap ? `/maps/archive/${mSnap}.json` : null).data;
  const oSnap = chg === 30 ? mSnap : chg ? prevSnap : null, OM = chg === 30 ? MM : chg ? PM : null;
  const diffs = useMemo(() => (M && OM && OM !== M ? lineDiff(OM, M) : []), [M, OM]);
  // distance to the occupied territory: every city now, a week and a month before; `pin` = a city or a clicked point
  const [pin, setPin] = useState<{ ll: LL; n?: string } | null>(null);
  const [distAll, setDistAll] = useState(false);
  const dist = useMemo(() => !M?.layers.ds_occ ? [] : M.cities.map((c) => {
    const ll: LL = [c.lng, c.lat], now = toArea(M.layers.ds_occ, ll);
    return { c, ll, now, w: PM ? toArea(PM.layers.ds_occ, ll).km : null, m: MM ? toArea(MM.layers.ds_occ, ll).km : null };
  }).filter((x) => x.now.km > 0).sort((a, b) => a.now.km - b.now.km), [M, PM, MM]);
  const pinD = pin && M?.layers.ds_occ ? toArea(M.layers.ds_occ, pin.ll) : null;
  const [play, setPlay] = useState(false);
  const [tour, setTour] = useState(false); // started and not stopped (a paused tour still hides the direction labels)
  // the tour's stops: every change of DeepState's line between neighbouring snapshots (up to 4 per pair); `at` = the one in view
  const [stops, setStops] = useState<Stop[] | null>(null);
  const [at, setAt] = useState(-1);
  const piece = tour && stops ? stops[at] ?? null : null;
  // a new snapshot: the previous one's areas stay on top and fade out, so the line visibly moves instead of jumping
  const [fade, setFade] = useState<{ M: MapsData; n: number } | null>(null);
  const lastM = useRef<MapsData | null>(null);
  useEffect(() => {
    const was = lastM.current;
    lastM.current = M;
    if (!was || !M || was === M) return;
    setFade({ M: was, n: Date.now() });
    const tm = setTimeout(() => setFade(null), 1200);
    return () => clearTimeout(tm);
  }, [M]);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const w = useElWidth(wrapRef);
  const { fs, setFs, vh } = useFullscreen();
  const [rail, setRail] = useSticky("mapRail", false); // filters behind a button: a bottom sheet on phones, a column on wide screens
  const [flOpen, setFlOpen] = useSticky("mapFlOpen", true); // claims panel on the full-screen map
  // wide screens: no taller than the window leaves under the header, so the whole map is on the first screen
  const W = Math.max(300, w || 800);
  const winCap = W > 600 && typeof window !== "undefined" ? Math.max(420, window.innerHeight - 320) : 640;
  const H = fs ? Math.max(340, vh - 96) : Math.round(Math.min(640, winCap, Math.max(340, W * 0.66)));
  const z = useZoom("mapZ", !!M, [1, 40], [[-W * 0.2, -H * 0.2], [W * 1.2, H * 1.2]]);
  const geo = useMapGeo(M, W, H);
  const F = (n: number) => fmt(Math.round(n), lang);
  const km1 = (n: number) => fmt(Math.round(n * 10) / 10, lang);
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
  /** ▶ the archive as a tour, run like a player (⏮ ▶/❚❚ ⏭ ■): each stop flies to a change of DeepState's line (zoom out,
   *  across, in), shows the snapshot before it, then swaps to the one after, so the cross-fade shows the line move. */
  const playRun = useRef(0), view = useRef({ geo, W, H });
  view.current = { geo, W, H };
  useEffect(() => () => { playRun.current++; }, []);
  const fly = (ll: [number, number][], ms = 1400) => {
    const { geo: g, W: w, H: h } = view.current;
    if (!g) return;
    const pts = ll.map((p) => g.proj(p)!), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    // the change fills half the view at most, and the view stays ≥ ~100 km wide so the place reads in context
    z.to(zoomIdentity.translate(w / 2, h / 2).scale(Math.min(12, 0.5 / Math.max((x1 - x0) / w, (y1 - y0) / h, 0.02))).translate(-(x0 + x1) / 2, -(y0 + y1) / 2), ms);
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const show = async (k: number, list: Stop[], live: () => boolean) => {
    const st = list[k];
    setAt(k); setSnap(st.d0); fly(st.pts);
    await sleep(1500);
    if (live()) setSnap(st.d);
  };
  /** Plays from stop k on; a new call (or pause/stop) ends the previous run. */
  const runFrom = async (k: number, list: Stop[]) => {
    const id = ++playRun.current, live = () => playRun.current === id;
    setPlay(true);
    for (; k < list.length && live(); k++) { await show(k, list, live); await sleep(2800); }
    if (!live()) return;
    setPlay(false);
    if (M && view.current.geo) z.to(fitFront(M, view.current.geo, view.current.W, view.current.H), 1400);
  };
  /** Prev/next stop: keeps playing from there if playing, else shows it and waits. */
  const goStop = (k: number) => {
    if (!stops || k < 0 || k >= stops.length) return;
    if (play) { runFrom(k, stops); return; }
    const id = ++playRun.current;
    show(k, stops, () => playRun.current === id);
  };
  const startTour = async () => {
    setTour(true); setPlay(true);
    const id = playRun.current;
    // ponytail: loads every archived snapshot (~190 KB each) up front; build the stops in build.py if the archive grows long
    const all = await Promise.all(snaps.map((d) => fetchJson<MapsData>(`/maps/archive/${d}.json`).catch(() => null)));
    if (playRun.current !== id) return;
    const list: Stop[] = [];
    for (let i = 1; i < snaps.length; i++) {
      const a = all[i - 1], b = all[i];
      if (!a || !b) continue;
      const ps = lineChanges(a, b).slice(0, 4);
      ps.forEach((pts, j) => list.push({ pts, ll: [pts.reduce((x, p) => x + p[0], 0) / pts.length, pts.reduce((x, p) => x + p[1], 0) / pts.length], d0: snaps[i - 1], d: snaps[i], j: j + 1, n: ps.length }));
    }
    setStops(list);
    runFrom(0, list);
  };
  // the caption of the change in view: DeepState's own note on a place near it (its update notes are in the newest
  // snapshot only), else the nearest town; plus the latest DIVGEN claim near it in the two weeks before
  const DSE = useJson<MapsData>(tour && snaps.length ? `/maps/archive/${snaps[snaps.length - 1]}.json` : null).data?.dsEvents;
  const cap = piece && M ? (() => {
    const c = { lng: piece.ll[0], lat: piece.ll[1] }, n0 = dayN(piece.d0) - 1, n1 = dayN(piece.d);
    const near = <T extends { lat: number; lng: number }>(xs: T[], km: number) => xs.map((x) => [x, kmBetween(x, c)] as const).filter(([, k]) => k < km).sort((a, b) => a[1] - b[1]).map(([x]) => x);
    // one DeepState note can link several places: keep it once, at the place nearest the change
    const ds = near((DSE || []).filter((e) => { const n = dayN(e.d); return n >= n0 && n <= n1; }), 20).filter((e, i, xs) => xs.findIndex((x) => x.id === e.id) === i);
    const cl = near(M.events.filter((e) => { const n = dayN(e.d); return n > n1 - 14 && n <= n1; }), 20).sort((a, b) => (a.d < b.d ? 1 : -1));
    const city = near(M.cities, 1e4)[0];
    return { ds, cl, city };
  })() : null;
  // the caption's items, numbered: each is also a point on the map; hover links the two, click flies to the point
  type CapItem = { key: string; lat: number; lng: number; ds?: NonNullable<MapsData["dsEvents"]>[number]; cl?: Ev };
  const capItems: CapItem[] = cap ? [
    ...(play ? cap.ds.slice(0, 1) : cap.ds).map((e) => ({ key: "d" + dsKey(e), lat: e.lat, lng: e.lng, ds: e })),
    ...(play ? cap.cl.slice(0, 1) : cap.cl.slice(0, 6)).filter((c) => !cap.ds.some((e) => e.ru?.id === c.id)).map((c) => ({ key: "c" + c.id + c.d, lat: c.lat, lng: c.lng, cl: c })),
  ] : [];
  const [capHl, setCapHl] = useState<string | null>(null);
  const capRef = useRef<HTMLDivElement>(null);
  useEffect(() => setCapHl(null), [at]);
  const capPick = (it: CapItem, fromMap = false) => {
    if (play) pausePlay();
    setCapHl(it.key);
    if (fromMap) capRef.current?.querySelector(`[data-k="${CSS.escape(it.key)}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    else if (geo) { const [x, y] = geo.proj([it.lng, it.lat])!; z.to(zoomIdentity.translate(W * 0.66, H * 0.55).scale(Math.max(z.t.k, 10)).translate(-x, -y), 900); }
  };
  const pausePlay = () => { playRun.current++; setPlay(false); if (piece) setSnap(piece.d); }; // paused mid-stop: show the change done
  const endTour = () => { pausePlay(); setTour(false); setAt(-1); };
  /** ■: the tour ends and the map goes back to the issue's snapshot and the whole front. */
  const stopTour = () => { endTour(); setSnap(pageSnap); if (M && geo) z.to(fitFront(M, geo, W, H), 900); };
  const togglePlay = () => {
    if (play) return pausePlay();
    if (tour && stops?.length) return runFrom(at + 1 < stops.length ? at + 1 : 0, stops);
    startTour();
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
  const dsShown = M && dse ? dsOnce(M.dsEvents || []).filter((e) => { const n = dayN(e.d); return n > end - per && n <= end && (!dir || dirOf(e) === dir); }).sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0)) : [];
  const [dsHl, setDsHl] = useState<string | null>(null);
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
    if (dse) (["ru", "ua", "fix"] as const).filter((x) => M.dsEvents?.some((e) => e.k === x)).forEach((x) => legend.push(<span key={"ds" + x}><DsIco k={x} />{t.dsK[x]}</span>));
    if (OM && oSnap && !tour) {
      const d0 = dmy(oSnap).slice(0, 5);
      legend.push(<Sw key="cg" c="--m-occ" l={t.chgGain(d0)} />, <Sw key="cl" c="--m-onlyds" l={t.chgLoss(d0)} />, <span key="co"><i className="dash" />{t.chgOld(d0)}</span>);
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
    z.to(zoomIdentity.translate(W * 0.62, H * 0.55).scale(Math.max(z.t.k, 12)).translate(-x, -y), 1000);
    if (scroll) wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const focusDs = (e: { lat: number; lng: number }) => {
    if (!geo) return;
    const [x, y] = geo.proj([e.lng, e.lat])!;
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(Math.max(z.t.k, 12)).translate(-x, -y), 1000);
    wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const dsLine = (e: NonNullable<MapsData["dsEvents"]>[number]) => e.ru ? <>DIVGEN #{e.ru.id}, {dmy(e.ru.d).slice(0, 5)}: {hs(e.ru.t)} <Lag n={e.ru.lag} t={t} /></> : t.dsNoRu;
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
  // frame the front; again once the size settles (the map is laid out hidden until its data is here, so the first fit
  // is for the wrong width) — unless the reader or a shared link has moved the map since the last automatic fit
  // arriving on /maps/<section>: once the map is in, the page opens at that section
  const secShown = useRef(false);
  useEffect(() => {
    if (!sec0 || !M || secShown.current) return;
    secShown.current = true;
    setTimeout(() => secRef.current?.scrollIntoView({ block: "start" }), 200);
  }, [M, sec0]);
  const autoFit = useRef<string | null>(null);
  useEffect(() => {
    if (!M || !geo) return;
    if (z.t.toString() !== autoFit.current && !(z.t.k === 1 && z.t.x === 0 && z.t.y === 0)) return;
    const f = fitFront(M, geo, W, H);
    autoFit.current = f.toString();
    z.to(f, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [M, geo]);
  // presets: three ready views instead of setting the rail by hand
  const pr = PRESETS.find((p) => p.mode === mode && p.ev === ev && p.dse === dse && p.per === per && (!p.pair || p.pair === pair))?.id;
  const preset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)!;
    setMode(p.mode); if (p.pair) setPair(p.pair); setEv(p.ev); setDse(p.dse); setPer(p.per); setOff(0); setVf(ALL_V); pickDir(null);
    if (id === "new" && !chg) setChg(7);
  };
  const wk = dsOnce(M?.dsEvents || [], (e) => dsUpd(e) + e.k).filter((e) => { const n = dayN(e.d); return n > wkEnd - 7 && n <= wkEnd; });
  const wkN = (x: string) => wk.filter((e) => e.k === x).length, wkEarly = wk.filter((e) => e.ru && e.ru.lag > 0).length;
  // a DeepState change opened from the week strip or the map: its card stays until closed; `xs` = the set it was opened from
  const [dsSel, setDsSel] = useState<{ xs: NonNullable<MapsData["dsEvents"]>; i: number } | null>(null);
  const openDs = (xs: NonNullable<MapsData["dsEvents"]>, i = 0) => { setSel(null); setDsSel({ xs, i }); setDse(true); setDsHl(dsKey(xs[i])); focusDs(xs[i]); };
  const dArea = M && PM ? M.areas.ds_nc - PM.areas.ds_nc : null;
  const areaStr = dArea != null && prevSnap ? (dArea > 0 ? "+" : dArea < 0 ? "−" : "±") + F(Math.abs(dArea)) + (lang === "uk" ? " км²" : " km²") : null;
  // the month of claims against DeepState: how many it does not confirm (2–10 km off, or farther)
  const cl30s = M ? M.events.filter((e) => dayN(e.d) > last - 30) : [];
  const cl30 = cl30s.length, notConf = cl30s.filter((e) => ["ua", "far"].includes(vgOf(e.ds))).length;
  const topDir = DIRS.filter((d) => gsOf(d) != null).sort((a, b) => gsOf(b)! - gsOf(a)!)[0];
  // fact-check: claims in the period that DeepState and ISW reject hardest (over 10 km > 2–10 km off the line), newest first
  // the feed under the map: what each side said in the rail's period (and direction), newest first, as a slider —
  // russian claims with what DeepState and ISW show there, DeepState's changes with whether and when russia claimed them
  const [fcF, setFcF] = useSticky<"all" | "ru" | "ds">("mapFcF", "all");
  const fcRef = useRef<HTMLOListElement>(null);
  const dsIn = dsOnce(M?.dsEvents || []).filter((e) => { const n = dayN(e.d); return n > end - per && n <= end && (!dir || dirOf(e) === dir); });
  const dsList = [...dsIn].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
  // the claims section lists the window's claims whether or not the map shows them (a row turns them on and flies there)
  const listed = inDir.filter((e) => vf[vgOf(e[ref])]).sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
  const fcAll: ({ d: string; cl: Ev; ds?: undefined } | { d: string; ds: DsE; cl?: undefined })[] = [
    ...inDir.map((cl) => ({ d: cl.d, cl, ds: undefined })), ...dsIn.map((ds) => ({ d: ds.d, ds, cl: undefined })),
  ].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : a.ds ? -1 : 1));
  const fc = fcAll.filter((x) => fcF === "all" || (fcF === "ds" ? x.ds : x.cl));
  const fcScroll = (k: number) => fcRef.current?.scrollBy({ left: k * fcRef.current.clientWidth * 0.9, behavior: "smooth" });
  useEffect(() => { fcRef.current?.scrollTo({ left: 0 }); }, [fcF, per, o, dir, snap]);
  const showClaim = (e: Ev) => { setEv(true); setVf(ALL_V); focusEv(e); };
  const showDs = (e: DsE) => { setDse(true); focusDs(e); };
  // shareable view: #v=ds&n=7&d=pok&s=2026-10-30&c=4338 (only what differs from the defaults)
  const hashRead = useRef(false), pendC = useRef<string | null>(null);
  useEffect(() => {
    if (hashRead.current) return; // read once: by a second run (React dev) the hash is already our own rewrite
    const h = new URLSearchParams(location.hash.slice(1)), g = (x: string) => h.get(x) || "";
    // a shared view (any hash): keys it leaves out mean the defaults the hash is written against (comparison, 30 days, claims on)
    if ([...h.keys()].length) { setMode("cmp"); setPer(30); setEv(true); }
    if (["ds", "isw", "dg", "cmp"].includes(g("v"))) setMode(g("v"));
    if (PAIR_SRC[g("p")]) setPair(g("p"));
    if (PERS.includes(+g("n"))) setPer(+g("n"));
    if (+g("o") > 0) setOff(+g("o"));
    if (DIRS.some((x) => x.id === g("d"))) setDir(g("d")); else if (dir0) setDir(dir0);
    if (/^\d{4}-\d{2}-\d{2}$/.test(g("s"))) setSnap(g("s"));
    if (h.has("e")) setEv(g("e") !== "0");
    if (h.has("a")) setDse(g("a") !== "0");
    if (h.has("g") && [0, 7, 30].includes(+g("g"))) setChg(+g("g"));
    pendC.current = g("c") || null;
    hashRead.current = true;
    if (!railInit && innerWidth <= 860) setRail(false); // phones: the map first, filters behind the button
    railInit = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (snaps.length && snap && !snaps.includes(snap)) setSnap(pageSnap); }, [snaps.length, snap]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const c = pendC.current;
    if (!c || !M || !geo) return;
    pendC.current = null;
    const e = M.events.find((x) => String(x.id) === c);
    if (e) { setEv(true); setVf(ALL_V); focusEv(e, false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [M, geo]);
  useEffect(() => {
    if (!hashRead.current) return;
    const h = new URLSearchParams();
    if (mode !== "cmp") h.set("v", mode); else if (pair !== "dg_ds") h.set("p", pair);
    if (per !== 30) h.set("n", String(per));
    if (o) h.set("o", String(o));
    if (dir) h.set("d", dir);
    if (!ev) h.set("e", "0");
    if (!dse) h.set("a", "0");
    if (chg !== 7) h.set("g", String(chg));
    if (snap && snap !== pageSnap) h.set("s", snap);
    if (selOn) h.set("c", String(selOn.id));
    const s = h.toString();
    history.replaceState(history.state, "", s ? "#" + s : location.pathname + location.search);
    setCopied(false);
  }, [mode, pair, per, o, dir, ev, dse, chg, snap, pageSnap, selOn]);
  /** A click on the map (not on a marker or label) measures from there to the occupied territory. */
  const mapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (tour || !geo || (e.target as Element).closest(".evs, .mp-dlab, .mp-chgs, .mp-pin")) return;
    const r = e.currentTarget.getBoundingClientRect(), px = ((e.clientX - r.left) * W) / r.width, py = ((e.clientY - r.top) * H) / r.height;
    const ll = geo.proj.invert!([(px - z.t.x) / z.t.k, (py - z.t.y) / z.t.k]);
    if (ll) setPin({ ll: ll as LL });
  };
  const showPin = (x: (typeof dist)[number]) => {
    setPin({ ll: x.ll, n: x.c.n }); frame([x.ll, x.now.at]);
    wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const pinName = pin && M ? pin.n ?? (() => {
    const c = M.cities.map((x) => [x, kmBetween(x, { lng: pin.ll[0], lat: pin.ll[1] })] as const).sort((a, b) => a[1] - b[1])[0];
    return c && c[1] < 60 ? t.distNear(c[0].n, km1(c[1])) : t.distPin;
  })() : "";
  const dd = (now: number, then: number | null) => {
    if (then == null) return <>—</>;
    const d = now - then;
    return Math.abs(d) < 0.05 ? <>—</> : <span className={d < 0 ? "closer" : "farther"} title={d < 0 ? t.distCloser : t.distFarther}>{(d < 0 ? "−" : "+") + km1(Math.abs(d))}</span>;
  };
  const copyLink = () => navigator.clipboard?.writeText(utm(location.href, "copy_link", "maps", "share")).then(() => setCopied(true), () => {});
  const k = z.t.k;
  const evTip = (e: Ev) => () => <>
    <div className="d">{dmy(e.d)}</div><div>{flags(hs(e.t))}</div>
    <div className="s">{"DeepState: " + t.evSt.ds[e.ds as "occ"] + " (" + t.evAsOf(M!.sources.deepstate.asOfLabel) + ")"}</div>
    <div className="s">{"ISW: " + t.evSt.isw[e.isw as "occ"] + " (" + t.evAsOf(M!.sources.isw.asOfLabel) + ")"}</div>
    <div className="s">{"DIVGEN #" + e.id}</div>
  </>;

  return (
    <section className="tlwrap mp mpx" id="maps">
      {/* the week in one line, then the map: the first screen answers "what changed" before any controls */}
      {M && <header className="mp-top">
        <div className="mp-top-h">
          {snap && <div className="mp-kick">{t.wkH(dayStr(wkEnd - 6), dayStr(wkEnd))} · DeepState</div>}
          <h1>{wkN("ru") + wkN("ua") ? t.wkLine(wkN("ru"), wkN("ua")) : t.wkNone}</h1>
          {areaStr && <p className="mp-sub"><Bold s={t.wkSub} v={[areaStr]} /></p>}
        </div>
        <dl className="mp-kpi">
          {areaStr && <div><dt>{t.kpiArea}</dt><dd className={dArea! > 0 ? "ru" : undefined}>{areaStr}</dd></div>}
          {cl30 > 0 && <div><dt>{t.kpiClaims}</dt><dd>{t.kpiOf(notConf, cl30)}</dd></div>}
          {topDir && <div><dt>{t.kpiDir(topDir[lang])}</dt><dd>{gsOf(topDir)}</dd></div>}
        </dl>
      </header>}
      <div className={"mp-grid" + (fs ? " fs" : "")} role={fs ? "dialog" : undefined} aria-modal={fs || undefined} aria-label={fs ? t.map : undefined}>
        {/* phones: the rail is a bottom sheet over the page; this backdrop closes it */}
        {rail && !fs && <button type="button" className="mp-scrim" aria-label={t.art.close} onClick={() => setRail(false)} />}
        <aside className="mp-rail" hidden={!rail} aria-label={t.mpFilters}>
          <fieldset>
            <legend>{t.mpSnapH}</legend>
            <div className="mp-step">
              <button type="button" aria-label={t.mpPrevD} title={t.mpPrevD} disabled={si <= 0} onClick={() => { endTour(); setSnap(snaps[si - 1]); }}>‹</button>
              <span><b>{snap ? dmy(snap) : "—"}</b>{M && <small>{t.mpSnapSrc(M.sources.deepstate.asOfLabel)}</small>}</span>
              <button type="button" aria-label={t.mpNextD} title={t.mpNextD} disabled={si < 0 || si >= snaps.length - 1} onClick={() => { endTour(); setSnap(snaps[si + 1]); }}>›</button>
            </div>
            {snaps.length > 1 && <div className="mp-playrow">
              <button type="button" className="mp-play" aria-pressed={play} onClick={togglePlay}>{play ? "❚❚ " + t.mpPause : "▶ " + t.mpPlay}</button>
              {tour && <button type="button" className="mp-play" onClick={stopTour}>■ {t.mpStop}</button>}
            </div>}
            {snap !== pageSnap && pageSnap && <button type="button" className="linkbtn" onClick={() => { endTour(); setSnap(pageSnap); }}>{t.mpSnapBack(dmy(pageSnap))}</button>}
          </fieldset>
          <fieldset>
            <legend>{t.mpView}</legend>
            <div className="seg mp-seg4" role="group" aria-label={t.mpView}>{SegBtn("ds", t.src.ds, mode, setMode)}{SegBtn("isw", "ISW", mode, setMode)}{SegBtn("dg", "DIVGEN", mode, setMode)}{SegBtn("cmp", t.mCmp, mode, setMode)}</div>
            {mode === "cmp" && <label className="mp-field">{t.mpPair}
              <select value={pair} onChange={(e) => setPair(e.target.value)}>{(["dg_ds", "dg_isw", "isw_ds"] as const).map((p) => <option key={p} value={p}>{t.pairs[p]}</option>)}</select>
            </label>}
          </fieldset>
          {snaps.length > 1 && <fieldset>
            <legend>{t.chgH}</legend>
            <div className="seg" role="group" aria-label={t.chgH}>{SegBtn(0, t.chgOff, chg, setChg)}{SegBtn(7, t.mpDays(7), chg, setChg)}{SegBtn(30, t.mpDays(30), chg, setChg)}</div>
            {OM && oSnap && <p className="mp-note">{diffs.length ? t.chgCnt(diffs.filter((c) => c.ru).length, diffs.filter((c) => !c.ru).length, dmy(oSnap)) : t.chgNone(dmy(oSnap))}</p>}
          </fieldset>}
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
              {sect && <button type="button" onClick={() => setDOff(dOff.length ? [] : DIRS.map((x) => x.id))}>{dOff.length ? t.mpDirAllOn : t.mpDirAllOff}</button>}
            </div>
            <div className="mp-dirlist" role="group" aria-label={t.mpDir}>
              <div className="mp-dirlist-h"><span>{t.mpDirAtt}</span><span>{t.mpDirCl}</span></div>
              {dirRank.map((d) => { const g = gsOf(d), l = d[lang], c = dcol(d), vis = !dOff.includes(d.id); return (
                <div className="mp-dirrow" key={d.id}>
                  {sect && <button type="button" className="sw" aria-pressed={vis} aria-label={t.mpDirShow(l)} title={t.mpDirShow(l)} onClick={() => toggleD(d.id)}
                    style={{ borderColor: c, background: vis ? c : "transparent" }} />}
                  <button type="button" aria-pressed={dir === d.id} onClick={() => pickDir(dir === d.id ? null : d.id)}
                    aria-label={`${l}: ${g != null ? t.mpGs(g, "") : t.mpGsNone}; ${t.mpDirClaims(dirCnt[d.id] || 0)}`}>
                    <span className="nm">{l}</span>
                    <span className="bar" aria-hidden="true"><i style={{ width: g ? Math.max(3, (g / gsMax) * 100) + "%" : 0, background: c }} /></span>
                    <span className="at">{g ?? "—"}</span>
                    <span className="cl">{dirCnt[d.id] || 0}</span>
                  </button>
                </div>
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
          {M?.dsEvents && <fieldset>
            <legend><label className="mp-chk"><input type="checkbox" checked={dse} onChange={() => setDse(!dse)} /><DsIco k="ru" />{t.dsAdv}</label></legend>
            {dse && <p className="mp-note">{t.dsCnt(dsShown.length, dsShown.filter((e) => e.ru).length)}</p>}
          </fieldset>}
          <div className="mp-rail-done"><button type="button" onClick={() => setRail(false)}>{t.wkShow}{ev ? ` · ${shown.length}` : ""}</button></div>
        </aside>
        <div className="mp-main">
          <div className="mp-bar-top">
            <div className="seg mp-prs" role="group" aria-label={t.prH}>{PRESETS.map((p) => (
              <button type="button" key={p.id} aria-pressed={pr === p.id} onClick={() => preset(p.id)}>{flags(t.pr[p.id as "new"])}</button>
            ))}</div>
            <RailBtn on={rail} set={(v) => { refit.current = true; setRail(v); }} label={t.mpFilters} />
            {fs && <div className="map-legend">{legend}</div>}
            <BaseSeg bm={bm} set={setBm} label={t.mBase} />
            {M && ev && <span className="map-src">{t.mpShown(shown.length, inPer.length)}</span>}
            <button type="button" className="linkbtn mp-copy" onClick={copyLink}>{copied ? "✓ " + t.mpCopied : "🔗 " + t.mpCopy}</button>
          </div>
          <div className="mp-row">
          <div className="map-wrap" ref={wrapRef}>
            {err ? <p className="map-src" style={{ padding: 16 }}>{t.mErr}</p> : !M || !geo ? <p className="map-src" style={{ padding: 16 }}>{t.mLoading}</p> : <>
              <svg className={"map-svg bm-" + bm} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.map} ref={z.svgRef} onKeyDown={onKey} onClick={mapClick}>
                {BASEMAPS[bm] && <Tiles256 id={bm} proj={geo.proj} t={z.t} W={W} H={H} />}
                <g transform={z.t.toString()}>
                  <Layers M={M} geo={geo} mode={mode} pair={pair} plain={bm === "s"} />
                  {fade && <g key={fade.n} className="mp-fade"><Layers M={fade.M} geo={geo} mode={mode} pair={pair} plain={false} /></g>}
                  {sect && !tour && cells && M.layers.ds_occ && <>
                    <mask id="mp-band" maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
                      <path d={geo.d(M.layers.ds_occ)} fill="none" stroke="#fff" strokeWidth={26} strokeLinejoin="round" />
                      {/* the occupied outline also runs along the state border and the coast: cut those out, keep the front */}
                      <path d={geo.d(M.base.find((bb) => bb.ua)?.c)} fill="none" stroke="#000" strokeWidth={30} strokeLinejoin="round" />
                    </mask>
                    <g className="mp-sect" mask="url(#mp-band)">{cells.map((c, i) => (
                      dVis(DIRS[i].id) && <path key={DIRS[i].id} d={c} className={dir === DIRS[i].id ? "on" : undefined} style={{ fill: dcol(DIRS[i]), stroke: dcol(DIRS[i]), fillOpacity: !dir ? 0.32 : dir === DIRS[i].id ? 0.6 : 0.14 }} />
                    ))}</g>
                  </>}
                  {OM?.layers.ds_occ && M.layers.ds_occ && !tour && <>
                    {/* gained = today's area minus the old one, lost = the old minus today's, both as SVG masks; the cut-out
                        gets a hairline stroke so the shared edges leave no seam */}
                    {([["mp-gain", OM], ["mp-loss", M]] as const).map(([id, cut]) => (
                      <mask key={id} id={id} maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
                        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#fff" />
                        <path d={geo.d(cut.layers.ds_occ)} fill="#000" stroke="#000" strokeWidth={1.5 / k} fillRule="evenodd" />
                      </mask>
                    ))}
                    <path className="mp-chg-gain" d={geo.d(M.layers.ds_occ)} mask="url(#mp-gain)" fillRule="evenodd" />
                    <path className="mp-chg-loss" d={geo.d(OM.layers.ds_occ)} mask="url(#mp-loss)" fillRule="evenodd" />
                    <path className="mp-chg-old" d={geo.d(OM.layers.ds_occ)} fillRule="evenodd" />
                  </>}
                  <Cities M={M} geo={geo} k={k} hidden={bm === "t"} />
                  {(ev || sect) && !tour && <g className="mp-dlab">{(() => {
                    // labels in screen px: right of the anchor unless that runs under the zoom buttons, then left, else (narrow
                    // map) slid inside the map above the anchor; top to bottom each moves below any label it would overlap, then
                    // from the bottom edge up so none hangs off the map; a leader line back to the anchor
                    const R = W - 56;
                    // a phone-width map has no room for a dozen labels over the front: only the direction picked in the filters
                    const ls = dirShown.filter((d) => (!sect || dVis(d.id)) && (W >= 600 || d.id === dir)).map((d) => {
                      const [x, y] = geo.proj([d.lng, d.lat])!, g = gsOf(d), l = d[lang], sx = x * k + z.t.x, sy = y * k + z.t.y;
                      return { d, x, y, g, l, sx, sy, lw: l.length * 5.9 + 24 + (g != null ? String(g).length * 7 + 8 : 0), vis: sx >= 0 && sx <= W && sy >= 0 && sy <= H, x0: 0, ty: 0 };
                    }).sort((a, b) => a.sy - b.sy);
                    const hit = (a: (typeof ls)[number], b: (typeof ls)[number]) => a.x0 < b.x0 + b.lw && b.x0 < a.x0 + a.lw;
                    ls.forEach((b, i) => {
                      const fit = b.sx + 22 + b.lw <= R ? b.sx + 22 : b.sx - 22 - b.lw >= 0 || !b.vis ? b.sx - 22 - b.lw : null;
                      b.x0 = fit ?? Math.max(4, Math.min(R - b.lw, b.sx - b.lw / 2));
                      b.ty = fit == null ? b.sy - 34 : b.sy - 10;
                      for (let moved = true; moved;) {
                        moved = false;
                        for (const p of ls.slice(0, i)) if (hit(b, p) && b.ty < p.ty + 22 && p.ty < b.ty + 22) { b.ty = p.ty + 22; moved = true; }
                      }
                    });
                    for (let i = ls.length - 1; i >= 0; i--) {
                      const b = ls[i];
                      if (b.vis) b.ty = Math.min(b.ty, H - 42, ...ls.slice(i + 1).filter((p) => hit(b, p)).map((p) => p.ty - 22));
                    }
                    return ls.map(({ d, x, y, g, l, sx, sy, lw, x0, ty }) => {
                      const on = dir === d.id, c = dcol(d), dy = ty + 10 - sy, lx = x0 - sx;
                      // the line meets the label's near side; a label slid over its anchor, its top or bottom edge
                      const side = lx > 0 ? lx : lx + lw < 0 ? lx + lw : null;
                      return (
                        <g key={d.id} transform={`translate(${x},${y}) scale(${1 / k})`} className={on ? "on" : undefined} onClick={() => pickDir(on ? null : d.id)} role="button" tabIndex={0} aria-pressed={on} aria-label={`${t.mpDir}: ${l}`}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickDir(on ? null : d.id); } }}>
                          <line x1={0} y1={0} x2={side ?? Math.max(lx, Math.min(lx + lw, 0))} y2={side != null ? dy : dy + (dy < 0 ? 10 : -10)} />
                          {on && <rect className="halo" x={lx - 3} y={dy - 13} width={lw + 6} height={26} rx={4} />}
                          <rect x={lx} y={dy - 10} width={lw} height={20} rx={2} style={{ stroke: c }} />
                          <rect className="sw" x={lx + 4} y={dy - 5} width={10} height={10} rx={2} style={{ fill: c }} />
                          <text x={lx + 18} y={dy + 4}>{l}{g != null && <tspan className="n" dx={6}>{g}</tspan>}</text>
                        </g>
                      );
                    });
                  })()}</g>}
                  {OM && oSnap && !tour && <g className="mp-chgs">{diffs.map((c, i) => {
                    const [x, y] = geo.proj(c.ll)!;
                    return <g key={i} className={c.ru ? "ru" : "ua"} transform={`translate(${x},${y}) scale(${1 / k})`} onClick={() => fly(c.pts, 900)}
                      {...tipHandlers(setTip, () => t.chgTip(c.ru, dmy(oSnap).slice(0, 5), dmy(snap!).slice(0, 5)))}
                      role="button" aria-label={t.chgTip(c.ru, dmy(oSnap).slice(0, 5), dmy(snap!).slice(0, 5))}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fly(c.pts, 900); } }}><circle className="h" r={12} /><circle r={12} /></g>;
                  })}</g>}
                  {pin && pinD && (() => {
                    const [x, y] = geo.proj(pin.ll)!, [ax, ay] = geo.proj(pinD.at)!;
                    return <g className="mp-pin" onClick={() => setPin(null)}>
                      {pinD.km > 0 && <line x1={x} y1={y} x2={ax} y2={ay} />}
                      {pinD.km > 0 && <circle className="at" cx={ax} cy={ay} r={3 / k} />}
                      <g transform={`translate(${x},${y}) scale(${1 / k})`}><circle r={6} /><text x={10} y={4}>{pinD.km > 0 ? km1(pinD.km) + " " + t.distKm : t.distOcc}</text></g>
                    </g>;
                  })()}
                  {!tour && <g className="evs">{[...shown].sort((a, b) => +(a === selOn || a.id === hl) - +(b === selOn || b.id === hl)).map((e) => {
                    const [x, y] = geo.proj([e.lng, e.lat])!;
                    return <g key={e.id + "" + e.d} transform={`translate(${x},${y}) scale(${1 / k})`} style={{ cursor: "pointer" }} onClick={() => setSel(e)} {...tipHandlers(setTip, evTip(e))}><Mark g={vgOf(e[ref])} hl={e === selOn || e.id === hl} /></g>;
                  })}</g>}
                  {!tour && <g className="evs">{dsShown.map((e) => {
                    const [x, y] = geo.proj([e.lng, e.lat])!;
                    return <g key={dsKey(e)} transform={`translate(${x},${y}) scale(${1 / k})`} {...tipHandlers(setTip, () => <>
                      <div className="d">{dmy(e.d)} · DeepState · {t.dsK[e.k]}</div><div>{hs(e.t)}</div><div className="s">{dsLine(e)}</div>
                    </>)} style={{ cursor: "pointer" }} onClick={() => openDs([e])}><DsMark k={e.k} hl={dsHl === dsKey(e) || dsHl === dsUpd(e) || dsKey(e) === (dsSel && dsKey(dsSel.xs[dsSel.i]))} /></g>;
                  })}</g>}
                  {tour && <g className="evs mp-capp">{capItems.map((it, i) => ({ it, i })).sort((a, b) => +(a.it.key === capHl) - +(b.it.key === capHl)).map(({ it, i }) => {
                    const [x, y] = geo.proj([it.lng, it.lat])!, on = it.key === capHl;
                    return <g key={it.key} transform={`translate(${x},${y}) scale(${1 / k})`} className={on ? "on" : undefined} style={{ cursor: "pointer" }}
                      onPointerEnter={() => setCapHl(it.key)} onClick={() => capPick(it, true)}>
                      {it.ds ? <DsMark k={it.ds.k} hl={on} /> : <Mark g={vgOf(it.cl!.ds)} hl={on} />}
                      <g transform={`translate(${on ? 13 : 9},${on ? -13 : -9})`}><circle r={7} /><text y={3.5}>{i + 1}</text></g>
                    </g>;
                  })}</g>}
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
                {snaps.length > 1 && <button type="button" aria-label={play ? t.mpPause : t.mpPlay} title={play ? t.mpPause : t.mpPlay} aria-pressed={play} onClick={togglePlay}>{play ? "❚❚" : "▶"}</button>}
                {tour && <button type="button" aria-label={t.mpStop} title={t.mpStop} onClick={stopTour}>■</button>}
                <FsButton fs={fs} onClick={toggleFs} />
              </div>
              <div className="mp-ov">{/* top-left: claims list (full screen), the picked claim's card right under it */}
              {fs && ev && !tour && <div className={"mp-fl" + (flOpen ? " open" : "")}>
                <button type="button" className="mp-fl-h" aria-expanded={flOpen} onClick={() => setFlOpen(!flOpen)}><b>{t.mpList}</b> <span>{shown.length}</span><i aria-hidden="true">{flOpen ? "▾" : "▸"}</i></button>
                {flOpen && <ol>{shown.map((e) => (
                  <li key={e.id + "" + e.d}><button type="button" aria-current={e === selOn || undefined} onPointerEnter={() => setHl(e.id)} onPointerLeave={() => setHl(null)} onClick={() => focusEv(e, false)}>
                    <MarkIco g={vgOf(e[ref])} /><span className="d">{dmy(e.d).slice(0, 5)}</span><span>{flags(hs(e.t))}</span>
                  </button></li>
                ))}</ol>}
              </div>}
              {piece && cap && stops && <div className={"mp-sel mp-cap" + (play ? "" : " open")} role="status" ref={capRef}>
                <div className="d">{dmy(piece.d0).slice(0, 5)} → {dmy(piece.d)} · {t.mpPiece(piece.j, piece.n)}</div>
                {/* playing: the main line of each; paused: everything known about the place, to read at leisure */}
                {!cap.ds.length && <div className="tx">{t.mpNear(cap.city?.n || "—")}</div>}
                <div className="mp-capl">{capItems.map((it, i) => (
                  <button type="button" key={it.key} data-k={it.key} className={"mp-capi" + (it.key === capHl ? " on" : "")}
                    onPointerEnter={() => setCapHl(it.key)} onPointerLeave={() => setCapHl(null)} onFocus={() => setCapHl(it.key)} onClick={() => capPick(it)}>
                    <i>{i + 1}</i>
                    {it.ds ? <span>
                      <span className="tx"><DsIco k={it.ds.k} /> {flags(hs(it.ds.t))} <span className="dd">{dmy(it.ds.d).slice(0, 5)}</span></span>
                      {it.ds.ru && <span className="v">{flags(t.mpCapRu(dmy(it.ds.ru.d).slice(0, 5), hs(it.ds.ru.t)))} <Lag n={it.ds.ru.lag} t={t} /></span>}
                    </span> : <span><span className="v"><MarkIco g={vgOf(it.cl!.ds)} /> <span>DIVGEN {dmy(it.cl!.d).slice(0, 5)}: {flags(hs(it.cl!.t))} — DeepState: {t.evSt.ds[it.cl!.ds as "occ"]}</span></span></span>}
                  </button>
                ))}</div>
                <div className="nav">
                  <button type="button" aria-label={t.mpPrevStop} title={t.mpPrevStop} disabled={at <= 0} onClick={() => goStop(at - 1)}>‹</button>
                  <button type="button" aria-label={play ? t.mpPause : t.mpPlay} title={play ? t.mpPause : t.mpPlay} aria-pressed={play} onClick={togglePlay}>{play ? "❚❚" : "▶"}</button>
                  <button type="button" aria-label={t.mpNextStop} title={t.mpNextStop} disabled={at >= stops.length - 1} onClick={() => goStop(at + 1)}>›</button>
                  <span>{at + 1} / {stops.length}</span>
                  <button type="button" aria-label={t.mpStop} title={t.mpStop} onClick={stopTour}>■</button>
                </div>
              </div>}
              {dsSel && !tour && (() => { const e = dsSel.xs[dsSel.i]; return (
                <div className="mp-sel mp-dsc" role="status">
                  <button type="button" aria-label={t.art.close} title={t.art.close} onClick={() => { setDsSel(null); setDsHl(null); }}>×</button>
                  <div className="d">{dmy(e.d)} · {t.fcDsL}</div>
                  <div className="tx"><DsIco k={e.k} /> {flags(hs(e.t))}</div>
                  <div className="v">{t.dsK[e.k]}</div>
                  {e.ru ? <div className="v"><MarkIco g="occ" /> <span>{flags(t.mpCapRu(dmy(e.ru.d).slice(0, 5), hs(e.ru.t)))} <Lag n={e.ru.lag} t={t} /></span></div> : <div className="v map-src">{t.dsNoRu}</div>}
                  {dsSel.xs.length > 1 && <div className="nav">
                    <button type="button" aria-label={t.fcPrev} title={t.fcPrev} disabled={dsSel.i <= 0} onClick={() => openDs(dsSel.xs, dsSel.i - 1)}>‹</button>
                    <span>{dsSel.i + 1} / {dsSel.xs.length}</span>
                    <button type="button" aria-label={t.fcNext} title={t.fcNext} disabled={dsSel.i >= dsSel.xs.length - 1} onClick={() => openDs(dsSel.xs, dsSel.i + 1)}>›</button>
                  </div>}
                </div>
              ); })()}
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
              {play && snap && <div className="mp-playdate" aria-live="polite">{dmy(snap)}</div>}
              <Attr bm={bm} />
              <MapTip tip={tip} wrap={wrapRef} />
              {z.hint && <div className="map-hint" aria-hidden="true">{t.mWheel}</div>}
            </>}
          </div>
          {/* the week's DeepState changes: beside the map on wide screens, under it on phones; a click flies the map there */}
          {M?.dsEvents && snap && !fs && <aside className="mp-wkl" aria-label={t.dsAdv}>
            <div className="mp-wkl-h"><b>{t.dsAdv}</b><span>{dayStr(wkEnd - 6)}–{dayStr(wkEnd)}</span></div>
            {wk.length ? <ol>{[...wk].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0)).map((e) => (
              <li key={dsKey(e) + e.k}><button type="button" onClick={() => openDs([e])}>
                <DsIco k={e.k} />
                <span><span className="d">{dmy(e.d).slice(0, 5)}</span> {flags(hs(e.t))}
                  {e.ru && <span className="v">{flags(t.mpCapRu(dmy(e.ru.d).slice(0, 5), hs(e.ru.t)))} <Lag n={e.ru.lag} t={t} /></span>}</span>
              </button></li>
            ))}</ol> : <p className="mp-note">{t.wkNone}</p>}
            {OM && oSnap && <p className="mp-note">{diffs.length ? t.chgCnt(diffs.filter((c) => c.ru).length, diffs.filter((c) => !c.ru).length, dmy(oSnap)) : t.chgNone(dmy(oSnap))}</p>}
            {snaps.length > 1 && <button type="button" className="mp-play" aria-pressed={play} onClick={togglePlay}>{play ? "❚❚ " + t.mpPause : "▶ " + t.mpPlay}</button>}
          </aside>}
          </div>
          {/* under the map, so on phones the map comes right after the filter button (full screen: in the top bar) */}
          {!fs && <div className="map-legend">{legend}</div>}
          {/* below the map: the comparison of sources as sections, one open at a time; each has a page of its own
              (/maps/claims…) on the latest issue, so a switch is a page view and only the open one is rendered */}
          {M && <div className="mp-head"><h2>{t.mpH}</h2><p>{flags(t.mpLede)}</p></div>}
          {M && <nav className="mp-secs" aria-label={t.secNav} ref={secRef}>{MAP_SECS.filter((x) => x !== "distance" || dist.length > 0).map((x) => (
            <a key={x} href={mapSecHref(lang, x)} aria-current={sec === x ? "page" : undefined} onClick={(e) => { e.preventDefault(); pickSec(x); }}>
              <b>{t.secs[x]}</b><span>{x === "claims" ? `${t.kpiOf(cnt.ua + cnt.far, inDir.length)} ${t.secNotConf}` : x === "changes" ? <>{flags(t.fcDsF)} {dsIn.length} · {flags(t.fcRuF)} {inDir.length}</> : x === "distance" ? `${dist[0].c.n} — ${km1(dist[0].now.km)} ${t.distKm}` : `DeepState ${F(M.areas.ds_nc)} ${lang === "uk" ? "км²" : "km²"}`}</span>
            </a>
          ))}</nav>}
          {M && sec && <section className="mp-secb" aria-label={t.secs[sec]}>
            <h2>{sec === "claims" ? t.secClaims : sec === "changes" ? flags(t.dsAdvH) : sec === "distance" ? t.distH : t.secAreas}</h2>
            {sec === "claims" && <>
              <VerdictBar t={t} head={t.mpBar(inPer.length, per, t.src[ref])} cnt={cnt} on={vf} pick={pickV} />
              {!ev && <button type="button" className="mp-play" onClick={() => { preset("claims"); wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }); }}>{flags(t.pr.claims)}: {t.wkShow.toLowerCase()} ↑</button>}
              <div className="mp-list">
                {listed.length ? <div className="mp-list-sc"><table>
                  <thead><tr><th>{t.mpDate}</th><th>{t.mpClaim}</th><th>DeepState</th><th>ISW</th></tr></thead>
                  <tbody>{listed.map((e) => (
                    <tr key={e.id + "" + e.d} className={e === selOn ? "sel" : e.id === hl ? "hl" : undefined} onPointerEnter={() => setHl(e.id)} onPointerLeave={() => setHl(null)}>
                      <td className="d">{dmy(e.d).slice(0, 5)}</td>
                      <td><button type="button" className="linkbtn" onFocus={() => setHl(e.id)} onBlur={() => setHl(null)} aria-current={e === selOn || undefined} onClick={() => showClaim(e)}>{flags(hs(e.t))}</button></td>
                      <td><MarkIco g={vgOf(e.ds)} /> {t.evSt.ds[e.ds as "occ"]}</td>
                      <td><MarkIco g={vgOf(e.isw)} /> {t.evSt.isw[e.isw as "occ"]}</td>
                    </tr>
                  ))}</tbody>
                </table></div> : <p className="map-src" style={{ padding: "12px 16px" }}>{t.mpNone}</p>}
              </div>
            </>}
            {sec === "changes" && <>
          <div className="mp-fc">
            <div className="mp-fc-h">
              <b>{t.fcH(dayStr(end - per + 1), dayStr(end))}{dir && <> · {DIRS.find((x) => x.id === dir)![lang]}</>}</b>
              <div className="seg" role="group">{([["all", t.fcAll, fcAll.length], ["ru", t.fcRuF, inDir.length], ["ds", t.fcDsF, dsIn.length]] as const).map(([k, l, n]) =>
                <button type="button" key={k} aria-pressed={fcF === k} onClick={() => setFcF(k)}>{flags(l)} <span>{n}</span></button>)}</div>
              <div className="mp-fc-nav">
                <button type="button" aria-label={t.fcPrev} title={t.fcPrev} onClick={() => fcScroll(-1)}>‹</button>
                <button type="button" aria-label={t.fcNext} title={t.fcNext} onClick={() => fcScroll(1)}>›</button>
              </div>
            </div>
            {fc.length ? <ol ref={fcRef}>{fc.map((x) => x.cl ? (
              <li key={"c" + x.cl.id + x.cl.d} className={hl === x.cl.id ? "on" : undefined} onPointerEnter={() => setHl(x.cl!.id)} onPointerLeave={() => setHl(null)}>
                <div className="d">{dmy(x.d)} · {flags(t.fcRu)}</div>
                <q>{flags(hs(x.cl.t))}</q>
                <div className="v"><MarkIco g={vgOf(x.cl.ds)} /> DeepState: {t.evSt.ds[x.cl.ds as "occ"]}</div>
                <div className="v"><MarkIco g={vgOf(x.cl.isw)} /> ISW: {t.evSt.isw[x.cl.isw as "occ"]}</div>
                <button type="button" className="linkbtn" onClick={() => showClaim(x.cl!)}>{t.fcMap}</button>
              </li>
            ) : (
              <li key={"d" + dsKey(x.ds!)} className={"ds" + (dsHl === dsUpd(x.ds!) ? " on" : "")} onPointerEnter={() => setDsHl(dsUpd(x.ds!))} onPointerLeave={() => setDsHl(null)}>
                <div className="d">{dmy(x.d)} · {t.fcDsL}</div>
                <q>{flags(hs(x.ds!.t))}</q>
                <div className="v">{dsKinds(M.dsEvents || [], x.ds!).map((k) => <Fragment key={k}><DsIco k={k} /> {t.dsK[k]} </Fragment>)}</div>
                <div className="v">{x.ds!.ru ? <><MarkIco g="occ" /> <span>{flags(t.mpCapRu(dmy(x.ds!.ru.d).slice(0, 5), hs(x.ds!.ru.t)))} <Lag n={x.ds!.ru.lag} t={t} /></span></> : <span className="map-src">{t.dsNoRu}</span>}</div>
                <button type="button" className="linkbtn" onClick={() => showDs(x.ds!)}>{t.fcMap}</button>
              </li>
            ))}</ol> : <p className="map-src" style={{ padding: "12px 16px" }}>{t.mpNone}</p>}
          </div>
          <div className="mp-list">
            {dsList.length ? <div className="mp-list-sc"><table>
              <thead><tr><th>{t.mpDate}</th><th>DeepState</th><th>{t.dsRu}</th><th>{t.dsLag}</th></tr></thead>
              <tbody>{dsList.map((e) => (
                <tr key={dsKey(e)} className={dsHl === dsUpd(e) ? "hl" : undefined} onPointerEnter={() => setDsHl(dsUpd(e))} onPointerLeave={() => setDsHl(null)}>
                  <td className="d">{dmy(e.d).slice(0, 5)}</td>
                  <td><button type="button" className="linkbtn" onFocus={() => setDsHl(dsUpd(e))} onBlur={() => setDsHl(null)} onClick={() => showDs(e)}>{dsKinds(M.dsEvents || [], e).map((k) => <DsIco key={k} k={k} />)} {hs(e.t)}</button></td>
                  <td>{e.ru ? <>{dmy(e.ru.d).slice(0, 5)} · {flags(hs(e.ru.t))}</> : <span className="map-src">{t.dsNoRu}</span>}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{e.ru ? <Lag n={e.ru.lag} t={t} /> : "—"}</td>
                </tr>
              ))}</tbody>
            </table></div> : <p className="map-src" style={{ padding: "12px 16px" }}>{t.dsNone}</p>}
            <p className="map-src" style={{ padding: "8px 16px" }}>{t.dsNote}</p>
          </div>
            </>}
            {sec === "distance" && <>
          <div className="mp-list mp-dist">
            <div className="mp-list-h"><b>{t.distH}</b></div>
            <p className="mp-note">{t.distLede}</p>
            {pin && pinD && <div className="mp-dist-pin" role="status">
              <span>📍 {pinName}</span><b>{pinD.km > 0 ? `${km1(pinD.km)} ${t.distKm}` : t.distOcc}</b>
              <button type="button" aria-label={t.art.close} title={t.art.close} onClick={() => setPin(null)}>×</button>
            </div>}
            <div className="mp-list-sc"><table>
              <thead><tr><th>{t.distCity}</th><th className="num">{t.distNow}, {t.distKm}</th>{PM && <th className="num">{t.distAgo(7)}</th>}{MM && <th className="num">{t.distAgo(30)}</th>}</tr></thead>
              <tbody>{(distAll ? dist : dist.slice(0, 8)).map((x) => (
                <tr key={x.c.n} className={pin?.n === x.c.n ? "sel" : undefined}>
                  <td><button type="button" className="linkbtn" title={t.distShow} onClick={() => showPin(x)}>{x.c.n}</button></td>
                  <td className="num">{km1(x.now.km)}</td>
                  {PM && <td className="num">{dd(x.now.km, x.w)}</td>}
                  {MM && <td className="num">{dd(x.now.km, x.m)}</td>}
                </tr>
              ))}</tbody>
            </table></div>
            {dist.length > 8 && <button type="button" className="linkbtn mp-dist-more" onClick={() => setDistAll(!distAll)}>{distAll ? t.distFew : t.distAll(dist.length)}</button>}
            <p className="map-src" style={{ padding: "8px 16px" }}>{t.distNote}</p>
          </div>
            </>}
            {sec === "areas" && <div className="tiles map-tiles"><Tiles items={areaTiles(M, t, F, mode, pair)} /></div>}
          </section>}
          {/* what the ground the map shows taken cost (the "line then and now" period) */}
          {M && !fs && D.date === LATEST.date && <LandCostNote an={an} chg={chg} />}
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
type Target = { id?: string; cat: string; name: string; sub: string; lat: number; lng: number; approx?: boolean; src: string };
const TG_CATS = ["fuel", "en", "air", "mil", "dc"] as const;
const dmy = (d: string) => d.split("-").reverse().join(".");
const byDate = (a: Strike, b: Strike) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
const FAR_LNG = 61;

/** `onReady`: on /strikes the server HTML stays until the data is here; nothing renders before that. */
export function StrikesMap({ onReady, an }: { onReady?: () => void; an?: Analytics | null }) {
  const { t: TT, lang, D, LATEST, goItem } = useApp();
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
  const [bm, setBm] = useSticky("stkBase", "t");
  const [tip, setTip] = useState<Tip>(null);
  const maps = useJson<MapsData>("/maps/maps.json");
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
  const k = z.t.k;
  const selXs = sel ? items.filter((x) => placeKey(x) === sel) : [];
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
      {S && D.date === LATEST.date && <PotentialNote an={an} />}
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
          {dirty && <button type="button" className="linkbtn" onClick={reset}>{t.reset}</button>}
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
              {z.hint && <div className="map-hint" aria-hidden="true">{TT.mWheel}</div>}
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
            <p className="map-src">{flags(S ? t.distNote(S.base.ctrlAsOf || "") + " " + (S.stk.coverage ? (S.stk.coverage[lang] ?? S.stk.coverage.en) + " " : "") : "")}</p>
          </details>
        </div>
      </div>
    </section>
  );
}

/* ---------- Potential targets (/strikes/targets): maps/targets.json against the weapon ranges in lib/weapons.ts ---------- */
const Diamond = ({ r, fill, stroke }: { r: number; fill: string; stroke: string }) => (
  <svg className="mk" width={2 * r + 2} height={2 * r + 2} viewBox={`-${r + 1} -${r + 1} ${2 * r + 2} ${2 * r + 2}`} aria-hidden="true"><path d={`M0,-${r}L${r},0L0,${r}L-${r},0Z`} fill={fill} stroke={stroke} strokeWidth={1.6} /></svg>
);

/** Which targets each weapon reaches: distance to the front = stkDist (the strikes' 📏); the band is a disc of the range
 *  around every 3rd front point, clipped to russia + the occupied area; "struck nearby" = a strike of a matching group ≤10 km. */
/** `onReady`: the server HTML (TargetsSeo) stays until the data is here; nothing renders before that. */
export function TargetsMap({ onReady }: { onReady?: () => void }) {
  const { t: TT, lang } = useApp();
  const hs = (x: string) => hsBase(x, lang);
  const t = TT.stk;
  const sd = useJson<StrikesData>("/strikes.json"), sb = useJson<StrikesBase>("/maps/strikes-base.json");
  const tg = useJson<{ items: Target[]; note?: string }>("/maps/targets.json");
  const maps = useJson<MapsData>("/maps/maps.json");
  const B = sb.data, err = sd.err || sb.err || tg.err;
  const [wpn, setWpn] = useSticky("tgWpn", "lneptune");
  const [scope, setScope] = useSticky<"in" | "all">("tgScope", "in");
  const [cat, setCat] = useSticky<Record<string, boolean>>("tgCat", { fuel: true, en: true, air: true, mil: true, dc: true });
  const [bm, setBm] = useSticky("stkBase", "t");
  const [rail, setRail] = useSticky("tgRail", true);
  const [sel, setSel] = useState<string | null>(null);
  const [tip, setTip] = useState<Tip>(null);
  const wp = WEAPONS.find((x) => x.id === wpn) || WEAPONS[0], wName = wpnName(wp, lang);
  const tgs = useMemo(() => (B && tg.data ? tg.data.items.map((x, i) => ({ ...x, key: x.id || String(i), km: stkDist(B, x) ?? 0 })) : []), [B, tg.data]);
  const ready = !!B && tgs.length > 0;
  const wrapRef = useRef<HTMLDivElement>(null);
  const w = useElWidth(wrapRef, ready);
  const { fs, setFs, vh } = useFullscreen();
  const W = Math.max(300, w || 800), H = fs ? Math.max(340, vh - 96) : Math.round(Math.min(620, Math.max(340, W * 0.7)));
  const z = useZoom("tgPageZ", ready, [0.4, 12], [[-W * 1.5, -H * 0.8], [W * 2.5, H * 1.6]]);
  const strikes = (sd.data?.items || []).filter((x) => x.lat != null);
  const hits = (x: Target) => strikes.filter((s) => TG_MATCH[x.cat].includes(grpOf(s)) && kmBetween(s, x) <= 10).sort(byDate);
  const kmTxt = (n: number) => fmt(n, lang) + " " + t.km;

  const geo = useMemo(() => {
    if (!ready) return null;
    const ua = B!.base.find((b) => b.ua)!;
    const pts = tgs.filter((x) => x.lng <= FAR_LNG).map((x) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [x.lng, x.lat] } }) as GeoPermissibleObjects);
    const proj = geoMercator().fitExtent([[28, 28], [W - 64, H - 28]], { type: "FeatureCollection", features: [mp(ua.c), ...pts] } as GeoPermissibleObjects);
    const path = geoPath(proj);
    return { proj, d: (c?: Rings) => (c && c.length ? path(mp(c)) || "" : "") };
  }, [ready, B, tgs, W, H]);
  const band = useMemo(() => {
    if (!geo || !B?.ctrl) return null;
    const dl = wp.r / 111.2;
    return B.ctrl.filter((_, i) => i % 3 === 0).map(([lng, lat], i) => {
      const a = geo.proj([lng, lat])!, n = geo.proj([lng, Math.min(85, lat + dl)])!, s = geo.proj([lng, Math.max(-85, lat - dl)])!;
      return <circle key={i} cx={a[0]} cy={a[1]} r={(s[1] - n[1]) / 2} />;
    });
  }, [geo, B, wp.r]);
  const keepView = useKeepView(z, geo, W, H, [0.4, 12]);
  useWholeOnFs(fs, z);

  const pickCat = (c: string) => { const n = { ...cat, [c]: !cat[c] }; if (!Object.values(n).some(Boolean)) n[c] = true; setCat(n); };
  const shown = tgs.filter((x) => cat[x.cat]);
  const inR = shown.filter((x) => x.km <= wp.r).sort((a, b) => a.km - b.km);
  const outR = shown.filter((x) => x.km > wp.r).sort((a, b) => a.km - b.km);
  const rows = scope === "in" ? inR : [...inR, ...outR].sort((a, b) => a.km - b.km);
  const tc: Record<string, number> = { fuel: 0, en: 0, air: 0, mil: 0, dc: 0 };
  tgs.forEach((x) => { if (scope === "all" || x.km <= wp.r) tc[x.cat]++; }); // a type with none here is disabled
  const X = tgs.find((x) => x.key === sel);
  const far = inR.at(-1), next = outR[0], k = z.t.k;
  const focusTg = (x: (typeof tgs)[number]) => {
    setSel(x.key);
    if (!geo) return;
    const [px, py] = geo.proj([x.lng, x.lat])!, s = Math.max(z.t.k, 1.6);
    z.to(zoomIdentity.translate(W / 2, H / 2).scale(s).translate(-px, -py), 400);
    wrapRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  useEffect(() => { if (ready) onReady?.(); }, [ready, onReady]);
  if (onReady && !ready && !err) return null;
  return (
    <section className="tlwrap mp stk-page tg-page" id="targets">
      <div className="mp-head"><h2>{t.tgTitle}</h2><p>{flags(t.tgSub)}</p></div>
      <div className="tiles map-tiles">{ready && <Tiles items={[
        [t.tgTIn, fmt(inR.length, lang), t.tgOfAll(fmt(shown.length, lang), wName)],
        [t.tgTMil, fmt(inR.filter((x) => x.cat === "mil").length, lang), t.tgTMilSub],
        [t.tgTFar, far ? <>{fmt(far.km, lang)}<sub>{t.km}</sub></> : "—", far ? hs(far.name) : ""],
        [t.tgTNext, next ? <>−{fmt(next.km - wp.r, lang)}<sub>{t.km}</sub></> : "—", next ? hs(next.name) + " · " + kmTxt(next.km) : t.tgAllIn],
      ]} />}</div>
      <div className={"mp-grid" + (fs ? " fs" : "")} role={fs ? "dialog" : undefined} aria-modal={fs || undefined} aria-label={fs ? t.tgTitle : undefined}>
        <aside className="mp-rail" hidden={!rail}>
          <fieldset>
            <legend>{t.wpH}</legend>
            <div className="tg-wp">
              {WPN_GROUPS.map((g) => <div key={g} className="tg-wpg">
                <span className="tg-wpl">{t.wpG[g]}</span>
                <div className="mp-dirs" role="group" aria-label={t.wpG[g]}>{WEAPONS.filter((x) => x.g === g).map((x) => (
                  <button type="button" key={x.id} aria-pressed={wpn === x.id} onClick={() => setWpn(x.id)}>
                    {wpnName(x, lang)}{x.limited && "*"} <small>{kmTxt(x.r)}</small>
                  </button>
                ))}</div>
              </div>)}
              <p className="mp-note">* {t.wpLim}</p>
              {wp.limited && <p className="tg-lim">{t.wpLimNote(wName)}</p>}
            </div>
          </fieldset>
        </aside>

        <div className="mp-main">
          <div className="mp-bar-top"><RailBtn on={rail} set={(v) => { keepView(); setRail(v); }} label={TT.mpFilters} /><b className="stk-h3">{t.tgBand(wName, fmt(wp.r, lang))}</b><BaseSeg bm={bm} set={setBm} label={TT.mBase} /></div>
          <div className="map-wrap" ref={wrapRef}>
            {err ? <p className="map-src" style={{ padding: 16 }}>{t.tgErr}</p> : !geo ? <p className="map-src" style={{ padding: 16 }}>{t.loading}</p> : <>
              <svg className={"map-svg bm-" + bm} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label={t.tgBand(wName, fmt(wp.r, lang))} ref={z.svgRef}>
                {BASEMAPS[bm] && <Tiles256 id={bm} proj={geo.proj} t={z.t} W={W} H={H} />}
                <g transform={z.t.toString()}>
                  {B!.base.map((b, i) => <path key={i} d={geo.d(b.c)} fill={b.ua ? "var(--m-ua)" : "var(--m-land)"} fillOpacity={bm === "s" ? 1 : 0} stroke="var(--m-border)" strokeWidth={b.ua ? 1.4 : 0.8} fillRule="evenodd" />)}
                  {maps.data?.layers?.ds_occ && <path d={geo.d(maps.data.layers.ds_occ)} fill="var(--m-occ)" fillOpacity={0.3} stroke="var(--m-occ)" strokeWidth={0.6} fillRule="evenodd" />}
                  <clipPath id="tg-clip">
                    {B!.base.filter((b) => b.ru).map((b, i) => <path key={i} d={geo.d(b.c)} />)}
                    {maps.data?.layers?.ds_occ && <path d={geo.d(maps.data.layers.ds_occ)} />}
                  </clipPath>
                  <g className="tg-band" fill="var(--accent)" opacity={bm === "t" ? 0.34 : 0.22} clipPath="url(#tg-clip)" aria-hidden="true">{band}</g>
                  <g className="city stk-city" aria-hidden="true">{STK_CITIES.filter((c) => c.t === 1 || k >= 2).map((c) => { const [x, y] = geo.proj([c.lng, c.lat])!; return (
                    <g key={c.en} transform={`translate(${x},${y}) scale(${1 / k})`}>
                      {c.cap ? <rect x={-3.5} y={-3.5} width={7} height={7} fill="var(--surface)" stroke="var(--m-city)" strokeWidth={1.8} /> : <circle r={2.6} fill="var(--m-city)" />}
                      <text x={6} y={4} fontSize={c.cap ? 13 : 11} fontWeight={c.cap ? 700 : 500}>{c[lang]}</text>
                    </g>
                  ); })}</g>
                  <g className="tgt">{[...shown].sort((a, b) => +(a.key === sel) - +(b.key === sel) || b.km - a.km).map((x) => {
                    const pp = geo.proj([x.lng, x.lat]);
                    if (!pp) return null;
                    const col = `var(${TG_COL[x.cat]})`, on = x.key === sel, ok = x.km <= wp.r, h = hits(x), pick = () => setSel(on ? null : x.key);
                    return (
                      <g key={x.key} className={"stk tgm" + (ok ? "" : " out")} transform={`translate(${pp[0]},${pp[1]}) scale(${1 / k})`} style={{ cursor: "pointer" }} role="button"
                        aria-label={`${t.tg[x.cat as "fuel"]}: ${hs(x.name)}, ${kmTxt(x.km)}`} aria-pressed={on}
                        onClick={pick} onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } }}
                        {...tipHandlers(setTip, () => <>
                          <div className="d">{flags(`◆ ${t.tg[x.cat as "fuel"]} · ${hs(x.name)}`)}</div><div>{flags(hs(x.sub) + (x.approx ? " · ≈" : ""))}</div>
                          <div style={{ fontWeight: 600 }}>{"📏 " + (x.km ? t.dist(fmt(x.km, lang)) : t.distNear)}</div>
                          <div className="s">{wName}: {ok ? t.tgIn : t.tgShort(fmt(x.km - wp.r, lang))}</div>
                          <div className="s">{h.length ? t.tgHit(h.length, dmy(h[0].date)) : t.tgNo}</div>
                        </>)}>
                        {on && <circle r={11} fill="none" stroke="var(--ink)" strokeWidth={2} />}
                        <path d={on ? "M0,-7.5L7.5,0L0,7.5L-7.5,0Z" : "M0,-5.5L5.5,0L0,5.5L-5.5,0Z"} fill={h.length ? col : "var(--surface)"} fillOpacity={h.length ? 0.55 : 0.9} stroke={col} strokeWidth={1.5} />
                      </g>
                    );
                  })}</g>
                </g>
              </svg>
              <ZoomButtons z={z}><FsButton fs={fs} onClick={() => setFs(!fs)} /></ZoomButtons>
              {X && (() => {
                const ok = X.km <= wp.r, reach = reaching(X.km), h = hits(X), col = `var(${TG_COL[X.cat]})`;
                return <div className="mp-sel tg-card" role="status" style={{ borderTopColor: col }}>
                  <button type="button" aria-label={TT.art.close} title={TT.art.close} onClick={() => setSel(null)}>×</button>
                  <span className="d tg-cat"><Diamond r={5} fill={col} stroke={col} />{t.tg[X.cat as "fuel"]}</span>
                  <span className="tx">{flags(hs(X.name))}</span>
                  <span>{flags(hs(X.sub))}{X.approx ? " · ≈" : ""}</span>
                  <dl className="tg-dl">
                    <div><dt>{t.tgFront}</dt><dd>{X.km ? kmTxt(X.km) : t.distNear}</dd></div>
                    <div><dt>{wName}</dt><dd className={ok ? "ok" : "no"}>{ok ? t.tgIn : t.tgShort(fmt(X.km - wp.r, lang))}</dd></div>
                    <div><dt>{t.tgWpnN}</dt><dd>{t.tgOf(reach.length, WEAPONS.length)}</dd></div>
                    <div><dt>{t.tgCoord}</dt><dd>{X.lat.toFixed(2)}° N, {X.lng.toFixed(2)}° E</dd></div>
                  </dl>
                  <b className="tg-sub">{t.tgReach}</b>
                  {reach.length ? <ul className="tg-wl">{reach.map((x) => (
                    <li key={x.id}><button type="button" aria-pressed={x.id === wpn} onClick={() => setWpn(x.id)}>{wpnImg(x) ? <img src={wpnImg(x)!} alt="" width={40} height={27} loading="lazy" /> : <i aria-hidden="true" />}{wpnName(x, lang)}{x.limited && "*"}</button><span className="d">+{kmTxt(x.r - X.km)}</span></li>
                  ))}</ul> : <span>{t.tgNone}</span>}
                  <span className="d">{h.length ? t.tgHit(h.length, dmy(h[0].date)) : t.tgNo}</span>
                  {ok && wp.limited && <span className="tg-lim">{t.wpLimNote(wName)}</span>}
                </div>;
              })()}
              <Attr bm={bm} />
              <MapTip tip={tip} wrap={wrapRef} />
              {z.hint && <div className="map-hint" aria-hidden="true">{TT.mWheel}</div>}
            </>}
          </div>
          <div className="tg-lg" aria-label={t.lgTerr}>
            <span><i style={{ background: "var(--accent)", opacity: 0.3 }} />{t.tgLgBand}</span>
            {maps.data && <span><i style={{ background: "var(--m-occ)", opacity: 0.45 }} />{t.occ}</span>}
            <span><Diamond r={6} fill="var(--surface)" stroke="var(--muted)" />{t.tgLgIn}</span>
            <span className="tg-out-lg"><Diamond r={6} fill="var(--surface)" stroke="var(--muted)" />{t.tgOut}</span>
            <span><Diamond r={6} fill="var(--muted)" stroke="var(--muted)" />{t.tgLgHit}</span>
          </div>

          {ready && <div className="mp-list tg-list">
            <div className="mp-list-h"><b>{flags(t.tgTblH(wName, fmt(wp.r, lang)))}</b> <span className="map-src">{t.tgPick}</span></div>
            <div className="tg-flt">
              <div className="mp-verd" role="group" aria-label={t.types}>{TG_CATS.map((c) => (
                <label key={c} className="mp-chk"><input type="checkbox" checked={cat[c] && tc[c] > 0} disabled={!tc[c]} onChange={() => pickCat(c)} /><Diamond r={6} fill={`var(${TG_COL[c]})`} stroke={`var(${TG_COL[c]})`} /><span>{t.tg[c]}</span><span className="n">{tc[c]}</span></label>
              ))}</div>
              <div className="seg" role="group" aria-label={t.tgTitle}>
                <button type="button" aria-pressed={scope === "in"} onClick={() => setScope("in")}>{t.tgScIn(inR.length)}</button>
                <button type="button" aria-pressed={scope === "all"} onClick={() => setScope("all")}>{t.tgScAll(shown.length)}</button>
              </div>
            </div>
            {rows.length ? <div className="mp-list-sc"><table>
              <thead><tr><th>{t.tgColT}</th><th>{t.tgColW}</th><th>{t.tgFront}</th><th>{wName}</th><th>{t.tgWpnN}</th></tr></thead>
              <tbody>{rows.map((x) => { const ok = x.km <= wp.r, col = `var(${TG_COL[x.cat]})`; return (
                <tr key={x.key} className={x.key === sel ? "sel" : undefined}>
                  <td><button type="button" className="linkbtn tg-nm" onClick={() => focusTg(x)}><Diamond r={5} fill={col} stroke={col} />{flags(hs(x.name))}</button></td>
                  <td>{flags(hs(x.sub))}</td>
                  <td className="d">{x.km ? kmTxt(x.km) : t.distNear}</td>
                  <td className={"d " + (ok ? "ok" : "no")}>{ok ? "+" + kmTxt(wp.r - x.km) : t.tgShort(fmt(x.km - wp.r, lang))}</td>
                  <td className="d">{t.tgOf(reaching(x.km).length, WEAPONS.length)}</td>
                </tr>
              ); })}</tbody>
            </table></div> : <p className="map-src" style={{ padding: "12px 16px" }}>{t.none}</p>}
          </div>}
          <details className="method"><summary>{t.about}</summary>
            <p className="map-src">{flags(t.tgRangeNote + " " + (B ? t.distNote(B.ctrlAsOf || "") : "") + (tg.data?.note ? " ◆ " + tg.data.note : ""))}</p>
            <p className="map-src">{t.tgPhotos}: {WEAPONS.filter((x) => x.img).map((x, i) => <Fragment key={x.id}>{i > 0 && " · "}<a href={x.img!.url} target="_blank" rel="noopener">{wpnName(x, lang)}</a> ({x.img!.by}, {x.img!.lic})</Fragment>)}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
