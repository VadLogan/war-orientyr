// URL scheme: [/en][/dashboard][/YYYY-MM-DD]; no date = latest issue (routes in app/(uk) and app/(en)).
import type { Lang } from "./ui";

export type View = "digest" | "dashboard";
/** Path for a page; `latest` is omitted from the URL. */
export function href(lang: Lang, view: View, date: string | null, latest: string) {
  const p = (lang === "en" ? "/en" : "") + (view === "dashboard" ? "/dashboard" : "") + (date && date !== latest ? "/" + date : "");
  return p || "/";
}
export const articleHref = (lang: Lang, date: string, name: string) => (lang === "en" ? "/en" : "") + `/articles/${date}/${name}`;
