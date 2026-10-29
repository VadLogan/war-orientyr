// Server component: the dashboard's strikes block — totals, a by-type bar and the latest strikes as HTML; the still map
// of the last 30 days is drawn in the browser (StrikesThumb). Filters, legend and the full list live on /strikes.
import Link from "next/link";
import { getMaps } from "@/lib/data";
import { href } from "@/lib/routes";
import type { StrikesData } from "@/lib/strikes";
import { dayN, fmt, houseStyle } from "@/lib/text";
import { UI, type UIStrings } from "@/lib/ui";
import { flags } from "@/components/Flag";
import type { DashLang } from "../ctx";
import { Tiles } from "./mapParts";
import { byPlace, GCOL, GRPS, grpOf, StkIco } from "./strikeParts";
import StrikesThumb from "./StrikesThumb";

const FAR_LNG = 61;
const dmy = (d: string) => d.split("-").reverse().join(".");

export default async function StrikesCard({ lang, date, latest }: { lang: DashLang; date: string; latest: string }) {
  const t = (UI[lang] as UIStrings).stk;
  const stk = await getMaps<StrikesData>("/strikes.json", lang);
  const hs = (x: string) => houseStyle(x, lang);
  const to = href(lang, "strikes", date, latest);
  const end = dayN(date);
  const items = (stk.items || []).filter((x) => x.lat != null && dayN(x.date) <= end && dayN(x.date) > end - 30).sort((a, b) => (a.date < b.date ? 1 : -1));
  const near = items.filter((x) => x.lng <= FAR_LNG), far = [...new Set(items.filter((x) => x.lng > FAR_LNG).map((x) => hs(x.place).split(",")[0]))];
  const pts = byPlace(near).map(({ xs }) => [xs[0].lng, xs[0].lat, grpOf(xs[0]), !!xs[0].confirmed, xs.length] as const);

  const conf = items.filter((x) => x.confirmed).length, objs = new Set(items.map((x) => x.object)).size;
  const gc = GRPS.map((g) => [g, items.filter((x) => grpOf(x) === g).length] as const).filter(([, n]) => n);

  return (
    <section className="tlwrap" id="strikemap">
      <div className="tl-head mp-teaser-h"><h2>{t.cardH}</h2><Link href={to}>{t.open}</Link></div>
      <div className="mp-teaser">
        <Link href={to} className="mp-thumb stk-thumb" aria-label={t.open}>
          <div className="map-wrap">
            <StrikesThumb pts={pts.map((p) => [...p])} />
            <span className="mp-cta">{t.openMap}</span>
            {far.length > 0 && <span className="stk-far-note">{t.offMapN(far.length, far.join(", "))}</span>}
          </div>
        </Link>
        <div className="mp-side">
          <div className="tiles map-tiles stk-tiles3"><Tiles items={[
            [t.tTotal, fmt(items.length, lang), t.p30],
            [t.tConf, items.length ? <>{fmt(conf, lang)}<sub>{Math.round((conf / items.length) * 100)}%</sub></> : "0", t.tConfSub],
            [t.tObj, fmt(objs, lang), t.tObjRep(items.length - objs)],
          ]} /></div>
          <div className="mp-bar-box">
            <div className="mp-bar-h"><b>{t.types}</b></div>
            <div className="mp-bar">{gc.map(([g, n]) => <span key={g} style={{ flex: n, background: GCOL[g] }} title={`${t.g[g]}: ${n}`} />)}</div>
            <div className="stk-gl">{gc.map(([g, n]) => <span key={g}><StkIco g={g} size={14} />{t.g[g]} <b>{n}</b></span>)}</div>
          </div>
          <ol className="stk-list stk-latest">{items.slice(0, 3).map((x, i) => (
            <li key={i}><StkIco g={grpOf(x)} conf={!!x.confirmed} size={16} />
              <div><span><b>{dmy(x.date).slice(0, 5)}</b> · {flags(hs(x.object))}, {flags(hs(x.place))}{x.approx ? " ≈" : ""}</span></div></li>
          ))}</ol>
        </div>
      </div>
    </section>
  );
}
