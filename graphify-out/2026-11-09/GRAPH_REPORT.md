# Graph Report - war-orientyr  (2026-11-09)

## Corpus Check
- 117 files · ~669,430 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 847 nodes · 2193 edges · 53 communities (51 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bc8bbe2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- ui.ts
- digest.ts
- Findings: On-Page SEO
- package.json
- Maps.tsx
- scripts/i18n.mjs
- mapParts.tsx
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- geo.ts
- GEO / AI Search Readiness: warorientyr.com (EN)
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- StrikesCard.tsx
- DashPage.tsx
- de/dashboard/[[...date]]/page.tsx
- Flag.tsx
- data.ts
- ArticlesPage.tsx
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
- page.ts
- href
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- en/maps/[[...date]]/page.tsx
- ArticlePage.tsx
- Sitemap audit: https://warorientyr.com
- stats.ts
- ArticleList.tsx
- Mast.tsx
- Shell.tsx
- flags
- de/maps/[[...date]]/page.tsx
- Item.tsx
- de/strikes/[[...date]]/page.tsx
- StateMap.tsx
- dateParams
- (uk)/dashboard/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `flags` - 57 edges
2. `pageMeta()` - 47 edges
3. `href()` - 41 edges
4. `Architecture` - 37 edges
5. `MapsCompare()` - 35 edges
6. `fmt()` - 35 edges
7. `useApp()` - 32 edges
8. `StrikesMap()` - 26 edges
9. `Lang` - 26 edges
10. `react` - 26 edges

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

### Community 0 - "text.ts"
Cohesion: 0.11
Nodes (20): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, diploTitle() (+12 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.08
Nodes (63): AppCtx, Ctx, strings(), useApp(), Dashboard(), MapsView(), StrikesView(), DashProvider() (+55 more)

### Community 2 - "ui.ts"
Cohesion: 0.08
Nodes (25): metadata, metadata, metadata, metadata, metadata, app_globals, metadata, metadata (+17 more)

### Community 3 - "digest.ts"
Cohesion: 0.18
Nodes (11): CHAMBERS, L, pct(), Scenarios(), ArticlePreview, LossRow, ScenariosBlock, Side (+3 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.07
Nodes (28): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+20 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+26 more)

### Community 6 - "Maps.tsx"
Cohesion: 0.07
Nodes (34): MapsCompare, StrikesMap, fitFront(), lineChanges(), lineDiff(), ALL_G, ALL_V, BASEMAPS (+26 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "mapParts.tsx"
Cohesion: 0.13
Nodes (32): dynamic, dynamicParams, GET(), areaTiles(), Cities(), countV(), dirOf(), DIRS (+24 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "geo.ts"
Cohesion: 0.50
Nodes (4): inRings(), LL, Rings, toArea()

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.08
Nodes (23): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+15 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "StrikesCard.tsx"
Cohesion: 0.11
Nodes (27): DashLang, Tiles(), byPlace(), GCOL, Grp, grpOf(), GRPS, ICO (+19 more)

### Community 17 - "DashPage.tsx"
Cohesion: 0.27
Nodes (12): Architecture, DashIssue, DashPage(), mapsLd(), DirLinks(), getMapsUrl, dirHref(), dirSlug() (+4 more)

### Community 18 - "de/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 19 - "Flag.tsx"
Cohesion: 0.39
Nodes (5): f2(), H(), R(), star(), V()

### Community 20 - "data.ts"
Cohesion: 0.19
Nodes (22): generateStaticParams(), sitemap(), articleParams, ArticlesPage(), ART_DIR, Cnt, domOf(), getArticle (+14 more)

### Community 21 - "ArticlesPage.tsx"
Cohesion: 0.22
Nodes (9): generateMetadata(), generateMetadata(), generateMetadata(), articlesMeta(), hrefs, LdList(), Shell(), seoMeta() (+1 more)

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
Cohesion: 0.21
Nodes (8): ChkToggle(), countSources(), Sources(), SRC_ORD, SrcChip(), TocSpy(), Flag(), Section

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

### Community 32 - "page.ts"
Cohesion: 0.17
Nodes (11): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DASH_DESC, Dir (+3 more)

### Community 33 - "href"
Cohesion: 0.18
Nodes (17): Digest(), DigestPage(), issueLd(), HashRedirect(), NewPages(), getPreviews, getRecords, getStrikes (+9 more)

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
Cohesion: 0.12
Nodes (20): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+12 more)

### Community 40 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 41 - "stats.ts"
Cohesion: 0.22
Nodes (15): dayRecords, LossRecord, REC_KEYS, StrikeRecord, stkDist(), Strikes, compare(), line() (+7 more)

### Community 42 - "ArticleList.tsx"
Cohesion: 0.32
Nodes (7): ALL, ArticleList(), code(), F, norm(), ref_next_image, ArticleItem

### Community 43 - "Mast.tsx"
Cohesion: 0.24
Nodes (9): ImgZoom(), ArtCard(), Mast(), NEW_PAGES, NW_ART, Records(), dateTitle(), midDate() (+1 more)

### Community 44 - "Shell.tsx"
Cohesion: 0.25
Nodes (12): Donut(), IssueSelect(), LangPicker(), PresentationPage(), P, View, dayLabel(), loc() (+4 more)

### Community 45 - "flags"
Cohesion: 0.20
Nodes (13): Block(), rich(), Sources(), Sw(), EmbedFrame(), flags, P, PhaseExplorer() (+5 more)

### Community 46 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 47 - "Item.tsx"
Cohesion: 0.21
Nodes (10): Dist(), Item(), Local(), LOCK, RC, liIco(), personIcons(), distLabel() (+2 more)

### Community 48 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 49 - "StateMap.tsx"
Cohesion: 0.33
Nodes (6): Donut, Race, S, StateMap(), tone(), ArticleBlock

### Community 50 - "dateParams"
Cohesion: 0.33
Nodes (4): dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 51 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

## Knowledge Gaps
- **293 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+288 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 384 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `page.ts` to `Findings: On-Page SEO`, `mapParts.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `DashPage.tsx`, `de/dashboard/[[...date]]/page.tsx`, `ArticlesPage.tsx`, `Action Plan — warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `(uk)/maps/[[...date]]/page.tsx`, `href`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `en/maps/[[...date]]/page.tsx`, `Sitemap audit: https://warorientyr.com`, `Mast.tsx`, `de/maps/[[...date]]/page.tsx`, `de/strikes/[[...date]]/page.tsx`, `dateParams`, `(uk)/dashboard/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `resolve()` connect `DashPage.tsx` to `page.ts`, `href`, `Findings: On-Page SEO`, `Sitemap audit: https://warorientyr.com`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `data.ts`, `Action Plan — warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `href()` connect `href` to `page.ts`, `Panels.tsx`, `ui.ts`, `Maps.tsx`, `ArticlePage.tsx`, `mapParts.tsx`, `Mast.tsx`, `Shell.tsx`, `flags`, `StrikesCard.tsx`, `DashPage.tsx`, `data.ts`, `ArticlesPage.tsx`, `Digest.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 36 inferred relationships involving `Architecture` (e.g. with `ArticlePage()` and `DashIssue`) actually correct?**
  _`Architecture` has 36 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._