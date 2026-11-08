# Graph Report - war-orientyr  (2026-11-08)

## Corpus Check
- 113 files · ~637,485 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 822 nodes · 2043 edges · 53 communities (50 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7250b7c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- flags
- ArticlePage.tsx
- digest.ts
- articleMeta
- package.json
- Maps.tsx
- scripts/i18n.mjs
- mapParts.tsx
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- MapsCompare
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- data.ts
- SXO: warorientyr.com/en (English edition)
- DashPage.tsx
- Flag.tsx
- publish.mjs
- dateParams
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
- scripts
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- en/maps/[[...date]]/page.tsx
- StateMap.tsx
- Recommended implementation (drafts, repo not modified)
- Html.tsx
- dependencies
- page.ts
- Main editor
- Scenarios.tsx
- de/maps/[[...date]]/page.tsx
- Item.tsx
- (uk)/dashboard/[[...date]]/page.tsx
- WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)
- proxy.ts
- ref_node_fs
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 55 edges
2. `pageMeta()` - 43 edges
3. `href()` - 36 edges
4. `MapsCompare()` - 33 edges
5. `fmt()` - 33 edges
6. `useApp()` - 32 edges
7. `StrikesMap()` - 26 edges
8. `Lang` - 26 edges
9. `Architecture` - 26 edges
10. `react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `3. English desk — for a reader outside Ukraine` --references--> `texts()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → lib/i18n.mjs
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Top 5 Highest-Impact Changes` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/geo.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (53 total, 3 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.12
Nodes (19): COUNTRIES, CRX, dayLabel(), DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX (+11 more)

### Community 1 - "flags"
Cohesion: 0.08
Nodes (73): Architecture, AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard() (+65 more)

### Community 2 - "ArticlePage.tsx"
Cohesion: 0.05
Nodes (77): generateMetadata(), metadata, generateMetadata(), metadata, metadata, sitemap(), generateMetadata(), metadata (+69 more)

### Community 3 - "digest.ts"
Cohesion: 0.18
Nodes (11): P, PhaseExplorer(), ArticlePreview, LossRow, PresentationBody, PresPhase, Section, Side (+3 more)

### Community 4 - "articleMeta"
Cohesion: 0.05
Nodes (38): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+30 more)

### Community 5 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @types/d3, @types/node, @types/react, typescript, name, private, version (+8 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.08
Nodes (17): MapsCompare, StrikesMap, makeGeo(), ALL_G, ALL_V, BASEMAPS, DsE, FsButton() (+9 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.15
Nodes (12): ref_node_path, dataFiles(), files, filesOf(), isIssue(), MISSING, OUT, PUB (+4 more)

### Community 8 - "mapParts.tsx"
Cohesion: 0.15
Nodes (22): areaTiles(), Cities(), countV(), DIRS, Ev, Geo, lastDay(), Layers() (+14 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "MapsCompare"
Cohesion: 0.18
Nodes (17): dirOf(), fitFront(), lineChanges(), byDate(), dmy(), dsKey(), dsKinds(), dsOnce() (+9 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "data.ts"
Cohesion: 0.06
Nodes (59): Data (`public/`), MapsData, byPlace(), GCOL, Grp, grpOf(), GRPS, ICO (+51 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "DashPage.tsx"
Cohesion: 0.16
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), getMapsUrl (+1 more)

### Community 19 - "Flag.tsx"
Cohesion: 0.39
Nodes (5): f2(), H(), R(), star(), V()

### Community 20 - "publish.mjs"
Cohesion: 0.14
Nodes (11): args, cur, curRaw, force, kept, miss, PUB, raw (+3 more)

### Community 21 - "dateParams"
Cohesion: 0.33
Nodes (4): dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 22 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.11
Nodes (13): ART, d, DE_FILE, deep, EN, miss, noId, noMap (+5 more)

### Community 25 - "Digest.tsx"
Cohesion: 0.23
Nodes (9): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy(), diploTitle(), secTitle() (+1 more)

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

### Community 31 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "pageMeta"
Cohesion: 0.20
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, generateMetadata(), pageMeta(), Expected result, Other issues found, Sitemap audit: https://warorientyr.com (+1 more)

### Community 33 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, i18n:merge, i18n:merge:de, i18n:missing, i18n:missing:de, prebuild (+4 more)

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

### Community 39 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 40 - "Recommended implementation (drafts, repo not modified)"
Cohesion: 0.50
Nodes (4): app/robots.ts, app/sitemap.ts, Google News sitemap (optional, last 48h), Recommended implementation (drafts, repo not modified)

### Community 41 - "Html.tsx"
Cohesion: 0.18
Nodes (10): metadata, metadata, app_globals, metadata, FONTS, Html(), siteMeta(), viewport (+2 more)

### Community 42 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights

### Community 43 - "page.ts"
Cohesion: 0.19
Nodes (14): dynamicParams, generateStaticParams, DigestPage(), issueLd(), Mast(), getPreviews, DASH_DESC, resolve() (+6 more)

### Community 44 - "Main editor"
Cohesion: 0.20
Nodes (9): 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report, Article mode, Main editor, Scope (+1 more)

### Community 45 - "Scenarios.tsx"
Cohesion: 0.40
Nodes (5): CHAMBERS, L, pct(), Scenarios(), ScenariosBlock

### Community 46 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 47 - "Item.tsx"
Cohesion: 0.19
Nodes (11): Dist(), Item(), Local(), LOCK, RC, SrcChip(), liIco(), personIcons() (+3 more)

### Community 48 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 49 - "WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)"
Cohesion: 0.40
Nodes (4): Commands, Conventions, Tools, WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

### Community 50 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **290 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 379 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `flags`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `ArticlePage.tsx`, `articleMeta`, `en/maps/[[...date]]/page.tsx`, `page.ts`, `de/maps/[[...date]]/page.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `(uk)/dashboard/[[...date]]/page.tsx`, `SXO: warorientyr.com/en (English edition)`, `DashPage.tsx`, `dateParams`, `Action Plan — warorientyr.com`, `(uk)/strikes/[[...date]]/page.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `(uk)/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `resolve()` connect `page.ts` to `pageMeta`, `flags`, `ArticlePage.tsx`, `articleMeta`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `data.ts`, `DashPage.tsx`, `Action Plan — warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `href()` connect `ArticlePage.tsx` to `pageMeta`, `flags`, `Maps.tsx`, `mapParts.tsx`, `page.ts`, `MapsCompare`, `data.ts`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _290 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.0753501400560224 - nodes in this community are weakly interconnected._