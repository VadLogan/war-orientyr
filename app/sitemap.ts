import type { MetadataRoute } from "next";
import { articleParams } from "@/components/ArticlePage";
import { getArticle, getDates, getIssue, getLatest } from "@/lib/data";
import { articleHref, articlesHref, href, SITE, tgHref, type View } from "@/lib/routes";
import { SUBS, type Lang, type SubLang } from "@/lib/ui";
import { dirHref, PANELS, panelHref } from "@/lib/page";
import { DIRS } from "@/components/dash/mapParts";

/** Every statically generated page, each with its uk/en (and de/fr, where text in that language exists) twins as hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [latest, dates, articles] = await Promise.all([getLatest().then((d) => d.date), getDates(), articleParams()]);
  const entry = (url: (l: Lang) => string, date: string, subs: readonly SubLang[] = []) => (["uk", "en", ...subs] as Lang[]).map((l) => ({
    url: SITE + url(l),
    lastModified: date,
    alternates: { languages: { uk: SITE + url("uk"), en: SITE + url("en"), ...Object.fromEntries(subs.map((s) => [s, SITE + url(s)])), "x-default": SITE + url("uk") } },
  }));
  const has = async (get: (l: SubLang) => Promise<{ contentLang?: string } | null>) => (await Promise.all(SUBS.map(async (l) => ((await get(l))?.contentLang === l ? l : null)))).filter((l): l is SubLang => !!l);
  const subDigest = await Promise.all([latest, ...dates].map((d) => has((l) => getIssue(d, l))));
  const subArt = await Promise.all(articles.map(({ date, name }) => has((l) => getArticle(date, name, l))));
  return [
    // roots ("/", "/dashboard") + every issue at its dated URL, the latest included
    ...(["digest", "dashboard", "maps", "strikes"] as View[]).flatMap((v) => [null, ...dates].map((d, k) => entry((l) => href(l, v, d, ""), d ?? latest, v !== "digest" ? SUBS : subDigest[k])).flat()),
    ...DIRS.flatMap((d) => entry((l) => dirHref(l, d), latest, SUBS)),
    ...PANELS.flatMap((p) => entry((l) => panelHref(l, p), latest, SUBS)),
    ...entry(tgHref, latest, SUBS),
    ...entry(articlesHref, articles.at(-1)?.date ?? latest, SUBS),
    ...articles.flatMap(({ date, name }, k) => entry((l) => articleHref(l, date, name), date, subArt[k])),
  ];
}
