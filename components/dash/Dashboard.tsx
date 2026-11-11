"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { href, tgHref } from "@/lib/routes";
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
/** Until the map code is here (and in the server HTML), /strikes/targets shows its heading. */
function TgHead() {
  const { t } = useApp();
  return <div className="mp-head"><h2>{t.stk.tgTitle}</h2><p>{t.stk.tgSub}</p><p className="map-src">{t.stk.loading}</p></div>;
}
const TargetsMap = dynamic(() => import("./Maps").then((m) => m.TargetsMap), { ssr: false, loading: TgHead });

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
 *  `tg`: /strikes/targets — the potential targets and what each weapon reaches instead. */
export function StrikesView({ seo, tg }: { seo: ReactNode; tg?: boolean }) {
  const { t, lang, D } = useApp();
  const [ready, setReady] = useState(false);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      <StkSwitch tg={tg} />
      {tg ? <TargetsMap /> : <>
        {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
        <StrikesMap onReady={() => setReady(true)} />
      </>}
    </div>
  );
}
