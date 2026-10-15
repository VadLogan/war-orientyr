"use client";
import Link from "next/link";
import type { Lang } from "@/lib/ui";

/** UA/EN switch link: remembers the choice so proxy.ts stops redirecting by browser language. */
export default function LangLink({ lang, href, current, children }: { lang: Lang; href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} hrefLang={lang} aria-current={current ? "page" : undefined}
      onClick={() => { document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`; }}>
      {children}
    </Link>
  );
}
