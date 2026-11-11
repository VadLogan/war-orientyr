"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { href, tgHref } from "@/lib/routes";
import { useState, type ReactNode } from "react";
import type { Analytics } from "@/lib/data";
import { useApp } from "../ctx";
import { useSticky } from "./hooks";
import { Attack, Civ, Fire, LandCost, pick, Recruit, Tiles } from "./Panels";
import { Directions, Timeline, type DirSel } from "./Timeline";
import Losses from "./Losses";
import { Potential } from "./Potential";
import SourceMatrix from "./SourceMatrix";
import Overview, { type PanelItem } from "./Overview";
import PanelSheet from "./PanelSheet";
import { CrossLinks } from "./AnNotes";

// the maps pull in d3; load them only when the dashboard is opened
const MapsCompare = dynamic(() => import("./Maps").then((m) => m.MapsCompare), { ssr: false });
const StrikesMap = dynamic(() => import("./Maps").then((m) => m.StrikesMap), { ssr: false });
const TargetsMap = dynamic(() => import("./Maps").then((m) => m.TargetsMap), { ssr: false });

/** `panel`: an analytics page (/dashboard/landcost…) — only that panel, inline. `an`: server figures for the first paint; `summary`: the day as text (server). */
export default function Dashboard({ mapsCard, strikesCard, mapsMini, strikesMini, headline, an, summary, panel }: { mapsCard: ReactNode; strikesCard: ReactNode; mapsMini: ReactNode; strikesMini: ReactNode; headline: { title?: string; item?: string } | null; an?: Analytics | null; summary?: ReactNode; panel?: string }) {
  const { t, lang, D, smx } = useApp();
  const tr = pick(lang);
  const [dirSel, setDirSel] = useSticky<DirSel>("dirSel", null);
  // every panel opens in full in the sheet, in this order (the analytics first); the hash is its id
  const items: PanelItem[] = [
    { id: "landcost", title: tr("Ціна кілометра", "Price of a kilometre", "Preis eines Kilometers", "Prix d’un kilomètre"), node: <LandCost /> },
    { id: "potential", title: tr("Ударний потенціал", "Strike potential", "Angriffspotenzial", "Potentiel de frappe"), node: <Potential /> },
    { id: "timeline", title: tr("Динаміка", "Trends", "Verlauf", "Évolution"), node: <><Tiles /><Timeline sel={dirSel} setSel={setDirSel} /></> },
    { id: "dirs", title: t.pClashes, node: <Directions sel={dirSel} setSel={setDirSel} /> },
    { id: "losses", title: tr("Втрати", "Losses", "Verluste", "Pertes"), node: <Losses /> },
    { id: "atk", title: tr("Вартість атаки", "Cost of the attack", "Kosten des Angriffs", "Coût de l’attaque"), node: <Attack /> },
    { id: "fireP", title: tr("Вогонь рф", "russian fire", "russ. Feuer", "feu russe"), node: <Fire /> },
    { id: "civ", title: tr("Цивільні жертви", "Civilian casualties", "Zivile Opfer", "Victimes civiles"), node: <Civ /> },
    { id: "rec", title: tr("Набір проти втрат", "Recruitment vs losses", "Rekrutierung und Verluste", "Recrutement et pertes"), node: <Recruit /> },
    { id: "maps", title: t.map, node: mapsCard },
    { id: "strikemap", title: t.stk.cardH, node: strikesCard },
    ...(smx ? [{ id: "srcMx", title: tr("Джерела по днях", "Sources by day", "Quellen nach Tagen", "Sources par jour"), node: <SourceMatrix /> }] : []),
  ];
  if (panel) return <div className="dash">{items.find((x) => x.id === panel)?.node}</div>;
  return (
    <div className="dash">
      {lang !== "uk" && D.contentLang !== lang && <p className="lang-note">{D.contentLang === "en" ? t.langNoteEn : t.langNote}</p>}
      <Overview headline={headline} mapsMini={mapsMini} strikesMini={strikesMini} an={an} summary={summary} />
      <PanelSheet items={items} />
    </div>
  );
}

/** Server HTML for crawlers and screen readers, kept out of sight; readers see a loading line until the map has its data. */
function SeoHtml({ seo, loading }: { seo: ReactNode; loading: string }) {
  return <><div className="seo-only">{seo}</div><p className="map-src" style={{ padding: 16 }}>{loading}</p></>;
}

/** The /maps page: the full source comparison with its filters. */
/** The /maps page: the server HTML (`seo`) until the map has its data; `dir` = a direction page's direction. */
export function MapsView({ seo, dir, an, headline }: { seo: ReactNode; dir?: string; an?: Analytics | null; headline?: { title?: string; item?: string } | null }) {
  const { t, lang, D } = useApp();
  const [ready, setReady] = useState(false);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      <CrossLinks an={an} headline={headline} tg />
      {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
      {/* mounted but hidden until ready: its width and zoom hooks attach on the first render */}
      <div style={{ display: ready ? "contents" : "none" }}><MapsCompare dir0={dir} an={an} onReady={() => setReady(true)} /></div>
    </div>
  );
}

/** Strikes / potential targets: two pages (/strikes, /strikes/targets) switched by plain links. */
function StkSwitch({ tg }: { tg?: boolean }) {
  const { t, lang } = useApp();
  return (
    <nav className="stk-sw" aria-label={t.stk.swAria}>
      <Link href={href(lang, "strikes", null, "")} aria-current={tg ? undefined : "page"}>
        <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3v6M15 21v6M3 15h6M21 15h6" /><circle cx="15" cy="15" r="7" /><circle cx="15" cy="15" r="1.6" className="fl" /></svg>
        <span><b>{t.stk.swStk}</b><small>{t.stk.swStkSub}</small></span>
      </Link>
      <Link href={tgHref(lang)} aria-current={tg ? "page" : undefined}>
        <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 4l11 11-11 11L4 15z" /><path d="M15 10l5 5-5 5-5-5z" className="fl" /></svg>
        <span><b>{t.stk.swTg}</b><small>{t.stk.swTgSub}</small></span>
      </Link>
    </nav>
  );
}

/** The /strikes page: the server HTML (`seo`) until the interactive map with its filters, legend and list has its data.
 *  `tg`: /strikes/targets — the potential targets and what each weapon reaches instead (server HTML: TargetsSeo). */
export function StrikesView({ seo, an, headline, tg }: { seo: ReactNode; an?: Analytics | null; headline?: { title?: string; item?: string } | null; tg?: boolean }) {
  const { t, lang, D } = useApp();
  const [ready, setReady] = useState(false);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      <CrossLinks an={an} headline={headline} />
      <StkSwitch tg={tg} />
      {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
      {tg ? <TargetsMap onReady={() => setReady(true)} /> : <StrikesMap an={an} onReady={() => setReady(true)} />}
    </div>
  );
}
