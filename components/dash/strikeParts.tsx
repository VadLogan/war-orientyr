// Pieces of the strikes map shared by the client page (Maps.tsx StrikesMap) and the server-rendered dashboard card
// (StrikesCard.tsx): target groups, their colours and icons, the map marker. No hooks, no "use client".
import type { Strike } from "@/lib/strikes";

/** Target groups: colour + icon. Unknown targets ("other") are their own group, drawn with a dashed outline. */
export const GRPS = ["oil", "vpk", "mil", "log", "en", "oth"] as const;
export type Grp = (typeof GRPS)[number];
const KIND: Record<string, Grp> = { oil: "oil", gas: "oil", "defence-industry": "vpk", military: "mil", airfield: "mil", navy: "mil", port: "log", logistics: "log", energy: "en", other: "oth" };
export const grpOf = (x: Pick<Strike, "kind">): Grp => KIND[x.kind] || "oth";
export const GCOL: Record<Grp, string> = { oil: "var(--c2)", vpk: "var(--c5)", mil: "var(--c1)", log: "var(--c3)", en: "var(--c4)", oth: "var(--m-grey)" };

/** 24×24 stroke icons, one per group. */
const ICO: Record<Grp, string> = {
  oil: "M12 3c3.6 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.4-6.5 6-11z",
  vpk: "M3 20V11l5 3v-3l5 3V4h4v16zM2 20h20",
  mil: "M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6z",
  log: "M12 3a2 2 0 1 0 0 4a2 2 0 1 0 0-4M12 7v14M5 13a7 7 0 0 0 14 0M8 10h8",
  en: "M13 3L5 14h6l-1 7 8-11h-6z",
  oth: "M9 9a3 3 0 1 1 4.2 2.8c-.8.4-1.2 1-1.2 1.8V15M12 19.5v.01",
};
export const IcoPath = ({ g, c, s, w = 2.4 }: { g: Grp; c: string; s: number; w?: number }) => (
  <path d={ICO[g]} transform={`translate(${-s / 2},${-s / 2}) scale(${s / 24})`} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" vectorEffect="none" />
);

/** A marker centred on 0,0: a rounded tile with the group icon. Confirmed = filled tile, white icon; unconfirmed = outlined
 *  (dashed for unknown targets). `n` > 1: several strikes at one place, the count sits in the corner. */
export function StkMark({ g, conf, n = 1, size = 22, hl }: { g: Grp; conf: boolean; n?: number; size?: number; hl?: boolean }) {
  const s = n > 1 ? size + 4 : size, h = s / 2, col = GCOL[g];
  return <>
    {hl && <rect x={-h - 5} y={-h - 5} width={s + 10} height={s + 10} rx={8} fill="none" stroke="var(--ink)" strokeWidth={2.5} />}
    <rect x={-h} y={-h} width={s} height={s} rx={s / 4} fill={conf ? col : "var(--surface)"} stroke={conf ? "var(--surface)" : col} strokeWidth={conf ? 1.5 : 2} strokeDasharray={!conf && g === "oth" ? "3 2" : undefined} />
    <IcoPath g={g} c={conf ? "#fff" : col} s={s * (conf ? 0.64 : 0.58)} />
    {n > 1 && <g transform={`translate(${h},${-h})`}>
      <rect x={-8.5} y={-8.5} width={n > 9 ? 22 : 17} height={17} rx={8.5} fill="var(--ink)" stroke="var(--surface)" strokeWidth={1.5} />
      <text x={n > 9 ? 2.5 : 0} y={0} dy="0.35em" textAnchor="middle" className="stk-cnt">{n}</text>
    </g>}
  </>;
}
/** The marker as an inline icon (lists, legend, filter chips). */
export const StkIco = ({ g, conf = true, n, size = 18 }: { g: Grp; conf?: boolean; n?: number; size?: number }) => {
  const pad = n && n > 1 ? 10 : 2, box = size + 4 + pad * 2;
  return <svg className="mk" width={box} height={box} viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} aria-hidden="true"><StkMark g={g} conf={conf} n={n} size={size} /></svg>;
};

/** Strikes at one place (≈ 5 km), newest first: one marker each. */
export function byPlace(items: Strike[]) {
  const m = new Map<string, Strike[]>();
  for (const x of items) { const k = x.lat.toFixed(1) + "," + x.lng.toFixed(1); (m.get(k) || m.set(k, []).get(k)!).push(x); }
  return [...m].map(([k, xs]) => ({ k, xs: xs.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)) }));
}
export const placeKey = (x: Strike) => x.lat.toFixed(1) + "," + x.lng.toFixed(1);

/** Main cities for orientation on the strikes map: tier 1 (capitals, big cities) always, tier 2 from zoom ×2. */
export const STK_CITIES: { uk: string; en: string; lat: number; lng: number; t: 1 | 2; cap?: boolean }[] = [
  { uk: "Київ", en: "Kyiv", lat: 50.45, lng: 30.52, t: 1, cap: true },
  { uk: "Москва", en: "Moscow", lat: 55.76, lng: 37.62, t: 1, cap: true },
  { uk: "Мінськ", en: "Minsk", lat: 53.9, lng: 27.56, t: 1, cap: true },
  { uk: "Кишинів", en: "Chișinău", lat: 47.01, lng: 28.86, t: 2, cap: true },
  { uk: "Тбілісі", en: "Tbilisi", lat: 41.72, lng: 44.79, t: 2, cap: true },
  { uk: "Харків", en: "Kharkiv", lat: 49.99, lng: 36.23, t: 1 },
  { uk: "Одеса", en: "Odesa", lat: 46.48, lng: 30.72, t: 1 },
  { uk: "Дніпро", en: "Dnipro", lat: 48.46, lng: 35.05, t: 1 },
  { uk: "Львів", en: "Lviv", lat: 49.84, lng: 24.03, t: 2 },
  { uk: "Запоріжжя", en: "Zaporizhzhia", lat: 47.84, lng: 35.14, t: 2 },
  { uk: "Севастополь", en: "Sevastopol", lat: 44.62, lng: 33.52, t: 2 },
  { uk: "Донецьк", en: "Donetsk", lat: 48.0, lng: 37.8, t: 1 },
  { uk: "Луганськ", en: "Luhansk", lat: 48.57, lng: 39.31, t: 1 },
  { uk: "Херсон", en: "Kherson", lat: 46.64, lng: 32.61, t: 1 },
  { uk: "Маріуполь", en: "Mariupol", lat: 47.1, lng: 37.55, t: 1 },
  { uk: "Санкт-Петербург", en: "St Petersburg", lat: 59.94, lng: 30.31, t: 1 },
  { uk: "Ростов-на-Дону", en: "Rostov-on-Don", lat: 47.23, lng: 39.72, t: 1 },
  { uk: "Волгоград", en: "Volgograd", lat: 48.71, lng: 44.51, t: 1 },
  { uk: "Воронеж", en: "Voronezh", lat: 51.67, lng: 39.18, t: 1 },
  { uk: "Краснодар", en: "Krasnodar", lat: 45.04, lng: 38.98, t: 1 },
  { uk: "Нижній Новгород", en: "Nizhny Novgorod", lat: 56.33, lng: 44.0, t: 1 },
  { uk: "Казань", en: "Kazan", lat: 55.79, lng: 49.12, t: 1 },
  { uk: "Самара", en: "Samara", lat: 53.2, lng: 50.15, t: 1 },
  { uk: "Уфа", en: "Ufa", lat: 54.74, lng: 55.97, t: 1 },
  { uk: "Перм", en: "Perm", lat: 58.01, lng: 56.25, t: 1 },
  { uk: "Єкатеринбург", en: "Yekaterinburg", lat: 56.84, lng: 60.6, t: 1 },
  { uk: "Саратов", en: "Saratov", lat: 51.53, lng: 46.03, t: 2 },
  { uk: "Курськ", en: "Kursk", lat: 51.73, lng: 36.19, t: 2 },
  { uk: "Бєлгород", en: "Belgorod", lat: 50.6, lng: 36.59, t: 2 },
  { uk: "Брянськ", en: "Bryansk", lat: 53.24, lng: 34.36, t: 2 },
  { uk: "Тула", en: "Tula", lat: 54.19, lng: 37.62, t: 2 },
  { uk: "Рязань", en: "Ryazan", lat: 54.63, lng: 39.74, t: 2 },
  { uk: "Твер", en: "Tver", lat: 56.86, lng: 35.9, t: 2 },
  { uk: "Ярославль", en: "Yaroslavl", lat: 57.63, lng: 39.87, t: 2 },
  { uk: "Новоросійськ", en: "Novorossiysk", lat: 44.72, lng: 37.77, t: 2 },
  { uk: "Астрахань", en: "Astrakhan", lat: 46.35, lng: 48.04, t: 2 },
];
