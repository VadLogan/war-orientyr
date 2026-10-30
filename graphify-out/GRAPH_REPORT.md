# Graph Report - war-orientyr  (2026-10-30)

## Corpus Check
- 102 files · ~481,496 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 740 nodes · 1757 edges · 43 communities (41 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8dfb82c0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- flags
- UI
- publish.mjs
- Findings: Content Quality
- package.json
- ArticlePage.tsx
- scripts/i18n.mjs
- proxy.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- digest.ts
- icons.ts
- resolve
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- Maps.tsx
- SXO: warorientyr.com/en (English edition)
- DashPage.tsx
- Flag.tsx
- Findings: On-Page SEO
- Sitemap audit: https://warorientyr.com
- Digest.tsx
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Main editor
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- translate
- de/maps/[[...date]]/page.tsx
- next.config.mjs
- dateParams
- pageMeta
- de/strikes/[[...date]]/page.tsx
- (uk)/dashboard/[[...date]]/page.tsx
- en/dashboard/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- en/maps/[[...date]]/page.tsx
- en/strikes/[[...date]]/page.tsx
- (uk)/maps/[[...date]]/page.tsx
- (uk)/strikes/[[...date]]/page.tsx
- WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

## God Nodes (most connected - your core abstractions)
1. `flags` - 46 edges
2. `pageMeta()` - 42 edges
3. `useApp()` - 32 edges
4. `fmt()` - 31 edges
5. `href()` - 27 edges
6. `StrikesMap()` - 24 edges
7. `Lang` - 22 edges
8. `react` - 22 edges
9. `MapsCompare()` - 21 edges
10. `dayN()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `Tiles256()`  [INFERRED]
  CLAUDE.md → components/dash/Maps.tsx
- `3. English desk — for a reader outside Ukraine` --references--> `texts()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → lib/i18n.mjs
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Facts from the code that shape the sitemap` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts
- `Phase 2 — High impact (weeks 2–3)` --references--> `pageMeta()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (43 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.11
Nodes (23): ImgZoom(), ArtCard(), Mast(), COUNTRIES, CRX, dateTitle(), dayLabel(), DE_COUNTRIES (+15 more)

### Community 1 - "flags"
Cohesion: 0.08
Nodes (69): Architecture, AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard() (+61 more)

### Community 2 - "UI"
Cohesion: 0.10
Nodes (16): metadata, metadata, metadata, metadata, metadata, app_globals, metadata, metadata (+8 more)

### Community 3 - "publish.mjs"
Cohesion: 0.14
Nodes (11): args, cur, curRaw, force, kept, miss, PUB, raw (+3 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+27 more)

### Community 6 - "ArticlePage.tsx"
Cohesion: 0.06
Nodes (78): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, sitemap(), dynamicParams (+70 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.15
Nodes (12): ref_node_fs, ref_node_path, dataFiles(), files, filesOf(), isIssue(), MISSING, OUT (+4 more)

### Community 8 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "digest.ts"
Cohesion: 0.12
Nodes (18): Dist(), Item(), Local(), LOCK, RC, SrcChip(), liIco(), personIcons() (+10 more)

### Community 13 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 14 - "resolve"
Cohesion: 0.05
Nodes (39): resolve(), Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing), AI Crawler Access, Authority & Brand Signals (25) (+31 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "Maps.tsx"
Cohesion: 0.06
Nodes (74): MapsCompare, StrikesMap, useElWidth(), areaTiles(), Cities(), countV(), dirOf(), DIRS (+66 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "DashPage.tsx"
Cohesion: 0.24
Nodes (6): dynamicParams, generateMetadata(), generateStaticParams, DashPage(), getMapsUrl, SHOW_SOURCE_MATRIX

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 21 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 22 - "Digest.tsx"
Cohesion: 0.23
Nodes (8): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy(), diploTitle(), secTitle()

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.11
Nodes (13): ART, d, DE_FILE, deep, EN, miss, noId, noMap (+5 more)

### Community 25 - "Main editor"
Cohesion: 0.20
Nodes (9): 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report, Article mode, Main editor, Scope (+1 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "translate"
Cohesion: 0.48
Nodes (6): Data (`public/`), isText(), KEYED, SKIP, texts(), translate()

### Community 29 - "de/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 31 - "dateParams"
Cohesion: 0.33
Nodes (4): dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 32 - "pageMeta"
Cohesion: 0.21
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, DigestPage(), pageMeta()

### Community 33 - "de/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 34 - "(uk)/dashboard/[[...date]]/page.tsx"
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

### Community 39 - "en/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 40 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 41 - "(uk)/strikes/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 42 - "WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)"
Cohesion: 0.40
Nodes (4): Commands, Conventions, Tools, WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

## Knowledge Gaps
- **270 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 350 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `text.ts`, `de/strikes/[[...date]]/page.tsx`, `(uk)/dashboard/[[...date]]/page.tsx`, `en/dashboard/[[...date]]/page.tsx`, `flags`, `en/maps/[[...date]]/page.tsx`, `en/strikes/[[...date]]/page.tsx`, `(uk)/maps/[[...date]]/page.tsx`, `(uk)/strikes/[[...date]]/page.tsx`, `ArticlePage.tsx`, `resolve`, `SXO: warorientyr.com/en (English edition)`, `DashPage.tsx`, `Findings: On-Page SEO`, `Sitemap audit: https://warorientyr.com`, `de/maps/[[...date]]/page.tsx`, `dateParams`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `resolve()` connect `resolve` to `pageMeta`, `flags`, `Findings: Content Quality`, `ArticlePage.tsx`, `DashPage.tsx`, `Sitemap audit: https://warorientyr.com`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `react` connect `flags` to `package.json`, `ArticlePage.tsx`, `digest.ts`, `Maps.tsx`, `Flag.tsx`, `Digest.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11076923076923077 - nodes in this community are weakly interconnected._
- **Should `flags` be split into smaller, more focused modules?**
  _Cohesion score 0.08179012345679013 - nodes in this community are weakly interconnected._