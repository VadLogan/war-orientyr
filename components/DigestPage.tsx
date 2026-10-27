// Server component: a whole Digest page (no dashboard code is imported here, so none ships to the browser).
import { getPreviews, getStrikes } from "@/lib/data";
import { resolve, type DateParams } from "@/lib/page";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import Shell from "./Shell";
import Mast from "./Mast";
import Digest from "./digest/Digest";
import HashRedirect from "./HashRedirect";

export default async function DigestPage({ lang, params, from }: { lang: Lang; params: DateParams; from?: "de" }) {
  const { latest, dates, D } = await resolve(params, lang);
  if (lang === "de" && D.contentLang !== "de") return <div lang="en" style={{ display: "contents" }}><DigestPage lang="en" params={params} from="de" /></div>; // no German text for this issue
  const t = UI[lang] as UIStrings;
  return (
    <>
      <div className="shell">
        <Shell lang={lang} t={t} view="digest" date={D.date} latest={latest.date} dates={dates} from={from} />
        <Mast D={D} lang={lang} dashboard={false} articles={await getPreviews(D.date, lang)} />
        <main id="main"><div className="view"><Digest D={D} lang={lang} t={t} strikes={await getStrikes()} /></div></main>
      </div>
      {lang === "uk" && D.date === latest.date && <HashRedirect latest={latest.date} dates={dates} />}
    </>
  );
}
