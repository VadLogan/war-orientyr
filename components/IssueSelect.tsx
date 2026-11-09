"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { href, type View } from "@/lib/routes";
import { UI, type Lang } from "@/lib/ui";
import { dayLabel, dayN, loc, longDate, nDay } from "@/lib/text";

/** Client island: the issue picker. The date button opens a month calendar (a modal <dialog>):
 *  wide screens — a panel under the button, one month with ‹ ›; phones — a bottom sheet with every month, newest first.
 *  Days with an issue are links; quick jumps to the latest issue, a week and a month before it.
 *  With `onPick` it is a plain date picker over `dates`: days are buttons, no jumps, `cal` overrides the issue wording. */
export default function IssueSelect({ lang, view, date, latest, dates, label, onPick, cal, className }: { lang: Lang; view?: View; date: string; latest: string; dates: string[]; label: string; onPick?: (d: string) => void; cal?: Partial<typeof UI.uk.cal>; className?: string }) {
  const t = { ...UI[lang].cal, ...cal };
  const btn = useRef<HTMLButtonElement>(null), dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false), [sheet, setSheet] = useState(false), [month, setMonth] = useState(date.slice(0, 7));
  const has = new Set(dates);
  const months = [...new Set(dates.map((d) => d.slice(0, 7)))]; // ascending

  const show = () => {
    const phone = matchMedia("(max-width:600px)").matches, d = dlg.current!;
    if (!phone) {
      const r = btn.current!.getBoundingClientRect();
      d.style.setProperty("--ic-top", `${r.bottom + 6}px`);
      d.style.setProperty("--ic-left", `${Math.max(8, Math.min(innerWidth - 360, r.left + r.width / 2 - 176))}px`);
    }
    setSheet(phone); setMonth(date.slice(0, 7)); setOpen(true); d.showModal();
  };
  const close = () => dlg.current?.close();
  // The panel is placed under the button once; scrolling the page under it closes it instead of leaving it behind.
  useEffect(() => {
    if (!open || sheet) return;
    addEventListener("scroll", close, { passive: true });
    return () => removeEventListener("scroll", close);
  }, [open, sheet]);
  useEffect(close, [date]); // navigated
  // The sheet lists every month: start it at the open issue.
  useEffect(() => { if (open && sheet) dlg.current?.querySelector(".ic-d[aria-current]")?.scrollIntoView({ block: "center" }); }, [open, sheet]);

  const name = (ym: string) => {
    const s = new Date(ym + "-15T12:00:00Z").toLocaleDateString(loc(lang), { month: "long", year: "numeric", timeZone: "UTC" }).replace(/\s?р\.$/, "");
    return s[0].toUpperCase() + s.slice(1);
  };
  const wd = [1, 2, 3, 4, 5, 6, 7].map((i) => new Date(Date.UTC(2024, 0, i, 12)).toLocaleDateString(loc(lang), { weekday: "short", timeZone: "UTC" }).replace(/\.$/, ""));
  const grid = (ym: string) => {
    const first = new Date(ym + "-01T12:00:00Z"), lead = (first.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const n = dates.filter((d) => d.startsWith(ym)).length;
    return (
      <section className="ic-m" key={ym} aria-label={name(ym)}>
        {sheet && <h3 className="ic-mh">{name(ym)}<span>{t.count(n)}</span></h3>}
        <div className="ic-g">
          {Array.from({ length: lead }, (_, i) => <span key={"b" + i} />)}
          {Array.from({ length: days }, (_, i) => {
            const d = `${ym}-${String(i + 1).padStart(2, "0")}`;
            const cls = "ic-d" + (d === latest ? " new" : "");
            return has.has(d)
              ? onPick ? <button key={d} type="button" className={cls} aria-current={d === date ? "date" : undefined} aria-label={longDate(d, lang)} onClick={() => { onPick(d); close(); }}>{i + 1}</button>
              : <Link key={d} className={cls} href={href(lang, view!, d, latest)} aria-current={d === date ? "date" : undefined} aria-label={longDate(d, lang)} onClick={close}>{i + 1}</Link>
              : <span key={d} className="ic-d off" aria-label={`${i + 1} · ${t.none}`}>{i + 1}</span>;
          })}
        </div>
      </section>
    );
  };
  const mi = months.indexOf(month);
  const jumps = onPick ? [] : ([[t.latest, 0], [t.week, 7], [t.month, 30]] as const)
    .map(([l, k]) => [l, nDay(dayN(latest) - k)] as const).filter(([, d]) => has.has(d));
  const arrow = (d: string) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;

  return (
    <>
      <button ref={btn} id={onPick ? undefined : "issueSel"} type="button" className={"isel" + (className ? " " + className : "")} aria-haspopup="dialog" aria-expanded={open} onClick={show}>
        <svg className="isel-cal" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14.5" rx="2" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></svg>
        <span>{label}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
      </button>
      <dialog ref={dlg} className={"ic" + (sheet ? " sheet" : "")} aria-label={t.h} onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {open && <div className="ic-in">
          {sheet
            ? <header className="ic-top"><div><h2>{t.h}</h2><p>{t.count(dates.length)}</p></div>
                <button type="button" className="ic-ib" aria-label={t.close} onClick={close}>{arrow("M6 6l12 12M18 6L6 18")}</button></header>
            : <header className="ic-top">
                <button type="button" className="ic-ib" aria-label={t.prevM} disabled={mi <= 0} onClick={() => setMonth(months[mi - 1])}>{arrow("M14.5 6l-6 6 6 6")}</button>
                <div className="ic-mt"><b>{name(month)}</b><span>{t.count(dates.filter((d) => d.startsWith(month)).length)}</span></div>
                <button type="button" className="ic-ib" aria-label={t.nextM} disabled={mi >= months.length - 1} onClick={() => setMonth(months[mi + 1])}>{arrow("M9.5 6l6 6-6 6")}</button></header>}
          {jumps.length > 1 && <div className="ic-q">{jumps.map(([l, d]) =>
            <Link key={d} href={href(lang, view!, d, latest)} aria-current={d === date ? "date" : undefined} onClick={close}>{l}</Link>)}</div>}
          <div className="ic-wd" aria-hidden="true">{wd.map((w) => <span key={w}>{w}</span>)}</div>
          <div className="ic-body">{sheet ? months.slice().reverse().map(grid) : grid(month)}</div>
          <footer className="ic-foot"><span>{longDate(date, lang)} · {dayLabel(dayN(date) - dayN("2022-02-24") + 1, lang)}</span>
            <span className="ic-new">{t.fresh}</span></footer>
        </div>}
      </dialog>
    </>
  );
}
