"use client";
// /articles: search, topic / format filters and sort over every article (all rows come from the server, so the list is in the HTML).
// Wide screens: a sticky bar that filters as you type. Phones: one bar that opens a full-screen <dialog>; its choices apply on "Show N".
import { useRef, useState } from "react";
import Image from "next/image";
import { flags } from "./Flag";
import { loc, noFlag } from "@/lib/text";
import { UI, type Lang } from "@/lib/ui";
import type { ArticleItem } from "@/types/digest";

type F = { q: string; topic: string; fmt: string; sort: "new" | "long" };
const ALL: F = { q: "", topic: "all", fmt: "all", sort: "new" };
const norm = (s: string) => noFlag(s).toLowerCase().replace(/[’'ʼ`«»"„“”]/g, "").replace(/ё/g, "е");
const code = (l: Lang) => (l === "uk" ? "UA" : l.toUpperCase());

export default function ArticleList({ items, lang }: { items: ArticleItem[]; lang: Lang }) {
  const t = UI[lang].arts;
  const [f, setF] = useState<F>(ALL);
  const [d, setD] = useState<F>(ALL); // the dialog's draft
  const dlg = useRef<HTMLDialogElement>(null);
  const text = items.map((a) => norm([a.title, a.lead, a.kicker].join(" ")));
  const hits = (s: F) => {
    const q = norm(s.q.trim());
    return items.filter((a, k) => (s.topic === "all" || a.topic === s.topic) && (s.fmt === "all" || a.fmt === s.fmt) && (!q || text[k].includes(q)));
  };
  const topics = Object.keys(t.topics).filter((k) => items.some((a) => a.topic === k));
  const fmts = (Object.keys(t.fmts) as ArticleItem["fmt"][]).filter((k) => items.some((a) => a.fmt === k));
  const filtering = (s: F) => !!s.q.trim() || s.topic !== "all" || s.fmt !== "all";

  const list = hits(f);
  if (f.sort === "long") list.sort((a, b) => b.mins - a.mins || (a.date < b.date ? 1 : -1));
  const hero = !filtering(f) && f.sort === "new" ? list[0] : undefined;
  const groups: { label: string; items: ArticleItem[] }[] = [];
  for (const a of hero ? list.slice(1) : list) {
    const m = f.sort === "long" ? t.byLen
      : new Date(a.date + "T12:00:00Z").toLocaleDateString(loc(lang), { month: "long", year: "numeric", timeZone: "UTC" }).replace(/\s?р\.$/, "");
    const label = m[0].toUpperCase() + m.slice(1), g = groups.at(-1);
    if (g?.label === label) g.items.push(a); else groups.push({ label, items: [a] });
  }
  const day = (iso: string, o: Intl.DateTimeFormatOptions) => new Date(iso + "T12:00:00Z").toLocaleDateString(loc(lang), { ...o, timeZone: "UTC" }).replace(/\s?р\.$|\.$/, "");
  const meta = (a: ArticleItem) => [`≈${a.mins} ${t.min}`, a.sources ? t.src(a.sources) : "", a.langs.map(code).join(" ")].filter(Boolean).join(" · ");
  const label = (s: F) => [s.q.trim() && `«${s.q.trim()}»`, s.topic !== "all" && t.topics[s.topic], s.fmt !== "all" && t.fmts[s.fmt as ArticleItem["fmt"]]].filter(Boolean) as string[];

  /** Search, chips and sort for state `s`; `id` keeps the bar's and the dialog's inputs apart. Chip counts = rows with the other filters. */
  const controls = (s: F, set: (s: F) => void, id: string) => {
    const chip = (key: "topic" | "fmt", v: string, name: string) => {
      const n = hits({ ...s, [key]: v }).length, on = s[key] === v;
      return <button type="button" key={v} aria-pressed={on} disabled={!on && !n} onClick={() => set({ ...s, [key]: v })}>{name}<span className="n">{n}</span></button>;
    };
    return (
      <>
        <div className="al-q">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input id={id + "q"} type="search" aria-label={t.search} placeholder={t.ph} value={s.q} enterKeyHint="search" onChange={(e) => set({ ...s, q: e.target.value })} />
          {s.q && <button type="button" className="x" aria-label={t.clear} onClick={() => set({ ...s, q: "" })}>×</button>}
        </div>
        <div className="al-grp" role="group" aria-label={t.topic}><span className="lbl">{t.topic}</span>
          <div className="chips">{chip("topic", "all", t.all)}{topics.map((k) => chip("topic", k, t.topics[k]))}</div></div>
        <div className="al-grp" role="group" aria-label={t.fmt}><span className="lbl">{t.fmt}</span>
          <div className="chips">{chip("fmt", "all", t.all)}{fmts.map((k) => chip("fmt", k, t.fmts[k]))}</div></div>
        <div className="al-grp al-sort" role="group" aria-label={t.sort}><span className="lbl">{t.sort}</span>
          <div className="seg">{(["new", "long"] as const).map((v) =>
            <button type="button" key={v} aria-pressed={s.sort === v} onClick={() => set({ ...s, sort: v })}>{v === "new" ? t.newest : t.longest}</button>)}</div></div>
      </>
    );
  };

  const open = () => { setD(f); dlg.current?.showModal(); };
  const apply = () => { setF(d); dlg.current?.close(); };
  const Row = ({ a }: { a: ArticleItem }) => (
    <article className="al-row" lang={a.contentLang !== lang ? a.contentLang : undefined}>
      <div className="al-day" aria-hidden="true"><b>{day(a.date, { day: "numeric" })}</b><span>{day(a.date, { month: "short" })}</span></div>
      <div className="al-txt">
        <p className="al-k">{a.kicker && <span className="art-kicker">{flags(a.kicker)}</span>}<span className="al-fmt">{t.fmts[a.fmt]}</span></p>
        <h3><a href={a.href}>{flags(a.title)}</a></h3>
        {a.lead && <p className="al-lead">{flags(a.lead)}</p>}
        <p className="al-meta"><span className="al-when"><time dateTime={a.date}>{day(a.date, { day: "numeric", month: "long" })}</time> · </span>{meta(a)}
          {a.issue && <> · <a href={a.issue}>{t.issue} {day(a.date, { day: "numeric", month: "long" })} →</a></>}</p>
      </div>
      {a.img && <a className="al-img" href={a.href} tabIndex={-1} aria-hidden="true"><Image src={a.img} alt="" fill sizes="(max-width:600px) 104px, 200px" /></a>}
    </article>
  );

  return (
    <>
      <div className="al-bar al-wide">
        {controls(f, setF, "b")}
      </div>
      <div className="al-bar al-phone">
        <button type="button" className="al-open" aria-haspopup="dialog" onClick={open}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span className={f.q.trim() ? "v" : "v ph"}>{f.q.trim() ? `«${f.q.trim()}»` : t.search}</span>
          <span className="f">{t.filters}{(f.topic !== "all" ? 1 : 0) + (f.fmt !== "all" ? 1 : 0) > 0 && <span className="n">{(f.topic !== "all" ? 1 : 0) + (f.fmt !== "all" ? 1 : 0)}</span>}</span>
        </button>
        {filtering(f) && (
          <div className="al-tags">
            {f.q.trim() && <button type="button" aria-label={t.remove(f.q.trim())} onClick={() => setF({ ...f, q: "" })}>«{f.q.trim()}» <span aria-hidden="true">×</span></button>}
            {f.topic !== "all" && <button type="button" aria-label={t.remove(t.topics[f.topic])} onClick={() => setF({ ...f, topic: "all" })}>{t.topics[f.topic]} <span aria-hidden="true">×</span></button>}
            {f.fmt !== "all" && <button type="button" aria-label={t.remove(t.fmts[f.fmt as ArticleItem["fmt"]])} onClick={() => setF({ ...f, fmt: "all" })}>{t.fmts[f.fmt as ArticleItem["fmt"]]} <span aria-hidden="true">×</span></button>}
          </div>
        )}
      </div>
      {filtering(f) && (
        <p className="al-status" role="status"><b>{list.length ? t.n(list.length) : t.none}</b> {label(f).length > 0 && <span className="al-what">— {label(f).join(", ")}</span>}
          <button type="button" className="linkbtn" onClick={() => setF({ ...ALL, sort: f.sort })}>{t.reset}</button></p>
      )}

      <dialog ref={dlg} className="al-dlg" aria-labelledby="al-dlg-h">
        <div className="al-dlg-top">
          <button type="button" className="x" aria-label={t.close} onClick={() => dlg.current?.close()}>×</button>
          <p id="al-dlg-h" className="h">{t.searchFilters}</p>
          <button type="button" className="linkbtn" onClick={() => setD(ALL)}>{t.resetShort}</button>
        </div>
        <div className="al-dlg-body">
          {controls(d, setD, "d")}
          <p className="al-hint">{t.hint}</p>
        </div>
        <div className="al-dlg-foot"><button type="button" className="al-apply" onClick={apply}>{t.show(hits(d).length)}</button></div>
      </dialog>

      {hero && (
        <article className="al-hero" lang={hero.contentLang !== lang ? hero.contentLang : undefined}>
          {hero.img && <a className="al-img" href={hero.href} tabIndex={-1} aria-hidden="true"><Image src={hero.img} alt={hero.imgAlt} fill priority sizes="(max-width:600px) 100vw, 500px" /></a>}
          <div className="al-txt">
            <p className="al-k"><span className="art-kicker">{t.fresh}{hero.kicker && <> · {flags(hero.kicker)}</>}</span><span className="al-fmt">{t.fmts[hero.fmt]}</span></p>
            <h2><a href={hero.href}>{flags(hero.title)}</a></h2>
            {hero.lead && <p className="art-lead">{flags(hero.lead)}</p>}
            <p className="al-meta"><time dateTime={hero.date}>{day(hero.date, { day: "numeric", month: "long", year: "numeric" })}</time> · {meta(hero)}</p>
            <a className="art-more" href={hero.href}>{hero.button || UI[lang].art.read}</a>
          </div>
        </article>
      )}
      {groups.map((g) => (
        <section className="al-month" key={g.label} aria-label={g.label}>
          <div className="al-mh"><h2>{g.label}</h2><span>{t.n(g.items.length)}</span></div>
          {g.items.map((a) => <Row a={a} key={a.date + a.name} />)}
        </section>
      ))}
      {!list.length && (
        <div className="al-empty">
          <p className="h">{t.none}</p>
          <p>{t.noneHint}</p>
          <button type="button" className="btn" onClick={() => setF(ALL)}>{t.showAll}</button>
        </div>
      )}
    </>
  );
}
