"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Digest } from "@/types/digest";
import { styleData, longDate, midDate } from "@/lib/text";
import { loadStrikes, type Strikes } from "@/lib/strikes";
import type { Lang } from "@/lib/ui";
import { AppCtx, strings, type Ctx } from "./ctx";
import Mast from "./Mast";
import Digest_ from "./digest/Digest";
import Dashboard from "./dash/Dashboard";
import Tooltip from "./Tooltip";

type View = "digest" | "dashboard";

function readHash() {
  const h = (location.hash || "").slice(1);
  const m = h.match(/(\d{4}-\d{2}-\d{2})/);
  return { view: (/^dashboard/.test(h) ? "dashboard" : "digest") as View, date: m ? m[1] : null };
}

export default function App({ latest, dates }: { latest: Digest; dates: string[] }) {
  const [lang, setLang] = useState<Lang>("uk");
  const [view, setView] = useState<View>("digest");
  const [D, setD] = useState<Digest>(latest);
  const [loading, setLoading] = useState(false);
  const [issueErr, setIssueErr] = useState(false);
  const [ready, setReady] = useState(false);
  const [strikes, setStrikes] = useState<Strikes | null>(null);
  const [strikesErr, setStrikesErr] = useState(false);
  const [scrollId, setScrollId] = useState<string | null>(null);
  const cache = useRef<Record<string, Promise<Digest>>>({});
  const stkReq = useRef(false);
  const t = strings(lang);

  const fetchIssue = useCallback((date: string) => {
    if (date === latest.date) return Promise.resolve(latest);
    return (cache.current[date] ??= (async () => {
      const r = await fetch("issues/" + date + ".json", { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const j = styleData(await r.json(), "") as Digest;
      if (!j || j.date !== date) throw new Error("mismatch");
      return j;
    })().catch((e) => { delete cache.current[date]; throw e; }));
  }, [latest]);

  const cur = useRef(D);
  cur.current = D;
  const selectDate = useCallback(async (date: string) => {
    if (!date || date === cur.current.date) return;
    setLoading(true);
    try {
      setD(await fetchIssue(date));
      setIssueErr(false);
      window.scrollTo({ top: 0 });
    } catch {
      setIssueErr(true);
    } finally {
      setLoading(false);
    }
  }, [fetchIssue]);

  // boot: saved language + hash (#dashboard, #YYYY-MM-DD, #dashboard-YYYY-MM-DD)
  useEffect(() => {
    try { const l = localStorage.getItem("wd-lang"); if (l === "en" || l === "uk") setLang(l); } catch {}
    const h = readHash();
    setView(h.view);
    const go = h.date && h.date !== latest.date && dates.includes(h.date) ? selectDate(h.date) : Promise.resolve();
    go.finally(() => setReady(true));
    const onHash = () => {
      const h = readHash();
      setView(h.view);
      if (h.date && dates.includes(h.date)) selectDate(h.date);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [latest, dates, selectDate]);

  useEffect(() => {
    if (!ready) return;
    const old = D.date !== latest.date ? D.date : "";
    const tok = view === "dashboard" ? "dashboard" + (old ? "-" + old : "") : old;
    try { history.replaceState(null, "", tok ? "#" + tok : location.pathname + location.search); } catch {}
  }, [ready, view, D.date, latest.date]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const needStrikes = useCallback(() => {
    if (stkReq.current) return;
    stkReq.current = true;
    loadStrikes().then(setStrikes, () => setStrikesErr(true));
  }, []);
  useEffect(() => { if (view === "digest") needStrikes(); }, [view, needStrikes]);

  const goItem = useCallback(async (date: string | undefined, id: string) => {
    setView("digest");
    if (date && date !== cur.current.date) await selectDate(date);
    setScrollId(id);
  }, [selectDate]);
  useEffect(() => {
    if (!scrollId || view !== "digest") return;
    setScrollId(null);
    const el = document.getElementById("it-" + scrollId);
    if (!el) return;
    el.scrollIntoView({ block: "center" });
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1800);
  }, [scrollId, view, D]);

  const pickLang = (l: Lang) => { setLang(l); try { localStorage.setItem("wd-lang", l); } catch {} };

  const ctx: Ctx = useMemo(() => ({ lang, t, D, LATEST: latest, DATES: dates, strikes, strikesErr, needStrikes, fetchIssue, selectDate, goItem }),
    [lang, t, D, latest, dates, strikes, strikesErr, needStrikes, fetchIssue, selectDate, goItem]);

  const i = dates.indexOf(D.date), isLatest = D.date === latest.date;
  return (
    <AppCtx.Provider value={ctx}>
      <div className="shell">
        <header className="topbar">
          <div className="brand" dangerouslySetInnerHTML={{ __html: t.brand }} />
          <div className="controls">
            <div className="seg" role="group">
              <button type="button" aria-pressed={view === "digest"} onClick={() => setView("digest")}>{t.digest}</button>
              <button type="button" aria-pressed={view === "dashboard"} onClick={() => setView("dashboard")}>{t.dash}</button>
            </div>
            <div className="seg lang" role="group" aria-label="Мова / Language">
              <button type="button" aria-pressed={lang === "uk"} onClick={() => pickLang("uk")}>UA</button>
              <button type="button" aria-pressed={lang === "en"} onClick={() => pickLang("en")}>EN</button>
            </div>
          </div>
        </header>
        {dates.length > 0 && (
          <nav className="datebar">
            <label htmlFor="issueSel">{t.pickDate}</label>
            <div className="dnav">
              <button type="button" aria-label={t.prevA} disabled={i <= 0} onClick={() => i > 0 && selectDate(dates[i - 1])}>‹<span className="t"> {t.prev}</span></button>
              <select id="issueSel" value={D.date} onChange={(e) => selectDate(e.target.value)}>
                {dates.slice().reverse().map((d) => <option key={d} value={d}>{longDate(d, lang)}</option>)}
              </select>
              <button type="button" aria-label={t.nextA} disabled={i < 0 || i >= dates.length - 1} onClick={() => i < dates.length - 1 && selectDate(dates[i + 1])}><span className="t">{t.next} </span>›</button>
            </div>
            <span className="count">{t.count(dates.length)}</span>
            {!isLatest && <button type="button" className="btn ghost latest" onClick={() => selectDate(latest.date)}>{t.latest}</button>}
          </nav>
        )}
        <div>
          {issueErr ? (
            <div className="archive-note"><b>!</b><span>{t.issueErr}</span></div>
          ) : !isLatest && (
            <div className="archive-note"><b>{t.archived}</b><span>{t.viewingOld(midDate(D.date, lang))}</span>
              <button type="button" className="linkbtn" onClick={() => selectDate(latest.date)}>{t.toLatest}</button></div>
          )}
        </div>
        <Mast dashboard={view === "dashboard"} />
        <main id="main">
          <div className={"view" + (loading ? " loading" : "")}>
            {view === "dashboard" ? <Dashboard /> : <Digest_ />}
          </div>
        </main>
      </div>
      <Tooltip />
    </AppCtx.Provider>
  );
}
