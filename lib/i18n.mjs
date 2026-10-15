// Text vs data: a data file in public/ is shared by both languages; English is only text — a map
// { "<Ukrainian string as it appears in the data>": "<English>" } (i18n/en.json, or the per-file subset in public/i18n/en/).
// Plain JS so scripts/i18n.mjs (node) and the app (lib/data.ts, components/dash/hooks.ts) use the same rules.

/** Keys whose strings are not text to translate: links, and fields that already come in both languages. */
const SKIP = new Set(["url", "en", "uk"]);
/** Objects whose keys are display text (front direction names in timelines). */
const KEYED = new Set(["directions"]);
const CYR = /[а-яіїєґ]/i;
const isText = (s, key) => typeof s === "string" && !SKIP.has(key) && CYR.test(s);

/** Every translatable string of a data file. @param {any} o @returns {string[]} */
export function texts(o, key = "", acc = []) {
  if (isText(o, key)) acc.push(o);
  else if (Array.isArray(o)) o.forEach((v) => texts(v, key, acc));
  else if (o && typeof o === "object") for (const k in o) { if (KEYED.has(key) && CYR.test(k)) acc.push(k); texts(o[k], k, acc); }
  return acc;
}

/** The same data with its text replaced from `tm`, or null when some string has no translation. @param {any} o @param {Record<string,string>} tm @returns {any} */
export function translate(o, tm) {
  if (texts(o).some((s) => !tm[s])) return null;
  const tr = (v, key) => {
    if (isText(v, key)) return tm[v];
    if (Array.isArray(v)) return v.map((x) => tr(x, key));
    if (v && typeof v === "object") { const r = {}; for (const k in v) r[KEYED.has(key) && CYR.test(k) ? tm[k] : k] = tr(v[k], k); return r; }
    return v;
  };
  return tr(o, "");
}
