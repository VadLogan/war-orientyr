// Server component: day counters and the headline/lede.
import type { Article, Digest } from "@/types/digest";
import { dateTitle, dayLabel, sinceList } from "@/lib/text";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import ImgZoom from "./ImgZoom";
import { flags } from "@/components/Flag";

/** Compact card for an article of this issue (public/articles/<date>/<name>/). */
function ArtCard({ a, t }: { a: Article; t: UIStrings }) {
  const p = a.preview, id = "art-" + a.name;
  return (
    <section className="art-card" aria-labelledby={id}>
      <div className="art-kicker">{t.art.kicker}</div>
      <div className="art-row">
        <div className="art-txt">
          <h2 id={id}><a href={a.href}>{flags(p.title)}</a></h2>
          {p.lead && <p className="art-lead">{flags(p.lead)}</p>}
          <a className="art-more" href={a.href}>{p.button || t.art.read + " →"}</a>
        </div>
        {a.img ? <ImgZoom className="art-img" id={"zoom-" + a.name} src={a.img} alt={p.imageAlt || ""} t={t} />
          : <a className="art-img" href={a.href} tabIndex={-1} aria-hidden="true">
            <svg className="ph" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>
          </a>}
      </div>
    </section>
  );
}

export default function Mast({ D, lang, dashboard, articles = [] }: { D: Digest; lang: Lang; dashboard: boolean; articles?: Article[] }) {
  const dt = dateTitle(D, lang);
  const H = D.headline && D.headline.title ? D.headline : null;
  const more = (item: string) => <a className="lede-more" href={"#it-" + item}>{lang === "en" ? "Read more ↓" : "Детальніше ↓"}</a>;
  const P = Array.isArray(D.ledeParts) && D.ledeParts.length ? D.ledeParts : null;
  const parts = P?.map((x, k) => <p key={k}>{x.label && <b>{flags(x.label)}</b>}{flags(x.text)}</p>);

  const cards = articles.length > 0 && <div className="art-list">{articles.map((a) => <ArtCard a={a} t={UI[lang] as UIStrings} key={a.name} />)}</div>;
  let body;
  if (dashboard) body = <h1>{dt.h}</h1>;
  else if (H) body = <><h1 className="hl">{flags(H.title)}</h1>{H.text && <p className="lede">{flags(H.text)}</p>}{H.item && more(H.item)}</>;
  else body = <><h1>{dt.h}</h1>{P ? <div className="lede lede-parts">{parts}</div> : <p className="lede">{flags(D.lede)}</p>}</>;

  return (
    <div>
      <div className="counters">
        {sinceList(D, lang).map((x) => (
          <div className="counter" title={x.span} key={x.fd}><b>{dayLabel(x.day, lang)}</b><span className="cl">{flags(x.label)} · {x.fd}</span></div>
        ))}
      </div>
      <section className="mast">
        <div style={{ minWidth: 0 }}>
          {!dashboard && <div className="dateline">{dt.line}</div>}
          {body}
          {cards}
        </div>
      </section>
    </div>
  );
}
