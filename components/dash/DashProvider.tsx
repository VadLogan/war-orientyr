"use client";
import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { SourceMatrix } from "@/lib/data";
import { href } from "@/lib/routes";
import { AppCtx, strings, type Ctx, type DashIssue, type DashLang } from "../ctx";
import Tooltip from "../Tooltip";
import Dashboard, { MapsView, StrikesView } from "./Dashboard";

/** Client root of the dashboard page; data comes from the server, navigation goes through the router. */
/** `mapsCard`, `strikesCard`: the dashboard's map blocks, rendered on the server (MapsCard, StrikesCard).
 *  `strikesSeo`: the /strikes page as plain server HTML (StrikesSeo), shown until the interactive page has loaded. */
export default function DashProvider({ view, lang, D, LATEST, DATES, MAPS, smx, mapsCard, strikesCard, strikesSeo }: { view: "dashboard" | "maps" | "strikes"; lang: DashLang; D: DashIssue; LATEST: DashIssue; DATES: string[]; MAPS: string; smx: SourceMatrix | null; mapsCard?: ReactNode; strikesCard?: ReactNode; strikesSeo?: ReactNode }) {
  const router = useRouter();
  const ctx: Ctx = useMemo(() => ({
    lang, t: strings(lang), D, LATEST, DATES, MAPS, smx,
    selectDate: (date) => router.push(href(lang, view, date, LATEST.date)),
    // full navigation: the browser then scrolls to the item and applies :target (soft navigation does neither)
    goItem: (date, id) => location.assign(href(lang, "digest", date || D.date, LATEST.date) + "#it-" + id),
  }), [view, lang, D, LATEST, DATES, MAPS, smx, router]);
  return (
    <AppCtx.Provider value={ctx}>
      {view === "maps" ? <MapsView /> : view === "strikes" ? <StrikesView seo={strikesSeo} /> : <Dashboard mapsCard={mapsCard} strikesCard={strikesCard} />}
      <Tooltip />
    </AppCtx.Provider>
  );
}
