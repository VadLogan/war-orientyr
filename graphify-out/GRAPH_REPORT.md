# Graph Report - war-orientyr  (2026-11-09)

## Corpus Check
- 130 files · ~689,223 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 942 nodes · 2416 edges · 58 communities (56 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 96 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1ae348a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ctx.ts
- flags
- ui.ts
- digest.ts
- Findings: Content Quality
- package.json
- Maps.tsx
- scripts/i18n.mjs
- mapParts.tsx
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- kmBetween
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- StrikesCard.tsx
- route.tsx
- de/dashboard/[[...date]]/page.tsx
- Flag.tsx
- Findings: On-Page SEO
- articlesMeta
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Digest.tsx
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- icons.ts
- Html.tsx
- next.config.mjs
- DashPage.tsx
- en/strikes/[[...date]]/page.tsx
- page.ts
- SXO: warorientyr.com/en (English edition)
- text.ts
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- de/maps/[[...date]]/page.tsx
- articleMeta
- Sitemap audit: https://warorientyr.com
- potential.ts
- ArticleList.tsx
- data.ts
- ArticlePage.tsx
- Scenarios.tsx
- fr/dashboard/[[...date]]/page.tsx
- Item.tsx
- de/strikes/[[...date]]/page.tsx
- StateMap.tsx
- dateParams
- (uk)/dashboard/[[...date]]/page.tsx
- pageMeta
- fr/maps/[[...date]]/page.tsx
- fr/strikes/[[...date]]/page.tsx
- (uk)/[[...date]]/page.tsx
- (uk)/maps/[[...date]]/page.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `flags` - 59 edges
2. `pageMeta()` - 56 edges
3. `href()` - 41 edges
4. `Architecture` - 39 edges
5. `fmt()` - 38 edges
6. `useApp()` - 35 edges
7. `MapsCompare()` - 35 edges
8. `react` - 27 edges
9. `StrikesMap()` - 26 edges
10. `Lang` - 26 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Top 5 Highest-Impact Changes` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/geo.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (58 total, 2 thin omitted)

### Community 0 - "ctx.ts"
Cohesion: 0.09
Nodes (24): AppCtx, Ctx, DashIssue, DashLang, strings(), DashProvider(), EmbedFrame(), Tooltip() (+16 more)

### Community 1 - "flags"
Cohesion: 0.07
Nodes (81): useApp(), Dashboard(), MapsView(), StrikesView(), fetchJson(), JSON_CACHE, STICKY, useChartW() (+73 more)

### Community 2 - "ui.ts"
Cohesion: 0.13
Nodes (17): metadata, metadata, metadata, metadata, IssueSelect(), LangLink(), LangPicker(), NotFound() (+9 more)

### Community 3 - "digest.ts"
Cohesion: 0.18
Nodes (11): P, PhaseExplorer(), ArticlePreview, Fire, LossRow, PresentationBody, PresPhase, Side (+3 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+29 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.07
Nodes (22): MapsCompare, StrikesMap, makeGeo(), ALL_G, ALL_V, BASEMAPS, DsE, dsKey() (+14 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (32): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada (+24 more)

### Community 8 - "mapParts.tsx"
Cohesion: 0.13
Nodes (28): areaTiles(), Cities(), countV(), dirOf(), DIRS, Ev, fitFront(), Geo (+20 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "kmBetween"
Cohesion: 0.29
Nodes (7): lineChanges(), lineDiff(), inRings(), LL, Rings, toArea(), kmBetween()

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.17
Nodes (11): ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo)., Gaps (priority) (+3 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.12
Nodes (26): byPlace(), GCOL, Grp, grpOf(), GRPS, ICO, KIND, placeKey() (+18 more)

### Community 17 - "route.tsx"
Cohesion: 0.32
Nodes (7): dynamic, dynamicParams, generateStaticParams(), GET(), mp(), getMapsUrl, ref_next_og

### Community 18 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 21 - "articlesMeta"
Cohesion: 0.21
Nodes (5): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta()

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
Cohesion: 0.21
Nodes (9): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, SrcChip(), TocSpy(), diploTitle() (+1 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 29 - "Html.tsx"
Cohesion: 0.14
Nodes (12): metadata, metadata, metadata, metadata, app_globals, metadata, FONTS, Html() (+4 more)

### Community 31 - "DashPage.tsx"
Cohesion: 0.16
Nodes (10): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), mapsLd() (+2 more)

### Community 32 - "en/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 33 - "page.ts"
Cohesion: 0.14
Nodes (32): sitemap(), Architecture, articleParams, ArticlesPage(), hrefs, LdList(), DirLinks(), HashRedirect() (+24 more)

### Community 34 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.09
Nodes (18): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+10 more)

### Community 35 - "text.ts"
Cohesion: 0.10
Nodes (21): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, elapsed() (+13 more)

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 39 - "articleMeta"
Cohesion: 0.12
Nodes (15): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+7 more)

### Community 40 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 41 - "potential.ts"
Cohesion: 0.08
Nodes (39): Global Constraints, Review Focus, Strike Potential Implementation Plan, Task 0: Branch and clean-up of the spike, Task 1: The model — `lib/potential.ts`, Task 2: The data — `public/potential.json` + validate, Task 4: Translations, editor stats, docs, addM() (+31 more)

### Community 42 - "ArticleList.tsx"
Cohesion: 0.32
Nodes (7): ALL, ArticleList(), code(), F, norm(), ref_next_image, ArticleItem

### Community 43 - "data.ts"
Cohesion: 0.18
Nodes (24): DigestPage(), issueLd(), Mast(), NEW_PAGES, NW_ART, ART_DIR, domOf(), getArticle (+16 more)

### Community 44 - "ArticlePage.tsx"
Cohesion: 0.16
Nodes (22): artHrefs(), Bars(), Block(), Donut(), heading(), IN_ART, LdJson(), num() (+14 more)

### Community 45 - "Scenarios.tsx"
Cohesion: 0.40
Nodes (5): CHAMBERS, L, pct(), Scenarios(), ScenariosBlock

### Community 46 - "fr/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 47 - "Item.tsx"
Cohesion: 0.24
Nodes (8): Item(), Local(), RC, liIco(), personIcons(), Strikes, Item, Source

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

### Community 52 - "pageMeta"
Cohesion: 0.18
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dirDesc(), pageMeta() (+1 more)

### Community 53 - "fr/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 54 - "fr/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 55 - "(uk)/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 56 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 57 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

## Knowledge Gaps
- **331 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+326 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 432 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `mapParts.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `de/dashboard/[[...date]]/page.tsx`, `Findings: On-Page SEO`, `Action Plan — warorientyr.com`, `DashPage.tsx`, `en/strikes/[[...date]]/page.tsx`, `page.ts`, `SXO: warorientyr.com/en (English edition)`, `de/maps/[[...date]]/page.tsx`, `Sitemap audit: https://warorientyr.com`, `data.ts`, `fr/dashboard/[[...date]]/page.tsx`, `de/strikes/[[...date]]/page.tsx`, `dateParams`, `(uk)/dashboard/[[...date]]/page.tsx`, `fr/maps/[[...date]]/page.tsx`, `fr/strikes/[[...date]]/page.tsx`, `(uk)/[[...date]]/page.tsx`, `(uk)/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `resolve()` connect `page.ts` to `SXO: warorientyr.com/en (English edition)`, `Findings: Content Quality`, `Sitemap audit: https://warorientyr.com`, `data.ts`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `pageMeta`, `Action Plan — warorientyr.com`, `DashPage.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `href()` connect `page.ts` to `ctx.ts`, `flags`, `ui.ts`, `SXO: warorientyr.com/en (English edition)`, `Maps.tsx`, `articleMeta`, `mapParts.tsx`, `data.ts`, `ArticlePage.tsx`, `StrikesCard.tsx`, `pageMeta`, `Digest.tsx`, `DashPage.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 38 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _331 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ctx.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09359605911330049 - nodes in this community are weakly interconnected._