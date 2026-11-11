// Server component: /strikes/targets as plain HTML — every weapon with its range and what it reaches, and every potential
// target with its distance to the front — for search engines and first paint. TargetsMap replaces it once loaded.
import { getMaps, getStrikes } from "@/lib/data";
import { stkDist } from "@/lib/strikes";
import { fmt, houseStyle } from "@/lib/text";
import { UI, type UIStrings } from "@/lib/ui";
import { reaching, WEAPONS, WPN_GROUPS, wpnName } from "@/lib/weapons";
import { flags } from "@/components/Flag";
import type { DashLang } from "../ctx";

type Target = { cat: string; name: string; sub: string; lat: number; lng: number; approx?: boolean };

export default async function TargetsSeo({ lang }: { lang: DashLang }) {
  const t = (UI[lang] as UIStrings).stk;
  const [{ base }, tg] = await Promise.all([getStrikes(), getMaps<{ items: Target[]; note?: string }>("/maps/targets.json", lang)]);
  const hs = (x: string) => houseStyle(x, lang), km = (n: number) => fmt(n, lang) + " " + t.km;
  const xs = tg.items.map((x) => ({ ...x, km: stkDist(base, x) ?? 0 })).sort((a, b) => a.km - b.km);
  const inR = (r: number) => xs.filter((x) => x.km <= r);

  return (
    <section className="tlwrap mp stk-page tg-page" id="targets">
      <div className="mp-head"><h2>{t.tgTitle}</h2><p>{flags(t.tgSub)}</p></div>
      <div className="mp-list tg-list">
        <div className="mp-list-h"><b>{t.wpH}</b></div>
        <table>
          <thead><tr><th>{t.tgColT}</th><th>{t.tgColW}</th><th>{t.tgTIn}</th><th>{t.tgTMil}</th></tr></thead>
          <tbody>{WPN_GROUPS.flatMap((g) => WEAPONS.filter((w) => w.g === g).map((w) => (
            <tr key={w.id}>
              <td>{wpnName(w, lang)}{w.limited && "*"}</td>
              <td>{t.wpG[g]} · {km(w.r)}</td>
              <td className="d">{t.tgOf(fmt(inR(w.r).length, lang), fmt(xs.length, lang))}</td>
              <td className="d">{fmt(inR(w.r).filter((x) => x.cat === "mil").length, lang)}</td>
            </tr>
          )))}</tbody>
        </table>
        <p className="map-src" style={{ padding: "8px 16px" }}>* {t.wpLim}. {t.tgRangeNote}</p>
      </div>
      <div className="mp-list tg-list">
        <div className="mp-list-h"><b>{t.tgTitle} · {fmt(xs.length, lang)}</b></div>
        <table>
          <thead><tr><th>{t.tgColT}</th><th>{t.tgColW}</th><th>{t.tgFront}</th><th>{t.tgWpnN}</th></tr></thead>
          <tbody>{xs.map((x, i) => {
            const r = reaching(x.km);
            return (
              <tr key={i}>
                <td>{flags(hs(x.name))}</td>
                <td>{t.tg[x.cat as "fuel"]} · {flags(hs(x.sub))}{x.approx ? " ≈" : ""}</td>
                <td className="d">{x.km ? km(x.km) : t.distNear}</td>
                <td>{r.length ? r.map((w) => wpnName(w, lang)).join(", ") : t.tgNone}</td>
              </tr>
            );
          })}</tbody>
        </table>
        <p className="map-src" style={{ padding: "8px 16px" }}>{flags(t.distNote(base.ctrlAsOf || "") + (tg.note ? " ◆ " + tg.note : ""))}</p>
      </div>
    </section>
  );
}
