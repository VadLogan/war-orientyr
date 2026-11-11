# Graph Report - war-orientyr  (2026-11-09)

## Corpus Check
- 125 files · ~675,785 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 893 nodes · 2297 edges · 56 communities (54 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f6620eda`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MapsCompare
- text.ts
- ui.ts
- digest.ts
- Findings: Content Quality
- package.json
- Maps.tsx
- scripts/i18n.mjs
- data.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Architecture
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- strikes.ts
- route.tsx
- de/dashboard/[[...date]]/page.tsx
- Flag.tsx
- Findings: On-Page SEO
- ArticlesPage.tsx
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Digest.tsx
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- icons.ts
- Technical SEO findings: warorientyr.com (focus /en)
- next.config.mjs
- DashPage
- pageMeta
- page.ts
- SXO: warorientyr.com/en (English edition)
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- hooks.ts
- ArticlePage.tsx
- Sitemap audit: https://warorientyr.com
- stats.ts
- ArticleList.tsx
- DigestPage.tsx
- PresentationPage.tsx
- Scenarios.tsx
- fr/dashboard/[[...date]]/page.tsx
- Item.tsx
- de/strikes/[[...date]]/page.tsx
- StateMap.tsx
- dateParams
- (uk)/dashboard/[[...date]]/page.tsx
- fr/[[...date]]/page.tsx
- fr/maps/[[...date]]/page.tsx
- fr/strikes/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 57 edges
2. `pageMeta()` - 56 edges
3. `href()` - 41 edges
4. `Architecture` - 39 edges
5. `MapsCompare()` - 35 edges
6. `fmt()` - 35 edges
7. `useApp()` - 32 edges
8. `StrikesMap()` - 26 edges
9. `Lang` - 26 edges
10. `react` - 26 edges

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

## Communities (56 total, 2 thin omitted)

### Community 0 - "MapsCompare"
Cohesion: 0.18
Nodes (19): useSticky(), dirOf(), lineChanges(), byDate(), dmy(), dsKey(), dsKinds(), dsOnce() (+11 more)

### Community 1 - "text.ts"
Cohesion: 0.05
Nodes (78): useApp(), Dashboard(), MapsCompare, MapsView(), StrikesMap, StrikesView(), useChartW(), Legend() (+70 more)

### Community 2 - "ui.ts"
Cohesion: 0.07
Nodes (28): metadata, metadata, metadata, metadata, metadata, metadata, metadata, app_globals (+20 more)

### Community 3 - "digest.ts"
Cohesion: 0.20
Nodes (10): P, PhaseExplorer(), ArticlePreview, PresentationBody, PresPhase, Section, Side, Status (+2 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (36): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+28 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.08
Nodes (24): Cities(), DIRS, Ev, fitFront(), Geo, Layers(), LY, makeGeo() (+16 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (33): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada (+25 more)

### Community 8 - "data.ts"
Cohesion: 0.11
Nodes (44): AppCtx, Ctx, DashIssue, DashLang, strings(), DashProvider(), areaTiles(), countV() (+36 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Architecture"
Cohesion: 0.31
Nodes (8): Architecture, lineDiff(), Mark(), Tiles256(), inRings(), LL, Rings, toArea()

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "strikes.ts"
Cohesion: 0.13
Nodes (15): byPlace(), GCOL, Grp, GRPS, ICO, KIND, placeKey(), STK_CITIES (+7 more)

### Community 17 - "route.tsx"
Cohesion: 0.28
Nodes (8): dynamic, dynamicParams, generateStaticParams(), GET(), mp(), Rings, getMapsUrl, ref_next_og

### Community 18 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 21 - "ArticlesPage.tsx"
Cohesion: 0.16
Nodes (12): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), hrefs, LdList(), Ld() (+4 more)

### Community 22 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (26): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+18 more)

### Community 25 - "Digest.tsx"
Cohesion: 0.24
Nodes (8): ChkToggle(), countSources(), Sources(), SRC_ORD, RC, SrcChip(), TocSpy(), react

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 29 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 31 - "DashPage"
Cohesion: 0.12
Nodes (13): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+5 more)

### Community 32 - "pageMeta"
Cohesion: 0.18
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dirDesc(), pageMeta() (+1 more)

### Community 33 - "page.ts"
Cohesion: 0.19
Nodes (21): sitemap(), ArticlesPage(), DirLinks(), HashRedirect(), getDates, getIssue, getLatest, DASH_DESC (+13 more)

### Community 34 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 35 - "en/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "hooks.ts"
Cohesion: 0.29
Nodes (7): fetchJson(), JSON_CACHE, STICKY, useElWidth(), useJson(), StrikesThumb(), d3

### Community 39 - "ArticlePage.tsx"
Cohesion: 0.10
Nodes (28): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+20 more)

### Community 40 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 41 - "stats.ts"
Cohesion: 0.22
Nodes (14): dayRecords, LossRecord, REC_KEYS, StrikeRecord, Strikes, compare(), line(), main() (+6 more)

### Community 42 - "ArticleList.tsx"
Cohesion: 0.32
Nodes (7): ALL, ArticleList(), code(), F, norm(), ref_next_image, ArticleItem

### Community 43 - "DigestPage.tsx"
Cohesion: 0.18
Nodes (17): Digest(), DigestPage(), issueLd(), ImgZoom(), ArtCard(), Mast(), NEW_PAGES, NewPages() (+9 more)

### Community 44 - "PresentationPage.tsx"
Cohesion: 0.20
Nodes (14): Donut(), Sources(), EmbedFrame(), IssueSelect(), P, PresentationPage(), P, dayLabel() (+6 more)

### Community 45 - "Scenarios.tsx"
Cohesion: 0.40
Nodes (5): CHAMBERS, L, pct(), Scenarios(), ScenariosBlock

### Community 46 - "fr/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 47 - "Item.tsx"
Cohesion: 0.19
Nodes (12): Dist(), fireLabel(), FireList(), Item(), Local(), LOCK, liIco(), personIcons() (+4 more)

### Community 48 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 49 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 50 - "dateParams"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 51 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 52 - "fr/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 53 - "fr/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 54 - "fr/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **313 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 413 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `data.ts`, `Architecture`, `SEO Audit — warorientyr.com (entry: /en)`, `de/dashboard/[[...date]]/page.tsx`, `Findings: On-Page SEO`, `ArticlesPage.tsx`, `Action Plan — warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `DashPage`, `page.ts`, `SXO: warorientyr.com/en (English edition)`, `en/dashboard/[[...date]]/page.tsx`, `ArticlePage.tsx`, `Sitemap audit: https://warorientyr.com`, `DigestPage.tsx`, `fr/dashboard/[[...date]]/page.tsx`, `de/strikes/[[...date]]/page.tsx`, `dateParams`, `(uk)/dashboard/[[...date]]/page.tsx`, `fr/[[...date]]/page.tsx`, `fr/maps/[[...date]]/page.tsx`, `fr/strikes/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `resolve()` connect `page.ts` to `pageMeta`, `Findings: Content Quality`, `data.ts`, `Sitemap audit: https://warorientyr.com`, `DigestPage.tsx`, `Architecture`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `Action Plan — warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `DashPage`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `href()` connect `page.ts` to `MapsCompare`, `pageMeta`, `ui.ts`, `Maps.tsx`, `ArticlePage.tsx`, `data.ts`, `scripts/i18n.mjs`, `DigestPage.tsx`, `PresentationPage.tsx`, `ArticlesPage.tsx`, `Digest.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `DashPage`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 38 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.054858934169279 - nodes in this community are weakly interconnected._