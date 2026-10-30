// URL scheme: [/en|/de][/dashboard][/YYYY-MM-DD]; no date = latest issue (routes in app/(uk), app/(en), app/(de)).
import type { Lang } from "./ui";

export type View = "digest" | "dashboard";
const pre = (lang: Lang) => (lang === "uk" ? "" : "/" + lang);
/** Path for a page; `latest` is omitted from the URL. */
export function href(lang: Lang, view: View, date: string | null, latest: string) {
  const p = pre(lang) + (view === "dashboard" ? "/dashboard" : "") + (date && date !== latest ? "/" + date : "");
  return p || "/";
}
export const articleHref = (lang: Lang, date: string, name: string) => pre(lang) + `/articles/${date}/${name}`;
/** Absolute site origin (production domain on Vercel, else localhost). */
export const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "http://localhost:3000";
export const SITE_NAME: Record<Lang, string> = { uk: "Щоденний дайджест війни", en: "Daily war digest", de: "Täglicher Kriegsbericht" };
export const SITE_DESC: Record<Lang, string> = {
  uk: "Щодня: фронт, удари, втрати, заяви кремля і реакція світу — коротко і з джерелами.",
  en: "Every day: the front, strikes, losses, the kremlin’s claims and the world’s reaction — briefly, with sources.",
  de: "Jeden Tag: die Front, Angriffe, Verluste, die Behauptungen des kremls und die Reaktionen der Welt – kurz und mit Quellen.",
};
