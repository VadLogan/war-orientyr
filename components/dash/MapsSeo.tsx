// Server component: the /maps page as plain HTML — areas, the week's DeepState line changes, the month's DIVGEN claims
// with their verdicts and links to every direction — for search engines and first paint. MapsCompare replaces it once
// its data is here. On a direction page (/maps/<slug>) the lists keep that direction only.
import { getMaps } from "@/lib/data";
import { dirHref, dirTitle, type Dir } from "@/lib/page";
import { dayN, fmt, houseStyle } from "@/lib/text";
import { UI, type UIStrings } from "@/lib/ui";
import { flags } from "@/components/Flag";
import type { DashLang } from "../ctx";
import type { MapsData } from "./Panels";
import { areaTiles, DIRS, dirOf, lastDay, Mark, Tiles, vgOf } from "./mapParts";

const dm = (d: string) => d.slice(8, 10) + "." + d.slice(5, 7);

export default async function MapsSeo({ lang, url, dir }: { lang: DashLang; url: string; dir?: Dir }) {
  const t = UI[lang] as UIStrings;
  const M = await getMaps<MapsData>(url, lang);
  const hs = (x: string) => flags(houseStyle(x, lang));
  const end = lastDay(M);
  const inDir = (e: { lat: number; lng: number }) => !dir || dirOf(e) === dir.id;
  const ds = (M.dsEvents || []).filter((e) => dayN(e.d) > end - 7 && inDir(e)).sort((a, b) => (a.d < b.d ? 1 : -1));
  const cl = M.events.filter((e) => dayN(e.d) > end - 30 && inDir(e)).sort((a, b) => (a.d < b.d ? 1 : -1)).slice(0, 60);
  return (
    <section className="tlwrap mp">
      <div className="mp-head"><h2>{dir ? dirTitle(lang, dir) : t.mpH}</h2><p>{flags(t.mpLede)}</p></div>
      <div className="tiles map-tiles"><Tiles items={areaTiles(M, t, (n) => fmt(Math.round(n), lang), "cmp", "dg_ds")} /></div>
      <h3>{flags(t.dsAdvH)} · {t.mpDays(7)}</h3>
      {ds.length ? <ul>{ds.map((e, k) => (
        <li key={k}><b>{dm(e.d)}</b> · {t.dsK[e.k]}: {hs(e.t)}. {e.ru ? <>{t.dsRu}: {dm(e.ru.d)}, {hs(e.ru.t)}</> : t.dsNoRu}.</li>
      ))}</ul> : <p>{t.dsNone}</p>}
      <h3>{t.mpClaims} · {t.mpDays(30)}</h3>
      {cl.length ? <ul>{cl.map((e) => (
        <li key={e.id + e.d}><svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true"><Mark g={vgOf(e.ds)} /></svg> <b>{dm(e.d)}</b> · {hs(e.t)} — DeepState: {t.evSt.ds[e.ds as "occ"]}</li>
      ))}</ul> : <p>{t.mpNone}</p>}
      <h3>{t.mpDir}</h3>
      <p>{DIRS.map((d, k) => <span key={d.id}>{k ? " · " : ""}<a href={dirHref(lang, d)} aria-current={d.id === dir?.id ? "page" : undefined}>{dirTitle(lang, d).split(":")[0]}</a></span>)}</p>
    </section>
  );
}
