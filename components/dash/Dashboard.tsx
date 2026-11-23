"use client";
import type { ReactNode } from "react";
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
