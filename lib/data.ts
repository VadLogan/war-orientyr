// Server-side data access: everything is read from public/ at build time (all pages are statically generated).
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Article, Digest } from "@/types/digest";
import { articleHref } from "./routes";
import type { StrikesBase, StrikesData, Strikes } from "./strikes";
import { styleData } from "./text";
import { translate } from "./i18n.mjs";
import type { Lang } from "./ui";

const read = async <T,>(p: string): Promise<T> => JSON.parse(await fs.readFile(path.join(process.cwd(), "public", p), "utf8"));

/** English text (i18n/en.json); the data itself is shared by both languages. */
const getEnglish = cache(async (): Promise<Record<string, string>> => JSON.parse(await fs.readFile(path.join(process.cwd(), "i18n/en.json"), "utf8")));

/** An issue in the requested language: English text applied when every string is translated, else the Ukrainian text. */
async function readIssue(p: string, lang: Lang): Promise<Digest> {
  const data = await read(p);
  const en = lang === "en" ? translate(data, await getEnglish()) : null;
  return en ? { ...styleData(en, "", "en"), contentLang: "en" } : { ...styleData(data, ""), contentLang: "uk" };
}

export const getLatest = cache(async (lang: Lang = "uk") => readIssue("digest.json", lang));

/** Archive dates (ascending), always including the latest issue. */
export const getDates = cache(async () => {
  const latest = await getLatest();
  let ds: string[] = [];
  try {
    const j = await read<{ dates?: string[] }>("issues/index.json");
    ds = (Array.isArray(j?.dates) ? j.dates : []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  } catch {}
  return [...new Set([...ds, latest.date])].filter((d) => d <= latest.date).sort();
});

export const getIssue = cache(async (date: string, lang: Lang = "uk") => {
  const latest = await getLatest(lang);
  if (date === latest.date) return latest;
  const j = await readIssue(`issues/${date}.json`, lang);
  if (!j || j.date !== date) throw new Error("issue date mismatch: " + date);
  return j;
});

/* ---------- articles: public/articles/<YYYY-MM-DD>/<name>/{preview,article}.{uk,en}.json + image ---------- */
const ART_DIR = path.join(process.cwd(), "public/articles");
const IMG_RX = /\.(jpe?g|png|webp|avif|gif)$/i;
const ls = async (d: string) => { try { return await fs.readdir(d, { withFileTypes: true }); } catch { return []; } };

/** Every article folder: { date, name, files }, sorted by date then name. */
export const getArticleDirs = cache(async () => {
  const out: { date: string; name: string; files: string[] }[] = [];
  for (const d of (await ls(ART_DIR)).filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name)))
    for (const n of (await ls(path.join(ART_DIR, d.name))).filter((e) => e.isDirectory()))
      out.push({ date: d.name, name: n.name, files: (await ls(path.join(ART_DIR, d.name, n.name))).map((f) => f.name) });
  return out.sort((a, b) => (a.date + a.name < b.date + b.name ? -1 : 1));
});

/** One article in `lang` (English files fall back to Ukrainian); null without preview.uk.json. */
export const getArticle = cache(async (date: string, name: string, lang: Lang = "uk"): Promise<Article | null> => {
  const dir = (await getArticleDirs()).find((x) => x.date === date && x.name === name);
  if (!dir) return null;
  const pick = (base: string) => (lang === "en" && dir.files.includes(`${base}.en.json`) ? `${base}.en.json` : dir.files.includes(`${base}.uk.json`) ? `${base}.uk.json` : null);
  const pf = pick("preview"), af = pick("article");
  if (!pf) return null;
  const lng = (f: string): Lang => (f.endsWith(".en.json") ? "en" : "uk");
  const rd = async <T,>(f: string): Promise<T> => styleData(await read(`articles/${date}/${name}/${f}`), "", lng(f));
  const preview = await rd<Article["preview"]>(pf), article = af ? await rd<NonNullable<Article["article"]>>(af) : null;
  const named = preview.image || (typeof article?.image === "string" ? article.image : article?.image?.src);
  const file = named && dir.files.includes(named) ? named : dir.files.find((f) => IMG_RX.test(f));
  const contentLang = lng(af ?? pf);
  return {
    date, name, preview, article, contentLang,
    href: preview.url || articleHref(lang, date, name),
    img: file && `/articles/${date}/${name}/${encodeURIComponent(file)}`,
  };
});

/** Previews shown on the issue of `date`, in folder-name order. */
export const getPreviews = cache(async (date: string, lang: Lang = "uk") =>
  (await Promise.all((await getArticleDirs()).filter((x) => x.date === date).map((x) => getArticle(x.date, x.name, lang)))).filter((a): a is Article => !!a));

export const getStrikes = cache(async (): Promise<Strikes> => ({
  stk: await read<StrikesData>("strikes.json"),
  base: await read<StrikesBase>("maps/strikes-base.json"),
}));

/* ---------- source status per domain per issue (dashboard "Sources by day") ---------- */
/** The panel is hidden for now; flip to true to bring it back (data and component are kept). */
export const SHOW_SOURCE_MATRIX = false;
export type Cnt = { ok: number; partial: number; unavailable: number };
export type SourceMatrix = { days: string[]; rows: { k: string; by: Record<string, Cnt> }[] };
const domOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return String(u || "?"); } };

export const getSourceMatrix = cache(async (): Promise<SourceMatrix> => {
  const res = await Promise.allSettled((await getDates()).map((d) => getIssue(d)));
  const days: string[] = [], rows: Record<string, SourceMatrix["rows"][number]> = {};
  res.forEach((r) => {
    if (r.status !== "fulfilled") return;
    const iss = r.value;
    days.push(iss.date);
    (iss.sources || []).forEach((s) => {
      const k = domOf(s.url), o = (rows[k] ||= { k, by: {} });
      const c = (o.by[iss.date] ||= { ok: 0, partial: 0, unavailable: 0 });
      c[s.status in c ? s.status : "ok"]++;
    });
  });
  return { days, rows: Object.values(rows) };
});
