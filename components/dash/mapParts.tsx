// Pieces of the source-comparison map shared by the client map (Maps.tsx) and the server-rendered dashboard card
// (MapsCard.tsx): projection helpers, layers, claim marks, tiles and the verdict bar. No hooks, no "use client".
import type { ReactNode } from "react";
import { geoMercator, geoPath, zoomIdentity, type GeoPermissibleObjects, type GeoProjection } from "d3";
import type { UIStrings } from "@/lib/ui";
import { dayN } from "@/lib/text";
import { kmBetween } from "@/lib/strikes";
import { flags } from "@/components/Flag";
import type { MapsData } from "./Panels";

export type Rings = number[][][][];
export const mp = (c: Rings) => ({ type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: c } }) as GeoPermissibleObjects;

export const Tiles = ({ items }: { items: [string, ReactNode, string][] }) => (
  <>{items.map(([l, v, s]) => <div className="tile" key={l}><small>{flags(l)}</small><b>{v}</b><span>{flags(s)}</span></div>)}</>
);

export const SRC_COL: Record<string, string> = { ds: "--m-occ", isw: "--m-isw", dg: "--m-dg" };
export const PAIR_SRC: Record<string, [string, string]> = { dg_ds: ["dg", "ds"], dg_isw: ["dg", "isw"], isw_ds: ["isw", "ds"] };
export const LY: Record<string, string> = { ds: "ds_occ", isw: "isw", dg: "dg_ru" };
export const Sw = ({ c, l, cls = "" }: { c: string; l: string; cls?: string }) => <span><i className={cls} style={cls === "line" ? { borderColor: `var(${c})` } : { background: `var(${c})` }} />{flags(l)}</span>;

/** Verdict of a DIVGEN claim against the reference map (ISW "adv" counts as grey zone). */
export const VG = ["occ", "grey", "edge", "ua", "far", "out"] as const;
export type VG = (typeof VG)[number];
export const vgOf = (v: string): VG => (v === "adv" ? "grey" : (VG as readonly string[]).includes(v) ? (v as VG) : "out");
export type Ev = MapsData["events"][number];
export type Geo = { proj: GeoProjection; d: (c?: Rings) => string };

/** A claim's mark: the verdict is shape + fill, so it reads without colour and never matches the area fills. */
export function Mark({ g, hl }: { g: VG; hl?: boolean }) {
  const s = hl ? 1.7 : 1, r = 5 * s;
  if (g === "far") return <path d={`M0,-${r + 1}L${r + 1},0L0,${r + 1}L-${r + 1},0Z`} fill="var(--m-dg)" stroke="var(--surface)" strokeWidth={1.5} />;
  if (g === "edge" || g === "ua") return <circle r={r - 0.5} fill="var(--surface)" stroke={g === "ua" ? "var(--m-dg)" : "var(--ink)"} strokeWidth={2} />;
  return <circle r={g === "out" ? 3 * s : r} fill={g === "occ" ? "var(--ink)" : g === "grey" ? "var(--m-grey)" : "var(--muted)"} stroke="var(--surface)" strokeWidth={1.5} />;
}
export const MarkIco = ({ g }: { g: VG }) => <svg className="mk" width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true"><Mark g={g} /></svg>;

/** Zoom transform that frames every claim inside the border (≈ the active front). */
export function fitFront(M: MapsData, geo: Geo, W: number, H: number) {
  const pts = M.events.filter((e) => e.ds !== "out").map((e) => geo.proj([e.lng, e.lat])!);
  if (!pts.length) return zoomIdentity;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20, y0 = Math.min(...ys) - 20, y1 = Math.max(...ys) + 20;
  const k = Math.min(40, 0.9 / Math.max((x1 - x0) / W, (y1 - y0) / H));
  return zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
}
/** `plain`: fill the land (no raster basemap underneath). */
export function Layers({ M, geo, mode, pair, plain = true }: { M: MapsData; geo: Geo; mode: string; pair: string; plain?: boolean }) {
  const L = M.layers;
  const P = (c: Rings | undefined, fill: string, op: number, stroke?: string, sw?: number, key?: string) =>
    c && c.length ? <path key={key} d={geo.d(c)} fill={fill} fillOpacity={op} stroke={stroke || "none"} strokeWidth={sw || 0} fillRule="evenodd" /> : null;
  const [a, b] = PAIR_SRC[pair];
  return <>
    {M.base.map((bb, i) => P(bb.c, bb.ua ? "var(--m-ua)" : "var(--m-land)", plain ? 1 : 0, "var(--m-border)", bb.ua ? 1.4 : 0.8, "b" + i))}
    {mode === "ds" ? <>{P(L.ds_occ, "var(--m-occ)", 0.38, "var(--m-occ)", 1)}{P(L.ds_grey, "var(--m-grey)", 0.45, "var(--m-grey)", 0.6)}</>
      : mode === "isw" ? <>{P(L.isw, "var(--m-isw)", 0.35, "var(--m-isw)", 1)}{P(L.isw_adv, "var(--m-iswadv)", 0.55, "var(--m-iswadv)", 0.6)}</>
      : mode === "dg" ? P(L.dg_ru, "var(--m-dg)", 0.33, "var(--m-dg)", 1)
      : <>
        {pair === "dg_ds" ? <>{P(L.dg_ds_a, "var(--m-onlydg)", 0.75)}{P(L.only_dg_grey, "var(--m-onlydgg)", 0.85)}</> : P(L[pair + "_a"], "var(--m-onlydg)", 0.75)}
        {P(L[pair + "_b"], "var(--m-onlyds)", 0.7)}{P(L[LY[b]], "none", 0, `var(${SRC_COL[b]})`, 1.4)}{P(L[LY[a]], "none", 0, `var(${SRC_COL[a]})`, 1.2)}
      </>}
  </>;
}
export const Cities = ({ M, geo, k, hidden }: { M: MapsData; geo: Geo; k: number; hidden?: boolean }) => (
  <g className="city" display={hidden ? "none" : undefined}>{M.cities.map((c) => { const [x, y] = geo.proj([c.lng, c.lat])!; return [
    <circle key={c.n + "c"} cx={x} cy={y} r={2.6 / k} fill="var(--m-city)" />,
    <text key={c.n + "t"} x={x + 5 / k} y={y + 4 / k} fontSize={11 / k} style={{ strokeWidth: 3 / k + "px" }}>{c.n}</text>,
  ]; })}</g>
);
/** Area tiles: the three sources (without Crimea) + the pair difference or the spread. */
export function areaTiles(M: MapsData, t: UIStrings, F: (n: number) => string, mode: string, pair: string): [string, ReactNode, string][] {
  const A = M.areas;
  const nc: Record<string, number> = { ds: A.ds_nc, isw: A.isw_nc, dg: A.dg_nc };
  const order = Object.keys(nc).sort((a, b) => nc[b] - nc[a]);
  const tiles: [string, ReactNode, string][] = (["ds", "isw", "dg"] as const).map((k) => [t.tArea(t.src[k]), F(nc[k]), t.kmNC]);
  if (mode === "cmp") { const [a, b] = PAIR_SRC[pair]; tiles.push([t.tPair(t.src[a as "ds"], t.src[b as "ds"]), F(A[pair + "_a"]) + " / " + F(A[pair + "_b"]), pair === "dg_ds" ? t.kmPairGrey(F(A.only_dg_grey)) : t.kmPair]); }
  else tiles.push([t.tSpread, F(nc[order[0]] - nc[order[2]]), t.kmSpread(t.src[order[0] as "ds"], t.src[order[2] as "ds"])]);
  return tiles;
}
export const countV = (evs: Ev[], ref: "ds" | "isw") => {
  const c = { occ: 0, grey: 0, edge: 0, ua: 0, far: 0, out: 0 } as Record<VG, number>;
  evs.forEach((e) => c[vgOf(e[ref])]++);
  return c;
};
/** Claims by verdict as one stacked bar; with `pick`, a segment filters the map to that verdict. */
export function VerdictBar({ t, head, cnt, on, pick }: { t: UIStrings; head: string; cnt: Record<VG, number>; on?: Record<VG, boolean>; pick?: (g: VG) => void }) {
  return (
    <div className="mp-bar-box">
      <div className="mp-bar-h"><b>{head}</b>{pick && <span>{t.mpBarHint}</span>}</div>
      <div className="mp-bar">{VG.filter((g) => cnt[g]).map((g) => pick
        ? <button type="button" key={g} className={"v-" + g} style={{ flex: cnt[g] }} aria-pressed={on![g]} aria-label={`${t.evLg[g]}: ${cnt[g]}`} title={`${t.evLg[g]}: ${cnt[g]}`} onClick={() => pick(g)} />
        : <span key={g} className={"v-" + g} style={{ flex: cnt[g] }} title={`${t.evLg[g]}: ${cnt[g]}`} />)}</div>
      <p className="map-src">{t.mpBarSum(cnt.occ + cnt.grey + cnt.edge, cnt.ua + cnt.far, cnt.far)}{cnt.out ? ` · ${t.evLg.out}: ${cnt.out}` : ""}</p>
    </div>
  );
}
export const lastDay = (M: MapsData) => Math.max(...M.events.map((e) => dayN(e.d)));
/** Projection fitted to Ukraine in a W×H box, with a path builder for MultiPolygon rings. */
export function makeGeo(M: MapsData, W: number, H: number): Geo {
  const ua = M.base.find((b) => b.ua)!;
  // mercator so web tiles line up (≈17% north–south scale change across 🇺🇦 Ukraine; areas are computed upstream)
  const proj = geoMercator().fitExtent([[12, 12], [W - 12, H - 12]], mp(ua.c));
  const path = geoPath(proj);
  return { proj, d: (c?: Rings) => (c && c.length ? path(mp(c)) || "" : "") };
}

/** Front directions (General Staff names, as in the digest) with an anchor point on the front line. A claim belongs to
 *  the nearest anchor within DIR_KM; farther claims belong to none.
 *  ponytail: anchors are hand-placed approximations; replace with sector polygons if the scraper ever provides them. */
export const DIRS: { id: string; uk: string; en: string; de: string; lat: number; lng: number }[] = [
  { id: "nsl", uk: "Північно-Слобожанський", en: "North Slobozhanskyi", de: "Nord-Sloboschanskyj", lat: 51.17, lng: 35.05 },
  { id: "ssl", uk: "Південно-Слобожанський", en: "South Slobozhanskyi", de: "Süd-Sloboschanskyj", lat: 50.3, lng: 36.95 },
  { id: "kup", uk: "Куп’янський", en: "Kupiansk", de: "Kupjansk", lat: 49.72, lng: 37.62 },
  { id: "lym", uk: "Лиманський", en: "Lyman", de: "Lyman", lat: 49.05, lng: 37.92 },
  { id: "slo", uk: "Слов’янський", en: "Sloviansk", de: "Slowjansk", lat: 48.87, lng: 38.12 },
  { id: "kra", uk: "Краматорський", en: "Kramatorsk", de: "Kramatorsk", lat: 48.6, lng: 37.88 },
  { id: "kos", uk: "Костянтинівський", en: "Kostiantynivka", de: "Kostjantyniwka", lat: 48.42, lng: 37.75 },
  { id: "pok", uk: "Покровський", en: "Pokrovsk", de: "Pokrowsk", lat: 48.3, lng: 37.2 },
  { id: "olk", uk: "Олександрівський", en: "Oleksandrivka", de: "Oleksandriwka", lat: 48.0, lng: 36.75 },
  { id: "hul", uk: "Гуляйпільський", en: "Huliaipole", de: "Huljajpole", lat: 47.67, lng: 36.27 },
  { id: "ori", uk: "Оріхівський", en: "Orikhiv", de: "Orichiw", lat: 47.56, lng: 35.8 },
  { id: "prd", uk: "Придніпровський", en: "Prydniprovskyi", de: "Prydniprowskyj", lat: 46.68, lng: 32.75 },
];
const DIR_KM = 80;
export const dirOf = (e: { lat: number; lng: number }) => {
  let best: string | null = null, bd = DIR_KM;
  for (const d of DIRS) { const k = kmBetween(e, d); if (k < bd) { bd = k; best = d.id; } }
  return best;
};
