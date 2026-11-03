# Graph Report - war-orientyr  (2026-11-03)

## Corpus Check
- 112 files · ~568,012 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 810 nodes · 1986 edges · 49 communities (47 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa3ec2b8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- flags
- UI
- DashPage.tsx
- Findings: On-Page SEO
- package.json
- ui.ts
- scripts/i18n.mjs
- stats.ts
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
- ArticlesPage.tsx
- Sitemap audit: https://warorientyr.com
- Action Plan — warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Digest.tsx
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- icons.ts
- Technical SEO findings: warorientyr.com (focus /en)
- next.config.mjs
- DashPage
- DigestPage.tsx
- de/strikes/[[...date]]/page.tsx
- en/strikes/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- ArticleList.tsx
- ArticlePage.tsx
- Findings: Content Quality
- resolve
- (uk)/dashboard/[[...date]]/page.tsx
- page.ts
- articleMeta
- Item.tsx
- Content Quality & On-Page SEO: warorientyr.com
- (uk)/strikes/[[...date]]/page.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `flags` - 55 edges
2. `pageMeta()` - 42 edges
3. `href()` - 34 edges
4. `fmt()` - 33 edges
5. `useApp()` - 32 edges
6. `MapsCompare()` - 30 edges
7. `StrikesMap()` - 26 edges
8. `Lang` - 26 edges
9. `Architecture` - 26 edges
10. `react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `1. Chief desk — read everything, pick the angle` --references--> `Records()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → components/Mast.tsx
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `Phase 1 — Critical (week 1)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `Facts from the code that shape the sitemap` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts
- `Phase 2 — High impact (weeks 2–3)` --references--> `pageMeta()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (49 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.12
Nodes (18): COUNTRIES, CRX, DCOL, DE_COUNTRIES, DE_CRX, DE_RU, DIP_RX, elapsed() (+10 more)

### Community 1 - "flags"
Cohesion: 0.08
Nodes (73): Architecture, useApp(), Dashboard(), MapsView(), StrikesView(), fetchJson(), JSON_CACHE, STICKY (+65 more)

### Community 2 - "UI"
Cohesion: 0.10
Nodes (16): metadata, metadata, metadata, metadata, metadata, app_globals, metadata, metadata (+8 more)

### Community 3 - "DashPage.tsx"
Cohesion: 0.07
Nodes (39): AppCtx, Ctx, DashIssue, DashLang, strings(), DashProvider(), ImgZoom(), ArtCard() (+31 more)

### Community 4 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+27 more)

### Community 6 - "ui.ts"
Cohesion: 0.29
Nodes (9): IssueSelect(), LangLink(), LangPicker(), P, BASE, DE, DE_MISSING, Lang (+1 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.06
Nodes (31): Commands, Conventions, Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report (+23 more)

### Community 8 - "stats.ts"
Cohesion: 0.22
Nodes (15): dayRecords, LossRecord, REC_KEYS, StrikeRecord, stkDist(), Strikes, compare(), line() (+7 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "data.ts"
Cohesion: 0.23
Nodes (19): sitemap(), articleParams, ART_DIR, Cnt, domOf(), getArticle, getArticleDirs, getDates (+11 more)

### Community 13 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.17
Nodes (11): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+3 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.17
Nodes (11): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+3 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "Maps.tsx"
Cohesion: 0.05
Nodes (66): MapsCompare, StrikesMap, areaTiles(), Cities(), countV(), dirOf(), DIRS, Ev (+58 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "pageMeta"
Cohesion: 0.22
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, pageMeta()

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "ArticlesPage.tsx"
Cohesion: 0.20
Nodes (11): metadata, metadata, metadata, articlesMeta(), ArticlesPage(), hrefs, Shell(), getArticleList (+3 more)

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

### Community 25 - "Digest.tsx"
Cohesion: 0.25
Nodes (7): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy(), secTitle()

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "icons.ts"
Cohesion: 0.15
Nodes (14): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+6 more)

### Community 29 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.25
Nodes (7): Category status, Critical / High, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 31 - "DashPage"
Cohesion: 0.17
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DashPage(), getMapsUrl

### Community 32 - "DigestPage.tsx"
Cohesion: 0.15
Nodes (13): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+5 more)

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

### Community 38 - "ArticleList.tsx"
Cohesion: 0.38
Nodes (6): ALL, ArticleList(), code(), F, norm(), ArticleItem

### Community 39 - "ArticlePage.tsx"
Cohesion: 0.15
Nodes (22): Bars(), Block(), Donut(), heading(), IN_ART, LdJson(), num(), rich() (+14 more)

### Community 40 - "Findings: Content Quality"
Cohesion: 0.29
Nodes (7): C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info), Findings: Content Quality

### Community 41 - "resolve"
Cohesion: 0.33
Nodes (6): resolve(), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), Top 5 Highest-Impact Changes, Low, Synthesis, Top 5 critical / high issues

### Community 42 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 43 - "page.ts"
Cohesion: 0.26
Nodes (9): HashRedirect(), href(), pre(), SITE, SITE_DESC, SITE_NAME, View, next (+1 more)

### Community 44 - "articleMeta"
Cohesion: 0.14
Nodes (13): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+5 more)

### Community 47 - "Item.tsx"
Cohesion: 0.19
Nodes (11): Dist(), Item(), Local(), LOCK, RC, SrcChip(), liIco(), personIcons() (+3 more)

### Community 48 - "Content Quality & On-Page SEO: warorientyr.com"
Cohesion: 0.20
Nodes (9): AI citation readiness (52/100), Content Quality & On-Page SEO: warorientyr.com, Duplication across daily issues, E-E-A-T breakdown (this skill's internal weights, not Google's), Readability (EN latest issue), Scores, Structured findings (for audit-data.json, category "Content Quality"), Templated metadata (`metadata_template.py`, 42 pairs) (+1 more)

### Community 55 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 56 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

## Knowledge Gaps
- **290 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `metadata` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 379 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `flags`, `DashPage.tsx`, `Findings: On-Page SEO`, `SEO Audit — warorientyr.com (entry: /en)`, `SXO: warorientyr.com/en (English edition)`, `ArticlesPage.tsx`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`, `Technical SEO findings: warorientyr.com (focus /en)`, `DashPage`, `DigestPage.tsx`, `de/strikes/[[...date]]/page.tsx`, `en/strikes/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `ArticlePage.tsx`, `resolve`, `(uk)/dashboard/[[...date]]/page.tsx`, `page.ts`, `(uk)/strikes/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `resolve()` connect `resolve` to `DigestPage.tsx`, `flags`, `DashPage.tsx`, `page.ts`, `data.ts`, `pageMeta`, `Sitemap audit: https://warorientyr.com`, `Action Plan — warorientyr.com`, `DashPage`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `href()` connect `page.ts` to `flags`, `UI`, `DashPage.tsx`, `ui.ts`, `ArticlePage.tsx`, `data.ts`, `articleMeta`, `Maps.tsx`, `pageMeta`, `ArticlesPage.tsx`, `Technical SEO findings: warorientyr.com (focus /en)`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _290 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.08220415537488708 - nodes in this community are weakly interconnected._