# Technical SEO findings: warorientyr.com (focus /en)
Date: 2026-10-17. Technical score: **62/100**

## Category status
| Category | Status |
|---|---|
| Crawlability | FAIL (no robots.txt, no sitemap) |
| Indexability | PASS with gaps (canonicals fine, hreflang lacks x-default, no OG) |
| Security | PARTIAL (HTTPS+HSTS ok; no CSP/XFO/nosniff/Referrer/Permissions) |
| URL structure | PASS |
| Mobile | PASS (viewport present, viewport-fit=cover) |
| Core Web Vitals (source) | PARTIAL (see M3) |
| Structured data | FAIL (none) |
| JS rendering | PASS (SSR/static HTML, h1 + content in raw HTML, 166 KB) |
| IndexNow | Not implemented |

## Critical / High
**H1. No sitemap.xml (High).** Evidence: sitemap_discovery.py found nothing; /sitemap.xml, /sitemap_index.xml, /sitemap-index.xml all 404; no robots declaration. For a daily-growing archive of dated URLs (UA+EN, digest+dashboard+articles) this is the main discovery path. Fix: add `app/sitemap.ts` using `getDates()` from lib/data.ts and `href()` from lib/routes.ts; emit for each date: uk/en digest (latest = `/` and `/en`, not the dated URL, as dated latest 404s), dashboard variants, and articles (folders with article.uk.json). Include `alternates.languages` per entry and `lastModified` = issue date. Note: `dateParams()` excludes the latest date from dated routes, so the sitemap must use the bare URL for it.

**H2. No robots.txt (High, 404).** Fix: `app/robots.ts` with `rules: {userAgent:"*", allow:"/"}`, `sitemap: "https://warorientyr.com/sitemap.xml"`; decide explicitly on AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot). Disallow nothing under /_next/ (Google needs CSS/JS).

**H3. No structured data (High for news/publisher).** No JSON-LD anywhere. Fix in `components/DigestPage.tsx` (digest) and `components/ArticlePage.tsx`: `NewsArticle` (headline = dateTitle, datePublished/dateModified = D.date, inLanguage, image, publisher Organization, mainEntityOfPage = canonical); site-wide `WebSite` + `Organization` in layout; `BreadcrumbList` on dashboard/articles; `Dataset` for the dashboard (losses/strikes data) is a strong fit.

## Proxy / Googlebot analysis (proxy.ts)
Tested live:
- `GET /` with Googlebot UA, no Accept-Language: **200** (UA page). `preferredLang(null)` returns null, so no redirect. Good.
- `GET /` with `Accept-Language: en-US,en`: **307 -> /en** (verified). `Accept-Language: uk`: 200.
- Googlebot normally sends no Accept-Language (or en for some fetchers), and sends no cookie. Risk is moderate: any crawler or Google fetcher sending `Accept-Language: en` (e.g. some Search Console tools, Bing, preview/translation fetchers, AI bots) gets 307 from every UA URL, so UA pages may be fetched as /en with the UA canonical never seen. Canonicals/hreflang are self-consistent, so it does not corrupt indexing, but it is the documented anti-pattern (Google: do not auto-redirect by language; locale-adaptive crawling).
- **M1 (Medium).** Also the 307 has no `Vary: Accept-Language, Cookie`; `/` is CDN-cached (x-vercel-cache HIT, age 2814) so cache keys may serve inconsistent results. The static pages are served from a prerender; the proxy runs before cache, so OK in practice, but add `Vary: Accept-Language, Cookie` to the redirect response.
- Recommended fix in `proxy.ts`: skip redirect for known bots (`/bot|crawl|spider|slurp|bing|google|yandex|facebookexternalhit|twitterbot|linkedin|gpt|claude|perplexity/i` on user-agent), or drop the redirect and show a non-blocking "Read in English" banner. A banner is the safest option. Also keep the 307 (temporary), already correct.

## Medium
**M2. hreflang lacks x-default.** Present: uk, en, reciprocal and self-referencing, absolute URLs, matching canonicals (verified on /en and /en/2026-10-16). Missing `x-default`. Fix in `lib/page.ts` pageMeta: `languages: { uk, en, "x-default": url("uk") }` (or en, given the redirect behaviour). Same needed in ArticlePage metadata if separate.

**M3. Render-blocking third-party fonts / CWV risk.** `components/Html.tsx` loads two Google Fonts stylesheets via `<link rel=stylesheet>` (render-blocking, extra origin; preconnect to fonts.googleapis.com only, not fonts.gstatic.com crossorigin). Page weight 166 KB HTML (205 KB UA), 19 scripts, 10 preloaded images including 9 section icons (LCP candidate dilution; only the hero image `/articles/.../geran4.jpg` should be high priority). Fix: use `next/font/google` (self-hosted, `display: swap`, size-adjust to avoid CLS), drop the emoji font subset in favour of SVG flags or keep with font-display swap; remove preloads for below-the-fold icons; add `fetchPriority="high"` only on the hero. Dashboard (d3, charts) is client-side: monitor INP; keep lazy-loaded Maps.

**M4. No Open Graph / Twitter Card tags.** 0 `og:` and 0 `twitter:` tags. Hurts social sharing and some AI/link preview. Fix in `pageMeta`: add `openGraph {type:"article", title, description, url, siteName, locale, alternateLocale, images}` and `twitter {card:"summary_large_image"}`; a default OG image (1200x630) for dates without article image. Next can auto-generate with `app/opengraph-image.tsx`.

**M5. Meta description is the headline only.** `/en` description: "Trump suspended the 'hellish sanctions'..." (headline.title, up to 200 chars cut). Acceptable; improve by appending site name/date or keep to 150-160 chars to avoid truncation (`slice(0,200)` can cut mid-word; truncate at word boundary).

**M6. Security headers missing.** Only `strict-transport-security: max-age=63072000` (no includeSubDomains/preload). Absent: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy. Also `access-control-allow-origin: *` on HTML pages (Vercel static default; narrow if not needed). Fix: add `headers()` in `next.config.mjs` for `/(.*)`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, and a CSP allowing fonts.googleapis.com/gstatic, va.vercel-scripts.com (Analytics/Speed Insights), `'unsafe-inline'` for Next inline scripts (or nonce).

**M7. Dashboard titles/descriptions near-duplicate with digest.** `/en/dashboard` title = "State of the war, 17 October 2026 · Dashboard · Daily war digest"; canonical self-referencing, fine. But the description is the same headline as the digest page (pageMeta uses D.headline for both views). Fix: view-specific description for `dashboard` in pageMeta. Also dashboard pages for every archived date create many thin, near-duplicate, data-only pages; consider `noindex` for archived dashboards (keep latest) or ensure unique text.

**M8. Hundreds of `<title>` elements inside inline SVG charts.** /en has dozens of SVG `<title>` ("5.10: 84", "Mar 26: killed 216 ..."), not harmful but they are duplicate `<title>` tags in document and may confuse naive parsers. Fix: use `<desc>` or `aria-label`/`<text>` tooltips, or keep as is (Google uses the head title). Low risk.

## Low
- **L1. llms.txt missing (404).** Optional; add `public/llms.txt` summarising sections and listing latest issue + archive index.
- **L2. IndexNow not implemented.** Daily news content benefits: add key file `public/<key>.txt` and ping `https://api.indexnow.org/indexnow` from the `publish` script (scripts/) after deploy.
- **L3. News sitemap.** After H1, consider a Google News-format sitemap (`news:publication`) for items < 2 days old if applying to Google News/Discover.
- **L4. Canonical host.** http -> https 308 and www -> apex 308 verified. Good.
- **L5. Cache-Control `public, max-age=0, must-revalidate`** on HTML: fine (ETag revalidation). Static assets `/_next/static/immutable`. Check `/icons/*` and `/articles/*` images have long cache; add headers() for them if not.
- **L6. Dated URL for latest issue 404s by design** (`/2026-10-17` 404, `/` canonical). Consequence: every day the "latest" content moves from `/` to `/YYYY-MM-DD` with a new canonical. Old links to `/` change meaning; consider Link/rel `prev`-style navigation and sitemap lastmod on `/`. Not a bug, but external links to `/2026-10-17` made before it became archive... that URL becomes 200 only after the next issue. Prefer making the latest date also resolve (200, canonical -> `/`), avoiding 404 for shared dated links; edit `resolve()` in lib/page.ts (remove `seg[0] === latest.date` notFound) and keep `dateParams()` including it.
- **L7. 404 handling.** `/en/2099-01-01` returns real 404 (good); `global-not-found` enabled.

## Passing checks
- HTTPS everywhere, HTTP/2, HSTS present, redirects single-hop.
- Self-referencing canonical, absolute URLs; `metadataBase` from `VERCEL_PROJECT_PRODUCTION_URL` (ensure env set to warorientyr.com custom domain: verified canonical output is correct).
- `<html lang="en">` / `uk` static per route group.
- Viewport meta, manifest, icons present.
- Server-rendered content: h1 present, full text in raw HTML; no CSR dependency for digest.
- Clean lowercase, hyphenated, date-based URLs; language switch uses real `<a href hrefLang>` links.

## Score rationale (62)
Base 100: -12 no sitemap, -8 no robots.txt, -8 no structured data, -4 no x-default, -3 proxy bot risk, -3 OG missing, -4 security headers, -2 CWV font/preload, -2 dashboards duplicate meta, -2 misc low.
