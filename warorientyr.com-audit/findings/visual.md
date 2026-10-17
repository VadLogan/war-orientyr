# Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

Screenshots (desktop 1920, laptop, tablet, mobile 375): screenshots/home/ and screenshots/geran4/

Scores: Visual/Mobile 82/100, Images 66/100

## Visual / mobile
- viewport meta is correct (width=device-width, initial-scale=1, viewport-fit=cover). No zoom lock.
- Mobile render of both pages is clean. No horizontal overflow, overlap or clipping visible in screenshots.
- Above the fold (mobile home): logo, Digest/Dashboard tabs, language select, issue picker, day counters, date, H1, start of lede. H1 is visible. There is no CTA, which is acceptable for a content digest. The first article card sits below the lede, so mobile users must scroll past ~1 screen of header/H1/lede to reach content cards.
- Article page: H1, lede, issue link and hero image (about 330px wide, 16:9) all show within about 1.3 screens. Back link is small.
- Typography is good. Body is a serif at about 17-18px and the H1 is large. Metadata text (monospace "13 issues in the archive", "ISSUE", image caption) is smaller, about 12-13px, and the caption is grey on grey (low contrast).
- Tap targets (estimated from the 2x screenshot, under 44-48px):
  - Issue prev/next arrows: about 23x37px. Too narrow.
  - Language select (ENG): about 34px tall.
  - "Back" link and "Issue of ..." link: text links about 20px tall with little padding.
  - Digest/Dashboard tabs: about 36px tall. Borderline.
- Header takes about 25% of the first mobile viewport (brand, tabs, lang, issue row, counters). Consider compacting or making it sticky only on scroll.
- Not measured: the DOM tap-target and font-size scan did not run because playwright is not installed in the system python.

## Images
- Home /en has no og:*, twitter:* or og:image tags at all. Only title, description, canonical, hreflang, manifest and icons are present. Every shared link to the digest renders without a preview card. HIGH priority.
- The article page has og:title, og:description, og:image (absolute URL, geran4.jpg), twitter:card=summary_large_image and twitter:image. Good. Missing: og:image:width/height/alt, og:url, og:type, og:site_name.
- Alt text: the content images have descriptive alt ("Illustration: the Geran-4 with markings ..."). Decorative icons (section icons, person icons) use alt="", which is correct. Coverage is 100% with no missing alt attributes.
- Format and size: geran4.jpg is JPEG, 1312x784, 217 KB. The file is not served in WebP/AVIF and the origin is not going through next/image. It displays at about 330px on mobile, so the srcset/responsive variants are not used. Moderately heavy for mobile. Estimated saving 60-70% with AVIF/WebP plus srcset.
- The hero JPG is preloaded (link rel=preload) on the home page, which is good for LCP. The home card image and article hero are the same file at full size. There was no loading=lazy/width/height evidence on the hero img (no explicit width/height), so there is a CLS risk. The icon imgs do have width/height 30/24, except sec-victims.svg and sec-react.svg, which lack dimensions.
- Icons mix SVG and WebP (person-*.webp, sec-*.webp). Fine. One inline data-URI animated SVG is embedded in the HTML (large, inline).
- Only one content image on the home page (the Geran card). The page is text-heavy, so image SEO exposure is small, but the missing OG tags on home are the main gap.

## Recommended fixes (priority order)
1. Add og:/twitter: metadata (with a default og image, 1200x630) to home and issue pages. This is fixed in pageMeta() in lib/page.ts.
2. Serve the article image via next/image, or generate AVIF/WebP plus srcset, and add explicit width/height to the hero img.
3. Enlarge tap targets to at least 44px: issue prev/next arrows, language select, Back/Issue links.
4. Raise caption and meta text contrast and size (at least 13-14px).
5. Add og:image:alt, og:url, og:type, og:site_name.
