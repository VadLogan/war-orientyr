"use client";
import { useEffect, useRef, useState } from "react";
import { shortD } from "@/lib/text";
import { useApp } from "../ctx";
import { useSticky } from "./hooks";

type Cnt = { ok: number; partial: number; unavailable: number };
type Row = { k: string; by: Record<string, Cnt> };
type St = "ok" | "part" | "unv";
const domOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return String(u || "?"); } };
const st = (c: Cnt): St => { const n = c.ok + c.partial + c.unavailable; return c.unavailable === n ? "unv" : c.ok === n ? "ok" : "part"; };

let SMX: { key: string; days: string[]; rows: Row[] } | null = null;

/** Every source domain × every issue: read / partial / unavailable / not used. */
export default function SourceMatrix() {
  const { lang, DATES, fetchIssue } = useApp();
  const en = lang === "en";
  const key = DATES.join();
  const [data, setData] = useState(SMX && SMX.key === key ? SMX : null);
  const [fs, setFs] = useSticky<Set<St>>("smxFs", new Set());
  const [sel, setSel] = useSticky<Set<string>>("smxSel", new Set());
  const [q, setQ] = useSticky("smxQ", "");
  const [showAll, setShowAll] = useSticky("smxAll", false);
  const [only, setOnly] = useSticky("smxOnly", false);
  const selAll = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) return;
    let live = true;
    const ds = DATES.slice().sort();
    Promise.allSettled(ds.map((d) => fetchIssue(d))).then((res) => {
      const days: string[] = [], rows: Record<string, Row> = {};
      res.forEach((r) => {
        if (r.status !== "fulfilled") return;
        const iss = r.value;
        days.push(iss.date);
        (iss.sources || []).forEach((s) => {
          const o = (rows[domOf(s.url)] ||= { k: domOf(s.url), by: {} });
          const c = (o.by[iss.date] ||= { ok: 0, partial: 0, unavailable: 0 });
          c[s.status in c ? s.status : "ok"]++;
        });
      });
      SMX = { key, days, rows: Object.values(rows) };
      if (live) setData(SMX);
    });
    return () => { live = false; };
  }, [data, DATES, fetchIssue, key]);

  const nm = { ok: en ? "read" : "прочитано", partial: en ? "partial" : "частково", unavailable: en ? "unavailable" : "недоступне" };
  const k2: Record<St, keyof typeof nm> = { ok: "ok", part: "partial", unv: "unavailable" };
  const head = <><h2>{en ? "Sources by day" : "Джерела по днях"}</h2><p className="sub">{en ? "How each resource was read in every issue: green — read, amber — partly or via retelling, red — unavailable, empty — not used that day." : "Як читався кожен ресурс у кожному випуску: зелений — прочитано, бурштиновий — частково або в переказі, червоний — недоступне, порожньо — того дня не використовувався."}</p></>;
  if (!data) return <section className="panel" id="srcMx">{head}<div><p className="map-src">{en ? "Loading issues…" : "Завантаження випусків…"}</p></div></section>;
  const days = data.days;
  if (!days.length) return <section className="panel" id="srcMx">{head}<div /></section>;

  const base = data.rows.slice().sort((a, b) => Object.keys(b.by).length - Object.keys(a.by).length || a.k.localeCompare(b.k));
  const terms = q.toLowerCase().split(/[,;\s]+/).filter(Boolean);
  let rows = base;
  if (terms.length) rows = rows.filter((r) => terms.some((t) => r.k.toLowerCase().includes(t)));
  else if (!showAll && !fs.size) rows = rows.filter((r) => Object.keys(r.by).length >= 2);
  if (fs.size) rows = rows.filter((r) => days.some((d) => r.by[d] && fs.has(st(r.by[d]))));
  const onlyOn = only && sel.size > 0;
  if (onlyOn) rows = rows.filter((r) => sel.has(r.k));
  const nSel = rows.filter((r) => sel.has(r.k)).length;
  const filt = terms.length || fs.size;
  const toggleSet = <T,>(s: Set<T>, v: T, on: boolean) => { const n = new Set(s); if (on) n.add(v); else n.delete(v); return n; };

  return (
    <section className="panel" id="srcMx">{head}
      <div>
        <div className="smx-ctl">
          <div className="legend smx-leg" role="group" aria-label={en ? "Filter by status" : "Фільтр за статусом"}>
            {(["ok", "part", "unv"] as St[]).map((k) => (
              <button type="button" className="smx-chip" key={k} aria-pressed={fs.has(k)} onClick={() => setFs(toggleSet(fs, k, !fs.has(k)))}><i style={{ background: `var(--${k})` }} />{nm[k2[k]]}</button>
            ))}
            <span className="smx-chip static"><i style={{ background: "var(--track)" }} />{en ? "not used" : "не використовувався"}</span>
          </div>
          <input type="search" className="smx-q" placeholder={en ? "Filter resources (e.g. reuters, axios)" : "Ресурси: напр. reuters, axios"} aria-label={en ? "Filter resources" : "Фільтр ресурсів"} value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className="linkbtn" style={{ display: filt ? "none" : undefined }} onClick={() => setShowAll(!showAll)}>
            {showAll ? (en ? "Show main only" : "Лише основні") : en ? "Show all (" + base.length + ")" : "Показати всі (" + base.length + ")"}
          </button>
          <button type="button" className="smx-chip" aria-pressed={onlyOn} hidden={!sel.size} onClick={() => setOnly(!onlyOn)}>{(en ? "Selected only (" : "Лише вибрані (") + sel.size + ")"}</button>
          <span className="sub">{(en ? "Shown: " : "Показано: ") + rows.length + " / " + base.length}</span>
        </div>
        <div>
          {!rows.length ? <p className="sub">{en ? "Nothing matches the filter." : "Нічого не знайдено за фільтром."}</p> : (
            <div className="smx-wrap">
              <div className="smx" style={{ gridTemplateColumns: `minmax(170px,1.4fr) repeat(${days.length},minmax(26px,1fr))` }}>
                <label className="smx-h smx-all">
                  <input type="checkbox" ref={(el) => { selAll.current = el; if (el) el.indeterminate = nSel > 0 && nSel < rows.length; }} aria-label={en ? "Select all" : "Вибрати всі"}
                    checked={nSel > 0 && nSel === rows.length}
                    onChange={(e) => { const n = new Set(sel); rows.forEach((r) => (e.target.checked ? n.add(r.k) : n.delete(r.k))); setSel(n); }} />
                  <span>{en ? "Select all" : "Вибрати всі"}</span>
                </label>
                {days.map((d) => <div className="smx-h smx-d" key={d}>{shortD(d)}</div>)}
                {rows.map((r) => [
                  <label className="smx-k" title={r.k} key={r.k}>
                    <input type="checkbox" className="smx-cb" checked={sel.has(r.k)} onChange={(e) => setSel(toggleSet(sel, r.k, e.target.checked))} /><span>{r.k}</span>
                  </label>,
                  ...days.map((d) => {
                    const c = r.by[d];
                    if (!c) return <div className="smx-c" key={r.k + d} />;
                    const k = st(c);
                    return <div key={r.k + d} className={`smx-c ${k}${fs.size && !fs.has(k) ? " dim" : ""}`} tabIndex={0}
                      data-tip={`${r.k} · ${shortD(d)}: ${nm.ok} ${c.ok}, ${nm.partial} ${c.partial}, ${nm.unavailable} ${c.unavailable}`} />;
                  }),
                ])}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
