// Server component: an interactive presentation (public/articles/<date>/<name>/presentation.<lang>.json + its HTML file).
// The interactive part runs in a frame; every text of it is rendered here as plain HTML, so the page reads without scripts.
// With `phases`, the frame is a full-viewport map and the page drives it (PhaseExplorer); without, it is one tall frame.
import Link from "next/link";
import { articleHref, href } from "@/lib/routes";
import { longDate } from "@/lib/text";
import type { Article, PresentationBody, PresPhase } from "@/types/digest";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import { flags } from "@/components/Flag";
import Shell from "./Shell";
import EmbedFrame from "./EmbedFrame";
import PhaseExplorer from "./PhaseExplorer";
import { Block, LdJson, Sources } from "./ArticlePage";

type P = { a: Article & { presentation: PresentationBody }; lang: Lang; latest: string; dates: string[] };

/** Claimed (cumulative `area`) vs measured (drop of DeepState `occupied` since the first phase), one row per phase that gained ground. */
function Compare({ c, phases, locale }: { c: NonNullable<PresentationBody["compare"]>; phases: PresPhase[]; locale: string }) {
  const base = phases[0].occupied ?? 0;
  const rows = phases.filter((p, k) => k && p.area > phases[k - 1].area);
  const max = Math.max(...rows.map((p) => p.area), 1);
  return (
    <section className="pres-cmp" aria-labelledby="cmp-h">
      <div>
        <h2 id="cmp-h">{flags(c.title)}</h2>
        {c.text && <p>{flags(c.text)}</p>}
        <p className="cmp-key"><span><i className="a" />{c.a}</span><span><i className="b" />{c.b}</span></p>
      </div>
      <figure>
        {rows.map((p, k) => {
          const b = p.occupied != null ? base - p.occupied : null;
          return (
            <div className="cmp-row" key={k}>
              <span className="lbl">{p.key}<small>{p.date}</small></span>
              <span className="bar"><i className="a" style={{ width: (p.area / max) * 88 + "%" }} />{p.area.toLocaleString(locale)}</span>
              {b != null && <span className="bar"><i className="b" style={{ width: (b / max) * 88 + "%" }} />≈{b.toLocaleString(locale)}</span>}
            </div>
          );
        })}
        {c.note && <figcaption>{flags(c.note)}</figcaption>}
      </figure>
    </section>
  );
}

function Places({ title, phases, t }: { title: string; phases: PresPhase[]; t: UIStrings["art"] }) {
  const list = phases.filter((p) => p.places?.length);
  return (
    <section className="pres-places" aria-labelledby="pl-h">
      <div className="pl-head">
        <h2 id="pl-h">{flags(title)}</h2>
        <p className="cmp-key"><span><i className="lib" />{t.lib}</span><span><i className="ctl" />{t.ctl}</span></p>
      </div>
      <div className="pl-grid">
        {list.map((p, k) => (
          <div key={k}>
            <p className="art-kicker">{p.key} · {p.date}</p>
            <ul>{p.places!.map((x, j) => <li key={j} className={"chip " + x.status}>{x.name}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PresentationPage({ a, lang, latest, dates }: P) {
  const t = UI[lang] as UIStrings, S = a.presentation, inIssue = dates.includes(a.date);
  const base = `/articles/${a.date}/${a.name}/`, locale = lang === "en" ? "en-GB" : "uk-UA";
  const phases = S.phases?.length ? S.phases : null;
  return (
    <div className="shell">
      <Shell lang={lang} t={t} view="digest" date={latest} latest={latest} dates={dates}
        langHrefs={{ uk: articleHref("uk", a.date, a.name), en: articleHref("en", a.date, a.name) }} />
      <LdJson a={a} lang={lang} />
      <main id="main">
        <article className="article pres">
          <header className="pres-hero">
            <div>
              <Link className="back" href={href(lang, "digest", inIssue ? a.date : null, latest)}>{t.art.back}</Link>
              {lang === "en" && a.contentLang !== "en" && <p className="lang-note">{t.art.langNote}</p>}
              {S.kicker && <p className="art-kicker">{flags(S.kicker)}</p>}
              <h1>{flags(S.title)}</h1>
              {S.lead && <p className="art-lead">{flags(S.lead)}</p>}
              <div className="meta">
                {inIssue ? <Link href={href(lang, "digest", a.date, latest)}>{t.art.issue} {longDate(a.date, lang)}</Link>
                  : <span>{longDate(a.date, lang)}</span>}
                {S.asOf && <span>{t.art.asOf} <time dateTime={S.asOf}>{longDate(S.asOf, lang)}</time></span>}
              </div>
            </div>
            {phases && a.img && <img src={a.img} alt={a.preview.imageAlt || ""} />}
          </header>

          {S.stats?.length ? (
            <dl className="pres-stats">
              {S.stats.map((x, k) => <div key={k}><dt>{flags(x.label)}</dt><dd className={x.tone}>{x.value}{x.unit && <small> {x.unit}</small>}</dd></div>)}
            </dl>
          ) : null}

          {S.takeaways?.length ? (
            <section className="pres-brief" aria-labelledby="brief-h">
              <h2 id="brief-h">{t.art.brief}</h2>
              <ul>{S.takeaways.map((x, k) => <li key={k}><b>{flags(x.title)}</b><span>{flags(x.text)}</span></li>)}</ul>
            </section>
          ) : null}

          {phases ? (
            <section className="pres-phases" aria-labelledby="ph-h">
              <div className="ph-head">
                {S.phasesTitle && <h2 id="ph-h">{flags(S.phasesTitle)}</h2>}
                {S.phasesHint && <p>{flags(S.phasesHint)}</p>}
              </div>
              <PhaseExplorer src={base + S.embed.src} title={S.embed.title} phases={phases} legend={S.legend}
                note={S.embed.note} foot={S.phaseNote} t={t.art} locale={locale} />
            </section>
          ) : (
            <figure className="pres-frame">
              <EmbedFrame src={base + S.embed.src} title={S.embed.title} />
              {S.embed.note && <figcaption className="col">{flags(S.embed.note)}</figcaption>}
            </figure>
          )}

          {phases && S.compare && <Compare c={S.compare} phases={phases} locale={locale} />}
          {phases && S.placesTitle && <Places title={S.placesTitle} phases={phases} t={t.art} />}

          <div className="pres-body">
            <div className="body">{S.blocks.map((b, k) => <Block b={b} lang={lang} base={base} key={k} />)}</div>
            {S.sources?.length ? (
              <details className="pres-src">
                <summary>{t.sources} <small>{S.sources.length}</small></summary>
                <Sources list={S.sources} t={t} />
              </details>
            ) : null}
          </div>
        </article>
      </main>
    </div>
  );
}
