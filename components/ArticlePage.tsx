// Server component: one article (public/articles/<date>/<name>/article.<lang>.json), with the site's top bar.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getArticleDirs, getDates, getLatest } from "@/lib/data";
import { articleHref, href, SITE, SITE_NAME } from "@/lib/routes";
import { seoMeta } from "@/lib/page";
import { clip, longDate, noFlag } from "@/lib/text";
import type { Article, ArticleBlock } from "@/types/digest";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import Shell from "./Shell";
import ImgZoom from "./ImgZoom";
import { flags } from "@/components/Flag";
import PresentationPage from "./PresentationPage";

const num = (v: number, lang: Lang) => v.toLocaleString(lang === "en" ? "en-GB" : "uk-UA", { maximumFractionDigits: 1 });

/** Horizontal bars, one series: value and share at the bar end, makers under the label (no hover needed). */
function Bars({ b, lang }: { b: Extract<ArticleBlock, { type: "chart" }>; lang: Lang }) {
  const max = Math.max(...b.rows.map((r) => r.n), 1);
  return (
    <figure className="art-chart">
      {b.title && <figcaption><b>{flags(b.title)}</b>{b.subtitle && <span>{flags(b.subtitle)}</span>}</figcaption>}
      <ul>
        {b.rows.map((r, k) => (
          <li key={k} className={r.highlight ? "hi" : undefined}>
            <div className="lbl"><span>{r.flag && <span className="emo" aria-hidden="true">{flags(r.flag)}</span>}{noFlag(r.country)}</span>{r.makers && <small>{flags(r.makers)}</small>}</div>
            <div className="bar"><i style={{ width: (r.n / max) * 100 + "%" }} />
              <span>{num(r.n, lang)}{r.share != null && <small> · {num(r.share, lang)}%</small>}</span></div>
          </li>
        ))}
      </ul>
      {(b.note || b.source) && <p className="note">{flags([b.note, b.source].filter(Boolean).join(" "))}</p>}
    </figure>
  );
}

/** `base`: public folder of the article, for files the blocks name (list images). */
export function Block({ b, lang, base }: { b: ArticleBlock; lang: Lang; base: string }) {
  switch (b.type) {
    case "p": return <p className={b.kind}>{flags(b.text)}</p>;
    case "h2": return <h2>{flags(b.text)}</h2>;
    case "h3": return <h3>{flags(b.text)}</h3>;
    case "list": {
      const items = b.items.map((x, k) => (
        <li key={k}>
          {x.image && <img src={base + x.image} alt={x.imageAlt || ""} width={48} height={48} loading="lazy" />}
          <div>{x.title && <b>{flags(x.title)}</b>}{x.title && " "}<span>{flags(x.text)}</span></div>
        </li>
      ));
      return (
        <div className="art-list-b">
          {b.title && <p className="meta">{flags(b.title)}</p>}
          {b.ordered ? <ol>{items}</ol> : <ul>{items}</ul>}
        </div>
      );
    }
    case "table": return (
      <div className="art-table"><table>
        <thead><tr>{b.columns.map((c, k) => <th key={k} scope="col">{flags(c)}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j}>{flags(c)}</td>)}</tr>)}</tbody>
      </table></div>
    );
    case "chart": return b.kind === "bar" ? <Bars b={b} lang={lang} /> : null;
    case "cols": return <div className="art-cols">{b.cols.map((c, k) => <div key={k}>{c.map((x, j) => <Block b={x} lang={lang} base={base} key={j} />)}</div>)}</div>;
    default: return null;
  }
}

export function Sources({ list, t }: { list?: { title: string; url: string; note?: string }[]; t: UIStrings }) {
  if (!list?.length) return null;
  return (
    <section className="art-src">
      <h2>{t.sources}</h2>
      <ul>{list.map((x, k) => <li key={k}><a href={x.url} target="_blank" rel="noopener">{flags(x.title)}</a>{x.note && <em> — {flags(x.note)}</em>}</li>)}</ul>
    </section>
  );
}

export type ArticleParams = Promise<{ date: string; name: string }>;
/** Pages only for folders with a full article (a preview with just a `url` links out). */
export const articleParams = async () =>
  (await getArticleDirs()).filter((x) => x.files.includes("article.uk.json") || x.files.includes("presentation.uk.json"))
    .map(({ date, name }) => ({ date, name }));

async function load(params: ArticleParams, lang: Lang) {
  const { date, name } = await params;
  const a = await getArticle(date, name, lang);
  if (!a?.article && !a?.presentation) notFound();
  return a;
}

/** Title and lead of the page: the article's or presentation's own, else the preview's. */
export const heading = (a: Article) => {
  const b = a.presentation || a.article;
  return { title: b?.title || a.preview.title, lead: b?.lead || a.preview.lead || "" };
};

export async function articleMeta(lang: Lang, params: ArticleParams): Promise<Metadata> {
  const a = await load(params, lang), url = (l: Lang) => articleHref(l, a.date, a.name), h = heading(a);
  return seoMeta(lang, url, clip(h.title, 60), clip(h.lead, 160), a.img || undefined);
}

/** schema.org NewsArticle for search engines (title, date, image, language, publisher). */
export function LdJson({ a, lang }: { a: Article; lang: Lang }) {
  const h = heading(a), url = SITE + articleHref(lang, a.date, a.name);
  const ld = {
    "@context": "https://schema.org", "@type": "NewsArticle", headline: h.title, description: h.lead,
    datePublished: a.date, inLanguage: a.contentLang, mainEntityOfPage: url, url,
    ...(a.img && { image: [SITE + a.img] }),
    publisher: { "@type": "Organization", name: SITE_NAME[lang], url: SITE },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />;
}

export default async function ArticlePage({ lang, params }: { lang: Lang; params: ArticleParams }) {
  const [a, latest, dates] = await Promise.all([load(params, lang), getLatest(), getDates()]);
  if (a.presentation) return <PresentationPage a={{ ...a, presentation: a.presentation }} lang={lang} latest={latest.date} dates={dates} />;
  const t = UI[lang] as UIStrings, A = a.article!, inIssue = dates.includes(a.date);
  const img = typeof A.image === "object" ? A.image : null;
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view="digest" date={latest.date} latest={latest.date} dates={dates}
        langHrefs={{ uk: articleHref("uk", a.date, a.name), en: articleHref("en", a.date, a.name) }} />
      <LdJson a={a} lang={lang} />
      <main id="main">
        <article className="col article">
          <Link className="back" href={href(lang, "digest", inIssue ? a.date : null, latest.date)}>{t.art.back}</Link>
          {lang === "en" && a.contentLang !== "en" && <p className="lang-note">{t.art.langNote}</p>}
          <h1>{flags(A.title || a.preview.title)}</h1>
          {(A.lead || a.preview.lead) && <p className="art-lead">{flags(A.lead || a.preview.lead)}</p>}
          <div className="meta">
            {inIssue ? <Link href={href(lang, "digest", a.date, latest.date)}>{t.art.issue} {longDate(a.date, lang)}</Link>
              : <span>{longDate(a.date, lang)}</span>}
          </div>
          {a.img && <figure className="art-hero"><ImgZoom id="zoom-article" src={a.img} alt={img?.alt || a.preview.imageAlt || ""} t={t} />{img?.caption && <figcaption>{flags(img.caption)}</figcaption>}</figure>}
          <div className="body">{A.blocks.map((b, k) => <Block b={b} lang={lang} base={`/articles/${a.date}/${a.name}/`} key={k} />)}</div>
          <Sources list={A.sources} t={t} />
        </article>
      </main>
    </div>
  );
}
