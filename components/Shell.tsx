// Server component: top bar (tabs, language), issue picker and archive note. All switches are plain links.
import Link from "next/link";
import { longDate, midDate } from "@/lib/text";
import { href, type View } from "@/lib/routes";
import type { Lang, UIStrings } from "@/lib/ui";
import IssueSelect from "./IssueSelect";

type P = { lang: Lang; t: UIStrings; view: View; date: string; latest: string; dates: string[] };

export default function Shell({ lang, t, view, date, latest, dates }: P) {
  const i = dates.indexOf(date), isLatest = date === latest;
  const to = (o: Partial<{ lang: Lang; view: View; date: string }>) => href(o.lang ?? lang, o.view ?? view, o.date ?? date, latest);
  const Tab = ({ on, to: h, children }: { on: boolean; to: string; children: React.ReactNode }) =>
    <Link href={h} aria-current={on ? "page" : undefined}>{children}</Link>;
  return (
    <>
      <header className="topbar">
        <div className="brand" dangerouslySetInnerHTML={{ __html: t.brand }} />
        <div className="controls">
          <div className="seg" role="group">
            <Tab on={view === "digest"} to={to({ view: "digest" })}>{t.digest}</Tab>
            <Tab on={view === "dashboard"} to={to({ view: "dashboard" })}>{t.dash}</Tab>
          </div>
          <div className="seg lang" role="group" aria-label="Мова / Language">
            <Link href={to({ lang: "uk" })} hrefLang="uk" aria-current={lang === "uk" ? "page" : undefined}>UA</Link>
            <Link href={to({ lang: "en" })} hrefLang="en" aria-current={lang === "en" ? "page" : undefined}>EN</Link>
          </div>
        </div>
      </header>
      {dates.length > 0 && (
        <nav className="datebar">
          <label htmlFor="issueSel">{t.pickDate}</label>
          <div className="dnav">
            {i > 0 ? <Link href={to({ date: dates[i - 1] })} aria-label={t.prevA}>‹<span className="t"> {t.prev}</span></Link>
              : <button type="button" aria-label={t.prevA} disabled>‹<span className="t"> {t.prev}</span></button>}
            <IssueSelect lang={lang} view={view} date={date} latest={latest} options={dates.slice().reverse().map((d) => [d, longDate(d, lang)])} />
            {i >= 0 && i < dates.length - 1 ? <Link href={to({ date: dates[i + 1] })} aria-label={t.nextA}><span className="t">{t.next} </span>›</Link>
              : <button type="button" aria-label={t.nextA} disabled><span className="t">{t.next} </span>›</button>}
          </div>
          <span className="count">{t.count(dates.length)}</span>
          {!isLatest && <Link className="btn ghost latest" href={to({ date: latest })}>{t.latest}</Link>}
        </nav>
      )}
      <div>
        {!isLatest && (
          <div className="archive-note"><b>{t.archived}</b><span>{t.viewingOld(midDate(date, lang))}</span>
            <Link className="linkbtn" href={to({ date: latest })}>{t.toLatest}</Link></div>
        )}
      </div>
    </>
  );
}
