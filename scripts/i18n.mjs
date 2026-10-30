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
//   node scripts/i18n.mjs build     → regenerates public/i18n/{en,de}/** (runs before `dev` and `build`)
//
//   German (i18n/de.json, i18n/missing.de.json): `missing de` / `merge de` — the current issue (digest.json) and the files the
//   dashboard fetches (strikes, maps, prices…), not the archived issues. A German digest page without full German text shows
//   the English page instead; a dashboard file without full German text is shown in English. `build` writes both languages.
//
// Translate the raw strings: house style (lowercase "russia", country flags) is applied at render time.
// Not translated: `url`, and `en` / `uk` fields (already in both languages). Rules: lib/i18n.mjs.
import fs from "node:fs";
import path from "node:path";
import { texts } from "../lib/i18n.mjs";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const PUB = path.join(ROOT, "public"), OUT = path.join(PUB, "i18n");
const LANG = process.argv[3] || "en";
const TM_FILE = path.join(ROOT, `i18n/${LANG}.json`), MISSING = path.join(ROOT, LANG === "en" ? "i18n/missing.json" : `i18n/missing.${LANG}.json`);

const readJson = (f, dflt) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : dflt);
const writeJson = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 1) + "\n"); };

/** Data files, newest first: digest.json, issues (descending), then the rest. */
function dataFiles() {
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (p !== OUT && p !== path.join(PUB, "articles")) walk(p); } // articles carry their own .en.json
    else if (e.name.endsWith(".json") && e.name !== "index.json") out.push(path.relative(PUB, p));
  });
  walk(PUB);
  const rank = (f) => (f === "digest.json" ? "0" : f.startsWith("issues/") ? "1" + (9e9 - Date.parse(f.slice(7, 17))) : "2" + f);
  return out.sort((a, b) => (rank(a) < rank(b) ? -1 : 1));
}
const isIssue = (f) => f === "digest.json" || f.startsWith("issues/");

const cmd = process.argv[2];
const tm = readJson(TM_FILE, {});
const filesOf = (lang) => (lang === "en" ? dataFiles() : dataFiles().filter((f) => f === "digest.json" || !isIssue(f)));
const files = filesOf(LANG);

if (cmd === "missing") {
  const miss = {};
  for (const f of files) for (const s of texts(readJson(path.join(PUB, f)))) if (!tm[s] && !(s in miss)) miss[s] = "";
  writeJson(MISSING, miss);
  console.log(`${Object.keys(miss).length} untranslated strings → ${path.relative(ROOT, MISSING)}`);
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
  for (const [lang, name, suffix] of [["en", "English", ""], ["de", "German", ":de"]]) {
    const tl = readJson(path.join(ROOT, `i18n/${lang}.json`), {}), fl = filesOf(lang), partial = [];
    for (const f of fl) {
      const ss = [...new Set(texts(readJson(path.join(PUB, f))))], left = ss.filter((s) => !tl[s]).length;
      if (left) { partial.push(`${f} (${left})`); continue; }
      if (!isIssue(f)) writeJson(path.join(OUT, lang, f), Object.fromEntries(ss.map((s) => [s, tl[s]])));
    }
    console.log(`i18n: ${fl.length - partial.length}/${fl.length} files in ${name}` + (partial.length ? `; untranslated strings in ${partial.join(", ")} — run \`npm run i18n:missing${suffix}\`` : ""));
  }
} else {
  console.error("usage: node scripts/i18n.mjs missing|merge [de] | build");
  process.exit(1);
}
