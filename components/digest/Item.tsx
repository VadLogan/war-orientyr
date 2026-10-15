// Server component: one digest item.
import { Fragment } from "react";
import type { Fire, Item as ItemT, Source } from "@/types/digest";
import { fmt, plural } from "@/lib/text";
import { fireIco, liIco, personIcons } from "@/lib/icons";
import { distLabel, type Strikes } from "@/lib/strikes";
import type { Lang, UIStrings } from "@/lib/ui";

/** Render context passed down from the page instead of a client context. */
export type RC = { lang: Lang; t: UIStrings };

export const LOCK: Record<string, string> = { confirms: "ok", partial: "part", silent: "ru", denies: "unv" };
const Svg = ({ html, cls = "li-ico" }: { html: string; cls?: string }) => <span className={cls} dangerouslySetInnerHTML={{ __html: html }} />;

export function fireLabel(k: keyof Fire, n: number, f: Fire, lang: Lang) {
  if (lang === "en")
    return { air: "airstrikes", kab: "guided aerial bombs (KAB)", kamikaze: "kamikaze drones",
      shell: "shelling attacks on positions and settlements" + (f.mlrs != null ? `, incl. ${fmt(f.mlrs, lang)} with MLRS` : ""),
      missiles: n === 1 ? "missile strike" : "missile strikes", mlrs: "" }[k];
  return { air: plural(n, "авіаудар", "авіаудари", "авіаударів"), kab: plural(n, "КАБ", "КАБи", "КАБів"),
    kamikaze: plural(n, "дрон-камікадзе", "дрони-камікадзе", "дронів-камікадзе"),
    shell: plural(n, "обстріл", "обстріли", "обстрілів") + " позицій і населених пунктів" + (f.mlrs != null ? `, з них ${fmt(f.mlrs, lang)} — з РСЗВ` : ""),
    missiles: plural(n, "ракетний удар", "ракетні удари", "ракетних ударів"), mlrs: "" }[k];
}

function FireList({ f, lang }: { f: Fire; lang: Lang }) {
  const ks = (["air", "kab", "kamikaze", "shell", "missiles"] as const).filter((k) => f[k] != null);
  if (!ks.length) return null;
  return (
    <ul className="ilist ico fire-list">
      {ks.map((k) => <li className="hasico" key={k}><Svg html={fireIco(k)} /><b>{fmt(f[k]!, lang)}</b> {fireLabel(k, f[k]!, f, lang)}</li>)}
    </ul>
  );
}

function Local({ l, t }: { l: ItemT["local"]; t: UIStrings }) {
  if (!l || !l.verdict) return null;
  return (
    <p style={{ margin: 0, fontFamily: "var(--ui)", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)" }}>
      <span className={"chip " + (LOCK[l.verdict] || "ru")}>{t.loc[l.verdict] || l.verdict}</span>
      {t.loc.label}{l.who ? " (" + l.who + (l.when ? ", " + l.when : "") + ")" : ""}: {l.said || ""}
    </p>
  );
}

function Dist({ id, strikes, lang, t }: RC & { id?: string; strikes: Strikes | null }) {
  if (!id || !strikes) return null;
  const x = (strikes.stk.items || []).find((y) => y.id === id);
  if (!x) return null;
  const l = distLabel(strikes.base, x, lang);
  return l ? <span className="chip ru" title={t.stk.distNote(strikes.base.ctrlAsOf || "")}>📏 {l}{x.approx ? " ≈" : ""}</span> : null;
}

export default function Item({ i, lang, t, strikes }: RC & { i: ItemT; strikes: Strikes | null }) {
  const ico = Array.isArray(i.list) && i.list.some((x) => liIco(x));
  return (
    <div className="item" id={i.id ? "it-" + i.id : undefined}>
      <p>
        {personIcons(i).map((src) => <img key={src} className="pico" src={src} alt="" width={24} height={24} />)}
        {i.emoji && <span className="emo" aria-hidden="true">{i.emoji}</span>}
        {i.fun && <span className="chip part">{t.fun}</span>}
        {i.unverified && <span className="chip unv">{t.unv}</span>}
        <Dist id={i.id} strikes={strikes} lang={lang} t={t} />
        {i.text}
      </p>
      {i.fire && <FireList f={i.fire} lang={lang} />}
      {i.listIntro && <p className="li-intro">{i.listIntro}</p>}
      {Array.isArray(i.list) && i.list.length > 0 && (
        <ul className={"ilist" + (ico ? " ico" : "")}>
          {i.list.map((x, k) => { const ic = liIco(x); return <li key={k} className={ic ? "hasico" : undefined}>{ic && <Svg html={ic} />}{x}</li>; })}
        </ul>
      )}
      <Local l={i.local} t={t} />
      {i.quote && <blockquote className="quote"><span className="en">{i.quote.en}</span>{lang !== "en" && <span className="uk">{i.quote.uk}</span>}</blockquote>}
      <span className="cred">{i.source}</span>
      {Array.isArray(i.links) && i.links.length > 0 && (
        <span className="reslinks">{lang === "en" ? "Sources:" : "Джерела:"}{" "}
          {i.links.map((x, k) => <Fragment key={k}>{k > 0 && " · "}<a href={x.url} target="_blank" rel="noopener">{x.title}</a></Fragment>)}
        </span>
      )}
    </div>
  );
}

export function SrcChip({ s, t }: { s: Source; t: UIStrings }) {
  const k = s.status === "unavailable" ? "unv" : s.status === "partial" ? "part" : "ok";
  return <span className={"chip " + k}>{t.st[s.status] || t.st.ok}</span>;
}
