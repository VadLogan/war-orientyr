# SEO Audit — warorientyr.com (entry: /en)

Date: 2026-10-17 · Business type: **Publisher** (bilingual daily war digest + long-form articles + data dashboard) · Stack: Next.js (static) on Vercel

## SEO Health Score: **54 / 100**

| Category | Weight | Score | Source |
|---|---|---|---|
| Technical SEO | 22% | 62 | findings/technical.md |
| Content Quality | 23% | 58 | findings/content.md |
| On-Page SEO | 20% | 48 | findings/content.md |
| Schema / Structured Data | 10% | 8 | findings/schema.md |
| Performance (CWV, lab) | 10% | 70 | findings/performance.md |
| AI Search Readiness | 10% | 60 | findings/geo.md (58) + findings/agentic.md (Good) |
| Images | 5% | 66 | findings/visual.md |

Supplementary (not weighted): SXO gap 53/100, Visual/mobile 82/100, Backlinks: insufficient data (domain absent from Common Crawl graph).

**Data limits:** no Google API key (PSI 429, no CrUX/GSC), no Moz/Bing keys, WebSearch ≠ live Google SERP. Performance is single-run Lighthouse lab data.

## Synthesis

**PERCEIVE.** Content is strong for a young site: every figure is attributed and timestamped, verification status is explicit, sources are listed per issue (27), no duplicate content between issues (0.01–0.12 overlap), full text is server-rendered, canonicals and uk/en hreflang are correct. Yet `warorientyr` returns nothing in search.

**ANALYZE.** The gap is not the content — it is that search engines cannot *find*, *pin* or *trust* it:
1. **Find** — no sitemap, no robots.txt, archive reachable only through a 12-step "Previous" chain (the issue selector isn't links).
2. **Pin** — today's issue has no dated URL (`/en/2026-10-17` → 404, `resolve()` in `lib/page.ts`). Content at `/en` is replaced daily and moves to a new URL tomorrow, so every link, citation and index entry to today's issue drifts. This is the single root cause behind findings in 5 of 10 specialist reports.
3. **Trust** — YMYL war/casualty topic with an anonymous publisher: no About/methodology/contact, no byline, no Organization schema, no off-site entity. Plus research-pipeline residue in copy ("rejected by the proxy (HTTP 400)", snapshot IDs as sources, "Assumption: …").

**CONNECT-system.** Dated latest URL → sitemap URLs are stable → schema `datePublished`/`url` are stable → citations stick. About page → Organization schema `publishingPrinciples` → Wikidata entity. Fix order follows this chain.

**Resolved conflict:** schema agent proposed `CollectionPage` for daily issues; technical/GEO/SXO proposed `NewsArticle`. Recommendation: **`NewsArticle`** — dated editorial roundups ("key events, day N") rank as news articles, and `CollectionPage` earns no search feature.

## Top 5 critical / high issues
1. No dated URL for the latest issue (canonical drifts daily) — `lib/page.ts` `resolve()`.
2. No `sitemap.xml` / `robots.txt` — add `app/sitemap.ts`, `app/robots.ts`.
3. No structured data anywhere (score 8) — NewsArticle, NewsMediaOrganization, WebSite, BreadcrumbList.
4. Anonymous publisher on a YMYL topic — About/Methodology/Corrections, byline, footer.
5. Mobile LCP 8.7 s on `/en` — caused by render-blocking Google Fonts and a 758 KB Noto Color Emoji font (79% of font bytes).

## Top 5 quick wins
1. `x-default` hreflang in `pageMeta()` (one line).
2. Entity-rich titles: "Ukraine war, day N (17 Oct 2026): <headline> · WAR·Orientyr" instead of "State of the war, <date>".
3. Meta description: stop `.slice(0,200)` mid-word; strip flag emoji; distinct dashboard descriptions (26 duplicate pairs).
4. OG/Twitter tags + default 1200×630 image on digest and dashboard pages.
5. Drop below-the-fold image preloads (~9 icons); add immutable cache headers for `/icons/*`, `/articles/*`.

## Technical SEO — 62
- ✅ HTTPS, single-hop http→https and www→apex 308; self-referencing canonicals; correct `<html lang>`; real 404s; SSR text.
- ❌ sitemap/robots 404 (High). ❌ only HSTS among security headers (Medium; add `headers()` in `next.config.mjs`).
- ⚠ `proxy.ts`: `Accept-Language: en` → 307 to `/en`; Googlebot (no header) gets 200. Add `Vary: Accept-Language, Cookie` on the redirect or skip it for bots (Medium).
- ⚠ Archived dashboards: thin chart shells duplicating digest descriptions — list only latest in sitemap, consider `noindex`.

## Content Quality — 58 · On-Page — 48
- E-E-A-T 41 (Experience 45, Expertise 50, Authority 25, Trust 45).
- Pipeline residue in copy (C-2) — rewrite and add a `validate` rule that rejects such strings.
- Readability: ~36 words/sentence, Flesch ≈ 23. Dates without year ("16.10") in quotable passages.
- Geran-4 article: 528 words vs 800+ competitors; no byline; doesn't link Militarnyi/RFE/RL; doesn't reconcile 105 components vs GUR's ~55.
- "Word from the swamps" heading is opaque to English readers.

## Schema — 8
Zero JSON-LD/Microdata/RDFa. Templates in findings/schema.md (escape `<` as `<`; use a constant `https://warorientyr.com`, not `VERCEL_PROJECT_PRODUCTION_URL`). Add optional `author`, `published`, `modified` to article types.

## Performance — 70 (lab, mobile)
| | /en | /en/dashboard |
|---|---|---|
| LCP | 8.7 s ❌ | 2.9 s ⚠ |
| CLS | 0.004 ✅ | 0.002 ✅ |
| TBT (INP proxy) | 0 ms ✅ | 30 ms ✅ |
LCP element is text (`p.lede`). Fonts are the bottleneck. **Caution:** English house style uses country flags and Windows has no flag emoji — replace the Noto Color Emoji webfont with inline SVG flags, not native emoji.

## AI Search Readiness — 60
GEO 58 (Citability 74, Structure 62, Multimodal 50, Authority 25, Tech 72). All AI crawlers implicitly allowed; no llms.txt. Accessibility tree clean (0 unnamed of 83 interactive). Losses/directions as lists, not tables; headings are labels.

## Images — 66
100% alt coverage. No OG on home/issue pages. Hero `geran4.jpg` 217 KB JPEG 1312px shown at ~330px, no srcset/AVIF, no width/height. Tap targets <44px (issue arrows, lang select, tabs); low-contrast captions.

## SXO — 53
Format matches the SERP (dated daily roundups). Winnable: day-number/date queries, dashboard data long-tail, source-divergence, specific Geran-4 angles. Not winnable: "russia strikes ukraine today", "shahed geran drone" head terms.

## Backlinks — insufficient data
Not in Common Crawl graph. Register GSC + Bing WMT; pitch datasets/explainers to OSINT/journalists; embeddable charts with attribution.
