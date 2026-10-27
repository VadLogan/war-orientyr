import { NextResponse, type NextRequest } from "next/server";
import type { Lang } from "@/lib/ui";

/** Language from Accept-Language, in the visitor's order of preference: uk/ru → Ukrainian, de → German, anything else → English. */
export function preferredLang(header: string | null): Lang | null {
  if (!header) return null;
  const langs = header.split(",")
    .map((part) => { const [tag, q] = part.trim().split(";q="); return { tag: tag.toLowerCase(), q: q ? +q : 1 }; })
    .filter((l) => l.tag && l.tag !== "*" && l.q > 0)
    .sort((a, b) => b.q - a.q);
  if (!langs.length) return null;
  return /^(uk|ru)\b/.test(langs[0].tag) ? "uk" : /^de\b/.test(langs[0].tag) ? "de" : "en";
}

// First visit to a Ukrainian page: send visitors whose browser prefers another language to the English or German page.
// An explicit choice (the `lang` cookie set by the language picker) always wins; /en/... and /de/... are never redirected.
export function proxy(req: NextRequest) {
  // Only real page loads. Next's background fetches (link prefetch, RSC payloads) must not be redirected — a redirected
  // prefetch of the UA link sent the click straight back to /en. Next strips its own rsc markers before proxy runs,
  // so use the browser's Sec-Fetch-Dest (`document` for navigations, `empty` for fetch); no header (curl, old clients) = page.
  const dest = req.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return;
  const chosen = req.cookies.get("lang")?.value;
  const lang = chosen === "uk" || chosen === "en" || chosen === "de" ? chosen : preferredLang(req.headers.get("accept-language")) ?? "uk";
  if (lang === "uk") return;
  const url = req.nextUrl.clone();
  url.pathname = "/" + lang + (url.pathname === "/" ? "" : url.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // pages only: not /en/…, /de/…, Next internals or files with an extension (data, icons)
  matcher: ["/((?!en(?:/|$)|de(?:/|$)|_next/|.*\\.).*)"],
};
