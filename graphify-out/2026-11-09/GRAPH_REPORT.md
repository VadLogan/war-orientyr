# Graph Report - war-orientyr  (2026-11-09)

## Corpus Check
- 134 files · ~698,503 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 980 nodes · 2665 edges · 48 communities (46 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 103 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88ae640c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Strike potential — design
- Panels.tsx
- (uk)/dashboard/[[...date]]/page.tsx
- ArticlePage.tsx
- Findings: Content Quality
- package.json
- Maps.tsx
- scripts/i18n.mjs
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- GEO / AI Search Readiness: warorientyr.com (EN)
- Findings: On-Page SEO
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- StrikesCard.tsx
- SXO: warorientyr.com/en (English edition)
- dateParams
- Sitemap audit: https://warorientyr.com
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Digest.tsx
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- icons.ts
- ui.ts
- next.config.mjs
- en/maps/[[...date]]/page.tsx
- Technical SEO findings: warorientyr.com (focus /en)
- mapParts.tsx
- SEO Audit — warorientyr.com (entry: /en)
- text.ts
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- de/maps/[[...date]]/page.tsx
- data.ts
- en/dashboard/[[...date]]/page.tsx
- strikes.ts
- MapsSeo.tsx
- pageMeta
- DashPage.tsx
- digest.ts
- de/strikes/[[...date]]/page.tsx
- en/strikes/[[...date]]/page.tsx
- fr/maps/[[...date]]/page.tsx
- (uk)/maps/[[...date]]/page.tsx
- fr/strikes/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 66 edges
2. `pageMeta()` - 56 edges
3. `fmt()` - 53 edges
4. `useApp()` - 51 edges
5. `href()` - 48 edges
6. `Architecture` - 46 edges
7. `MapsCompare()` - 35 edges
8. `dayN()` - 31 edges
9. `react` - 29 edges
10. `StrikesMap()` - 26 edges

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

## Communities (48 total, 2 thin omitted)

### Community 0 - "Strike potential — design"
Cohesion: 0.15
Nodes (12): Anti-goals (would make it a failure even if it works), Comparison with 2025, Goals, Intent, Left to the builder, Non-goals, Risks, Scenarios (+4 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.06
Nodes (102): AppCtx, Ctx, strings(), useApp(), CrossLinks(), dm(), LandCostNote(), PotentialNote() (+94 more)

### Community 2 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 3 - "ArticlePage.tsx"
Cohesion: 0.05
Nodes (61): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+53 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (38): StrikesThumb(), dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights (+30 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.07
Nodes (41): MapsCompare, StrikesMap, useElWidth(), fitFront(), lineChanges(), lineDiff(), MarkIco(), PAIR_SRC (+33 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (32): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada (+24 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.17
Nodes (11): ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo)., Gaps (priority) (+3 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.14
Nodes (19): DashLang, byPlace(), GCOL, Grp, grpOf(), GRPS, ICO, KIND (+11 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "dateParams"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 20 - "Sitemap audit: https://warorientyr.com"
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
Nodes (26): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+18 more)

### Community 25 - "Digest.tsx"
Cohesion: 0.20
Nodes (10): ChkToggle(), AnLine(), anMonth(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy() (+2 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 29 - "ui.ts"
Cohesion: 0.06
Nodes (29): metadata, metadata, metadata, metadata, metadata, metadata, metadata, app_globals (+21 more)

### Community 31 - "en/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 33 - "mapParts.tsx"
Cohesion: 0.15
Nodes (19): dynamic, dynamicParams, generateStaticParams(), Cities(), Ev, Geo, Layers(), LY (+11 more)

### Community 34 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 35 - "text.ts"
Cohesion: 0.10
Nodes (20): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, elapsed() (+12 more)

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 39 - "data.ts"
Cohesion: 0.06
Nodes (79): generateMetadata(), generateMetadata(), generateMetadata(), sitemap(), generateMetadata(), Architecture, ALL, ArticleList() (+71 more)

### Community 40 - "en/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 41 - "strikes.ts"
Cohesion: 0.07
Nodes (46): DashIssue, Decision vs spec, Global Constraints, Review Focus, Strike Potential Implementation Plan, Task 0: Branch and clean-up of the spike, Task 1: The model — `lib/potential.ts`, Task 2: The data — `public/potential.json` + validate (+38 more)

### Community 43 - "MapsSeo.tsx"
Cohesion: 0.29
Nodes (12): areaTiles(), countV(), dirOf(), lastDay(), vgOf(), dmy(), MapsCard(), dm() (+4 more)

### Community 45 - "pageMeta"
Cohesion: 0.18
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dirDesc(), pageMeta() (+1 more)

### Community 46 - "DashPage.tsx"
Cohesion: 0.15
Nodes (13): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), hl() (+5 more)

### Community 47 - "digest.ts"
Cohesion: 0.12
Nodes (18): Dist(), Item(), Local(), LOCK, RC, SrcChip(), liIco(), personIcons() (+10 more)

### Community 48 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 50 - "en/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 51 - "fr/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 53 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 54 - "fr/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **335 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+330 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 436 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `(uk)/dashboard/[[...date]]/page.tsx`, `Findings: On-Page SEO`, `SXO: warorientyr.com/en (English edition)`, `dateParams`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`, `en/maps/[[...date]]/page.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `SEO Audit — warorientyr.com (entry: /en)`, `de/maps/[[...date]]/page.tsx`, `data.ts`, `en/dashboard/[[...date]]/page.tsx`, `MapsSeo.tsx`, `DashPage.tsx`, `de/strikes/[[...date]]/page.tsx`, `en/strikes/[[...date]]/page.tsx`, `fr/maps/[[...date]]/page.tsx`, `(uk)/maps/[[...date]]/page.tsx`, `fr/strikes/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `resolve()` connect `data.ts` to `Technical SEO findings: warorientyr.com (focus /en)`, `SEO Audit — warorientyr.com (entry: /en)`, `Findings: Content Quality`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `pageMeta`, `DashPage.tsx`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `href()` connect `data.ts` to `Technical SEO findings: warorientyr.com (focus /en)`, `Panels.tsx`, `mapParts.tsx`, `ArticlePage.tsx`, `Maps.tsx`, `MapsSeo.tsx`, `pageMeta`, `DashPage.tsx`, `StrikesCard.tsx`, `Digest.tsx`, `ui.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _335 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0649480131035465 - nodes in this community are weakly interconnected._
- **Should `ArticlePage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._