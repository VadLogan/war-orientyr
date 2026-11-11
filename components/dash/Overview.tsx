"use client";
// The dashboard's first screen: the day in numbers, one chart slot, the two analytics (price of a kilometre, strike potential)
// and every other panel as a card with a mini chart. Phones show one section at a time (the switch on top);
// wider screens show everything. Each block's `data-s` lists its phone sections, "d" = shown on wider screens.
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LossRow, TimelineEntry } from "@/types/digest";
import { dayN, dirCol, dirOrder, fmt, loc, num, shortD, TL } from "@/lib/text";
import { href, tgHref } from "@/lib/routes";
import { flags } from "@/components/Flag";
import { useApp } from "../ctx";
import { useJson, useSticky } from "./hooks";
import { atkMix, money, pick, useLandCost, type Prices } from "./Panels";
import { PotentialCard, Spark, usePotential } from "./Potential";
import LineChart, { Legend, type Ser } from "./LineChart";
import { RangeSeg, rangeStart } from "./Timeline";
import type { Analytics } from "@/lib/data";

export type Sec = "over" | "an" | "air" | "front" | "loss";
/** a panel the sheet can open: its hash id, short title and the component */
export type PanelItem = { id: string; title: string; node: ReactNode };

/** Open a panel in the sheet: the hash is the panel's id, so the link can be shared and Back closes it. */
export const openPanel = (id: string) => { location.hash = id; };

/** Phone layout (the site's phone breakpoint), measured after mount. */
function useNarrow() {
  const [n, setN] = useState(false);
  useEffect(() => {
    const m = matchMedia("(max-width:600px)"), on = () => setN(m.matches);
    on(); m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return n;
}

const Delta = ({ d, good }: { d: number | null; good?: "up" | "dn" }) => {
  const { lang } = useApp();
  if (d == null) return <span className="dz-d" />; // keeps grid cells in place
  // red = more of what russia does to Ukraine; green = less of it (or more shot down)
  const cls = d === 0 ? "" : (d > 0) === (good === "up") ? "dn" : "up";
  return <span className={"dz-d " + cls}>{d > 0 ? "▲ +" : d < 0 ? "▼ −" : "= "}{fmt(Math.abs(d), lang)}</span>;
};

/** Number tile; a click opens its panel. */
function Kpi({ s, l, v, d, note, sp, col = "var(--s1)", to }: { s: string; l: ReactNode; v: ReactNode; d?: ReactNode; note?: ReactNode; sp?: (number | null)[]; col?: string; to: string }) {
  return (
    <button type="button" className="dz-k" data-s={s} onClick={() => openPanel(to)}>
      <small>{l}</small>
      <span className="dz-kv"><b>{v}</b>{d}</span>
      <span className="dz-kn"><span>{note}</span>{sp && sp.length > 1 && <Spark v={sp} color={col} h={24} />}</span>
    </button>
  );
}

/** Card for a panel outside the first screen: title, its key number, a mini chart. */
function Card({ s, t, v, n, sp, to, href: h }: { s: string; t: string; v: ReactNode; n?: ReactNode; sp?: ReactNode; to?: string; href?: string }) {
  const body = <><small><span>{t}</span><span aria-hidden="true">→</span></small><span className="dz-cv"><b>{v}</b>{sp}</span>{n && <span className="dz-cn">{n}</span>}</>;
  return h ? <a className="dz-card" data-s={s} href={h}>{body}</a> : <button type="button" className="dz-card" data-s={s} onClick={() => openPanel(to!)}>{body}</button>;
}

type Metric = "drones" | "pct" | "clashes" | "dirs" | "losses";
const BY_SEC: Record<string, Metric[]> = { over: ["drones"], air: ["drones", "pct"], front: ["clashes", "dirs"], loss: ["losses"] };

/** The one chart slot: the timeline's metrics and the losses, as tabs (a phone section offers only its own). */
function Trend({ sec, narrow }: { sec: Sec; narrow: boolean }) {
  const { t, lang, LATEST, D } = useApp();
  const tr = pick(lang);
  const all: Metric[] = narrow ? BY_SEC[sec] || ["drones"] : ["drones", "pct", "clashes", "dirs", "losses"];
  const [m0, setM] = useSticky<Metric>("dzMetric", "drones");
  const [range, setRange] = useSticky("dzRange", "30");
  const m = all.includes(m0) ? m0 : all[0];
  const L: Record<Metric, string> = { drones: t.mDrones, pct: t.mPct, clashes: t.mClashes, dirs: t.mDirs, losses: tr("Втрати", "Losses", "Verluste", "Pertes") };
  const g = (v: unknown) => num(v), end = dayN(LATEST.date), h = narrow ? 170 : 200;
  const dec = (v: number) => String(v).replace(".", lang === "en" ? "." : ",");
  let chart: ReactNode;
  if (m === "losses") {
    const rows0 = ((LATEST.losses?.series || []) as LossRow[]).filter((e) => e && /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a, b) => (a.date < b.date ? -1 : 1));
    const ser: Ser<LossRow>[] = [{ name: t.lsRuName, color: "var(--s1)", get: (e) => num(e.ru && e.ru.personnel), src: "ru" }, { name: t.lsUaName, color: "var(--s2)", get: (e) => num(e.ua && e.ua.personnel), src: "ua" }];
    const start = rangeStart(rows0, range, end), rows = rows0.filter((e) => { const n = dayN(e.date); return n >= start && n <= end && ser.some((s) => s.get(e) != null); });
    chart = <><Legend ser={ser} bars /><LineChart key={"l" + range + D.date} rows={rows} ser={ser} start={start} end={end} aria={L.losses} bars h={h} label={(e) => shortD(e.date)}
      srcOf={(e, s) => (e.src && e.src[s.src]) || ""} fmtV={(s, v) => (v == null ? "—" : (s.src === "ua" ? "≈ " : "") + fmt(v, lang))} /></>;
  } else {
    const rows0 = TL(LATEST), order = dirOrder(rows0);
    const ser: Ser<TimelineEntry>[] = m === "drones" ? [{ name: t.sLaunched, color: "var(--s2)", get: (e) => g(e.launched), src: "air" }, { name: t.sIntercepted, color: "var(--s1)", get: (e) => g(e.intercepted), src: "air" }]
      : m === "pct" ? [{ name: t.sPct, color: "var(--s1)", pct: true, get: (e) => { const l = g(e.launched), i = g(e.intercepted); return l && i != null ? Math.round((i / l) * 1000) / 10 : null; }, src: "air" }]
      : m === "clashes" ? [{ name: t.sClashes, color: "var(--s1)", get: (e) => g(e.clashes), src: "front" }]
      : order.slice(0, 5).map((k) => ({ name: k, color: dirCol(order, k), get: (e: TimelineEntry) => (e.directions ? g(e.directions[k]) : null), src: "front" }));
    const start = rangeStart(rows0, range, end), rows = rows0.filter((e) => { const n = dayN(e.date); return n >= start && n <= end && ser.some((s) => s.get(e) != null); });
    chart = <><Legend ser={ser} bars={m === "drones"} /><LineChart key={m + range + D.date} rows={rows} ser={ser} start={start} end={end} aria={L[m]} bars={m === "drones"} h={h}
      label={(e) => shortD(e.date) + (e.night && (m === "drones" || m === "pct") ? ` · ${t.night} ${e.night}` : "")}
      extra={m === "drones" ? (e) => { const l = g(e.launched), i = g(e.intercepted); return !l || i == null ? null : [dec(Math.round((i / l) * 1000) / 10) + "%", t.sPctShort]; } : null}
      srcOf={(e, s) => (e.src && e.src[s.src]) || ""} fmtV={(s, v) => (v == null ? "—" : s.pct ? dec(v) + "%" : fmt(v, lang))} /></>;
  }
  return (
    <section className="dz-box dz-trend" data-s="over air front loss d" aria-label={tr("Динаміка", "Trends", "Verlauf", "Évolution")}>
      <div className="dz-h">
        <h2>{tr("Динаміка", "Trends", "Verlauf", "Évolution")}</h2>
        {all.length > 1 && <div className="seg dz-seg" role="group" aria-label={t.metric}>{all.map((k) => <button type="button" key={k} aria-pressed={m === k} onClick={() => setM(k)}>{L[k]}</button>)}</div>}
        <RangeSeg value={range} set={setRange} ranges={["7", "30", "90"]} />
        <button type="button" className="linkbtn dz-go" onClick={() => openPanel(m === "losses" ? "losses" : m === "dirs" ? "dirs" : "timeline")}>{t.table} →</button>
      </div>
      {chart}
    </section>
  );
}

/** Attacks by direction on the issue's day, with the change from the day before. */
function DirBars() {
  const { t, lang, D, LATEST } = useApp();
  const tr = pick(lang);
  const F = D.front || {}, all = TL(LATEST), order = dirOrder(all);
  const dirs = (F.directions || []).slice().sort((a, b) => b.attacks - a.attacks);
  const PV = all.filter((e) => e.date < D.date && e.directions).pop();
  if (!dirs.length) return null;
  const mx = Math.max(...dirs.map((d) => d.attacks));
  return (
    <section className="dz-box" data-s="front d" aria-label={t.pClashes}>
      <div className="dz-h"><h2>{t.pClashes}</h2><span className="dz-sub">{F.clashesTotal != null ? tr(`${fmt(F.clashesTotal, lang)} боєзіткнень`, `${fmt(F.clashesTotal, lang)} clashes`, `${fmt(F.clashesTotal, lang)} Gefechte`, `${fmt(F.clashesTotal, lang)} combats`) : ""}</span>
        <button type="button" className="linkbtn dz-go" onClick={() => openPanel("dirs")}>{tr("Лінії за 14 діб →", "14-day lines →", "Verlauf über 14 Tage →", "Courbes sur 14 jours →")}</button></div>
      <div className="dz-dirs">{dirs.map((d) => {
        const pv = PV?.directions ? num(PV.directions[d.name]) : null, x = pv != null ? d.attacks - pv : null;
        return <div key={d.name}><span><i style={{ background: dirCol(order, d.name) }} />{flags(d.name)}</span><span className="dz-bar"><i style={{ width: (d.attacks / mx) * 100 + "%" }} /></span><b>{d.attacks}</b><Delta d={x} /></div>;
      })}</div>
    </section>
  );
}

/** Price of a kilometre (the "Аналітика" frame): period switch, people per km², three equipment rates, the area behind it. */
function LandCostCard({ s, an }: { s: string; an?: Analytics | null }) {
  const { lang, t: T } = useApp();
  const tr = pick(lang), t = T.lcost;
  const L = useLandCost(), f = (n: number) => fmt(n, lang);
  const f1 = (v: number) => (v >= 100 ? f(Math.round(v)) : v.toLocaleString(loc(lang), { maximumFractionDigits: 1, minimumFractionDigits: 1 }));
  const P: [string, string][] = [["all", tr("з 24.02.2022", "since 24.02.2022", "seit 24.02.2022", "depuis le 24.02.2022")], ["30", T.r30], ["7", T.r7]];
  let body: ReactNode;
  if (L.st === "err") body = <p className="map-src">{t.err}</p>;
  else if (L.st === "load") {
    // first paint (and crawlers): the server's figures for the same period
    const k = an && (L.per === "all" ? an.kmAll : L.per === "30" ? an.km30 : L.per === "7" ? an.km7 : null);
    body = !k ? <p className="map-src">{t.loading}</p> : <>
      <div className="dz-big"><b>{f1(k.pk)}</b><span>{tr("осіб рф на 1 км² захопленої землі", "russian personnel per 1 km² seized", "russische Soldaten pro 1 km² eroberter Fläche", "soldats russes par km² conquis")}</span>
        {L.per !== "all" && k.x != null && k.x >= 2 && <span className="dz-x">{tr(`×${Math.round(k.x)} до середнього з 2022`, `×${Math.round(k.x)} the average since 2022`, `×${Math.round(k.x)} gegenüber dem Schnitt seit 2022`, `×${Math.round(k.x)} la moyenne depuis 2022`)}</span>}</div>
      <div className="dz-mini3">{([[t.tArmor, k.armor], [t.tArt, k.art], [t.tAuto, k.auto]] as const).map(([l, v]) => <div key={l}><small>{flags(l)}</small><b>{v == null ? "—" : f1(v)}</b></div>)}</div>
    </>;
  }
  else if (L.st === "msg") body = <p className="map-src">{L.msg}</p>;
  else {
    const { pers, tot, net, avg } = L as Required<typeof L>;
    const add = (a: number | null, b: number | null) => (a == null || b == null ? null : a + b);
    const pk = pers != null ? pers / net : null, x = L.per !== "all" && pk != null && avg ? pk / avg : null;
    const rates: [string, number | null][] = [[t.tArmor, add(tot("tanks"), tot("armoured"))], [t.tArt, add(tot("artillery"), tot("mlrs"))], [t.tAuto, tot("auto")]];
    body = <>
      <div className="dz-big"><b>{pk != null ? f1(pk) : "—"}</b><span>{tr("осіб рф на 1 км² захопленої землі", "russian personnel per 1 km² seized", "russische Soldaten pro 1 km² eroberter Fläche", "soldats russes par km² conquis")}</span>
        {x != null && x >= 2 && <span className="dz-x">{tr(`×${Math.round(x)} до середнього з 2022`, `×${Math.round(x)} the average since 2022`, `×${Math.round(x)} gegenüber dem Schnitt seit 2022`, `×${Math.round(x)} la moyenne depuis 2022`)}</span>}</div>
      <div className="dz-mini3">{rates.map(([l, v]) => <div key={l}><small>{flags(l)}</small><b>{v == null ? "—" : f1(v / net)}</b></div>)}</div>
      <p className="dz-note">{L.line}</p>
    </>;
  }
  return (
    <section className="dz-box dz-an" data-s={s} aria-labelledby="dz-lc">
      <div className="dz-h"><span className="dz-badge">{tr("Аналітика", "Analysis", "Analyse", "Analyse")}</span><h2 id="dz-lc">{tr("Ціна кілометра", "The price of a kilometre", "Der Preis eines Kilometers", "Le prix d’un kilomètre")}</h2>
        <button type="button" className="linkbtn dz-go" onClick={() => openPanel("landcost")}>{tr("Методика й інший період →", "Method, other periods →", "Methode, andere Zeiträume →", "Méthode, autres périodes →")}</button></div>
      <div className="seg dz-seg" role="group" aria-label={tr("Період", "Period", "Zeitraum", "Période")}>
        {P.map(([k, l]) => <button type="button" key={k} aria-pressed={L.per === k} onClick={() => L.setPer(k)}>{l}</button>)}
      </div>
      {body}
    </section>
  );
}

/** Phone overview: both analytics as two small cards right under the headline; a tap opens the "Аналітика" section. */
function AnTeasers({ go, an }: { go: () => void; an?: Analytics | null }) {
  const { lang } = useApp();
  const tr = pick(lang), f = (n: number) => fmt(Math.round(n), lang);
  const L = useLandCost("30"), X = usePotential("dr");
  const pk = L.st === "ok" && L.pers != null ? L.pers / L.net! : an?.km30?.pk ?? null;
  const days = L.S && L.E ? dayN(L.E) - dayN(L.S) : an?.km30?.span ?? null;
  const avg = L.avg ?? an?.kmAll?.pk, share = X.share ?? an?.pot?.share;
  return (
    <div className="dz-teasers" data-s="over">
      <button type="button" className="dz-tz" onClick={go}><span className="dz-badge">{tr("Аналітика", "Analysis", "Analyse", "Analyse")}</span>
        <span className="t">{tr("Ціна кілометра", "Price of a kilometre", "Preis eines Kilometers", "Prix d’un kilomètre")}</span>
        <b>{pk != null ? f(pk) + tr(" /км²", " /km²", " /km²", " /km²") : "…"}</b>
        <span className="n">{days ? tr(`осіб рф за ${days} дн.`, `russian personnel, ${days} days`, `russ. Soldaten, ${days} Tage`, `soldats russes, ${days} jours`) : ""}{avg ? tr(`; з 2022 — ${avg.toLocaleString(loc(lang), { maximumFractionDigits: 1 })}`, `; since 2022: ${avg.toLocaleString(loc(lang), { maximumFractionDigits: 1 })}`, `; seit 2022: ${avg.toLocaleString(loc(lang), { maximumFractionDigits: 1 })}`, ` ; depuis 2022 : ${avg.toLocaleString(loc(lang), { maximumFractionDigits: 1 })}`) : ""}</span></button>
      <button type="button" className="dz-tz" onClick={go}><span className="dz-badge">{tr("Аналітика", "Analysis", "Analyse", "Analyse")}</span>
        <span className="t">{tr("Ударний потенціал", "Strike potential", "Angriffspotenzial", "Potentiel de frappe")}</span>
        <b>{share != null ? share + "%" : "…"}</b>
        <span className="n">{tr("дронів запущено від виробленого", "of drone output launched", "der Drohnenproduktion gestartet", "de la production de drones lancée")}</span></button>
    </div>
  );
}

const SEC_L = (tr: ReturnType<typeof pick>): [Sec, string][] => [["over", tr("Огляд", "Overview", "Überblick", "Aperçu")], ["an", tr("Аналітика", "Analysis", "Analyse", "Analyse")],
  ["air", tr("Повітря", "Air", "Luft", "Air")], ["front", tr("Фронт", "Front", "Front", "Front")], ["loss", tr("Втрати", "Losses", "Verluste", "Pertes")]];

export default function Overview({ headline, mapsMini, strikesMini, an, summary }: { headline: { title?: string; item?: string } | null; mapsMini: ReactNode; strikesMini: ReactNode; an?: Analytics | null; summary?: ReactNode }) {
  const { t, lang, D, LATEST, smx } = useApp();
  const tr = pick(lang), f = (n: number) => fmt(n, lang);
  const narrow = useNarrow();
  const [sec, setSec0] = useSticky<Sec>("dzSec", "over");
  const top = useRef<HTMLDivElement>(null);
  const setSec = (s: Sec) => { setSec0(s); if (top.current && top.current.getBoundingClientRect().top < 0) top.current.scrollIntoView(); };
  const prices = useJson<Prices>("/prices.json").data;
  const rec = useJson<{ losses?: { m: string; n: number }[] }>("/recruit.json").data;
  const L30 = useLandCost("30");

  // the day against the day before (timeline entries up to the issue's date)
  const tl = TL(LATEST).filter((e) => e.date <= D.date), cur = tl.at(-1), prv = tl.at(-2), last14 = tl.slice(-14);
  const Ad = D.airDefense || {}, F = D.front || {};
  const dif = (a?: number | null, b?: number | null) => (a != null && b != null ? a - b : null);
  const pct = Ad.launched ? Math.round(((Ad.intercepted || 0) / Ad.launched) * 100) : null;
  const ser = ((LATEST.losses?.series || []) as LossRow[]).filter((e) => e.date <= D.date && e.ru);
  const lr = ser.find((e) => e.date === D.date), lp = ser.filter((e) => e.date < D.date).pop();
  const uaRow = ser.filter((e) => e.ua && e.ua.personnel != null).pop();
  const gs = LATEST.losses?.gsTotal;
  const topDir = (F.directions || []).slice().sort((a, b) => b.attacks - a.attacks)[0];
  const fire = (k: "air" | "kab" | "kamikaze" | "shell") => last14.map((e) => e.fire?.[k] ?? null);
  const fv = (k: "air" | "kab" | "kamikaze" | "shell") => { const v = fire(k); return [v.at(-1) ?? null, v.at(-1) != null && v.at(-2) != null ? v.at(-1)! - v.at(-2)! : null] as const; };
  const pk30 = L30.st === "ok" && L30.pers != null ? L30.pers / L30.net! : an?.km30?.pk ?? null;

  // the night's cost, as on the Attack panel
  const cost = (e: { mix?: { type: string; n: number }[]; launched?: number }) => {
    const m = prices && atkMix(e); if (!m) return null;
    let lo = 0, hi = 0; m.mix.forEach((x) => { const p = prices!.types[x.type]; if (p) { lo += x.n * p.low; hi += x.n * p.high; } });
    return { lo, hi };
  };
  const cNow = cost(Array.isArray(Ad.mix) ? Ad : { launched: Ad.launched });
  const civ = (D.civilianStats?.months || []).filter((r) => r.killed != null && r.injured != null).slice(-7);
  const civL = civ.at(-1);
  const recL = (rec?.losses || []).slice(-7);

  const FT: Record<string, string> = { air: tr("Авіаудари", "Airstrikes", "Luftangriffe", "Frappes aériennes"), kab: tr("КАБи", "Guided bombs", "Gleitbomben", "Bombes guidées"),
    kamikaze: tr("Дрони-камікадзе", "Kamikaze drones", "Kamikaze-Drohnen", "Drones kamikazes"), shell: tr("Обстріли", "Shelling", "Beschuss", "Bombardements") };

  return (
    <div className="dz" data-sec={sec} ref={top}>
      <div className="dz-secs" role="tablist" aria-label={tr("Розділи дашборду", "Dashboard sections", "Bereiche des Dashboards", "Sections du tableau de bord")}>
        {SEC_L(tr).map(([k, l]) => <button type="button" role="tab" key={k} aria-selected={sec === k} className={k === "an" ? "an" : undefined} onClick={() => setSec(k)}>{l}</button>)}
      </div>

      {headline?.title && <a className="dz-hl" data-s="over d" href={href(lang, "digest", D.date, LATEST.date) + (headline.item ? "#it-" + headline.item : "")}>
        <span className="k">{tr("Головне", "Top story", "Das Wichtigste", "À la une")}</span><span className="t">{flags(headline.title)}</span><span className="go">{tr("Дайджест →", "Digest →", "Digest →", "Digest →")}</span></a>}

      <AnTeasers go={() => setSec("an")} an={an} />

      <div className="dz-kpis">
        <Kpi s="over air d" to="timeline" l={t.tLaunched} v={Ad.launched != null ? f(Ad.launched) : "—"} d={<Delta d={dif(cur?.launched, prv?.launched)} />} note={cur?.night ? t.night + " " + cur.night : ""} sp={last14.map((e) => num(e.launched))} col="var(--s2)" />
        <Kpi s="over air d" to="timeline" l={t.tIntercepted} v={Ad.intercepted != null ? f(Ad.intercepted) : "—"} d={pct != null && <span className="dz-d dn">{pct}%</span>} note={tr("Повітряні сили", "Air Force", "Luftwaffe", "Armée de l’air")} sp={last14.map((e) => num(e.intercepted))} />
        <Kpi s="air d" to="timeline" l={t.tHits} v={Ad.hitLocations != null ? f(Ad.hitLocations) : "—"} d={<Delta d={dif(cur?.hitLocations, prv?.hitLocations)} />} note={Ad.debrisLocations ? t.debris(Ad.debrisLocations) : ""} sp={last14.map((e) => num(e.hitLocations))} col="var(--s2)" />
        <Kpi s="air" to="atk" l={tr("Вартість атаки", "Cost of the attack", "Kosten des Angriffs", "Coût de l’attaque")} v={cNow ? <span className="sm">{money(cNow.lo, lang)}–{money(cNow.hi, lang)}</span> : "—"} note={tr("оцінка", "estimate", "Schätzung", "estimation")} />
        <Kpi s="over front d" to="dirs" l={t.tClashes} v={F.clashesTotal != null ? f(F.clashesTotal) : "—"} d={<Delta d={dif(F.clashesTotal, prv?.clashes)} />} note={tr("Генштаб ЗСУ", "General Staff", "Generalstab", "état-major")} sp={last14.map((e) => num(e.clashes))} />
        <Kpi s="front" to="dirs" l={tr("Найбільше атак", "Most attacks", "Die meisten Angriffe", "Le plus d’attaques")} v={topDir ? <span className="sm">{flags(topDir.name)}</span> : "—"} note={topDir ? String(topDir.attacks) : ""} />
        <Kpi s="front" to="fireP" l={FT.kab} v={fv("kab")[0] != null ? f(fv("kab")[0]!) : "—"} d={<Delta d={fv("kab")[1]} />} sp={fire("kab")} />
        <Kpi s="front" to="fireP" l={FT.shell} v={fv("shell")[0] != null ? f(fv("shell")[0]!) : "—"} d={<Delta d={fv("shell")[1]} />} sp={fire("shell")} />
        <Kpi s="over loss d" to="losses" l={t.lsRuDay} v={lr?.ru?.personnel != null ? f(lr.ru.personnel) : "—"} d={<Delta d={dif(num(lr?.ru?.personnel), num(lp?.ru?.personnel))} good="up" />} note={tr("Генштаб ЗСУ", "General Staff", "Generalstab", "état-major")} sp={ser.slice(-14).map((e) => num(e.ru?.personnel))} />
        <Kpi s="loss" to="losses" l={flags(t.lsUaDay)} v={uaRow?.ua?.personnel != null ? "≈" + f(uaRow.ua.personnel) : "—"} note={uaRow ? shortD(uaRow.date) : ""} />
        <Kpi s="loss d" to="losses" l={t.lsRuTotal} v={gs?.personnel != null ? <span className="sm">{f(num(gs.personnel)!)}</span> : "—"} note={gs?.date ? shortD(gs.date) : ""} />
        <Kpi s="loss" to="landcost" l={tr("Ціна кілометра", "Price of a kilometre", "Preis eines Kilometers", "Prix d’un kilomètre")} v={pk30 != null ? f(Math.round(pk30)) : "—"} note={tr("осіб/км² за 30 днів", "personnel/km², 30 days", "Soldaten/km², 30 Tage", "soldats/km², 30 jours")} />
      </div>

      <div className="dz-main">
        <div className="dz-col">
          <Trend sec={sec} narrow={narrow} />
          <DirBars />
        </div>
        <div className="dz-col">
          <LandCostCard s="an d" an={an} />
          <PotentialCard s="an d" open={() => openPanel("potential")} ssr={an?.pots} />
        </div>
      </div>

      <div className="dz-more-h" data-s="d"><h2>{tr("Інші панелі", "More panels", "Weitere Bereiche", "Autres panneaux")}</h2><span>{tr("клік відкриває панель повністю", "a click opens the whole panel", "ein Klick öffnet den ganzen Bereich", "un clic ouvre le panneau complet")}</span></div>
      <div className="dz-more">
        <div className="dz-srv" data-s="over front d">{mapsMini}</div>
        <div className="dz-srv" data-s="over d">{strikesMini}</div>
        {/* new: /strikes/targets — a page of its own, so a plain link */}
        <a className="dz-card dz-new" data-s="over d" href={tgHref(lang)}>
          <small><span><span className="dz-badge">{t.nw.targets.k}</span> {t.stk.swTg}</span><span aria-hidden="true">→</span></small>
          <span className="dz-cn">{t.stk.swTgSub}</span>
        </a>
        <Card s="air d" to="atk" t={tr("Вартість нічної атаки", "Cost of the night attack", "Kosten des nächtlichen Angriffs", "Coût de l’attaque nocturne")} v={cNow ? money(cNow.lo, lang) + "–" + money(cNow.hi, lang) : "—"}
          n={tr("оцінка за цінами типів", "estimate from unit prices", "Schätzung nach Stückpreisen", "estimation selon les prix unitaires")} sp={<Spark v={last14.map((e) => { const c = cost(e); return c ? (c.lo + c.hi) / 2 : null; })} color="var(--c2)" />} />
        <Card s="air" t={tr("Ударний потенціал", "Strike potential", "Angriffspotenzial", "Potentiel de frappe")} to="potential" v="→" n={tr("виробництво, запуски, запас", "output, launches, reserve", "Produktion, Starts, Reserve", "production, lancements, réserve")} />
        {(["air", "kab", "kamikaze", "shell"] as const).map((k) => <Card key={k} s={k === "kab" ? "front d" : "front"} to="fireP" t={k === "kab" ? tr("Вогонь рф · КАБи", "russian fire · guided bombs", "russ. Feuer · Gleitbomben", "feu russe · bombes guidées") : FT[k]}
          v={fv(k)[0] != null ? f(fv(k)[0]!) : "—"} n={<Delta d={fv(k)[1]} />} sp={<Spark v={fire(k)} color="var(--s1)" />} />)}
        {civL && <Card s="loss d" to="civ" t={tr("Цивільні жертви (ООН)", "Civilian casualties (UN)", "Zivile Opfer (UN)", "Victimes civiles (ONU)")} v={tr(`${f(civL.killed!)} загиблих`, `${f(civL.killed!)} killed`, `${f(civL.killed!)} Getötete`, `${f(civL.killed!)} tués`)}
          n={tr(`ще ${f(civL.injured!)} поранених`, `${f(civL.injured!)} injured`, `${f(civL.injured!)} Verletzte`, `${f(civL.injured!)} blessés`)} sp={<Spark v={civ.map((r) => r.killed!)} stack={civ.map((r) => r.injured!)} color="var(--c2)" />} />}
        {recL.length > 0 && <Card s="loss d" to="rec" t={tr("Набір проти втрат", "Recruitment vs losses", "Rekrutierung und Verluste", "Recrutement et pertes")} v={f(recL.at(-1)!.n)}
          n={tr("втрати рф за місяць", "russian losses, month", "russ. Verluste, Monat", "pertes russes, mois")} sp={<Spark v={recL.map((r) => r.n)} color="var(--c2)" />} />}
        {smx && <Card s="an d" to="srcMx" t={tr("Джерела по днях", "Sources by day", "Quellen nach Tagen", "Sources par jour")} v={tr("Матриця", "Matrix", "Matrix", "Matrice")} n={tr("як читався кожен ресурс", "how each source was read", "wie jede Quelle gelesen wurde", "comment chaque source a été lue")} />}
      </div>
      {summary}
    </div>
  );
}
