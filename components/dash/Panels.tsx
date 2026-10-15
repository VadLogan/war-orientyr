"use client";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/types/digest";
import { fmt, niceMax, num, shortD, TL } from "@/lib/text";
import { fireIco } from "@/lib/icons";
import type { Lang } from "@/lib/ui";
import { useApp } from "../ctx";
import { useChartW, useJson } from "./hooks";

const MN = { uk: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
/** Ukrainian / English pick for the panel texts below. */
const pick = (lang: Lang) => (uk: string, en: string) => (lang === "en" ? en : uk);
const Ico = ({ html }: { html: string }) => <span className="li-ico" dangerouslySetInnerHTML={{ __html: html }} />;
const A = ({ href, children }: { href?: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noopener">{children}</a>;

/** Horizontal grid lines with y-axis labels shared by the fixed-width bar charts. */
function Grid({ ymax, y, ml, W, mr, dx, label }: { ymax: number; y: (v: number) => number; ml: number; W: number; mr: number; dx: number; label: (v: number) => string }) {
  return <>{[0, 1, 2, 3, 4].map((k) => { const v = (ymax * k) / 4; return (
    <Fragment key={k}><line className="cv-g" x1={ml} x2={W - mr} y1={y(v)} y2={y(v)} /><text className="cv-x" x={ml - dx} y={y(v) + 4} textAnchor="end">{label(v)}</text></Fragment>
  ); })}</>;
}

/* ---------- civilian casualties by month (UN HRMMU) ---------- */
export function Civ() {
  const { D, LATEST, lang } = useApp();
  const W = useChartW();
  const C = D.civilianStats || LATEST.civilianStats;
  if (!C || !Array.isArray(C.months) || !C.months.length) return null;
  const M = C.months.filter((r) => r.killed != null && r.injured != null) as { m: string; killed: number; injured: number; note?: string }[];
  const lab = (r: { m: string }) => MN[lang][+r.m.slice(5, 7) - 1] + " " + r.m.slice(2, 4);
  const f = (n: number) => fmt(n, lang), tr = pick(lang);
  const H = W < 480 ? 260 : 290, ml = 42, mr = 6, mt = 24, mb = 42, iw = W - ml - mr, ih = H - mt - mb, n = M.length, bw = iw / n, g = Math.min(54, bw * 0.62);
  const ymax = niceMax(Math.max(1, ...M.map((r) => r.killed + r.injured)) * 1.08), y = (v: number) => mt + ih - (v / ymax) * ih;
  const seg = (x0: number, yt: number, yb: number, col: string, top: boolean) => {
    const h = yb - yt;
    if (h <= 0) return null;
    const r = top ? Math.min(4, h) : 0;
    return <path d={`M${x0} ${yb}V${yt + r}${r ? `q0 -${r} ${r} -${r}h${g - 2 * r}q${r} 0 ${r} ${r}` : `h${g}`}V${yb}z`} fill={col} />;
  };
  return (
    <section className="panel cv" id="civ">
      <h2>{C.title || tr("Цивільні жертви за місяцями", "Civilian casualties by month")}</h2>
      {C.lead && <p className="cv-lead">{C.lead}</p>}
      <div className="cv-leg"><span><i style={{ background: "var(--c2)" }} />{tr("Загинули", "Killed")}</span><span><i style={{ background: "var(--c1)" }} />{tr("Поранені", "Injured")}</span><span className="cv-hint">{tr("над стовпчиком — разом; під місяцем — загиблі", "above the bar — total; below the month — killed")}</span></div>
      <svg className="cv-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${C.title || ""}: ${M.map((r) => lab(r) + tr(" — загинули ", " — killed ") + r.killed + tr(", поранені ", ", injured ") + r.injured).join("; ")}`}>
        <Grid ymax={ymax} y={y} ml={ml} W={W} mr={mr} dx={8} label={(v) => f(Math.round(v))} />
        {M.map((r, i) => {
          const cx = ml + bw * (i + 0.5), x0 = +(cx - g / 2).toFixed(1), t = r.killed + r.injured, yk = y(r.killed), yt = y(t);
          return (
            <g className="cv-b" tabIndex={0} key={r.m}>
              <title>{`${lab(r)}: ${tr("загинули", "killed")} ${f(r.killed)}, ${tr("поранені", "injured")} ${f(r.injured)}, ${tr("разом", "total")} ${f(t)}${r.note ? " (" + r.note + ")" : ""}`}</title>
              <rect x={(cx - bw / 2).toFixed(1)} y={mt} width={bw.toFixed(1)} height={ih} fill="transparent" />
              {seg(x0, yk, mt + ih, "var(--c2)", false)}{seg(x0, yt, yk - 2, "var(--c1)", true)}
              <text className="cv-v" x={cx} y={yt - 7} textAnchor="middle">{f(t)}</text>
              <text className="cv-x" x={cx} y={H - 24} textAnchor="middle">{lab(r)}</text>
              <text className="cv-k" x={cx} y={H - 7} textAnchor="middle">{f(r.killed)}</text>
            </g>
          );
        })}
        <line className="cv-base" x1={ml} x2={W - mr} y1={mt + ih} y2={mt + ih} />
      </svg>
      <details className="cv-tbl"><summary>{tr("Таблиця", "Table")}</summary><table>
        <thead><tr><th>{tr("Місяць", "Month")}</th><th className="n">{tr("Загинули", "Killed")}</th><th className="n">{tr("Поранені", "Injured")}</th><th className="n">{tr("Разом", "Total")}</th></tr></thead>
        <tbody>{M.map((r) => <tr key={r.m}><td>{lab(r)}</td><td className="n">{f(r.killed)}</td><td className="n">{f(r.injured)}</td><td className="n">{f(r.killed + r.injured)}</td></tr>)}</tbody>
      </table></details>
      <p className="cv-src">{C.note || ""} <A href={C.url || "#"}>{C.source || ""}</A></p>
    </section>
  );
}

/* ---------- russian fire per day (General Staff) ---------- */
export function Fire() {
  const { D, LATEST, lang } = useApp();
  const en = lang === "en";
  const rows = TL(LATEST).filter((e) => e.fire && e.date <= D.date).slice(-30);
  const day = (d: string) => { const x = new Date(d + "T00:00:00Z"); x.setUTCDate(x.getUTCDate() - 1); return x.toISOString().slice(0, 10); };
  const TT = { air: en ? "Airstrikes" : "Авіаудари", kab: en ? "Guided bombs (KAB)" : "КАБи", kamikaze: en ? "Kamikaze drones" : "Дрони-камікадзе", shell: en ? "Shelling" : "Обстріли" };
  const f = (n: number) => fmt(n, lang);
  return (
    <section className="panel" id="fireP">
      <h2>{en ? "russian fire per day" : "Вогонь рф за добу"}</h2>
      <p className="sub">{en ? "General Staff daily report: airstrikes, guided bombs, kamikaze drones and shelling. Each bar is one day; the highlighted bar is the latest." : "За зведенням Генштабу ЗСУ: авіаудари, КАБи, дрони-камікадзе та обстріли. Кожен стовпчик — доба; виділено останню."}</p>
      <div className="fire-grid">
        {!rows.length ? <p className="sub">{en ? "No data yet." : "Даних поки немає."}</p> : (["air", "kab", "kamikaze", "shell"] as const).map((k) => {
          const pts = rows.filter((e) => e.fire![k] != null);
          if (!pts.length) return null;
          const val = (e: TimelineEntry) => e.fire![k]!;
          const last = pts[pts.length - 1], prev = pts.length > 1 ? pts[pts.length - 2] : null, v = val(last), dlt = prev ? v - val(prev) : null;
          const avg = Math.round(pts.reduce((a, e) => a + val(e), 0) / pts.length), mx = Math.max(...pts.map(val)) * 1.08, W = pts.length * 10, H = 56, ay = H - (avg / mx) * H;
          const mlrs = (e: TimelineEntry) => e.fire!.mlrs;
          return (
            <div className="fire-card" key={k}>
              <div className="fire-h"><Ico html={fireIco(k)} />{TT[k]}</div>
              <div className="fire-v"><b>{f(v)}</b>{dlt != null && <span className={"fire-d " + (dlt > 0 ? "up" : dlt < 0 ? "dn" : "")}>{dlt > 0 ? "▲ +" : dlt < 0 ? "▼ −" : "= "}{f(Math.abs(dlt))}</span>}</div>
              <div className="sub" style={{ margin: 0 }}>{en ? "day" : "доба"} {shortD(day(last.date))}{k === "shell" && mlrs(last) != null ? (en ? ` · MLRS ${f(mlrs(last)!)}` : ` · з РСЗВ ${f(mlrs(last)!)}`) : ""} · {en ? "avg" : "середнє"} {f(avg)}</div>
              <svg className="fire-bars" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={TT[k]}>
                {pts.map((e, n) => { const h = Math.max(1.5, (val(e) / mx) * H), isL = n === pts.length - 1; return (
                  <rect key={e.date} x={n * 10 + 1.5} y={H - h} width={7} height={h} rx={1} fill={isL ? "var(--accent)" : "var(--muted)"} fillOpacity={isL ? 1 : 0.35}>
                    <title>{`${shortD(day(e.date))}: ${f(val(e))}${k === "shell" && mlrs(e) != null ? (en ? " (MLRS " : " (РСЗВ ") + f(mlrs(e)!) + ")" : ""}`}</title>
                  </rect>
                ); })}
                <line x1={0} x2={W} y1={ay} y2={ay} stroke="var(--ink)" strokeOpacity=".35" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="fire-x"><span>{shortD(day(pts[0].date))}</span><span>{shortD(day(last.date))}</span></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- cost of the nightly attack: counts from the Air Force report, unit prices from prices.json ---------- */
type Prices = { note: string; types: Record<string, { label: string; low: number; high: number; src: string; url?: string }> };
type Mix = { type: string; n: number }[];
function money(v: number, lang: Lang) {
  const en = lang === "en", L = en ? "en-GB" : "uk-UA";
  if (v < 1e6) return "$" + Math.round(v / 1e3).toLocaleString(L) + (en ? "k" : " тис.");
  if (v >= 1e9) return "$" + (v / 1e9).toLocaleString(L, { maximumFractionDigits: 2 }) + (en ? " bn" : " млрд");
  return "$" + (v / 1e6).toLocaleString(L, { maximumFractionDigits: v < 1e7 ? 1 : 0 }) + (en ? " m" : " млн");
}
const atkMix = (e: { mix?: Mix; launched?: number }) => {
  if (Array.isArray(e.mix) && e.mix.length) return { mix: e.mix, full: true };
  const n = num(e.launched);
  return n != null ? { mix: [{ type: "drone-mixed", n }], full: false } : null;
};

export function Attack() {
  const { D, LATEST, DATES, lang, selectDate } = useApp();
  const W = useChartW();
  const { data: P, err } = useJson<Prices>("/prices.json");
  const [sel, setSel] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null), tipRef = useRef<HTMLDivElement>(null), gRefs = useRef<(SVGGElement | null)[]>([]);
  useLayoutEffect(() => {
    const wrap = wrapRef.current, tp = tipRef.current, g = sel != null ? gRefs.current[sel] : null;
    if (!wrap || !tp || !g) return;
    const wr = wrap.getBoundingClientRect(), gr = g.getBoundingClientRect(), tw = tp.offsetWidth;
    let l = gr.left - wr.left + gr.width / 2 + 8;
    if (l + tw > wr.width) l = gr.left - wr.left + gr.width / 2 - tw - 8;
    tp.style.left = Math.max(0, l) + "px";
    tp.style.top = "0px";
  });
  const tr = pick(lang);
  const body = (() => {
    if (err) return <p className="map-src">{tr("Не вдалося завантажити ціни (prices.json).", "Could not load the prices (prices.json).")}</p>;
    if (!P) return <p className="map-src">{tr("Завантаження цін…", "Loading prices…")}</p>;
    const f = (n: number) => fmt(n, lang), $ = (v: number) => money(v, lang);
    const sum = (mix: Mix) => { let lo = 0, hi = 0; mix.forEach((m) => { const p = P.types[m.type]; if (p) { lo += m.n * p.low; hi += m.n * p.high; } }); return { lo, hi }; };
    const Ad = D.airDefense || {};
    const cur = atkMix(Array.isArray(Ad.mix) ? Ad : { launched: Ad.launched });
    if (!cur) return <p className="map-src">{tr("У звіті Повітряних сил за цю ніч немає кількості засобів атаки.", "The Air Force report for this night gives no count of attack weapons.")}</p>;
    const S = sum(cur.mix), tot = cur.mix.reduce((a, m) => a + m.n, 0);
    const H = TL(LATEST).filter((e) => e.date <= D.date).map((e) => {
      const m = atkMix(e);
      if (!m) return null;
      const s = sum(m.mix);
      return { date: e.date, night: e.night, lo: s.lo, hi: s.hi, full: m.full, mu: num(e.missilesUntyped), mix: m.mix, la: num(e.launched), ic: num(e.intercepted) };
    }).filter((h): h is NonNullable<typeof h> => !!h).slice(-14);
    const range = (lo: number, hi: number) => (lo === hi ? $(lo) : $(lo) + "–" + $(hi));
    let chart = null;
    if (H.length > 1) {
      const Hh = 200, ml = 46, mr = 8, mt = 14, mb = 24, iw = W - ml - mr, ih = Hh - mt - mb, bw = iw / H.length, g = Math.min(26, bw * 0.5);
      const ymax = niceMax(Math.max(...H.map((h) => h.hi)) * 1.05), y = (v: number) => mt + ih - (v / ymax) * ih;
      const h = sel != null ? H[sel] : null, open = (d: string) => d !== D.date && DATES.includes(d);
      chart = <>
        <p className="atk-sub">{tr("Попередні ночі, діапазон оцінки в млн $ (блідіші стовпчики — лише дрони без розбивки; «+N рак.» — ракети, які не вдалося оцінити, бо їхні типи не названо). ⓘ Наведіть або торкніться стовпчика — покаже розрахунок за ту ніч:", "Previous nights, estimate range in $ m (paler bars — drones only, no breakdown; “+N msl” — missiles that could not be priced because their types were not named). ⓘ Hover over or tap a bar to see that night’s calculation:")}</p>
        <div className="atk-plot" style={{ position: "relative" }} ref={wrapRef} onPointerLeave={(ev) => { if (ev.pointerType === "mouse") setSel(null); }}>
          <svg className="cv-svg" viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label={tr("Оцінка вартості нічних атак: ", "Estimated cost of the night attacks: ") + H.map((h) => shortD(h.date) + " " + $(h.lo) + "–" + $(h.hi)).join("; ")}>
            <line className="cv-base" x1={ml} x2={W - mr} y1={mt + ih} y2={mt + ih} />
            <Grid ymax={ymax} y={y} ml={ml} W={W} mr={mr} dx={6} label={(v) => (v ? $(v).replace(/ (млн|m)$/, "") : "0")} />
            {H.map((h, i) => {
              const cx = ml + bw * (i + 0.5), yt = y(h.hi), yb = y(h.lo);
              return (
                <g className="cv-b atk-b" tabIndex={0} key={h.date} style={{ cursor: "pointer" }} ref={(el) => { gRefs.current[i] = el; }}
                  onPointerEnter={(ev) => { if (ev.pointerType === "mouse") setSel(i); }} onFocus={() => setSel(i)} onBlur={() => setSel(null)}
                  onClick={() => { if (sel === i && open(h.date)) { selectDate(h.date); return; } setSel(i); }}>
                  <rect x={(cx - bw / 2).toFixed(1)} y={mt} width={bw.toFixed(1)} height={ih} fill="transparent" />
                  <rect x={(cx - g / 2).toFixed(1)} y={yt.toFixed(1)} width={g.toFixed(1)} height={Math.max(2, yb - yt).toFixed(1)} rx={3} fill={h.date === D.date ? "var(--c2)" : "var(--c1)"} fillOpacity={h.full ? undefined : ".55"} />
                  {h.mu ? <text className="cv-k" x={cx} y={(yt - 6).toFixed(1)} textAnchor="middle">+{h.mu} {tr("рак.", "msl")}</text> : null}
                  <text className="cv-x" x={cx} y={Hh - 6} textAnchor="middle">{shortD(h.date)}</text>
                </g>
              );
            })}
          </svg>
          {h && (
            <div className="ctip" ref={tipRef}>
              <div className="d">{tr("ніч ", "night ") + (h.night || shortD(h.date)) + (h.date === D.date ? tr(" · цей випуск", " · this issue") : "")}</div>
              <div style={{ fontWeight: 600 }}>{tr("Оцінка: ", "Estimate: ") + range(h.lo, h.hi)}</div>
              {h.la != null && <div className="s">{tr("Запущено ", "Launched ") + f(h.la) + (h.ic != null && h.la ? tr(", збито / подавлено ", ", shot down / suppressed ") + f(h.ic) + " (" + Math.round((h.ic / h.la) * 100) + "%)" : "")}</div>}
              {h.mix.map((m, k) => { const pp = P.types[m.type]; return (
                <div className="r" key={k}><b>{f(m.n)}</b><span>{(pp ? pp.label : m.type) + (pp ? " · " + range(m.n * pp.low, m.n * pp.high) : tr(" · ціну не знайдено", " · no price found"))}</span></div>
              ); })}
              {!h.full && <div className="s">{tr("Розбивки за типами немає — оцінка за діапазоном усіх дронів.", "No breakdown by type — estimated over the range of all drones.")}</div>}
              {h.mu ? <div className="s">{tr("Ще " + h.mu + " ракет без названого типу — не оцінено.", h.mu + " more missiles of unnamed type — not priced.")}</div> : null}
              {open(h.date) && <div className="s" style={{ color: "var(--accent)" }}>{tr("Клацніть, щоб відкрити випуск (на телефоні — торкніться ще раз)", "Click to open the issue (on a phone, tap again)")}</div>}
            </div>
          )}
        </div>
      </>;
    }
    return <>
      <div className="atk-top"><b>{$(S.lo)}–{$(S.hi)}</b><span>{Ad.period || ""}: {f(tot)} {tr("засобів атаки", "attack weapons")}{num(Ad.missiles) ? "" : tr(", ракет у звіті немає", ", no missiles in the report")}{cur.full ? "" : tr(" · розбивки за типами немає, оцінка за діапазоном усіх дронів", " · no breakdown by type, estimated over the range of all drones")}</span></div>
      <details className="cv-tbl"><summary>{tr("Розрахунок по типах", "Calculation by type")}</summary><table>
        <thead><tr><th>{tr("Тип", "Type")}</th><th className="n">{tr("Кількість", "Count")}</th><th className="n">{tr("Ціна одиниці", "Unit price")}</th><th className="n">{tr("Разом", "Total")}</th></tr></thead>
        <tbody>{cur.mix.map((m, k) => {
          const p = P.types[m.type] || { label: m.type, low: null, high: null, src: tr("ціну не знайдено", "no price found") } as unknown as Prices["types"][string];
          const lo = p.low != null ? m.n * p.low : null, hi = p.high != null ? m.n * p.high : null;
          return <tr key={k}><td>{p.label}<small className="src">{p.url ? <A href={p.url}>{p.src}</A> : p.src}</small></td><td className="n">{f(m.n)}</td>
            <td className="n">{p.low == null ? "—" : range(p.low, p.high)}</td><td className="n">{lo == null ? "—" : range(lo, hi!)}</td></tr>;
        })}</tbody>
      </table></details>
      {chart}
      <p className="cv-src">{P.note} {tr("Кількість — зі звіту Повітряних сил; це вартість лише засобів ураження, без пусків, логістики та збитків, завданих Україні. Ціни не перевірені незалежно.", "Counts are from the Air Force report; this is the cost of the weapons only, without launch, logistics or the damage done to Ukraine. Prices are not independently verified.")}</p>
    </>;
  })();
  return <section className="panel atk" id="atk"><h2>{tr("Скільки коштував росії нічний обстріл — оцінка", "What the night attack cost russia — an estimate")}</h2><div>{body}</div></section>;
}

/* ---------- recruitment vs losses: recruit.json ---------- */
type Recruit = {
  periods?: { from: string; to: string; n: number; src: string; url?: string; derived?: boolean }[];
  claims?: { from: string; to: string; n: number; who: string; url?: string }[];
  losses?: { m: string; n: number }[];
  plan?: { year: number; n: number; src: string; url?: string };
  lossesSrc?: { src: string; url?: string };
  note?: string;
};
function mSpan(a: string, b: string) {
  const [y1, m1] = a.split("-").map(Number), [y2, m2] = b.split("-").map(Number), out: string[] = [];
  let y = y1, m = m1;
  while (y < y2 || (y === y2 && m <= m2)) { out.push(y + "-" + String(m).padStart(2, "0")); m++; if (m > 12) { m = 1; y++; } }
  return out;
}
export function Recruit() {
  const { lang } = useApp();
  const W = useChartW();
  const { data: C, err } = useJson<Recruit>("/recruit.json");
  const tr = pick(lang);
  const head = <h2>{tr("Набір у російську армію проти втрат — оцінка", "Recruitment into the russian army vs losses — an estimate")}</h2>;
  if (err) return <section className="panel rec" id="rec">{head}<div><p className="map-src">{tr("Не вдалося завантажити дані (recruit.json).", "Could not load the data (recruit.json).")}</p></div></section>;
  if (!C) return <section className="panel rec" id="rec">{head}<div><p className="map-src">{tr("Завантаження…", "Loading…")}</p></div></section>;
  const f = (n: number) => fmt(n, lang), lab = (m: string) => MN[lang][+m.slice(5, 7) - 1];
  const rec: Record<string, number> = {}, recP: Record<string, { derived?: boolean }> = {}, cl: Record<string, number> = {};
  (C.periods || []).forEach((p) => { const ms = mSpan(p.from, p.to); ms.forEach((m) => { rec[m] = p.n / ms.length; recP[m] = p; }); });
  (C.claims || []).forEach((p) => { const ms = mSpan(p.from, p.to); ms.forEach((m) => { cl[m] = p.n / ms.length; }); });
  const L: Record<string, number> = {};
  (C.losses || []).forEach((r) => (L[r.m] = r.n));
  const all = [...new Set([...Object.keys(L), ...Object.keys(rec), ...Object.keys(cl)])].sort();
  const covered = all.filter((m) => rec[m] != null && L[m] != null);
  const recSum = covered.reduce((a, m) => a + rec[m], 0), losSum = covered.reduce((a, m) => a + L[m], 0);
  const recYear = Object.keys(rec).filter((m) => C.plan && m.startsWith(String(C.plan.year))).reduce((a, m) => a + rec[m], 0);
  const k = (v: number) => f(Math.round(v / 100) * 100);
  const per = covered.length ? `${lab(covered[0])}–${lab(covered[covered.length - 1])} ${covered[0].slice(0, 4)}` : "";
  const H = 240, ml = 46, mr = 8, mt = 14, mb = 24, iw = W - ml - mr, ih = H - mt - mb, n = all.length, bw = iw / n, g = Math.min(30, bw * 0.56);
  const ymax = niceMax(Math.max(...all.map((m) => Math.max(L[m] || 0, rec[m] || 0, cl[m] || 0))) * 1.06), y = (v: number) => mt + ih - (v / ymax) * ih;
  const step = (src: Record<string, number>, cls: string) => {
    let d = "", prev: number | null = null;
    all.forEach((m, i) => {
      const v = src[m];
      if (v == null) { prev = null; return; }
      const x0 = ml + bw * i, x1 = x0 + bw, yy = y(v).toFixed(1);
      d += (prev != null && prev === i - 1 ? `L${x0.toFixed(1)} ${yy}` : `M${x0.toFixed(1)} ${yy}`) + `H${x1.toFixed(1)}`;
      prev = i;
    });
    return d ? <path className={cls} d={d} /> : null;
  };
  const srcs = [...(C.periods || []).map((p) => [p.src, p.url]), ...(C.claims || []).map((p) => [p.who, p.url]),
    C.plan ? [C.plan.src, C.plan.url] : null, C.lossesSrc ? [C.lossesSrc.src, C.lossesSrc.url] : null].filter(Boolean) as [string, string | undefined][];
  return (
    <section className="panel rec" id="rec">{head}<div>
      <div className="rc-stats">
        <div><small>{tr(`Набрано за ${per} (оцінка)`, `Recruited in ${per} (estimate)`)}</small><b>≈{k(recSum)}</b></div>
        <div><small>{tr("Втрати за ті ж місяці (Генштаб)", "Losses in the same months (General Staff)")}</small><b>{f(losSum)}</b></div>
        {C.plan && <div><small>{tr(`План кремля на ${C.plan.year} рік`, `The kremlin’s plan for ${C.plan.year}`)}</small><b>{f(C.plan.n)}</b><span>{tr("виконано", "fulfilled")} ≈{Math.round((recYear / C.plan.n) * 100)}% {tr("(оцінка)", "(estimate)")}</span></div>}
      </div>
      <div className="cv-leg"><span><i style={{ background: "var(--c2)" }} />{tr("Втрати особового складу (Генштаб ЗСУ)", "Personnel losses (Ukraine’s General Staff)")}</span><span><i className="ln" />{tr("Набір контрактників — оцінка (середнє за місяць)", "Contract recruitment — estimate (monthly average)")}</span><span><i className="ln dash" />{tr("Заява рф (Медведєв)", "russia’s claim (Medvedev)")}</span></div>
      <svg className="cv-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={tr("Набір і втрати за місяцями: ", "Recruitment and losses by month: ") + all.map((m) => lab(m) + tr(" втрати ", " losses ") + (L[m] ?? "—") + tr(", набір ", ", recruited ") + (rec[m] != null ? Math.round(rec[m]) : "—")).join("; ")}>
        <line className="cv-base" x1={ml} x2={W - mr} y1={mt + ih} y2={mt + ih} />
        <Grid ymax={ymax} y={y} ml={ml} W={W} mr={mr} dx={6} label={(v) => (v ? f(Math.round(v / 1000)) + (lang === "en" ? "k" : " тис.") : "0")} />
        {all.map((m, i) => {
          const cx = ml + bw * (i + 0.5), v = L[m];
          return (
            <g className="cv-b" tabIndex={0} key={m}>
              <title>{`${lab(m)} ${m.slice(0, 4)}: ${tr("втрати за Генштабом", "losses per General Staff")} ${v != null ? f(v) : "—"}; ${tr("набір (оцінка)", "recruited (estimate)")} ${rec[m] != null ? "≈" + k(rec[m]) + (recP[m].derived ? tr(" (розраховано)", " (derived)") : "") : tr("немає даних", "no data")}${cl[m] != null ? tr("; заява рф ≈", "; russia’s claim ≈") + k(cl[m]) : ""}`}</title>
              <rect x={(cx - bw / 2).toFixed(1)} y={mt} width={bw.toFixed(1)} height={ih} fill="transparent" />
              {v != null && <path d={`M${(cx - g / 2).toFixed(1)} ${mt + ih}V${(y(v) + 3).toFixed(1)}q0 -3 3 -3h${(g - 6).toFixed(1)}q3 0 3 3V${mt + ih}z`} fill="var(--c2)" fillOpacity=".85" />}
              <text className="cv-x" x={cx} y={H - 6} textAnchor="middle">{lab(m)}</text>
            </g>
          );
        })}
        {step(cl, "rc-cl")}{step(rec, "rc-rec")}
      </svg>
      <details className="cv-tbl"><summary>{tr("Таблиця і джерела", "Table and sources")}</summary><table>
        <thead><tr><th>{tr("Місяць", "Month")}</th><th className="n">{tr("Втрати (Генштаб)", "Losses (General Staff)")}</th><th className="n">{tr("Набір (оцінка)", "Recruited (estimate)")}</th><th className="n">{tr("Заява рф", "russia’s claim")}</th></tr></thead>
        <tbody>{all.map((m) => <tr key={m}><td>{lab(m)} {m.slice(0, 4)}</td><td className="n">{L[m] != null ? f(L[m]) : "—"}</td><td className="n">{rec[m] != null ? "≈" + k(rec[m]) : "—"}</td><td className="n">{cl[m] != null ? "≈" + k(cl[m]) : "—"}</td></tr>)}</tbody>
      </table><ul className="rc-src">{srcs.map(([s, u], i) => <li key={i}>{u ? <A href={u}>{s}</A> : s}</li>)}</ul></details>
      <p className="cv-src">{C.note || ""}</p>
    </div></section>
  );
}

/* ---------- price of a kilometre: GS totals + losses timeline, DeepState area from maps.json ---------- */
type LandCfg = { baseline: { km2: number; url: string; source: string }; anchor: { date: string; totals: Record<string, number>; url: string; source: string } };
export type MapsData = {
  areas: Record<string, number>;
  sources: Record<"deepstate" | "isw" | "divgen", { url: string; asOfLabel: string; note: string }>;
  layers: Record<string, number[][][][]>;
  base: { ua?: boolean; c: number[][][][] }[];
  cities: { n: string; lat: number; lng: number }[];
  events: { id: string | number; d: string; t: string; lat: number; lng: number; ds: string; isw: string; [k: string]: unknown }[];
  method?: string;
};
export function LandCost() {
  const { LATEST, lang, t: T } = useApp();
  const t = T.lcost;
  const lc = useJson<LandCfg>("/landcost.json"), mp = useJson<MapsData>("/maps/maps.json");
  const wrap = (x: React.ReactNode) => <section className="tlwrap" id="landcost"><div className="tl-head"><h2>{t.title}</h2><p>{t.sub}</p></div><div>{x}</div></section>;
  if (lc.err || mp.err) return wrap(<p className="map-src">{t.err}</p>);
  if (!lc.data || !mp.data) return wrap(<p className="map-src">{t.loading}</p>);
  const C = lc.data, M = mp.data, Ar = M.areas || {}, base = C.baseline.km2, en = lang === "en", B = LATEST;
  const ser = ((B.losses && B.losses.series) || []).filter((e) => e && e.ru && e.date > C.anchor.date);
  const tot = (k: string) => { const a = C.anchor.totals[k]; if (a == null) return null; return a + ser.reduce((s, e) => s + (num(e.ru![k]) || 0), 0); };
  const gs = B.losses && B.losses.gsTotal, pers = gs ? num(gs.personnel) : null;
  const net = Ar.ds_occ - base, netI = Ar.isw - base;
  if (!(net > 0)) return wrap(<p className="map-src">{t.err}</p>);
  const f = (n: number) => fmt(n, lang);
  const f1 = (v: number) => (v >= 100 ? f(Math.round(v)) : Number(v).toLocaleString(en ? "en-GB" : "uk-UA", { maximumFractionDigits: 1, minimumFractionDigits: 1 }));
  const add = (a: number | null, b: number | null) => (a == null || b == null ? null : a + b);
  const tiles: [string, number | null][] = [[t.tPers, pers], [t.tArmor, add(tot("tanks"), tot("armoured"))], [t.tArt, add(tot("artillery"), tot("mlrs"))], [t.tAuto, tot("auto")]];
  const ds = M.sources.deepstate, isw = M.sources.isw;
  return wrap(
    <div className="tlwrap">
      <p className="ls-caveat">{t.caveat}</p>
      <div className="tiles">{tiles.map(([l, v]) => <div className="tile" key={l}><small>{l}</small><b>{v == null ? "—" : f1(v / net)}</b><span>{v == null ? "" : t.tot(f(v), f(net))}</span></div>)}</div>
      <section className="panel">
        <p className="sub" style={{ margin: 0 }}>{t.area(f(Ar.ds_occ), "DeepState", ds.asOfLabel, f(base), f(net))}</p>
        {netI > 0 && pers != null && <p className="sub" style={{ margin: 0 }}>{t.alt("ISW", f(netI), f1(pers / netI))}</p>}
        <details className="method"><summary>{t.method}</summary>
          <p>{t.methodText(C.anchor.date.split("-").reverse().join("."))}</p>
          <p>{t.srcs}: {(gs && gs.source) || ""}{gs && gs.date ? " (" + shortD(gs.date) + ")" : ""}; <A href={C.anchor.url}>{C.anchor.source}</A>; <A href={ds.url}>DeepState</A> ({ds.asOfLabel}), <A href={isw.url}>ISW</A> ({isw.asOfLabel}); <A href={C.baseline.url}>{C.baseline.source}</A>.</p>
        </details>
      </section>
    </div>
  );
}

/* ---------- tiles ---------- */
export function Tiles() {
  const { D, t, lang } = useApp();
  const Ad = D.airDefense || {}, F = D.front || {};
  const pct = Ad.launched ? Math.round(((Ad.intercepted || 0) / Ad.launched) * 100) : null;
  const tiles = [
    { l: t.tLaunched, v: Ad.launched, s: Ad.period },
    { l: t.tIntercepted, v: Ad.intercepted, s: pct != null ? t.ofLaunched(pct) : "" },
    { l: t.tHits, v: Ad.hitLocations, s: Ad.debrisLocations ? t.debris(Ad.debrisLocations) : "" },
    { l: t.tClashes, v: F.clashesTotal, s: F.period },
  ];
  return <div className="tiles">{tiles.map((x) => <div className="tile" key={x.l}><small>{x.l}</small><b>{x.v == null ? "—" : fmt(x.v, lang)}</b><span>{x.s || ""}</span></div>)}</div>;
}

