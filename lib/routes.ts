// URL scheme: [/en][/dashboard][/YYYY-MM-DD]; no date = latest issue (routes in app/(uk) and app/(en)).
import type { Lang } from "./ui";

export type View = "digest" | "dashboard";
/** Path for a page; `latest` is omitted from the URL. */
export function href(lang: Lang, view: View, date: string | null, latest: string) {
  const p = (lang === "en" ? "/en" : "") + (view === "dashboard" ? "/dashboard" : "") + (date && date !== latest ? "/" + date : "");
  return p || "/";
}
export const articleHref = (lang: Lang, date: string, name: string) => (lang === "en" ? "/en" : "") + `/articles/${date}/${name}`;
/** Absolute site origin (production domain on Vercel, else localhost). */
export const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "http://localhost:3000";
export const SITE_NAME: Record<Lang, string> = { uk: "Щоденний дайджест війни", en: "Daily war digest" };
export const SITE_DESC: Record<Lang, string> = {
  uk: "Щодня: фронт, удари, втрати, заяви кремля і реакція світу — коротко і з джерелами.",
  en: "Every day: the front, strikes, losses, the kremlin’s claims and the world’s reaction — briefly, with sources.",
};
