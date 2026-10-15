// English text for the data in public/. Data files are shared by both languages; English is only text.
//
//   i18n/en.json                   translation memory (committed): { "<Ukrainian string as it appears in the data>": "<English>" }
//   public/i18n/en/<data file>     generated (gitignored): the subset of en.json that one data file uses — written for the
//                                  files the dashboard fetches in the browser (strikes, maps, prices…), and only when every
//                                  string of that file is translated. Digest pages are translated on the server from en.json.
//   Anything not fully translated is shown in Ukrainian (digest pages add the "written in Ukrainian" note).
//
//   node scripts/i18n.mjs missing   → i18n/missing.json: { "<uk>": "" } for every untranslated string (newest data first)
//   node scripts/i18n.mjs merge     → moves filled-in entries of i18n/missing.json into i18n/en.json
//   node scripts/i18n.mjs build     → regenerates public/i18n/** (runs before `dev` and `build`)
//
// Translate the raw strings: house style (lowercase "russia", country flags) is applied at render time.
// Not translated: `url`, and `en` / `uk` fields (already in both languages). Rules: lib/i18n.mjs.
import fs from "node:fs";
import path from "node:path";
import { texts } from "../lib/i18n.mjs";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const PUB = path.join(ROOT, "public"), OUT = path.join(PUB, "i18n");
const TM_FILE = path.join(ROOT, "i18n/en.json"), MISSING = path.join(ROOT, "i18n/missing.json");

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
const isIssue = (f) => f === "digest.json" || f.startsWith("issues/");

const cmd = process.argv[2];
const tm = readJson(TM_FILE, {});
const files = dataFiles();

if (cmd === "missing") {
  const miss = {};
  for (const f of files) for (const s of texts(readJson(path.join(PUB, f)))) if (!tm[s] && !(s in miss)) miss[s] = "";
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
  fs.rmSync(path.join(PUB, "en"), { recursive: true, force: true }); // old full-copy mirrors, no longer used
  const partial = [];
  for (const f of files) {
    const ss = [...new Set(texts(readJson(path.join(PUB, f))))], left = ss.filter((s) => !tm[s]).length;
    if (left) { partial.push(`${f} (${left})`); continue; }
    if (!isIssue(f)) writeJson(path.join(OUT, "en", f), Object.fromEntries(ss.map((s) => [s, tm[s]])));
  }
  console.log(`i18n: ${files.length - partial.length}/${files.length} files in English` + (partial.length ? `; untranslated strings in ${partial.join(", ")} — run \`npm run i18n:missing\`` : ""));
} else {
  console.error("usage: node scripts/i18n.mjs missing|merge|build");
  process.exit(1);
}
