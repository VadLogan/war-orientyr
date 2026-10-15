// Checks that the data files the page needs parse and the digest schema keys are intact.
import fs from "node:fs";
import { MUST as must } from "./schema.mjs";
const rd = (p) => JSON.parse(fs.readFileSync(new URL("../public/" + p, import.meta.url), "utf8"));
const d = rd("digest.json");
const miss = must.filter((k) => !(k in d));
if (miss.length) { console.error("digest.json missing keys:", miss); process.exit(1); }
const idx = rd("issues/index.json").dates;
if (!idx.includes(d.date)) { console.error("issues/index.json lacks", d.date); process.exit(1); }
for (const f of ["strikes.json","prices.json","recruit.json","landcost.json","maps/maps.json","maps/strikes-base.json","maps/targets.json"]) rd(f);
JSON.parse(fs.readFileSync(new URL("../i18n/en.json", import.meta.url), "utf8")); // translation memory must stay valid JSON
console.log("ok:", d.date, idx.length, "issues");
