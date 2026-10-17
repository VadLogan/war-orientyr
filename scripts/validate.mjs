// Checks that the data files the page needs parse and the digest schema keys are intact.
import fs from "node:fs";
import { MUST as must, DATE_RX } from "./schema.mjs";
const rd = (p) => JSON.parse(fs.readFileSync(new URL("../public/" + p, import.meta.url), "utf8"));
const d = rd("digest.json");
const miss = must.filter((k) => !(k in d));
if (miss.length) { console.error("digest.json missing keys:", miss); process.exit(1); }
const idx = rd("issues/index.json").dates;
if (!idx.includes(d.date)) { console.error("issues/index.json lacks", d.date); process.exit(1); }
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
    }
    if (!has("article.uk.json") && !rd(at + "preview.uk.json").url) fail("needs article.uk.json or a url in preview.uk.json");
    if (!idx.includes(date) && date !== d.date) console.warn(`warning: ${at}: no issue for ${date}, the card is not shown`);
    nArt++;
  }
}
for (const f of ["strikes.json","prices.json","recruit.json","landcost.json","maps/maps.json","maps/strikes-base.json","maps/targets.json"]) rd(f);
JSON.parse(fs.readFileSync(new URL("../i18n/en.json", import.meta.url), "utf8")); // translation memory must stay valid JSON
console.log("ok:", d.date, idx.length, "issues,", nArt, "articles");
