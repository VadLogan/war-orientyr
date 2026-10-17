# Performance findings (lab only, no CrUX) - 2026-10-17

Method: Lighthouse 13.5.0 CLI, mobile emulation, simulated throttling, one run per URL (PSI API was rate-limited). Lab data is a single run; no field data available. INP not measurable in lab; TBT is the proxy.

## Score: 70/100 (en 58, en/dashboard 92)

| Metric | /en | /en/dashboard | Status |
|---|---|---|---|
| Lighthouse perf | 58 | 92 | |
| FCP | 7.3 s | 2.5 s | /en poor |
| LCP | 8.7 s (element: p.lede text, not an image) | 2.9 s | /en fail, dash needs improvement |
| TBT (INP proxy) | 0 ms | 30 ms | pass |
| CLS | 0.004 | 0.002 | pass |
| TTFB | 30 ms | 40 ms | pass |
| Transfer | 1,506 KiB, 47 req | 1,577 KiB, 57 req | heavy |
| JS | 189 KB, 14 files | 220 KB, 15 files | OK |
| DOM | 617 elements | 1,470 elements | OK (dash near 1,500) |

## Root cause (/en LCP 8.7 s)
Server and JS are fine. The LCP text paints late because the render is blocked by two Google Fonts stylesheets (components/Html.tsx lines 13-14) and the page then pulls ~950 KB of fonts:
- Noto Color Emoji (flag emoji, even with `&text=` subset) font file = 758 KB, 79% of all font bytes. Cache TTL only 24 h (Google).
- Literata woff2 86 KB + 48 KB, plus IBM Plex files.
- Lighthouse render-blocking insight: est. 6.2 s savings on /en (emoji CSS 794 ms, Literata CSS 157 ms, in simulated mobile; chain also waits on fonts.googleapis then gstatic).
- Fonts total 957 KB of 1,506 KB page weight; images only 298 KB.

## Findings and fixes (by impact)
1. HIGH - Remove Noto Color Emoji webfont (758 KB, render-blocking CSS). Flags are rendered by OS emoji anyway; if Windows flag support is needed, use inline SVG/CSS flag images (e.g. flag-icons subset, or the same `/icons` pattern) for the ~30 countries used. Expect LCP /en about 8.7 s -> ~3 s.
2. HIGH - Self-host fonts via `next/font` (Literata, IBM Plex Sans Condensed, IBM Plex Mono): removes 2 cross-origin render-blocking requests and preconnect, adds immutable caching, `font-display: swap`, size-adjust fallback. Subset to latin + cyrillic; drop unused italic/weights (Literata italic 700/400 variable axes opsz 7..72 inflate size; pin opsz or use fewer weights).
3. MEDIUM - Hero image `/articles/2026-10-17/geran4/geran4.jpg` is 217 KB JPEG with `cache-control: max-age=0, must-revalidate`. Convert to AVIF/WebP at rendered width (~400 px mobile, 2 sizes via `srcset`), target <60 KB. Add `Cache-Control: public, max-age=31536000, immutable` for `/articles/*` and `/icons/*` via `headers()` in next.config (use hashed or dated paths, which already include the date).
4. MEDIUM - Trim the ~10 `<link rel="preload" as="image">` tags on /en. Only the first above-the-fold image deserves preload (LCP here is text, so even that is optional). Section icons below the fold (sec-react, sec-kremlin, person-*) compete with CSS/fonts for bandwidth on mobile. Use `loading="lazy"` for below-fold icons, remove preloads for them (if emitted by next/image `priority` or `preload` props, drop them).
5. MEDIUM - `/icons/sec-react.svg` is 73 KB raw (35 KB transferred) and sec-front 18 KB; run SVGO or convert to WebP (other icons are already WebP 5-7 KB). Likely embedded raster in the SVG.
6. LOW - Largest JS chunk `3iagq5j-mh_2n.js` 74 KB: 29 KB unused, 14 KB legacy polyfills (Array.prototype.at etc.). Set modern `browserslist` (Chrome 111+/Safari 16.4+) to drop polyfills.
7. LOW - Dashboard: 1,470 DOM elements (limit guidance 1,500); it also fetches `maps.json` (44 KB) and `strikes.json` (22 KB) on load plus 18 RSC/fetch requests (154 KB). Lazy-load maps JSON only when Maps panel is visible (IntersectionObserver); consider `content-visibility: auto` on offscreen panels to keep INP safe as the DOM grows. Dashboard LCP 2.9 s will mostly be fixed by fixes 1-2.
8. LOW - Document served with `max-age=0, must-revalidate` (fine for static HTML on Vercel, Vercel edge-caches it; TTFB 30 ms). HTML is 27 KB compressed (165 KB raw); acceptable.
9. Prefetch noise: Next prefetches `/en?_rsc` and `/en/2026-10-16?_rsc` (~20 KB each) on the homepage; consider `prefetch={false}` for archive/issue-select links.

## Expected after fixes 1-2
/en: LCP ~2.5-3 s lab (mobile sim), score ~85-92; dashboard LCP <2.5 s, score ~95+. CLS and TBT already good; keep them so (reserve image sizes, which is already done).

## Passing
CLS 0.004, TBT 0-30 ms, TTFB 30-40 ms, text compression, no redirects, minified JS, font-display ok, no layout-shifting images, DOM size OK.

Raw data: scratchpad lh_en.json, lh_en_dashboard.json (Lighthouse 13.5.0).
