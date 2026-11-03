# Graph Report - war-orientyr  (2026-11-02)

## Corpus Check
- 107 files · ~547,367 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 781 nodes · 1873 edges · 46 communities (44 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `17fdda71`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- Html.tsx
- digest.ts
- Findings: On-Page SEO
- package.json
- ui.ts
- scripts/i18n.mjs
- stats.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- data.ts
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- Maps.tsx
- SXO: warorientyr.com/en (English edition)
- de/dashboard/[[...date]]/page.tsx
- Flag.tsx
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Digest.tsx
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- icons.ts
- de/maps/[[...date]]/page.tsx
- next.config.mjs
- en/maps/[[...date]]/page.tsx
- pageMeta
- de/strikes/[[...date]]/page.tsx
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- ArticlePage.tsx
- dateParams
- href
- articleMeta
- Item.tsx
- Findings: Content Quality
- StateMap.tsx
- (uk)/maps/[[...date]]/page.tsx
- DashPage.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `flags` - 53 edges
2. `pageMeta()` - 42 edges
3. `fmt()` - 33 edges
4. `useApp()` - 32 edges
5. `href()` - 30 edges
6. `StrikesMap()` - 26 edges
7. `Lang` - 24 edges
8. `react` - 24 edges
9. `MapsCompare()` - 22 edges
10. `Architecture` - 22 edges

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

## Communities (46 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.13
Nodes (17): COUNTRIES, CRX, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, elapsed(), EN_COUNTRIES (+9 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.08
Nodes (70): AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard(), MapsView() (+62 more)

### Community 2 - "Html.tsx"
Cohesion: 0.18
Nodes (10): metadata, metadata, app_globals, metadata, FONTS, Html(), siteMeta(), viewport (+2 more)

### Community 3 - "digest.ts"
Cohesion: 0.15
Nodes (13): P, PhaseExplorer(), Article, ArticlePreview, Item, LossRow, PresentationBody, PresPhase (+5 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+27 more)

### Community 6 - "ui.ts"
Cohesion: 0.14
Nodes (16): metadata, metadata, metadata, metadata, IssueSelect(), LangLink(), LangPicker(), NotFound() (+8 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "stats.ts"
Cohesion: 0.21
Nodes (16): dayRecords, LossRecord, REC_KEYS, StrikeRecord, stkDist(), Strikes, compare(), line() (+8 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "data.ts"
Cohesion: 0.17
Nodes (23): sitemap(), articleParams, ART_DIR, Cnt, domOf(), getArticle, getArticleDirs, getDates (+15 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "Maps.tsx"
Cohesion: 0.05
Nodes (75): Architecture, MapsCompare, StrikesMap, areaTiles(), Cities(), countV(), dirOf(), DIRS (+67 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.06
Nodes (27): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+19 more)

### Community 18 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

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
Nodes (9): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, RC, SrcChip(), TocSpy() (+1 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.16
Nodes (13): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+5 more)

### Community 29 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 31 - "en/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "pageMeta"
Cohesion: 0.20
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, generateMetadata(), dynamicParams, generateMetadata(), generateStaticParams, pageMeta()

### Community 33 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

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

### Community 39 - "ArticlePage.tsx"
Cohesion: 0.14
Nodes (29): artHrefs(), ArticlePage(), Bars(), Block(), Donut(), heading(), IN_ART, LdJson() (+21 more)

### Community 40 - "dateParams"
Cohesion: 0.33
Nodes (4): dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 43 - "href"
Cohesion: 0.18
Nodes (17): DigestPage(), HashRedirect(), ImgZoom(), Mast(), NewPages(), NW_ART, Records(), Shell() (+9 more)

### Community 44 - "articleMeta"
Cohesion: 0.14
Nodes (11): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+3 more)

### Community 47 - "Item.tsx"
Cohesion: 0.27
Nodes (8): Dist(), Item(), Local(), LOCK, liIco(), personIcons(), distLabel(), Fire

### Community 48 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 50 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 54 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 55 - "DashPage.tsx"
Cohesion: 0.19
Nodes (7): dynamicParams, generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), getMapsUrl

### Community 56 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

## Knowledge Gaps
- **282 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+277 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 366 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `de/strikes/[[...date]]/page.tsx`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `Findings: On-Page SEO`, `ArticlePage.tsx`, `dateParams`, `href`, `data.ts`, `articleMeta`, `SEO Audit — warorientyr.com (entry: /en)`, `Maps.tsx`, `SXO: warorientyr.com/en (English edition)`, `de/dashboard/[[...date]]/page.tsx`, `(uk)/maps/[[...date]]/page.tsx`, `DashPage.tsx`, `Action Plan — warorientyr.com`, `de/maps/[[...date]]/page.tsx`, `en/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `resolve()` connect `data.ts` to `pageMeta`, `href`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `Maps.tsx`, `Findings: Content Quality`, `SXO: warorientyr.com/en (English edition)`, `Action Plan — warorientyr.com`, `DashPage.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `react` connect `Panels.tsx` to `digest.ts`, `package.json`, `ui.ts`, `ArticlePage.tsx`, `href`, `data.ts`, `Item.tsx`, `Maps.tsx`, `StateMap.tsx`, `Flag.tsx`, `Digest.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _282 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07768744354110207 - nodes in this community are weakly interconnected._