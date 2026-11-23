import type { Lang } from "./ui";

/** Language picker entries. name = endonym, en/uk = English/Ukrainian names, flag only where one country stands for the language. */
export const LANGS: { code: Lang; name: string; en: string; uk: string; short: string; flag?: string }[] = [
  { code: "uk", name: "Українська", en: "Ukrainian", uk: "українська", short: "УКР", flag: "🇺🇦" },
  { code: "en", name: "English", en: "English", uk: "англійська", short: "ENG", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", en: "German", uk: "німецька", short: "DEU", flag: "🇩🇪" },
  { code: "fr", name: "Français", en: "French", uk: "французька", short: "FRA", flag: "🇫🇷" },
];
