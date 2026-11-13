# Graph Report - war-orientyr  (2026-11-12)

## Corpus Check
- 138 files · ~832,651 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 1033 nodes · 2910 edges · 57 communities (55 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c177865`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Strike potential — design
- Panels.tsx
- MapsCompare
- articleMeta
- Findings: On-Page SEO
- package.json
- Maps.tsx
- scripts/i18n.mjs
- flags
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
- Architecture
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
- de/maps/[[...date]]/page.tsx
- Flag.tsx
- mapParts.tsx
- SEO Audit — warorientyr.com (entry: /en)
- text.ts
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- Digest.tsx
- routes.ts
- DashPage.tsx
- data.ts
- Shell.tsx
- geo.ts
- proxy.ts
- SXO: warorientyr.com/en (English edition)
- en/strikes/[[...date]]/page.tsx
- Item.tsx
- de/strikes/[[...date]]/page.tsx
- Sitemap audit: https://warorientyr.com
- digest.ts
- page.ts
- Technical SEO findings: warorientyr.com (focus /en)
- strikes.ts
- StrikesThumb.tsx
- en/maps/[[...date]]/page.tsx
- utm

## God Nodes (most connected - your core abstractions)
1. `flags` - 73 edges
2. `pageMeta()` - 62 edges
3. `Architecture` - 61 edges
4. `fmt()` - 60 edges
5. `href()` - 54 edges
6. `useApp()` - 53 edges
7. `MapsCompare()` - 35 edges
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
- `Top 5 Highest-Impact Changes` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/geo.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (57 total, 2 thin omitted)

### Community 0 - "Strike potential — design"
Cohesion: 0.12
Nodes (15): DashIssue, Decision vs spec, Anti-goals (would make it a failure even if it works), Comparison with 2025, Data and code, Goals, Intent, Left to the builder (+7 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.07
Nodes (102): AppCtx, Ctx, strings(), useApp(), CrossLinks(), dm(), LandCostNote(), PotentialNote() (+94 more)

### Community 2 - "MapsCompare"
Cohesion: 0.17
Nodes (21): useElWidth(), fitFront(), lineChanges(), lineDiff(), byDate(), dmy(), dsKey(), dsKinds() (+13 more)

### Community 3 - "articleMeta"
Cohesion: 0.12
Nodes (17): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+9 more)

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
Cohesion: 0.06
Nodes (32): Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada, 6. Check and report (+24 more)

### Community 8 - "flags"
Cohesion: 0.10
Nodes (31): Bars(), Block(), Donut(), heading(), IN_ART, LdJson(), num(), rich() (+23 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Html.tsx"
Cohesion: 0.15
Nodes (12): metadata, metadata, metadata, app_globals, metadata, FONTS, Html(), siteMeta() (+4 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "TargetsSeo.tsx"
Cohesion: 0.23
Nodes (10): DashLang, Target, TargetsSeo(), reaching(), Weapon, WeaponGroup, WeaponImg, WEAPONS (+2 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.17
Nodes (11): ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo)., Gaps (priority) (+3 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.15
Nodes (21): Tiles(), byPlace(), GCOL, grpOf(), GRPS, ICO, KIND, STK_CITIES (+13 more)

### Community 17 - "DigestPage.tsx"
Cohesion: 0.23
Nodes (13): DigestPage(), issueLd(), HashRedirect(), Ld(), Mast(), getArticle, getArticleDirs, getPreviews (+5 more)

### Community 18 - "pageMeta"
Cohesion: 0.08
Nodes (20): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+12 more)

### Community 19 - "ArticlesPage.tsx"
Cohesion: 0.23
Nodes (8): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), ArticlesPage(), getArticleList, seoMeta()

### Community 20 - "Architecture"
Cohesion: 0.28
Nodes (19): Architecture, StkSwitch(), dashLd(), DashSummary(), dmy(), monthL(), num1(), PanelFoot() (+11 more)

### Community 21 - "Mast.tsx"
Cohesion: 0.28
Nodes (7): ImgZoom(), AN, NEW_PAGES, NewPage, NewPages(), NW_ART, UIStrings

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

### Community 28 - "ArticleList.tsx"
Cohesion: 0.32
Nodes (7): ALL, ArticleList(), code(), F, norm(), ref_next_image, ArticleItem

### Community 29 - "ui.ts"
Cohesion: 0.13
Nodes (15): metadata, metadata, metadata, metadata, metadata, LangLink(), LangPicker(), NotFound() (+7 more)

### Community 31 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "Flag.tsx"
Cohesion: 0.29
Nodes (7): GET(), f2(), Flag(), H(), R(), star(), V()

### Community 33 - "mapParts.tsx"
Cohesion: 0.11
Nodes (32): dynamic, dynamicParams, generateStaticParams(), areaTiles(), Cities(), countV(), dirOf(), DIRS (+24 more)

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
Cohesion: 0.24
Nodes (8): ChkToggle(), anMonth(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy(), secTitle()

### Community 39 - "routes.ts"
Cohesion: 0.18
Nodes (12): hrefs, LdList(), PANELS, articleHref(), articlesHref(), pre(), SITE, SITE_DESC (+4 more)

### Community 40 - "DashPage.tsx"
Cohesion: 0.10
Nodes (20): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+12 more)

### Community 41 - "data.ts"
Cohesion: 0.06
Nodes (56): dynamic, dynamicParams, generateStaticParams(), GET(), ICO, icon(), sp(), Global Constraints (+48 more)

### Community 42 - "Shell.tsx"
Cohesion: 0.35
Nodes (10): IssueSelect(), PresentationPage(), P, Shell(), View, dayLabel(), loc(), longDate() (+2 more)

### Community 43 - "geo.ts"
Cohesion: 0.50
Nodes (4): inRings(), LL, Rings, toArea()

### Community 44 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 45 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 46 - "en/strikes/[[...date]]/page.tsx"
Cohesion: 0.12
Nodes (10): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+2 more)

### Community 47 - "Item.tsx"
Cohesion: 0.24
Nodes (8): Item(), Local(), RC, SrcChip(), liIco(), personIcons(), Item, Source

### Community 48 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 49 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 50 - "digest.ts"
Cohesion: 0.22
Nodes (8): ArticlePreview, Fire, ScenariosBlock, Section, Side, Status, Tone, Verdict

### Community 51 - "page.ts"
Cohesion: 0.23
Nodes (14): sitemap(), getDates, getIssue, getLatest, getSourceMatrix, DASH_DESC, dirDesc(), dirSlug() (+6 more)

### Community 52 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 53 - "strikes.ts"
Cohesion: 0.29
Nodes (6): LossRecord, REC_KEYS, StrikeRecord, DISTC, Strikes, Digest

### Community 54 - "StrikesThumb.tsx"
Cohesion: 0.29
Nodes (5): Grp, StkMark(), Drawn, ThumbPt, StrikesBase

### Community 55 - "en/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 56 - "utm"
Cohesion: 0.40
Nodes (4): Commands, utm(), ref_node_assert, [url, campaign = new Date().toISOString().slice(0, 10), source = "telegram"]

## Knowledge Gaps
- **346 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+341 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 448 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `mapParts.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `Findings: On-Page SEO`, `scripts/i18n.mjs`, `DashPage.tsx`, `SXO: warorientyr.com/en (English edition)`, `en/strikes/[[...date]]/page.tsx`, `de/strikes/[[...date]]/page.tsx`, `DigestPage.tsx`, `Sitemap audit: https://warorientyr.com`, `page.ts`, `Architecture`, `ArticlesPage.tsx`, `Action Plan — warorientyr.com`, `en/maps/[[...date]]/page.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `de/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `href()` connect `Architecture` to `Panels.tsx`, `mapParts.tsx`, `articleMeta`, `Maps.tsx`, `routes.ts`, `flags`, `DashPage.tsx`, `Digest.tsx`, `Shell.tsx`, `StrikesCard.tsx`, `DigestPage.tsx`, `pageMeta`, `page.ts`, `ArticlesPage.tsx`, `Mast.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`, `ui.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `Architecture` connect `Architecture` to `Strike potential — design`, `Panels.tsx`, `MapsCompare`, `articleMeta`, `mapParts.tsx`, `Maps.tsx`, `routes.ts`, `DashPage.tsx`, `data.ts`, `Shell.tsx`, `geo.ts`, `scripts/i18n.mjs`, `TargetsSeo.tsx`, `en/strikes/[[...date]]/page.tsx`, `StrikesCard.tsx`, `DigestPage.tsx`, `pageMeta`, `page.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Every issue: search titles and post links (all desks)`) actually correct?**
  _`pageMeta()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 60 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 60 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _346 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Strike potential — design` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._