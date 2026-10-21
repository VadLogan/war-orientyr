# Graph Report - war-orientyr  (2026-10-17)

## Corpus Check
- 82 files · ~269,578 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 586 nodes · 1253 edges · 39 communities (36 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe92c62d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Maps.tsx
- ui.ts
- strikes.ts
- Findings: Content Quality
- package.json
- data.ts
- scripts/i18n.mjs
- proxy.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Digest.tsx
- icons.ts
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- GEO / AI Search Readiness: warorientyr.com (EN)
- SXO: warorientyr.com/en (English edition)
- Item.tsx
- digest.ts
- Findings: On-Page SEO
- Sitemap audit: https://warorientyr.com
- Technical SEO findings: warorientyr.com (focus /en)
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- publish.mjs
- pageMeta
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- Action Plan — warorientyr.com
- en/articles/[date]/[name]/page.tsx
- next.config.mjs
- en/dashboard/[[...date]]/page.tsx
- en/[[...date]]/page.tsx
- (uk)/articles/[date]/[name]/page.tsx
- (uk)/dashboard/[[...date]]/page.tsx
- (uk)/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

## God Nodes (most connected - your core abstractions)
1. `flags` - 33 edges
2. `useApp()` - 27 edges
3. `fmt()` - 25 edges
4. `pageMeta()` - 24 edges
5. `Lang` - 21 edges
6. `href()` - 18 edges
7. `resolve()` - 17 edges
8. `react` - 17 edges
9. `StrikesMap()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Top 5 Highest-Impact Changes` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/geo.md → lib/page.ts
- `Facts from the code that shape the sitemap` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts
- `Low` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/technical.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (39 total, 3 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.12
Nodes (21): ImgZoom(), ArtCard(), Mast(), COUNTRIES, CRX, dateTitle(), dayLabel(), DIP_RX (+13 more)

### Community 1 - "Maps.tsx"
Cohesion: 0.07
Nodes (81): useApp(), Dashboard(), MapsCompare, StrikesMap, fetchJson(), JSON_CACHE, STICKY, useChartW() (+73 more)

### Community 2 - "ui.ts"
Cohesion: 0.08
Nodes (24): metadata, metadata, metadata, app_globals, metadata, metadata, f2(), Flag() (+16 more)

### Community 3 - "strikes.ts"
Cohesion: 0.24
Nodes (9): Dist(), DISTC, distLabel(), kmBetween(), stkDist(), Strike, Strikes, StrikesBase (+1 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+25 more)

### Community 6 - "data.ts"
Cohesion: 0.09
Nodes (52): sitemap(), Architecture, ArticlePage(), articleParams, Block(), load(), AppCtx, Ctx (+44 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.10
Nodes (18): Commands, Conventions, Data (`public/`), Tools, WAR·Орієнтир — «Щоденний дайджест війни» (Next.js), isText(), KEYED, SKIP (+10 more)

### Community 8 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.12
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Digest.tsx"
Cohesion: 0.17
Nodes (13): Bars(), num(), ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, RC (+5 more)

### Community 13 - "icons.ts"
Cohesion: 0.16
Nodes (13): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+5 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "Item.tsx"
Cohesion: 0.33
Nodes (7): fireLabel(), FireList(), Item(), Local(), fireIco(), liIco(), personIcons()

### Community 19 - "digest.ts"
Cohesion: 0.22
Nodes (8): ArticleBlock, ArticlePreview, Fire, LossRow, Section, Source, Status, Verdict

### Community 20 - "Findings: On-Page SEO"
Cohesion: 0.22
Nodes (9): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-6. Archive is not crawlable; no sitemap or robots.txt (High), OP-8. Article title too long (Low) (+1 more)

### Community 21 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.22
Nodes (8): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com, Validation report

### Community 22 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "publish.mjs"
Cohesion: 0.10
Nodes (16): ref_node_fs, args, cur, curRaw, force, miss, PUB, raw (+8 more)

### Community 25 - "pageMeta"
Cohesion: 0.48
Nodes (7): articleMeta(), pageMeta(), seoMeta(), clip(), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-7. hreflang lacks x-default (Low), Other issues found

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 29 - "en/articles/[date]/[name]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 31 - "en/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "en/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 33 - "(uk)/articles/[date]/[name]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 34 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 35 - "(uk)/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

## Knowledge Gaps
- **223 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+218 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 288 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `resolve()` connect `data.ts` to `Findings: Content Quality`, `SEO Audit — warorientyr.com (entry: /en)`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `Sitemap audit: https://warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `pageMeta`, `Action Plan — warorientyr.com`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `pageMeta()` connect `pageMeta` to `en/[[...date]]/page.tsx`, `text.ts`, `(uk)/dashboard/[[...date]]/page.tsx`, `(uk)/[[...date]]/page.tsx`, `data.ts`, `SEO Audit — warorientyr.com (entry: /en)`, `SXO: warorientyr.com/en (English edition)`, `Findings: On-Page SEO`, `Sitemap audit: https://warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `Action Plan — warorientyr.com`, `en/dashboard/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `react` connect `Digest.tsx` to `Maps.tsx`, `ui.ts`, `package.json`, `data.ts`, `Item.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _223 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._
- **Should `Maps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06641184902054467 - nodes in this community are weakly interconnected._