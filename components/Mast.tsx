// Server component: day counters and the headline/lede.
import type { Article, Digest } from "@/types/digest";
import { dateTitle, dayLabel, sinceList } from "@/lib/text";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import ImgZoom from "./ImgZoom";
import { flags } from "@/components/Flag";
import { href } from "@/lib/routes";

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

/** Still drawings for the promo cards (decor only; the real maps live on /maps and /strikes). */
const NW_ART = {
  maps: <svg viewBox="0 0 540 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className="sea" d="M0 0H540V200H0Z" /><path className="ua" d="M-10 30C80 10 160 40 230 26S380 6 450 34L560 50V210H-10Z" />
    <path className="occ" d="M330 34C350 70 340 100 362 128S356 172 380 210H560V50L450 34Z" />
    <path className="dg" d="M318 36C340 72 328 104 350 130S342 172 366 210" /><path className="isw" d="M336 33C356 70 348 102 370 128S364 172 388 210" />
  </svg>,
  strikes: <svg viewBox="0 0 540 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className="land" d="M0 0H540V200H0Z" /><path className="ua" d="M-10 120C60 104 120 132 170 116S240 150 260 210H-10Z" />
    {([[300, 60, 9, 2], [372, 44, 12, 2], [452, 72, 9, 2], [236, 92, 8, 1], [330, 118, 10, 0], [410, 132, 8, 4], [268, 150, 7, 3], [496, 112, 7, 1]] as const)
      .map(([x, y, r, c], k) => <circle key={k} cx={x} cy={y} r={r} style={{ fill: c ? `var(--c${c})` : "var(--ink)" }} />)}
  </svg>,
};

/** "New on the site": cards for the /maps and /strikes pages. */
function NewPages({ lang }: { lang: Lang }) {
  const t = UI[lang].nw;
  return (
    <section className="nw" aria-labelledby="nw-h">
      <div className="nw-top"><h2 id="nw-h" className="art-kicker">{t.h}</h2><span>{t.sub}</span></div>
      <div className="nw-grid">
        {(["maps", "strikes"] as const).map((v) => {
          const c = t[v], url = href(lang, v, null, "");
          return (
            <article className="nw-card" key={v}>
              <a className="nw-art" href={url} tabIndex={-1} aria-hidden="true">{NW_ART[v]}</a>
              <div className="nw-txt">
                <div className="kick">{c.k}</div>
                <h3><a href={url}>{c.t}</a></h3>
                <p>{c.p}</p>
                <a className="nw-btn" href={url}>{c.b}</a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function Mast({ D, lang, dashboard, articles = [] }: { D: Digest; lang: Lang; dashboard: boolean; articles?: Article[] }) {
  const dt = dateTitle(D, lang);
  const H = D.headline && D.headline.title ? D.headline : null;
  const more = (item: string) => <a className="lede-more" href={"#it-" + item}>{{ uk: "Детальніше ↓", en: "Read more ↓", de: "Mehr dazu ↓" }[lang]}</a>;
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
          {!dashboard && <NewPages lang={lang} />}
          {cards}
        </div>
      </section>
    </div>
  );
}
