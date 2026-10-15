// Pure text/date/number helpers, ported from the legacy app.js (same behaviour, `lang`/`D` passed explicitly).
import type { Digest, Item, Section, TimelineEntry } from "@/types/digest";
import { UI, type Lang } from "./ui";

export function plural(n: number, a: string, b: string, c: string) {
  const m10 = n % 10, m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c;
}

/* ---------- house style: «росія» lowercase without a flag; other countries capitalised with a flag ---------- */
const COUNTRIES: [string, string[]][] = [["🇺🇦", ["Україною", "України", "Україну", "Україна", "Україні", "Україно"]], ["🇩🇪", ["Німеччиною", "Німеччини", "Німеччину", "Німеччино", "Німеччина", "Німеччині"]], ["🇲🇩", ["Молдовою", "Молдову", "Молдові", "Молдово", "Молдови", "Молдова"]], ["🇺🇸", ["США"]], ["🇬🇧", ["Великою Британією", "Великій Британії", "Великої Британії", "Велику Британію", "Велика Британія", "Британією", "Британія", "Британії", "Британію"]], ["🇨🇳", ["Китаєм", "Китаю", "Китаї", "Китай", "КНР"]], ["🇦🇪", ["ОАЕ"]], ["🇫🇷", ["Францією", "Францію", "Франції", "Франція"]], ["🇵🇱", ["Польщою", "Польщі", "Польщу", "Польщо", "Польща", "Польщи"]], ["🇧🇾", ["Білоруссю", "Білорусі", "Білорусь"]], ["🇹🇷", ["Туреччиною", "Туреччина", "Туреччино", "Туреччину", "Туреччини", "Туреччині"]], ["🇮🇳", ["Індією", "Індії", "Індія", "Індію"]], ["🇮🇷", ["Іраном", "Ірані", "Ірану", "Іран"]], ["🇰🇵", ["Північною Кореєю", "Північній Кореї", "Північної Кореї", "Північну Корею", "Північна Корея", "КНДР"]], ["🇯🇵", ["Японією", "Японія", "Японію", "Японії"]], ["🇮🇹", ["Італією", "Італії", "Італію", "Італія"]], ["🇨🇦", ["Канадою", "Канаді", "Канадо", "Канади", "Канада", "Канаду"]], ["🇳🇴", ["Норвегією", "Норвегію", "Норвегія", "Норвегії"]], ["🇸🇪", ["Швецією", "Швеція", "Швецію", "Швеції"]], ["🇫🇮", ["Фінляндією", "Фінляндія", "Фінляндію", "Фінляндії"]], ["🇳🇱", ["Нідерландів", "Нідерландах", "Нідерландам", "Нідерланди"]], ["🇩🇰", ["Данією", "Данії", "Данія", "Данію"]], ["🇱🇹", ["Литвою", "Литво", "Литва", "Литві", "Литви", "Литву"]], ["🇱🇻", ["Латвією", "Латвії", "Латвія", "Латвію"]], ["🇪🇪", ["Естонією", "Естонії", "Естонію", "Естонія"]], ["🇷🇴", ["Румунією", "Румунії", "Румунію", "Румунія"]], ["🇭🇺", ["Угорщиною", "Угорщині", "Угорщину", "Угорщина", "Угорщино", "Угорщини"]], ["🇸🇰", ["Словаччиною", "Словаччина", "Словаччину", "Словаччино", "Словаччині", "Словаччини"]], ["🇨🇿", ["Чехією", "Чехію", "Чехія", "Чехії"]], ["🇬🇪", ["Грузією", "Грузію", "Грузія", "Грузії"]], ["🇮🇱", ["Ізраїлем", "Ізраїлі", "Ізраїль", "Ізраїлю"]], ["🇸🇦", ["Саудівської Аравії", "Саудівській Аравії", "Саудівська Аравія", "Саудівську Аравію"]], ["🇶🇦", ["Катаром", "Катарі", "Катару", "Катар"]], ["🇨🇭", ["Швейцарією", "Швейцарію", "Швейцарія", "Швейцарії"]], ["🇦🇹", ["Австрією", "Австрії", "Австрія", "Австрію"]], ["🇪🇸", ["Іспанією", "Іспанію", "Іспанії", "Іспанія"]], ["🇧🇪", ["Бельгією", "Бельгія", "Бельгії", "Бельгію"]], ["🇪🇺", ["Євросоюзом", "Євросоюзі", "Євросоюзу", "Євросоюз", "ЄС"]]];
const L_='(?<![\\p{L}\\p{M}\\-])',R_='(?![\\p{L}\\p{M}])';
const NOFLAG='(?<![\\u{1F1E6}-\\u{1F1FF}\\u{1F3F4}][\\uFE0F\\u200D]*\\s?)';
const CRX: [string, RegExp][] = COUNTRIES.map(([f,forms])=>[f,new RegExp(NOFLAG+L_+'('+forms.join('|')+')'+R_,'gu')]);
const RU: [RegExp, (m: string, o: number, str: string) => string][] = [[new RegExp(L_+'(Росі(?:я|ї|ю|єю))'+R_,'gu'),m=>m.toLowerCase()],[new RegExp(L_+'(Російськ\\p{L}*)','gu'),m=>m.toLowerCase()],
  [new RegExp(L_+'РФ'+R_,'gu'),()=>'рф'],[new RegExp(L_+'(Федераці\\p{L}*)','gu'),(m,o,str)=>/росій\p{L}*\s$/u.test(str.slice(Math.max(0,o-12),o))?m.toLowerCase():m]];
export function houseStyle<T>(str: T): T {
  if (typeof str !== "string") return str;
  let s: string = str;
  RU.forEach(([re, fn]) => { s = s.replace(re, (m: string, ...a: any[]) => { const o = a[a.length - 2], whole = a[a.length - 1]; return fn(m, typeof o === "number" ? o : 0, whole); }); });
  CRX.forEach(([f, re]) => { let done = s.includes(f); s = s.replace(re, (m) => { if (done) return m; done = true; return f + " " + m; }); });
  return s as T;
}
export function styleData(o: any, key: string): any {
  if (typeof o === "string") return key === "url" || key === "en" ? o : houseStyle(o);
  if (Array.isArray(o)) return o.map((v) => styleData(v, key));
  if (o && typeof o === "object") { const r: any = {}; for (const k in o) r[k] = styleData(o[k], k); return r; }
  return o;
}

export const loc = (lang: Lang) => (lang === "en" ? "en-GB" : "uk-UA");
export const fmt = (n: number, lang: Lang) => Number(n).toLocaleString(loc(lang)).replace(/\s/g, ' ');
export const noFlag = (x: string) => String(x).replace(/[\u{1F1E6}-\u{1F1FF}]{2}[️  ]?/gu, "").trim();

const DIP_RX: Record<string, RegExp> = {dip:/переговор|negotiat|зустріч|meeting|візит|visit|саміт|summit|перемир|ceasefire|мирн|peace|розмов|talks?\b|вступ|accession|кластер|посл[аио]|дипломат|угод|deal|гаранті|guarantee/i,
  sanc:/санкц|sanction|ембарго|embargo|тіньов\S* флот|shadow fleet|заборон\S*.{0,40}віз|visa ban|стел\S* цін|price cap|заморожен|frozen assets|блокуван\S*.{0,40}(нафт|закуп)|OFAC|ліценз/i,
  aid:/допомог|\baid\b|військов\S* пакет|пакет\S* (допомог|на \$|на €)|[$€]\s?[\d,.]+\s?(млн|млрд|bn|m\b)|млрд (доларів|євро)|Patriot|ППО|F-16|боєприпас|постачанн\S* зброї|продаж\S* зброї|PURL|перехоплювач|відбудов|кредит|грант|loan|grant|репарац|reparation/i};
type Topic = "dip" | "sanc" | "aid";
export function itemTopics(i: Item): string[] {
  if (Array.isArray(i.topics) && i.topics.length) return i.topics;
  const t = (i.text || "") + " " + (i.list || []).join(" ");
  const r = (["dip", "sanc", "aid"] as Topic[]).filter((k) => DIP_RX[k].test(t));
  return r.length ? r : ["dip"];
}
function diploTitle(s: Section, lang: Lang) {
  const has = new Set<string>();
  (s.items || []).forEach((i) => itemTopics(i).forEach((k) => has.add(k)));
  const en = lang === "en";
  const W: Record<string, string> = en ? { dip: "diplomacy", sanc: "sanctions", aid: "aid" } : { dip: "дипломатія", sanc: "санкції", aid: "допомога" };
  const ws = ["dip", "sanc", "aid"].filter((k) => has.has(k)).map((k) => W[k]);
  if (!ws.length) return null;
  const j = ws.length === 1 ? ws[0] : ws.slice(0, -1).join(", ") + (en ? " & " : " та ") + ws[ws.length - 1];
  return j[0].toUpperCase() + j.slice(1);
}
export const secTitle = (s: Section, lang: Lang) =>
  (s.id === "diplo" && diploTitle(s, lang)) || (lang === "en" && (UI.en.sec as Record<string, string>)[s.id]) || s.title;

function elapsed(fromIso: string, toIso: string) {
  const f = new Date(fromIso + "T00:00:00Z"), t = new Date(toIso + "T00:00:00Z");
  const add = (n: number) => { const y = f.getUTCFullYear(), m = f.getUTCMonth() + n; const dim = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); return new Date(Date.UTC(y, m, Math.min(f.getUTCDate(), dim))); };
  let n = (t.getUTCFullYear() - f.getUTCFullYear()) * 12 + t.getUTCMonth() - f.getUTCMonth();
  while (n > 0 && add(n) > t) n--;
  const d = Math.round((+t - +add(n)) / 864e5), y = Math.floor(n / 12), mo = n % 12;
  return { y, mo, d, day: Math.round((+t - +f) / 864e5) + 1 };
}
function spanText(e: ReturnType<typeof elapsed>, L: Lang) {
  const p: string[] = [];
  if (L === "en") {
    if (e.y) p.push(e.y + (e.y === 1 ? " year" : " years"));
    if (e.mo) p.push(e.mo + (e.mo === 1 ? " month" : " months"));
    if (e.d || !p.length) p.push(e.d + (e.d === 1 ? " day" : " days"));
  } else {
    if (e.y) p.push(e.y + " " + plural(e.y, "рік", "роки", "років"));
    if (e.mo) p.push(e.mo + " " + plural(e.mo, "місяць", "місяці", "місяців"));
    if (e.d || !p.length) p.push(e.d + " " + plural(e.d, "день", "дні", "днів"));
  }
  return p.join(" ");
}
const SINCE_EN: Record<string, string> = { "2014-04-14": "Since the ATO began", "2022-02-24": "Since the full-scale invasion" };
export function sinceList(D: Digest, L: Lang) {
  return (D.since || []).map((x) => {
    const e = elapsed(x.from, D.date);
    return { label: L === "en" ? SINCE_EN[x.from] || x.label : x.label, fd: x.from.split("-").reverse().join("."), span: spanText(e, L), day: e.day, note: x.note };
  });
}
const WD_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function dateTitle(D: Digest, lang: Lang) {
  if (lang === "en") {
    const d = new Date(D.date + "T12:00:00Z");
    const s = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    return { line: WD_EN[d.getUTCDay()] + ", " + s, h: "State of the war, " + s };
  }
  return { line: D.weekday + ", " + D.dateLabel, h: "Стан війни на " + D.dateLabel };
}
export const dayLabel = (n: number, lang: Lang) => (lang === "en" ? "day " + fmt(n, lang) : fmt(n, lang) + "-й день");
export const longDate = (iso: string, lang: Lang) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString(loc(lang), { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).replace(/\s?р\.$/, "");
export const midDate = (iso: string, lang: Lang) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString(loc(lang), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).replace(/\s?р\.$/, "");

/* ---------- dates & numbers shared by the dashboard ---------- */
export const dayN = (iso: string) => Math.round(Date.parse(iso + "T00:00:00Z") / 864e5);
export const nDay = (n: number) => new Date(n * 864e5).toISOString().slice(0, 10);
export const shortD = (iso: string) => { const [, m, d] = iso.split("-"); return +d + "." + m; };
export const num = (v: unknown): number | null => (typeof v === "number" && isFinite(v) ? v : null);
export function niceMax(v: number) {
  const st = Math.max(1, v / 4);
  const e = Math.pow(10, Math.floor(Math.log10(st))), f = st / e;
  return Math.max(1, (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e) * 4;
}
/** Timeline of the latest issue (falls back to the older airDefenseHistory format). */
export function TL(B: Pick<Digest, "timeline" | "airDefenseHistory">): TimelineEntry[] {
  const a: TimelineEntry[] = B.timeline || (B.airDefenseHistory || []).map((h) => ({
    date: h.date, night: (h.label || "").replace(/^ніч\s*/, ""), launched: h.launched, intercepted: h.intercepted, src: { air: h.source || "" },
  }));
  return a.filter((e) => e && /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((x, y) => (x.date < y.date ? -1 : 1));
}
