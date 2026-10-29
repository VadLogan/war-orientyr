# Graph Report - war-orientyr  (2026-10-28)

## Corpus Check
- 95 files · ~433,616 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 692 nodes · 1568 edges · 41 communities (39 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26532bdb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- ui.ts
- Maps.tsx
- Findings: Content Quality
- package.json
- ArticlePage.tsx
- scripts/i18n.mjs
- GEO / AI Search Readiness: warorientyr.com (EN)
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Digest.tsx
- icons.ts
- SEO Audit — warorientyr.com (entry: /en)
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- Technical SEO findings: warorientyr.com (focus /en)
- SXO: warorientyr.com/en (English edition)
- Item.tsx
- Flag.tsx
- Findings: On-Page SEO
- Sitemap audit: https://warorientyr.com
- publish.mjs
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- digest.ts
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- DashPage.tsx
- Main editor
- next.config.mjs
- en/dashboard/[[...date]]/page.tsx
- pageMeta
- lib/i18n.mjs
- (uk)/dashboard/[[...date]]/page.tsx
- dateParams
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4
- Action Plan — warorientyr.com
- (uk)/maps/[[...date]]/page.tsx
- WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

## God Nodes (most connected - your core abstractions)
1. `flags` - 42 edges
2. `pageMeta()` - 36 edges
3. `useApp()` - 28 edges
4. `fmt()` - 27 edges
5. `href()` - 23 edges
6. `Lang` - 22 edges
7. `react` - 21 edges
8. `MapsCompare()` - 20 edges
9. `articleMeta()` - 17 edges
10. `resolve()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `3. English desk — for a reader outside Ukraine` --references--> `texts()`  [INFERRED]
  .claude/skills/main-editor/SKILL.md → lib/i18n.mjs
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

## Communities (41 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.12
Nodes (19): Mast(), COUNTRIES, CRX, dateTitle(), dayLabel(), DE_COUNTRIES, DE_CRX, DE_RU (+11 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.09
Nodes (62): AppCtx, Ctx, DashIssue, DashLang, strings(), useApp(), Dashboard(), MapsView() (+54 more)

### Community 2 - "ui.ts"
Cohesion: 0.07
Nodes (32): metadata, metadata, metadata, metadata, metadata, app_globals, metadata, metadata (+24 more)

### Community 3 - "Maps.tsx"
Cohesion: 0.08
Nodes (57): MapsCompare, StrikesMap, useElWidth(), areaTiles(), Cities(), countV(), dirOf(), DIRS (+49 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+26 more)

### Community 6 - "ArticlePage.tsx"
Cohesion: 0.06
Nodes (67): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, sitemap(), dynamicParams (+59 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.15
Nodes (8): ref_node_fs, ref_node_path, MISSING, OUT, PUB, ROOT, tm, TM_FILE

### Community 8 - "GEO / AI Search Readiness: warorientyr.com (EN)"
Cohesion: 0.15
Nodes (12): AI Crawler Access, Authority & Brand Signals (25), Citability (74), GEO / AI Search Readiness: warorientyr.com (EN), GEO Readiness Score: 58 / 100, llms.txt / RSL, Multi-Modal (50), Platform Scores (+4 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Digest.tsx"
Cohesion: 0.21
Nodes (9): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, SrcChip(), TocSpy(), diploTitle() (+1 more)

### Community 13 - "icons.ts"
Cohesion: 0.18
Nodes (12): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+4 more)

### Community 14 - "SEO Audit — warorientyr.com (entry: /en)"
Cohesion: 0.14
Nodes (13): AI Search Readiness — 60, Backlinks — insufficient data, Content Quality — 58 · On-Page — 48, Images — 66, Performance — 70 (lab, mobile), Schema — 8, SEO Audit — warorientyr.com (entry: /en), SEO Health Score: **54 / 100** (+5 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "Technical SEO findings: warorientyr.com (focus /en)"
Cohesion: 0.22
Nodes (8): Category status, Critical / High, Low, Medium, Passing checks, Proxy / Googlebot analysis (proxy.ts), Score rationale (62), Technical SEO findings: warorientyr.com (focus /en)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.18
Nodes (10): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Priority actions, Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition) (+2 more)

### Community 18 - "Item.tsx"
Cohesion: 0.20
Nodes (12): fireLabel(), FireList(), Item(), Local(), LOCK, RC, fireIco(), liIco() (+4 more)

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "Findings: On-Page SEO"
Cohesion: 0.18
Nodes (11): Findings: On-Page SEO, On-page items that pass, OP-1. Titles are date-only templates and omit the story (High), OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), OP-6. Archive is not crawlable; no sitemap or robots.txt (High) (+3 more)

### Community 21 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 22 - "publish.mjs"
Cohesion: 0.14
Nodes (11): args, cur, curRaw, force, kept, miss, PUB, raw (+3 more)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.11
Nodes (13): ART, d, DE_FILE, deep, EN, miss, noId, noMap (+5 more)

### Community 25 - "digest.ts"
Cohesion: 0.16
Nodes (12): P, PhaseExplorer(), ArticleBlock, ArticlePreview, Digest, Item, LossRow, PresentationBody (+4 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 28 - "DashPage.tsx"
Cohesion: 0.16
Nodes (10): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateStaticParams, DashPage(), domOf(), getMapsUrl (+2 more)

### Community 29 - "Main editor"
Cohesion: 0.22
Nodes (8): 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. German desk — for a reader in Germany, Austria, Switzerland, 5. Check and report, Article mode, Main editor, Scope

### Community 31 - "en/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 32 - "pageMeta"
Cohesion: 0.20
Nodes (8): dynamicParams, generateMetadata(), generateStaticParams, generateMetadata(), dynamicParams, generateMetadata(), generateStaticParams, pageMeta()

### Community 33 - "lib/i18n.mjs"
Cohesion: 0.50
Nodes (4): isText(), KEYED, SKIP, texts()

### Community 34 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 35 - "dateParams"
Cohesion: 0.18
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dateParams

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

### Community 38 - "Action Plan — warorientyr.com"
Cohesion: 0.33
Nodes (5): Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing)

### Community 40 - "(uk)/maps/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 41 - "WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)"
Cohesion: 0.33
Nodes (5): Commands, Conventions, Data (`public/`), Tools, WAR·Орієнтир — «Щоденний дайджест війни» (Next.js)

## Knowledge Gaps
- **258 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+253 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 333 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMeta()` connect `pageMeta` to `text.ts`, `(uk)/dashboard/[[...date]]/page.tsx`, `dateParams`, `ArticlePage.tsx`, `Action Plan — warorientyr.com`, `(uk)/maps/[[...date]]/page.tsx`, `SEO Audit — warorientyr.com (entry: /en)`, `Technical SEO findings: warorientyr.com (focus /en)`, `SXO: warorientyr.com/en (English edition)`, `Findings: On-Page SEO`, `Sitemap audit: https://warorientyr.com`, `DashPage.tsx`, `en/dashboard/[[...date]]/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `resolve()` connect `ArticlePage.tsx` to `pageMeta`, `ui.ts`, `Findings: Content Quality`, `Action Plan — warorientyr.com`, `GEO / AI Search Readiness: warorientyr.com (EN)`, `SEO Audit — warorientyr.com (entry: /en)`, `Technical SEO findings: warorientyr.com (focus /en)`, `Sitemap audit: https://warorientyr.com`, `DashPage.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `react` connect `Panels.tsx` to `ui.ts`, `Maps.tsx`, `package.json`, `ArticlePage.tsx`, `Digest.tsx`, `Item.tsx`, `Flag.tsx`, `digest.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _258 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08811551277304702 - nodes in this community are weakly interconnected._