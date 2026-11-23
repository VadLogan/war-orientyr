"use client";
import { createContext, useContext } from "react";
import type { Lang, UIStrings } from "@/lib/ui";

/** UI strings for client components. Each route group's layout provides its own language only (app/(xx)/layout.tsx →
 *  components/strings/<xx>.tsx), plus English under /de and /fr (their pages fall back to English; German and French
 *  are spread over the English module anyway). Imported per layout, so a page's bundle carries just those. */
export const TCtx = createContext<Partial<Record<Lang, UIStrings>>>({});
export function useT(lang: Lang): UIStrings {
  const t = useContext(TCtx)[lang];
  if (!t) throw new Error(`useT: no "${lang}" strings provided (app/(${lang})/layout.tsx)`);
  return t;
}
