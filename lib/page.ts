// Shared server logic of the four routes: [/en][/dashboard][/YYYY-MM-DD].
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Digest } from "@/types/digest";
import { getDates, getIssue, getLatest } from "./data";
import { href, SITE, SITE_NAME, type View } from "./routes";
import { clip, dateTitle } from "./text";
import { UI, type Lang } from "./ui";

export type DateParams = Promise<{ date?: string[] }>;

/** Static params for a route: no segment = latest issue, plus every archive date. */
export async function dateParams() {
  const latest = (await getLatest()).date;
  return [{ date: [] as string[] }, ...(await getDates()).filter((d) => d !== latest).map((d) => ({ date: [d] }))];
}

export async function resolve(params: DateParams, lang: Lang): Promise<{ latest: Digest; dates: string[]; D: Digest }> {
  const seg = (await params).date || [];
  const [latest, dates] = await Promise.all([getLatest(lang), getDates()]);
  const date = seg[0] ?? latest.date;
  if (seg.length > 1 || !dates.includes(date) || seg[0] === latest.date) notFound();
  return { latest, dates, D: await getIssue(date, lang) };
}

export async function pageMeta(lang: Lang, view: View, params: DateParams): Promise<Metadata> {
  const { latest, D } = await resolve(params, lang);
  const url = (l: Lang) => href(l, view, D.date, latest.date);
  // digest: the issue's headline (old issues have none → date); dashboard: date. Site name added by the layout template.
  const title = view === "digest" && D.headline?.title ? clip(D.headline.title, 60) : dateTitle(D, lang).h + (view === "dashboard" ? " · " + UI[lang].dash : "");
  const description = clip((D.headline?.title ? D.headline.text : D.lede) || D.lede || "", 160);
  return {
    ...seoMeta(lang, url, title, description),
    ...(view === "dashboard" && {
      icons: { icon: [{ url: "/dash/icon.svg", type: "image/svg+xml" }, { url: "/dash/icon-32.png", sizes: "32x32" }], apple: "/dash/apple-icon.png" },
    }),
  };
}

/** metadataBase, canonical + hreflang (x-default = the Ukrainian URL, which redirects by Accept-Language), Open Graph, Twitter. */
export function seoMeta(lang: Lang, url: (l: Lang) => string, title: string, description: string, image = "/og.png"): Metadata {
  const images = [image === "/og.png" ? { url: image, width: 1200, height: 630, alt: SITE_NAME[lang] } : { url: image }];
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical: url(lang), languages: { uk: url("uk"), en: url("en"), "x-default": url("uk") } },
    openGraph: { type: "article", siteName: SITE_NAME[lang], locale: lang === "en" ? "en_GB" : "uk_UA", url: url(lang), title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
