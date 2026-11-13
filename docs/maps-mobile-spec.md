# /maps on phones — design v2 and implementation brief

Design: canvas "Maps page — mobile-first redesign", row **"Телефон v2"** (boards v2 · 1–6, dark theme).
Scope: screens up to 600 px wide. Desktop keeps the current layout. No feature of today's page is removed; every
one is listed in section 9 with its new place.

## 1. The problem this solves

On a phone the map currently draws every layer at once: 12 direction labels, direction sectors, claim markers,
DeepState change triangles, change rings, the old-line dash, a 6-button zoom column and an 8-entry legend. On a
360–390 px map nothing can be read, and the reader cannot tell what the page is trying to say.

Priorities, in order (from the original brief):
1. The map and **one takeaway for the week** on the first screen.
2. One question at a time: the map shows only what answers the selected question.
3. Everything else lower on the page or behind one tap, never on top of the map.

## 2. Principles

- **Mode = question = layer set.** Three modes; each one fixes what is drawn. Layers of other modes are off, not faded.
- **The map carries marks, not text.** No label boxes on the phone map except city names and one selected item.
- **Lists explain the map.** Every numbered mark on the map has the same number in the list under it.
- **Details come to the thumb.** Anything tapped opens a card at the bottom of the screen, not a tooltip at the top.
- **The page must always scroll.** A finger resting on the map never traps the reader.

## 3. Page structure, top to bottom (board v2 · 1)

Heights are for a 390×844 screen; the browser's own bars leave about 660–700 px visible.

| # | Block | Height | Notes |
|---|---|---|---|
| 1 | Top bar | 48 | Brand and language only. No date bar, day counters or "state of the war" heading: the date lives in the time bar on the map (5.2). |
| 2 | Takeaway | ~64 | Kicker (mode + period) and headline (Literata 22/1.25, max 2 lines). No supporting paragraph: its figure moves to the legend line. Content depends on the mode and the direction — see section 4. |
| 3 | Mode tabs | 44 + 8 | Three equal segments: Що змінилось · Заяви рф · Джерела. Above the map, because they say what the map shows. |
| 4 | Map | 476 (full-bleed) | The dominant block: `clamp(340px, 100dvh − 330px, 520px)`, about 55–60 % of the screen. With browser bars visible (≈ 664 px) the map and its time bar are fully in view; legend and chips follow on the first scroll. |
| 5 | Legend / mode strip | 30–60 | One line, specific to the mode (section 4), ending with the mode's key figure ("+17 км² за тиждень"). Under the map, not on it. |
| 6 | Direction chips | 52 | One horizontally scrolling row. |
| 7 | List of the mode | auto | Numbered, same order and numbers as on the map. First 2 rows peek above the fold. |
| 8 | Section links | auto | Перевірка заяв · Зміни лінії · Відстані · Площі (existing `/maps/<section>` pages), each with its key figure. |
| 9 | Price-of-a-kilometre note, sources line, method, "also on the site" | auto | Unchanged content. |
| — | Bottom navigation | 58 fixed | Existing. All fixed/sheet elements sit above it and add `env(safe-area-inset-bottom)`. |

First-screen budget: 48 + 64 + 52 + 476 = 640 px to the bottom of the map.

## 4. Modes

The mode is the existing preset, extended with a fixed layer set. Switching mode never changes the zoom, the
snapshot or the picked direction.

### 4.1 Що змінилось (default on a first visit)

- **Map layers:** occupied area per DeepState (fill + outline); the week's DeepState changes as **numbered rings**
  (1 = newest); when "line then and now" is on: taken / retaken patches and the old line dashed. Nothing else.
  A Ukrainian advance uses the blue ring and a blue number badge; a "map refined" note gets a grey dot, no number.
- **Takeaway:** kicker "Тиждень на фронті · 06–12.11"; headline `wkLine` ("рф просунулась у 4 місцях." — a side
  with no advance is left out); the figure "+17 км² за тиждень" closes the legend line.
- **Time bar:** the snapshot (▶ ‹ date ›).
- **Legend strip:** ▢ окуповано · ◯ просування рф за 7 днів (· ◯ просування Сил оборони, only when present;
  · ┄ лінія DD.MM, only when the comparison is on).
- **List:** the week's changes, newest first: number badge, date, DeepState's note, and "рф заявила про це DD.MM
  (на N дн раніше)" when a DIVGEN claim matches. Under the list: the snapshot comparison sentence and
  "▶ Програти тиждень".

### 4.2 Заяви рф (board v2 · 3)

- **Map layers:** occupied area per the reference source (DeepState by default) and the period's DIVGEN claims.
  Marker **shape and fill = verdict** (the existing `Mark` set). No rings, no DeepState triangles.
- **Clustering:** markers closer than 28 px at the current zoom merge into a neutral circle with a count. Tapping
  a cluster zooms until it splits (or, at max zoom, opens the card with the cluster's claims as a pager).
- **Takeaway:** kicker "Заяви рф · 05–11.11 · звірка з DeepState"; headline "7 з 9 заяв рф не підтверджуються."
  With zero claims: "За цей період рф нічого не заявляла."
- **Time bar:** the claims window instead of the snapshot — ‹ "05.11 – 11.11 · 7 дн" ›; the arrows step the window,
  a tap on the label cycles 7 / 14 / 30 days.
- **Mode strip (replaces the legend):** the verdict bar as 2–5 buttons (only verdicts with a count > 0), each
  "mark + count + short name". It is the legend and the filter at once: a tap shows only that verdict (map and
  list), a second tap shows all. Min height 44.
- **List:** claims, newest first: verdict mark, date, claim text, "DeepState: … · ISW: …".
- The reference source lives in Filters (the period and window are there too, mirroring the time bar); the
  kicker always shows the active window.

### 4.3 Джерела

- **Map layers:** the outlines of the selected pair (default DIVGEN ↔ DeepState) and the two "only A / only B"
  difference fills (+ "only DIVGEN, grey zone in DeepState" for that pair). No events.
- **Takeaway:** kicker "Джерела · DIVGEN і DeepState"; headline "Карти розходяться на 4 868 км²." The detail
  ("рф приписує собі на 4 868 км² більше, ніж бачить DeepState; DeepState бачить окупованими 277 км², яких не
  визнає DIVGEN") is the first row of the list.
- **Time bar:** the snapshot.
- **Mode strip:** a 3-segment pair switch (DIVGEN↔DeepState · DIVGEN↔ISW · ISW↔DeepState) and under it the
  legend line for the pair.
- **List:** the area tiles (existing `areaTiles`) as rows.

## 5. The map

### 5.1 Controls on the map (and nothing else)

- Right edge, stacked from the top, 44×44 each, 8 px apart, rounded 8: **full screen**, **Filters** (badge = number
  of filters that differ from the mode's defaults), **fit the whole front** (shown only when the view is not the
  fitted front).
- Bottom centre: the **time bar** (5.2).
- Bottom left, above the time bar's row when it would collide: the basemap attribution, 10 px, one line.
- Removed from the phone map: `+` / `−` (pinch and double-tap replace them) and reset-zoom (same as fit).

### 5.2 Time bar

A row of floating buttons on the map's bottom edge, always visible in the page and in full screen (there it sits
just above the bottom sheet): **▶**, **‹**, **date**, **›**. All 44 high, same style as the right-hand buttons.

- **‹ / ›** step to the previous / next archived snapshot; the map cross-fades (no fly), the takeaway, legend
  figure and list recompute for that snapshot's week. › is disabled on the newest snapshot.
- **Date** ("12.11.2026") opens the existing issue/snapshot calendar sheet. When the snapshot differs from the
  page's issue, the label turns accent-coloured and a "↺ 12.11" chip appears beside it to return.
- **▶** plays the line changes: the existing tour, starting at the week's oldest change and running to the
  newest; on the phone it enters full screen, with the caption in the bottom sheet at "peek" and ‹ ▶/❚❚ › n/N ■
  in its header. A long press on ▶ offers "Весь архів" (the whole archive, as today).
- In "Заяви рф" the bar shows the claims window instead (4.2); ▶ is hidden.
- The bar hides while a card (section 6) is open and returns when it closes.
- The "as of" time of the source ("DeepState на 11.11, 22:57") is shown in the calendar sheet and in Filters,
  not on the map.

### 5.3 Labels

- City names only, thinned by zoom: at whole-front zoom at most 6 (Харків, Дніпро, Запоріжжя, Донецьк, Маріуполь,
  Херсон); more appear from zoom ×2.5. A city label never overlaps a mark: the mark wins, the label hides.
- Direction labels and sectors: **off at whole-front zoom on phones.** A picked direction shows its own sector
  tint and one label (board v2 · 4).

### 5.4 Gestures — inline map (in the page)

| Gesture | Result |
|---|---|
| One-finger vertical drag | Scrolls the **page** (`touch-action: pan-y`). |
| One-finger horizontal drag | Pans the map, only if the gesture starts clearly horizontal (>12 px sideways before 8 px vertical). |
| Two-finger drag / pinch | Pans / zooms the map. |
| Double tap | Zooms in one step on that point. |
| Tap on a mark | Selects it (section 6). Hit area 44×44 around the mark; the nearest mark wins. |
| Tap on empty map | Closes the open card. If no card is open, nothing (the distance pin is a full-screen and Filters action, see 9). |

The first time a one-finger drag is ignored on the map, show for 1.5 s the hint "Двома пальцями — рухати мапу"
over the map (the existing `map-hint` overlay), at most once per session.

### 5.5 Full screen (board v2 · 5)

- Entered with the full-screen button; covers the whole viewport including the bottom navigation; body scroll locked.
- Top: close (×) and the same three mode tabs. Right: fit front, Filters, play. The time bar sits above the sheet.
- **One finger pans**, pinch zooms, double tap zooms in, two-finger tap zooms out.
- The mode's list lives in a **bottom sheet with three snap points**: peek (title + first row, ~150 px), half
  (50 % of the height), full (to 64 px from the top). Drag the handle or the header; the list scrolls only at "full".
  The map's "fit" and "fly to" keep the target inside the area not covered by the sheet.
- Exit: ×, the system Back gesture/button (full screen pushes a history entry), or Esc.
- Tapping empty map here drops the distance pin (existing feature) and shows "N км до окупованої території" in
  the sheet header until closed.

## 6. Selecting something (board v2 · 2)

Trigger: a tap on a ring / claim marker / cluster at max zoom, or on a list row.

1. The map flies there (≤ 900 ms; instant with `prefers-reduced-motion`), zoom ≥ ×10, with the point placed at
   the centre of the map area **above the card**.
2. The selected mark grows and gets a halo; other marks of the layer drop to 40 % opacity.
3. A **card slides up from the bottom**, above the bottom navigation (height by content, max 45 % of the viewport):
   - header: number badge or verdict mark · date · source · kind; close (×);
   - the text (DeepState note or the claim), 16.5 px semibold;
   - context line: matched DIVGEN claim and its lead/lag for a change; "DeepState: … · ISW: …" for a claim; direction name;
   - footer: ‹ · "1 / 4" · › and one action — "09.11 ↔ 10.11" for a change (a toggle that cross-fades the snapshot
     before and after it, the existing tour step), "Показати зміну поруч" for a claim that matches a DeepState change.
4. ‹ / › and a horizontal swipe on the card step through the list in its order; the map follows.
5. Close: ×, swipe the card down, tap empty map, or system Back (the card pushes a history entry; the selected
   claim stays in the URL hash as today, `c=`).
6. If the tap came from a list row below the fold, the page first scrolls so the map is in view.

Only one overlay exists at a time: opening Filters or full screen closes the card.

## 7. Direction chips (board v2 · 4)

- One scrolling row under the legend: **"Весь фронт"** first, then directions sorted by the General Staff's attacks
  of the day (ties: by events in the current mode), each "name + number". The number is attacks in "Що змінилось"
  and "Джерела", and the count of claims in "Заяви рф". Directions with 0 and no events go to the end.
- Tap a chip: the map frames that direction (existing `pickDir`), draws its sector tint and its single label, the
  list and the mode strip counts filter to it, the takeaway switches to the direction ("Костянтинівський напрямок ·
  06–12.11" / "рф просунулась в 1 місці."); the direction's label on the map carries its attacks of the day
  ("Костянтинівський · 14 атак"). The chip takes the direction's dashboard colour, gains a "×" and moves to the
  start of the row.
- Under a filtered list: "Ще 3 зміни — на інших напрямках. Весь фронт".
- Tap the active chip again, or "Весь фронт": back to the whole front.
- The direction stays in the URL hash (`d=`), as today; a `/maps/<direction>` page opens with its chip active.

## 8. Filters sheet (board v2 · 6)

Opens from the pill; a bottom sheet to 64 px from the top, scrim behind, body scroll locked; closes with ×, the
scrim, swipe down on the header, system Back. Changes apply live to the map behind; "Показати на мапі" closes the
sheet; "Скинути" returns the mode's defaults. Rows are 48 px; a row shows its current value so the sheet can be
read without opening anything. Second-level choices open inside the sheet (push to the left, back arrow).

| Group | Row | Control | Today's equivalent |
|---|---|---|---|
| Час | Знімок карти | ‹ date › + "DeepState на …" (mirrors the time bar) | Snapshot stepper |
| | Лінія тоді й тепер | Ні · 7 дн · 30 дн | same |
| | Програти весь архів | starts the whole-archive tour in full screen | ▶ in rail and on the map |
| Джерело на мапі | Вигляд | DeepState · ISW · DIVGEN · Порівняти | same |
| | Пара для порівняння | sub-list, enabled only for "Порівняти" | Pair select |
| Події на мапі | Зміни лінії за DeepState | switch + count | same checkbox |
| | Заяви DIVGEN | switch + count | same checkbox |
| | Період | 7 · 14 · 30 + window ‹ dates › | Period + claims window |
| | Вердикт | sub-list of checkboxes with marks and counts | Verdict checkboxes |
| | Звірка з | DeepState · ISW | Reference source |
| Вигляд мапи | Напрямки й сектори | sub-list: sector switch, show/hide each, all on/off, attacks + claims per direction | Direction list + sector toggle |
| | Основа | Схема · Рельєф · Супутник | Basemap toggle |
| Footer | copy link (icon) · "Показати на мапі" | | Copy link |

Rule that keeps modes and filters consistent: a mode sets the layer switches to its defaults; changing a switch
in Filters afterwards is allowed (the reader can add claims to "Що змінилось"), the tab stays selected, and the
pill's badge counts the differences.

## 9. Where every existing feature lives

| Feature today | On phones in v2 |
|---|---|
| Three presets | Mode tabs above the map |
| "The week on the front" block | The takeaway + the list of "Що змінилось" |
| Snapshot stepper, play | Time bar on the map (5.2); also in Filters |
| Issue date bar (‹ date ›, count) | Time bar: the date opens the same calendar sheet |
| Pair, period, window, verdicts, reference, directions, sectors | Filters sheet (section 8); period and window also on the time bar in "Заяви рф" |
| Basemap toggle, copy link | Filters sheet (the hash still updates live) |
| Direction labels and sectors on the map | Direction chips; one label + sector for the picked direction |
| Zoom + / −, reset | Pinch, double tap, "fit front" |
| Claim card (top-left overlay), DeepState change card | Bottom card (section 6) |
| Hover tooltips | None on touch; the card replaces them |
| Tour / player with captions | Full screen; the caption is the bottom sheet at "peek", ‹ ▶/❚❚ › n/N ■ in its header |
| Full-screen claims list | Full-screen bottom sheet |
| Verdict bar | Mode strip of "Заяви рф"; full bar in the `/maps/claims` section |
| "What each side reported" slider, claims table, DeepState table | Section pages `/maps/claims`, `/maps/changes` |
| Distances table + pin | `/maps/distance`; pin by tap in full screen |
| Area tiles | List of "Джерела"; `/maps/areas` |
| Full legend | One mode line; "Усі позначки" link at its end opens the full legend in a sheet |
| Shareable hash (`v p n o d s c e a g`) | Unchanged; add nothing mode-specific (a mode is a combination of these) |
| Price-of-a-kilometre note, cross-links, sources, method | Below the section links, unchanged |

## 10. States and edge cases

- **Loading:** the takeaway, tabs and a map-sized skeleton render from server data; the server HTML list (MapsSeo)
  fills the list area until the map is ready. No layout shift when the map arrives: reserve its height.
- **No changes this week:** headline `wkNone`; the map shows the occupied area only; the list area says so and
  offers "Подивитись заяви рф" (switches the mode).
- **No claims in the window:** see 4.2; the mode strip is hidden.
- **Older issue:** the kicker shows that issue's week; an "Архівний випуск · до найновішого" line sits between the
  top bar and the takeaway.
- **Long headline (de/fr):** 2 lines max, then the font steps down to 20 px; never pushes the map below 560 px.
- **Landscape phone / very short viewport (< 500 px high):** the map takes `100dvh − 120px`; the takeaway
  collapses to its headline only.
- **Offline / data error:** existing error text in the map area; tabs and Filters disabled.
- **Reduced motion:** no fly animation, no cross-fade; changes are instant.

## 11. Visual rules

- Works in both themes through the existing tokens; the design is drawn in dark (`--bg #111619`,
  `--surface #181e22`, `--m-occ #e0675e`, changes `--unv`).
- Marks: change ring 20–22 px, stroke 2; number badge 16 px with a 10 px mono number; claim marker 12 px;
  cluster 24 px. Every mark has a 1.5–2 px dark halo so it reads on terrain and satellite tiles.
- Colours never stand alone: verdict = shape + fill, side = colour + text in the list.
- Touch targets ≥ 44×44; chips 36 high inside a 52 px row; text on the map ≥ 11 px with a halo.
- Text contrast ≥ 4.5:1, including the muted grey on `--surface`.

## 12. Accessibility

- Tabs are a `tablist`; the takeaway is an `aria-live="polite"` region so a mode or direction change is announced.
- The list is the accessible equivalent of the map: every mark is reachable as a list row; the map itself is
  `role="img"` with a summary label.
- Bottom card and sheets are `dialog`s with focus moved in and returned on close; Filters is modal, the card is not.
- Full screen and sheets close with Esc and with system Back.

## 13. Measuring the result

The goal is the 78 % bounce rate. Track per mode switch, mark tap, chip tap, Filters open, full-screen open and
section link as events; a visit with any of them counts as engaged. Compare bounce and engaged share for phone
visits two weeks before and after.

## 14. Acceptance checks on real devices

Test on iPhone SE (375×667), iPhone 14/15 (390×844) and a 360×800 Android, Safari and Chrome, both themes.

1. With browser bars visible the whole map including the time bar is on the first screen, and it takes at least half of the visible height.
2. At whole-front zoom nothing overlaps: no label boxes, each number badge readable.
3. A vertical swipe that starts on the map scrolls the page every time.
4. Switching each mode changes the takeaway, the layers, the strip and the list together, within 300 ms.
5. Tap ring 1 → card "1 / 4"; › steps to 2 and the map follows; system Back closes the card and stays on the page.
6. Tap a direction chip → map frames it, list filters, "Весь фронт" restores.
7. Every row of the Filters sheet works and matches the desktop rail's result; the pill's badge counts correctly.
8. A link copied in one mode/direction opens to the same view on another phone.
9. Full screen: one-finger pan, sheet snaps at three heights, Back exits.
11. ‹ on the time bar shows the previous snapshot within 300 ms (data cached) and the headline, figure and list change with it; ▶ plays the week and can be paused and stopped.
10. Nothing fixed is hidden behind the bottom navigation or the home indicator.
