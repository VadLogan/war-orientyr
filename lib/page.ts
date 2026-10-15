// Shared server logic of the four routes: [/en][/dashboard][/YYYY-MM-DD].
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Digest } from "@/types/digest";
import { getDates, getIssue, getLatest } from "./data";
import { href, type View } from "./routes";
import { dateTitle } from "./text";
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
  return {
    metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "http://localhost:3000"),
    title: dateTitle(D, lang).h + (view === "dashboard" ? " · " + UI[lang].dash : ""), // site name added by the layout template
    description: (D.headline?.title || D.lede || "").slice(0, 200),
    alternates: { canonical: url(lang), languages: { uk: url("uk"), en: url("en") } },
  };
}
