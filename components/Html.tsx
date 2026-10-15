import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Lang } from "@/lib/ui";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Щоденний дайджест війни",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const FONTS = [
  "https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap&text=%F0%9F%87%A6%F0%9F%87%AA%F0%9F%87%A6%F0%9F%87%B9%F0%9F%87%A7%F0%9F%87%AA%F0%9F%87%A7%F0%9F%87%BE%F0%9F%87%A8%F0%9F%87%A6%F0%9F%87%A8%F0%9F%87%AD%F0%9F%87%A8%F0%9F%87%B3%F0%9F%87%A8%F0%9F%87%BF%F0%9F%87%A9%F0%9F%87%AA%F0%9F%87%A9%F0%9F%87%B0%F0%9F%87%AA%F0%9F%87%AA%F0%9F%87%AA%F0%9F%87%B8%F0%9F%87%AA%F0%9F%87%BA%F0%9F%87%AB%F0%9F%87%AE%F0%9F%87%AB%F0%9F%87%B7%F0%9F%87%AC%F0%9F%87%A7%F0%9F%87%AC%F0%9F%87%AA%F0%9F%87%AD%F0%9F%87%BA%F0%9F%87%AE%F0%9F%87%B1%F0%9F%87%AE%F0%9F%87%B3%F0%9F%87%AE%F0%9F%87%B7%F0%9F%87%AE%F0%9F%87%B9%F0%9F%87%AF%F0%9F%87%B5%F0%9F%87%B0%F0%9F%87%B5%F0%9F%87%B1%F0%9F%87%B9%F0%9F%87%B1%F0%9F%87%BB%F0%9F%87%B2%F0%9F%87%A9%F0%9F%87%B3%F0%9F%87%B1%F0%9F%87%B3%F0%9F%87%B4%F0%9F%87%B5%F0%9F%87%B1%F0%9F%87%B6%F0%9F%87%A6%F0%9F%87%B7%F0%9F%87%B4%F0%9F%87%B8%F0%9F%87%A6%F0%9F%87%B8%F0%9F%87%AA%F0%9F%87%B8%F0%9F%87%B0%F0%9F%87%B9%F0%9F%87%B7%F0%9F%87%BA%F0%9F%87%A6%F0%9F%87%BA%F0%9F%87%B8",
  "https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;0,7..72,700;1,7..72,400&family=IBM+Plex+Sans+Condensed:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
];


/** Shared <html> shell of the two root layouts: app/(uk) and app/(en) (one per language, so <html lang> is static). */
export default function Html({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
