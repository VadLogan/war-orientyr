// Section / list / fire icons from the legacy app.js. All markup here is trusted static SVG.
import { itemTopics } from "./text";
import type { Item, Section } from "@/types/digest";

const PEOPLE: [string, RegExp, string][] = [
  ["putin", /путін|putin/i, "/icons/person-putin.webp"],
  ["peskov", /пєсков|песков|peskov/i, "/icons/person-peskov.webp"],
  ["lavrov", /лавров|lavrov/i, "/icons/person-lavrov.webp"],
];
export function personIcons(i: Item): string[] {
  if (i.icon === false) return [];
  const ic = Array.isArray(i.icon) ? i.icon : typeof i.icon === "string" ? [i.icon] : [];
  return PEOPLE.filter((p) => ic.includes(p[0]) || p[1].test(i.text || "")).map((p) => p[2]);
}

const SEC_IMG: Record<string, { src: string; size?: number }> = {
 "react": {
  "src": "/icons/sec-react.svg"
 },
 "victims": {
  "src": "/icons/sec-victims.svg"
 },
 "kremlin": {
  "src": "/icons/sec-kremlin.webp",
  "size": 30
 },
 "trump": {
  "src": "/icons/sec-trump.webp",
  "size": 30
 },
 "deepstrikes": {
  "src": "/icons/sec-deepstrikes.svg",
  "size": 30
 },
 "analysis": {
  "src": "/icons/sec-analysis.svg",
  "size": 30
 },
 "front": {
  "src": "/icons/sec-front.svg",
  "size": 30
 },
 "strikes": {
  "src": "/icons/sec-strikes.svg",
  "size": 30
 }
};
const ICO_P: Record<string, string> = {"front": "<path d=\"M4 4l9.5 9.5M11 16l5-5M14.5 14.5L20 20M20 4l-9.5 9.5M13 16l-5-5M9.5 14.5L4 20\"/>", "strikes": "<path d=\"M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z\"/><path d=\"M9 12l2 2 4-4\"/>", "deepstrikes": "<circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M12 2v4M12 18v4M2 12h4M18 12h4\"/>", "analysis": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"M15.5 15.5L21 21M7.5 12l2-2 1.5 1.5 2.5-2.5\"/>", "diplo": "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M14 3v5h5M9 13h7M9 17h4\"/>", "victims": "<path d=\"M12 3c1.8 2.2 2.5 3.6 2.5 5a2.5 2.5 0 0 1-5 0c0-1.4.7-2.8 2.5-5z\"/><rect x=\"9\" y=\"11\" width=\"6\" height=\"10\" rx=\"1\"/><path d=\"M6 21h12\"/>", "kremlin": "<rect x=\"9\" y=\"3\" width=\"6\" height=\"11\" rx=\"3\"/><path d=\"M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8\"/>", "react": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18\"/>", "sbs": "<circle cx=\"6\" cy=\"6\" r=\"2.5\"/><circle cx=\"18\" cy=\"6\" r=\"2.5\"/><circle cx=\"6\" cy=\"18\" r=\"2.5\"/><circle cx=\"18\" cy=\"18\" r=\"2.5\"/><rect x=\"9.5\" y=\"9.5\" width=\"5\" height=\"5\" rx=\"1\"/><path d=\"M8 8l1.5 1.5M16 8l-1.5 1.5M8 16l1.5-1.5M16 16l-1.5-1.5\"/>", "diverge": "<path d=\"M12 4v16M8 20h8M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z\"/>", "sources": "<path d=\"M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z\"/><path d=\"M4 20a2 2 0 0 0 2 1h13M9 7h6M9 11h6\"/>"};
const SEC_SVG: Record<string, string> = {strikes:'<circle cx="12" cy="12" r="9.5" style="fill:var(--fi-lb);fill-opacity:.18;stroke:var(--fi-lb);stroke-width:1.5"/><circle cx="12" cy="12" r="5.5" style="fill:none;stroke:var(--fi-lb);stroke-width:1.2"/><g class="fi-sweep"><path d="M12 12 L12 2.5 A9.5 9.5 0 0 1 18.1 4.72 Z" style="fill:var(--accent);fill-opacity:.55"/><path d="M12 12 L18.1 4.72" style="stroke:var(--accent);stroke-width:1.5;stroke-linecap:round"/></g><circle cx="12" cy="12" r="1.6" style="fill:var(--accent)"/><circle class="fi-t1" cx="17.4" cy="14" r="1.7" style="fill:var(--m-occ)"/><circle class="fi-t2" cx="7.4" cy="8.6" r="1.5" style="fill:var(--m-occ)"/>',front:'<path d="M3 5 L9 3 L15 5 L21 3 V19 L15 21 L9 19 L3 21 Z" style="fill:var(--surface)"/><path class="fi-red" d="M15 5 L21 3 V19 L15 21 L13.6 17.4 L15.6 13.4 L13.4 9.6 L14.8 6.4 Z" style="fill:var(--m-occ)" fill-opacity=".35"/><path d="M3 5 L9 3 L10.6 5.4 L9.4 9.2 L11.4 12.8 L9.6 16.6 L9 19 L3 21 Z" style="fill:var(--fi-lb)"/><path class="fi-line" d="M9 3 L10.6 5.4 L9.4 9.2 L11.4 12.8 L9.6 16.6 L9 19" style="fill:none;stroke:var(--fi-amb);stroke-width:1.8;stroke-linejoin:round"/><path d="M3 5 L9 3 L15 5 L21 3 V19 L15 21 L9 19 L3 21 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-linejoin:round"/>'};
const DIPLO_SYM: Record<string, string> = {"dip": "<g transform=\"translate(64 66) scale(0.82) translate(-64 -66)\"><g> <path d=\"M-6 74 L32 52 L44 72 L6 94 Z\" fill=\"#2a78d6\"/> <path d=\"M29 54 L36 50 L48 70 L41 74 Z\" fill=\"#8fb6e4\"/> <path d=\"M134 74 L96 52 L84 72 L122 94 Z\" fill=\"#e2b465\"/> <path d=\"M99 54 L92 50 L80 70 L87 74 Z\" fill=\"#f6dfa8\"/> <rect x=\"42\" y=\"56\" width=\"46\" height=\"26\" rx=\"13\" fill=\"#e8eef7\" stroke=\"#0c121b\" stroke-width=\"2.5\"/> <path d=\"M56 81 V72 M64 82 V72 M72 81 V72\" stroke=\"#9aa6b4\" stroke-width=\"3\" stroke-linecap=\"round\"/> <path d=\"M44 66 C46 52 62 48 80 54 C84 56 82 62 76 61 L62 60\" fill=\"#d3dbe5\" stroke=\"#0c121b\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/> </g></g>", "sanc": "<path d=\"M48 62 V48 A16 16 0 0 1 80 48 V62\" fill=\"none\" stroke=\"#8fb6e4\" stroke-width=\"8\"/> <rect x=\"38\" y=\"58\" width=\"52\" height=\"40\" rx=\"7\" fill=\"#e2b465\"/> <circle cx=\"64\" cy=\"74\" r=\"6\" fill=\"#0c121b\"/><rect x=\"61.5\" y=\"76\" width=\"5\" height=\"12\" rx=\"2\" fill=\"#0c121b\"/>", "aid": "<rect x=\"38\" y=\"62\" width=\"52\" height=\"36\" rx=\"3\" fill=\"#c9a46a\"/> <rect x=\"33\" y=\"54\" width=\"62\" height=\"13\" rx=\"3\" fill=\"#e2b465\"/> <rect x=\"59\" y=\"54\" width=\"10\" height=\"44\" fill=\"#2a78d6\"/> <path d=\"M64 46 C58 38 46 40 50 30 C53 23 61 25 64 31 C67 25 75 23 78 30 C82 40 70 38 64 46 Z\" fill=\"#ffd25e\"/>"};

function diploSrc(s: Section) {
  const has = new Set<string>();
  (s.items || []).forEach((i) => itemTopics(i).forEach((k) => has.add(k)));
  const ks = ["dip", "sanc", "aid"].filter((k) => has.has(k));
  if (!ks.length) ks.push("dip");
  const n = ks.length, P = 2.5, D = n * P, f = (x: number) => +(x / D).toFixed(4);
  let body = "";
  if (n === 1) body = DIPLO_SYM[ks[0]];
  else body = ks.map((k, i) => `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;${f(.225)};${f(2.25)};${f(P)};1" dur="${D}s" begin="${i * P}s" repeatCount="indefinite"/>${DIPLO_SYM[k]}</g>`).join("")
    + '<g fill="#8fb6e4">' + ks.map((k, i) => `<circle cx="${64 + (i - (n - 1) / 2) * 12}" cy="112" r="3.2" opacity="0.3"><animate attributeName="opacity" values="1;1;0.3;0.3" keyTimes="0;${f(P)};${f(P + .01)};1" dur="${D}s" begin="${i * P}s" repeatCount="indefinite"/></circle>`).join("") + "</g>";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128"><defs><radialGradient id="bg" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stop-color="#1f2f45"/><stop offset="1" stop-color="#0c121b"/></radialGradient><clipPath id="disc"><circle cx="64" cy="64" r="64"/></clipPath></defs><g clip-path="url(#disc)"><rect width="128" height="128" fill="url(#bg)"/>${body}</g></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/** Section heading icon: an image, a coloured animated SVG, or a stroke SVG. */
export type SecIcon = { cls: string; img?: { src: string; size?: number }; svg?: string };
export function secIcon(id: string, s?: Section): SecIcon | null {
  if (id === "diplo" && s) return { cls: "sec-ico img", img: { src: diploSrc(s), size: 30 } };
  if (SEC_IMG[id]) return { cls: "sec-ico img", img: SEC_IMG[id] };
  if (SEC_SVG[id]) return { cls: "sec-ico col", svg: `<svg viewBox="0 0 24 24" width="22" height="22">${SEC_SVG[id]}</svg>` };
  if (ICO_P[id]) return { cls: "sec-ico", svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICO_P[id]}</svg>` };
  return null;
}

const FIRE_SVG: Record<string, string> = {air:'<path d="M2.5 13.5l8-2V5.5a1.5 1.5 0 0 1 3 0v6l8 2v2l-8-1.5v4l2.5 1.6V21l-4-.9-4 .9v-1.4l2.5-1.6v-4l-8 1.5z"/>',
  kab:'<ellipse cx="10.5" cy="13.5" rx="4" ry="6.5" transform="rotate(-40 10.5 13.5)"/><path d="M14.6 9.4l3.4-3.4M16 4h4v4M15.2 4.8l4 4"/>',
  kamikaze:'<path d="M4 12h16M12 4l2.5 8L12 20 9.5 12z"/><path d="M6 9.5L4 12l2 2.5M18 9.5l2 2.5-2 2.5"/>',
  shell:'<path d="M3 16l14-7M17 9l3-1.5"/><circle cx="10" cy="17.5" r="3"/><path d="M3 20h18"/>',
  missiles:'<path d="M5 19l1-3 9-9a2.8 2.8 0 0 1 4 4l-9 9-3 1zM13 9l2 2M5 19l-1.5 1.5"/>'};
export const fireIco = (k: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${FIRE_SVG[k]}</svg>`;

const LI_ICO: [RegExp, string][] = ([["^особов", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"7.5\" r=\"3.2\"/><path d=\"M5.5 20c.4-4.2 3-6.5 6.5-6.5s6.1 2.3 6.5 6.5z\"/></svg>"], ["^танк", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"14\" width=\"18\" height=\"5\" rx=\"2.5\"/><path d=\"M7 14v-3h8l1.5 3M12 11V8.5h4M16 9.5h5\"/></svg>"], ["^бронемаш|^ббм", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 16v-4l3-3h9l4 3v4z\"/><circle cx=\"7.5\" cy=\"17.5\" r=\"2\"/><circle cx=\"16.5\" cy=\"17.5\" r=\"2\"/><path d=\"M12 9v3\"/></svg>"], ["^артсист|^артилер", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 16l14-7M17 9l3-1.5\"/><circle cx=\"10\" cy=\"17.5\" r=\"3\"/><path d=\"M3 20h18\"/></svg>"], ["^рсзв", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 17l12-9M7 19l12-9M10 21l11-8\"/><path d=\"M3 21h4\"/></svg>"], ["^засоби ппо|^ппо", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 17a8 8 0 0 1 14-5\"/><path d=\"M9 14a4 4 0 0 1 6-3.5M12 14l-3 6M12 14l3 6M7 20h10\"/></svg>"], ["^оперативно-тактичні бпла|^бпла", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"6\" r=\"2.5\"/><circle cx=\"18\" cy=\"6\" r=\"2.5\"/><circle cx=\"6\" cy=\"18\" r=\"2.5\"/><circle cx=\"18\" cy=\"18\" r=\"2.5\"/><rect x=\"9.5\" y=\"9.5\" width=\"5\" height=\"5\" rx=\"1\"/><path d=\"M8 8l1.5 1.5M16 8l-1.5 1.5M8 16l1.5-1.5M16 16l-1.5-1.5\"/></svg>"], ["^автотехн", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 7h11v9H2zM13 10h4l4 3v3h-8z\"/><circle cx=\"6.5\" cy=\"17.5\" r=\"2\"/><circle cx=\"17\" cy=\"17.5\" r=\"2\"/></svg>"], ["^наземні роботизован", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"9\" width=\"14\" height=\"7\" rx=\"1.5\"/><circle cx=\"8.5\" cy=\"19\" r=\"1.7\"/><circle cx=\"15.5\" cy=\"19\" r=\"1.7\"/><path d=\"M12 9V5M10 5h4M9 12.5h.01M15 12.5h.01\"/></svg>"], ["^спецтехн", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14.5 6.5a4 4 0 0 0-5 5L3.5 17.5a1.8 1.8 0 0 0 2.5 2.5l6-6a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z\"/></svg>"], ["^літаки|^гелікоптер|^кораблі|^крилаті", "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21 14.5l-8-3.5V5.5a1.5 1.5 0 0 0-3 0V11l-8 3.5V17l8-1.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-3.5l8 1.5z\"/></svg>"]] as [string, string][]).map(([r, s]) => [new RegExp(r, "i"), s]);
export const liIco = (x: string) => LI_ICO.find((p) => p[0].test(String(x).trim()))?.[1] || "";
