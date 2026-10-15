"use client";
import type { Lang } from "@/lib/ui";

/** UA/EN switch: remembers the choice so proxy.ts stops redirecting by browser language. A plain <a> on purpose:
 *  each language has its own root layout, so switching is a full page load anyway — no prefetch, no client router. */
export default function LangLink({ lang, href, current, children }: { lang: Lang; href: string; current: boolean; children: React.ReactNode }) {
  return (
    <a href={href} hrefLang={lang} aria-current={current ? "page" : undefined}
      onClick={() => { document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`; }}>
      {children}
    </a>
  );
}
