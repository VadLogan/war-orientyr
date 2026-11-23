# Graph Report - war-orientyr  (2026-11-23)

## Corpus Check
- 152 files · ~1,074,541 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 1100 nodes · 3118 edges · 56 communities (54 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 137 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35300567`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- page.ts
- flags
- de/strikes/[[...date]]/page.tsx
- ui.ts
- Findings: On-Page SEO
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
- data.ts
- pageMeta
- ArticlesPage.tsx
- Architecture
- stats.ts
- dashboard/[file]/route.tsx
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- icons.ts
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- digest.ts
- UI
- next.config.mjs
- StrikesView.tsx
- Flag.tsx
- MapsCard.tsx
- SEO Audit — warorientyr.com (entry: /en)
- text.ts
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- Digest.tsx
- Strike potential — design
- href
- potential.ts
- ArticlePage.tsx
- mapParts.tsx
- proxy.ts
- SXO: warorientyr.com/en (English edition)
- Mast.tsx
- Item.tsx
- ArticleList.tsx
- Sitemap audit: https://warorientyr.com
- StateMap.tsx
- DigestPage.tsx
- Technical SEO findings: warorientyr.com (focus /en)
- DashPage.tsx
- DashIssue
- en.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 73 edges
2. `Architecture` - 72 edges
3. `pageMeta()` - 65 edges
4. `fmt()` - 60 edges
5. `useApp()` - 55 edges
6. `href()` - 55 edges
7. `MapsCompare()` - 40 edges
8. `react` - 37 edges
9. `dayN()` - 31 edges
10. `Lang` - 30 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Architecture` --references--> `darkTheme()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `Conventions` --references--> `useT()`  [INFERRED]
  CLAUDE.md → components/strings/ctx.ts
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (56 total, 2 thin omitted)

### Community 0 - "page.ts"
Cohesion: 0.17
Nodes (14): DIRS, DirLinks(), DASH_DESC, dirHref(), dirSlug(), PANELS, VIEW_TITLE, MAP_SECS (+6 more)

### Community 1 - "flags"
Cohesion: 0.07
Nodes (105): useApp(), CrossLinks(), dm(), LandCostNote(), PotentialNote(), fetchJson(), JSON_CACHE, STICKY (+97 more)

### Community 2 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.10
Nodes (14): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+6 more)

### Community 3 - "ui.ts"
Cohesion: 0.23
Nodes (13): TCtx, T, T, T, DE, DE_UI, EN, FR (+5 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (38): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+30 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.06
Nodes (23): makeGeo(), ALL_G, ALL_V, BASEMAPS, darkTheme(), DsE, dsKey(), dsKinds() (+15 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.05
Nodes (36): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada (+28 more)

### Community 8 - "/maps on phones — design v2 and implementation brief"
Cohesion: 0.10
Nodes (20): 10. States and edge cases, 11. Visual rules, 12. Accessibility, 13. Measuring the result, 14. Acceptance checks on real devices, 15. Implementation status (2026-11-13), 1. The problem this solves, 2. Principles (+12 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Html.tsx"
Cohesion: 0.11
Nodes (17): metadata, metadata, metadata, app_globals, metadata, Html(), mono, serif (+9 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "TargetsSeo.tsx"
Cohesion: 0.26
Nodes (9): Target, TargetsSeo(), reaching(), Weapon, WeaponGroup, WeaponImg, WEAPONS, WPN_GROUPS (+1 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.17
Nodes (11): ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo)., Gaps (priority) (+3 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.11
Nodes (28): byPlace(), GCOL, Grp, grpOf(), GRPS, ICO, KIND, placeKey() (+20 more)

### Community 17 - "data.ts"
Cohesion: 0.18
Nodes (24): sitemap(), ArticlePage(), load(), DigestPage(), ART_DIR, Cnt, domOf(), getArticle (+16 more)

### Community 18 - "pageMeta"
Cohesion: 0.09
Nodes (19): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+11 more)

### Community 19 - "ArticlesPage.tsx"
Cohesion: 0.21
Nodes (9): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), ArticlesPage(), hrefs, getArticleList (+1 more)

### Community 20 - "Architecture"
Cohesion: 0.37
Nodes (14): Architecture, dashLd(), DashSummary(), dmy(), monthL(), num1(), PanelFoot(), PanelIntro() (+6 more)

### Community 21 - "stats.ts"
Cohesion: 0.22
Nodes (15): dayRecords, LossRecord, REC_KEYS, StrikeRecord, stkDist(), compare(), line(), main() (+7 more)

### Community 22 - "dashboard/[file]/route.tsx"
Cohesion: 0.24
Nodes (10): dynamic, dynamicParams, generateStaticParams(), GET(), ICO, icon(), sp(), getAnalytics (+2 more)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (27): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+19 more)

### Community 25 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "digest.ts"
Cohesion: 0.14
Nodes (15): P, PhaseExplorer(), CHAMBERS, L, pct(), Scenarios(), ArticlePreview, Fire (+7 more)

### Community 29 - "UI"
Cohesion: 0.16
Nodes (8): metadata, metadata, metadata, metadata, LangLink(), LangPicker(), NotFound(), UI

### Community 31 - "StrikesView.tsx"
Cohesion: 0.09
Nodes (19): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+11 more)

### Community 32 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 33 - "MapsCard.tsx"
Cohesion: 0.15
Nodes (21): areaTiles(), Cities(), countV(), dirOf(), Geo, lastDay(), Layers(), Mark() (+13 more)

### Community 34 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 35 - "text.ts"
Cohesion: 0.10
Nodes (21): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, elapsed() (+13 more)

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "Digest.tsx"
Cohesion: 0.18
Nodes (11): ChkToggle(), AnLine(), anMonth(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy() (+3 more)

### Community 39 - "Strike potential — design"
Cohesion: 0.15
Nodes (12): Anti-goals (would make it a failure even if it works), Comparison with 2025, Goals, Intent, Left to the builder, Non-goals, Risks, Scenarios (+4 more)

### Community 40 - "href"
Cohesion: 0.14
Nodes (26): Sources(), StkSwitch(), EmbedFrame(), HashRedirect(), IssueSelect(), NewPages(), Compare(), P (+18 more)

### Community 41 - "potential.ts"
Cohesion: 0.18
Nodes (17): Task 1: The model — `lib/potential.ts`, addM(), dayGroups(), daysIn(), Estimate, GroupId, GroupResult, HandMonth (+9 more)

### Community 42 - "ArticlePage.tsx"
Cohesion: 0.09
Nodes (25): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+17 more)

### Community 43 - "mapParts.tsx"
Cohesion: 0.10
Nodes (25): dynamic, dynamicParams, generateStaticParams(), GET(), Ev, fitFront(), GeoStream, lineChanges() (+17 more)

### Community 44 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 45 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 46 - "Mast.tsx"
Cohesion: 0.25
Nodes (7): ImgZoom(), AN, ArtCard(), NEW_PAGES, NewPage, NW_ART, Article

### Community 47 - "Item.tsx"
Cohesion: 0.24
Nodes (8): Item(), Local(), RC, SrcChip(), liIco(), personIcons(), Item, Source

### Community 48 - "ArticleList.tsx"
Cohesion: 0.15
Nodes (14): ALL, ArticleList(), code(), F, norm(), AppCtx, Ctx, DashLang (+6 more)

### Community 49 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 50 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 51 - "DigestPage.tsx"
Cohesion: 0.29
Nodes (9): LdList(), issueLd(), Ld(), Mast(), SITE_DESC, SITE_NAME, clip(), dateTitle() (+1 more)

### Community 52 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.12
Nodes (13): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing), Category status, Critical / High, Low (+5 more)

### Community 53 - "DashPage.tsx"
Cohesion: 0.10
Nodes (21): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+13 more)

### Community 54 - "DashIssue"
Cohesion: 0.18
Nodes (10): DashIssue, Decision vs spec, Global Constraints, Review Focus, Strike Potential Implementation Plan, Task 0: Branch and clean-up of the spike, Task 2: The data — `public/potential.json` + validate, Task 4: Translations, editor stats, docs (+2 more)

### Community 55 - "en.tsx"
Cohesion: 0.40
Nodes (3): metadata, Strings(), T

## Knowledge Gaps
- **373 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+368 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 477 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `page.ts`, `MapsCard.tsx`, `de/strikes/[[...date]]/page.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `Findings: On-Page SEO`, `scripts/i18n.mjs`, `href`, `SXO: warorientyr.com/en (English edition)`, `data.ts`, `Sitemap audit: https://warorientyr.com`, `ArticlesPage.tsx`, `Architecture`, `DashPage.tsx`, `DigestPage.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `StrikesView.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `react` connect `ui.ts` to `Flag.tsx`, `flags`, `package.json`, `Maps.tsx`, `Digest.tsx`, `href`, `mapParts.tsx`, `Item.tsx`, `ArticleList.tsx`, `StrikesCard.tsx`, `StateMap.tsx`, `data.ts`, `en.tsx`, `digest.ts`, `UI`, `StrikesView.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `Architecture` connect `Architecture` to `page.ts`, `flags`, `de/strikes/[[...date]]/page.tsx`, `Maps.tsx`, `scripts/i18n.mjs`, `TargetsSeo.tsx`, `StrikesCard.tsx`, `data.ts`, `pageMeta`, `stats.ts`, `StrikesView.tsx`, `MapsCard.tsx`, `Digest.tsx`, `href`, `potential.ts`, `mapParts.tsx`, `ArticleList.tsx`, `DigestPage.tsx`, `DashPage.tsx`, `DashIssue`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 71 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 71 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Every issue: search titles and post links (all desks)`) actually correct?**
  _`pageMeta()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _373 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.07007548782224754 - nodes in this community are weakly interconnected._