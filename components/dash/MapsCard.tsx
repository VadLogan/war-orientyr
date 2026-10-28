// Server component: the dashboard's map block — a still DIVGEN ↔ DeepState map framed on the front, projected and
// clipped at build time, so the dashboard ships a few KB of SVG instead of the ~180 KB snapshot and d3.
import Link from "next/link";
import { geoConicConformal, geoPath, type GeoPermissibleObjects } from "d3";
import { getMaps } from "@/lib/data";
import { href } from "@/lib/routes";
import { dayN, fmt, houseStyle } from "@/lib/text";
import { UI, type UIStrings } from "@/lib/ui";
import { flags } from "@/components/Flag";
import type { DashLang } from "../ctx";
import type { MapsData } from "./Panels";
import { areaTiles, Cities, countV, lastDay, Layers, Mark, mp, Tiles, VerdictBar, vgOf, type Geo, type Rings } from "./mapParts";

const W = 640, H = 380;
const dmy = (d: string) => d.split("-").reverse().join(".");

export default async function MapsCard({ lang, date, latest, url }: { lang: DashLang; date: string; latest: string; url: string }) {
  const t = UI[lang] as UIStrings;
  const M = await getMaps<MapsData>(url, lang);
  const hs = (x: string) => houseStyle(x, lang);
  const F = (n: number) => fmt(Math.round(n), lang);
  const to = href(lang, "maps", date, latest);

  // frame the claims inside the border (≈ the front); everything outside the box is clipped away
  const pts = M.events.filter((e) => e.ds !== "out").map((e) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [e.lng, e.lat] } }));
  const proj = geoConicConformal().parallels([45, 52]).rotate([-31.5, 0])
    .fitExtent([[28, 28], [W - 28, H - 28]], { type: "FeatureCollection", features: pts } as GeoPermissibleObjects)
    .clipExtent([[-8, -8], [W + 8, H + 8]]);
  const path = geoPath(proj).digits(0);
  const geo: Geo = { proj, d: (c?: Rings) => (c && c.length ? path(mp(c)) || "" : "") };
  const inBox = ([x, y]: [number, number]) => x > 0 && x < W && y > 0 && y < H;
  const cities = M.cities.filter((c) => inBox(proj([c.lng, c.lat])!));

  const end = lastDay(M);
  const recent = M.events.filter((e) => dayN(e.d) > end - 30);
  const last = M.events.reduce((a, b) => (b.d > a.d ? b : a), M.events[0]);

  return (
    <section className="tlwrap" id="maps">
      <div className="tl-head mp-teaser-h"><h2>{t.map}</h2><Link href={to}>{t.mpOpen}</Link></div>
      <div className="mp-teaser">
        <Link href={to} className="mp-thumb" aria-label={t.mpOpen}>
          <div className="map-wrap">
            <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <Layers M={M} geo={geo} mode="cmp" pair="dg_ds" />
              <Cities M={{ ...M, cities }} geo={geo} k={1} />
              {M.events.map((e) => {
                const p = proj([e.lng, e.lat])!;
                return inBox(p) ? <g key={e.id + "" + e.d} transform={`translate(${p[0].toFixed(1)},${p[1].toFixed(1)})`}><Mark g={vgOf(e.ds)} /></g> : null;
              })}
            </svg>
            <span className="mp-cta">{t.mpOpenMap}</span>
          </div>
        </Link>
        <div className="mp-side">
          <div className="tiles map-tiles mp-tiles2"><Tiles items={areaTiles(M, t, F, "cmp", "dg_ds")} /></div>
          <VerdictBar t={t} head={t.mpBar(recent.length, 30, t.src.ds)} cnt={countV(recent, "ds")} />
          {last && <p className="map-src">{t.mpLast}: <b>{dmy(last.d).slice(0, 5)}</b> — {flags(hs(last.t))}. DeepState: {t.evSt.ds[last.ds as "occ"]}.</p>}
        </div>
      </div>
    </section>
  );
}
