// Publish a new issue: archive the current public/digest.json and make the new file the current digest.
//
//   npm run publish -- path/to/new-digest.json [--force]
//
// - newer date:  public/digest.json → public/issues/<its date>.json (copied byte for byte),
//                the new file → public/digest.json, its date added to public/issues/index.json
// - same date:   replaces today's digest (a correction); nothing is archived
// - older date:  refused
// An existing, different archive file for the current date is never overwritten without --force.
import fs from "node:fs";
import { MUST, DATE_RX } from "./schema.mjs";

const PUB = new URL("../public/", import.meta.url);
const at = (p) => new URL(p, PUB);
const die = (msg) => { console.error("publish: " + msg); process.exit(1); };

const args = process.argv.slice(2), force = args.includes("--force"), src = args.find((a) => !a.startsWith("--"));
if (!src) die("usage: npm run publish -- <new-digest.json> [--force]");

const raw = fs.readFileSync(src, "utf8");
let next;
try { next = JSON.parse(raw); } catch (e) { die(`${src} is not valid JSON: ${e.message}`); }
const miss = MUST.filter((k) => !(k in next));
if (miss.length) die(`${src} is missing keys: ${miss.join(", ")}`);
if (!DATE_RX.test(next.date)) die(`bad date "${next.date}" (expected YYYY-MM-DD)`);

const curRaw = fs.readFileSync(at("digest.json"), "utf8");
const cur = JSON.parse(curRaw);
if (next.date < cur.date) die(`${next.date} is older than the current digest (${cur.date})`);

if (next.date === cur.date) {
  fs.writeFileSync(at("digest.json"), raw);
  console.log(`replaced the ${cur.date} digest (same date, nothing archived)`);
} else {
  const archive = at(`issues/${cur.date}.json`);
  if (fs.existsSync(archive) && fs.readFileSync(archive, "utf8") !== curRaw && !force)
    die(`issues/${cur.date}.json already exists and differs from the current digest; re-run with --force to overwrite it`);
  fs.writeFileSync(archive, curRaw);
  fs.writeFileSync(at("digest.json"), raw);
  const idx = JSON.parse(fs.readFileSync(at("issues/index.json"), "utf8"));
  idx.dates = [...new Set([...(idx.dates || []), cur.date, next.date])].filter((d) => DATE_RX.test(d)).sort();
  fs.writeFileSync(at("issues/index.json"), JSON.stringify(idx));
  console.log(`archived ${cur.date} → issues/${cur.date}.json; ${next.date} is now digest.json (${idx.dates.length} issues)`);
}
console.log("next: npm run validate && npm run i18n:missing (translate, then npm run i18n:merge)");
