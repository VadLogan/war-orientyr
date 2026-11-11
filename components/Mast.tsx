// Server component: day counters and the headline/lede.
import type { Article, Digest } from "@/types/digest";
import { dateTitle, dayLabel, fmt, midDate, shortD, sinceList } from "@/lib/text";
import type { DayRecords } from "@/lib/records";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import Image from "next/image";
import ImgZoom from "./ImgZoom";
import { flags } from "@/components/Flag";
import { articlesHref, href, tgHref } from "@/lib/routes";
import { getArticleList } from "@/lib/data";

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
  // /strikes/targets: a weapon's reach from the front as a band, targets inside it solid, beyond it faded
  targets: <svg viewBox="0 0 540 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className="land" d="M0 0H540V200H0Z" /><path className="ua" d="M-10 130C50 112 100 140 150 120S200 150 220 210H-10Z" />
    <path d="M150 120C200 92 250 70 330 60 410 52 470 80 520 210H220C200 150 170 140 150 120Z" style={{ fill: "var(--accent)", opacity: 0.18 }} />
    {([[250, 110, 1, 1], [300, 88, 2, 1], [356, 120, 1, 1], [410, 96, 5, 1], [282, 150, 4, 1], [470, 40, 1, 0], [512, 70, 2, 0], [440, 24, 4, 0]] as const)
      .map(([x, y, c, on], k) => <path key={k} d={`M${x} ${y - 11}L${x + 11} ${y}L${x} ${y + 11}L${x - 11} ${y}Z`} style={{ fill: on ? `var(--c${c})` : "var(--surface)", stroke: `var(--c${c})`, strokeWidth: 2.5, opacity: on ? 0.9 : 0.5 }} />)}
  </svg>,
  // the two dashboard analytics: rising bars (losses per km²), monthly launches against a dashed output line
  landcost: <svg viewBox="0 0 540 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className="land" d="M0 0H540V200H0Z" />
    {[22, 30, 26, 41, 38, 55, 70, 64, 92, 120, 150].map((h, k) => <rect key={k} x={40 + k * 44} y={180 - h} width={30} height={h} style={{ fill: k === 10 ? "var(--unv)" : "var(--accent)", opacity: k === 10 ? 1 : 0.45 }} />)}
  </svg>,
  potential: <svg viewBox="0 0 540 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className="land" d="M0 0H540V200H0Z" />
    {[80, 96, 0, 86, 81, 0, 78, 0, 77, 99, 100, 124, 88, 76, 77, 98, 134].map((h, k) => <rect key={k} x={24 + k * 30} y={180 - h} width={20} height={Math.max(h, 2)} style={{ fill: "var(--c1)", opacity: k === 16 ? 1 : 0.5 }} />)}
    <path d="M10 58H530" style={{ stroke: "var(--ink)", strokeWidth: 2, strokeDasharray: "8 6", opacity: 0.7 }} />
  </svg>,
};

/** Pages promoted in the "New on the site" block on digest pages; empty = no block. landcost/potential = the dashboard analytics. */
type NewPage = "maps" | "strikes" | "targets" | "articles" | "landcost" | "potential";
const NEW_PAGES: NewPage[] = ["targets"];
const AN: NewPage[] = ["landcost", "potential"];

/** "New on the site": a card per page in NEW_PAGES; the articles card shows the three newest covers. */
async function NewPages({ lang }: { lang: Lang }) {
  const t = UI[lang].nw;
  const covers = NEW_PAGES.includes("articles") ? (await getArticleList(lang)).filter((a) => a.img).slice(0, 3) : [];
  return (
    <section className="nw" aria-labelledby="nw-h">
      <div className="nw-top"><h2 id="nw-h" className="art-kicker">{t.h}</h2><span>{t.sub}</span></div>
      <div className="nw-grid">
        {NEW_PAGES.map((v) => {
          const c = t[v], an = AN.includes(v), url = v === "articles" ? articlesHref(lang) : v === "targets" ? tgHref(lang) : an ? href(lang, "dashboard", null, "") + "#" + v : href(lang, v as "maps" | "strikes", null, "");
          return (
            <article className={an ? "nw-card nw-an" : "nw-card"} key={v}>
              <a className={v === "articles" ? "nw-art nw-covers" : "nw-art"} href={url} tabIndex={-1} aria-hidden="true">
                {v === "articles" ? covers.map((a) => <Image key={a.name} src={a.img!} alt="" width={400} height={240} sizes="(max-width:600px) 34vw, 200px" />) : NW_ART[v as keyof typeof NW_ART]}</a>
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

/** Records set on this issue's day; rendered only when there is one (lib/records.ts). */
function Records({ R, lang, date, latest }: { R: DayRecords; lang: Lang; date: string; latest: string }) {
  const T = UI[lang] as UIStrings, t = T.rec, n = R.losses.length + (R.strike ? 1 : 0), f = (v: number) => fmt(v, lang), S = R.strike;
  return (
    <section className={R.losses.length ? "drec has-img" : "drec"} aria-labelledby="drec-h">
      <div className="nw-top"><h2 id="drec-h" className="art-kicker">{n > 1 ? t.hN(n) : t.h}</h2>
        {R.losses.length > 0 && <span>{t.loss} · {t.since(shortD(R.losses[0].since))}</span>}</div>
      <div className="drec-grid">
        {R.losses.map((x) => (
          <div className="drec-it" key={x.key}>
            <span className="drec-k">{T.lc[x.key]}</span>
            <span className="drec-v"><b>{f(x.v)}</b><span className="drec-d">+{f(x.v - x.prev)}</span></span>
            <span className="drec-n">{t.prev(f(x.prev), shortD(x.prevDate))}</span>
          </div>
        ))}
        {S && (
          <div className="drec-it">
            <span className="drec-k">{t.strike}</span>
            <span className="drec-v"><b>{f(S.km)}</b> {t.km}<span className="drec-d">+{f(S.km - S.prev)}</span></span>
            <span className="drec-p">{flags(S.place)}</span>
            <span className="drec-n">{t.prevStrike(f(S.prev), S.prevPlace, midDate(S.prevDate, lang))}</span>
          </div>
        )}
      </div>
      {R.losses.length > 0 && <img className="drec-img" src="/img/rec-losses.webp" alt={t.img} width={1672} height={941} loading="lazy" decoding="async" />}
      <div className="drec-links">
        {R.losses.length > 0 && <a className="nw-btn" href={href(lang, "dashboard", date, latest) + "#losses"}>{t.toLoss}</a>}
        {S && <a className="nw-btn" href={href(lang, "strikes", date, latest)}>{t.toStrikes}</a>}
      </div>
    </section>
  );
}

export default function Mast({ D, lang, dashboard, articles = [], records, latest = "" }: { D: Digest; lang: Lang; dashboard: boolean; articles?: Article[]; records?: DayRecords | null; latest?: string }) {
  const dt = dateTitle(D, lang);
  const H = D.headline && D.headline.title ? D.headline : null;
  const more = (item: string) => <a className="lede-more" href={"#it-" + item}>{{ uk: "Детальніше ↓", en: "Read more ↓", de: "Mehr dazu ↓", fr: "Lire la suite ↓" }[lang]}</a>;
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
          {/* order under the lede: feature (the issue's articles) first, then records, then "new on the site" */}
          {cards}
          {records && <Records R={records} lang={lang} date={D.date} latest={latest} />}
          {NEW_PAGES.length > 0 && !dashboard && <NewPages lang={lang} />}
        </div>
      </section>
    </div>
  );
}
