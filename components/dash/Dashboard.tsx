"use client";
import { useEffect, useRef } from "react";
import { useApp, type Ctx } from "../ctx";
import { useSticky } from "./hooks";
import { Attack, Civ, Fire, LandCost, Recruit, Tiles } from "./Panels";
import { Directions, Timeline, type DirSel } from "./Timeline";
import Losses from "./Losses";
import SourceMatrix from "./SourceMatrix";

// Strangler bridge: the two maps are still drawn by public/legacy/app.js until they are ported.
declare global {
  interface Window { WDLegacy?: { panel(k: string, el: HTMLElement, s: Ctx): void; unmount(): void }; d3?: unknown }
}
let boot: Promise<void> | null = null;
function load(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("failed to load " + src));
    document.body.appendChild(s);
  });
}
const legacy = () => (boot ??= (async () => { if (!window.d3) await load("/legacy/d3.min.js"); await load("/legacy/app.js"); })());

function LegacyPanel({ k }: { k: string }) {
  const ctx = useApp();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let live = true;
    legacy().then(() => { if (live && ref.current) window.WDLegacy!.panel(k, ref.current, ctx); }, console.error);
    return () => { live = false; window.WDLegacy?.unmount(); };
  }, [k, ctx]);
  return <div ref={ref} style={{ display: "contents" }} />;
}

export default function Dashboard() {
  const { t } = useApp();
  const [dirSel, setDirSel] = useSticky<DirSel>("dirSel", null);
  return (
    <div className="dash">
      {t.langNote && <p className="lang-note">{t.langNote}</p>}
      <Civ />
      <Tiles />
      <Attack />
      <Timeline sel={dirSel} setSel={setDirSel} />
      <Losses />
      <LandCost />
      <Recruit />
      <LegacyPanel k="maps" />
      <LegacyPanel k="stk" />
      <Directions sel={dirSel} setSel={setDirSel} />
      <Fire />
      <SourceMatrix />
    </div>
  );
}
