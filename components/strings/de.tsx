"use client";
import type { ReactNode } from "react";
import type { UIStrings } from "@/lib/ui";
import { EN } from "@/lib/ui-en";
import { DE_UI } from "@/lib/ui-de";
import { TCtx } from "./ctx";

const T = { de: DE_UI as unknown as UIStrings, en: EN as unknown as UIStrings };
/** The route group's strings provider (app/(de)/layout.tsx). */
export default function Strings({ children }: { children: ReactNode }) {
  return <TCtx.Provider value={T}>{children}</TCtx.Provider>;
}
