"use client";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import type { MapSec } from "@/lib/routes";
import type { Analytics } from "@/lib/data";
import { useApp } from "../ctx";
import { fetchJson } from "./hooks";
import { CrossLinks } from "./AnNotes";
import SeoHtml from "./SeoHtml";

// its own module (not in Dashboard.tsx), so /maps doesn't load the dashboard's panels; the map pulls in d3, lazily
const MapsCompare = dynamic(() => import("./Maps").then((m) => m.MapsCompare), { ssr: false });

/** The /maps page: the full source comparison with its filters. */
/** The /maps page: the server HTML (`seo`) until the map has its data; `dir` = a direction page's direction. */
export default function MapsView({ seo, dir, sec, an, headline }: { seo: ReactNode; dir?: string; sec?: MapSec; an?: Analytics | null; headline?: { title?: string; item?: string } | null }) {
  const { t, lang, D, MAPS } = useApp();
  const [ready, setReady] = useState(false);
  // first load: start the map's code and data while the page hydrates, not one after the other once it has (the lazy
  // map chunk would only start after hydration, and its data only after that chunk runs); fetchJson's cache hands the
  // same requests to the map when it mounts
  useState(() => {
    if (typeof window === "undefined") return;
    void import("./Maps").catch(() => {});
    for (const u of [MAPS, "/maps/archive/index.json"]) {
      fetchJson(u).catch(() => {});
      if (lang !== "uk") fetchJson("/i18n/" + lang + u).catch(() => {});
    }
  });
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
      {/* mounted but hidden until ready: its width and zoom hooks attach on the first render */}
      <div style={{ display: ready ? "contents" : "none" }}><MapsCompare dir0={dir} sec0={sec} an={an} onReady={() => setReady(true)} /></div>
      {/* the day's digest and the analytics: after the map, which is what visitors come for */}
      <CrossLinks an={an} headline={headline} tg />
    </div>
  );
}
