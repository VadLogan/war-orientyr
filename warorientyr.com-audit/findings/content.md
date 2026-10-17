# Content Quality & On-Page SEO: warorientyr.com

Audit date: 2026-10-17. Scope: `/en`, `/` (UK), 12 EN plus 12 UK archive issues (2026-10-05 to 16), 13 EN dashboards, the article `/[en/]articles/2026-10-17/geran4`. In total, 42 URLs fetched. I also reviewed the templates (`lib/page.ts`, `components/Html.tsx`, `components/ArticlePage.tsx`). The repo was not modified.

## Scores

| Score | Value |
|---|---|
| **Content Quality** | **58 / 100** |
| **On-Page SEO** | **48 / 100** |
| E-E-A-T (weighted) | 41 / 100 |
| AI citation readiness | 52 / 100 |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Rationale |
|---|---|---|---|
| Experience | 20% | 45 | This is aggregation, not first-hand reporting. It does show real editorial work: notes on which sources were read, a "Source divergences" section, and confirmation labels (`unverified`, `local authorities: indirect`). |
| Expertise | 25% | 50 | High accuracy in the spot checks: ATO/JFO dates, the day counters 4,570 and 1,697, and TI's 2011 purchase of National Semiconductor are all correct. Terminology is precise. But no named person or credentials appear anywhere. |
| Authoritativeness | 25% | 25 | The site is 13 issues old. It has no About page, no external recognition and no links to the publisher. |
| Trustworthiness | 30% | 45 | Sourcing transparency is excellent: 27 sources per issue, each with a read/partial/unavailable status. Russian sources are labelled "for contrast only". Against that, the publisher is fully anonymous. There is no contact, no editorial or corrections policy, no privacy page and no footer. |

Weighted: 0.2·45 + 0.25·50 + 0.25·25 + 0.3·45 = **41**.

### Word counts (main content, `extracted_text`)

| Page | Words | Floor | Status |
|---|---|---|---|
| `/en` (latest issue) | 3,576 | 500 (homepage) / 1,500 (news) | OK |
| `/en/2026-10-16` | 3,373 | 1,500 | OK |
| Archive issues (rendered, EN) | 1,734–4,834 | 1,500 | OK |
| `/en/articles/2026-10-17/geran4` | 528 | 1,500 (blog) | Short, but suits a single-fact news explainer (see C-6) |
| `/en/dashboard` | 596 | n/a (data view) | OK |

### Duplication across daily issues

I compared consecutive EN issues using 8-word shingles. The Jaccard similarity is **0.011–0.118** (median about 0.027). Only 56 shingles are common to all 13 issues, and those are the fixed footer and methodology lines. **There is no thin or duplicate-content problem in the issues themselves.** Duplication exists only in the metadata (OP-3).

### Templated metadata (`metadata_template.py`, 42 pairs)

`site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`, no site flags. Descriptions are unique headlines, not bulk-generated. The separate problem is that titles are **date-only templates** (OP-1).

### Readability (EN latest issue)

- Average sentence length is about 36 words. 41 of 96 sentences run over 35 words.
- Flesch Reading Ease is about 23 ("very difficult"). List items without terminal punctuation inflate this, so the true figure is probably about 30–35. That is still dense.
- Paragraphs pack attribution, time stamps and caveats inline, e.g. "(Kharkiv RMA, Oleh Syniehubov, via LB.ua, 08:52 17.10)".

---

## Findings: Content Quality

### C-1. No authorship, About, contact, editorial or corrections policy (Critical)
- **Evidence:** The `/en` and article pages contain zero occurrences of About, Editor, Author, Contact, Privacy, Methodology or ©. Internal links per page are 4–5, all to digest, dashboard or article URLs. `/about` and `/en/about` return 404. There is no footer beyond "Not a final assessment; data from open sources." The article has no byline.
- **Why it matters:** War casualties, strikes and sanctions are YMYL news. The QRG treats an unidentifiable source on a YMYL topic as a trust failure, even when the content is accurate. This is the largest single drag on the E-E-A-T score.
- **Fix:**
  1. Add `/about` and `/en/about`: who publishes the site, where it is based, funding, independence, and contact email.
  2. Add `/methodology`: how sources are selected, what "read / partial / unavailable" means, how confirmation labels are assigned, and the fact that the issue is published at about 09:00 Warsaw time.
  3. Add a corrections policy. The site already does same-date corrections through `npm run publish`, so record them visibly as "Corrected HH:MM: …".
  4. Add a site footer in `Shell.tsx` linking these pages.
  5. Add a named editor byline, or at least "Editor: <name>", on issues and articles.

### C-2. Pipeline and automation artefacts leak into published copy (High)
- **Evidence:** Text from the research tooling appears on 11 of 13 issues:
  - "a domain-restricted search was rejected by the proxy (HTTP 400)": `unavailable` field and `sources[].note`, in 11 issues.
  - "DeepState: api/history/last … only the snapshot id was read (1792097671); the geometry could not be retrieved", plus raw API URLs as sources (`deepstatemap.live/api/history/last`, `divgen.ru/api/events`): 10 issues.
  - "Assumption: the morning issue at ~09:00 Warsaw time covers…": the `assumption` field, in all 13 issues.
  - "whether this is the same case is not specified in the material read": 3 issues.
- **Why it matters:** These read as the log output of an automated research agent. Disclosing AI use is fine, but presenting it as tool errors looks careless. It is a recognisable low-effort or automation marker under the September 2025 QRG. It also exposes internal infrastructure.
- **Fix:**
  - Rewrite the `unavailable` and `assumption` fields as editorial language, e.g. "Reuters: no direct reporting for 16–17.10 found", and "Coverage window: 09:00 16.10 to 09:00 17.10 (Warsaw)".
  - Replace raw API endpoints with human-facing pages, e.g. the deepstatemap.live map URL.
  - Add a validate rule in `scripts/` that rejects `proxy|HTTP \d{3}|api/|snapshot id` in text fields.
  - If AI tools assist research, say so once on the Methodology page rather than leaking it into every issue.

### C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)
- **Evidence:** In `lib/page.ts`, `resolve()` returns `notFound()` when `seg[0] === latest.date`. `https://warorientyr.com/en/2026-10-17` and `/2026-10-17` return **404 with noindex** today. Tomorrow the same content moves from `/en` to `/en/2026-10-17`, and its canonical changes with it. The article's "Issue of Sat, 17 October 2026" link also points to `/en`, so it will show a different issue tomorrow.
- **Why it matters:**
  - Anyone who shares or cites today's dated URL gets a 404.
  - Every inbound link to `/en` about today's story points at different content from tomorrow.
  - Search engines and AI engines see the canonical for each issue change after one day, which weakens freshness and citation signals.
- **Fix:**
  - Generate `/[date]` for the latest date as well. Remove the `seg[0] === latest.date` notFound and stop filtering latest out of `dateParams()`.
  - Make the dated URL the canonical for the issue content. Either keep `/en` as a front page with its own canonical and a prominent "Today's issue" link, or have `/en` canonicalise to `/en/<latest>`.
  - Link the article "Issue of" to the dated URL.

### C-4. Readability: very long, densely attributed sentences (Medium)
- **Evidence:** See the readability section above. Example: "On the night of 17 October russia launched 332 strike UAVs (31 of them jet-powered): Shaheds, S-8000 'Banderol', 'Gerbera' and 'Parodiya' (not counted separately), four Kalibrs from Novorossiysk, as well as Iskander-M/KN-23…" is a single sentence of about 60 words.
- **Fix:**
  - Open each section card with a one-sentence key fact of 25 words or fewer: number, place, date.
  - Move inline attribution parentheticals into the existing per-card source line, which already exists ("Sources: …").
  - Target an average sentence length of 20–25 words.

### C-5. Opaque or partisan section labels for the EN audience (Low)
- **Evidence:** The heading "Word from the swamps" (UK "Що кажуть на болотах") is Ukrainian slang for russia. The lowercase "russia" in descriptions and H1s ("russia struck Kharkiv…") is deliberate house style.
- **Why it matters:** International readers and raters can't parse the idiom. It also signals editorial stance in a section that otherwise strives for neutral verification.
- **Fix:** Use a plain EN heading such as "russian official statements". Keep the house style if you choose; it is an editorial decision. At minimum, explain it on the Methodology page.

### C-6. Article is a rewrite of secondary sources with a thin source trail (Medium)
- **Evidence:** The geran4 article (528 words) says "This was reported on 16 October 2026 by the outlet Militarnyi and the OSINT community InformNapalm". However, the sources list contains no Militarnyi 16.10 link, only a 25.05.2026 Militarnyi piece. The primary source is "InformNapalm on X … (screenshot)". The RFE/RL teardown is mentioned in the text but not linked. The phrase "Ukrainian specialists" is unnamed.
- **Fix:**
  - Link the Militarnyi 16.10 report and the RFE/RL teardown.
  - Name the examining team, or say it is unnamed in the source.
  - Add a visible published time and byline.
  - Add one original-value element, e.g. the site's own comparison table across the three teardowns, which the article currently only summarises in prose.

### C-7. Strengths worth keeping (Info)
- The source list includes reading status ("20 read in full · 5 partial · 2 unavailable") and a reason for each partial or unavailable source.
- "Source divergences" (H2 plus one H3 per conflict) explicitly reconciles conflicting numbers. This is rare and high-value for Trust and for AI engines.
- Confirmation labels are applied per claim (`unverified`, `local authorities silent`), and casualty reports are not added up when they overlap.
- Each card carries attribution with an exact time stamp.
- Daily content is unique (Jaccard ≤ 0.12).

---

## Findings: On-Page SEO

### OP-1. Titles are date-only templates and omit the story (High)
- **Evidence:** All 13 issues use the template `State of the war, <D Month YYYY> · Daily war digest`, 51–52 characters. The UK version is `Стан війни на … · Щоденний дайджест війни`. The H1 is the actual headline ("Trump suspended the 'hellish sanctions'…"), so the title and H1 don't match. The source is `pageMeta()` in `lib/page.ts`: `title: dateTitle(D, lang).h`.
- **Why it matters:** For news, the title is what matches queries and what AI engines quote. "State of the war, 9 October 2026" can't rank for "Kramatorsk bus strike".
- **Fix:** Use `title: \`${D.headline.title} · ${shortDate}\``, trimmed to about 60 characters, so the site-name template still appends. Keep the date-only form only for `/dashboard`.

### OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium)
- **Evidence:** `description: (D.headline?.title || D.lede || "").slice(0, 200)`. The 2026-10-05 to 08 descriptions are exactly 198–200 characters and end mid-word ("…most in the Po", "найбільше — на Пок"). Descriptions also include flag emoji ("🇺🇦 Ukraine claims…").
- **Fix:**
  - Use the lede, which is the better summary because the title becomes the headline after the OP-1 fix.
  - Trim at the last word boundary of 155 characters or fewer and add "…".
  - Strip flag emoji from metadata. Leave them in the body if you want them for house style.

### OP-3. Dashboard pages duplicate the digest description (Medium)
- **Evidence:** All 13 `/en/dashboard/<date>` pages reuse the matching digest headline as their description (13 duplicate pairs per language, 26 total). Their titles differ only by "· Dashboard".
- **Fix:** Give dashboards their own description, e.g. "Charts for <date>: civilian casualties, losses claimed by each side, strikes by direction, cost of the night attack."

### OP-4. No structured data on any page (High)
- **Evidence:** `application/ld+json` count is 0 on all 42 pages. `structured_data.block_count` is 0.
- **Fix:**
  - Issues: `NewsArticle` (or `LiveBlogPosting` for intraday corrections) with `headline`, `datePublished`/`dateModified` (ISO with time), `author`/`publisher` (`NewsMediaOrganization` with `logo` and `publishingPrinciples` pointing to the Methodology page), `inLanguage`, `isBasedOn` listing the source URLs, and `citation`.
  - Articles: `NewsArticle` with `image`.
  - Site-wide: `WebSite` plus `Organization`.

### OP-5. Digest pages have no Open Graph or Twitter tags (Medium)
- **Evidence:** Only `ArticlePage.tsx` sets `openGraph` (images only). Digest and dashboard pages emit no `og:*` or `twitter:*` tags, so shared issue links show no title, description or image card.
- **Fix:**
  - In `pageMeta()`, add `openGraph: {type: "article", title, description, url, locale, images: [...]}` and `twitter: {card: "summary_large_image"}`, plus a default OG image (a daily generated card via `opengraph-image.tsx` is ideal).
  - In `articleMeta()`, add `type: "article"` and `publishedTime`.

### OP-6. Archive is not crawlable; no sitemap or robots.txt (High)
- **Evidence:**
  - The issue selector lists 13 dates as a client `<select>`. The only HTML archive link is `‹ Previous` (one date), so older issues can be reached only by a 12-hop chain.
  - `/sitemap.xml` and `/robots.txt` return 404.
  - Each page has 4–5 internal links in total.
- **Fix:**
  - Add `app/sitemap.ts`, listing every issue, dashboard and article for both languages with `lastmod`, and add a Google News sitemap for the latest 48 hours.
  - Add `app/robots.ts` pointing to it.
  - Render the archive dates as real `<a href>` links, e.g. an `/archive` page or a list in the footer.

### OP-7. hreflang lacks x-default (Low)
- **Evidence:** The alternates contain `uk` and `en` only. `proxy.ts` redirects non-uk/ru visitors to `/en`, so `/en` is the de facto default.
- **Fix:** Add `"x-default": url("en")` to `alternates.languages` in both `pageMeta()` and `articleMeta()`.

### OP-8. Article title too long (Low)
- **Evidence:** The EN title is 84 characters and the UK title is 96 characters including the "· Daily war digest" suffix, so it gets truncated in SERPs.
- **Fix:** Add an optional `seoTitle` field to the article JSON, of 60 characters or fewer, e.g. "Geran-4 flight controller: 76% US-made chips".

### OP-9. No visible or machine-readable publication time (Medium)
- **Evidence:** There are no `<time>` elements. The issue shows "Saturday, 17 October 2026" without a time. Same-date corrections leave no "updated" trace.
- **Fix:** Render `<time datetime="2026-10-17T09:00+02:00">` for publication and `dateModified` for corrections, and mirror both in the JSON-LD.

### On-page items that pass
- One H1 per page.
- Logical H2/H3 hierarchy (sections → divergences).
- Self-referencing canonicals.
- Reciprocal uk/en hreflang.
- Static `<html lang>`.
- Meaningful article image alt text. The 24 empty-alt images on issues are decorative icons, which is correct.
- External source links use `rel="noopener"`.
- Pages are server-rendered (`is_spa: false`), so all text is in raw HTML.

---

## AI citation readiness (52/100)

**Positive:**
- Quotable, dated and attributed facts: "238 combat clashes … General Staff report as of 08:00 17.10".
- Explicit divergence reconciliation.
- Clean H2 sections.
- An HTML table in the article.
- Server-rendered HTML.

**Negative:**
- No stable URL for the latest issue (C-3).
- No schema or dates (OP-4, OP-9).
- No sitemap (OP-6).
- Date-only titles (OP-1).
- Long sentences make extraction harder (C-4).
- Flag emoji are embedded in facts ("80 were made by companies from the 🇺🇸 US").
- The publisher is anonymous (C-1). AI engines weight identifiable publishers for war and casualty claims.

**Fix order:** C-3 → OP-4 → OP-6 → OP-1 → C-1 → C-2.

---

## Structured findings (for audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "scores": {"content_quality": 58, "on_page_seo": 48, "eeat": 41, "ai_citation_readiness": 52,
             "eeat_breakdown": {"experience": 45, "expertise": 50, "authoritativeness": 25, "trustworthiness": 45}},
  "metadata_template": {"pages_checked": 42, "site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}},
  "findings": [
    {"id": "C-1", "severity": "critical", "title": "No authorship/About/contact/editorial/corrections policy on YMYL news site", "fix": "Add /about, /methodology, corrections policy, footer, editor byline"},
    {"id": "C-2", "severity": "high", "title": "Research-pipeline artefacts (proxy HTTP 400, API endpoints, snapshot ids, 'Assumption:') in 11-13/13 issues", "fix": "Rewrite as editorial text; validate rule rejecting such strings"},
    {"id": "C-3", "severity": "high", "title": "Latest issue has no dated permalink (/en/<today> 404); content changes URL daily", "fix": "Generate latest date route; canonical to dated URL"},
    {"id": "C-4", "severity": "medium", "title": "Avg sentence 36 words, Flesch ~23", "fix": "Key-fact lead sentence per card; move attributions to source line"},
    {"id": "C-5", "severity": "low", "title": "Opaque/partisan EN heading 'Word from the swamps'", "fix": "Plain heading; explain house style in methodology"},
    {"id": "C-6", "severity": "medium", "title": "Article cites Militarnyi 16.10 and RFE/RL without linking them; no byline/time", "fix": "Link primary sources, add byline, original comparison table"},
    {"id": "OP-1", "severity": "high", "title": "Titles are date-only templates; title/H1 mismatch", "fix": "Headline-based title <=60 chars + date"},
    {"id": "OP-2", "severity": "medium", "title": "Descriptions hard-cut at 200 chars mid-word, emoji in meta", "fix": "Word-boundary trim <=155 + ellipsis, strip flags"},
    {"id": "OP-3", "severity": "medium", "title": "Dashboard descriptions duplicate digest descriptions (26 pairs)", "fix": "Dashboard-specific description"},
    {"id": "OP-4", "severity": "high", "title": "No JSON-LD anywhere", "fix": "NewsArticle + NewsMediaOrganization + WebSite"},
    {"id": "OP-5", "severity": "medium", "title": "No OG/Twitter tags on digest/dashboard pages", "fix": "openGraph/twitter in pageMeta, default OG image"},
    {"id": "OP-6", "severity": "high", "title": "No sitemap.xml/robots.txt; archive only via 'Previous' chain", "fix": "app/sitemap.ts (+ news sitemap), app/robots.ts, <a> archive links"},
    {"id": "OP-7", "severity": "low", "title": "hreflang without x-default", "fix": "x-default -> /en"},
    {"id": "OP-8", "severity": "low", "title": "Article titles 84-96 chars", "fix": "seoTitle field <=60 chars"},
    {"id": "OP-9", "severity": "medium", "title": "No <time>/publication time, corrections untraced", "fix": "<time datetime>, dateModified"}
  ]
}
```
