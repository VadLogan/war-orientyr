# Graph Report - war-orientyr  (2026-11-12)

## Corpus Check
- 138 files · ~834,071 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 1038 nodes · 2934 edges · 58 communities (56 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c177865`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Architecture
- flags
- MapsCompare
- articleMeta
- Findings: On-Page SEO
- package.json
- Maps.tsx
- scripts/i18n.mjs
- PresentationPage.tsx
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Html.tsx
- GEO / AI Search Readiness: warorientyr.com (EN)
- TargetsSeo.tsx
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- StrikesCard.tsx
- DigestPage.tsx
- pageMeta
- ArticlesPage.tsx
- DashText.tsx
- Mast.tsx
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- icons.ts
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- ArticleList.tsx
- ui.ts
- next.config.mjs
- page.ts
- Flag.tsx
- mapParts.tsx
- SEO Audit — warorientyr.com (entry: /en)
- text.ts
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- Digest.tsx
- routes.ts
- DashPage.tsx
- potential.ts
- ArticlePage.tsx
- lineDiff
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
- de/[[...date]]/page.tsx
- (uk)/[[...date]]/page.tsx
- resolve

## God Nodes (most connected - your core abstractions)
1. `flags` - 73 edges
2. `pageMeta()` - 65 edges
3. `Architecture` - 63 edges
4. `fmt()` - 60 edges
5. `href()` - 55 edges
6. `useApp()` - 53 edges
7. `MapsCompare()` - 37 edges
8. `dayN()` - 31 edges
9. `react` - 29 edges
10. `Lang` - 28 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Facts from the code that shape the sitemap` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (58 total, 2 thin omitted)

### Community 0 - "Architecture"
Cohesion: 0.31
Nodes (13): sitemap(), Architecture, StkSwitch(), AnLine(), DirLinks(), Records(), dirHref(), dirSlug() (+5 more)

### Community 1 - "flags"
Cohesion: 0.07
Nodes (101): AppCtx, Ctx, DashLang, strings(), useApp(), CrossLinks(), dm(), LandCostNote() (+93 more)

### Community 2 - "MapsCompare"
Cohesion: 0.20
Nodes (18): fitFront(), lineChanges(), byDate(), dmy(), dsKey(), dsKinds(), dsOnce(), dsUpd() (+10 more)

### Community 3 - "articleMeta"
Cohesion: 0.11
Nodes (18): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+10 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+29 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.07
Nodes (20): MapsCompare, StrikesMap, TargetsMap, makeGeo(), ALL_G, ALL_V, BASEMAPS, DsE (+12 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.05
Nodes (36): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada (+28 more)

### Community 8 - "PresentationPage.tsx"
Cohesion: 0.21
Nodes (10): Sources(), EmbedFrame(), P, PhaseExplorer(), Compare(), P, Places(), SubLang (+2 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Html.tsx"
Cohesion: 0.13
Nodes (13): metadata, metadata, metadata, metadata, app_globals, metadata, FONTS, Html() (+5 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.17
Nodes (11): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+3 more)

### Community 14 - "TargetsSeo.tsx"
Cohesion: 0.22
Nodes (11): Target, TargetsSeo(), houseStyle(), reaching(), Weapon, WeaponGroup, WeaponImg, WEAPONS (+3 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.17
Nodes (11): ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo)., Gaps (priority) (+3 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.13
Nodes (21): byPlace(), GCOL, Grp, grpOf(), GRPS, ICO, KIND, STK_CITIES (+13 more)

### Community 17 - "DigestPage.tsx"
Cohesion: 0.27
Nodes (9): issueLd(), HashRedirect(), Ld(), Mast(), SITE_NAME, clip(), dateTitle(), noFlag() (+1 more)

### Community 18 - "pageMeta"
Cohesion: 0.09
Nodes (18): generateMetadata(), dynamicParams, generateMetadata(), generateStaticParams, generateMetadata(), dynamicParams, generateMetadata(), generateStaticParams (+10 more)

### Community 19 - "ArticlesPage.tsx"
Cohesion: 0.17
Nodes (11): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), hrefs, LdList(), Shell() (+3 more)

### Community 20 - "DashText.tsx"
Cohesion: 0.36
Nodes (13): dashLd(), DashSummary(), dmy(), monthL(), num1(), PanelFoot(), PanelIntro(), pick() (+5 more)

### Community 21 - "Mast.tsx"
Cohesion: 0.18
Nodes (13): ImgZoom(), AN, ArtCard(), NEW_PAGES, NewPage, NewPages(), NW_ART, getArticle (+5 more)

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
Cohesion: 0.16
Nodes (13): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+5 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "ArticleList.tsx"
Cohesion: 0.32
Nodes (7): ALL, ArticleList(), code(), F, norm(), ref_next_image, ArticleItem

### Community 29 - "ui.ts"
Cohesion: 0.13
Nodes (17): metadata, metadata, metadata, metadata, LangLink(), LangPicker(), NotFound(), P (+9 more)

### Community 31 - "page.ts"
Cohesion: 0.12
Nodes (14): dynamicParams, generateStaticParams, dynamicParams, generateStaticParams, dynamicParams, generateStaticParams, dynamicParams, generateMetadata() (+6 more)

### Community 32 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 33 - "mapParts.tsx"
Cohesion: 0.15
Nodes (24): areaTiles(), Cities(), countV(), dirOf(), DIRS, Ev, Geo, lastDay() (+16 more)

### Community 34 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.17
Nodes (11): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+3 more)

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
Cohesion: 0.24
Nodes (8): ChkToggle(), anMonth(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy(), secTitle()

### Community 39 - "routes.ts"
Cohesion: 0.33
Nodes (6): articleHref(), MAP_SECS, SITE, SITE_DESC, View, next

### Community 40 - "DashPage.tsx"
Cohesion: 0.16
Nodes (12): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), hl() (+4 more)

### Community 41 - "potential.ts"
Cohesion: 0.05
Nodes (55): DashIssue, Decision vs spec, Global Constraints, Review Focus, Strike Potential Implementation Plan, Task 0: Branch and clean-up of the spike, Task 1: The model — `lib/potential.ts`, Task 2: The data — `public/potential.json` + validate (+47 more)

### Community 42 - "ArticlePage.tsx"
Cohesion: 0.23
Nodes (14): Bars(), Block(), Donut(), heading(), IN_ART, LdJson(), num(), rich() (+6 more)

### Community 43 - "lineDiff"
Cohesion: 0.40
Nodes (5): lineDiff(), inRings(), LL, Rings, toArea()

### Community 44 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 45 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 46 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.12
Nodes (10): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+2 more)

### Community 47 - "Item.tsx"
Cohesion: 0.20
Nodes (11): Dist(), Item(), Local(), RC, SrcChip(), liIco(), personIcons(), DISTC (+3 more)

### Community 48 - "maps/[file]/route.tsx"
Cohesion: 0.20
Nodes (11): dynamic, dynamicParams, generateStaticParams(), GET(), mp(), Rings, MapsData, StrikesThumb() (+3 more)

### Community 49 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 50 - "digest.ts"
Cohesion: 0.16
Nodes (12): CHAMBERS, L, pct(), Scenarios(), ArticlePreview, ScenariosBlock, Section, Side (+4 more)

### Community 51 - "data.ts"
Cohesion: 0.12
Nodes (30): dynamic, dynamicParams, generateStaticParams(), GET(), ICO, icon(), sp(), ArticlesPage() (+22 more)

### Community 52 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.25
Nodes (7): Category status, Critical / High, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 53 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dashParams()

### Community 54 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 55 - "de/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 56 - "(uk)/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 57 - "resolve"
Cohesion: 0.40
Nodes (5): resolve(), Top 5 Highest-Impact Changes, Low, Synthesis, Top 5 critical / high issues

## Knowledge Gaps
- **346 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+341 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 448 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `Architecture`, `articleMeta`, `Findings: On-Page SEO`, `scripts/i18n.mjs`, `DigestPage.tsx`, `ArticlesPage.tsx`, `DashText.tsx`, `Action Plan — warorientyr.com`, `page.ts`, `SEO Audit — warorientyr.com (entry: /en)`, `DashPage.tsx`, `SXO: warorientyr.com/en (English edition)`, `de/strikes/[[...date]]/page.tsx`, `Sitemap audit: https://warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `de/dashboard/[[...date]]/page.tsx`, `de/[[...date]]/page.tsx`, `(uk)/[[...date]]/page.tsx`, `resolve`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `resolve()` connect `resolve` to `Architecture`, `Findings: On-Page SEO`, `DashPage.tsx`, `DigestPage.tsx`, `pageMeta`, `data.ts`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`, `page.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `href()` connect `Architecture` to `flags`, `MapsCompare`, `articleMeta`, `Maps.tsx`, `PresentationPage.tsx`, `StrikesCard.tsx`, `DigestPage.tsx`, `pageMeta`, `ArticlesPage.tsx`, `DashText.tsx`, `Mast.tsx`, `ui.ts`, `page.ts`, `mapParts.tsx`, `Digest.tsx`, `routes.ts`, `DashPage.tsx`, `ArticlePage.tsx`, `data.ts`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Every issue: search titles and post links (all desks)`) actually correct?**
  _`pageMeta()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 62 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _346 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.06837606837606838 - nodes in this community are weakly interconnected._