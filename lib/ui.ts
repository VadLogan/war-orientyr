// UI strings of every language, for server code. Client components get only their page's language through
// useT() (components/strings) — importing this module from client code ships all four languages to the browser.
import { UK } from "./ui-uk";
import { EN } from "./ui-en";
import { DE_UI } from "./ui-de";
import { FR_UI } from "./ui-fr";
import type { Section } from "@/types/digest";
import { diploTitle } from "./text";

export const UI = { uk: UK, en: EN, de: DE_UI, fr: FR_UI };

/** Languages that fall back to English (then Ukrainian) where a page or data file has no text in them yet. */
export type SubLang = "de" | "fr";
export const SUBS = ["de", "fr"] as const satisfies readonly SubLang[];
export const isSub = (l: string): l is SubLang => l === "de" || l === "fr";

/** Notice on the English page shown instead of a German/French one that does not exist (yet): the reader's language, then English. */
export const SUB_MISSING: Record<SubLang, { own: string; en: string }> = {
  de: { own: 'Diese Seite gibt es noch nicht auf Deutsch – wir zeigen die englische Fassung. Bitte wählen Sie oben eine andere Sprache.', en: 'This page isn’t available in German yet, so it is shown in English. You can pick another language above.' },
  fr: { own: 'Cette page n’existe pas encore en français – nous affichons la version anglaise. Vous pouvez choisir une autre langue ci-dessus.', en: 'This page isn’t available in French yet, so it is shown in English. You can pick another language above.' },
};

export type Lang = keyof typeof UI;
export type UIStrings = (typeof UI)["uk"];

export { LANGS } from "./langs";


/** A digest section's title in `lang` (server code: it reads every language's strings). */
export const secTitle = (s: Section, lang: Lang) =>
  (s.id === "diplo" && diploTitle(s, lang)) || (lang !== "uk" && (UI[lang].sec as Record<string, string>)[s.id]) || s.title;
