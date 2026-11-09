"use client";
// The dashboard analytics mentioned on /maps (the price of the ground the map shows taken) and /strikes (russia's strike
// potential), in the dashboard's accent frame. Figures come from the server (lib/data getAnalytics), latest issue only.
import type { Analytics } from "@/lib/data";
import { fmt } from "@/lib/text";
import { href } from "@/lib/routes";
import { useApp } from "../ctx";
import { MN } from "./Panels";
import { flags } from "@/components/Flag";

const dm = (d: string) => d.slice(8, 10) + "." + d.slice(5, 7);

/** Under the map: the price of the km² DeepState shows taken over `chg` days (7 or 30; off = 7). */
export function LandCostNote({ an, chg }: { an: Analytics | null | undefined; chg: number }) {
  const { lang, t } = useApp();
  const k = chg === 30 ? an?.km30 : an?.km7;
  if (!k) return null;
  const f = (n: number) => fmt(Math.round(n), lang);
  return (
    <a className="an-card" href={href(lang, "dashboard", null, "") + "#landcost"}>
      <span className="h"><span className="dz-badge">{t.an.b}</span><b>{t.an.kmT(f(k.gain))}</b></span>
      <span className="v"><b>{f(k.pk)}</b><span>{t.an.perKm}{k.x != null && k.x >= 2 ? " · " + t.an.x(Math.round(k.x)) : ""}</span></span>
      <span className="n">{t.an.kmN(f(k.pers), dm(k.S), dm(k.E))}</span>
      <span className="go">{t.an.kmGo}</span>
    </a>
  );
}

/** Next to the strike totals: what russia makes and launches. */
export function PotentialNote({ an }: { an: Analytics | null | undefined }) {
  const { lang, t } = useApp();
  const p = an?.pot;
  if (!p) return null;
  const f = (n: number) => fmt(Math.round(n), lang), m0 = MN[lang][+p.month.slice(5, 7) - 1], m = m0[0].toUpperCase() + m0.slice(1) + " " + p.month.slice(0, 4);
  return (
    <a className="an-card" href={href(lang, "dashboard", null, "") + "#potential"}>
      <span className="h"><span className="dz-badge">{t.an.b}</span><b>{t.an.potT}</b></span>
      <span className="v"><b>≈{f(p.prod)}</b><span>{t.an.prod}</span></span>
      <span className="n">{t.an.potN(m, f(p.launched), p.share)}</span>
      <span className="go">{t.an.potGo}</span>
    </a>
  );
}

/** Top of /maps and /strikes (where most visitors land): the day's digest and both dashboard analytics, one tap away. */
export function CrossLinks({ an, headline }: { an: Analytics | null | undefined; headline: { title?: string; item?: string } | null | undefined }) {
  const { lang, t, D, LATEST } = useApp();
  const f = (n: number) => fmt(Math.round(n), lang), dash = href(lang, "dashboard", null, "");
  const k = an?.km7, p = an?.pot;
  if (!headline?.title && !k && !p) return null;
  return (
    <nav className="xl" aria-label={t.an.more}>
      <span className="xl-h">{t.an.more}</span>
      {headline?.title && <a className="xl-c" href={href(lang, "digest", D.date, LATEST.date) + (headline.item ? "#it-" + headline.item : "")}>
        <span className="k">{t.an.dig} · {dm(D.date)}</span><span className="hl">{flags(headline.title)}</span></a>}
      {k && <a className="xl-c an" href={dash + "#landcost"}><span className="k"><span className="dz-badge">{t.an.b}</span>{t.an.kmK}</span>
        <span className="v"><b>{f(k.pk)}</b><span>{t.an.kmS(k.span)}{k.x != null && k.x >= 2 ? " · " + t.an.x(Math.round(k.x)) : ""}</span></span></a>}
      {p && <a className="xl-c an" href={dash + "#potential"}><span className="k"><span className="dz-badge">{t.an.b}</span>{t.an.potK}</span>
        <span className="v"><b>{p.share}%</b><span>{t.an.potS}</span></span></a>}
    </nav>
  );
}
