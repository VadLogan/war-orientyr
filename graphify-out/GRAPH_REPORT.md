# Graph Report - war-orientyr  (2026-10-21)

## Corpus Check
- 85 files · ~344,837 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 610 nodes · 1324 edges · 33 communities (31 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70569946`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- Html.tsx
- Maps.tsx
- Findings: Content Quality
- package.json
- ArticlePage.tsx
- scripts/i18n.mjs
- proxy.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- Digest.tsx
- icons.ts
- resolve
- Schema.org audit: warorientyr.com (checked 2026-10-17)
- data.ts
- SXO: warorientyr.com/en (English edition)
- Item.tsx
- Flag.tsx
- Findings: On-Page SEO
- Sitemap audit: https://warorientyr.com
- Agent readiness: https://warorientyr.com/en (checked 2026-10-17)
- validate.mjs
- Performance findings (lab only, no CrUX) - 2026-10-17
- war-digest-next — «Щоденний дайджест війни» на Next.js
- next.config.mjs
- pageMeta
- en/[[...date]]/page.tsx
- (uk)/dashboard/[[...date]]/page.tsx
- (uk)/[[...date]]/page.tsx
- Backlink Profile: warorientyr.com (2026-10-17)
- Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

## God Nodes (most connected - your core abstractions)
1. `flags` - 38 edges
2. `useApp()` - 27 edges
3. `fmt()` - 25 edges
4. `pageMeta()` - 24 edges
5. `Lang` - 22 edges
6. `href()` - 20 edges
7. `react` - 19 edges
8. `resolve()` - 17 edges
9. `StrikesMap()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High)` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/content.md → lib/page.ts
- `Facts from the code that shape the sitemap` --references--> `resolve()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts
- `Phase 2 — High impact (weeks 2–3)` --references--> `pageMeta()`  [INFERRED]
  warorientyr.com-audit/ACTION-PLAN.md → lib/page.ts
- `Validation report` --references--> `pageMeta()`  [INFERRED]
  warorientyr.com-audit/findings/sitemap.md → lib/page.ts
- `Medium` --references--> `pageMeta()`  [INFERRED]
  warorientyr.com-audit/findings/technical.md → lib/page.ts

## Import Cycles
- None detected.

## Communities (33 total, 2 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.13
Nodes (19): Mast(), COUNTRIES, CRX, dateTitle(), dayLabel(), DIP_RX, elapsed(), EN_COUNTRIES (+11 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.11
Nodes (53): useApp(), Dashboard(), fetchJson(), JSON_CACHE, STICKY, useChartW(), useJson(), useSticky() (+45 more)

### Community 2 - "Html.tsx"
Cohesion: 0.21
Nodes (9): metadata, app_globals, metadata, FONTS, Html(), siteMeta(), viewport, ref_vercel_analytics_next (+1 more)

### Community 3 - "Maps.tsx"
Cohesion: 0.08
Nodes (36): MapsCompare, StrikesMap, useElWidth(), dmy(), EVC, EVF, grpOf(), LY (+28 more)

### Community 4 - "Findings: Content Quality"
Cohesion: 0.11
Nodes (17): AI citation readiness (52/100), C-1. No authorship, About, contact, editorial or corrections policy (Critical), C-2. Pipeline and automation artefacts leak into published copy (High), C-3. Latest issue has no stable permalink, so today's links break and content moves URL daily (High), C-4. Readability: very long, densely attributed sentences (Medium), C-5. Opaque or partisan section labels for the EN audience (Low), C-6. Article is a rewrite of secondary sources with a thin source trail (Medium), C-7. Strengths worth keeping (Info) (+9 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+25 more)

### Community 6 - "ArticlePage.tsx"
Cohesion: 0.06
Nodes (61): dynamicParams, generateMetadata(), generateStaticParams, metadata, metadata, sitemap(), dynamicParams, generateMetadata() (+53 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.09
Nodes (19): Data (`public/`), 1. Chief desk — read everything, pick the angle, 2. Ukrainian desk — for a reader in Ukraine, 3. English desk — for a reader outside Ukraine, 4. Check and report, Main editor, isText(), KEYED (+11 more)

### Community 8 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.13
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 12 - "Digest.tsx"
Cohesion: 0.14
Nodes (15): ChkToggle(), countSources(), Digest(), Sources(), SRC_ORD, TocSpy(), secTitle(), ArticleBlock (+7 more)

### Community 13 - "icons.ts"
Cohesion: 0.16
Nodes (13): SecIco(), DIPLO_SYM, diploSrc(), FIRE_SVG, ICO_P, LI_ICO, PEOPLE, SEC_IMG (+5 more)

### Community 14 - "resolve"
Cohesion: 0.05
Nodes (39): resolve(), Action Plan — warorientyr.com, Phase 1 — Critical (week 1), Phase 2 — High impact (weeks 2–3), Phase 3 — Content & authority (month 2), Phase 4 — Monitoring (ongoing), AI Crawler Access, Authority & Brand Signals (25) (+31 more)

### Community 15 - "Schema.org audit: warorientyr.com (checked 2026-10-17)"
Cohesion: 0.15
Nodes (12): A(), ArticleBody, 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`), 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList), 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList), 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree)., Detection, Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo). (+4 more)

### Community 16 - "data.ts"
Cohesion: 0.11
Nodes (28): Architecture, Commands, Conventions, Tools, WAR·Орієнтир — «Щоденний дайджест війни» (Next.js), AppCtx, Ctx, DashIssue (+20 more)

### Community 17 - "SXO: warorientyr.com/en (English edition)"
Cohesion: 0.20
Nodes (9): Gap analysis (`/en`, primary page), Limitations, Main finding: the format is right, but the pages are not packaged the way Google ranks them, Persona scores (weakest first), Queries it can realistically win, Structured findings (audit-data.json, category "Search Experience"), SXO: warorientyr.com/en (English edition), Target page facts (+1 more)

### Community 18 - "Item.tsx"
Cohesion: 0.21
Nodes (11): fireLabel(), FireList(), Item(), Local(), LOCK, RC, SrcChip(), fireIco() (+3 more)

### Community 19 - "Flag.tsx"
Cohesion: 0.33
Nodes (6): f2(), Flag(), H(), R(), star(), V()

### Community 20 - "Findings: On-Page SEO"
Cohesion: 0.22
Nodes (9): Findings: On-Page SEO, On-page items that pass, OP-2. Meta descriptions hard-cut at 200 characters mid-word (Medium), OP-3. Dashboard pages duplicate the digest description (Medium), OP-4. No structured data on any page (High), OP-6. Archive is not crawlable; no sitemap or robots.txt (High), OP-7. hreflang lacks x-default (Low), OP-8. Article title too long (Low) (+1 more)

### Community 21 - "Sitemap audit: https://warorientyr.com"
Cohesion: 0.20
Nodes (9): app/robots.ts, app/sitemap.ts, Expected result, Facts from the code that shape the sitemap, Google News sitemap (optional, last 48h), Other issues found, Recommended implementation (drafts, repo not modified), Sitemap audit: https://warorientyr.com (+1 more)

### Community 23 - "Agent readiness: https://warorientyr.com/en (checked 2026-10-17)"
Cohesion: 0.25
Nodes (7): Access policy (robots.txt absent, so no declared rules), Agent readiness: https://warorientyr.com/en (checked 2026-10-17), Agent-UX heuristic (separate from Lighthouse): 100/100, complete, Findings, Lighthouse Agentic Browsing, Score, Standards notes (facts checked 2026-09-23)

### Community 24 - "validate.mjs"
Cohesion: 0.08
Nodes (20): ref_node_fs, args, cur, curRaw, force, miss, PUB, raw (+12 more)

### Community 26 - "Performance findings (lab only, no CrUX) - 2026-10-17"
Cohesion: 0.29
Nodes (6): Expected after fixes 1-2, Findings and fixes (by impact), Passing, Performance findings (lab only, no CrUX) - 2026-10-17, Root cause (/en LCP 8.7 s), Score: 70/100 (en 58, en/dashboard 92)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

### Community 31 - "pageMeta"
Cohesion: 0.25
Nodes (7): dynamicParams, generateMetadata(), generateStaticParams, pageMeta(), OP-1. Titles are date-only templates and omit the story (High), OP-5. Digest pages have no Open Graph or Twitter tags (Medium), Priority actions

### Community 32 - "en/[[...date]]/page.tsx"
Cohesion: 0.29
Nodes (5): dynamicParams, generateMetadata(), generateStaticParams, DigestPage(), getStrikes

### Community 34 - "(uk)/dashboard/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 35 - "(uk)/[[...date]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamicParams, generateMetadata(), generateStaticParams

### Community 36 - "Backlink Profile: warorientyr.com (2026-10-17)"
Cohesion: 0.40
Nodes (4): Backlink Profile: warorientyr.com (2026-10-17), Next steps, Opportunities (ideas, not measured), Result: INSUFFICIENT DATA (no numeric Backlink Health Score)

### Community 37 - "Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4"
Cohesion: 0.40
Nodes (4): Images, Recommended fixes (priority order), Visual / mobile, Visual / Mobile / Images audit - warorientyr.com/en and /en/articles/2026-10-17/geran4

## Knowledge Gaps
- **232 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+227 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 297 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `resolve()` connect `resolve` to `en/[[...date]]/page.tsx`, `Findings: Content Quality`, `ArticlePage.tsx`, `data.ts`, `Sitemap audit: https://warorientyr.com`, `pageMeta`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `pageMeta()` connect `pageMeta` to `en/[[...date]]/page.tsx`, `text.ts`, `(uk)/dashboard/[[...date]]/page.tsx`, `(uk)/[[...date]]/page.tsx`, `ArticlePage.tsx`, `resolve`, `data.ts`, `Findings: On-Page SEO`, `Sitemap audit: https://warorientyr.com`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `react` connect `data.ts` to `Panels.tsx`, `Maps.tsx`, `package.json`, `ArticlePage.tsx`, `Digest.tsx`, `Item.tsx`, `Flag.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `pageMeta()` (e.g. with `Architecture` and `Phase 2 — High impact (weeks 2–3)`) actually correct?**
  _`pageMeta()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _232 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10946589106292967 - nodes in this community are weakly interconnected._