# Graph Report - war-orientyr  (2026-10-14)

## Corpus Check
- 31 files · ~93,254 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 840 nodes · 2141 edges · 44 communities (32 shown, 12 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 392 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4f7650d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- e
- d3.min.js
- app.js
- xl
- qu
- package.json
- n
- rgb
- hv
- compilerOptions
- build.py
- .add
- Lg
- e
- i
- jn
- Hi
- ul
- su
- M
- wa
- up
- iu
- jm
- validate.mjs
- bezierCurveTo
- Ph
- war-digest-next — «Щоденний дайджест війни» на Next.js
- mc
- Ws
- next.config.mjs
- tu
- kd
- Wc
- cw
- nn
- ew
- id
- Im
- io
- md
- oo
- tn

## God Nodes (most connected - your core abstractions)
1. `n()` - 68 edges
2. `e()` - 59 edges
3. `r()` - 55 edges
4. `o()` - 51 edges
5. `i()` - 48 edges
6. `u()` - 47 edges
7. `a()` - 44 edges
8. `F()` - 35 edges
9. `hv()` - 35 edges
10. `A()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `e()` --indirect_call--> `r()`  [INFERRED]
  public/legacy/d3.min.js → public/legacy/d3.min.js  _Bridges community 13 → community 0_
- `i()` --indirect_call--> `a()`  [INFERRED]
  public/legacy/d3.min.js → public/legacy/d3.min.js  _Bridges community 14 → community 0_
- `i()` --indirect_call--> `n()`  [INFERRED]
  public/legacy/d3.min.js → public/legacy/d3.min.js  _Bridges community 14 → community 6_
- `g()` --indirect_call--> `n()`  [INFERRED]
  public/legacy/d3.min.js → public/legacy/d3.min.js  _Bridges community 0 → community 6_
- `v()` --indirect_call--> `kw()`  [INFERRED]
  public/legacy/d3.min.js → public/legacy/d3.min.js  _Bridges community 0 → community 1_

## Import Cycles
- None detected.

## Communities (44 total, 12 thin omitted)

### Community 0 - "e"
Cohesion: 0.06
Nodes (116): A(), g(), ae(), Ag(), l(), ax(), c(), b() (+108 more)

### Community 1 - "d3.min.js"
Cohesion: 0.02
Nodes (20): au(), bl(), Dc(), di(), Gc(), Ic(), it(), kw() (+12 more)

### Community 2 - "app.js"
Cohesion: 0.05
Nodes (84): atkMix(), atkShell(), atkSum(), civHTML(), dateTitle(), dayLabel(), diploIco(), diploTitle() (+76 more)

### Community 3 - "xl"
Cohesion: 0.06
Nodes (43): ad(), al(), a(), Bf(), bs(), cd(), copy(), Df() (+35 more)

### Community 4 - "qu"
Cohesion: 0.08
Nodes (10): draw(), fu(), Ia(), lu(), qu, quadraticCurveTo(), Ru, f() (+2 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (38): app_globals, FONTS, metadata, viewport, LegacyApp(), load(), Window, dependencies (+30 more)

### Community 6 - "n"
Cohesion: 0.06
Nodes (41): at(), cf(), l(), Cg(), dg(), et(), ff(), Fg() (+33 more)

### Community 7 - "rgb"
Cohesion: 0.10
Nodes (30): Ai(), ar(), brighter(), Ce(), cr(), darker(), de(), displayable() (+22 more)

### Community 8 - "hv"
Cohesion: 0.09
Nodes (22): Av(), bv(), Cv(), Dv(), Ev(), Gv(), hv(), jv() (+14 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "build.py"
Cohesion: 0.12
Nodes (12): argparse, collections, json, os, pyproj, shapely_geometry, shapely_ops, shapely_validation (+4 more)

### Community 11 - ".add"
Cohesion: 0.15
Nodes (9): an(), ch(), fh(), gg(), i(), InternMap, InternSet, vt() (+1 more)

### Community 12 - "Lg"
Cohesion: 0.13
Nodes (15): Bg(), Eg(), hf(), Ig(), lf(), Lg(), mg(), Ng() (+7 more)

### Community 13 - "e"
Cohesion: 0.14
Nodes (14): bp(), e(), Fx(), gp(), Ip(), ix(), jx(), Kx() (+6 more)

### Community 14 - "i"
Cohesion: 0.15
Nodes (13): ap(), ei(), eo(), gw(), Hd(), i(), jd(), jp() (+5 more)

### Community 15 - "jn"
Cohesion: 0.15
Nodes (13): Be(), clamp(), formatHsl(), hn(), ie(), jg(), jn(), pn() (+5 more)

### Community 16 - "Hi"
Cohesion: 0.18
Nodes (12): ao(), Ci(), co(), fo(), Hi(), ji(), Pi(), uo() (+4 more)

### Community 17 - "ul"
Cohesion: 0.20
Nodes (8): cl(), fl(), ll(), ol(), e(), ql(), sl(), ul()

### Community 18 - "su"
Cohesion: 0.31
Nodes (4): ku(), Mu(), pu(), su()

### Community 19 - "M"
Cohesion: 0.22
Nodes (9): bw(), dw(), fv(), M(), lv(), sv(), vw(), w() (+1 more)

### Community 20 - "wa"
Cohesion: 0.25
Nodes (8): ca(), Qo(), ua(), wa(), d(), g(), p(), s()

### Community 21 - "up"
Cohesion: 0.31
Nodes (9): cp(), dp(), fp(), hp(), lp(), pp(), sp(), up() (+1 more)

### Community 22 - "iu"
Cohesion: 0.25
Nodes (7): cu(), iu(), i(), u(), Ka(), ou(), uu()

### Community 24 - "validate.mjs"
Cohesion: 0.33
Nodes (4): ref_node_fs, d, miss, must

### Community 25 - "bezierCurveTo"
Cohesion: 0.40
Nodes (5): bezierCurveTo(), Bx(), ow(), rx(), Vx()

### Community 26 - "Ph"
Cohesion: 0.40
Nodes (5): Dh(), Ih(), Ph(), qh(), uh()

### Community 27 - "war-digest-next — «Щоденний дайджест війни» на Next.js"
Cohesion: 0.40
Nodes (4): war-digest-next — «Щоденний дайджест війни» на Next.js, Запуск, Наступні фази (план), Щоденне оновлення даних

### Community 28 - "mc"
Cohesion: 0.50
Nodes (4): Ac(), bc(), mc(), xc()

### Community 29 - "Ws"
Cohesion: 0.50
Nodes (4): el(), Ks(), qs(), Ws()

### Community 31 - "tu"
Cohesion: 0.67
Nodes (3): ja(), nu(), tu()

### Community 32 - "kd"
Cohesion: 1.00
Nodes (3): kd(), o(), Nd()

### Community 33 - "Wc"
Cohesion: 0.67
Nodes (3): nf(), Wc(), zc()

## Knowledge Gaps
- **52 isolated node(s):** `metadata`, `viewport`, `FONTS`, `Window`, `nextConfig` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 220 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `el()` connect `Ws` to `d3.min.js`, `app.js`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `qu` connect `qu` to `d3.min.js`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `lu()` connect `qu` to `d3.min.js`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 28 inferred relationships involving `n()` (e.g. with `C()` and `M()`) actually correct?**
  _`n()` has 28 INFERRED edges - model-reasoned connections that need verification._
- **Are the 34 inferred relationships involving `e()` (e.g. with `A()` and `C()`) actually correct?**
  _`e()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 27 inferred relationships involving `r()` (e.g. with `d3.min.js` and `A()`) actually correct?**
  _`r()` has 27 INFERRED edges - model-reasoned connections that need verification._
- **Are the 28 inferred relationships involving `o()` (e.g. with `A()` and `al()`) actually correct?**
  _`o()` has 28 INFERRED edges - model-reasoned connections that need verification._