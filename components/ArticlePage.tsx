// Server component: one article (public/articles/<date>/<name>/article.<lang>.json), with the site's top bar.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getArticleDirs, getDates, getLatest } from "@/lib/data";
import { articleHref, href } from "@/lib/routes";
import { longDate, noFlag } from "@/lib/text";
import type { ArticleBlock } from "@/types/digest";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import Shell from "./Shell";
import ImgZoom from "./ImgZoom";

const num = (v: number, lang: Lang) => v.toLocaleString(lang === "en" ? "en-GB" : "uk-UA", { maximumFractionDigits: 1 });

/** Horizontal bars, one series: value and share at the bar end, makers under the label (no hover needed). */
function Bars({ b, lang }: { b: Extract<ArticleBlock, { type: "chart" }>; lang: Lang }) {
  const max = Math.max(...b.rows.map((r) => r.n), 1);
  return (
    <figure className="art-chart">
      {b.title && <figcaption><b>{b.title}</b>{b.subtitle && <span>{b.subtitle}</span>}</figcaption>}
      <ul>
        {b.rows.map((r, k) => (
          <li key={k} className={r.highlight ? "hi" : undefined}>
            <div className="lbl"><span>{r.flag && <span className="emo" aria-hidden="true">{r.flag}</span>}{noFlag(r.country)}</span>{r.makers && <small>{r.makers}</small>}</div>
            <div className="bar"><i style={{ width: (r.n / max) * 100 + "%" }} />
              <span>{num(r.n, lang)}{r.share != null && <small> · {num(r.share, lang)}%</small>}</span></div>
          </li>
        ))}
      </ul>
      {(b.note || b.source) && <p className="note">{[b.note, b.source].filter(Boolean).join(" ")}</p>}
    </figure>
  );
}

function Block({ b, lang }: { b: ArticleBlock; lang: Lang }) {
  switch (b.type) {
    case "p": return <p>{b.text}</p>;
    case "h2": return <h2>{b.text}</h2>;
    case "table": return (
      <div className="art-table"><table>
        <thead><tr>{b.columns.map((c, k) => <th key={k} scope="col">{c}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table></div>
    );
    case "chart": return b.kind === "bar" ? <Bars b={b} lang={lang} /> : null;
    default: return null;
  }
}

export type ArticleParams = Promise<{ date: string; name: string }>;
/** Pages only for folders with a full article (a preview with just a `url` links out). */
export const articleParams = async () =>
  (await getArticleDirs()).filter((x) => x.files.includes("article.uk.json")).map(({ date, name }) => ({ date, name }));

async function load(params: ArticleParams, lang: Lang) {
  const { date, name } = await params;
  const a = await getArticle(date, name, lang);
  if (!a?.article) notFound();
  return { ...a, article: a.article };
}

export async function articleMeta(lang: Lang, params: ArticleParams): Promise<Metadata> {
  const a = await load(params, lang), url = (l: Lang) => articleHref(l, a.date, a.name);
  return {
    metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "http://localhost:3000"),
    title: a.article.title || a.preview.title,
    description: (a.article.lead || a.preview.lead || "").slice(0, 200),
    alternates: { canonical: url(lang), languages: { uk: url("uk"), en: url("en") } },
    ...(a.img && { openGraph: { images: [a.img] } }),
  };
}

export default async function ArticlePage({ lang, params }: { lang: Lang; params: ArticleParams }) {
  const [a, latest, dates] = await Promise.all([load(params, lang), getLatest(), getDates()]);
  const t = UI[lang] as UIStrings, A = a.article, inIssue = dates.includes(a.date);
  const img = typeof A.image === "object" ? A.image : null;
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view="digest" date={latest.date} latest={latest.date} dates={dates}
        langHrefs={{ uk: articleHref("uk", a.date, a.name), en: articleHref("en", a.date, a.name) }} />
      <main id="main">
        <article className="col article">
          <Link className="back" href={href(lang, "digest", inIssue ? a.date : null, latest.date)}>{t.art.back}</Link>
          {lang === "en" && a.contentLang !== "en" && <p className="lang-note">{t.art.langNote}</p>}
          <h1>{A.title || a.preview.title}</h1>
          {(A.lead || a.preview.lead) && <p className="art-lead">{A.lead || a.preview.lead}</p>}
          <div className="meta">
            {inIssue ? <Link href={href(lang, "digest", a.date, latest.date)}>{t.art.issue} {longDate(a.date, lang)}</Link>
              : <span>{longDate(a.date, lang)}</span>}
          </div>
          {a.img && <figure className="art-hero"><ImgZoom id="zoom-article" src={a.img} alt={img?.alt || a.preview.imageAlt || ""} t={t} />{img?.caption && <figcaption>{img.caption}</figcaption>}</figure>}
          <div className="body">{A.blocks.map((b, k) => <Block b={b} lang={lang} key={k} />)}</div>
          {!!A.sources?.length && (
            <section className="art-src">
              <h2>{t.sources}</h2>
              <ul>{A.sources.map((x, k) => <li key={k}><a href={x.url} target="_blank" rel="noopener">{x.title}</a>{x.note && <em> — {x.note}</em>}</li>)}</ul>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
