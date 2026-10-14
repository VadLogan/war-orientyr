"use client";
import { useEffect, useRef } from "react";
import { useApp, type Ctx } from "../ctx";

// Strangler bridge: the dashboard is still drawn by public/legacy/app.js until its panels are ported.
declare global {
  interface Window { WDLegacy?: { mount(el: HTMLElement, s: Ctx): void; unmount(): void }; d3?: unknown }
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

export default function Dashboard() {
  const ctx = useApp();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let live = true;
    legacy().then(() => { if (live && ref.current) window.WDLegacy!.mount(ref.current, ctx); }, console.error);
    return () => { live = false; window.WDLegacy?.unmount(); };
  }, [ctx]);
  return <div ref={ref} />;
}
