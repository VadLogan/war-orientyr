# Graph Report - war-orientyr  (2026-10-14)

## Corpus Check
- 12 files · ~11,111 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 187 nodes · 306 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4f7650d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- render
- renderDigest
- app.js
- drawTimeline
- layout.tsx
- package.json
- LegacyApp.tsx
- compilerOptions
- build.py
- validate.mjs
- war-digest-next — «Щоденний дайджест війни» на Next.js
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `render()` - 20 edges
2. `compilerOptions` - 16 edges
3. `renderDash()` - 14 edges
4. `drawTimeline()` - 11 edges
5. `drawAttack()` - 10 edges
6. `drawStrikes()` - 10 edges
7. `TL()` - 8 edges
8. `lineChart()` - 8 edges
9. `selectDate()` - 8 edges
10. `renderDigest()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `renderDigest()` --indirect_call--> `itemHTML()`  [INFERRED]
  public/legacy/app.js → public/legacy/app.js  _Bridges community 2 → community 1_
- `render()` --calls--> `renderMast()`  [EXTRACTED]
  public/legacy/app.js → public/legacy/app.js  _Bridges community 1 → community 0_
- `render()` --calls--> `renderDash()`  [EXTRACTED]
  public/legacy/app.js → public/legacy/app.js  _Bridges community 2 → community 0_
- `renderDash()` --calls--> `panelDirLeg()`  [EXTRACTED]
  public/legacy/app.js → public/legacy/app.js  _Bridges community 2 → community 3_
- `drawFire()` --calls--> `TL()`  [EXTRACTED]
  public/legacy/app.js → public/legacy/app.js  _Bridges community 0 → community 3_

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "render"
Cohesion: 0.13
Nodes (22): domOf(), drawFire(), drawLand(), drawMap(), drawSrcMx(), drawStrikes(), fetchIssue(), goItem() (+14 more)

### Community 1 - "renderDigest"
Cohesion: 0.15
Nodes (15): dateTitle(), dayLabel(), elapsed(), flagSub(), ledeHTML(), plural(), renderDigest(), renderMast() (+7 more)

### Community 2 - "app.js"
Cohesion: 0.10
Nodes (34): atkMix(), atkShell(), atkSum(), civHTML(), diploIco(), diploTitle(), distLabel(), drawAttack() (+26 more)

### Community 3 - "drawTimeline"
Cohesion: 0.26
Nodes (13): dirCol(), dirCtl(), dirOrder(), drawDirs(), drawLosses(), drawTimeline(), lineChart(), panelDirLeg() (+5 more)

### Community 4 - "layout.tsx"
Cohesion: 0.22
Nodes (7): app_globals, FONTS, metadata, viewport, next, ref_vercel_analytics_next, ref_vercel_speed_insights_next

### Community 5 - "package.json"
Cohesion: 0.07
Nodes (27): dependencies, d3, next, react, react-dom, @vercel/analytics, @vercel/speed-insights, devDependencies (+19 more)

### Community 6 - "LegacyApp.tsx"
Cohesion: 0.38
Nodes (4): LegacyApp(), load(), Window, react

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.12
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 24 - "validate.mjs"
Cohesion: 0.33
Nodes (4): ref_node_fs, d, miss, must

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступні фази (план), Щоденне оновлення даних

## Knowledge Gaps
- **52 isolated node(s):** `metadata`, `viewport`, `FONTS`, `Window`, `nextConfig` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 81 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `react` connect `LegacyApp.tsx` to `package.json`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `metadata`, `viewport`, `FONTS` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `render` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0990990990990991 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._