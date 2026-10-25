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
import { SecIco } from "./digest/Digest";

const num = (v: number, lang: Lang) => v.toLocaleString(lang === "en" ? "en-GB" : "uk-UA", { maximumFractionDigits: 1 });

/** Bars, one series, one scale: value and share at the bar end, makers under the label (no hover needed).
 *  `col`: vertical bars, value on top, label under. */
function Bars({ b, lang }: { b: Extract<ArticleBlock, { type: "chart" }>; lang: Lang }) {
  const max = Math.max(...b.rows.map((r) => Math.abs(r.n)), 1), pct = (n: number) => (Math.abs(n) / max) * 100 + "%";
  const cls = (r: (typeof b.rows)[number]) => [r.highlight && "hi", r.tone].filter(Boolean).join(" ") || undefined;
  const val = (r: (typeof b.rows)[number]) => <>{r.value ? flags(r.value) : num(r.n, lang)}{r.share != null && <small> · {num(r.share, lang)}%</small>}</>;
  const lbl = (r: (typeof b.rows)[number]) => <div className="lbl"><span>{r.flag && <span className="emo" aria-hidden="true">{flags(r.flag)}</span>}{noFlag(r.country)}</span>{r.makers && <small>{flags(r.makers)}</small>}</div>;
  return (
    <figure className={"art-chart" + (b.kind === "col" ? " col" : "")}>
      {b.title && <figcaption><b>{flags(b.title)}</b>{b.subtitle && <span>{flags(b.subtitle)}</span>}</figcaption>}
      {b.kind === "col" ? (
        <ul style={{ gridTemplateColumns: `repeat(${b.rows.length},minmax(0,1fr))` }}>
          {b.rows.map((r, k) => <li key={k} className={cls(r)}><div className="bar"><span>{val(r)}</span><i style={{ height: pct(r.n) }} /></div>{lbl(r)}</li>)}
        </ul>
      ) : (
        <ul>
          {b.rows.map((r, k) => [
            r.group && <li key={"g" + k} className="grp">{flags(r.group)}</li>,
            <li key={k} className={cls(r)}>{lbl(r)}<div className="bar"><i style={{ width: pct(r.n) }} /><span>{val(r)}</span></div></li>,
          ])}
        </ul>
      )}
      {(b.note || b.source) && <p className="note">{flags([b.note, b.source].filter(Boolean).join(" "))}</p>}
    </figure>
  );
}

/** `**x**` → bold */
const rich = (s: string) => s.split("**").map((x, k) => (k % 2 ? <b key={k}>{flags(x)}</b> : flags(x)));

/** `base`: public folder of the article, for files the blocks name (list images). */
export function Block({ b, lang, base, id }: { b: ArticleBlock; lang: Lang; base: string; id?: string }) {
  switch (b.type) {
    case "p": return <p className={b.kind}>{flags(b.text)}</p>;
    case "h2": return <h2 id={id} className={b.section ? "ico" : undefined}>{b.section && <SecIco id={b.section} />}{flags(b.text)}</h2>;
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
    case "table": {
      const n = (j: number) => (j === b.num ? "n" : undefined);
      return (
        <div className={"art-table" + (b.num != null ? " num" : "")}><table>
          <thead><tr>{b.columns.map((c, k) => <th key={k} scope="col" className={n(k)}>{flags(c)}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} className={n(j)}>{flags(c)}</td>)}</tr>)}</tbody>
        </table></div>
      );
    }
    case "chart": return b.kind === "bar" || b.kind === "col" ? <Bars b={b} lang={lang} /> : null;
    case "stats": return (
      <dl className={"art-stats" + (b.kind ? " " + b.kind : "")}>
        {b.items.map((x, k) => <div key={k}>{x.label && <dt>{flags(x.label)}</dt>}<dd className={x.tone}>{flags(x.value)}</dd>{x.note && <dd className="nt">{flags(x.note)}</dd>}</div>)}
      </dl>
    );
    case "estimate": return (
      <aside className="art-est">
        <span className="chip part">{flags(b.title || (lang === "en" ? "Our estimate" : "Оцінка редакції"))}</span>
        {b.text.map((x, k) => <p key={k}>{rich(x)}</p>)}
      </aside>
    );
    case "diverge": return (
      <div className="diverge art-dv">
        {b.title && <h3 className="chk-h">{flags(b.title)}</h3>}
        {b.items.map((x, k) => <div className="dv" key={k}><h3>{flags(x.title)}</h3><p>{flags(x.text)}</p></div>)}
      </div>
    );
    case "vs": return (
      <div className="vs art-vs">
        <div><small>{flags(b.a.label)}</small><strong>{flags(b.a.text)}</strong></div><i>vs</i>
        <div><small>{flags(b.b.label)}</small><strong className={b.b.tone}>{flags(b.b.text)}</strong></div>
      </div>
    );
    case "links": return (
      <p className="reslinks art-res">{lang === "en" ? "Resources:" : "Ресурси:"}{" "}
        {b.items.map((x, k) => <span key={k}>{k > 0 && ", "}<a href={x.url} target="_blank" rel="noopener">{flags(x.title)}</a></span>)}</p>
    );
    case "cols": return <div className="art-cols">{b.cols.map((c, k) => <div key={k}>{c.map((x, j) => <Block b={x} lang={lang} base={base} key={j} />)}</div>)}</div>;
    default: return null;
  }
}

export function Sources({ list, t }: { list?: { title: string; url: string; note?: string }[]; t: UIStrings }) {
  if (!list?.length) return null;
  return (
    <section className="art-src" id="src">
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
  const toc = A.toc ? A.blocks.flatMap((b, k) => (b.type === "h2" ? [{ id: "s" + k, text: b.text }] : [])) : [];
  if (toc.length && A.sources?.length) toc.push({ id: "src", text: t.sources });
  const body = (
        <article className="col article">
          <Link className="back" href={href(lang, "digest", inIssue ? a.date : null, latest.date)}>{t.art.back}</Link>
          {lang === "en" && a.contentLang !== "en" && <p className="lang-note">{t.art.langNote}</p>}
          {A.kicker && <p className="art-kicker">{flags(A.kicker)}</p>}
          <h1>{flags(A.title || a.preview.title)}</h1>
          {(A.lead || a.preview.lead) && <p className="art-lead">{flags(A.lead || a.preview.lead)}</p>}
          <div className="meta">
            {inIssue ? <Link href={href(lang, "digest", a.date, latest.date)}>{t.art.issue} {longDate(a.date, lang)}</Link>
              : <span>{longDate(a.date, lang)}</span>}
          </div>
          {a.img && <figure className="art-hero"><ImgZoom id="zoom-article" src={a.img} alt={img?.alt || a.preview.imageAlt || ""} t={t} />{img?.caption && <figcaption>{flags(img.caption)}</figcaption>}</figure>}
          <div className="body">{A.blocks.map((b, k) => <Block b={b} lang={lang} base={`/articles/${a.date}/${a.name}/`} id={"s" + k} key={k} />)}</div>
          <Sources list={A.sources} t={t} />
        </article>
  );
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view="digest" date={latest.date} latest={latest.date} dates={dates}
        langHrefs={{ uk: articleHref("uk", a.date, a.name), en: articleHref("en", a.date, a.name) }} />
      <LdJson a={a} lang={lang} />
      <main id="main">
        {toc.length ? (
          <div className="dgrid">
            {body}
            <nav className="toc art-toc" aria-label={lang === "en" ? "In this article" : "У матеріалі"}>
              <p>{lang === "en" ? "In this article" : "У матеріалі"}</p>
              <ul>{toc.map((x, k) => <li key={x.id}><a href={"#" + x.id}><span className="n">{String(k + 1).padStart(2, "0")}</span>{flags(x.text)}</a></li>)}</ul>
            </nav>
          </div>
        ) : body}
      </main>
    </div>
  );
}
