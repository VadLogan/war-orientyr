// Server component: a whole Dashboard page; the charts are a client tree fed with trimmed server data.
import type { Digest } from "@/types/digest";
import { getMapsUrl, getSourceMatrix, SHOW_SOURCE_MATRIX } from "@/lib/data";
import { resolve, type DateParams } from "@/lib/page";
import { UI, type UIStrings } from "@/lib/ui";
import type { DashIssue, DashLang } from "../ctx";
import Shell from "../Shell";
import Mast from "../Mast";
import DashProvider from "./DashProvider";

/** The dashboard only needs these fields; full issues stay on the server. */
const slim = (d: Digest): DashIssue => ({
  contentLang: d.contentLang, date: d.date, airDefense: d.airDefense, front: d.front, civilianStats: d.civilianStats,
  timeline: d.timeline, airDefenseHistory: d.airDefenseHistory, losses: d.losses,
});

/** `from`: "de" on /de/dashboard — the dashboard has no German version, so it is shown in English with a notice. */
export default async function DashPage({ lang, params, from }: { lang: DashLang; params: DateParams; from?: "de" }) {
  const { latest, dates, D } = await resolve(params, lang);
  const t = UI[lang] as UIStrings;
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view="dashboard" date={D.date} latest={latest.date} dates={dates} from={from} />
      <Mast D={D} lang={lang} dashboard />
      <main id="main"><div className="view">
        <DashProvider lang={lang} D={slim(D)} LATEST={slim(latest)} DATES={dates} MAPS={await getMapsUrl(D.date)} smx={SHOW_SOURCE_MATRIX ? await getSourceMatrix() : null} />
      </div></main>
    </div>
  );
}
