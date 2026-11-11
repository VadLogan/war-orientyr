// Shared server logic of the issue routes: [/en|/de][/dashboard][/YYYY-MM-DD].
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Digest } from "@/types/digest";
import { getDates, getIssue, getLatest } from "./data";
import { href, SITE, SITE_DESC, SITE_NAME, SITE_TAG, tgHref, type View } from "./routes";
import { clip, dateTitle } from "./text";
import { SUBS, UI, isSub, type Lang, type SubLang } from "./ui";
import { DIRS } from "@/components/dash/mapParts";

/** Front directions as /maps/<slug> pages (the latest issue, framed on that direction): slug from the English name. */
export type Dir = (typeof DIRS)[number];
export const dirSlug = (d: Dir) => d.en.toLowerCase().replace(/\s+/g, "-");
export const dirHref = (lang: Lang, d: Dir) => href(lang, "maps", null, "") + "/" + dirSlug(d);
export const dirTitle = (lang: Lang, d: Dir) => ({ uk: `${d.uk} напрямок: карта фронту`, en: `${d.en} direction: front map`, de: `Frontabschnitt ${d.de}: Frontkarte`, fr: `Direction de ${d.fr} : carte du front` })[lang];
const dirDesc = (lang: Lang, d: Dir) => ({
  uk: `${d.uk} напрямок: лінія фронту за DeepState, оцінка ISW і заяви рф (DIVGEN) про захоплення — що змінилося за тиждень. Оновлюється щодня.`,
  en: `The ${d.en} direction: DeepState’s front line, ISW’s assessment and russian capture claims (DIVGEN) — what changed this week. Updated daily.`,
  de: `Frontabschnitt ${d.de}: die Frontlinie laut DeepState, die ISW-Einschätzung und russische Eroberungsmeldungen (DIVGEN) – was sich diese Woche verändert hat. Täglich aktualisiert.`,
  fr: `Direction de ${d.fr} : la ligne de front selon DeepState, l’évaluation de l’ISW et les revendications russes de conquête (DIVGEN) – ce qui a changé cette semaine. Mis à jour chaque jour.`,
})[lang];

/** The dashboard analytics as pages of their own (/dashboard/landcost, /dashboard/potential + /en, /de, /fr): the latest issue. */
export const PANELS = ["landcost", "potential"] as const;
export type Panel = (typeof PANELS)[number];
export const panelHref = (lang: Lang, p: Panel) => href(lang, "dashboard", null, "") + "/" + p;
export const panelTitle = (lang: Lang, p: Panel) => ({
  landcost: { uk: "Ціна кілометра: втрати росії на 1 км² захопленої землі", en: "The price of a kilometre: russian losses per km² seized", de: "Der Preis eines Kilometers: russische Verluste pro eroberten km²", fr: "Le prix d’un kilomètre : pertes russes par km² conquis" },
  potential: { uk: "Ударний потенціал росії: дрони й ракети — виробництво, запуски, запас", en: "russia’s strike potential: drones and missiles — output, launches, reserve", de: "russlands Angriffspotenzial: Drohnen und Raketen – Produktion, Starts, Reserve", fr: "Le potentiel de frappe de la russie : drones et missiles – production, lancements, réserve" },
})[p][lang];
export const panelDesc = (lang: Lang, p: Panel) => ({
  landcost: { uk: "Скільки особового складу й техніки росія втрачає за кожен захоплений км²: втрати за Генштабом ЗСУ, площа за DeepState — з 2022 року, за 30 і 7 днів. Оновлюється щодня.", en: "How much personnel and equipment russia loses for every km² it seizes: losses per Ukraine’s General Staff, area per DeepState — since 2022, over 30 and 7 days. Updated daily.", de: "Wie viel Personal und Material russland pro eroberten km² verliert: Verluste laut ukrainischem Generalstab, Fläche laut DeepState – seit 2022, über 30 und 7 Tage. Täglich aktualisiert.", fr: "Combien de soldats et de matériel la russie perd pour chaque km² conquis : pertes selon l’état-major ukrainien, surface selon DeepState – depuis 2022, sur 30 et 7 jours. Mis à jour chaque jour." },
  potential: { uk: "Скільки дронів, балістичних і крилатих ракет росія виробляє й запускає щомісяця, що лишається в запасі й на скільки його вистачить — оцінки ГУР і три сценарії до 2027 року.", en: "How many drones, ballistic and cruise missiles russia makes and launches each month, what is left in reserve and how long it would last — HUR estimates and three scenarios to 2027.", de: "Wie viele Drohnen, ballistische Raketen und Marschflugkörper russland monatlich herstellt und startet, was in Reserve bleibt und wie lange sie reicht – HUR-Schätzungen und drei Szenarien bis 2027.", fr: "Combien de drones, de missiles balistiques et de croisière la russie produit et lance chaque mois, ce qui reste en réserve et combien de temps elle tiendrait – estimations du HUR et trois scénarios jusqu’en 2027." },
})[p][lang];

export type DateParams = Promise<{ date?: string[] }>;

/** Static params for a route: no segment = latest issue, plus every date (the latest too, so search results keep a stable URL). */
export async function dateParams() {
  return [{ date: [] as string[] }, ...(await getDates()).map((d) => ({ date: [d] }))];
}
/** /dashboard: the dates plus a page per analytic. */
export const dashParams = async () => [...(await dateParams()), ...PANELS.map((p) => ({ date: [p] }))];
/** /maps: the dates plus a page per front direction. */
export const mapsParams = async () => [...(await dateParams()), ...DIRS.map((d) => ({ date: [dirSlug(d)] }))];
/** /strikes: the dates plus /strikes/targets (potential targets; not dated — shown with the latest issue). */
export const strikesParams = async () => [...(await dateParams()), { date: ["targets"] }];

export async function resolve(params: DateParams, lang: Lang): Promise<{ latest: Digest; dates: string[]; D: Digest; dir?: Dir; panel?: Panel; tg?: boolean }> {
  const seg = (await params).date || [];
  const [latest, dates] = await Promise.all([getLatest(lang), getDates()]);
  const dir = DIRS.find((d) => dirSlug(d) === seg[0]); // only /maps generates these params
  const panel = PANELS.find((p) => p === seg[0]); // only /dashboard generates these
  const tg = seg[0] === "targets"; // only /strikes generates it
  const date = dir || panel || tg ? latest.date : seg[0] ?? latest.date;
  if (seg.length > 1 || !dates.includes(date)) notFound();
  return { latest, dates, D: await getIssue(date, lang), dir, panel, tg };
}

/** Search/share description of the dashboard, maps and strikes pages (maps/strikes reuse their "new on the site" cards). */
const DASH_DESC: Record<Lang, string> = {
  uk: "Війна в цифрах: втрати сторін, удари й ППО, ціна кілометра фронту, ціни й вербування в рф — графіки за кожен день.",
  en: "The war in numbers: losses on both sides, strikes and air defence, the price of a kilometre of front, russian prices and recruitment — charted day by day.",
  de: "Der Krieg in Zahlen: Verluste beider Seiten, Angriffe und Luftabwehr, der Preis eines Frontkilometers, Preise und Rekrutierung in russland – Tag für Tag.",
  fr: "La guerre en chiffres : pertes des deux camps, frappes et défense aérienne, le prix d’un kilomètre de front, prix et recrutement en russie – jour après jour.",
};
const viewDesc = (lang: Lang, view: "dashboard" | "maps" | "strikes") => view === "dashboard" ? DASH_DESC[lang] : UI[lang].nw[view].p;

/** Search titles of the dashboard, maps and strikes pages: `day` = "" for the undated page (today), else the issue's short date. */
const shortDate = (date: string, lang: Lang) => {
  const d = new Date(date + "T12:00:00Z");
  return lang === "uk" ? d.toLocaleDateString("uk-UA", { day: "numeric", month: "long", timeZone: "UTC" }) + " " + d.getUTCFullYear()
    : d.toLocaleDateString({ en: "en-GB", de: "de-DE", fr: "fr-FR" }[lang], { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};
const n = "\u202f"; // French: narrow no-break space before ":"
const VIEW_TITLE: Record<"dashboard" | "maps" | "strikes", Record<Lang, (day: string) => string>> = {
  maps: {
    uk: (d) => d ? `Лінія фронту на ${d}: DeepState, ISW і заяви рф` : "Карта фронту в Україні сьогодні — DeepState, ISW і заяви рф",
    en: (d) => d ? `Front line on ${d}: DeepState vs ISW vs russian claims` : "Ukraine front line map today — DeepState vs ISW vs russian claims",
    de: (d) => d ? `Frontverlauf am ${d}: DeepState, ISW, russische Meldungen` : "Frontverlauf Ukraine heute: Karte – DeepState, ISW, russische Meldungen",
    fr: (d) => d ? `Ligne de front au ${d}${n}: DeepState, ISW, revendications russes` : "Carte du front en Ukraine aujourd’hui – DeepState, ISW, revendications russes",
  },
  strikes: {
    uk: (d) => d ? `Удари України по росії на ${d}: карта` : "Карта ударів України по росії сьогодні: НПЗ, аеродроми, заводи",
    en: (d) => d ? `Ukraine’s strikes on russia, ${d}: map` : "Map of Ukraine’s strikes on russia today: refineries, airfields, plants",
    de: (d) => d ? `Ukrainische Angriffe auf russland am ${d}: Karte` : "Ukrainische Angriffe auf russland heute: Karte – Raffinerien, Flugplätze, Werke",
    fr: (d) => d ? `Frappes ukrainiennes en russie au ${d}${n}: carte` : `Carte des frappes ukrainiennes en russie aujourd’hui${n}: raffineries, aérodromes, usines`,
  },
  dashboard: {
    uk: (d) => `Війна в цифрах ${d ? "на " + d : "сьогодні"}: втрати, удари, ціна кілометра`,
    en: (d) => `The war in numbers ${d ? "on " + d : "today"}: losses, strikes, price per km`,
    de: (d) => `Der Krieg in Zahlen ${d ? "am " + d : "heute"}: Verluste, Angriffe, Preis pro km`,
    fr: (d) => `La guerre en chiffres ${d ? "au " + d : "aujourd’hui"}${n}: pertes, frappes, prix du km`,
  },
};

/** The maps pages share that day's front map (app/og/maps), the dashboard that day's numbers (app/og/dashboard), the rest the site image. */
export const mapsImg = (view: View, date: string) => view === "maps" ? `/og/maps/${date}.png` : view === "dashboard" ? `/og/dashboard/${date}.png` : undefined;

export async function pageMeta(lang: Lang, view: Exclude<View, "articles">, params: DateParams): Promise<Metadata> {
  const { D, dir, panel, tg } = await resolve(params, lang);
  // German/French: the dashboard, maps and strikes always; a digest only with text in that language — otherwise it is the English page, canonical included
  const subs = view !== "digest" ? [...SUBS] : (await Promise.all(SUBS.map(async (l) => ((lang === l ? D : (await resolve(params, l)).D).contentLang === l ? l : null)))).filter((l): l is SubLang => !!l);
  if (isSub(lang) && !subs.includes(lang)) return pageMeta("en", view, params);
  const root = !(await params).date?.length;
  let meta: Metadata;
  if (panel) meta = seoMeta(lang, (l) => panelHref(l, panel), panelTitle(lang, panel), clip(panelDesc(lang, panel), 160), mapsImg(view, D.date), SUBS, "website");
  else if (tg) meta = seoMeta(lang, tgHref, UI[lang].stk.tgTitle, clip(UI[lang].stk.tgSub, 160), undefined, SUBS, "website");
  else if (dir) meta = seoMeta(lang, (l) => dirHref(l, dir), dirTitle(lang, dir), clip(dirDesc(lang, dir), 160), mapsImg(view, D.date), SUBS, "website");
  else if (root) {
    // "/" and "/dashboard" change daily: generic title/description, so a search result doesn't promise a past issue's story.
    const title = view === "digest" ? `${SITE_NAME[lang]} — ${SITE_TAG[lang]}` : VIEW_TITLE[view][lang]("");
    meta = seoMeta(lang, (l) => href(l, view, null, ""), title, clip(view === "digest" ? SITE_DESC[lang] : viewDesc(lang, view), 160), mapsImg(view, D.date), subs, "website");
    if (view === "digest") meta.title = { absolute: title };
  } else {
    // digest: the issue's headline (old issues have none → date); dashboard: date. Site name added by the layout template.
    const title = view === "digest" && D.headline?.title ? clip(D.headline.title, 60) : view === "digest" ? dateTitle(D, lang).h : VIEW_TITLE[view][lang](shortDate(D.date, lang));
    // digest: the headline's text (else the lede); the other views: the date + what the view shows, so the four URLs of a day differ
    const description = clip(view === "digest" ? (D.headline?.title ? D.headline.text : D.lede) || D.lede || "" : dateTitle(D, lang).h + ". " + viewDesc(lang, view), 160);
    meta = seoMeta(lang, (l) => href(l, view, D.date, ""), title, description, mapsImg(view, D.date), subs); // always the dated URL, the latest issue too
  }
  return {
    ...meta,
    ...(view !== "digest" && {
      icons: { icon: [{ url: "/dash/icon.svg", type: "image/svg+xml" }, { url: "/dash/icon-32.png", sizes: "32x32" }], apple: "/dash/apple-icon.png" },
    }),
  };
}

/** metadataBase, canonical + hreflang (x-default = the Ukrainian URL, which redirects by Accept-Language), Open Graph, Twitter.
 *  `subs`: the German/French versions the page has (hreflang de/fr). `type`: og:type — "website" for a listing. */
export function seoMeta(lang: Lang, url: (l: Lang) => string, title: string, description: string, image = "/og.png", subs: readonly SubLang[] = [], type: "article" | "website" = "article"): Metadata {
  // og:/twitter:title get no layout template: add the brand here (the home page's title already has it)
  const full = title.includes(SITE_NAME[lang]) ? title : `${title} | ${SITE_NAME[lang]}`;
  const images = [image === "/og.png" || image.startsWith("/og/") ? { url: image, width: 1200, height: 630, alt: SITE_NAME[lang] } : { url: image }];
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical: url(lang), languages: { uk: url("uk"), en: url("en"), ...Object.fromEntries(subs.map((l) => [l, url(l)])), "x-default": url("uk") } },
    openGraph: { type, siteName: SITE_NAME[lang], locale: { uk: "uk_UA", en: "en_GB", de: "de_DE", fr: "fr_FR" }[lang], url: url(lang), title: full, description, images },
    twitter: { card: "summary_large_image", title: full, description, images },
  };
}
