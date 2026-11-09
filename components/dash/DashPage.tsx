// Server component: a whole Dashboard page; the charts are a client tree fed with trimmed server data.
import type { Digest } from "@/types/digest";
import { dirOrder, TL } from "@/lib/text";
import { getAnalytics, getMaps, getMapsUrl, getSourceMatrix, SHOW_SOURCE_MATRIX } from "@/lib/data";
import { mapsImg, resolve, type DateParams } from "@/lib/page";
import { href, SITE, SITE_NAME } from "@/lib/routes";
import Ld from "../Ld";
import { UI, type UIStrings } from "@/lib/ui";
import type { DashIssue, DashLang } from "../ctx";
import Shell from "../Shell";
import Mast from "../Mast";
import DashProvider from "./DashProvider";
import MapsCard from "./MapsCard";
import StrikesCard from "./StrikesCard";
import StrikesSeo from "./StrikesSeo";
import MapsSeo from "./MapsSeo";
import { dashLd, DashSummary, PanelFoot, PanelIntro } from "./DashText";
import type { MapsData } from "./Panels";

/** /maps as a schema.org Dataset: the day's map snapshot, its three sources and the area it covers. */
async function mapsLd(lang: DashLang, date: string, url: string) {
  const M = await getMaps<MapsData>(url, lang);
  const org = { "@type": "Organization", name: SITE_NAME[lang], url: SITE };
  return {
    "@context": "https://schema.org", "@type": "Dataset", name: `${UI[lang].nw.maps.t} · ${date.split("-").reverse().join(".")}`,
    description: UI[lang].nw.maps.p, url: SITE + href(lang, "maps", date, ""), inLanguage: lang, temporalCoverage: date, dateModified: date,
    image: SITE + mapsImg("maps", date), creator: org, publisher: org, isAccessibleForFree: true,
    isBasedOn: Object.values(M.sources).map((s) => s.url), spatialCoverage: { "@type": "Place", name: { uk: "Україна", en: "Ukraine", de: "Ukraine", fr: "Ukraine" }[lang], geo: { "@type": "GeoShape", box: "44.3 22.1 52.4 40.3" } },
    distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: SITE + url },
  };
}

/** The dashboard only needs these fields; full issues stay on the server. */
const slim = (d: Digest): DashIssue => ({
  contentLang: d.contentLang, date: d.date, airDefense: d.airDefense, front: d.front, civilianStats: d.civilianStats,
  timeline: d.timeline, airDefenseHistory: d.airDefenseHistory, losses: d.losses,
});
const hl = (d: Digest) => (d.headline?.title ? { title: d.headline.title, item: d.headline.item } : null);

export default async function DashPage({ lang, params, view = "dashboard" }: { lang: DashLang; params: DateParams; view?: "dashboard" | "maps" | "strikes" }) {
  const { latest, dates, D, dir, panel } = await resolve(params, lang);
  const t = UI[lang] as UIStrings;
  const MAPS = await getMapsUrl(D.date);
  // the maps and strikes pages read no issue series: ship the date, language and the General Staff directions, not the timelines and losses
  const bare = (d: Digest) => ({ date: d.date, contentLang: d.contentLang, front: { directions: d.front?.directions, period: d.front?.period, source: d.front?.source }, dirOrder: dirOrder(TL(d)) }) as DashIssue;
  const maps = view !== "dashboard";
  // the analytics' newest figures (latest issue only): server-rendered text, the maps/strikes mentions, the dashboard's first paint
  const an = D.date === latest.date ? await getAnalytics(D) : null;
  if (panel) {
    // an analytics page: its own title and text on the server, the interactive panel under it
    const method = panel === "potential" ? (await getMaps<{ method: string }>("/potential.json", lang)).method : "";
    return (
      <div className="shell wide">
        <Ld ld={dashLd(lang, D.date, panel)} />
        <Shell lang={lang} t={t} view="dashboard" date={D.date} latest={latest.date} dates={dates} />
        <main id="main"><div className="view"><article className="pnl">
          <PanelIntro panel={panel} an={an} lang={lang} />
          <DashProvider view="dashboard" lang={lang} D={slim(D)} LATEST={slim(latest)} DATES={dates} MAPS={MAPS} smx={null}
            mapsMini={null} strikesMini={null} headline={null} an={an} panel={panel} />
          <PanelFoot panel={panel} an={an} lang={lang} method={method} />
        </article></div></main>
      </div>
    );
  }
  return (
    <div className={maps ? "shell" : "shell wide"}>
      {view === "maps" && !dir && <Ld ld={await mapsLd(lang, D.date, MAPS)} />}
      {view === "dashboard" && <Ld ld={dashLd(lang, D.date)} />}
      <Shell lang={lang} t={t} view={view} date={D.date} latest={latest.date} dates={dates} />
      <Mast D={D} lang={lang} dashboard />
      <main id="main"><div className="view">
        <DashProvider view={view} lang={lang} D={(maps ? bare : slim)(D)} LATEST={(maps ? bare : slim)(latest)} DATES={dates} MAPS={MAPS}
          smx={!maps && SHOW_SOURCE_MATRIX ? await getSourceMatrix() : null}
          mapsCard={maps ? null : <MapsCard lang={lang} date={D.date} latest={latest.date} url={MAPS} />}
          strikesCard={maps ? null : <StrikesCard lang={lang} date={D.date} latest={latest.date} />}
          mapsMini={maps ? null : <MapsCard lang={lang} date={D.date} latest={latest.date} url={MAPS} mini />}
          strikesMini={maps ? null : <StrikesCard lang={lang} date={D.date} latest={latest.date} mini />}
          headline={hl(D)} an={an} summary={maps ? null : <DashSummary D={D} an={an} lang={lang} />}
          strikesSeo={view === "strikes" ? <StrikesSeo lang={lang} date={D.date} latest={latest.date} /> : null}
          mapsSeo={view === "maps" ? <MapsSeo lang={lang} url={MAPS} dir={dir} /> : null} dir={dir?.id} />
      </div></main>
    </div>
  );
}
