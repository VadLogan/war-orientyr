"use client";
// US tile map (one square per state, roughly in place): contested races coloured by poll lead, the other states by who holds
// their two Senate seats now; a click shows that state below.
import { useState } from "react";
import type { ArticleBlock } from "@/types/digest";
import type { Lang } from "@/lib/ui";
import { flags } from "./Flag";

type Donut = Extract<ArticleBlock, { type: "donut" }>;
type Race = NonNullable<Donut["groups"][number]["races"]>[number];

// code → column, row on an 11×8 grid; Senate seats before the 2026 vote (independents who caucus with Democrats = d);
// up: a seat on the 2026 ballot (33 regular + specials in Ohio and Florida); name: uk, en (de = en unless given)
const S: Record<string, { x: number; y: number; s: "dd" | "rr" | "dr"; up?: 1; n: [string, string, string?] }> = {
  AK: { x: 0, y: 0, s: "rr", up: 1, n: ["Аляска", "Alaska"] }, ME: { x: 10, y: 0, s: "dr", up: 1, n: ["Мен", "Maine"] },
  WI: { x: 5, y: 1, s: "dr", n: ["Вісконсин", "Wisconsin"] }, VT: { x: 9, y: 1, s: "dd", n: ["Вермонт", "Vermont"] },
  NH: { x: 10, y: 1, s: "dd", up: 1, n: ["Нью-Гемпшир", "New Hampshire"] },
  WA: { x: 0, y: 2, s: "dd", n: ["Вашингтон", "Washington"] }, ID: { x: 1, y: 2, s: "rr", up: 1, n: ["Айдахо", "Idaho"] },
  MT: { x: 2, y: 2, s: "rr", up: 1, n: ["Монтана", "Montana"] }, ND: { x: 3, y: 2, s: "rr", n: ["Північна Дакота", "North Dakota"] },
  MN: { x: 4, y: 2, s: "dd", up: 1, n: ["Міннесота", "Minnesota"] }, IL: { x: 5, y: 2, s: "dd", up: 1, n: ["Іллінойс", "Illinois"] },
  MI: { x: 6, y: 2, s: "dd", up: 1, n: ["Мічиган", "Michigan"] }, NY: { x: 8, y: 2, s: "dd", n: ["Нью-Йорк", "New York"] },
  MA: { x: 9, y: 2, s: "dd", up: 1, n: ["Массачусетс", "Massachusetts"] },
  OR: { x: 0, y: 3, s: "dd", up: 1, n: ["Орегон", "Oregon"] }, NV: { x: 1, y: 3, s: "dd", n: ["Невада", "Nevada"] },
  WY: { x: 2, y: 3, s: "rr", up: 1, n: ["Вайомінг", "Wyoming"] }, SD: { x: 3, y: 3, s: "rr", up: 1, n: ["Південна Дакота", "South Dakota"] },
  IA: { x: 4, y: 3, s: "rr", up: 1, n: ["Айова", "Iowa"] }, IN: { x: 5, y: 3, s: "rr", n: ["Індіана", "Indiana"] },
  OH: { x: 6, y: 3, s: "rr", up: 1, n: ["Огайо", "Ohio"] }, PA: { x: 7, y: 3, s: "dr", n: ["Пенсильванія", "Pennsylvania"] },
  NJ: { x: 8, y: 3, s: "dd", up: 1, n: ["Нью-Джерсі", "New Jersey"] }, CT: { x: 9, y: 3, s: "dd", n: ["Коннектикут", "Connecticut"] },
  RI: { x: 10, y: 3, s: "dd", up: 1, n: ["Род-Айленд", "Rhode Island"] },
  CA: { x: 0, y: 4, s: "dd", n: ["Каліфорнія", "California", "Kalifornien"] }, UT: { x: 1, y: 4, s: "rr", n: ["Юта", "Utah"] },
  CO: { x: 2, y: 4, s: "dd", up: 1, n: ["Колорадо", "Colorado"] }, NE: { x: 3, y: 4, s: "rr", up: 1, n: ["Небраска", "Nebraska"] },
  MO: { x: 4, y: 4, s: "rr", n: ["Міссурі", "Missouri"] }, KY: { x: 5, y: 4, s: "rr", up: 1, n: ["Кентуккі", "Kentucky"] },
  WV: { x: 6, y: 4, s: "rr", up: 1, n: ["Західна Вірджинія", "West Virginia"] }, VA: { x: 7, y: 4, s: "dd", up: 1, n: ["Вірджинія", "Virginia"] },
  MD: { x: 8, y: 4, s: "dd", n: ["Меріленд", "Maryland"] }, DE: { x: 9, y: 4, s: "dd", up: 1, n: ["Делавер", "Delaware"] },
  AZ: { x: 1, y: 5, s: "dd", n: ["Аризона", "Arizona"] }, NM: { x: 2, y: 5, s: "dd", up: 1, n: ["Нью-Мексико", "New Mexico"] },
  KS: { x: 3, y: 5, s: "rr", up: 1, n: ["Канзас", "Kansas"] }, AR: { x: 4, y: 5, s: "rr", up: 1, n: ["Арканзас", "Arkansas"] },
  TN: { x: 5, y: 5, s: "rr", up: 1, n: ["Теннессі", "Tennessee"] }, NC: { x: 6, y: 5, s: "rr", up: 1, n: ["Північна Кароліна", "North Carolina"] },
  SC: { x: 7, y: 5, s: "rr", up: 1, n: ["Південна Кароліна", "South Carolina"] },
  OK: { x: 3, y: 6, s: "rr", up: 1, n: ["Оклахома", "Oklahoma"] }, LA: { x: 4, y: 6, s: "rr", up: 1, n: ["Луїзіана", "Louisiana"] },
  MS: { x: 5, y: 6, s: "rr", up: 1, n: ["Міссісіпі", "Mississippi"] }, AL: { x: 6, y: 6, s: "rr", up: 1, n: ["Алабама", "Alabama"] },
  GA: { x: 7, y: 6, s: "dd", up: 1, n: ["Джорджія", "Georgia"] },
  HI: { x: 0, y: 7, s: "dd", n: ["Гаваї", "Hawaii"] }, TX: { x: 3, y: 7, s: "rr", up: 1, n: ["Техас", "Texas"] },
  FL: { x: 8, y: 7, s: "rr", up: 1, n: ["Флорида", "Florida"] },
};
/** contested tile: side of the lead, strong from 7 points */
const tone = (lead = 0) => (lead === 0 ? "tu" : (lead > 0 ? "d" : "r") + (Math.abs(lead) >= 7 ? "" : "l"));

export default function StateMap({ races, map, base, lang, locale }: { races: Race[]; map: NonNullable<Donut["map"]>; base: string; lang: Lang; locale: string }) {
  const by = new Map(races.map((r) => [r.code, r]));
  const [sel, setSel] = useState(races[0]?.code ?? "MI");
  const r = by.get(sel), st = S[sel];
  const m = (x: Race) => {
    const l = x.lead ?? 0;
    return l === 0 ? "=" : (l > 0 ? x.cands[0] : x.cands[1]).name.split(/\s+/).at(-1) + " +" + Math.abs(l).toLocaleString(locale);
  };
  const ini = (n: string) => { const w = n.split(/\s+/); return w[0][0] + w.at(-1)![0]; };
  const name = (c: string) => (lang === "uk" ? S[c].n[0] : lang === "de" ? S[c].n[2] ?? S[c].n[1] : S[c].n[1]);
  const seats = (s: string) => ({ dd: map.seats[0], rr: map.seats[1], dr: map.seats[2] })[s]!;
  return (
    <div className="smap">
      <p className="smap-hint">{flags(map.hint)}</p>
      <div className="smap-grid">
        {Object.entries(S).map(([c, s]) => {
          const race = by.get(c), pos = { gridColumn: s.x + 1, gridRow: s.y + 1 }, l = race?.lead ?? 0;
          return (
            <button key={c} type="button" className={"tile " + (race ? tone(race.lead) : "off " + s.s)} style={pos} aria-pressed={sel === c}
              aria-label={`${name(c)}: ${race ? m(race) : seats(s.s)}`} onClick={() => setSel(c)}>
              <b>{c}</b>{race && <small>{l === 0 ? "=" : (l > 0 ? "+" : "−") + Math.abs(l).toLocaleString(locale)}</small>}
            </button>
          );
        })}
      </div>
      <ul className="smap-key">
        {(["d", "dl", "tu", "rl", "r", "off dd", "off rr", "off dr"] as const).map((k, i) => <li key={k}><i className={"tile " + k} />{flags(map.keys[i])}</li>)}
      </ul>
      <div className="smap-card" aria-live="polite">
        <p className="dn-st"><b>{r?.state ?? name(sel)}</b><small>{flags(seats(st.s))}</small>{r && <span className={"mono dn-n " + ((r.lead ?? 0) > 0 ? r.cands[0].party : (r.lead ?? 0) < 0 ? r.cands[1].party : "")}>{m(r)}</span>}</p>
        {r ? <>
          <ul className="dn-cs">{r.cands.map((c, i) => (
            <li key={i}>
              <span className="dn-av">{c.img
                ? <img src={base + c.img} alt="" width={52} height={52} className={c.party} />
                : <span className={c.party} aria-hidden="true">{ini(c.name)}</span>}</span>
              <span className={"dn-n " + c.party}>{flags(c.name)}</span>
            </li>
          ))}</ul>
          <p className="dn-p">{flags(r.poll)}</p>
        </> : <p className="dn-p">{flags(st.up ? map.up : map.notUp)}</p>}
      </div>
    </div>
  );
}

// self-check: seats add up to the Senate before the vote (47 D incl. two independents, 53 R) and 35 seats on the 2026 ballot
if (process.env.NODE_ENV !== "production") {
  const v = Object.values(S), d = v.reduce((n, s) => n + (s.s === "dd" ? 2 : s.s === "dr" ? 1 : 0), 0);
  if (v.length !== 50 || d !== 47 || v.filter((s) => s.up).length !== 35) console.error("StateMap: seat data off", v.length, d);
}
