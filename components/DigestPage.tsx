// Server component: a whole Digest page (no dashboard code is imported here, so none ships to the browser).
import { getPreviews, getRecords, getStrikes } from "@/lib/data";
import { resolve, type DateParams } from "@/lib/page";
import { href, SITE, SITE_DESC, SITE_NAME } from "@/lib/routes";
import { clip, dateTitle, noFlag } from "@/lib/text";
import type { Digest as DigestT } from "@/types/digest";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import Ld from "./Ld";
import Shell from "./Shell";
import Mast from "./Mast";
import Digest from "./digest/Digest";
import HashRedirect from "./HashRedirect";

/** Root: the site as a WebSite; a dated issue: a NewsArticle (headline, lede, date, share image). */
function issueLd(D: DigestT, lang: Lang, root: boolean) {
  const publisher = { "@type": "Organization", name: SITE_NAME[lang], url: SITE, logo: SITE + "/icon-512.png" };
  if (root) return { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME[lang], description: SITE_DESC[lang], url: SITE + href(lang, "digest", null, ""), inLanguage: lang, publisher };
  const url = SITE + href(lang, "digest", D.date, "");
  return {
    "@context": "https://schema.org", "@type": "NewsArticle", headline: clip(D.headline?.title || dateTitle(D, lang).h, 110),
    description: noFlag((D.headline?.title ? D.headline.text : D.lede) || D.lede || ""), datePublished: D.date, dateModified: D.date,
    inLanguage: D.contentLang ?? lang, mainEntityOfPage: url, url, image: [SITE + "/og.png"], author: publisher, publisher,
  };
}

export default async function DigestPage({ lang, params, from }: { lang: Lang; params: DateParams; from?: "de" }) {
  const { latest, dates, D } = await resolve(params, lang);
  if (lang === "de" && D.contentLang !== "de") return <div lang="en" style={{ display: "contents" }}><DigestPage lang="en" params={params} from="de" /></div>; // no German text for this issue
  const t = UI[lang] as UIStrings;
  return (
    <>
      <Ld ld={issueLd(D, lang, !(await params).date?.length)} />
      <div className="shell">
        <Shell lang={lang} t={t} view="digest" date={D.date} latest={latest.date} dates={dates} from={from} />
        <Mast D={D} lang={lang} dashboard={false} articles={await getPreviews(D.date, lang)} records={await getRecords(D, lang)} latest={latest.date} />
        <main id="main"><div className="view"><Digest D={D} lang={lang} t={t} latest={latest.date} strikes={await getStrikes()} /></div></main>
      </div>
      {lang === "uk" && D.date === latest.date && <HashRedirect latest={latest.date} dates={dates} />}
    </>
  );
}
