"use client";
// Place search on /maps: a combobox over public/maps/places.json (≈13k settlements, GeoNames — built by
// war-orientyr-scrappers places/places.ts), fetched on the field's first focus. Matches the start of any name or word in
// uk/en/ru/de/fr, apostrophes and ё/е ignored; the file is sorted biggest first, so a city outranks same-named villages.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useApp } from "../ctx";
import { fetchJson } from "./hooks";

export type Place = { s: string; uk: string; en: string; ru?: string; de?: string; fr?: string; o: string; lat: number; lng: number; pop?: number };
export const PLACES = "/maps/places.json";
export const loadPlaces = () => fetchJson<{ places: Place[] }>(PLACES).then((d) => d.places);

// oblasts as places.json names them (uk) → English, used on every non-Ukrainian page
const OBL_EN: Record<string, string> = {
  Донецька: "Donetsk Oblast", Луганська: "Luhansk Oblast", Запорізька: "Zaporizhzhia Oblast", Херсонська: "Kherson Oblast", Харківська: "Kharkiv Oblast",
  Дніпропетровська: "Dnipropetrovsk Oblast", Сумська: "Sumy Oblast", Миколаївська: "Mykolaiv Oblast", Чернігівська: "Chernihiv Oblast", "АР Крим": "Crimea",
  Севастополь: "Sevastopol", Черкаська: "Cherkasy Oblast", Чернівецька: "Chernivtsi Oblast", "Івано-Франківська": "Ivano-Frankivsk Oblast",
  Хмельницька: "Khmelnytskyi Oblast", Кіровоградська: "Kirovohrad Oblast", Київ: "Kyiv", Київська: "Kyiv Oblast", Львівська: "Lviv Oblast", Одеська: "Odesa Oblast",
  Полтавська: "Poltava Oblast", Рівненська: "Rivne Oblast", Тернопільська: "Ternopil Oblast", Вінницька: "Vinnytsia Oblast", Волинська: "Volyn Oblast",
  Закарпатська: "Zakarpattia Oblast", Житомирська: "Zhytomyr Oblast",
};
export const placeName = (p: Place, lang: string) => (lang === "uk" ? p.uk : (lang === "de" && p.de) || (lang === "fr" && p.fr) || p.en);
export const placeObl = (p: Place, lang: string) => (lang === "uk" ? `${p.o} ${p.o === "Київ" || p.o === "Севастополь" || p.o === "АР Крим" ? "" : "обл."}`.trim() : OBL_EN[p.o] ?? p.o);

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/['’ʼ`]/g, "").replace(/\s+/g, " ").trim();
const word = (x: string, s: string) => x.split(/[ -]/).some((w) => w.startsWith(s));
/** Best matches for q, each tier in file order (biggest first): the Ukrainian or English name starting with q, then another
 *  name (russian, German, French — GeoNames' russian is sometimes a former name: Трибухівці = «Дружба»), then a word inside
 *  any name ("терса" → Верхня Терса). */
export function matchPlaces(idx: { p: Place; k: string[] }[], q: string, n = 8): Place[] {
  const s = norm(q);
  if (s.length < 2) return [];
  const t: Place[][] = [[], [], []];
  for (const { p, k } of idx) {
    const i = k[0].startsWith(s) || k[1].startsWith(s) ? 0 : k.some((x) => x.startsWith(s)) ? 1 : k.some((x) => word(x, s)) ? 2 : -1;
    if (i >= 0 && t[i].length < n) t[i].push(p);
    if (t[0].length >= n) break;
  }
  return t.flat().slice(0, n);
}
/** k: uk, en first (matchPlaces' first tier), then the other names. */
export const indexPlaces = (ps: Place[]) => ps.map((p) => ({ p, k: [p.uk, p.en, p.ru ?? "", p.de ?? "", p.fr ?? ""].map(norm) }));
/** The name a result matched by when it isn't the one shown ("також: Дружба"), else null. */
export function viaName(p: Place, lang: string, q: string): string | null {
  const s = norm(q), hit = (x?: string) => !!x && (norm(x).startsWith(s) || word(norm(x), s));
  return hit(placeName(p, lang)) ? null : [p.uk, p.en, p.ru, p.de, p.fr].find(hit) ?? null;
}

/** The field and its list. `km` = distance to the occupied area for the list (null while the map loads). */
export function PlaceSearch({ value, onPick, onClear, km }: { value: Place | null; onPick: (p: Place) => void; onClear: () => void; km: (p: Place) => number | null }) {
  const { t, lang } = useApp(), id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const [idx, setIdx] = useState<ReturnType<typeof indexPlaces> | null>(null);
  const [err, setErr] = useState(false);
  const inp = useRef<HTMLInputElement>(null), box = useRef<HTMLDivElement>(null);
  // phones: the keyboard covers the lower half of the screen. On focus the field scrolls to the top, and the list is no
  // taller than what stays visible under the field (visualViewport = the part of the page the keyboard leaves)
  // instant, not smooth: a smooth scroll is cut off by the list appearing and the keyboard sliding in
  const toTop = () => { if (matchMedia("(pointer:coarse)").matches) box.current?.scrollIntoView({ block: "start" }); };
  const [maxH, setMaxH] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    // the bottom: what the keyboard leaves visible, or the map's own edge (it clips the list) if that comes first
    const fit = () => {
      const r = inp.current?.getBoundingClientRect(), m = box.current?.closest(".map-wrap")?.getBoundingClientRect().bottom ?? Infinity;
      if (r) setMaxH(Math.max(132, Math.min(vv ? vv.offsetTop + vv.height : innerHeight, m) - r.bottom - 12));
    };
    // the keyboard opening shrinks the visual viewport: put the field back at the top, then fit the list
    const kb = () => { toTop(); fit(); };
    fit();
    vv?.addEventListener("resize", kb); vv?.addEventListener("scroll", fit); addEventListener("scroll", fit, { passive: true });
    return () => { vv?.removeEventListener("resize", kb); vv?.removeEventListener("scroll", fit); removeEventListener("scroll", fit); };
  }, [open]);
  const load = () => { if (!idx && !err) loadPlaces().then((ps) => setIdx(indexPlaces(ps)), () => setErr(true)); };
  const res = useMemo(() => (idx ? matchPlaces(idx, q) : []), [idx, q]);
  const pick = (p: Place) => { onPick(p); setQ(""); setOpen(false); inp.current?.blur(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setAct((a) => (res.length ? (a + (e.key === "ArrowDown" ? 1 : res.length - 1)) % res.length : 0)); }
    else if (e.key === "Enter" && res[act]) { e.preventDefault(); pick(res[act]); }
    else if (e.key === "Escape") { setOpen(false); inp.current?.blur(); }
  };
  const showList = open && norm(q).length >= 2;
  const fmtKm = (n: number) => (Math.round(n * 10) / 10).toLocaleString(lang === "uk" ? "uk-UA" : lang) + " " + t.distKm;
  return (
    <div ref={box} className={"mp-q" + (value && !open ? " has" : "")}>
      <svg className="mp-q-ico" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
      <input ref={inp} type="search" role="combobox" aria-label={t.q} aria-expanded={showList} aria-controls={id} aria-autocomplete="list"
        aria-activedescendant={showList && res[act] ? `${id}-${act}` : undefined} autoComplete="off" spellCheck={false}
        placeholder={value && !open ? placeName(value, lang) : t.q} value={q}
        onFocus={() => { load(); setOpen(true); toTop(); setTimeout(toTop, 350); }} onBlur={() => setOpen(false)} onKeyDown={onKey}
        onChange={(e) => { setQ(e.target.value); setAct(0); setOpen(true); }} />
      {value && !q && <button type="button" className="mp-q-x" aria-label={t.art.close} title={t.art.close} onClick={onClear}>×</button>}
      {showList && <ul id={id} role="listbox" aria-label={t.q} className="mp-q-l" style={{ maxHeight: maxH }}>
        {!idx ? <li className="mp-q-m">{err ? t.mErr : t.qLoad}</li> : !res.length ? <li className="mp-q-m">{t.qNone(q.trim())}</li> : res.map((p, i) => {
          const d = km(p), via = viaName(p, lang, q);
          return <li key={p.s} id={`${id}-${i}`} role="option" aria-selected={i === act} onPointerEnter={() => setAct(i)}
            onMouseDown={(e) => { e.preventDefault(); pick(p); }}>
            <i className={"dot" + (d === 0 ? " occ" : "")} aria-hidden="true" />
            <span className="nm"><b>{placeName(p, lang)}</b><small>{via && <>{t.qVia(via)} · </>}{placeObl(p, lang)}</small></span>
            {d != null && <span className="km">{d === 0 ? t.qOcc : fmtKm(d)}</span>}
          </li>;
        })}
        {idx && <li className="mp-q-m src" aria-hidden="true">{t.qSrc}</li>}
      </ul>}
    </div>
  );
}

/** Self-check: `npx tsx components/dash/PlaceSearch.tsx` */
if (typeof process !== "undefined" && process.argv[1]?.endsWith("PlaceSearch.tsx")) {
  const P = (uk: string, en: string, ru?: string): Place => ({ s: en.toLowerCase(), uk, en, ru, o: "Донецька", lat: 48, lng: 37 });
  const ix = indexPlaces([P("Костянтинівка", "Kostiantynivka", "Константиновка"), P("Верхня Терса", "Verkhnia Tersa"), P("Слов'янськ", "Sloviansk", "Славянск"), P("Костянтинопіль", "Kostiantynopil")]);
  const m = (q: string) => matchPlaces(ix, q).map((p) => p.en).join(",");
  console.assert(m("кост") === "Kostiantynivka,Kostiantynopil", "uk prefix, file order: " + m("кост"));
  console.assert(m("Константин") === "Kostiantynivka" && m("kostiantynivka") === "Kostiantynivka", "ru and en");
  console.assert(m("терса") === "Verkhnia Tersa" && m("словянськ") === "Sloviansk", "word inside, apostrophe ignored");
  console.assert(m("к") === "", "one letter: nothing");
  const ix2 = indexPlaces([P("Трибухівці", "Trybukhivtsi", "Дружба"), P("Дружба", "Druzhba")]);
  console.assert(matchPlaces(ix2, "дру").map((p) => p.en).join(",") === "Druzhba,Trybukhivtsi", "own name before an alias");
  console.assert(viaName(ix2[0].p, "uk", "дру") === "Дружба" && viaName(ix2[1].p, "uk", "дру") === null, "alias shown only when matched by it");
  console.log("PlaceSearch ok");
}
