// Shape of public/digest.json and public/issues/<date>.json (only the fields the UI reads).
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

export type Digest = {
  /** set by lib/data.ts: the language the text actually is in (English falls back to Ukrainian) */
  contentLang?: "uk" | "en";
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
