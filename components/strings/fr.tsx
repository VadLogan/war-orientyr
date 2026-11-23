"use client";
import type { ReactNode } from "react";
import type { UIStrings } from "@/lib/ui";
import { EN } from "@/lib/ui-en";
import { FR_UI } from "@/lib/ui-fr";
import { TCtx } from "./ctx";

const T = { fr: FR_UI as unknown as UIStrings, en: EN as unknown as UIStrings };
/** The route group's strings provider (app/(fr)/layout.tsx). */
export default function Strings({ children }: { children: ReactNode }) {
  return <TCtx.Provider value={T}>{children}</TCtx.Provider>;
}
