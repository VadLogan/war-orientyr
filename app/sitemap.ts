import type { MetadataRoute } from "next";
import { articleParams } from "@/components/ArticlePage";
import { getDates, getLatest } from "@/lib/data";
import { articleHref, href, SITE, type View } from "@/lib/routes";
import type { Lang } from "@/lib/ui";

/** Every statically generated page, each with its uk/en twin as hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [latest, dates, articles] = await Promise.all([getLatest().then((d) => d.date), getDates(), articleParams()]);
  const entry = (url: (l: Lang) => string, date: string) => (["uk", "en"] as const).map((l) => ({
    url: SITE + url(l),
    lastModified: date,
    alternates: { languages: { uk: SITE + url("uk"), en: SITE + url("en"), "x-default": SITE + url("uk") } },
  }));
  return [
    // roots ("/", "/dashboard") + every issue at its dated URL, the latest included
    ...(["digest", "dashboard"] as View[]).flatMap((v) => [null, ...dates].map((d) => entry((l) => href(l, v, d, ""), d ?? latest)).flat()),
    ...articles.flatMap(({ date, name }) => entry((l) => articleHref(l, date, name), date)),
  ];
}
