"use client";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { useApp } from "../ctx";
import { useSticky } from "./hooks";
import { Attack, Civ, Fire, LandCost, Recruit, Tiles } from "./Panels";
import { Directions, Timeline, type DirSel } from "./Timeline";
import Losses from "./Losses";
import SourceMatrix from "./SourceMatrix";

// the maps pull in d3; load them only when the dashboard is opened
const MapsCompare = dynamic(() => import("./Maps").then((m) => m.MapsCompare), { ssr: false });
const StrikesMap = dynamic(() => import("./Maps").then((m) => m.StrikesMap), { ssr: false });

export default function Dashboard({ mapsCard, strikesCard }: { mapsCard: ReactNode; strikesCard: ReactNode }) {
  const { t, lang, D, smx } = useApp();
  const [dirSel, setDirSel] = useSticky<DirSel>("dirSel", null);
  return (
    <div className="dash">
      {lang !== "uk" && D.contentLang !== lang && <p className="lang-note">{D.contentLang === "en" ? t.langNoteEn : t.langNote}</p>}
      <Civ />
      <Tiles />
      <Attack />
      <Timeline sel={dirSel} setSel={setDirSel} />
      <Losses />
      <LandCost />
      <Recruit />
      {mapsCard}
      {strikesCard}
      <Directions sel={dirSel} setSel={setDirSel} />
      <Fire />
      {smx && <SourceMatrix />}
    </div>
  );
}

/** The /maps page: the full source comparison with its filters. */
export function MapsView() {
  const { t, lang, D } = useApp();
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      <MapsCompare />
    </div>
  );
}

/** The /strikes page: the server HTML (`seo`) until the interactive map with its filters, legend and list has its data. */
export function StrikesView({ seo }: { seo: ReactNode }) {
  const { t, lang, D } = useApp();
  const [ready, setReady] = useState(false);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      {!ready && seo}
      <StrikesMap onReady={() => setReady(true)} />
    </div>
  );
}
