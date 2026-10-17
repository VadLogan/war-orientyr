# Action Plan — warorientyr.com

Each item: **fix** · depends on · how we'd know it failed · leading indicator.

## Phase 1 — Critical (week 1)
1. **Dated URL for the latest issue** — `lib/page.ts` `resolve()`/`dateParams()`: generate `/<latest>` and `/en/<latest>`; make the dated URL canonical; `/` and `/en` stay as "latest" (canonical → dated URL).
   · unblocks 2, 3 · fails if `curl -I /en/<today>` ≠ 200 or canonical of `/en` ≠ dated URL · GSC "Duplicate, Google chose different canonical" stays at 0.
2. **`app/sitemap.ts` + `app/robots.ts`** — all issues (dated URLs), latest dashboard pair, articles with `article.uk.json`; uk/en/x-default alternates; `lastModified` = issue date; constant `SITE`.
   · needs 1 · fails if any `<loc>` ≠ 200 or redirects · GSC Sitemaps "Discovered" ≈ URL count; Pages "Indexed" rising.
3. **Register Google Search Console + Bing Webmaster Tools**, submit sitemap.
   · needs 2 · fails if sitemap shows errors · first impressions within 2–4 weeks.

## Phase 2 — High impact (weeks 2–3)
4. **JSON-LD**: NewsMediaOrganization + WebSite (layout), NewsArticle (digest + articles), BreadcrumbList. Templates in findings/schema.md.
   · needs 1, benefits from 6 · fails if Rich Results Test errors · GSC Enhancements shows valid items.
5. **Fonts**: replace Noto Color Emoji webfont with inline SVG flags; self-host Literata/IBM Plex via `next/font` (latin+cyrillic, used weights only).
   · independent · fails if lab LCP on /en > 4 s · PSI mobile LCP < 2.5 s; CrUX once traffic exists.
6. **About / Methodology / Corrections pages + footer (`Shell.tsx`) + editor byline.**
   · unblocks 4's `publishingPrinciples`, 10 · fails if pages are thin (<300 words) · branded queries appear in GSC.
7. **Titles & descriptions** in `pageMeta()`: entity-rich titles ≤60 chars, word-boundary description, no emoji, distinct dashboard copy; `x-default` hreflang; OG/Twitter + default 1200×630 image.
   · independent · fails if titles still template-only · GSC CTR per page.
8. **Clean pipeline residue** from copy (proxy errors, snapshot IDs, "Assumption:") + `validate` rule rejecting them.
   · independent · fails if `npm run validate` passes a digest containing "HTTP 400".

## Phase 3 — Content & authority (month 2)
9. Real archive links (crawlable list/calendar instead of select-only); `<time datetime>`; year in first date per block; losses/directions as tables; "24h in numbers" strip.
10. Off-site entity: Wikidata item, Telegram/LinkedIn linked from footer and `sameAs`.
11. Geran-4 article: expand, link sources, explain 105 vs ~55 components; English heading for "Word from the swamps".
12. Images: next/image or AVIF/WebP + srcset + width/height; immutable cache for `/icons/*`, `/articles/*`; drop below-fold preloads; SVGO `sec-react.svg`.
13. Security headers via `next.config.mjs` `headers()`; `Vary` on the language redirect.

## Phase 4 — Monitoring (ongoing)
14. `llms.txt`; IndexNow ping in `npm run publish`; optional Google News sitemap if joining Publisher Center.
15. Add Google API key and Moz key, rerun `/seo audit` for CrUX/GSC/backlink data; `/seo drift baseline https://warorientyr.com/en` after Phase 1.
16. Tap targets ≥44px, caption contrast.
