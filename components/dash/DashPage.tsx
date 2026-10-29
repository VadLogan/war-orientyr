// Server component: a whole Dashboard page; the charts are a client tree fed with trimmed server data.
import type { Digest } from "@/types/digest";
import { getMapsUrl, getSourceMatrix, SHOW_SOURCE_MATRIX } from "@/lib/data";
import { resolve, type DateParams } from "@/lib/page";
import { UI, type UIStrings } from "@/lib/ui";
import type { DashIssue, DashLang } from "../ctx";
import Shell from "../Shell";
import Mast from "../Mast";
import DashProvider from "./DashProvider";
import MapsCard from "./MapsCard";
import StrikesCard from "./StrikesCard";
import StrikesSeo from "./StrikesSeo";

/** The dashboard only needs these fields; full issues stay on the server. */
const slim = (d: Digest): DashIssue => ({
  contentLang: d.contentLang, date: d.date, airDefense: d.airDefense, front: d.front, civilianStats: d.civilianStats,
  timeline: d.timeline, airDefenseHistory: d.airDefenseHistory, losses: d.losses,
});

/** `from`: "de" on /de/dashboard — the dashboard has no German version, so it is shown in English with a notice. */
export default async function DashPage({ lang, params, from, view = "dashboard" }: { lang: DashLang; params: DateParams; from?: "de"; view?: "dashboard" | "maps" | "strikes" }) {
  const { latest, dates, D } = await resolve(params, lang);
  const t = UI[lang] as UIStrings;
  const MAPS = await getMapsUrl(D.date);
  // the maps and strikes pages read no issue series: ship the date, language and the General Staff directions, not the timelines and losses
  const bare = (d: Digest) => ({ date: d.date, contentLang: d.contentLang, front: { directions: d.front?.directions, period: d.front?.period, source: d.front?.source } }) as DashIssue;
  const maps = view !== "dashboard";
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view={view} date={D.date} latest={latest.date} dates={dates} from={from} />
      <Mast D={D} lang={lang} dashboard />
      <main id="main"><div className="view">
        <DashProvider view={view} lang={lang} D={(maps ? bare : slim)(D)} LATEST={(maps ? bare : slim)(latest)} DATES={dates} MAPS={MAPS}
          smx={!maps && SHOW_SOURCE_MATRIX ? await getSourceMatrix() : null}
          mapsCard={maps ? null : <MapsCard lang={lang} date={D.date} latest={latest.date} url={MAPS} />}
          strikesCard={maps ? null : <StrikesCard lang={lang} date={D.date} latest={latest.date} />}
          strikesSeo={view === "strikes" ? <StrikesSeo lang={lang} date={D.date} latest={latest.date} /> : null} />
      </div></main>
    </div>
  );
}
