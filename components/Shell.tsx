// Server component: top bar (tabs, language), issue picker and archive note. All switches are plain links.
import Link from "next/link";
import { longDate, midDate } from "@/lib/text";
import { href, type View } from "@/lib/routes";
import { DE_MISSING, LANGS, type Lang, type UIStrings } from "@/lib/ui";
import IssueSelect from "./IssueSelect";
import LangPicker from "./LangPicker";

/** `langHrefs`: a page outside the issue views (an article) — tabs link to the latest issue, no date bar.
 *  `from`: the language the reader asked for (a /de URL) when this page has no version in it and is shown in `lang`. */
type P = { lang: Lang; t: UIStrings; view: View; date: string; latest: string; dates: string[]; langHrefs?: Record<Lang, string>; from?: "de" };

export default function Shell({ lang, t, view, date, latest, dates, langHrefs, from }: P) {
  const bare = !!langHrefs;
  const i = dates.indexOf(date), isLatest = date === latest;
  const to = (o: Partial<{ lang: Lang; view: View; date: string }>) => href(o.lang ?? lang, o.view ?? view, o.date ?? date, latest);
  const Tab = ({ on, to: h, children }: { on: boolean; to: string; children: React.ReactNode }) =>
    <Link href={h} aria-current={on && !bare ? "page" : undefined}>{children}</Link>;
  return (
    <>
      <header className="topbar">
        <div className="brand" dangerouslySetInnerHTML={{ __html: t.brand }} />
        <div className="controls">
          <div className="seg" role="group">
            <Tab on={view === "digest"} to={to({ view: "digest" })}>
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path className="fl" d="M4.75 5.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V18a1.75 1.75 0 0 0 1.75 1.75H6.5A1.75 1.75 0 0 1 4.75 18z" /><path d="M16.75 8.5h2.5v9.5a1.75 1.75 0 0 1-1.75 1.75M8 8.5h5.5M8 12h5.5M8 15.5h3.5" /></svg>{t.digest}</Tab>
            <Tab on={view === "dashboard"} to={to({ view: "dashboard" })}>
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.75h16" /><rect className="fl" x="5.75" y="12" width="3" height="5" rx=".75" /><rect className="fl" x="10.5" y="5.5" width="3" height="11.5" rx=".75" /><rect className="fl" x="15.25" y="9" width="3" height="8" rx=".75" /></svg>{t.dash}</Tab>
            <Tab on={view === "maps"} to={to({ view: "maps" })}>
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path className="fl" d="M3.75 6.5l5.5-2.25 5.5 2.25 5.5-2.25v13.25l-5.5 2.25-5.5-2.25-5.5 2.25z" /><path d="M9.25 4.25v13.25M14.75 6.5v13.25" /></svg>{t.maps}</Tab>
          </div>
          <LangPicker lang={lang} hrefs={langHrefs ?? Object.fromEntries(LANGS.map((l) => [l.code, to({ lang: l.code })])) as Record<Lang, string>} />
        </div>
      </header>
      {from && <p className="lang-note lang-alert" role="status"><span lang="de">{DE_MISSING.de}</span> <span>{DE_MISSING.en}</span></p>}
      {!bare && dates.length > 0 && (
        <nav className="datebar">
          <label htmlFor="issueSel">{t.pickDate}</label>
          <div className="dnav">
            {i > 0 ? <Link href={to({ date: dates[i - 1] })} aria-label={t.prevA}><svg className="ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg><span className="t"> {t.prev}</span></Link>
              : <button type="button" aria-label={t.prevA} disabled><svg className="ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg><span className="t"> {t.prev}</span></button>}
            <IssueSelect lang={lang} view={view} date={date} latest={latest} options={dates.slice().reverse().map((d) => [d, longDate(d, lang)])} />
            {i >= 0 && i < dates.length - 1 ? <Link href={to({ date: dates[i + 1] })} aria-label={t.nextA}><span className="t">{t.next} </span><svg className="ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg></Link>
              : <button type="button" aria-label={t.nextA} disabled><span className="t">{t.next} </span><svg className="ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg></button>}
          </div>
          <span className="count">{t.count(dates.length)}</span>
          {!isLatest && <Link className="btn ghost latest" href={to({ date: latest })}>{t.latest}</Link>}
        </nav>
      )}
      <div>
        {!bare && !isLatest && (
          <div className="archive-note"><b>{t.archived}</b><span>{t.viewingOld(midDate(date, lang))}</span>
            <Link className="linkbtn" href={to({ date: latest })}>{t.toLatest}</Link></div>
        )}
      </div>
    </>
  );
}
