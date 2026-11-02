# Graph Report - election-article-interactive-charts-c18e4c  (2026-11-02)

## Corpus Check
- 106 files · ~528,682 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 772 nodes · 1850 edges · 40 communities (38 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9da0cc39`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- flags
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
- ArticlePage.tsx
- GEO / AI Search Readiness: warorientyr.com (EN)
- resolve
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- Maps.tsx
- SXO: warorientyr.com/en (English edition)
- DashPage.tsx
- Flag.tsx
- Technical SEO findings: warorientyr.com (focus /en)
- Sitemap audit: https://warorientyr.com
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
- page.ts
- de/strikes/[[...date]]/page.tsx
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- (uk)/dashboard/[[...date]]/page.tsx
- pageMeta

## God Nodes (most connected - your core abstractions)
1. `flags` - 50 edges
2. `pageMeta()` - 42 edges
3. `fmt()` - 33 edges
4. `useApp()` - 32 edges
5. `href()` - 30 edges
6. `StrikesMap()` - 26 edges
7. `Lang` - 23 edges
8. `react` - 23 edges
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
- `Low` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/technical.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (40 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.13
Nodes (17): COUNTRIES, CRX, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, elapsed(), EN_COUNTRIES (+9 more)

### Community 1 - "flags"
Cohesion: 0.08
Nodes (68): AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard(), MapsView() (+60 more)

### Community 2 - "Html.tsx"
Cohesion: 0.15
Nodes (12): metadata, metadata, metadata, app_globals, metadata, FONTS, Html(), siteMeta() (+4 more)

### Community 3 - "digest.ts"
Cohesion: 0.12
Nodes (16): Dist(), Local(), LOCK, RC, SrcChip(), ArticleBlock, ArticlePreview, Fire (+8 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+27 more)

### Community 6 - "ui.ts"
Cohesion: 0.06
Nodes (51): metadata, metadata, metadata, Block(), rich(), Sources(), EmbedFrame(), Flag() (+43 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "stats.ts"
Cohesion: 0.21
Nodes (15): dayRecords, LossRecord, REC_KEYS, StrikeRecord, Strikes, compare(), line(), main() (+7 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "ArticlePage.tsx"
Cohesion: 0.08
Nodes (47): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, sitemap(), dynamicParams (+39 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "resolve"
Cohesion: 0.13
Nodes (15): resolve(), Facts from the code that shape the sitemap, AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8 (+7 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "Maps.tsx"
Cohesion: 0.06
Nodes (78): Architecture, MapsCompare, StrikesMap, areaTiles(), Cities(), countV(), dirOf(), DIRS (+70 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "DashPage.tsx"
Cohesion: 0.18
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), getMapsUrl

### Community 19 - "Flag.tsx"
Cohesion: 0.20
Nodes (10): f2(), H(), R(), star(), V(), CHAMBERS, L, pct() (+2 more)

### Community 20 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 21 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.22
Nodes (8): app/robots.ts, app/sitemap.ts, Expected result, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com, Validation report

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
Cohesion: 0.20
Nodes (10): ChkToggle(), countSources(), Digest(), SecIco(), Sources(), SRC_ORD, TocSpy(), secIcon (+2 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.18
Nodes (12): Item(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, liIco(), PEOPLE (+4 more)

### Community 29 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 31 - "en/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "page.ts"
Cohesion: 0.20
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dateParams

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

### Community 38 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 40 - "pageMeta"
Cohesion: 0.22
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, pageMeta()

## Knowledge Gaps
- **279 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 361 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `page.ts`, `de/strikes/[[...date]]/page.tsx`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `Findings: On-Page SEO`, `(uk)/dashboard/[[...date]]/page.tsx`, `ui.ts`, `ArticlePage.tsx`, `resolve`, `Maps.tsx`, `SXO: warorientyr.com/en (English edition)`, `DashPage.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`, `de/maps/[[...date]]/page.tsx`, `en/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `resolve()` connect `resolve` to `page.ts`, `Findings: On-Page SEO`, `pageMeta`, `ArticlePage.tsx`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `Maps.tsx`, `DashPage.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `Action Plan — warorientyr.com`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `react` connect `flags` to `digest.ts`, `package.json`, `ui.ts`, `ArticlePage.tsx`, `Maps.tsx`, `Flag.tsx`, `Digest.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _279 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.08227848101265822 - nodes in this community are weakly interconnected._