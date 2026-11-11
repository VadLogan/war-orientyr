// Server components: the dashboard's numbers as plain text (search engines, screen readers, readers without JS) and the
// intro + method of the analytics pages (/dashboard/landcost, /dashboard/potential), plus their schema.org JSON-LD.
import type { Digest } from "@/types/digest";
import type { Analytics } from "@/lib/data";
import { fmt, loc, num } from "@/lib/text";
import { href, SITE, SITE_NAME } from "@/lib/routes";
import { panelHref, panelTitle, panelDesc, type Panel } from "@/lib/page";
import { UI, type Lang, type UIStrings } from "@/lib/ui";
import { flags } from "@/components/Flag";

type Tr = (uk: string, en: string, de: string, fr: string) => string;
const pick = (lang: Lang): Tr => (uk, en, de, fr) => ({ uk, en, de, fr }[lang]);
const dmy = (d: string) => d.split("-").reverse().join(".");
const monthL = (m: string, lang: Lang) => {
  const s = new Date(m + "-15T00:00:00Z").toLocaleDateString(loc(lang), { month: "long", year: "numeric", timeZone: "UTC" }).replace(/\s*р\.$/, "");
  return s[0].toUpperCase() + s.slice(1);
};
const num1 = (v: number, lang: Lang) => (v >= 100 ? fmt(Math.round(v), lang) : v.toLocaleString(loc(lang), { maximumFractionDigits: 1, minimumFractionDigits: 1 }));

/** The day in sentences, under the dashboard cards: air, front, losses, both analytics, civilians. */
export function DashSummary({ D, an, lang }: { D: Digest; an: Analytics | null; lang: Lang }) {
  const tr = pick(lang), f = (n: number) => fmt(Math.round(n), lang), t = UI[lang] as UIStrings;
  const A = D.airDefense || {}, F = D.front || {}, P: React.ReactNode[] = [];
  if (A.launched != null) P.push(tr(`Ніч на ${dmy(D.date)}: росія запустила ${f(A.launched)} дронів, збито або подавлено ${f(A.intercepted ?? 0)} (${Math.round(((A.intercepted ?? 0) / A.launched) * 100)}%)${A.hitLocations != null ? `, влучання — на ${f(A.hitLocations)} локаціях` : ""} (Повітряні сили ЗСУ).`,
    `Night to ${dmy(D.date)}: russia launched ${f(A.launched)} drones, ${f(A.intercepted ?? 0)} were shot down or suppressed (${Math.round(((A.intercepted ?? 0) / A.launched) * 100)}%)${A.hitLocations != null ? `, with hits at ${f(A.hitLocations)} locations` : ""} (Ukraine’s Air Force).`,
    `Nacht zum ${dmy(D.date)}: russland startete ${f(A.launched)} Drohnen, ${f(A.intercepted ?? 0)} wurden abgeschossen oder unterdrückt (${Math.round(((A.intercepted ?? 0) / A.launched) * 100)} %)${A.hitLocations != null ? `, Treffer an ${f(A.hitLocations)} Orten` : ""} (ukrainische Luftwaffe).`,
    `Nuit du ${dmy(D.date)} : la russie a lancé ${f(A.launched)} drones, ${f(A.intercepted ?? 0)} ont été abattus ou neutralisés (${Math.round(((A.intercepted ?? 0) / A.launched) * 100)} %)${A.hitLocations != null ? `, avec des impacts sur ${f(A.hitLocations)} sites` : ""} (armée de l’air ukrainienne).`));
  const top = (F.directions || []).slice().sort((a, b) => b.attacks - a.attacks)[0];
  const ru = (D.losses?.series || []).find((e) => e.date === D.date)?.ru?.personnel, tot = num(D.losses?.gsTotal?.personnel);
  if (F.clashesTotal != null) P.push(tr(`Генштаб ЗСУ: ${f(F.clashesTotal)} боєзіткнень${top ? `, найбільше — ${top.name} напрямок (${top.attacks})` : ""}${ru != null ? `; втрати росії за добу — ${f(ru)} осіб` : ""}${tot != null ? `, усього з 24.02.2022 — ${f(tot)}` : ""}.`,
    `Ukraine’s General Staff: ${f(F.clashesTotal)} clashes${top ? `, most of them in the ${top.name} direction (${top.attacks})` : ""}${ru != null ? `; russian losses for the day — ${f(ru)} personnel` : ""}${tot != null ? `, ${f(tot)} in total since 24.02.2022` : ""}.`,
    `Ukrainischer Generalstab: ${f(F.clashesTotal)} Gefechte${top ? `, die meisten im Abschnitt ${top.name} (${top.attacks})` : ""}${ru != null ? `; russische Verluste des Tages – ${f(ru)} Soldaten` : ""}${tot != null ? `, insgesamt seit dem 24.02.2022 – ${f(tot)}` : ""}.`,
    `État-major ukrainien : ${f(F.clashesTotal)} combats${top ? `, surtout dans la direction de ${top.name} (${top.attacks})` : ""}${ru != null ? ` ; pertes russes du jour – ${f(ru)} soldats` : ""}${tot != null ? `, ${f(tot)} au total depuis le 24.02.2022` : ""}.`));
  if (an?.kmAll) P.push(<><a href={panelHref(lang, "landcost")}>{panelTitle(lang, "landcost").split(":")[0]}</a>{": " + tr(`з 24.02.2022 — ${num1(an.kmAll.pk, lang)} осіб рф на 1 км² захопленої землі`, `since 24.02.2022 — ${num1(an.kmAll.pk, lang)} russian personnel per km² seized`, `seit dem 24.02.2022 – ${num1(an.kmAll.pk, lang)} russische Soldaten pro eroberten km²`, `depuis le 24.02.2022 – ${num1(an.kmAll.pk, lang)} soldats russes par km² conquis`)
    + (an.km30 ? tr(`; за ${an.km30.span} днів — ${f(an.km30.pk)}`, `; over ${an.km30.span} days — ${f(an.km30.pk)}`, `; über ${an.km30.span} Tage – ${f(an.km30.pk)}`, ` ; sur ${an.km30.span} jours – ${f(an.km30.pk)}`) : "") + "."}</>);
  if (an?.pot) P.push(<><a href={panelHref(lang, "potential")}>{t.an.potK}</a>{": " + t.an.pot(monthL(an.pot.month, lang), f(an.pot.launched), an.pot.share).replace(/\.$/, "") + tr(` (виробляє ≈${f(an.pot.prod)} на місяць, оцінка ГУР).`, ` (it makes ≈${f(an.pot.prod)} a month, HUR estimate).`, ` (Produktion ≈${f(an.pot.prod)} pro Monat, HUR-Schätzung).`, ` (production ≈${f(an.pot.prod)} par mois, estimation du HUR).`)}</>);
  const cv = (D.civilianStats?.months || []).filter((r) => r.killed != null).at(-1);
  if (cv) P.push(tr(`ООН: ${monthL(cv.m, lang).toLowerCase()} — ${f(cv.killed!)} загиблих і ${f(cv.injured ?? 0)} поранених цивільних.`, `UN: ${monthL(cv.m, lang)} — ${f(cv.killed!)} civilians killed and ${f(cv.injured ?? 0)} injured.`, `UN: ${monthL(cv.m, lang)} – ${f(cv.killed!)} Zivilisten getötet und ${f(cv.injured ?? 0)} verletzt.`, `ONU : ${monthL(cv.m, lang).toLowerCase()} – ${f(cv.killed!)} civils tués et ${f(cv.injured ?? 0)} blessés.`));
  if (!P.length) return null;
  return (
    <section className="dz-txt" data-s="over d" aria-labelledby="dz-txt-h">
      <h2 id="dz-txt-h">{tr("Коротко: день у цифрах", "In brief: the day in numbers", "Kurz: der Tag in Zahlen", "En bref : la journée en chiffres")}</h2>
      {P.map((p, k) => <p key={k}>{typeof p === "string" ? flags(p) : p}</p>)}
    </section>
  );
}

/** Intro of an analytics page: what it measures, the newest figures. */
export function PanelIntro({ panel, an, lang }: { panel: Panel; an: Analytics | null; lang: Lang }) {
  const tr = pick(lang), f = (n: number) => fmt(Math.round(n), lang);
  const L: string[] = [];
  if (panel === "landcost" && an?.kmAll) {
    const k = an.kmAll;
    L.push(tr(`З 24.02.2022 росія втратила ${f(k.pers)} осіб (Генштаб ЗСУ), а окупована площа за DeepState зросла на ${f(k.gain)} км² — ${num1(k.pk, lang)} особи на кожен км².`,
      `Since 24.02.2022 russia has lost ${f(k.pers)} personnel (Ukraine’s General Staff) while the occupied area per DeepState grew by ${f(k.gain)} km² — ${num1(k.pk, lang)} for every km².`,
      `Seit dem 24.02.2022 hat russland ${f(k.pers)} Soldaten verloren (ukrainischer Generalstab), die besetzte Fläche wuchs laut DeepState um ${f(k.gain)} km² – ${num1(k.pk, lang)} pro km².`,
      `Depuis le 24.02.2022, la russie a perdu ${f(k.pers)} soldats (état-major ukrainien) tandis que la surface occupée selon DeepState a augmenté de ${f(k.gain)} km² – ${num1(k.pk, lang)} par km².`));
    for (const x of [an.km30, an.km7]) if (x) L.push(tr(`${dmy(x.S)}–${dmy(x.E)} (${x.span} дн.): приріст ${f(x.gain)} км², втрати ${f(x.pers)} — ${f(x.pk)} осіб на км²${x.x ? `, ×${Math.round(x.x)} до середнього` : ""}.`,
      `${dmy(x.S)}–${dmy(x.E)} (${x.span} days): ${f(x.gain)} km² gained, ${f(x.pers)} lost — ${f(x.pk)} per km²${x.x ? `, ×${Math.round(x.x)} the average` : ""}.`,
      `${dmy(x.S)}–${dmy(x.E)} (${x.span} Tage): ${f(x.gain)} km² Zuwachs, ${f(x.pers)} Verluste – ${f(x.pk)} pro km²${x.x ? `, ×${Math.round(x.x)} des Durchschnitts` : ""}.`,
      `${dmy(x.S)}–${dmy(x.E)} (${x.span} jours) : ${f(x.gain)} km² gagnés, ${f(x.pers)} pertes – ${f(x.pk)} par km²${x.x ? `, ×${Math.round(x.x)} la moyenne` : ""}.`));
  }
  if (panel === "potential" && an?.pots) {
    const G: [keyof typeof an.pots, string][] = [["dr", tr("Дрони", "Drones", "Drohnen", "Drones")], ["bal", tr("Балістичні ракети", "Ballistic missiles", "Ballistische Raketen", "Missiles balistiques")], ["cr", tr("Крилаті ракети", "Cruise missiles", "Marschflugkörper", "Missiles de croisière")]];
    for (const [g, name] of G) {
      const x = an.pots[g];
      if (!x) continue;
      const m = monthL(x.month, lang), res = x.reserve ? f(x.reserve.lo) + "–" + f(x.reserve.hi) : null;
      L.push(name + ": " + tr(`виробництво ≈${f(x.prod)} на місяць${x.ya ? ` (рік тому ≈${f(x.ya)})` : ""}; ${m.toLowerCase()} — запущено ${f(x.launched)}, ${x.share}% виробленого${res ? `; запас ${res} (ГУР)` : ""}.`,
        `output ≈${f(x.prod)} a month${x.ya ? ` (a year ago ≈${f(x.ya)})` : ""}; ${m}: ${f(x.launched)} launched, ${x.share}% of output${res ? `; reserve ${res} (HUR)` : ""}.`,
        `Produktion ≈${f(x.prod)} pro Monat${x.ya ? ` (vor einem Jahr ≈${f(x.ya)})` : ""}; ${m}: ${f(x.launched)} gestartet, ${x.share} % der Produktion${res ? `; Reserve ${res} (HUR)` : ""}.`,
        `production ≈${f(x.prod)} par mois${x.ya ? ` (il y a un an ≈${f(x.ya)})` : ""} ; ${m} : ${f(x.launched)} lancés, ${x.share} % de la production${res ? ` ; réserve ${res} (HUR)` : ""}.`));
    }
  }
  return (
    <header className="pnl-head">
      <nav className="pnl-crumbs" aria-label={tr("Шлях", "Breadcrumb", "Pfad", "Fil d’Ariane")}><a href={href(lang, "digest", null, "")}>{SITE_NAME[lang]}</a> › <a href={href(lang, "dashboard", null, "")}>{(UI[lang] as UIStrings).dash}</a></nav>
      <h1>{panelTitle(lang, panel)}</h1>
      <p className="lede">{panelDesc(lang, panel)}</p>
      {L.length > 0 && <ul className="pnl-facts">{L.map((x, k) => <li key={k}>{flags(x)}</li>)}</ul>}
    </header>
  );
}

/** Method, links back to the dashboard and to the other analytic. */
export function PanelFoot({ panel, an, lang, method }: { panel: Panel; an: Analytics | null; lang: Lang; method: string }) {
  const tr = pick(lang), t = UI[lang] as UIStrings, other: Panel = panel === "landcost" ? "potential" : "landcost";
  return (
    <section className="pnl-foot">
      <h2>{tr("Як рахується", "How it is calculated", "Wie es berechnet wird", "Comment c’est calculé")}</h2>
      {panel === "landcost" ? <><p>{flags(t.lcost.caveat)}</p>{an && <p>{flags(t.lcost.methodText(dmy(an.anchor)))}</p>}</> : <p>{flags(method)}</p>}
      <p className="pnl-links"><a href={href(lang, "dashboard", null, "")}>{tr("← Увесь дашборд", "← The whole dashboard", "← Das ganze Dashboard", "← Tout le tableau de bord")}</a> · <a href={panelHref(lang, other)}>{panelTitle(lang, other).split(":")[0]} →</a> · <a href={href(lang, "maps", null, "")}>{t.maps} →</a></p>
    </section>
  );
}

/** schema.org Dataset (+ BreadcrumbList) for the dashboard or an analytics page. */
export function dashLd(lang: Lang, date: string, panel?: Panel) {
  const org = { "@type": "Organization", name: SITE_NAME[lang], url: SITE }, t = UI[lang] as UIStrings, tr = pick(lang);
  const url = SITE + (panel ? panelHref(lang, panel) : href(lang, "dashboard", null, ""));
  const vars = panel === "landcost" ? [tr("Втрати особового складу на 1 км²", "Personnel losses per km²", "Personalverluste pro km²", "Pertes en personnel par km²"), tr("Втрати техніки на 1 км²", "Equipment losses per km²", "Materialverluste pro km²", "Pertes de matériel par km²"), tr("Чистий приріст окупованої площі, км²", "Net gain in occupied area, km²", "Netto-Zuwachs besetzter Fläche, km²", "Gain net de surface occupée, km²")]
    : panel === "potential" ? [tr("Виробництво дронів і ракет на місяць", "Monthly output of drones and missiles", "Monatliche Produktion von Drohnen und Raketen", "Production mensuelle de drones et de missiles"), tr("Запуски на місяць", "Launches per month", "Starts pro Monat", "Lancements par mois"), tr("Запас ракет", "Missile reserve", "Raketenreserve", "Réserve de missiles")]
    : [t.tLaunched, t.tIntercepted, t.tHits, t.tClashes, t.lsRuDay, tr("Ціна кілометра", "Price of a kilometre", "Preis eines Kilometers", "Prix d’un kilomètre"), tr("Цивільні жертви", "Civilian casualties", "Zivile Opfer", "Victimes civiles")];
  const name = panel ? panelTitle(lang, panel) : `${t.dash} · ${SITE_NAME[lang]}`;
  return [
    { "@context": "https://schema.org", "@type": "Dataset", name, description: panel ? panelDesc(lang, panel) : tr("Війна в цифрах щодня: атаки дронів і ракет, боєзіткнення, втрати сторін, ціна кілометра, ударний потенціал росії, цивільні жертви.", "The war in numbers, daily: drone and missile attacks, clashes, losses on both sides, the price of a kilometre, russia’s strike potential, civilian casualties.", "Der Krieg in Zahlen, täglich: Drohnen- und Raketenangriffe, Gefechte, Verluste beider Seiten, Preis eines Kilometers, russlands Angriffspotenzial, zivile Opfer.", "La guerre en chiffres, chaque jour : attaques de drones et de missiles, combats, pertes des deux camps, prix d’un kilomètre, potentiel de frappe russe, victimes civiles."),
      url, inLanguage: lang, temporalCoverage: `2022-02-24/${date}`, dateModified: date, isAccessibleForFree: true, creator: org, publisher: org,
      variableMeasured: vars, spatialCoverage: { "@type": "Place", name: tr("Україна", "Ukraine", "Ukraine", "Ukraine") },
      distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: SITE + (panel === "landcost" ? "/landcost.json" : panel === "potential" ? "/potential.json" : "/digest.json") } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME[lang], item: SITE + href(lang, "digest", null, "") },
      { "@type": "ListItem", position: 2, name: t.dash, item: SITE + href(lang, "dashboard", null, "") },
      ...(panel ? [{ "@type": "ListItem", position: 3, name: panelTitle(lang, panel).split(":")[0], item: url }] : [])] },
  ];
}
