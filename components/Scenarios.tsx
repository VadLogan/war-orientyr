"use client";
// Article block "scenarios": tabs switch one panel — seat bars (House/Senate, majority and two-thirds marks),
// Congress's tools in that scenario and an impact meter per area (-2…2); bars and meters slide between scenarios.
import { useRef, useState, type KeyboardEvent } from "react";
import type { ScenariosBlock } from "@/types/digest";
import type { Lang } from "@/lib/ui";
import { flags } from "./Flag";

const L = {
  uk: { house: "Палата представників", senate: "Сенат", maj: "більшість", two: "дві третини", of: "з", d: "Д", r: "Р", tools: "Що отримує Конгрес", part: "частково" },
  en: { house: "House", senate: "Senate", maj: "majority", two: "two-thirds", of: "of", d: "D", r: "R", tools: "What Congress gets", part: "partly" },
  de: { house: "Repräsentantenhaus", senate: "Senat", maj: "Mehrheit", two: "Zweidrittel", of: "von", d: "D", r: "R", tools: "Was der Kongress bekommt", part: "teilweise" },
  fr: { house: "Chambre des représentants", senate: "Sénat", maj: "majorité", two: "deux tiers", of: "sur", d: "D", r: "R", tools: "Ce qu’obtient le Congrès", part: "en partie" },
};
const CHAMBERS = [{ k: "house", n: 435, maj: 218, two: 290 }, { k: "senate", n: 100, maj: 51, two: 67 }] as const;
const pct = (v: number, n: number) => (v / n) * 100 + "%";

export default function Scenarios({ b, lang }: { b: ScenariosBlock; lang: Lang }) {
  const t = L[lang], def = Math.floor(b.items.length / 2);
  const [i, setI] = useState(def);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = b.items[i], id = "scn-" + b.items.map((x) => x.key).join("");
  const key = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const k = (i + d + b.items.length) % b.items.length;
    setI(k);
    tabs.current[k]?.focus();
  };
  return (
    <figure className="art-scn">
      {b.title && <figcaption><b>{flags(b.title)}</b>{b.hint && <span>{flags(b.hint)}</span>}</figcaption>}
      <div className="scn-tabs" role="tablist" onKeyDown={key}>
        {b.items.map((x, k) => (
          <button key={x.key} ref={(el) => { tabs.current[k] = el; }} type="button" role="tab" id={`${id}-t${k}`} aria-controls={id}
            aria-selected={k === i} tabIndex={k === i ? 0 : -1} className={"scn-" + x.key} onClick={() => setI(k)}>
            <b>{flags(x.label)}</b><small>{flags(x.tag)}</small>
          </button>
        ))}
      </div>
      <div className={"scn-panel scn-" + s.key} role="tabpanel" id={id} aria-labelledby={`${id}-t${i}`}>
        <p className="scn-text">{flags(s.text)}</p>
        <div className="scn-seats">
          {CHAMBERS.map((c) => {
            const d = s.seats[c.k];
            return (
              <div key={c.k} className="seat">
                <div className="seat-h"><span>{t[c.k]}</span><span className="mono"><b className="d">{t.d} {d}</b> · <b className="r">{t.r} {c.n - d}</b></span></div>
                <div className="seat-bar" role="img" aria-label={`${t[c.k]}: ${t.d} ${d} ${t.of} ${c.n}; ${t.maj} ${c.maj}, ${t.two} ${c.two}`}>
                  <i className="d" style={{ width: pct(d, c.n) }} />
                  <u className="maj" style={{ left: pct(c.maj, c.n) }} /><u className="two" style={{ left: pct(c.two, c.n) }} />
                </div>
                <div className="seat-k mono" aria-hidden="true"><span><u className="maj" />{t.maj} {c.maj}</span><span><u className="two" />{t.two} {c.two}</span></div>
              </div>
            );
          })}
          {s.seats.note && <p className="note">{flags(s.seats.note)}</p>}
        </div>
        <div className="scn-grid">
          <div className="scn-pow">
            <h4>{t.tools}</h4>
            <ul>{s.powers.map((p, k) => (
              <li key={k} className={p.on === true ? "on" : p.on ? "part" : "off"}>
                <span aria-hidden="true">{p.on === true ? "✓" : p.on ? "◐" : "✕"}</span>
                <span>{flags(p.text)}{p.on === "part" && <small> · {t.part}</small>}</span>
              </li>
            ))}</ul>
          </div>
          <ul className="scn-imp">
            {b.areas.map((a) => {
              const x = s.impacts.find((y) => y.area === a.id);
              if (!x) return null;
              const w = (Math.abs(x.score) / 2) * 50;
              return (
                <li key={a.id}>
                  <div className="imp-h"><span>{flags(a.label)}</span><b className={x.score > 0 ? "up" : x.score < 0 ? "down" : "flat"}>{b.scores[x.score + 2]}</b></div>
                  <div className="meter" aria-hidden="true"><i className={x.score > 0 ? "up" : "down"} style={{ left: x.score < 0 ? 50 - w + "%" : "50%", width: w + "%" }} /></div>
                  <p><b>{flags(x.title)}</b> {flags(x.text)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {b.note && <p className="note">{flags(b.note)}</p>}
    </figure>
  );
}
