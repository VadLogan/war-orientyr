# Graph Report - war-orientyr  (2026-11-09)

## Corpus Check
- 136 files · ~701,891 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 1004 nodes · 2784 edges · 53 communities (51 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88ae640c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Strike potential — design
- flags
- (uk)/dashboard/[[...date]]/page.tsx
- articleMeta
- Findings: Content Quality
- package.json
- Maps.tsx
- scripts/i18n.mjs
- ArticlePage.tsx
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Html.tsx
- GEO / AI Search Readiness: warorientyr.com (EN)
- Findings: On-Page SEO
- digest.ts
- StrikesCard.tsx
- data.ts
- dateParams
- ArticlesPage.tsx
- Architecture
- Mast.tsx
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- dashboard/[file]/route.tsx
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
- maps/[file]/route.tsx
- page.ts
- de/dashboard/[[...date]]/page.tsx
- potential.ts
- fr/dashboard/[[...date]]/page.tsx
- geo.ts
- proxy.ts
- (uk)/[[...date]]/page.tsx
- DashPage.tsx
- Item.tsx
- de/strikes/[[...date]]/page.tsx
- pageMeta
- (uk)/maps/[[...date]]/page.tsx
- fr/strikes/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 70 edges
2. `pageMeta()` - 59 edges
3. `fmt()` - 57 edges
4. `href()` - 53 edges
5. `Architecture` - 53 edges
6. `useApp()` - 51 edges
7. `MapsCompare()` - 35 edges
8. `dayN()` - 31 edges
9. `react` - 29 edges
10. `Lang` - 27 edges

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

## Communities (53 total, 2 thin omitted)

### Community 0 - "Strike potential — design"
Cohesion: 0.12
Nodes (15): DashIssue, Decision vs spec, Anti-goals (would make it a failure even if it works), Comparison with 2025, Data and code, Goals, Intent, Left to the builder (+7 more)

### Community 1 - "flags"
Cohesion: 0.07
Nodes (105): AppCtx, Ctx, DashLang, strings(), useApp(), CrossLinks(), dm(), LandCostNote() (+97 more)

### Community 2 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 3 - "articleMeta"
Cohesion: 0.12
Nodes (16): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+8 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (36): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+28 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.07
Nodes (38): MapsCompare, StrikesMap, dirOf(), fitFront(), lineChanges(), lineDiff(), makeGeo(), ALL_G (+30 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (32): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. French desk — for a reader in France, Belgium, Switzerland, Canada (+24 more)

### Community 8 - "ArticlePage.tsx"
Cohesion: 0.14
Nodes (27): artHrefs(), Bars(), Block(), Donut(), heading(), IN_ART, LdJson(), num() (+19 more)

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

### Community 14 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 15 - "digest.ts"
Cohesion: 0.06
Nodes (33): P, PhaseExplorer(), CHAMBERS, L, pct(), Scenarios(), Donut, Race (+25 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.14
Nodes (22): byPlace(), GCOL, Grp, grpOf(), GRPS, ICO, KIND, StkIco() (+14 more)

### Community 17 - "data.ts"
Cohesion: 0.22
Nodes (20): DigestPage(), issueLd(), ART_DIR, Cnt, getArticle, getArticleDirs, getArticleList, getPreviews (+12 more)

### Community 18 - "dateParams"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 19 - "ArticlesPage.tsx"
Cohesion: 0.17
Nodes (10): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), hrefs, LdList(), Ld() (+2 more)

### Community 20 - "Architecture"
Cohesion: 0.37
Nodes (14): Architecture, dashLd(), DashSummary(), dmy(), monthL(), num1(), PanelFoot(), PanelIntro() (+6 more)

### Community 21 - "Mast.tsx"
Cohesion: 0.19
Nodes (11): ImgZoom(), AN, ArtCard(), Mast(), NEW_PAGES, NewPage, NewPages(), NW_ART (+3 more)

### Community 22 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.06
Nodes (26): ref_node_fs, args, cur, curRaw, force, kept, miss, PUB (+18 more)

### Community 25 - "dashboard/[file]/route.tsx"
Cohesion: 0.28
Nodes (8): dynamic, dynamicParams, generateStaticParams(), GET(), ICO, icon(), sp(), ref_next_og

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
Nodes (15): metadata, metadata, metadata, metadata, Flag(), LangLink(), LangPicker(), NotFound() (+7 more)

### Community 31 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, mapsParams()

### Community 32 - "Flag.tsx"
Cohesion: 0.39
Nodes (5): f2(), H(), R(), star(), V()

### Community 33 - "mapParts.tsx"
Cohesion: 0.14
Nodes (26): areaTiles(), Cities(), countV(), Ev, Geo, lastDay(), Layers(), LY (+18 more)

### Community 34 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.04
Nodes (40): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+32 more)

### Community 35 - "text.ts"
Cohesion: 0.05
Nodes (47): DIRS, ChkToggle(), AnLine(), anMonth(), countSources(), Digest(), SecIco(), Sources() (+39 more)

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "maps/[file]/route.tsx"
Cohesion: 0.38
Nodes (6): dynamic, dynamicParams, generateStaticParams(), GET(), mp(), getMapsUrl

### Community 39 - "page.ts"
Cohesion: 0.19
Nodes (20): sitemap(), ArticlesPage(), DirLinks(), getDates, getIssue, getLatest, DASH_DESC, dirHref() (+12 more)

### Community 40 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dashParams()

### Community 41 - "potential.ts"
Cohesion: 0.08
Nodes (39): Global Constraints, Review Focus, Strike Potential Implementation Plan, Task 0: Branch and clean-up of the spike, Task 1: The model — `lib/potential.ts`, Task 2: The data — `public/potential.json` + validate, Task 4: Translations, editor stats, docs, addM() (+31 more)

### Community 42 - "fr/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 43 - "geo.ts"
Cohesion: 0.50
Nodes (4): inRings(), LL, Rings, toArea()

### Community 44 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 45 - "(uk)/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 46 - "DashPage.tsx"
Cohesion: 0.20
Nodes (12): dynamicParams, generateMetadata(), generateStaticParams, DashPage(), hl(), mapsLd(), slim(), domOf() (+4 more)

### Community 47 - "Item.tsx"
Cohesion: 0.27
Nodes (8): Dist(), Item(), Local(), LOCK, liIco(), personIcons(), distLabel(), Strikes

### Community 48 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 51 - "pageMeta"
Cohesion: 0.18
Nodes (9): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dirDesc(), pageMeta() (+1 more)

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
- **339 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+334 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 438 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `(uk)/dashboard/[[...date]]/page.tsx`, `ArticlePage.tsx`, `Findings: On-Page SEO`, `data.ts`, `dateParams`, `ArticlesPage.tsx`, `Architecture`, `Mast.tsx`, `Action Plan — warorientyr.com`, `de/maps/[[...date]]/page.tsx`, `mapParts.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `page.ts`, `de/dashboard/[[...date]]/page.tsx`, `fr/dashboard/[[...date]]/page.tsx`, `(uk)/[[...date]]/page.tsx`, `DashPage.tsx`, `de/strikes/[[...date]]/page.tsx`, `(uk)/maps/[[...date]]/page.tsx`, `fr/strikes/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `Architecture` connect `Architecture` to `Strike potential — design`, `flags`, `mapParts.tsx`, `articleMeta`, `text.ts`, `Maps.tsx`, `page.ts`, `ArticlePage.tsx`, `de/dashboard/[[...date]]/page.tsx`, `potential.ts`, `geo.ts`, `scripts/i18n.mjs`, `DashPage.tsx`, `StrikesCard.tsx`, `data.ts`, `pageMeta`, `de/maps/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `href()` connect `ArticlePage.tsx` to `flags`, `mapParts.tsx`, `articleMeta`, `text.ts`, `SEO Audit — warorientyr.com (entry: /en)`, `Maps.tsx`, `page.ts`, `DashPage.tsx`, `StrikesCard.tsx`, `data.ts`, `ArticlesPage.tsx`, `Architecture`, `Mast.tsx`, `pageMeta`, `ui.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 52 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 52 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _339 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Strike potential — design` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._