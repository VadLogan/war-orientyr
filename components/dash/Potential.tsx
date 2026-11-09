"use client";
// russia's strike potential: production (estimates) vs launches, the reserve, three scenarios to a horizon.
// Data: /potential.json (hand-maintained) + LATEST.timeline; maths: lib/potential.ts.
import { Fragment } from "react";
import { fmt, niceMax } from "@/lib/text";
import { potential, type GroupId, type PotentialData, type Range, type Scenario } from "@/lib/potential";
import { useApp } from "../ctx";
import { useChartW, useJson, useSticky } from "./hooks";
import { flags } from "@/components/Flag";
import { A, Grid, MN, pick } from "./Panels";

const SCS: Scenario[] = ["pes", "real", "opt"];
const SC_COL: Record<Scenario, string> = { pes: "var(--unv)", real: "var(--ink)", opt: "var(--ok)" };
const mid = (r: Range) => (r.lo + r.hi) / 2;
/** per-model names for the estimates table: uk, en, de, fr */
const TYPES: Record<string, [string, string, string, string]> = {
  shahed: ["Герань-2 / Шахед", "Geran-2 / Shahed", "Geran-2 / Shahed", "Geran-2 / Shahed"],
  "shahed-jet": ["реактивні Герань-4/5", "jet Geran-4/5", "Strahl-Geran-4/5", "Geran-4/5 à réaction"],
  "iskander-m": ["Іскандер-М", "Iskander-M", "Iskander-M", "Iskander-M"],
  kinzhal: ["Кинджал", "Kinzhal", "Kinschal", "Kinjal"],
  kh101: ["Х-101", "Kh-101", "Ch-101", "Kh-101"],
  kalibr: ["Калібр", "Kalibr", "Kalibr", "Kalibr"],
  onyx: ["Онікс", "Oniks", "Onyx", "Oniks"],
  zircon: ["Циркон", "Zircon", "Zirkon", "Zircon"],
};

export function Potential() {
  const { D, LATEST, lang } = useApp();
  const W = useChartW();
  const { data: P, err } = useJson<PotentialData>("/potential.json");
  const [g, setG] = useSticky<GroupId>("potGroup", "dr");
  const [sc, setSc] = useSticky<Scenario>("potScen", "real");
  const tr = pick(lang), L = ["uk", "en", "de", "fr"].indexOf(lang);
  const head = <h2>{tr("Ударний потенціал росії — оцінка", "russia’s strike potential — an estimate", "russlands Angriffspotenzial – eine Schätzung", "Le potentiel de frappe de la russie – une estimation")}</h2>;
  const wrap = (x: React.ReactNode) => <section className="panel atk" id="potential">{head}<div>{x}</div></section>;
  if (err) return wrap(<p className="map-src">{tr("Не вдалося завантажити дані (potential.json).", "Could not load the data (potential.json).", "Die Daten konnten nicht geladen werden (potential.json).", "Impossible de charger les données (potential.json).")}</p>);
  if (!P) return wrap(<p className="map-src">{tr("Завантаження…", "Loading…", "Wird geladen…", "Chargement…")}</p>);

  const R = potential(P, LATEST.timeline ?? [], D.date)[g], grp = P.groups.find((x) => x.id === g)!;
  const f = (n: number) => fmt(Math.round(n), lang), rng = (r: Range) => (Math.round(r.lo) === Math.round(r.hi) ? f(r.lo) : f(r.lo) + "–" + f(r.hi));
  const mLab = (m: string, yr = false) => MN[lang][+m.slice(5, 7) - 1] + (yr ? " " + m.slice(0, 4) : "");
  const dLab = (d: string) => d.slice(8, 10) + "." + d.slice(5, 7) + "." + d.slice(0, 4);
  const pct = (a: number, b: number) => Math.round((a / b) * 100);
  const segG = <div className="seg" role="group" aria-label={tr("Група озброєння", "Weapon group", "Waffengruppe", "Groupe d’armes")}>{P.groups.map((x) => <button type="button" key={x.id} aria-pressed={g === x.id} onClick={() => setG(x.id)}>{flags(x.label)}</button>)}</div>;
  const src = <p className="cv-src">{flags(P.method)}</p>;
  if (!R.months.length) return wrap(<>{segG}<p className="map-src">{tr("На цю дату даних ще немає.", "No data for this date yet.", "Für dieses Datum gibt es noch keine Daten.", "Pas encore de données à cette date.")}</p>{src}</>);

  const now = R.now, lf = R.lastFull, ly = R.lastFullYearAgo;
  const share = now && lf?.launched != null ? pct(lf.launched, mid(now)) : null;
  const shareYa = R.yearAgo && ly?.launched != null ? pct(ly.launched, mid(R.yearAgo)) : null;
  const bal = now && lf?.launched != null ? mid(now) - lf.launched : null;
  const end = R.reserveEnd?.[sc] ?? null, endMid = end ? mid(end) : null;
  // "used up" only against a stock estimate; without one the reserve figures are a change since tracking began, signed
  const gone = !!R.stock && !!end && end.hi <= 0, sgn = (v: number) => (v >= 0 ? "+" : "−") + f(Math.abs(v)), rngS = (r: Range) => sgn(r.lo) + " … " + sgn(r.hi);
  // a stock-based reserve: a range that reaches 0 is "may run out", only a wholly negative one is "used up"
  const resB = (r: Range) => (r.hi <= 0 ? tr("вичерпано", "used up", "aufgebraucht", "épuisée") : r.lo <= 0 ? "0–" + f(r.hi) : "≈ " + f(mid(r)));
  const mayRun = tr("за цього темпу запас може вичерпатися", "the reserve may run out at this pace", "bei diesem Tempo kann die Reserve ausgehen", "à ce rythme la réserve peut s’épuiser");

  // ---- chart: months + forecast
  const rows = R.months, fc = R.forecast, n = rows.length + fc.length;
  const Hh = 230, ml = 48, mr = 8, mt = 14, mb = 24, iw = W - ml - mr, ih = Hh - mt - mb, bw = iw / n;
  const top = Math.max(1, ...rows.map((r) => Math.max(r.launched ?? 0, r.partial ? now?.hi ?? 0 : r.prod?.hi ?? 0)), ...fc.flatMap((x) => SCS.map((s) => x.prod[s])), R.plan ? R.plan.high : 0);
  const ymax = niceMax(top * 1.06), y = (v: number) => mt + ih - (Math.max(0, v) / ymax) * ih, cx = (i: number) => ml + bw * (i + 0.5);
  const band = rows.map((r, i) => ({ i, p: r.partial ? now : r.prod })).filter((b) => b.p) as { i: number; p: Range }[];
  const bandD = band.length ? band.map(({ i, p }, k) => `${k ? "L" : "M"}${(cx(i) - bw / 2).toFixed(1)},${y(p.hi).toFixed(1)} L${(cx(i) + bw / 2).toFixed(1)},${y(p.hi).toFixed(1)}`).join(" ")
    + " " + [...band].reverse().map(({ i, p }) => `L${(cx(i) + bw / 2).toFixed(1)},${y(p.lo).toFixed(1)} L${(cx(i) - bw / 2).toFixed(1)},${y(p.lo).toFixed(1)}`).join(" ") + " Z" : "";
  const x0 = rows.length - 1, line = (s: Scenario) => now ? `M${cx(x0).toFixed(1)},${y(mid(now)).toFixed(1)} ` + fc.map((p, k) => `L${cx(rows.length + k).toFixed(1)},${y(p.prod[s]).toFixed(1)}`).join(" ") : "";
  const allM = [...rows.map((r) => r.month), ...fc.map((x) => x.month)];
  const scName = (s: Scenario) => flags(P.scenarios[s].label);
  const lastF = fc.at(-1);

  return wrap(<div style={{ display: "grid", gap: 14 }}>
    {segG}
    {now ? <div className="atk-top"><b>≈ {f(mid(now))} {tr("/ міс.", "/ month", "/ Monat", "/ mois")}</b><span>
      {tr("виробляє росія зараз", "russia makes now", "stellt russland jetzt her", "produit la russie aujourd’hui")} ({rng(now)}{tr(", оцінки ГУР", ", HUR estimates", ", Schätzungen des HUR", ", estimations du HUR")})
      {lf?.launched != null && share != null && <> · {mLab(lf.month, true) + ": " + tr("запущено ", "", "", "") + f(lf.launched) + tr("", " launched", " gestartet", " lancés")} — {share}% {tr("виробленого", "of output", "der Produktion", "de la production")}{bal != null && (bal >= 0
        ? tr(", ≈" + f(bal) + " пішло в запас", ", ≈" + f(bal) + " went into the reserve", ", ≈" + f(bal) + " gingen in die Reserve", ", ≈" + f(bal) + " sont allés en réserve")
        : tr(", ≈" + f(-bal) + " взято із запасу", ", ≈" + f(-bal) + " taken from the reserve", ", ≈" + f(-bal) + " aus der Reserve genommen", ", ≈" + f(-bal) + " puisés dans la réserve"))}</>}
      {R.yearAgo && <>. {tr("Рік тому: виробляла ≈", "A year ago: it made ≈", "Vor einem Jahr: ≈", "Il y a un an : ≈")}{f(mid(R.yearAgo))}{ly?.launched != null ? tr(", запустила ", ", launched ", " hergestellt, ", " produits, ") + f(ly.launched) + tr("", "", " gestartet", " lancés") : tr("", "", " hergestellt", " produits")}.</>}
    </span></div>
      : <p className="map-src">{tr("Немає оцінки виробництва на цю дату — без балансу й прогнозу.", "No production estimate for this date — no balance or forecast.", "Für dieses Datum gibt es keine Produktionsschätzung – keine Bilanz und keine Prognose.", "Pas d’estimation de production à cette date – ni bilan ni prévision.")}</p>}

    <div className="tiles">
      <div className="tile"><small>{tr("Виробництво / міс.", "Output / month", "Produktion / Monat", "Production / mois")}</small><b>{now && R.yearAgo ? "×" + (mid(now) / mid(R.yearAgo)).toFixed(1) : now ? "≈ " + f(mid(now)) : "—"}</b>
        <span>{now && R.yearAgo ? f(mid(R.yearAgo)) + tr(" рік тому → ", " a year ago → ", " vor einem Jahr → ", " il y a un an → ") + f(mid(now)) + tr(" зараз", " now", " jetzt", " aujourd’hui") : tr("оцінки за рік тому немає", "no estimate for a year ago", "keine Schätzung von vor einem Jahr", "pas d’estimation il y a un an")}</span></div>
      <div className="tile"><small>{tr("Запуски, ", "Launches, ", "Starts, ", "Lancements, ") + (lf ? mLab(lf.month) : "—")}</small><b>{lf?.launched != null ? f(lf.launched) : "—"}</b>
        <span>{ly?.launched != null && lf?.launched != null ? mLab(ly.month, true) + ": " + f(ly.launched) + " (" + (lf.launched >= ly.launched ? "+" : "−") + Math.abs(pct(lf.launched, ly.launched) - 100) + "%)" : tr("за той самий місяць рік тому даних немає", "no figure for the same month a year ago", "keine Zahl für denselben Monat vor einem Jahr", "pas de chiffre pour le même mois il y a un an")}</span></div>
      <div className="tile"><small>{tr("Запускає з виробленого", "Launched of output", "Gestartet von der Produktion", "Lancé sur la production")}</small><b>{share != null ? share + "%" : "—"}</b>
        <span>{(shareYa != null ? tr("рік тому ", "a year ago ", "vor einem Jahr ", "il y a un an ") + shareYa + "% · " : "") + (share != null && share >= 100 ? tr("понад 100% — бере із запасу", "over 100% — drawing on the reserve", "über 100 % – greift auf die Reserve zurück", "plus de 100 % – elle puise dans la réserve") : tr("менше 100% — накопичує", "under 100% — stockpiling", "unter 100 % – legt Vorräte an", "moins de 100 % – elle stocke"))}</span></div>
      <div className="tile"><small>{R.stock ? tr("Запас зараз", "Reserve now", "Reserve jetzt", "Réserve aujourd’hui") : tr("Зміна запасу з ", "Reserve change since ", "Veränderung der Reserve seit ", "Variation de la réserve depuis ") + (R.reserveSince ? mLab(R.reserveSince, true) : "—")}</small>
        <b>{R.reserveNow ? (R.stock ? resB(R.reserveNow) : "≈ " + sgn(mid(R.reserveNow))) : "—"}</b>
        <span>{R.reserveNow ? (R.stock ? rng(R.reserveNow) : rngS(R.reserveNow)) + (R.stock ? tr(" · від оцінки ГУР на ", " · from HUR’s estimate of ", " · ab der HUR-Schätzung vom ", " · à partir de l’estimation du HUR du ") + dLab(R.stock.date) : "") : tr("немає оцінки виробництва", "no production estimate", "keine Produktionsschätzung", "pas d’estimation de production")}</span></div>
    </div>

    <div>
      <p className="atk-sub">{tr("Запуски на місяць (стовпчики) проти виробництва (смуга — діапазон оцінок) і прогноз виробництва за трьома сценаріями. Блідіші стовпчики — місячні підсумки з відкритих джерел, насичені — наш щоденний облік, пунктир — неповний місяць.",
        "Launches per month (bars) against output (band — the range of estimates) and the output forecast in three scenarios. Paler bars — monthly totals from open sources, solid — our daily count, dashed — an incomplete month.",
        "Starts pro Monat (Balken) gegen die Produktion (Band – Spanne der Schätzungen) und die Produktionsprognose in drei Szenarien. Blassere Balken – Monatssummen aus offenen Quellen, kräftige – unsere tägliche Zählung, gestrichelt – ein unvollständiger Monat.",
        "Lancements par mois (barres) face à la production (bande – fourchette des estimations) et prévision de production selon trois scénarios. Barres pâles – totaux mensuels de sources ouvertes, pleines – notre décompte quotidien, pointillés – mois incomplet.")}</p>
      <svg className="cv-svg" viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label={flags(grp.label) + ": " + rows.map((r) => mLab(r.month, true) + " " + (r.launched != null ? f(r.launched) : "—")).join("; ")}>
        <Grid ymax={ymax} y={y} ml={ml} W={W} mr={mr} dx={6} label={(v) => f(v)} />
        {fc.length > 0 && <><rect x={cx(rows.length) - bw / 2} y={mt} width={fc.length * bw} height={ih} fill="var(--track)" opacity=".45" />
          <text className="cv-x" x={cx(rows.length) - bw / 2 + 4} y={mt + 11}>{tr("прогноз", "forecast", "Prognose", "prévision")}</text></>}
        {bandD && <path d={bandD} fill="var(--c2)" fillOpacity=".18" stroke="var(--c2)" strokeOpacity=".7" />}
        {rows.map((r, i) => r.launched != null && (
          <rect key={r.month} x={(cx(i) - bw * 0.3).toFixed(1)} y={y(r.launched).toFixed(1)} width={(bw * 0.6).toFixed(1)} height={Math.max(1, mt + ih - y(r.launched)).toFixed(1)} rx={2}
            fill="var(--c1)" fillOpacity={r.partial ? ".2" : r.src === "hand" ? ".45" : "1"} stroke={r.partial ? "var(--c1)" : undefined} strokeDasharray={r.partial ? "3 2" : undefined}><title>{mLab(r.month, true) + ": " + f(r.launched) + (r.prod ? " · " + tr("виробництво ", "output ", "Produktion ", "production ") + rng(r.prod) : "")}</title></rect>
        ))}
        {fc.length > 0 && <line x1={cx(x0)} x2={cx(n - 1)} y1={y(fc[0].launched)} y2={y(fc[0].launched)} stroke="var(--c1)" strokeDasharray="5 4" />}
        {R.plan && <><line x1={ml} x2={W - mr} y1={y(((R.plan.low + R.plan.high) / 2))} y2={y(((R.plan.low + R.plan.high) / 2))} stroke="var(--muted)" strokeDasharray="1 4" />
          <text className="cv-x" x={ml + 4} y={y(((R.plan.low + R.plan.high) / 2)) - 4}>{tr("план", "plan", "Plan", "plan")} ({f(((R.plan.low + R.plan.high) / 2))})</text></>}
        {fc.length > 0 && SCS.map((s) => <path key={s} d={line(s)} fill="none" stroke={SC_COL[s]} strokeWidth={s === sc ? 3 : 1.5} strokeOpacity={s === sc ? 1 : 0.55} />)}
        {lastF && SCS.map((s) => <text key={s} className="cv-k" x={W - mr - 2} y={y(lastF.prod[s]) - 5} textAnchor="end" style={{ fill: SC_COL[s] }}>{f(lastF.prod[s])}</text>)}
        <line className="cv-base" x1={ml} x2={W - mr} y1={mt + ih} y2={mt + ih} />
        {allM.map((m, i) => (i % 3 === 0 || i === x0) && <text key={m} className="cv-x" x={cx(i)} y={Hh - 6} textAnchor="middle">{mLab(m) + (m.endsWith("-01") || i === 0 ? " " + m.slice(2, 4) : "")}</text>)}
      </svg>
      <div className="cv-leg">
        <span><i style={{ background: "var(--c1)", opacity: 0.45 }} />{tr("запущено (підсумки джерел)", "launched (source totals)", "gestartet (Quellensummen)", "lancés (totaux des sources)")}</span>
        <span><i style={{ background: "var(--c1)" }} />{tr("запущено (наш облік)", "launched (our count)", "gestartet (unsere Zählung)", "lancés (notre décompte)")}</span>
        <span><i style={{ background: "var(--c2)", opacity: 0.35 }} />{tr("виробництво, діапазон", "output, range", "Produktion, Spanne", "production, fourchette")}</span>
        {fc.length > 0 && <span><i style={{ background: "none", borderTop: "2px dashed var(--c1)", borderRadius: 0, height: 0 }} />{tr("темп запусків у прогнозі", "launch rate in the forecast", "Startrate in der Prognose", "rythme de lancement prévu")}</span>}
        {fc.length > 0 && SCS.map((s) => <span key={s}><i style={{ background: SC_COL[s] }} />{scName(s)}</span>)}
      </div>
    </div>

    {R.reserveEnd && lastF && <>
      <div>
        <div className="seg" role="group" aria-label={tr("Сценарій", "Scenario", "Szenario", "Scénario")}>{SCS.map((s) => <button type="button" key={s} aria-pressed={sc === s} onClick={() => setSc(s)}>{scName(s)}</button>)}</div>
        <p className="atk-sub">{flags(P.scenarios[sc].note)}</p>
      </div>
      <div className="tiles">
        <div className="tile"><small>{(R.stock ? tr("Запас, ", "Reserve, ", "Reserve, ", "Réserve, ") : tr("Зміна запасу до ", "Reserve change by ", "Veränderung der Reserve bis ", "Variation de la réserve d’ici ")) + mLab(lastF.month, true)}</small>
          <b style={{ color: SC_COL[sc] }}>{R.stock ? resB(end!) : "≈ " + sgn(endMid!)}</b>
          <span>{gone ? tr("за цього темпу запусків запасу не вистачить", "the reserve would not last at this launch rate", "bei dieser Startrate reicht die Reserve nicht", "la réserve ne tiendrait pas à ce rythme")
            : R.stock ? (end!.lo <= 0 ? mayRun : rng(end!)) : rngS(end!) + (tr(" · від невідомого запасу", " · against an unknown reserve", " · gegenüber einer unbekannten Reserve", " · par rapport à une réserve inconnue"))}</span></div>
        <div className="tile"><small>{tr("Ночей за нинішнього темпу", "Nights at today’s pace", "Nächte beim heutigen Tempo", "Nuits au rythme actuel")}</small><b>{R.stock && R.perNight > 0 && endMid! > 0 ? f(endMid! / R.perNight) : "—"}</b>
          <span>≈ {f(R.perNight)} {flags(grp.unit)} {tr("за ніч", "a night", "pro Nacht", "par nuit")}</span></div>
        <div className="tile"><small>{tr("Атак як найбільша", "Attacks like the biggest", "Angriffe wie der größte", "Attaques comme la plus grande")}</small><b>{R.stock && R.maxNight > 0 && endMid! > 0 ? f(Math.floor(endMid! / R.maxNight)) : "—"}</b>
          <span>{tr("найбільша ніч у нашому обліку: ", "biggest night in our count: ", "größte Nacht in unserer Zählung: ", "plus grande nuit de notre décompte : ") + f(R.maxNight) + " " + flags(grp.unit)}</span></div>
        <div className="tile"><small>{tr("Виробництво, ", "Output, ", "Produktion, ", "Production, ") + mLab(lastF.month, true)}</small><b>≈ {f(lastF.prod[sc])}</b>
          <span>{tr("/ міс. · зараз ≈ ", "/ month · now ≈ ", "/ Monat · jetzt ≈ ", "/ mois · aujourd’hui ≈ ") + (now ? f(mid(now)) : "—")}</span></div>
      </div>
    </>}

    <details className="cv-tbl"><summary>{tr("Оцінки, на яких це тримається", "The estimates behind it", "Die Schätzungen dahinter", "Les estimations derrière")}</summary><table>
      <thead><tr><th>{tr("Що", "What", "Was", "Quoi")}</th><th className="n">{tr("Оцінка", "Estimate", "Schätzung", "Estimation")}</th><th>{tr("Дата", "Date", "Datum", "Date")}</th></tr></thead>
      <tbody>{P.estimates.filter((e) => e.group === g && e.date <= D.date).sort((a, b) => (a.type ?? "").localeCompare(b.type ?? "") || b.date.localeCompare(a.date)).map((e, k) => (
        <tr key={k}><td>{(e.type ? TYPES[e.type]?.[L] ?? e.type : flags(grp.label)) + " · " + { production: tr("виробництво / міс.", "output / month", "Produktion / Monat", "production / mois"), plan: tr("план / міс.", "plan / month", "Plan / Monat", "plan / mois"), stock: tr("запас", "reserve", "Reserve", "réserve") }[e.kind]}
          <small className="src"><A href={e.url}>{flags(e.src)}</A></small></td><td className="n">{rng({ lo: e.low, hi: e.high })}</td><td>{dLab(e.date)}</td></tr>
      ))}</tbody>
    </table></details>
    <details className="cv-tbl"><summary>{tr("Запуски по місяцях", "Launches by month", "Starts nach Monaten", "Lancements par mois")}</summary><table>
      <thead><tr><th>{tr("Місяць", "Month", "Monat", "Mois")}</th><th className="n">{tr("Запущено", "Launched", "Gestartet", "Lancés")}</th><th className="n">{tr("Виробництво", "Output", "Produktion", "Production")}</th><th>{tr("Джерело", "Source", "Quelle", "Source")}</th></tr></thead>
      <tbody>{[...rows].reverse().map((r) => { const h = P.launches.find((x) => x.month === r.month && r.src === "hand"); return (
        <tr key={r.month}><td>{mLab(r.month, true)}{r.partial ? tr(" (неповний)", " (incomplete)", " (unvollständig)", " (incomplet)") : ""}</td><td className="n">{r.launched != null ? f(r.launched) : "—"}</td><td className="n">{r.prod ? rng(r.prod) : "—"}</td>
          <td><small className="src">{h ? <A href={h.url}>{flags(h.src)}</A> : r.src === "tracked" ? tr("наш облік ранкових звітів Повітряних сил", "our count of the Air Force’s morning reports", "unsere Zählung der Morgenberichte der Luftwaffe", "notre décompte des bilans matinaux de l’armée de l’air") : tr("немає даних", "no data", "keine Daten", "pas de données")}</small></td></tr>
      ); })}</tbody>
    </table></details>
    {src}
  </div>);
}
