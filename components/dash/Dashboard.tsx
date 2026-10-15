"use client";
import dynamic from "next/dynamic";
import { useApp } from "../ctx";
import { useSticky } from "./hooks";
import { Attack, Civ, Fire, LandCost, Recruit, Tiles } from "./Panels";
import { Directions, Timeline, type DirSel } from "./Timeline";
import Losses from "./Losses";
import SourceMatrix from "./SourceMatrix";

// the maps pull in d3; load them only when the dashboard is opened
const MapsCompare = dynamic(() => import("./Maps").then((m) => m.MapsCompare), { ssr: false });
const StrikesMap = dynamic(() => import("./Maps").then((m) => m.StrikesMap), { ssr: false });

export default function Dashboard() {
  const { t, lang, D } = useApp();
  const [dirSel, setDirSel] = useSticky<DirSel>("dirSel", null);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      <Civ />
      <Tiles />
      <Attack />
      <Timeline sel={dirSel} setSel={setDirSel} />
      <Losses />
      <LandCost />
      <Recruit />
      <MapsCompare />
      <StrikesMap />
      <Directions sel={dirSel} setSel={setDirSel} />
      <Fire />
      <SourceMatrix />
    </div>
  );
}
