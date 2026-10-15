"use client";
import { createContext, useContext } from "react";
import type { Digest } from "@/types/digest";
import type { SourceMatrix } from "@/lib/data";
import { UI, type Lang, type UIStrings } from "@/lib/ui";

/** The parts of an issue the dashboard reads (kept small: it is serialized into every dashboard page). */
export type DashIssue = Pick<Digest, "date" | "airDefense" | "front" | "civilianStats" | "timeline" | "airDefenseHistory" | "losses">;

export type Ctx = {
  lang: Lang;
  t: UIStrings;
  D: DashIssue; // the issue on screen
  LATEST: DashIssue; // the newest issue (owns timeline/losses series)
  DATES: string[];
  smx: SourceMatrix;
  selectDate: (date: string) => void;
  goItem: (date: string | undefined, id: string) => void;
};

export const AppCtx = createContext<Ctx | null>(null);
export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside <DashProvider>");
  return c;
}
export const strings = (lang: Lang) => UI[lang] as UIStrings;
