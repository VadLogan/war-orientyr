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

/** Server HTML for crawlers and screen readers, kept out of sight; readers see a loading line until the map has its data. */
function SeoHtml({ seo, loading }: { seo: ReactNode; loading: string }) {
  return <><div className="seo-only">{seo}</div><p className="map-src" style={{ padding: 16 }}>{loading}</p></>;
}

/** The /maps page: the full source comparison with its filters. */
/** The /maps page: the server HTML (`seo`) until the map has its data; `dir` = a direction page's direction. */
export function MapsView({ seo, dir }: { seo: ReactNode; dir?: string }) {
  const { t, lang, D } = useApp();
  const [ready, setReady] = useState(false);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
      {/* mounted but hidden until ready: its width and zoom hooks attach on the first render */}
      <div style={{ display: ready ? "contents" : "none" }}><MapsCompare dir0={dir} onReady={() => setReady(true)} /></div>
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
      {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
      <StrikesMap onReady={() => setReady(true)} />
    </div>
  );
}
