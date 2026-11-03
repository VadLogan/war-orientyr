# Graph Report - war-orientyr  (2026-11-03)

## Corpus Check
- 112 files · ~568,393 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 813 nodes · 2008 edges · 43 communities (41 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43059757`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- ui.ts
- digest.ts
- Findings: On-Page SEO
- package.json
- mapParts.tsx
- scripts/i18n.mjs
- strikes.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- data.ts
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- Maps.tsx
- SXO: warorientyr.com/en (English edition)
- DashPage.tsx
- StrikesCard.tsx
- StrikesThumb.tsx
- pageMeta
- resolve
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Digest.tsx
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- icons.ts
- Technical SEO findings: warorientyr.com (focus /en)
- next.config.mjs
- page.ts
- DigestPage.tsx
- de/strikes/[[...date]]/page.tsx
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- en/maps/[[...date]]/page.tsx
- ArticlePage.tsx
- Recommended implementation (drafts, repo not modified)
- Item.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 55 edges
2. `pageMeta()` - 42 edges
3. `href()` - 34 edges
4. `fmt()` - 33 edges
5. `useApp()` - 32 edges
6. `MapsCompare()` - 30 edges
7. `StrikesMap()` - 26 edges
8. `Lang` - 26 edges
9. `Architecture` - 26 edges
10. `react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Top 5 Highest-Impact Changes` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/geo.md → lib/page.ts
- `Synthesis` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/FULL-AUDIT-REPORT.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (43 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.11
Nodes (21): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, diploTitle() (+13 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.08
Nodes (72): Architecture, AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard() (+64 more)

### Community 2 - "ui.ts"
Cohesion: 0.05
Nodes (56): metadata, metadata, metadata, metadata, metadata, app_globals, metadata, metadata (+48 more)

### Community 3 - "digest.ts"
Cohesion: 0.20
Nodes (9): ArticlePreview, Digest, Fire, LossRow, Side, Source, Status, Tone (+1 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+27 more)

### Community 6 - "mapParts.tsx"
Cohesion: 0.14
Nodes (24): areaTiles(), Cities(), countV(), DIRS, Ev, fitFront(), Geo, lastDay() (+16 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "strikes.ts"
Cohesion: 0.20
Nodes (16): dayRecords, LossRecord, REC_KEYS, StrikeRecord, DISTC, stkDist(), Strikes, compare() (+8 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "data.ts"
Cohesion: 0.13
Nodes (26): generateMetadata(), generateMetadata(), sitemap(), generateMetadata(), articleParams, articlesMeta(), ArticlesPage(), ART_DIR (+18 more)

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
Cohesion: 0.07
Nodes (27): MapsCompare, StrikesMap, dirOf(), lineChanges(), ALL_G, ALL_V, BASEMAPS, byDate() (+19 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "DashPage.tsx"
Cohesion: 0.14
Nodes (12): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+4 more)

### Community 19 - "StrikesCard.tsx"
Cohesion: 0.19
Nodes (17): Tiles(), byPlace(), GCOL, grpOf(), GRPS, ICO, KIND, STK_CITIES (+9 more)

### Community 20 - "StrikesThumb.tsx"
Cohesion: 0.25
Nodes (6): MapsData, Grp, StkMark(), Drawn, ThumbPt, StrikesBase

### Community 21 - "pageMeta"
Cohesion: 0.22
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, pageMeta(), Expected result, Other issues found, Sitemap audit: https://warorientyr.com, Validation report

### Community 22 - "resolve"
Cohesion: 0.22
Nodes (8): resolve(), Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing), Facts from the code that shape the sitemap, Low

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (25): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+17 more)

### Community 25 - "Digest.tsx"
Cohesion: 0.24
Nodes (7): ChkToggle(), countSources(), Sources(), SRC_ORD, RC, SrcChip(), TocSpy()

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.17
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 29 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.25
Nodes (7): Category status, Critical / High, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 31 - "page.ts"
Cohesion: 0.25
Nodes (5): dynamicParams, generateMetadata(), generateStaticParams, seoMeta(), SITE_DESC

### Community 32 - "DigestPage.tsx"
Cohesion: 0.20
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DigestPage(), getRecords (+1 more)

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

### Community 38 - "en/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 39 - "ArticlePage.tsx"
Cohesion: 0.05
Nodes (59): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+51 more)

### Community 40 - "Recommended implementation (drafts, repo not modified)"
Cohesion: 0.50
Nodes (4): app/robots.ts, app/sitemap.ts, Google News sitemap (optional, last 48h), Recommended implementation (drafts, repo not modified)

### Community 47 - "Item.tsx"
Cohesion: 0.31
Nodes (7): Dist(), Item(), Local(), LOCK, liIco(), personIcons(), distLabel()

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **288 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+283 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 377 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `DigestPage.tsx`, `de/strikes/[[...date]]/page.tsx`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `Panels.tsx`, `ui.ts`, `en/maps/[[...date]]/page.tsx`, `ArticlePage.tsx`, `Findings: On-Page SEO`, `SEO Audit — warorientyr.com (entry: /en)`, `SXO: warorientyr.com/en (English edition)`, `DashPage.tsx`, `resolve`, `(uk)/strikes/[[...date]]/page.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `page.ts`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `resolve()` connect `resolve` to `DigestPage.tsx`, `Panels.tsx`, `Findings: On-Page SEO`, `data.ts`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `DashPage.tsx`, `pageMeta`, `page.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `href()` connect `ui.ts` to `Panels.tsx`, `mapParts.tsx`, `ArticlePage.tsx`, `data.ts`, `Maps.tsx`, `StrikesCard.tsx`, `pageMeta`, `Technical SEO findings: warorientyr.com (focus /en)`, `page.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _288 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07802639127940333 - nodes in this community are weakly interconnected._