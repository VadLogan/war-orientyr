# Graph Report - war-orientyr  (2026-11-02)

## Corpus Check
- 104 files · ~508,444 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 754 nodes · 1799 edges · 36 communities (34 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c0966df8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- Html.tsx
- page.ts
- Findings: On-Page SEO
- package.json
- ArticlePage.tsx
- scripts/i18n.mjs
- proxy.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- data.ts
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- Maps.tsx
- SXO: warorientyr.com/en (English edition)
- pageMeta
- Flag.tsx
- Technical SEO findings: warorientyr.com (focus /en)
- Sitemap audit: https://warorientyr.com
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- de/maps/[[...date]]/page.tsx
- next.config.mjs
- DigestPage.tsx
- de/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- (uk)/maps/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 47 edges
2. `pageMeta()` - 42 edges
3. `fmt()` - 33 edges
4. `useApp()` - 32 edges
5. `href()` - 30 edges
6. `StrikesMap()` - 26 edges
7. `MapsCompare()` - 22 edges
8. `Lang` - 22 edges
9. `react` - 22 edges
10. `dayN()` - 20 edges

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

## Communities (36 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.05
Nodes (57): ChkToggle(), countSources(), SecIco(), Sources(), SRC_ORD, fireLabel(), FireList(), Item() (+49 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.10
Nodes (53): useApp(), Dashboard(), MapsView(), StrikesView(), fetchJson(), JSON_CACHE, STICKY, useChartW() (+45 more)

### Community 2 - "Html.tsx"
Cohesion: 0.18
Nodes (10): metadata, metadata, app_globals, metadata, FONTS, Html(), siteMeta(), viewport (+2 more)

### Community 3 - "page.ts"
Cohesion: 0.31
Nodes (10): sitemap(), articleParams, getDates, getIssue, getLatest, getSourceMatrix, resolve(), SITE (+2 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+26 more)

### Community 6 - "ArticlePage.tsx"
Cohesion: 0.05
Nodes (69): dynamicParams, generateMetadata(), generateStaticParams, metadata, dynamicParams, generateMetadata(), generateStaticParams, metadata (+61 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "data.ts"
Cohesion: 0.11
Nodes (29): AppCtx, Ctx, DashIssue, DashLang, strings(), DashProvider(), Tooltip(), ART_DIR (+21 more)

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
Nodes (82): Architecture, MapsCompare, StrikesMap, useElWidth(), areaTiles(), Cities(), countV(), dirOf() (+74 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "pageMeta"
Cohesion: 0.11
Nodes (15): dynamicParams, generateMetadata(), generateStaticParams, generateMetadata(), dynamicParams, generateMetadata(), generateStaticParams, dynamicParams (+7 more)

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 21 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 22 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (25): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+17 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 29 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "DigestPage.tsx"
Cohesion: 0.16
Nodes (12): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams (+4 more)

### Community 33 - "de/strikes/[[...date]]/page.tsx"
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

### Community 40 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 41 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **275 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+270 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `DigestPage.tsx`, `de/strikes/[[...date]]/page.tsx`, `text.ts`, `en/dashboard/[[...date]]/page.tsx`, `page.ts`, `Findings: On-Page SEO`, `ArticlePage.tsx`, `(uk)/maps/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `Maps.tsx`, `SXO: warorientyr.com/en (English edition)`, `Technical SEO findings: warorientyr.com (focus /en)`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`, `de/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `resolve()` connect `page.ts` to `DigestPage.tsx`, `Findings: On-Page SEO`, `data.ts`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `Maps.tsx`, `pageMeta`, `Technical SEO findings: warorientyr.com (focus /en)`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `react` connect `data.ts` to `text.ts`, `Panels.tsx`, `package.json`, `ArticlePage.tsx`, `Maps.tsx`, `Flag.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _275 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05034965034965035 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1041776837652036 - nodes in this community are weakly interconnected._