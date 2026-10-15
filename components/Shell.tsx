// Server component: top bar (tabs, language), issue picker and archive note. All switches are plain links.
import Link from "next/link";
import { longDate, midDate } from "@/lib/text";
import { href, type View } from "@/lib/routes";
import { LANGS, type Lang, type UIStrings } from "@/lib/ui";
import IssueSelect from "./IssueSelect";
import LangPicker from "./LangPicker";

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
            <Tab on={view === "digest"} to={to({ view: "digest" })}>
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" /><path d="M7.5 8.5h9M7.5 12h9M7.5 15.5h5.5" /></svg>{t.digest}</Tab>
            <Tab on={view === "dashboard"} to={to({ view: "dashboard" })}>
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M7 16.5v-4M12 16.5V6M17 16.5v-7" /></svg>{t.dash}</Tab>
          </div>
          <LangPicker lang={lang} hrefs={Object.fromEntries(LANGS.map((l) => [l.code, to({ lang: l.code })])) as Record<Lang, string>} />
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
