// Checks that the data files the page needs parse and the digest schema keys are intact.
import fs from "node:fs";
import { MUST as must, DATE_RX } from "./schema.mjs";
const rd = (p) => JSON.parse(fs.readFileSync(new URL("../public/" + p, import.meta.url), "utf8"));
const d = rd("digest.json");
const miss = must.filter((k) => !(k in d));
if (miss.length) { console.error("digest.json missing keys:", miss); process.exit(1); }
const idx = rd("issues/index.json").dates;
if (!idx.includes(d.date)) { console.error("issues/index.json lacks", d.date); process.exit(1); }
// Every strike in today's "deepstrikes" section must be on the strikes map (strikes.json, matched by id or item),
// or the map silently goes stale. Notes (no emoji, or ℹ️) and items marked `geo: null` (no usable coordinates) are exempt.
const stk = new Set(rd("strikes.json").items.flatMap((x) => [x.id, x.item]));
const isStrike = (i) => i.emoji && i.emoji !== "ℹ️" && i.geo !== null;
const deep = d.sections.filter((s) => s.id === "deepstrikes").flatMap((s) => s.items || []).filter(isStrike);
const noId = deep.filter((i) => !i.id), noMap = deep.filter((i) => i.id && !stk.has(i.id)).map((i) => i.id);
if (noId.length || noMap.length) {
  console.error("strikes map is behind digest.json — add these deepstrikes items to strikes.json (or set geo: null if they can't be placed):\n  "
    + [...noMap, ...noId.map((i) => "(no id) " + i.text.slice(0, 80))].join("\n  "));
  process.exit(1);
}
// articles/<YYYY-MM-DD>/<name>/: preview.uk.json required (title); a full article (article.uk.json, body[]) or a preview url
const ART = new URL("../public/articles/", import.meta.url);
const dirs = (u) => (fs.existsSync(u) ? fs.readdirSync(u, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
let nArt = 0;
for (const date of dirs(ART)) {
  if (!DATE_RX.test(date)) { console.error("articles/" + date + ": folder must be a date YYYY-MM-DD"); process.exit(1); }
  for (const name of dirs(new URL(date + "/", ART))) {
    const at = `articles/${date}/${name}/`, has = (f) => fs.existsSync(new URL("../public/" + at + f, import.meta.url));
    const fail = (m) => { console.error(at + ": " + m); process.exit(1); };
    if (!/^[a-z0-9-]+$/.test(name)) fail("folder name: a-z, 0-9, - only (it is the URL)");
    if (!has("preview.uk.json")) fail("missing preview.uk.json");
    for (const l of ["uk", "en"]) {
      if (has(`preview.${l}.json`)) { const p = rd(at + `preview.${l}.json`); if (!p.title) fail(`preview.${l}.json needs title`); if (p.url && !/^https?:\/\//.test(p.url)) fail(`preview.${l}.json url must be http(s)`); if (p.image && !has(p.image)) fail("image not found: " + p.image); }
      if (has(`article.${l}.json`) && !Array.isArray(rd(at + `article.${l}.json`).blocks)) fail(`article.${l}.json needs blocks[]`);
      if (has(`presentation.${l}.json`)) {
        const s = rd(at + `presentation.${l}.json`);
        if (!s.title || !Array.isArray(s.blocks)) fail(`presentation.${l}.json needs title and blocks[]`);
        if (!s.embed?.src || !has(s.embed.src)) fail(`presentation.${l}.json: embed.src not found: ${s.embed?.src}`);
        for (const b of s.blocks) for (const x of b.items || []) if (x.image && !has(x.image)) fail("image not found: " + x.image);
      }
    }
    if (!has("article.uk.json") && !has("presentation.uk.json") && !rd(at + "preview.uk.json").url) fail("needs article.uk.json, presentation.uk.json or a url in preview.uk.json");
    if (!idx.includes(date) && date !== d.date) console.warn(`warning: ${at}: no issue for ${date}, the card is not shown`);
    nArt++;
  }
}
for (const f of ["strikes.json","prices.json","recruit.json","landcost.json","maps/maps.json","maps/strikes-base.json","maps/targets.json"]) rd(f);
for (const d of rd("maps/archive/index.json").dates) if (rd(`maps/archive/${d}.json`).generated !== d) { console.error(`maps/archive/${d}.json: generated != ${d}`); process.exit(1); }
// Research-tool residue must not reach readers ("відхилено проксі (HTTP 400)", "WebFetch", snapshot ids…).
// `assumption` / `unavailable` are working notes the page does not render, so they are skipped.
const RESIDUE = /HTTP [45]\d\d|прокс[іи]\b|\bproxy\b|WebSearch|WebFetch|SITE_BLOCKED|allowed_domains|id знімка|snapshot id/i;
const residue = [];
const walk = (v, f, at) => {
  if (typeof v === "string") { if (RESIDUE.test(v)) residue.push(`${f}${at}: ${v.slice(0, 120)}`); }
  else if (v && typeof v === "object") for (const k in v) if (k !== "assumption" && k !== "unavailable") walk(v[k], f, at + "." + k);
};
const jsonFiles = (dir) => fs.readdirSync(new URL("../public/" + dir, import.meta.url), { recursive: true }).filter((f) => f.endsWith(".json")).map((f) => dir + f);
for (const f of ["digest.json", ...jsonFiles("issues/"), ...jsonFiles("articles/"), "strikes.json", "prices.json", "recruit.json", "maps/maps.json"]) walk(rd(f), f, "");
if (residue.length) { console.error("research-tool residue in reader-facing text:\n  " + residue.join("\n  ")); process.exit(1); }
JSON.parse(fs.readFileSync(new URL("../i18n/en.json", import.meta.url), "utf8")); // translation memory must stay valid JSON
console.log("ok:", d.date, idx.length, "issues,", nArt, "articles");
