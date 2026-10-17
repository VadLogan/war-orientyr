import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Lang } from "@/lib/ui";
import { SITE_NAME as SITE } from "@/lib/routes";
import "@/app/globals.css";

/** Root metadata per language: the site name, and the template pages' titles are wrapped in. */
export const siteMeta = (lang: Lang): Metadata => ({ title: { default: SITE[lang], template: `%s · ${SITE[lang]}` } });
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const FONTS = [
  "https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;0,7..72,700;1,7..72,400&family=IBM+Plex+Sans+Condensed:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
];


/** Shared <html> shell of the two root layouts: app/(uk) and app/(en) (one per language, so <html lang> is static). */
export default function Html({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="msvalidate.01" content="05206C1F0F480326CDF27A942C7B967E" />
        {FONTS.map((href) => (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
