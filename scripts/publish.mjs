// Publish a new issue: archive the current public/digest.json and make the new file the current digest.
//
//   npm run publish -- path/to/new-digest.json [--force]
//
// - newer date:  public/digest.json → public/issues/<its date>.json (copied byte for byte),
//                the new file → public/digest.json, its date added to public/issues/index.json
//                (days of timeline / losses.series that the new file lacks are copied over from the current digest)
// - same date:   replaces today's digest (a correction); nothing is archived
// - any date:    a losses.series day the new file has emptier (ru or ua) keeps the current digest's values
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

// Per-day loss claims are backfilled by hand (russia's MoD publishes after the issue); an export that has a day
// emptier than the current digest must not wipe it. A side (ru/ua) is kept from the current digest, with its
// source note, when the new file has it null or with fewer known values.
const known = (o) => (o ? Object.values(o).filter((v) => v != null).length : 0);
const kept = [];
for (const row of next.losses?.series || []) {
  const old = (cur.losses?.series || []).find((x) => x.date === row.date);
  for (const side of ["ru", "ua"]) {
    if (!old || known(old[side]) <= known(row[side])) continue;
    row[side] = old[side];
    row.src = { ...row.src, [side]: old.src?.[side] };
    kept.push(`${row.date} ${side}`);
  }
}
if (kept.length) console.warn(`kept loss claims the new file had emptier (from the ${cur.date} digest): ${kept.join(", ")}`);

if (next.date === cur.date) {
  fs.writeFileSync(at("digest.json"), kept.length ? JSON.stringify(next, null, 2) : raw);
  console.log(`replaced the ${cur.date} digest (same date, nothing archived)`);
} else {
  const archive = at(`issues/${cur.date}.json`);
  if (fs.existsSync(archive) && fs.readFileSync(archive, "utf8") !== curRaw && !force)
    die(`issues/${cur.date}.json already exists and differs from the current digest; re-run with --force to overwrite it`);
  fs.writeFileSync(archive, curRaw);
  // Day-by-day histories must keep every day of the current digest; the generator has dropped the previous day before.
  const lost = [];
  for (const [name, get] of [["timeline", (d) => d.timeline], ["losses.series", (d) => d.losses?.series]]) {
    const have = new Set((get(next) || []).map((x) => x.date));
    const miss = (get(cur) || []).filter((x) => !have.has(x.date));
    if (!miss.length) continue;
    get(next).push(...miss);
    get(next).sort((a, b) => (a.date < b.date ? -1 : 1));
    lost.push(`${name}: ${miss.map((x) => x.date).join(", ")}`);
  }
  if (lost.length) console.warn(`restored days missing from ${src} (copied from the ${cur.date} digest) — ${lost.join("; ")}`);
  fs.writeFileSync(at("digest.json"), lost.length || kept.length ? JSON.stringify(next, null, 2) : raw);
  const idx = JSON.parse(fs.readFileSync(at("issues/index.json"), "utf8"));
  idx.dates = [...new Set([...(idx.dates || []), cur.date, next.date])].filter((d) => DATE_RX.test(d)).sort();
  fs.writeFileSync(at("issues/index.json"), JSON.stringify(idx));
  console.log(`archived ${cur.date} → issues/${cur.date}.json; ${next.date} is now digest.json (${idx.dates.length} issues)`);
}
console.log("next: npm run validate && npm run i18n:missing (translate, then npm run i18n:merge)");
