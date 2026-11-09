// Shared server logic of the issue routes: [/en|/de][/dashboard][/YYYY-MM-DD].
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Digest } from "@/types/digest";
import { getDates, getIssue, getLatest } from "./data";
import { href, SITE, SITE_DESC, SITE_NAME, type View } from "./routes";
import { clip, dateTitle } from "./text";
import { UI, type Lang } from "./ui";
import { DIRS } from "@/components/dash/mapParts";

/** Front directions as /maps/<slug> pages (the latest issue, framed on that direction): slug from the English name. */
export type Dir = (typeof DIRS)[number];
export const dirSlug = (d: Dir) => d.en.toLowerCase().replace(/\s+/g, "-");
export const dirHref = (lang: Lang, d: Dir) => href(lang, "maps", null, "") + "/" + dirSlug(d);
export const dirTitle = (lang: Lang, d: Dir) => ({ uk: `${d.uk} напрямок: карта фронту`, en: `${d.en} direction: front map`, de: `Frontabschnitt ${d.de}: Frontkarte` })[lang];
const dirDesc = (lang: Lang, d: Dir) => ({
  uk: `${d.uk} напрямок: лінія фронту за DeepState, оцінка ISW і заяви рф (DIVGEN) про захоплення — що змінилося за тиждень. Оновлюється щодня.`,
  en: `The ${d.en} direction: DeepState’s front line, ISW’s assessment and russian capture claims (DIVGEN) — what changed this week. Updated daily.`,
  de: `Frontabschnitt ${d.de}: die Frontlinie laut DeepState, die ISW-Einschätzung und russische Eroberungsmeldungen (DIVGEN) – was sich diese Woche verändert hat. Täglich aktualisiert.`,
})[lang];

export type DateParams = Promise<{ date?: string[] }>;

/** Static params for a route: no segment = latest issue, plus every date (the latest too, so search results keep a stable URL). */
export async function dateParams() {
  return [{ date: [] as string[] }, ...(await getDates()).map((d) => ({ date: [d] }))];
}
/** /maps: the dates plus a page per front direction. */
export const mapsParams = async () => [...(await dateParams()), ...DIRS.map((d) => ({ date: [dirSlug(d)] }))];

export async function resolve(params: DateParams, lang: Lang): Promise<{ latest: Digest; dates: string[]; D: Digest; dir?: Dir }> {
  const seg = (await params).date || [];
  const [latest, dates] = await Promise.all([getLatest(lang), getDates()]);
  const dir = DIRS.find((d) => dirSlug(d) === seg[0]); // only /maps generates these params
  const date = dir ? latest.date : seg[0] ?? latest.date;
  if (seg.length > 1 || !dates.includes(date)) notFound();
  return { latest, dates, D: await getIssue(date, lang), dir };
}

/** Search/share description of the dashboard, maps and strikes pages (maps/strikes reuse their "new on the site" cards). */
const DASH_DESC: Record<Lang, string> = {
  uk: "Війна в цифрах: втрати сторін, удари й ППО, ціна кілометра фронту, ціни й вербування в рф — графіки за кожен день.",
  en: "The war in numbers: losses on both sides, strikes and air defence, the price of a kilometre of front, russian prices and recruitment — charted day by day.",
  de: "Der Krieg in Zahlen: Verluste beider Seiten, Angriffe und Luftabwehr, der Preis eines Frontkilometers, Preise und Rekrutierung in russland – Tag für Tag.",
};
const viewDesc = (lang: Lang, view: "dashboard" | "maps" | "strikes") => view === "dashboard" ? DASH_DESC[lang] : UI[lang].nw[view].p;

/** The maps pages share that day's front map (app/og/maps), the rest the site image. */
export const mapsImg = (view: View, date: string) => view === "maps" ? `/og/maps/${date}.png` : undefined;

export async function pageMeta(lang: Lang, view: Exclude<View, "articles">, params: DateParams): Promise<Metadata> {
  const { D, dir } = await resolve(params, lang);
  // German: the dashboard, maps and strikes always; a digest only with German text — otherwise it is the English page, canonical included
  const de = view !== "digest" || (lang === "de" ? D : (await resolve(params, "de")).D).contentLang === "de";
  if (lang === "de" && !de) return pageMeta("en", view, params);
  const root = !(await params).date?.length;
  let meta: Metadata;
  if (dir) meta = seoMeta(lang, (l) => dirHref(l, dir), dirTitle(lang, dir), clip(dirDesc(lang, dir), 160), mapsImg(view, D.date), true, "website");
  else if (root) {
    // "/" and "/dashboard" change daily: generic title/description, so a search result doesn't promise a past issue's story.
    const title = view === "digest" ? SITE_NAME[lang] : UI[lang][view === "dashboard" ? "dash" : view];
    meta = seoMeta(lang, (l) => href(l, view, null, ""), title, clip(view === "digest" ? SITE_DESC[lang] : viewDesc(lang, view), 160), mapsImg(view, D.date), de, "website");
    if (view === "digest") meta.title = { absolute: title };
  } else {
    // digest: the issue's headline (old issues have none → date); dashboard: date. Site name added by the layout template.
    const title = view === "digest" && D.headline?.title ? clip(D.headline.title, 60) : dateTitle(D, lang).h + (view === "digest" ? "" : " · " + UI[lang][view === "dashboard" ? "dash" : view]);
    // digest: the headline's text (else the lede); the other views: the date + what the view shows, so the four URLs of a day differ
    const description = clip(view === "digest" ? (D.headline?.title ? D.headline.text : D.lede) || D.lede || "" : dateTitle(D, lang).h + ". " + viewDesc(lang, view), 160);
    meta = seoMeta(lang, (l) => href(l, view, D.date, ""), title, description, mapsImg(view, D.date), de); // always the dated URL, the latest issue too
  }
  return {
    ...meta,
    ...(view !== "digest" && {
      icons: { icon: [{ url: "/dash/icon.svg", type: "image/svg+xml" }, { url: "/dash/icon-32.png", sizes: "32x32" }], apple: "/dash/apple-icon.png" },
    }),
  };
}

/** metadataBase, canonical + hreflang (x-default = the Ukrainian URL, which redirects by Accept-Language), Open Graph, Twitter.
 *  `de`: the page has a German version (hreflang de). `type`: og:type — "website" for a listing. */
export function seoMeta(lang: Lang, url: (l: Lang) => string, title: string, description: string, image = "/og.png", de = false, type: "article" | "website" = "article"): Metadata {
  const images = [image === "/og.png" || image.startsWith("/og/") ? { url: image, width: 1200, height: 630, alt: SITE_NAME[lang] } : { url: image }];
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical: url(lang), languages: { uk: url("uk"), en: url("en"), ...(de && { de: url("de") }), "x-default": url("uk") } },
    openGraph: { type, siteName: SITE_NAME[lang], locale: { uk: "uk_UA", en: "en_GB", de: "de_DE" }[lang], url: url(lang), title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
