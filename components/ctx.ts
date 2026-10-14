"use client";
import { createContext, useContext } from "react";
import type { Digest } from "@/types/digest";
import type { Strikes } from "@/lib/strikes";
import { UI, type Lang, type UIStrings } from "@/lib/ui";

export type Ctx = {
  lang: Lang;
  t: UIStrings;
  D: Digest; // the issue on screen
  LATEST: Digest; // the newest issue (owns timeline/losses series)
  DATES: string[];
  strikes: Strikes | null;
  needStrikes: () => void;
  selectDate: (date: string) => Promise<void>;
  goItem: (date: string | undefined, id: string) => void;
};

export const AppCtx = createContext<Ctx | null>(null);
export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside <App>");
  return c;
}
export const strings = (lang: Lang) => UI[lang] as UIStrings;
