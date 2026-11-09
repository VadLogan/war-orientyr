// Server component: /articles — every article, newest first, with search and filters (client island `ArticleList`).
import type { Metadata } from "next";
import { getArticleList, getDates, getLatest } from "@/lib/data";
import { articlesHref, href, SITE, SITE_NAME } from "@/lib/routes";
import { seoMeta } from "@/lib/page";
import { midDate, noFlag } from "@/lib/text";
import type { ArticleItem } from "@/types/digest";
import { LANGS, SUBS, UI, type Lang, type UIStrings } from "@/lib/ui";
import Ld from "./Ld";
import Shell from "./Shell";
import ArticleList from "./ArticleList";

const hrefs = Object.fromEntries(LANGS.map((l) => [l.code, articlesHref(l.code)])) as Record<Lang, string>;

/** Share image: the newest article's cover (else the site's). */
export async function articlesMeta(lang: Lang): Promise<Metadata> {
  const cover = (await getArticleList(lang)).find((a) => a.img)?.img;
  return seoMeta(lang, articlesHref, UI[lang].arts.title, UI[lang].arts.sub, cover, SUBS, "website");
}

/** schema.org CollectionPage with the articles as an ItemList (each article page carries its own NewsArticle). */
function LdList({ items, lang }: { items: ArticleItem[]; lang: Lang }) {
  const ld = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: UI[lang].arts.title, description: UI[lang].arts.sub,
    url: SITE + articlesHref(lang), inLanguage: lang, isPartOf: { "@type": "WebSite", name: SITE_NAME[lang], url: SITE },
    mainEntity: {
      "@type": "ItemList", numberOfItems: items.length,
      itemListElement: items.map((a, k) => ({
        "@type": "ListItem", position: k + 1, url: SITE + a.href,
        item: { "@type": "NewsArticle", headline: noFlag(a.title), datePublished: a.date, url: SITE + a.href, inLanguage: a.contentLang, ...(a.img && { image: SITE + a.img }) },
      })),
    },
  };
  return <Ld ld={ld} />;
}

export default async function ArticlesPage({ lang }: { lang: Lang }) {
  const [items, latest, dates] = await Promise.all([getArticleList(lang), getLatest(), getDates()]);
  const t = UI[lang] as UIStrings;
  const rows = items.map((a) => ({ ...a, issue: dates.includes(a.date) ? href(lang, "digest", a.date, latest.date) : undefined }));
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view="articles" date={latest.date} latest={latest.date} dates={dates} langHrefs={hrefs} />
      <LdList items={items} lang={lang} />
      <main id="main" className="al">
        <header className="al-head">
          <div>
            <p className="dateline">{t.arts.kicker}</p>
            <h1>{t.arts.h}</h1>
            <p className="al-sub">{t.arts.sub}</p>
          </div>
          {items.length > 0 && <p className="al-range">{t.arts.n(items.length)}<br />{midDate(items.at(-1)!.date, lang)} — {midDate(items[0].date, lang)}</p>}
        </header>
        <ArticleList items={rows} lang={lang} />
      </main>
    </div>
  );
}
