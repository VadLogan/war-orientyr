// Shared server logic of the issue routes: [/en|/de][/dashboard][/YYYY-MM-DD].
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Digest } from "@/types/digest";
import { getDates, getIssue, getLatest } from "./data";
import { href, SITE, SITE_DESC, SITE_NAME, type View } from "./routes";
import { clip, dateTitle } from "./text";
import { UI, type Lang } from "./ui";

export type DateParams = Promise<{ date?: string[] }>;

/** Static params for a route: no segment = latest issue, plus every date (the latest too, so search results keep a stable URL). */
export async function dateParams() {
  return [{ date: [] as string[] }, ...(await getDates()).map((d) => ({ date: [d] }))];
}

export async function resolve(params: DateParams, lang: Lang): Promise<{ latest: Digest; dates: string[]; D: Digest }> {
  const seg = (await params).date || [];
  const [latest, dates] = await Promise.all([getLatest(lang), getDates()]);
  const date = seg[0] ?? latest.date;
  if (seg.length > 1 || !dates.includes(date)) notFound();
  return { latest, dates, D: await getIssue(date, lang) };
}

export async function pageMeta(lang: Lang, view: View, params: DateParams): Promise<Metadata> {
  const { D } = await resolve(params, lang);
  // German: the dashboard always; a digest only with German text — otherwise it is the English page, canonical included
  const de = view === "dashboard" || (lang === "de" ? D : (await resolve(params, "de")).D).contentLang === "de";
  if (lang === "de" && !de) return pageMeta("en", view, params);
  const root = !(await params).date?.length;
  let meta: Metadata;
  if (root) {
    // "/" and "/dashboard" change daily: generic title/description, so a search result doesn't promise a past issue's story.
    const title = view === "dashboard" ? UI[lang].dash : SITE_NAME[lang];
    meta = seoMeta(lang, (l) => href(l, view, null, ""), title, SITE_DESC[lang], undefined, de);
    if (view === "digest") meta.title = { absolute: title };
  } else {
    // digest: the issue's headline (old issues have none → date); dashboard: date. Site name added by the layout template.
    const title = view === "digest" && D.headline?.title ? clip(D.headline.title, 60) : dateTitle(D, lang).h + (view === "dashboard" ? " · " + UI[lang].dash : "");
    const description = clip((D.headline?.title ? D.headline.text : D.lede) || D.lede || "", 160);
    meta = seoMeta(lang, (l) => href(l, view, D.date, ""), title, description, undefined, de); // always the dated URL, the latest issue too
  }
  return {
    ...meta,
    ...(view === "dashboard" && {
      icons: { icon: [{ url: "/dash/icon.svg", type: "image/svg+xml" }, { url: "/dash/icon-32.png", sizes: "32x32" }], apple: "/dash/apple-icon.png" },
    }),
  };
}

/** metadataBase, canonical + hreflang (x-default = the Ukrainian URL, which redirects by Accept-Language), Open Graph, Twitter.
 *  `de`: the page has a German version (hreflang de). */
export function seoMeta(lang: Lang, url: (l: Lang) => string, title: string, description: string, image = "/og.png", de = false): Metadata {
  const images = [image === "/og.png" ? { url: image, width: 1200, height: 630, alt: SITE_NAME[lang] } : { url: image }];
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical: url(lang), languages: { uk: url("uk"), en: url("en"), ...(de && { de: url("de") }), "x-default": url("uk") } },
    openGraph: { type: "article", siteName: SITE_NAME[lang], locale: { uk: "uk_UA", en: "en_GB", de: "de_DE" }[lang], url: url(lang), title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
