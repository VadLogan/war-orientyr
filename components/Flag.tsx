// Inline SVG flags in place of flag emoji: Windows has no flag emoji, and the emoji webfont cost ~760 KB.
// Simplified designs on a 30×20 grid; plain function components, so both server and client components use them.
import type { ReactNode } from "react";

const f2 = (n: number) => +n.toFixed(2);
/** Rectangle; stripes are drawn to the bottom/right edge and overlap, so no seams show between them. */
const R = (c: string, y = 0, h = 20, x = 0, w = 30) => `<path fill="${c}" d="M${f2(x)} ${f2(y)}h${f2(w)}v${f2(h)}h-${f2(w)}z"/>`;
const H = (...c: string[]) => c.map((x, i) => R(x, (20 / c.length) * i, 20 - (20 / c.length) * i)).join("");
const V = (...c: string[]) => c.map((x, i) => R(x, 0, 20, (30 / c.length) * i, 30 - (30 / c.length) * i)).join("");
/** n-pointed star, first point up, turned by `rot` degrees. */
const star = (cx: number, cy: number, r: number, fill = "#fff", rot = 0, n = 5, inner = 0.382) =>
  `<path fill="${fill}" d="M${Array.from({ length: 2 * n }, (_, k) => {
    const a = ((rot - 90 + (k * 180) / n) * Math.PI) / 180, q = k % 2 ? r * inner : r;
    return f2(cx + q * Math.cos(a)) + " " + f2(cy + q * Math.sin(a));
  }).join("L")}z"/>`;
const cross = (cx: number, cy: number) => `<path fill="#f00" d="M${cx - 0.5} ${cy - 2}h1v1.5h1.5v1h-1.5v1.5h-1v-1.5h-1.5v-1h1.5z"/>`;
const toward = (x: number, y: number, tx: number, ty: number) => (Math.atan2(ty - y, tx - x) * 180) / Math.PI + 90;

const FLAGS: Record<string, string> = {
  UA: H("#0057B7", "#FFD700"),
  DE: H("#000", "#D00", "#FFCE00"),
  AT: H("#C8102E", "#fff", "#C8102E"),
  HU: H("#CE2939", "#fff", "#477050"),
  EE: H("#0072CE", "#000", "#fff"),
  LT: H("#FDB913", "#006A44", "#C1272D"),
  LU: H("#EF3340", "#fff", "#00A3E0"),
  NL: H("#AE1C28", "#fff", "#21468B"),
  PL: H("#fff", "#DC143C"),
  LV: R("#9E3039") + R("#fff", 8, 4),
  FR: V("#002395", "#fff", "#ED2939"),
  IT: V("#009246", "#fff", "#CE2B37"),
  BE: V("#000", "#FDDA24", "#EF3340"),
  RO: V("#002B7F", "#FCD116", "#CE1126"),
  MD: V("#0046AE", "#FFD200", "#CC092F") + `<path fill="#B07E2A" d="M13 7h4v4.5l-2 1.5-2-1.5z"/>`,
  IN: H("#FF9933", "#fff", "#138808") + `<circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".6"/><circle cx="15" cy="10" r=".6" fill="#000080"/>`,
  IR: H("#239F40", "#fff", "#DA0000") + `<circle cx="15" cy="10" r="1.8" fill="none" stroke="#DA0000" stroke-width=".7"/>`,
  ES: R("#AA151B") + R("#F1BF00", 5, 10) + `<path fill="#AA151B" d="M7 7.5h3V12a1.5 1.5 0 0 1-3 0z"/>`,
  AE: H("#00732F", "#fff", "#000") + R("#FF0000", 0, 20, 0, 7.5),
  CH: R("#DA291C") + `<path fill="#fff" d="M13.5 4h3v4.5H21v3h-4.5V16h-3v-4.5H9v-3h4.5z"/>`,
  DK: R("#C8102E") + R("#fff", 8.6, 2.8) + R("#fff", 0, 20, 9.7, 2.8),
  SE: R("#006AA7") + R("#FECC02", 8, 4) + R("#FECC02", 0, 20, 9.4, 3.7),
  FI: R("#fff") + R("#002F6C", 7.3, 5.4) + R("#002F6C", 0, 20, 8.3, 5),
  NO: R("#BA0C2F") + R("#fff", 7.5, 5) + R("#fff", 0, 20, 8.2, 5.4) + R("#00205B", 8.75, 2.5) + R("#00205B", 0, 20, 9.55, 2.7),
  GE: R("#fff") + R("#f00", 8.5, 3) + R("#f00", 0, 20, 13.5, 3) + cross(6.75, 4.25) + cross(23.25, 4.25) + cross(6.75, 15.75) + cross(23.25, 15.75),
  CZ: H("#fff", "#D7141A") + `<path fill="#11457E" d="M0 0l15 10L0 20z"/>`,
  US: R("#B22234") + [1, 3, 5, 7, 9, 11].map((i) => R("#fff", (20 / 13) * i, 20 / 13)).join("") + R("#3C3B6E", 0, 140 / 13, 0, 12)
    + [1.4, 4, 6.6, 9.2].flatMap((y) => [1.2, 3.6, 6, 8.4, 10.8].map((x) => `<circle cx="${x}" cy="${y}" r=".45" fill="#fff"/>`)).join(""),
  GB: R("#012169") + `<path stroke="#fff" stroke-width="4" d="M0 0l30 20M30 0L0 20"/><path stroke="#C8102E" stroke-width="1.4" d="M0 0l30 20M30 0L0 20"/>`
    + `<path stroke="#fff" stroke-width="6" d="M15 0v20M0 10h30"/><path stroke="#C8102E" stroke-width="3.4" d="M15 0v20M0 10h30"/>`,
  EU: R("#039") + Array.from({ length: 12 }, (_, k) => star(15 + 6 * Math.cos((k * Math.PI) / 6), 10 + 6 * Math.sin((k * Math.PI) / 6), 0.9, "#FC0")).join(""),
  CA: R("#fff") + R("#D80621", 0, 20, 0, 7.5) + R("#D80621", 0, 20, 22.5, 7.5)
    + `<path fill="#D80621" d="M15 3.5l1.2 2.3 1.4-.6-.5 3.4 2-2.2.4 1.1 2-.4-.7 2.3.9.5-3.3 2.7.3 1.1-3.1-.4.1 3h-1.4l.1-3-3.1.4.3-1.1-3.3-2.7.9-.5-.7-2.3 2 .4.4-1.1 2 2.2-.5-3.4 1.4.6z"/>`,
  JP: R("#fff") + `<circle cx="15" cy="10" r="6" fill="#BC002D"/>`,
  CN: R("#EE1C25") + star(5, 5, 3, "#FF0") + ([[10, 2], [12, 4], [12, 7], [10, 9]] as const).map(([x, y]) => star(x, y, 1, "#FF0", toward(x, y, 5, 5))).join(""),
  KP: R("#024FA2") + R("#fff", 3.4, 13.2) + R("#ED1C27", 4.1, 11.8) + `<circle cx="10" cy="10" r="3.9" fill="#fff"/>` + star(10, 10, 3.7, "#ED1C27"),
  TW: R("#FE0000") + R("#000095", 0, 10, 0, 15) + star(7.5, 5, 3.4, "#fff", 0, 12, 0.6) + `<circle cx="7.5" cy="5" r="1.75" fill="#000095"/><circle cx="7.5" cy="5" r="1.5" fill="#fff"/>`,
  TR: R("#E30A17") + `<circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.25" cy="10" r="4" fill="#E30A17"/>` + star(16.2, 10, 1.9, "#fff", -90),
  IL: R("#fff") + R("#0038B8", 2, 3) + R("#0038B8", 15, 3) + `<path fill="none" stroke="#0038B8" stroke-width=".8" d="M15 5.8l3.6 6.2h-7.2zM15 14.2l3.6-6.2h-7.2z"/>`,
  SA: R("#006C35") + `<path fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" d="M8 6.5c1 1.5 2 0 3 1s2-1.5 3 0 2 1 3-.5 2 0 3 1 1.5-1 2-.5M8.5 9.2h12"/><path stroke="#fff" stroke-width=".9" d="M9 13h12"/>`,
  QA: R("#8A1538") + `<path fill="#fff" d="M0 0h8${Array.from({ length: 9 }, (_, k) => `L11 ${f2((20 / 9) * (k + 0.5))}L8 ${f2((20 / 9) * (k + 1))}`).join("")}H0z"/>`,
  BA: R("#002395") + `<path fill="#FECB00" d="M8 0h14v20z"/>` + Array.from({ length: 9 }, (_, k) => star(8 + 14 * (k / 8) - 1.5, 20 * (k / 8) + 1, 0.9)).join(""),
  ME: R("#D4AF37") + R("#C40308", 1, 18, 1, 28) + `<path fill="#D4AF37" d="M11 6.5l2 1.5 2-2 2 2 2-1.5-1 5-3 2.5-3-2.5z"/>`,
  PT: R("#DA291C") + R("#046A38", 0, 20, 0, 12) + `<circle cx="12" cy="10" r="3.4" fill="none" stroke="#FFE900"/><path fill="#fff" stroke="#DA291C" stroke-width=".6" d="M10.6 8h2.8v2.6a1.4 1.4 0 0 1-2.8 0z"/>`,
  BY: R("#C8313E") + R("#4AA657", 13.3, 6.7) + R("#fff", 0, 20, 0, 3.2) + `<path fill="#C8313E" d="${Array.from({ length: 8 }, (_, k) => `M1.6 ${k * 2.5}l.9 1.25-.9 1.25-.9-1.25z`).join("")}"/>`,
  SK: H("#fff", "#0B4EA2", "#EE1C25") + `<path fill="#EE1C25" stroke="#fff" stroke-width=".5" d="M7 5h6v6c0 2.5-1.5 3.5-3 4.5-1.5-1-3-2-3-4.5z"/>`
    + `<path fill="#fff" d="M9.6 6.5h.8v1.2H12v.8h-1.6v1h1.9v.8h-1.9V13h-.8v-2.7H7.7v-.8h1.9v-1H8v-.8h1.6z"/><path fill="#0B4EA2" d="M7.3 12.3c.9-.9 1.8-.9 2.7 0 .9-.9 1.8-.9 2.7 0-.3 1.5-1.5 2.3-2.7 3-1.2-.7-2.4-1.5-2.7-3z"/>`,
};

/** One flag emoji (a pair of regional indicators) as an inline SVG; a flag not drawn here stays an emoji. */
export function Flag({ e }: { e: string }) {
  const svg = FLAGS[String.fromCharCode(...[...e].map((c) => c.codePointAt(0)! - 0x1f1a5))];
  return svg ? <svg className="flag" viewBox="0 0 30 20" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} /> : <>{e}</>;
}

const RX = /([\u{1F1E6}-\u{1F1FF}]{2})/u;
/** Text with its flag emoji replaced by <Flag>; anything else is returned as is. */
export const flags = (s: ReactNode): ReactNode =>
  typeof s === "string" && RX.test(s) ? s.split(RX).map((p, k) => (k % 2 ? <Flag key={k} e={p} /> : p)) : s;
