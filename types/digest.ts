// Shape of public/digest.json and public/issues/<date>.json (only the fields the UI reads).
import type { Lang } from "@/lib/ui";
export type Status = "ok" | "partial" | "unavailable";
export type Verdict = "confirms" | "partial" | "silent" | "denies";

export type Fire = { air?: number; kab?: number; kamikaze?: number; shell?: number; missiles?: number; mlrs?: number };

export type Item = {
  id?: string;
  text: string;
  source?: string;
  emoji?: string;
  fun?: boolean;
  unverified?: boolean;
  icon?: false | string | string[];
  topics?: string[];
  fire?: Fire;
  listIntro?: string;
  list?: string[];
  local?: { verdict: Verdict; who?: string; when?: string; said?: string };
  quote?: { en: string; uk: string };
  links?: { url: string; title: string }[];
};

export type Section = { id: string; title: string; items: Item[] };
export type Source = { url: string; title: string; status: Status; kind?: string; note?: string };

export type TimelineEntry = {
  date: string;
  night?: string;
  launched?: number;
  intercepted?: number;
  hitLocations?: number;
  clashes?: number;
  directions?: Record<string, number>;
  fire?: Fire;
  mix?: { type: string; n: number }[];
  missilesUntyped?: number;
  src?: Record<string, string>;
};

export type LossRow = {
  date: string;
  ru?: Record<string, number>;
  ua?: Record<string, number>;
  sbs?: { killed?: number };
  src?: Record<string, string>;
};

/** public/articles/<YYYY-MM-DD>/<name>/preview.<lang>.json — a card on that date's issue. */
export type ArticlePreview = { title: string; lead?: string; button?: string; url?: string; image?: string; imageAlt?: string };
/** Content blocks of an article, in reading order; unknown types are skipped. */
export type ArticleBlock =
  /** `section`: digest section id (`kremlin`…) — an h2 that repeats a digest section title shows that section's icon */
  | { type: "p" | "h2" | "h3"; text: string; kind?: "meta"; section?: string }
  /** `image` is a file in the article folder (e.g. a unit emblem) */
  | { type: "list"; title?: string; ordered?: boolean; items: { title?: string; text: string; image?: string; imageAlt?: string }[] }
  /** `num`: index of a numeric column (right-aligned, mono) */
  | { type: "table"; columns: string[]; rows: string[][]; num?: number }
  /** blocks side by side (stack on a phone) */
  | { type: "cols"; cols: ArticleBlock[][] }
  /** `kind: "col"` = vertical bars. Row: `value` replaces the formatted `n`; `group` starts a labelled group (one scale for all);
   *  `tone` colours the bar (default grey, `highlight` = accent) */
  | { type: "chart"; kind: "bar" | "col"; title?: string; subtitle?: string; unit?: string; note?: string; source?: string;
      rows: { country: string; flag?: string | null; n: number; share?: number; makers?: string; highlight?: boolean;
        value?: string; group?: string; tone?: Tone }[] }
  /** headline figures: a ruled strip, or `kind: "tiles"` */
  | { type: "stats"; kind?: "tiles"; items: { value: string; label?: string; note?: string; tone?: Tone }[] }
  /** editorial estimate box; `**x**` = bold */
  | { type: "estimate"; title?: string; text: string[] }
  /** where sources disagree */
  | { type: "diverge"; title?: string; items: { title: string; text: string }[] }
  /** claim vs fact, side by side */
  | { type: "vs"; a: { label: string; text: string }; b: { label: string; text: string; tone?: Tone } }
  /** "Resources: a, b, c" line under a section */
  | { type: "links"; items: { title: string; url: string }[] }
  /** two-sided margins on one axis (e.g. R+12 … D+30): bar = `b`, ring = earlier `a`; >0 = `right` side */
  | { type: "swing"; title?: string; subtitle?: string; left: Side; right: Side; a?: string; b?: string; note?: string; source?: string;
      rows: { label: string; b: number; a?: number; note?: string; group?: string; highlight?: boolean }[] }
  /** donut of seats in groups (`tone` d|dl|tu|rl|r), `mark` = majority tick; groups' races form the legend.
   *  Candidate `img`: a file in the article folder, else initials */
  /** `map`: races with a postal `code` are drawn on a US tile map (keys: D strong, D lean, tie, R lean, R strong; other states held DD, RR, split — `seats` names them; `up`/`notUp`: their 2026 note) */
  | { type: "donut"; title?: string; subtitle?: string; mark?: number; map?: { hint: string; keys: string[]; seats: [string, string, string]; up: string; notUp: string }; center?: { value: string; label: string }; note?: string; source?: string;
      groups: { label: string; n: number; tone: "d" | "dl" | "tu" | "rl" | "r";
        /** `lead`: poll margin of the first candidate (midpoint of the reported range; <0 = the second leads) — drawn as that race's pie */
        races?: { state: string; code?: string; held: string; poll: string; lead?: number; cands: { name: string; party: "d" | "r" | "i"; img?: string }[] }[] }[] }
  /** clickable scenarios (client island `Scenarios`): seats, Congress's tools and an impact meter per area */
  | ScenariosBlock;
export type Side = { label: string; tag: string };
export type ScenariosBlock = {
  type: "scenarios"; title?: string; hint?: string; note?: string;
  /** impact areas, in order; `scores` label the meter -2…2 */
  areas: { id: string; label: string }[]; scores: [string, string, string, string, string];
  items: {
    key: string; label: string; tag: string; text: string;
    /** Democratic seats in this scenario (House of 435, Senate of 100) */
    seats: { house: number; senate: number; note?: string };
    powers: { text: string; on: boolean | "part" }[];
    impacts: { area: string; score: -2 | -1 | 0 | 1 | 2; title: string; text: string }[];
  }[];
};
export type Tone = "unv" | "accent" | "muted";
/** public/articles/<YYYY-MM-DD>/<name>/article.<lang>.json — the full article at /articles/<date>/<name>. */
export type ArticleBody = {
  title?: string; lead?: string; image?: string | { src: string; alt?: string; caption?: string };
  /** kicker above the title; `toc`: contents rail of the h2 blocks (wide screens) */
  kicker?: string; toc?: boolean;
  /** search/share title (≤60 chars) and description (≤160) when the headline and lead are longer */
  seo?: { title?: string; description?: string };
  blocks: ArticleBlock[]; sources?: { title: string; url: string; note?: string }[];
};
/** public/articles/<YYYY-MM-DD>/<name>/presentation.<lang>.json — an interactive page (`embed.src`, an HTML file in the folder)
 *  shown in a frame, with all its text as server-rendered blocks below it. Takes the place of article.<lang>.json. */
export type PresentationBody = Omit<ArticleBody, "image"> & {
  title: string; kicker?: string; asOf?: string;
  embed: { src: string; title: string; note?: string };
  /** headline figures under the title */
  stats?: { value: string; unit?: string; label: string; tone?: "accent" | "muted" | "ok" }[];
  takeaways?: { title: string; text: string }[];
  /** With phases the frame is a full-viewport map driven by the page (postMessage {phase: i} both ways),
   *  and the page renders the phase buttons, the legend and the phase card. `occupied`: DeepState km² within the map. */
  phases?: PresPhase[];
  phasesTitle?: string; phasesHint?: string; phaseNote?: string;
  legend?: { kind: "ua" | "ua-dash" | "ru" | "ghost" | "lib" | "ctl" | "occ" | "prev" | "gain" | "unknown"; text: string }[];
  /** claimed (phase `area`) vs measured (drop of `occupied` from the first phase) */
  compare?: { title: string; text?: string; a: string; b: string; note?: string };
  placesTitle?: string;
};
export type PresPhase = {
  key: string; date: string; meta?: string; title: string; text: string; moves?: string[];
  ua: string[]; ru: string[]; area: number; sets: number; loss?: number; pow?: number; occupied?: number;
  places?: { name: string; status: "lib" | "ctl" }[];
};
/** As read by lib/data.ts: `href` = the preview's `url` or the article page; `img` = public path of the image. */
export type Article = {
  date: string; name: string; href: string; img?: string; preview: ArticlePreview;
  article: ArticleBody | null; presentation: PresentationBody | null; contentLang: Lang;
};

export type Digest = {
  /** set by lib/data.ts: the language the text actually is in (English falls back to Ukrainian) */
  contentLang?: Lang;
  schema: number;
  date: string;
  weekday: string;
  dateLabel: string;
  lede: string;
  ledeParts?: { label?: string; text: string }[];
  headline?: { kicker?: string; title?: string; text?: string; item?: string };
  since: { label: string; from: string; note?: string }[];
  front?: { clashesTotal?: number; period?: string; source?: string; directions?: { name: string; attacks: number }[] };
  airDefense?: {
    period?: string; launched?: number; intercepted?: number; hitLocations?: number; debrisLocations?: number;
    missiles?: number; mix?: { type: string; n: number }[];
  };
  timeline?: TimelineEntry[];
  airDefenseHistory?: { date: string; label?: string; launched?: number; intercepted?: number; source?: string }[];
  losses?: {
    caveat?: string;
    method?: { ru?: string; ua?: string };
    gsTotal?: { personnel?: number; source?: string; date?: string };
    series?: LossRow[];
  };
  civilianStats?: {
    title?: string; lead?: string; note?: string; url?: string; source?: string;
    months: { m: string; killed: number | null; injured: number | null; note?: string }[];
  };
  sections: Section[];
  divergences: { intro: string; items: { title: string; a: { source: string; claim: string }; b: { source: string; claim: string }; why: string }[] };
  sources: Source[];
  unavailable: string;
  assumption: string;
  footer: string;
};
