// Server component: the /strikes page as plain HTML — title, totals and the last 30 days of strikes as a list — for
// search engines and first paint. The interactive page (StrikesMap: filters, map, timeline) replaces it once loaded.
import { getMaps, getStrikes } from "@/lib/data";
import { href } from "@/lib/routes";
import { distLabel, type StrikesData } from "@/lib/strikes";
import { dayN, fmt, houseStyle } from "@/lib/text";
import { UI, type UIStrings } from "@/lib/ui";
import { flags } from "@/components/Flag";
import { LOCK } from "../digest/Item";
import type { DashLang } from "../ctx";
import { Tiles } from "./mapParts";
import { grpOf, StkIco } from "./strikeParts";

const dmy = (d: string) => d.split("-").reverse().join(".");

export default async function StrikesSeo({ lang, date, latest }: { lang: DashLang; date: string; latest: string }) {
  const TT = UI[lang] as UIStrings, t = TT.stk;
  const [{ base }, stk] = await Promise.all([getStrikes(), getMaps<StrikesData>("/strikes.json", lang)]);
  const hs = (x: string) => houseStyle(x, lang);
  const end = dayN(date);
  const items = (stk.items || []).filter((x) => x.lat != null && dayN(x.date) <= end && dayN(x.date) > end - 30).sort((a, b) => (a.date < b.date ? 1 : -1));
  const conf = items.filter((x) => x.confirmed).length, objs = new Set(items.map((x) => x.object)).size;
  const days: [string, typeof items][] = [];
  items.forEach((x) => { const l = days.at(-1); if (l && l[0] === x.date) l[1].push(x); else days.push([x.date, [x]]); });

  return (
    <section className="tlwrap mp stk-page" id="strikemap">
      <div className="mp-head"><h2>{t.title}</h2><p>{flags(t.sub)}</p></div>
      <div className="tiles map-tiles stk-tiles3"><Tiles items={[
        [t.tTotal, fmt(items.length, lang), t.p30],
        [t.tConf, items.length ? <>{fmt(conf, lang)}<sub>{Math.round((conf / items.length) * 100)}%</sub></> : "0", t.tConfSub],
        [t.tObj, fmt(objs, lang), t.tObjRep(items.length - objs)],
      ]} /></div>
      <h3 className="stk-h3">{t.list} · {t.p30} · {fmt(items.length, lang)}</h3>
      <ol className="stk-list">{days.map(([d, xs]) => [
        <li key={d} className="stk-day"><b>{dmy(d).slice(0, 5)}</b><span>{t.nStrikes(xs.length)}</span></li>,
        ...xs.map((x, n) => {
          const c = !!x.confirmed, dd = distLabel(base, x, lang);
          return (
            <li key={d + n}>
              <StkIco g={grpOf(x)} conf={c} size={20} />
              <div>
                <span><b>{flags(hs(x.object))}</b>, {flags(hs(x.place))}{x.approx ? " ≈" : ""}{x.night && <span style={{ color: "var(--muted)" }}> ({t.night} {x.night})</span>}</span>
                <span>{flags(hs(x.result))}</span>
                <span className="stk-meta">
                  {dd && <span>📏 {dd}</span>}
                  <span className={"chip " + (c ? "ok" : "unv")}>{c ? t.conf : t.unconf}</span>
                  {c && <span>{flags(t.confBy(x.confirmed!.by, x.confirmed!.when))}</span>}
                  {x.local && <span className={"chip " + (LOCK[x.local] || "ru")}>{(TT.loc as Record<string, string>)[x.local] || x.local}</span>}
                  {x.item && <a href={href(lang, "digest", x.issue || date, latest) + "#it-" + x.item}>{t.toFeed}</a>}
                  {x.url && <a href={x.url} target="_blank" rel="noopener">{t.src}</a>}
                </span>
              </div>
            </li>
          );
        }),
      ])}</ol>
    </section>
  );
}
