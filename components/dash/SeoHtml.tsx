"use client";
import type { ReactNode } from "react";

/** Server HTML for crawlers and screen readers, kept out of sight; readers see a loading line until the map has its data. */
export default function SeoHtml({ seo, loading }: { seo: ReactNode; loading: string }) {
  return <><div className="seo-only">{seo}</div><p className="map-src" style={{ padding: 16 }}>{loading}</p></>;
}
