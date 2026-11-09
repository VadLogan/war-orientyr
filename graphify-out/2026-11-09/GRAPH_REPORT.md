# Graph Report - war-orientyr  (2026-11-08)

## Corpus Check
- 114 files · ~639,685 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 828 nodes · 2063 edges · 50 communities (48 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7250b7c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- ui.ts
- digest.ts
- Findings: On-Page SEO
- package.json
- Maps.tsx
- scripts/i18n.mjs
- mapParts.tsx
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- MapsCompare
- GEO / AI Search Readiness: warorientyr.com (EN)
- resolve
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- StrikesCard.tsx
- SXO: warorientyr.com/en (English edition)
- DashPage.tsx
- Flag.tsx
- data.ts
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
- (uk)/maps/[[...date]]/page.tsx
- pageMeta
- href
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- en/maps/[[...date]]/page.tsx
- articleMeta
- Sitemap audit: https://warorientyr.com
- stats.ts
- ArticleList.tsx
- DigestPage.tsx
- StrikesThumb.tsx
- ArticlePage.tsx
- de/maps/[[...date]]/page.tsx
- Item.tsx
- de/strikes/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 55 edges
2. `pageMeta()` - 43 edges
3. `href()` - 36 edges
4. `MapsCompare()` - 35 edges
5. `fmt()` - 33 edges
6. `useApp()` - 32 edges
7. `Architecture` - 30 edges
8. `StrikesMap()` - 26 edges
9. `Lang` - 26 edges
10. `react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Top 5 Highest-Impact Changes` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/geo.md → lib/page.ts
- `Facts from the code that shape the sitemap` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (50 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.12
Nodes (19): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, diploTitle() (+11 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.08
Nodes (64): AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard(), MapsView() (+56 more)

### Community 2 - "ui.ts"
Cohesion: 0.07
Nodes (26): metadata, metadata, metadata, metadata, metadata, app_globals, metadata, metadata (+18 more)

### Community 3 - "digest.ts"
Cohesion: 0.14
Nodes (14): P, PhaseExplorer(), ArticlePreview, Digest, Fire, LossRow, PresentationBody, PresPhase (+6 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+27 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.08
Nodes (17): MapsCompare, StrikesMap, ALL_G, ALL_V, BASEMAPS, DsE, dsKinds(), dsUpd() (+9 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "mapParts.tsx"
Cohesion: 0.14
Nodes (24): areaTiles(), Cities(), countV(), DIRS, Ev, fitFront(), Geo, lastDay() (+16 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "MapsCompare"
Cohesion: 0.16
Nodes (21): Architecture, dirOf(), lineChanges(), lineDiff(), byDate(), dmy(), dsKey(), dsOnce() (+13 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "resolve"
Cohesion: 0.13
Nodes (15): resolve(), Low, AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8 (+7 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.14
Nodes (23): Tiles(), byPlace(), GCOL, grpOf(), GRPS, ICO, KIND, placeKey() (+15 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "DashPage.tsx"
Cohesion: 0.18
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), getMapsUrl

### Community 19 - "Flag.tsx"
Cohesion: 0.18
Nodes (11): f2(), H(), R(), star(), V(), Donut, Race, S (+3 more)

### Community 20 - "data.ts"
Cohesion: 0.19
Nodes (23): sitemap(), articleParams, DigestPage(), ART_DIR, Cnt, domOf(), getArticle, getArticleDirs (+15 more)

### Community 21 - "ArticlesPage.tsx"
Cohesion: 0.20
Nodes (13): generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), ArticlesPage(), hrefs, LdList(), NewPages() (+5 more)

### Community 22 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (25): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+17 more)

### Community 25 - "Digest.tsx"
Cohesion: 0.21
Nodes (8): ChkToggle(), countSources(), Sources(), SRC_ORD, RC, TocSpy(), Strikes, Source

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.16
Nodes (13): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+5 more)

### Community 29 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.25
Nodes (7): Category status, Critical / High, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 31 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "pageMeta"
Cohesion: 0.15
Nodes (13): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+5 more)

### Community 33 - "href"
Cohesion: 0.20
Nodes (12): HashRedirect(), IssueSelect(), Records(), P, href(), pre(), SITE, View (+4 more)

### Community 34 - "en/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 35 - "en/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "en/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 39 - "articleMeta"
Cohesion: 0.15
Nodes (10): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+2 more)

### Community 40 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 41 - "stats.ts"
Cohesion: 0.23
Nodes (14): dayRecords, LossRecord, REC_KEYS, StrikeRecord, stkDist(), compare(), line(), main() (+6 more)

### Community 42 - "ArticleList.tsx"
Cohesion: 0.32
Nodes (7): ALL, ArticleList(), code(), F, norm(), ref_next_image, ArticleItem

### Community 43 - "DigestPage.tsx"
Cohesion: 0.18
Nodes (15): Digest(), issueLd(), ImgZoom(), Ld(), ArtCard(), Mast(), NEW_PAGES, NW_ART (+7 more)

### Community 44 - "StrikesThumb.tsx"
Cohesion: 0.29
Nodes (5): MapsData, Grp, StkMark(), Drawn, ThumbPt

### Community 45 - "ArticlePage.tsx"
Cohesion: 0.15
Nodes (27): artHrefs(), ArticlePage(), Bars(), Block(), Donut(), heading(), IN_ART, LdJson() (+19 more)

### Community 46 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 47 - "Item.tsx"
Cohesion: 0.27
Nodes (9): fireLabel(), FireList(), Item(), Local(), SrcChip(), fireIco(), liIco(), personIcons() (+1 more)

### Community 48 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **291 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `href`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `Findings: On-Page SEO`, `en/maps/[[...date]]/page.tsx`, `Sitemap audit: https://warorientyr.com`, `DigestPage.tsx`, `MapsCompare`, `de/maps/[[...date]]/page.tsx`, `resolve`, `de/strikes/[[...date]]/page.tsx`, `SXO: warorientyr.com/en (English edition)`, `DashPage.tsx`, `ArticlesPage.tsx`, `Action Plan — warorientyr.com`, `(uk)/strikes/[[...date]]/page.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `(uk)/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `resolve()` connect `resolve` to `pageMeta`, `Findings: On-Page SEO`, `Sitemap audit: https://warorientyr.com`, `DigestPage.tsx`, `MapsCompare`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `DashPage.tsx`, `data.ts`, `Action Plan — warorientyr.com`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `href()` connect `href` to `pageMeta`, `Panels.tsx`, `ui.ts`, `Maps.tsx`, `mapParts.tsx`, `DigestPage.tsx`, `MapsCompare`, `ArticlePage.tsx`, `StrikesCard.tsx`, `data.ts`, `ArticlesPage.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08421052631578947 - nodes in this community are weakly interconnected._