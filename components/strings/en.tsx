"use client";
import type { ReactNode } from "react";
import type { UIStrings } from "@/lib/ui";
import { EN } from "@/lib/ui-en";
import { TCtx } from "./ctx";

const T = { en: EN as unknown as UIStrings };
/** The route group's strings provider (app/(en)/layout.tsx). */
export default function Strings({ children }: { children: ReactNode }) {
  return <TCtx.Provider value={T}>{children}</TCtx.Provider>;
}
