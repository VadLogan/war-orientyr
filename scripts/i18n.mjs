// English content for the data in public/ — a translation memory plus generated mirror files.
//
//   i18n/en.json        translation memory: { "<Ukrainian string as it appears in the data>": "<English>" }
//   public/en/**.json   generated mirrors (gitignored): same structure as public/**.json with strings translated.
//                       A mirror is written only when every string of that file is translated; otherwise the
//                       English site falls back to the Ukrainian file and shows the "written in Ukrainian" note.
//
//   node scripts/i18n.mjs missing   → i18n/missing.json: { "<uk>": "" } for every untranslated string (newest data first)
//   node scripts/i18n.mjs merge     → moves filled-in entries of i18n/missing.json into i18n/en.json
//   node scripts/i18n.mjs build     → regenerates public/en/** (runs before `dev` and `build`)
//
// Translate the raw strings: house style (lowercase "russia", country flags) is applied at render time.
// Not translated: `url`, quote/coverage `en` (already English) and `uk` (shown only on the Ukrainian site).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const PUB = path.join(ROOT, "public"), OUT = path.join(PUB, "en");
const TM_FILE = path.join(ROOT, "i18n/en.json"), MISSING = path.join(ROOT, "i18n/missing.json");
const SKIP = new Set(["url", "en", "uk"]);
const KEYED = new Set(["directions"]); // objects whose keys are display text (front direction names)
const CYR = /[а-яіїєґ]/i;

const readJson = (f, dflt) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : dflt);
const writeJson = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 1) + "\n"); };

/** Data files, newest first: digest.json, issues (descending), then the rest. */
function dataFiles() {
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (p !== OUT) walk(p); }
    else if (e.name.endsWith(".json") && e.name !== "index.json") out.push(path.relative(PUB, p));
  });
  walk(PUB);
  const rank = (f) => (f === "digest.json" ? "0" : f.startsWith("issues/") ? "1" + (9e9 - Date.parse(f.slice(7, 17))) : "2" + f);
  return out.sort((a, b) => (rank(a) < rank(b) ? -1 : 1));
}

const needs = (s, key) => typeof s === "string" && !SKIP.has(key) && CYR.test(s);
function strings(o, key = "", acc = []) {
  if (needs(o, key)) acc.push(o);
  else if (Array.isArray(o)) o.forEach((v) => strings(v, key, acc));
  else if (o && typeof o === "object") for (const k in o) { if (KEYED.has(key) && CYR.test(k)) acc.push(k); strings(o[k], k, acc); }
  return acc;
}
function translate(o, tm, key = "") {
  if (needs(o, key)) return tm[o];
  if (Array.isArray(o)) return o.map((v) => translate(v, tm, key));
  if (o && typeof o === "object") {
    const r = {};
    for (const k in o) r[KEYED.has(key) && CYR.test(k) ? tm[k] : k] = translate(o[k], tm, k);
    return r;
  }
  return o;
}

const cmd = process.argv[2];
const tm = readJson(TM_FILE, {});
const files = dataFiles();

if (cmd === "missing") {
  const miss = {};
  for (const f of files) for (const s of strings(readJson(path.join(PUB, f)))) if (!tm[s] && !(s in miss)) miss[s] = "";
  writeJson(MISSING, miss);
  console.log(`${Object.keys(miss).length} untranslated strings → i18n/missing.json`);
} else if (cmd === "merge") {
  const miss = readJson(MISSING, {});
  let n = 0;
  for (const [uk, en] of Object.entries(miss)) if (typeof en === "string" && en.trim()) { tm[uk] = en; delete miss[uk]; n++; }
  writeJson(TM_FILE, tm);
  writeJson(MISSING, miss);
  console.log(`merged ${n}; ${Object.keys(miss).length} still missing`);
} else if (cmd === "build") {
  fs.rmSync(OUT, { recursive: true, force: true });
  const partial = [];
  for (const f of files) {
    const data = readJson(path.join(PUB, f));
    const left = strings(data).filter((s) => !tm[s]).length;
    if (left) partial.push(`${f} (${left})`);
    else writeJson(path.join(OUT, f), translate(data, tm));
  }
  console.log(`i18n: ${files.length - partial.length}/${files.length} files in English` + (partial.length ? `; untranslated strings in ${partial.join(", ")} — run \`npm run i18n:missing\`` : ""));
} else {
  console.error("usage: node scripts/i18n.mjs missing|merge|build");
  process.exit(1);
}
