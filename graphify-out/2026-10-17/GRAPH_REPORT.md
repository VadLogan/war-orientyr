# Graph Report - war-orientyr  (2026-10-17)

## Corpus Check
- 64 files · ~123,373 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 426 nodes · 981 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25cb85c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- text.ts
- Panels.tsx
- ui.ts
- Maps.tsx
- Html.tsx
- package.json
- data.ts
- scripts/i18n.mjs
- proxy.ts
- compilerOptions
- build.py
- Translate missing strings (UA → EN)
- publish.mjs
- war-digest-next — «Щоденний дайджест війни» на Next.js
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 27 edges
2. `fmt()` - 25 edges
3. `Lang` - 20 edges
4. `compilerOptions` - 16 edges
5. `StrikesMap()` - 15 edges
6. `href()` - 15 edges
7. `react` - 15 edges
8. `Timeline()` - 14 edges
9. `useSticky()` - 14 edges
10. `shortD()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `useSticky()`  [INFERRED]
  CLAUDE.md → components/dash/hooks.ts
- `Architecture` --references--> `useJson()`  [INFERRED]
  CLAUDE.md → components/dash/hooks.ts
- `Data (`public/`)` --references--> `useJson()`  [INFERRED]
  CLAUDE.md → components/dash/hooks.ts
- `Architecture` --references--> `DashIssue`  [INFERRED]
  CLAUDE.md → components/ctx.ts
- `Data (`public/`)` --references--> `texts()`  [INFERRED]
  CLAUDE.md → lib/i18n.mjs

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "text.ts"
Cohesion: 0.05
Nodes (56): ChkToggle(), ArtCard(), countSources(), Digest(), SecIco(), Sources(), SRC_ORD, Dist() (+48 more)

### Community 1 - "Panels.tsx"
Cohesion: 0.10
Nodes (55): useApp(), Dashboard(), fetchJson(), JSON_CACHE, STICKY, useChartW(), useJson(), useSticky() (+47 more)

### Community 2 - "ui.ts"
Cohesion: 0.09
Nodes (34): dynamicParams, generateMetadata(), generateStaticParams, metadata, metadata, dynamicParams, generateMetadata(), generateStaticParams (+26 more)

### Community 3 - "Maps.tsx"
Cohesion: 0.09
Nodes (32): MapsCompare, StrikesMap, useElWidth(), dmy(), EVC, EVF, grpOf(), LY (+24 more)

### Community 4 - "Html.tsx"
Cohesion: 0.19
Nodes (10): metadata, app_globals, metadata, FONTS, Html(), SITE, siteMeta(), viewport (+2 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+25 more)

### Community 6 - "data.ts"
Cohesion: 0.07
Nodes (45): dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata(), generateStaticParams, dynamicParams, generateMetadata() (+37 more)

### Community 7 - "scripts/i18n.mjs"
Cohesion: 0.13
Nodes (14): Data (`public/`), isText(), KEYED, SKIP, texts(), translate(), ref_node_path, files (+6 more)

### Community 8 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, preferredLang(), proxy(), ref_next_server

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.12
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 24 - "publish.mjs"
Cohesion: 0.13
Nodes (13): ref_node_fs, args, cur, curRaw, force, miss, PUB, raw (+5 more)

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступний крок, Щоденне оновлення даних

## Knowledge Gaps
- **140 isolated node(s):** `dynamicParams`, `generateStaticParams`, `dynamicParams`, `generateStaticParams`, `dynamicParams` (+135 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 192 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `data.ts` to `text.ts`, `Panels.tsx`, `ui.ts`, `Maps.tsx`, `package.json`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `Lang` connect `ui.ts` to `text.ts`, `Panels.tsx`, `Maps.tsx`, `Html.tsx`, `data.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `dynamicParams`, `generateStaticParams`, `dynamicParams` to the rest of the system?**
  _140 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `text.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052917232021709636 - nodes in this community are weakly interconnected._
- **Should `Panels.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09615384615384616 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09494949494949495 - nodes in this community are weakly interconnected._
- **Should `Maps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08558558558558559 - nodes in this community are weakly interconnected._