import { NextResponse, type NextRequest } from "next/server";

/** Language from Accept-Language, in the visitor's order of preference: uk/ru → Ukrainian, anything else → English. */
export function preferredLang(header: string | null): "uk" | "en" | null {
  if (!header) return null;
  const langs = header.split(",")
    .map((part) => { const [tag, q] = part.trim().split(";q="); return { tag: tag.toLowerCase(), q: q ? +q : 1 }; })
    .filter((l) => l.tag && l.tag !== "*" && l.q > 0)
    .sort((a, b) => b.q - a.q);
  if (!langs.length) return null;
  return /^(uk|ru)\b/.test(langs[0].tag) ? "uk" : "en";
}

// First visit to a Ukrainian page: send visitors whose browser prefers another language to the English page.
// An explicit choice (the `lang` cookie set by the UA/EN switch) always wins; /en/... is never redirected.
export function proxy(req: NextRequest) {
  const chosen = req.cookies.get("lang")?.value;
  if (chosen === "uk" || chosen === "en" ? chosen === "uk" : preferredLang(req.headers.get("accept-language")) !== "en") return;
  const url = req.nextUrl.clone();
  url.pathname = "/en" + (url.pathname === "/" ? "" : url.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // pages only: not /en/…, Next internals or files with an extension (data, icons)
  matcher: ["/((?!en(?:/|$)|_next/|.*\\.).*)"],
};
