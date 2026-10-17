# GEO / AI Search Readiness: warorientyr.com (EN)

Audited 2026-10-17. Pages: `/en` (latest digest), `/en/2026-10-16`, `/en/dashboard`, `/en/articles/2026-10-17/geran4`.

## GEO Readiness Score: 58 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 74 | 18.5 |
| Structural Readability | 20% | 62 | 12.4 |
| Multi-Modal Content | 15% | 50 | 7.5 |
| Authority & Brand Signals | 20% | 25 | 5.0 |
| Technical Accessibility | 20% | 72 | 14.4 |
| **Total** | | | **57.8 -> 58** |

The content is strong. The score is held down by entity and authority signals and by missing machine-readable scaffolding (robots.txt, sitemap, llms.txt, JSON-LD).

## AI Crawler Access

`/robots.txt` returns 404, so by default every crawler is allowed. No `X-Robots-Tag` header and no `meta robots` tag were found. Requests sent with the Googlebot, OAI-SearchBot and PerplexityBot user agents (and no Accept-Language header) got 200 with no redirect. The language redirect in `proxy.ts` only fires when a browser-style non-uk Accept-Language header is sent (that returns a 307 to `/en`).

| Crawler | What it governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT Search citations | Allowed (default) |
| ChatGPT-User | ChatGPT fetches a page on a user's request | Allowed (default) |
| GPTBot | OpenAI training only | Allowed (default) |
| Claude-SearchBot | Claude search citations | Allowed (default) |
| Claude-User | Claude fetches a page on a user's request | Allowed (default) |
| ClaudeBot | Anthropic training only | Allowed (default) |
| PerplexityBot | Perplexity index and citations | Allowed (default) |
| Googlebot | Google Search and AI Overviews | Allowed (default) |
| Google-Extended | Gemini/Vertex training and grounding (not AIO) | Allowed (default) |
| Bingbot | Bing and Copilot | Allowed (default) |
| Applebot / Applebot-Extended | Siri/Spotlight / Apple Intelligence training | Allowed (default) |
| CCBot, cohere-ai | Training | Allowed (default) |

Access is open. But there is no `robots.txt` with a `Sitemap:` line, and `/sitemap.xml` also returns 404. That means discovery of dated issues and articles depends entirely on internal links. Crawlers get no list of URLs and no lastmod dates.

## llms.txt / RSL

- `/llms.txt` returns 404 (missing). `/.well-known/llms.txt` also returns 404.
- No RSL 1.0 licence (`/license.xml` returns 404, and no `License:` line in robots.txt).
- There is no stated content licence. For a source-aggregating digest, an explicit attribution licence (for example CC BY 4.0) helps AI systems that check licensing.

## Technical Accessibility (72)

- SSR/SSG is good. Every page is prerendered on Vercel (`x-nextjs-prerender: 1`), and the raw HTML without JS contains the full text. The digest is about 3,600 words; the article is 528 words plus a real HTML `<table>`. The dashboard serves about 1,150 words server-side, and its SVG charts carry `<title>` data points (for example "16.10: 7,433").
- Canonical and hreflang are correct on dated issues and articles (uk/en pairs). There is no `x-default`.
- **Citation drift (high impact).** The latest issue only exists at `/en`, and `/en/2026-10-17` returns **404**. An AI engine that cites today's figures will cite `/en`, and that URL's content changes tomorrow. The permanent dated URL only appears once the issue is archived. The cited passage stops matching its source, which hurts trust and gets the citation dropped.
- No sitemap and no robots.txt (see above).
- No `<time datetime>` elements. The publication date is only inferable from the title and text (the extractor found `2026-10-17` via heuristics).

## Citability (74)

Strengths. This is a very citable house style:
- Nearly every block is a stat with a time stamp and an attributed source. Example: "On 16 October 238 combat clashes were recorded (General Staff report as of 08:00 17.10; at 22:00 16.10 there were 208)". 72 of 143 paragraphs carry explicit dates; 44 carry "via / according to / Sources:".
- Verification status is explicit ("unverified", "local authorities: indirect", "no independent confirmation"). LLMs favour this kind of hedged, attributed claim for sensitive topics.
- The article lede answers the question in its first 40 words, with exact figures: 80 of 105 components (76.2%) from the US, 61 (58.1%) from TI/National Semiconductor.

Weaknesses:
- Passage size is uneven: 23 of 143 paragraphs fall in the 40-200 word band. Many blocks are long multi-region lists that cannot be extracted on their own. Short list items like "Pokrovsk — 30" lack their own context (date, metric).
- Dates use the `16.10` shorthand without the year inside passages. Outside the page context, "16.10" is ambiguous. Write "16 October 2026" at least once per block.
- Headings are labels ("War victims", "Front line", "Word from the swamps"), not queries. There are no question-shaped H2/H3s ("How many drones did russia launch on 17 October 2026?").
- Several H2/H3s contain inline `<img>`/`<svg>` icons, which leaves noisy heading text in some extractors.

## Structural Readability (62)

- Digest: a logical H1, then section H2s, then item H3s. However, about 24 of 26 `<img>` elements have `alt=""` (decorative, which is fine) and there are no `<table>`s for tabular data. Losses and attacks by direction are lists that should be `<table>` or `<dl>`.
- Article: a clean H1, 3 H2s plus Sources, a data table, a figcaption chart and a source list. This is a near-ideal structure, but it is short (528 words) and has no FAQ or summary box.

## Multi-Modal (50)

- The article has one image with descriptive alt text, a figcaption bar chart and a table. That is good.
- The digest homepage has **no og:image and no og:/twitter: tags at all**, so shares and AI previews render with no card. The article has full OG and Twitter tags.
- Maps and charts on the dashboard are SVG/d3 with no text alternative beyond the `<title>` tooltips. There is no video, and YouTube presence is the strongest correlate of AI citations (about 0.74).

## Authority & Brand Signals (25)

- **No JSON-LD at all** (no NewsArticle, Organization, WebSite or Dataset).
- No author or byline, no About, Methodology or Contact page (`/en/about` returns 404). The footer reads only "Not a final assessment; data from open sources."
- No `meta author` and no organisation name beyond "Daily war digest".
- Brand footprint:
  - Wikipedia (en and uk): 0 hits for "warorientyr" (no entity).
  - Reddit: not verifiable (the API blocked the request); assume none.
  - YouTube and LinkedIn: no channel or page linked from the site.
  - Wikidata: none.
- Outbound citation quality is high: 37 external links to primary or near-primary sources (ArmyInform, Glavcom, Suspilne, RFE/RL, The Moscow Times). That is a trust plus, but it does not substitute for entity identity.
- On YMYL-adjacent war and casualty data, engines strongly prefer sources with an identifiable publisher. This is the single largest gap.

## Platform Scores

| Platform | Score | Notes |
|---|---|---|
| Google AI Overviews | 50 | Indexable SSR. No sitemap, no NewsArticle schema, no named author or publisher (E-E-A-T for YMYL), and the latest issue has no stable URL. AIO leans heavily on established news entities for this topic. |
| ChatGPT Search | 55 | OAI-SearchBot allowed and the text is dense and attributed. With no entity (Wikipedia/Reddit), the site is rarely surfaced over Kyiv Independent or ISW. No Bing sitemap feed (ChatGPT relies partly on the Bing index). |
| Perplexity | 65 | Rewards fresh, stat-dense, source-linked pages. The best fit. Hurt by URL drift on `/en` and by year-less dates. |
| Bing Copilot | 48 | Needs a sitemap and IndexNow for daily freshness. No schema and no og on the homepage. |

## Top 5 Highest-Impact Changes

1. **Give the latest issue a permanent URL** (`/en/2026-10-17` returns 200 with a self-canonical, while `/en` stays as an alias pointing its canonical at the dated URL). This stops citation drift. Effort: S (1-2 h; `dateParams()` / `resolve()` in `lib/page.ts`).
2. **Add `app/robots.ts` and `app/sitemap.ts`.** List every issue, dashboard and article URL in uk and en with lastmod from `issues/index.json`. Add explicit `Allow` for OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and Bingbot, and a `Sitemap:` line. Optionally ping IndexNow on publish. Effort: S (1-2 h).
3. **Add JSON-LD.** Use `NewsArticle` on digests and articles (headline, datePublished/dateModified, inLanguage, publisher Organization with logo, `isBasedOn`/`citation` from the Sources lists) and `Organization` plus `WebSite` site-wide. Add `<time datetime>` to the masthead. Effort: M (3-4 h).
4. **Establish the publisher entity.** Create `/about` and `/en/about` pages covering who edits it, the methodology (verification labels, source hierarchy), corrections policy and contact, and link them from the footer. Then create a Wikidata item, a LinkedIn page, a YouTube or Telegram channel, and `sameAs` links. Effort: M on-site (half a day), L off-site (ongoing).
5. **Passage hygiene for extraction.** Include the year in each block's first date ("16 October 2026"). Render losses and attacks by direction as `<table>`. Add a 2-3 sentence "Key figures" summary under the H1 with the day's top numbers. Rephrase item H3s toward queries. Add `og:image`/OG tags to the digest pages, plus an `/llms.txt` that lists the latest issue, archive, dashboard and articles. Effort: M (half a day; mostly `components/digest/*` and `lib/page.ts`).

## Structured findings (audit-data.json, AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "score": 58,
  "dimensions": {"citability": 74, "structural_readability": 62, "multimodal": 50, "authority_brand": 25, "technical_accessibility": 72},
  "platforms": {"google_aio": 50, "chatgpt": 55, "perplexity": 65, "bing_copilot": 48},
  "findings": [
    {"id": "geo-robots-missing", "severity": "medium", "detail": "/robots.txt 404; all crawlers allowed by default, no Sitemap directive"},
    {"id": "geo-sitemap-missing", "severity": "high", "detail": "/sitemap.xml 404; daily issues/articles undiscoverable except via links"},
    {"id": "geo-llmstxt-missing", "severity": "low", "detail": "/llms.txt and /.well-known/llms.txt 404; no RSL licence"},
    {"id": "geo-latest-url-drift", "severity": "high", "detail": "/en/2026-10-17 returns 404; latest issue only at /en (canonical /en), content changes daily"},
    {"id": "geo-no-jsonld", "severity": "high", "detail": "No JSON-LD on any page (NewsArticle/Organization/WebSite)"},
    {"id": "geo-no-author-about", "severity": "high", "detail": "No byline, publisher, about/methodology page (/en/about 404) on YMYL war-casualty content"},
    {"id": "geo-no-entity", "severity": "high", "detail": "No Wikipedia/Wikidata entity; no YouTube/LinkedIn/Reddit presence found"},
    {"id": "geo-home-no-og", "severity": "medium", "detail": "Digest pages lack og:/twitter: tags and og:image (articles have them)"},
    {"id": "geo-yearless-dates", "severity": "medium", "detail": "Passages use '16.10' without year; ambiguous when extracted"},
    {"id": "geo-lists-not-tables", "severity": "low", "detail": "Losses / attacks-by-direction rendered as lists, not tables"},
    {"id": "geo-ssr-ok", "severity": "pass", "detail": "Fully prerendered HTML; digest ~3.6k words, dashboard ~1.15k words SSR"},
    {"id": "geo-attribution-ok", "severity": "pass", "detail": "Stats carry timestamps and named sources; verification status explicit; 37 external source links"}
  ]
}
```
