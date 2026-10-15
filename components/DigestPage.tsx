// Server component: a whole Digest page (no dashboard code is imported here, so none ships to the browser).
import { getStrikes } from "@/lib/data";
import { resolve, type DateParams } from "@/lib/page";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import Shell from "./Shell";
import Mast from "./Mast";
import Digest from "./digest/Digest";
import HashRedirect from "./HashRedirect";

export default async function DigestPage({ lang, params }: { lang: Lang; params: DateParams }) {
  const { latest, dates, D } = await resolve(params, lang);
  const t = UI[lang] as UIStrings;
  return (
    <>
      <div className="shell">
        <Shell lang={lang} t={t} view="digest" date={D.date} latest={latest.date} dates={dates} />
        <Mast D={D} lang={lang} dashboard={false} />
        <main id="main"><div className="view"><Digest D={D} lang={lang} t={t} strikes={await getStrikes()} /></div></main>
      </div>
      {lang === "uk" && D.date === latest.date && <HashRedirect latest={latest.date} dates={dates} />}
    </>
  );
}
