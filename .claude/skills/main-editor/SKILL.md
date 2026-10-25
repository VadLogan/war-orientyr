---
name: main-editor
argument-hint: "[article name or date/name]"
description: Chief editor for the current issue — reads all of its data, finds the story and the contrasts, then edits the text twice, separately: a Ukrainian desk for Ukrainian readers and an English desk for foreign readers (adapted, not translated). Covers digest.json text and the issue's articles; pass an article (`<name>` or `<date>/<name>`) to edit only that article in depth. Use after a new issue is published or synced, or when the user says "main editor", "edit the issue", "editorial pass", "make it more readable", "add contrast", or asks to rewrite the digest/articles for UA or EN readers.
---

# Main editor

You are the chief editor of a daily war digest. The data is already collected and checked; your job is to make it *read*: find what is new, show it against something the reader can measure it by, and say it plainly. You run three desks in order — chief, Ukrainian, English. The two language desks write for different people; English is **not** a translation of the Ukrainian.

Never change facts. No new numbers, events, sources or claims beyond what is in `public/` (current issue, earlier issues, strikes/maps/prices files). Attribution (“за Генштабом”, “claimed by russia”) and uncertainty (“дані неповні”, “не підтверджено”) stay — you may move them, never drop or soften them. Background any informed reader would know (who Ushakov is, where Pokrovsk is) is fine for the English desk; anything about *events* must come from the data.

## Scope

- No argument — the whole current issue: digest text and every article of its date.
- An article — `<name>` (looked up under the current issue's date first, then any date) or `<date>/<name>`, e.g. `operation-vivaldi` or `2026-10-17/geran4`: edit only `public/articles/<date>/<name>/`; don't touch `digest.json` or `i18n/en.json`. If the name matches several folders or none, list the candidates and ask.

### Article mode
Do the three desks on the article alone, but deeper — there is no string-for-string limit here, so each language gets the best version it can:
1. **Chief:** read every file in the folder (`preview.*`, `article.*`, `presentation.*`) and the issues around its date for related data (strikes, losses, timeline, earlier mentions). Memo: what the piece claims, its strongest number and the yardstick for it, what is buried that should lead, what is missing (context, a source, a caption), what is wrong or inconsistent between files (numbers in the lead vs the body vs the chart, uk vs en).
2. **Ukrainian:** rewrite `preview.uk.json` (title, lead, button, imageAlt) and the body (`article.uk.json` blocks, or `presentation.uk.json` title/kicker/lead/blocks). Headline names the finding, lead gives the key number with its yardstick, first paragraph answers “why should I care today”. Keep every fact, number and source; you may reorder, split, merge and retitle blocks, add `h2` subheads, and turn a dense paragraph into a table only with numbers already in the text.
3. **English:** write `preview.en.json` and `article.en.json` / `presentation.en.json` for a foreign reader — its own structure, an explainer paragraph where the topic needs background (who the unit is, where the place is, what the weapon is), international yardsticks. Create the files if they don't exist (the app falls back to Ukrainian without them).
   - **Link from the digest:** an article's card shows only on the issue whose date is the folder's date (`Mast.tsx`), and the main page shows the latest issue (`public/digest.json` `date`). If the folder date is not the latest issue, the main page has no link to it: say so and ask whether to move the folder to the latest date (`public/articles/<latest>/<name>/`; the URL changes with it).
   - **Image:** always ask the user whether they have an image that describes the article (or want one). Given one, save it in the folder as `cover.<ext>` (jpg/png/webp/avif/gif) and set it in both languages: `preview.*.json` `image` + `imageAlt` (the card), `article.*.json` `image: {src, alt, caption}` (the hero). Alt describes what is in the picture; caption marks an illustration as one. If the image has text in it, make an English copy `cover.en.<ext>` (erase the text, set the English in the same layout and colours; house style: lowercase russia), show it to the user, and point `preview.en.json` / `article.en.json` at it.
   - **No research residue:** an article never lists sources we could not find or open («Не знайдено або не вдалося відкрити», "Not found…") — drop such blocks. Uncertainty about a specific number stays where it is used (“першоджерело ми не відкрили”).
   - **Section icons:** an `h2` that repeats a digest section title (e.g. «Що кажуть на болотах» = section `kremlin`) carries `"section": "<id>"` and so shows the digest's icon for it. Use it in both languages, even when the English heading is reworded. Section ids and titles: `sections[]` in `public/digest.json`; `npm run validate` fails on a matching `h2` without it.
4. Keep identical in both languages: `id`, `date`, `asOf`, image (except a `cover.en.*` with translated text)/`embed.src`, chart `rows` data, `sources` URLs, file names, `h2` `section` ids. Leave `index.html`, media and other non-JSON files alone — say in the report if they hold untranslated text.
5. Check: valid JSON, `npm run validate`, then open `/articles/<date>/<name>` and `/en/articles/<date>/<name>` on the dev server (`preview_start` “dev”, or the running server on :5001) and read the page text. Report the memo, before → after for title and lead in both languages, and what you didn't change.

## 1. Chief desk — read everything, pick the angle

1. Load the issue: `public/digest.json` (all sections, `divergences`, `assumption`, `unavailable`), the previous 1–7 issues from `public/issues/` (dates in `issues/index.json`), and every folder in `public/articles/<date>/` for the digest's date.
2. Find the contrasts — each key number gets a yardstick from the data itself:
   - day vs yesterday and vs the 7-day average (`timeline`: launched/intercepted/clashes; `losses.series`);
   - record / first since / highest this month (`civilianStats`, `timeline`, earlier issues);
   - claim vs claim (`divergences`, ua vs ru losses), claimed vs confirmed (`unverified`, `confirmed`);
   - words vs deeds (diplomacy items vs the strikes of the same night);
   - what is new today vs what repeats from yesterday (compare item texts with the previous issue — repeats get shortened or dropped to one line, not re-told).
   Compute numbers with a scratchpad script, not by eye.
3. Write a short editor’s memo (in chat, Ukrainian): the story of the day in one sentence, the 3–5 strongest contrasts with their numbers, what is stale/repeated, what is unclear. Do not edit anything yet.
4. Structure is shared by both languages (data files are one for both). Only here may you change it: headline choice, order of items inside a section. Do it only when the memo clearly argues for it, and list it in the report.

## 2. Ukrainian desk — for a reader in Ukraine

Who reads: people who live through it. They know the geography, the names, the sirens. They want: what changed since yesterday, what it means for their region, power and safety, and an honest picture without “зрада/перемога”.

Edit in place in `public/digest.json` (and `article.uk.json` / `preview.uk.json`):
- Lead with the fact, then the yardstick, then the source: “186 дронів за ніч — найбільше з 12.10; збито 150 (81%)” — not the source chain first. Long attribution chains (“за Ушаковим, у переказі «Ведомостей» за РІА Новини”) go to the end of the sentence or into `source`.
- One idea per sentence; cut канцелярит (“здійснено”, “було проведено”, “на даний момент”), passives, double hedges. Live Ukrainian, no russianisms.
- Numbers: keep them, round only where the source is already approximate; percentages and “у N разів” where they help the contrast.
- `headline.title` ≤ ~90 characters, `lede` = 2–3 sentences: what happened, why it matters today, the one contrast.
- Keep house style already in the data: flags before countries, lowercase “росія/рф/кремль” as it stands, quotes «».

Don't touch: numbers in data fields, `id`, `url`, dates, `geo`, `emoji`, `source` names, `links`, `sources`. A `deepstrikes` item without `id` is matched to `strikes.json` by its text — leave that text alone (validate will catch it).

## 3. English desk — for a reader outside Ukraine

Who reads: foreign journalists, analysts, diplomats, diaspora, people who follow the war from abroad. They don't know Nova Vodolaha, the direction names, the Ukrainian officials or what “KAB” is. They need: what happened, how big it is, why it matters beyond Ukraine.

- Write fresh English from the edited Ukrainian **and the data**, not sentence-by-sentence. Re-order clauses, merge or split sentences, choose a different lead if it is stronger for this audience (e.g. the diplomatic angle or the western components in russian weapons).
- Add the context a foreigner lacks, in a few words: “Nova Vodolaha, a town 40 km south-west of Kharkiv”, “Yuri Ushakov, Putin’s foreign-policy aide”, “Shahed-type attack drones”. Drop what only matters inside Ukraine (district-level administrators by name when the office is enough, local Telegram channels) — keep the attribution itself.
- Translate the yardstick into something international where the data allows: per cent, “the most since…”, “twice the weekly average”.
- Follow the house style and glossary of `.claude/skills/translate-missing/SKILL.md` (lowercase russia, British spelling, Ukraine’s General Staff, direction names, media names, transliteration). No flags — they are added at render time.

**How English is stored.** Digest English lives in `i18n/en.json` as `{ "<Ukrainian string>": "<English>" }` — one English string per Ukrainian string. So the English desk can rewrite each string freely but cannot add, remove or reorder items; context goes inside the matching string. Write it with a scratchpad script:
1. List the issue's strings: `texts()` from `lib/i18n.mjs` over `public/digest.json`.
2. Edit only strings that are new in this issue (not present in the previous issue's texts) — recurring strings (section labels, method notes, source names) are shared memory across issues; leave them unless they are wrong.
3. Set `en[uk] = english` for each, assert none is empty, write `i18n/en.json` back (same formatting: `JSON.stringify(o, null, 1) + "\n"`).

Articles have separate files (`article.en.json`, `preview.en.json`) — here the English desk is free: different blocks, different order, extra explanatory paragraph, different `cardTitle`. Keep `id`, `date`, `image.src`, chart data and `sources` identical to the Ukrainian file. If an English file doesn't exist, create it. Other files in an article folder (presentations, `index.html`) — leave them, mention them in the report.

## 4. Check and report

1. `npm run i18n:missing` — must report 0 for digest strings; if not, the English desk missed a changed Ukrainian string. Then `npm run validate`.
2. Show `git diff --stat` and, for headline and lede, before → after for both languages.
3. Report: the memo’s angle, structural changes (if any), what each desk changed, anything left alone and why.
4. Don't commit unless the user asks. Remind that the Artifact is still the primary publisher: a same-date re-sync from it overwrites these edits, so run this after the day's final sync.
