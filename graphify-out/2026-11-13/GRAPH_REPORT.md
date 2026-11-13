# Graph Report - war-orientyr  (2026-11-13)

## Corpus Check
- 139 files · ~861,665 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 1064 nodes · 2966 edges · 60 communities (58 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc7099b0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- page.ts
- flags
- MapsCompare
- articleMeta
- Findings: Content Quality
- package.json
- Maps.tsx
- scripts/i18n.mjs
- /maps on phones — design v2 and implementation brief
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Html.tsx
- GEO / AI Search Readiness: warorientyr.com (EN)
- TargetsSeo.tsx
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- StrikesCard.tsx
- DashPage.tsx
- pageMeta
- articlesMeta
- Architecture
- Findings: On-Page SEO
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- icons.ts
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- Scenarios.tsx
- ui.ts
- next.config.mjs
- DashPage
- Flag.tsx
- mapParts.tsx
- SEO Audit — warorientyr.com (entry: /en)
- text.ts
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- Digest.tsx
- en/dashboard/[[...date]]/page.tsx
- fr/dashboard/[[...date]]/page.tsx
- potential.ts
- ArticlePage.tsx
- geo.ts
- proxy.ts
- SXO: warorientyr.com/en (English edition)
- de/strikes/[[...date]]/page.tsx
- Item.tsx
- maps/[file]/route.tsx
- Sitemap audit: https://warorientyr.com
- digest.ts
- data.ts
- Technical SEO findings: warorientyr.com (focus /en)
- de/dashboard/[[...date]]/page.tsx
- StateMap.tsx
- dateParams
- en/strikes/[[...date]]/page.tsx
- (uk)/maps/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx
- utm

## God Nodes (most connected - your core abstractions)
1. `flags` - 73 edges
2. `pageMeta()` - 65 edges
3. `Architecture` - 65 edges
4. `fmt()` - 60 edges
5. `href()` - 55 edges
6. `useApp()` - 53 edges
7. `MapsCompare()` - 38 edges
8. `dayN()` - 31 edges
9. `react` - 29 edges
10. `Lang` - 28 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `4.2 Заяви рф (board v2 · 3)` --references--> `Mark()`  [INFERRED]
  docs/maps-mobile-spec.md → components/dash/mapParts.tsx
- `4.3 Джерела` --references--> `areaTiles()`  [INFERRED]
  docs/maps-mobile-spec.md → components/dash/mapParts.tsx
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (60 total, 2 thin omitted)

### Community 0 - "page.ts"
Cohesion: 0.15
Nodes (26): sitemap(), articleParams, DirLinks(), HashRedirect(), NewPages(), getArticle, getArticleDirs, getArticleList (+18 more)

### Community 1 - "flags"
Cohesion: 0.06
Nodes (110): AppCtx, Ctx, strings(), useApp(), CrossLinks(), dm(), LandCostNote(), PotentialNote() (+102 more)

### Community 2 - "MapsCompare"
Cohesion: 0.22
Nodes (18): useElWidth(), lineChanges(), lineDiff(), byDate(), dmy(), dsKey(), dsKinds(), dsOnce() (+10 more)

### Community 3 - "articleMeta"
Cohesion: 0.12
Nodes (15): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+7 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+29 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.07
Nodes (21): MapsCompare, StrikesMap, TargetsMap, makeGeo(), ALL_G, ALL_V, BASEMAPS, DsE (+13 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (32): Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada, 6. Check and report (+24 more)

### Community 8 - "/maps on phones — design v2 and implementation brief"
Cohesion: 0.08
Nodes (24): 10. States and edge cases, 11. Visual rules, 12. Accessibility, 13. Measuring the result, 14. Acceptance checks on real devices, 15. Implementation status (2026-11-13), 1. The problem this solves, 2. Principles (+16 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Html.tsx"
Cohesion: 0.14
Nodes (12): metadata, metadata, metadata, metadata, app_globals, metadata, FONTS, Html() (+4 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "TargetsSeo.tsx"
Cohesion: 0.23
Nodes (10): Target, TargetsSeo(), reaching(), Weapon, WeaponGroup, WeaponImg, WEAPONS, WPN_GROUPS (+2 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.17
Nodes (11): ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo)., Gaps (priority) (+3 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.12
Nodes (24): DashLang, byPlace(), GCOL, Grp, grpOf(), GRPS, ICO, KIND (+16 more)

### Community 17 - "DashPage.tsx"
Cohesion: 0.17
Nodes (20): hrefs, LdList(), issueLd(), ImgZoom(), Ld(), AN, Mast(), NEW_PAGES (+12 more)

### Community 18 - "pageMeta"
Cohesion: 0.14
Nodes (12): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dirDesc(), mapSecDesc() (+4 more)

### Community 19 - "articlesMeta"
Cohesion: 0.19
Nodes (6): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), seoMeta()

### Community 20 - "Architecture"
Cohesion: 0.19
Nodes (22): Architecture, ALL, ArticleList(), code(), F, norm(), Donut(), dashLd() (+14 more)

### Community 21 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 22 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (26): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+18 more)

### Community 25 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "Scenarios.tsx"
Cohesion: 0.40
Nodes (5): CHAMBERS, L, pct(), Scenarios(), ScenariosBlock

### Community 29 - "ui.ts"
Cohesion: 0.13
Nodes (19): metadata, metadata, metadata, metadata, IssueSelect(), LangLink(), LangPicker(), NotFound() (+11 more)

### Community 31 - "DashPage"
Cohesion: 0.10
Nodes (15): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+7 more)

### Community 32 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 33 - "mapParts.tsx"
Cohesion: 0.14
Nodes (26): areaTiles(), Cities(), countV(), dirOf(), DIRS, Ev, fitFront(), Geo (+18 more)

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

### Community 38 - "Digest.tsx"
Cohesion: 0.18
Nodes (11): ChkToggle(), AnLine(), anMonth(), countSources(), Digest(), Sources(), SRC_ORD, SrcChip() (+3 more)

### Community 39 - "en/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 40 - "fr/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 41 - "potential.ts"
Cohesion: 0.05
Nodes (55): DashIssue, Decision vs spec, Global Constraints, Review Focus, Strike Potential Implementation Plan, Task 0: Branch and clean-up of the spike, Task 1: The model — `lib/potential.ts`, Task 2: The data — `public/potential.json` + validate (+47 more)

### Community 42 - "ArticlePage.tsx"
Cohesion: 0.20
Nodes (15): artHrefs(), Bars(), Block(), heading(), IN_ART, LdJson(), num(), rich() (+7 more)

### Community 43 - "geo.ts"
Cohesion: 0.50
Nodes (4): inRings(), LL, Rings, toArea()

### Community 44 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 45 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 46 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, strikesParams()

### Community 47 - "Item.tsx"
Cohesion: 0.21
Nodes (10): Dist(), Item(), Local(), LOCK, RC, liIco(), personIcons(), distLabel() (+2 more)

### Community 48 - "maps/[file]/route.tsx"
Cohesion: 0.22
Nodes (10): dynamic, dynamicParams, generateStaticParams(), GET(), mp(), Rings, MapsData, StrikesThumb() (+2 more)

### Community 49 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 50 - "digest.ts"
Cohesion: 0.20
Nodes (10): P, PhaseExplorer(), ArticlePreview, Item, PresentationBody, PresPhase, Side, Status (+2 more)

### Community 51 - "data.ts"
Cohesion: 0.13
Nodes (29): dynamic, dynamicParams, generateStaticParams(), GET(), ICO, icon(), sp(), ArticlesPage() (+21 more)

### Community 52 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 53 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dashParams()

### Community 54 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 55 - "dateParams"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 56 - "en/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 57 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 58 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 59 - "utm"
Cohesion: 0.40
Nodes (4): Commands, utm(), ref_node_assert, [url, campaign = new Date().toISOString().slice(0, 10), source = "telegram"]

## Knowledge Gaps
- **366 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+361 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 469 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `page.ts`, `scripts/i18n.mjs`, `DashPage.tsx`, `articlesMeta`, `Architecture`, `Findings: On-Page SEO`, `Action Plan — warorientyr.com`, `DashPage`, `mapParts.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `en/dashboard/[[...date]]/page.tsx`, `fr/dashboard/[[...date]]/page.tsx`, `SXO: warorientyr.com/en (English edition)`, `de/strikes/[[...date]]/page.tsx`, `Sitemap audit: https://warorientyr.com`, `data.ts`, `Technical SEO findings: warorientyr.com (focus /en)`, `de/dashboard/[[...date]]/page.tsx`, `dateParams`, `en/strikes/[[...date]]/page.tsx`, `(uk)/maps/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `resolve()` connect `data.ts` to `page.ts`, `SEO Audit — warorientyr.com (entry: /en)`, `Findings: Content Quality`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `DashPage.tsx`, `pageMeta`, `Sitemap audit: https://warorientyr.com`, `Architecture`, `Technical SEO findings: warorientyr.com (focus /en)`, `Action Plan — warorientyr.com`, `DashPage`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `Architecture` connect `Architecture` to `page.ts`, `flags`, `MapsCompare`, `articleMeta`, `Maps.tsx`, `scripts/i18n.mjs`, `TargetsSeo.tsx`, `StrikesCard.tsx`, `DashPage.tsx`, `pageMeta`, `DashPage`, `mapParts.tsx`, `Digest.tsx`, `potential.ts`, `ArticlePage.tsx`, `geo.ts`, `de/strikes/[[...date]]/page.tsx`, `maps/[file]/route.tsx`, `data.ts`, `de/dashboard/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Every issue: search titles and post links (all desks)`) actually correct?**
  _`pageMeta()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 64 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 64 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _366 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.0614923134608174 - nodes in this community are weakly interconnected._