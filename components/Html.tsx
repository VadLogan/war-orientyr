import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Lang } from "@/lib/ui";
import { SITE_NAME as SITE, SITE_TAG } from "@/lib/routes";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed, Literata } from "next/font/google";
import "@/app/globals.css";

/** Root metadata per language: the site name, and the template pages' titles are wrapped in. */
export const siteMeta = (lang: Lang): Metadata => ({ title: { default: `${SITE[lang]} — ${SITE_TAG[lang]}`, template: `%s | ${SITE[lang]}` } });
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

// fonts served from the site itself (next/font): no render-blocking stylesheet from another origin, and size-matched
// local fallbacks so text doesn't jump when they arrive. Not preloaded: each would preload every subset; text shows at
// once in the fallback (swap). latin-ext: Polish/Czech names (ł, š) in the text.
const serif = Literata({ subsets: ["latin", "latin-ext", "cyrillic"], style: ["normal", "italic"], axes: ["opsz"], display: "swap", preload: false, variable: "--f-serif" });
// (IBM Plex Sans Condensed has no basic Cyrillic on Google Fonts: Ukrainian UI text uses the Arial Narrow fallback, as before)
const ui = IBM_Plex_Sans_Condensed({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], display: "swap", preload: false, variable: "--f-ui" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["400", "500"], display: "swap", preload: false, variable: "--f-mono" });


/** Shared <html> shell of the two root layouts: app/(uk) and app/(en) (one per language, so <html lang> is static). */
export default function Html({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${serif.variable} ${ui.variable} ${mono.variable}`}>
      <head>
        <meta name="msvalidate.01" content="05206C1F0F480326CDF27A942C7B967E" />
      </head>
      <body>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
