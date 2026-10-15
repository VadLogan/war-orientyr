// Strikes data types (strikes.json + maps/strikes-base.json, loaded in lib/data.ts) and distance-to-front helpers, shared by the digest and the strikes map.
import { fmt } from "./text";
import { UI, type Lang } from "./ui";

export type Strike = {
  id?: string; date: string; night?: string; kind: string; object: string; place: string; result: string;
  lat: number; lng: number; approx?: boolean; confirmed?: { by: string; when: string } | null;
  local?: string; item?: string; issue?: string; url?: string;
};
export type StrikesData = { items: Strike[]; coverage?: { uk: string; en: string } };
export type StrikesBase = { base: { ua?: boolean; c: number[][][][] }[]; ctrl?: [number, number][]; ctrlAsOf?: string };
export type Strikes = { stk: StrikesData; base: StrikesBase };

export function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = Math.PI / 180, p1 = a.lat * R, p2 = b.lat * R, dp = p2 - p1, dl = (b.lng - a.lng) * R;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

const DISTC: Record<string, number> = {};
/** Distance (km, rounded to 5) from a point to the nearest point of the front line; 0 when within 3 km. */
export function stkDist(B: StrikesBase, x: { lat: number | null; lng: number }) {
  if (!B.ctrl || x.lat == null) return null;
  const k = x.lat + "," + x.lng;
  if (k in DISTC) return DISTC[k];
  let best = 1e9;
  for (const [lng, lat] of B.ctrl) { const d = kmBetween({ lat: x.lat, lng: x.lng }, { lat, lng }); if (d < best) best = d; }
  return (DISTC[k] = best < 3 ? 0 : Math.round(best / 5) * 5);
}
export function distLabel(B: StrikesBase, x: { lat: number | null; lng: number }, lang: Lang) {
  const d = stkDist(B, x);
  if (d == null) return "";
  const t = UI[lang].stk;
  return d === 0 ? t.distNear : t.dist(fmt(d, lang));
}
