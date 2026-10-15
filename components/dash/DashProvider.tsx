"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SourceMatrix } from "@/lib/data";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/ui";
import { AppCtx, strings, type Ctx, type DashIssue } from "../ctx";
import Tooltip from "../Tooltip";
import Dashboard from "./Dashboard";

/** Client root of the dashboard page; data comes from the server, navigation goes through the router. */
export default function DashProvider({ lang, D, LATEST, DATES, smx }: { lang: Lang; D: DashIssue; LATEST: DashIssue; DATES: string[]; smx: SourceMatrix | null }) {
  const router = useRouter();
  const ctx: Ctx = useMemo(() => ({
    lang, t: strings(lang), D, LATEST, DATES, smx,
    selectDate: (date) => router.push(href(lang, "dashboard", date, LATEST.date)),
    // full navigation: the browser then scrolls to the item and applies :target (soft navigation does neither)
    goItem: (date, id) => location.assign(href(lang, "digest", date || D.date, LATEST.date) + "#it-" + id),
  }), [lang, D, LATEST, DATES, smx, router]);
  return (
    <AppCtx.Provider value={ctx}>
      <Dashboard />
      <Tooltip />
    </AppCtx.Provider>
  );
}
