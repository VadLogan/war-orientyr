import type { MetadataRoute } from "next";
import { articleParams } from "@/components/ArticlePage";
import { getArticle, getDates, getIssue, getLatest } from "@/lib/data";
import { articleHref, href, SITE, type View } from "@/lib/routes";
import type { Lang } from "@/lib/ui";

/** Every statically generated page, each with its uk/en (and de, where German text exists) twins as hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [latest, dates, articles] = await Promise.all([getLatest().then((d) => d.date), getDates(), articleParams()]);
  const entry = (url: (l: Lang) => string, date: string, de = false) => (de ? ["uk", "en", "de"] as const : ["uk", "en"] as const).map((l) => ({
    url: SITE + url(l),
    lastModified: date,
    alternates: { languages: { uk: SITE + url("uk"), en: SITE + url("en"), ...(de && { de: SITE + url("de") }), "x-default": SITE + url("uk") } },
  }));
  const deIssue = async (d: string) => (await getIssue(d, "de")).contentLang === "de";
  const deDigest = await Promise.all([latest, ...dates].map(deIssue));
  const deArt = await Promise.all(articles.map(async ({ date, name }) => (await getArticle(date, name, "de"))?.contentLang === "de"));
  return [
    // roots ("/", "/dashboard") + every issue at its dated URL, the latest included
    ...(["digest", "dashboard", "maps"] as View[]).flatMap((v) => [null, ...dates].map((d, k) => entry((l) => href(l, v, d, ""), d ?? latest, v === "digest" && deDigest[k])).flat()),
    ...articles.flatMap(({ date, name }, k) => entry((l) => articleHref(l, date, name), date, deArt[k])),
  ];
}
