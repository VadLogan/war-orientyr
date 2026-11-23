"use client";
import type { ReactNode } from "react";
import type { UIStrings } from "@/lib/ui";
import { UK } from "@/lib/ui-uk";
import { TCtx } from "./ctx";

const T = { uk: UK };
/** The route group's strings provider (app/(uk)/layout.tsx). */
export default function Strings({ children }: { children: ReactNode }) {
  return <TCtx.Provider value={T}>{children}</TCtx.Provider>;
}
