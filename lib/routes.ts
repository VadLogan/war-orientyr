// URL scheme: [/en|/de|/fr][/dashboard|/maps|/strikes][/YYYY-MM-DD]; no date = latest issue (routes in app/(uk), app/(en), app/(de), app/(fr)).
import type { Lang } from "./ui";

/** "articles": the article pages (no dated twin; their Shell gets `langHrefs`) */
export type View = "digest" | "dashboard" | "maps" | "strikes" | "articles";
const pre = (lang: Lang) => (lang === "uk" ? "" : "/" + lang);
/** Path for a page; `latest` is omitted from the URL. */
export function href(lang: Lang, view: View, date: string | null, latest: string) {
  const p = pre(lang) + (view === "digest" ? "" : "/" + view) + (date && date !== latest ? "/" + date : "");
  return p || "/";
}
/** The potential-targets view of /strikes: one undated page per language. */
export const tgHref = (lang: Lang) => pre(lang) + "/strikes/targets";
/** The sections under the /maps map as undated pages of their own (/maps/claims…): the latest issue, that section open. */
export const MAP_SECS = ["claims", "changes", "distance", "areas"] as const;
export type MapSec = (typeof MAP_SECS)[number];
export const mapSecHref = (lang: Lang, s: MapSec) => pre(lang) + "/maps/" + s;
export const articlesHref =(lang: Lang) => pre(lang) + "/articles";
export const articleHref = (lang: Lang, date: string, name: string) => pre(lang) + `/articles/${date}/${name}`;
/** `url` tagged for analytics: utm_source/medium/campaign set (replacing any the visitor arrived with), hash kept after the query. */
export function utm(url: string, source: string, campaign: string, medium = "social") {
  const u = new URL(url);
  for (const k of [...u.searchParams.keys()]) if (k.startsWith("utm_")) u.searchParams.delete(k);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}
/** Absolute site origin (production domain on Vercel, else localhost). */
export const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "http://localhost:3000";
/** The brand as the masthead shows it: og:site_name, title suffix, schema.org Organization. */
export const SITE_NAME: Record<Lang, string> = { uk: "WAR·Орієнтир", en: "War Orientyr", de: "War Orientyr", fr: "War Orientyr" };
/** What the site is, for the home page title. */
export const SITE_TAG: Record<Lang, string> = { uk: "щоденний дайджест війни", en: "daily war digest", de: "täglicher Kriegsbericht", fr: "synthèse quotidienne de la guerre" };
export const SITE_DESC: Record<Lang, string> = {
  uk: "Щодня: фронт, удари, втрати, заяви кремля і реакція світу — коротко і з джерелами.",
  en: "Every day: the front, strikes, losses, the kremlin’s claims and the world’s reaction — briefly, with sources.",
  de: "Jeden Tag: die Front, Angriffe, Verluste, die Behauptungen des kremls und die Reaktionen der Welt – kurz und mit Quellen.",
  fr: "Chaque jour : le front, les frappes, les pertes, les affirmations du kremlin et les réactions du monde – en bref et avec les sources.",
};
