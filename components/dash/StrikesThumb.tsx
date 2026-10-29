"use client";
// The dashboard strikes card's still map, drawn in the browser: the server sends only the marker list (`pts`), the
// outlines come from strikes-base.json + the map snapshot, and d3 is loaded on demand.
import { useEffect, useState } from "react";
import type { StrikesBase } from "@/lib/strikes";
import { useApp } from "../ctx";
import { useJson } from "./hooks";
import type { MapsData } from "./Panels";
import { StkMark, type Grp } from "./strikeParts";

/** One marker per place: [lng, lat, group, confirmed, strikes there]. */
export type ThumbPt = [number, number, Grp, boolean, number];
type Drawn = { base: { d: string; ua?: boolean }[]; occ: string; pts: { x: number; y: number; p: ThumbPt }[] };
const W = 640, H = 420;

export default function StrikesThumb({ pts }: { pts: ThumbPt[] }) {
  const { MAPS } = useApp();
  const sb = useJson<StrikesBase>("/maps/strikes-base.json"), M = useJson<MapsData>(MAPS);
  const [g, setG] = useState<Drawn | null>(null);
  useEffect(() => {
    if (!sb.data) return;
    let live = true;
    const B = sb.data, occ = M.data?.layers?.ds_occ;
    import("d3").then(({ geoConicConformal, geoPath }) => {
      const mp = (c: number[][][][]) => ({ type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: c } }) as const;
      const ua = B.base.find((b) => b.ua)!;
      const fc = { type: "FeatureCollection", features: [mp(ua.c), ...pts.map((p) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [p[0], p[1]] } }))] };
      const proj = geoConicConformal().parallels([45, 55]).rotate([-38, 0]).fitExtent([[24, 24], [W - 24, H - 24]], fc as never).clipExtent([[-8, -8], [W + 8, H + 8]]);
      const path = geoPath(proj).digits(0), d = (c?: number[][][][]) => (c && c.length ? path(mp(c) as never) || "" : "");
      if (live) setG({
        base: B.base.map((b) => ({ d: d(b.c), ua: b.ua })), occ: d(occ as number[][][][] | undefined),
        pts: pts.map((p) => { const [x, y] = proj([p[0], p[1]])!; return { x, y, p }; }).sort((a, b) => b.p[4] - a.p[4]),
      });
    });
    return () => { live = false; };
  }, [sb.data, M.data, pts]);
  return (
    <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {g && <>
        {g.base.map((b, i) => <path key={i} d={b.d} fill={b.ua ? "var(--m-ua)" : "var(--m-land)"} stroke="var(--m-border)" strokeWidth={b.ua ? 1.2 : 0.7} fillRule="evenodd" />)}
        {g.occ && <path d={g.occ} fill="var(--m-occ)" fillOpacity={0.3} stroke="var(--m-occ)" strokeWidth={0.6} fillRule="evenodd" />}
        {g.pts.map(({ x, y, p }) => <g key={p[0] + "," + p[1]} transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}><StkMark g={p[2]} conf={p[3]} n={p[4]} size={18} /></g>)}
      </>}
    </svg>
  );
}
