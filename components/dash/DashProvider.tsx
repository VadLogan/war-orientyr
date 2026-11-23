"use client";
import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { SourceMatrix } from "@/lib/data";
import { href } from "@/lib/routes";
import { useT } from "../strings/ctx";
import { AppCtx, type Ctx, type DashIssue, type DashLang } from "../ctx";
import Tooltip from "../Tooltip";

/** Client root of the dashboard, /maps and /strikes pages: the context (data from the server, navigation through the
 *  router); the page's view comes as children from the server, so each page loads only its own view's code. */
/** `mapsCard`, `strikesCard`: the dashboard's map blocks, rendered on the server (MapsCard, StrikesCard).
 *  `strikesSeo`, `mapsSeo`: the /strikes and /maps pages as plain server HTML (StrikesSeo), shown until the interactive page has loaded. `dir`: a /maps/<direction> page, framed on it. `sec`: a /maps/<section> page, that section open. `tg`: /strikes/targets. */
export default function DashProvider({ view, lang, D, LATEST, DATES, MAPS, smx, children }: { view: "dashboard" | "maps" | "strikes"; lang: DashLang; D: DashIssue; LATEST: DashIssue; DATES: string[]; MAPS: string; smx: SourceMatrix | null; children: ReactNode }) {
  const router = useRouter(), t = useT(lang);
  const ctx: Ctx = useMemo(() => ({
    lang, t, D, LATEST, DATES, MAPS, smx,
    selectDate: (date) => router.push(href(lang, view, date, LATEST.date)),
    // full navigation: the browser then scrolls to the item and applies :target (soft navigation does neither)
    goItem: (date, id) => location.assign(href(lang, "digest", date || D.date, LATEST.date) + "#it-" + id),
  }), [view, lang, t, D, LATEST, DATES, MAPS, smx, router]);
  return (
    <AppCtx.Provider value={ctx}>
      {children}
      <Tooltip />
    </AppCtx.Provider>
  );
}
