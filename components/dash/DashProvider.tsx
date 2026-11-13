"use client";
import type { MapSec } from "@/lib/routes";
import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Analytics, SourceMatrix } from "@/lib/data";
import { href } from "@/lib/routes";
import { AppCtx, strings, type Ctx, type DashIssue, type DashLang } from "../ctx";
import Tooltip from "../Tooltip";
import Dashboard, { MapsView, StrikesView } from "./Dashboard";

/** Client root of the dashboard page; data comes from the server, navigation goes through the router. */
/** `mapsCard`, `strikesCard`: the dashboard's map blocks, rendered on the server (MapsCard, StrikesCard).
 *  `strikesSeo`, `mapsSeo`: the /strikes and /maps pages as plain server HTML (StrikesSeo), shown until the interactive page has loaded. `dir`: a /maps/<direction> page, framed on it. `sec`: a /maps/<section> page, that section open. `tg`: /strikes/targets. */
export default function DashProvider({ view, lang, D, LATEST, DATES, MAPS, smx, mapsCard, strikesCard, mapsMini, strikesMini, headline, an, summary, panel, strikesSeo, mapsSeo, dir, tg, sec }: { an?: Analytics | null; summary?: ReactNode; panel?: string; mapsMini: ReactNode; strikesMini: ReactNode; headline: { title?: string; item?: string } | null; view: "dashboard" | "maps" | "strikes"; lang: DashLang; D: DashIssue; LATEST: DashIssue; DATES: string[]; MAPS: string; smx: SourceMatrix | null; mapsCard?: ReactNode; strikesCard?: ReactNode; strikesSeo?: ReactNode; mapsSeo?: ReactNode; dir?: string; tg?: boolean; sec?: MapSec }) {
  const router = useRouter();
  const ctx: Ctx = useMemo(() => ({
    lang, t: strings(lang), D, LATEST, DATES, MAPS, smx,
    selectDate: (date) => router.push(href(lang, view, date, LATEST.date)),
    // full navigation: the browser then scrolls to the item and applies :target (soft navigation does neither)
    goItem: (date, id) => location.assign(href(lang, "digest", date || D.date, LATEST.date) + "#it-" + id),
  }), [view, lang, D, LATEST, DATES, MAPS, smx, router]);
  return (
    <AppCtx.Provider value={ctx}>
      {view === "maps" ? <MapsView seo={mapsSeo} dir={dir} sec={sec} an={an} headline={headline} /> : view === "strikes" ? <StrikesView seo={strikesSeo} an={an} headline={headline} tg={tg} /> : <Dashboard mapsCard={mapsCard} strikesCard={strikesCard} mapsMini={mapsMini} strikesMini={strikesMini} headline={headline} an={an} summary={summary} panel={panel} />}
      <Tooltip />
    </AppCtx.Provider>
  );
}
