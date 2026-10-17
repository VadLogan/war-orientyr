# Sitemap audit: https://warorientyr.com

**Score: 5/100 for sitemap/robots (both missing).** Cheap to fix: ~60 lines, no new dependencies.

## Validation report

| Check | Result | Severity |
|---|---|---|
| /sitemap.xml exists | FAIL (404, verified with curl) | Critical |
| /robots.txt exists | FAIL (404, verified) | High |
| Sitemap declared in robots.txt | FAIL (no file) | High |
| XML validity, URL status codes, deprecated tags, lastmod | N/A (nothing to validate) | n/a |
| 50k URL / 50MB limit | N/A. Projected size: 13 issues x 4 routes + 2 home + articles x 2 = ~56 URLs if everything is listed (30 with the recommended set), ~1 more issue x 4 per day (about 1,500 URLs/year). One file is fine for years. | Pass |
| hreflang alternates | Present in page `<head>` (`pageMeta`: uk, en, canonical) but not in a sitemap. No `x-default` anywhere. | Low |
| Location page gate | N/A, no location pages | Pass |

## Facts from the code that shape the sitemap

- **The latest issue has no dated URL.** `resolve()` calls `notFound()` when `seg[0] === latest.date`, so `/2026-10-17` is a 404 and the canonical is `/`. The sitemap must build URLs with `href(lang, view, date, latest)`. Never hand-concatenate `/${date}`, or the latest issue is listed as a 404.
- Current inventory: 13 issues (2026-10-05 to 2026-10-17), 1 article (`2026-10-17/geran4`, has `article.uk.json` and `article.en.json`).
- Article pages exist only where `article.uk.json` exists. `getArticle()` returns `article: null` otherwise, so skip those. The `/en` article falls back to Ukrainian text when `article.en.json` is missing. In that case list the EN URL but leave out the hreflang pair, or the EN URL is a duplicate of the UK content.
- An article preview with an external `url` still has an internal page if `article.uk.json` exists. Include it.
- `proxy.ts` redirects UA pages to /en only for browsers whose Accept-Language is non-uk/ru. Googlebot sends none, so it is not redirected. Still, sitemap URLs should be the exact canonical ones, with no redirect hops. `/sitemap.xml` and `/robots.txt` contain a dot, so the proxy matcher skips them.
- `metadataBase` depends on `VERCEL_PROJECT_PRODUCTION_URL`. In the sitemap use a fixed constant for the canonical origin, because preview deployments would otherwise emit preview hosts. Check that the apex/www choice matches the canonical host.
- Dashboard pages (`/dashboard/*`, `/en/dashboard/*`) are client-rendered trees. Their initial HTML is server-rendered, so they are indexable. Keep them in the sitemap at lower value, or noindex them. This is a product decision. Recommendation: keep only the latest dashboard pair in the sitemap, because the archive is near-duplicate chart shells (thin-content risk grows by 2 pages a day).
- Do not use `priority` or `changefreq` (Google ignores them). Do not use `new Date()` for lastmod, since every build would claim every page changed.

## Recommended implementation (drafts, repo not modified)

### app/sitemap.ts

```ts
import type { MetadataRoute } from "next";
import { getArticleDirs, getDates, getLatest } from "@/lib/data";
import { articleHref, href, type View } from "@/lib/routes";

export const SITE = "https://warorientyr.com"; // ponytail: hardcoded, move to env if a staging host needs it
const abs = (p: string) => SITE + (p === "/" ? "" : p);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latest = (await getLatest()).date;
  const dates = await getDates();
  const out: MetadataRoute.Sitemap = [];

  const pair = (view: View, date: string) => {
    const uk = abs(href("uk", view, date, latest)), en = abs(href("en", view, date, latest));
    const alternates = { languages: { uk, en, "x-default": uk } };
    out.push({ url: uk, lastModified: date, alternates }, { url: en, lastModified: date, alternates });
  };
  for (const d of dates) pair("digest", d);
  pair("dashboard", latest); // archive dashboards omitted on purpose (near-duplicate shells)

  for (const a of await getArticleDirs()) {
    if (!a.files.includes("article.uk.json")) continue; // no page generated without it
    const uk = abs(articleHref("uk", a.date, a.name)), en = abs(articleHref("en", a.date, a.name));
    const hasEn = a.files.includes("article.en.json");
    const alternates = hasEn ? { languages: { uk, en, "x-default": uk } } : undefined;
    out.push({ url: uk, lastModified: a.date, alternates });
    out.push({ url: en, lastModified: a.date, alternates }); // EN falls back to UA text; drop this line to omit
  }
  return out;
}
```

`alternates.languages` requires Next 14.2+ and is emitted as `xhtml:link` entries. Both language URLs must list the full set (reciprocal), which the code does.

Optional `lastModified` caveat: the issue date is a day string (valid W3C date). If a correction is published for the same date it is not reflected. Acceptable.

### app/robots.ts

```ts
import type { MetadataRoute } from "next";
import { SITE } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: [`${SITE}/sitemap.xml`, `${SITE}/news-sitemap.xml`] };
}
```

If the Next version has a problem exporting a non-default const from `sitemap.ts`, move `SITE` to `lib/routes.ts` (preferred anyway, since `lib/page.ts` `metadataBase` could then reuse it).

### Google News sitemap (optional, last 48h)

Recommendation: **skip unless the site is (or plans to be) in Google News Publisher Center.** News sitemaps only matter for publishers accepted into Google News, and require a `publication` name and language, a real article title, and `publication_date`. The digest is one issue per day, so at most 2 issues fall into a 48h window. If wanted, it is simple as a route handler (app/news-sitemap.xml/route.ts), because `MetadataRoute.Sitemap` does not support the `news:` namespace:

```ts
import { getDates, getIssue, getLatest } from "@/lib/data";
import { href } from "@/lib/routes";
import { SITE } from "@/lib/routes";

export const dynamic = "force-static";
const esc = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function GET() {
  const latest = (await getLatest()).date;
  const cutoff = Date.now() - 48 * 3600e3;
  const recent = (await getDates()).filter((d) => Date.parse(d + "T00:00:00Z") >= cutoff - 24 * 3600e3);
  const items = await Promise.all(recent.map(async (d) => {
    const uk = await getIssue(d, "uk"), en = await getIssue(d, "en");
    return [["uk", uk], ["en", en]].map(([lang, D]: any) => `<url><loc>${SITE}${href(lang, "digest", d, latest)}</loc>` +
      `<news:news><news:publication><news:name>WAR·Орієнтир</news:name><news:language>${lang}</news:language></news:publication>` +
      `<news:publication_date>${d}</news:publication_date><news:title>${esc(D.headline?.title ?? d)}</news:title></news:news></url>`).join("");
  }));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } });
}
```

Caveats: statically built, so the 48h window freezes at build time. The site is rebuilt for each daily publish, which is fine, but a stale window can linger if no deploy happens. `publication_date` should ideally be a full ISO datetime with the real publish time (the data only has a date). Keep the cap at 1,000 URLs (never reached). Remove from robots.ts if not shipped.

## Other issues found

1. **High:** add `app/robots.ts` (above). It also currently 404s, so crawlers get no sitemap pointer. Also submit the sitemap in Search Console.
2. **Medium:** no `x-default` hreflang in `pageMeta`. Add `"x-default": url("uk")` to `alternates.languages` in `lib/page.ts` so on-page and sitemap signals agree. Check `articleMeta` in `components/ArticlePage.tsx` for the same (not read in detail).
3. **Medium:** `metadataBase` falls back to `http://localhost:3000` when `VERCEL_PROJECT_PRODUCTION_URL` is unset (local build). Use the shared `SITE` constant.
4. **Low:** archive dashboards double the URL count with low-value pages; decide on noindex vs sitemap exclusion.
5. **Low:** after deploy verify with `curl -s https://warorientyr.com/sitemap.xml | head`, that every `<loc>` returns 200 with no redirect (especially that the latest date is `/`, not `/2026-10-17`), and that the output validates in Search Console.

## Expected result

26 digest + 2 dashboard + 2 article = **30 URLs**, one file, hreflang alternates on each.
