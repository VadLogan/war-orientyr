// Share image of a day's front map (/og/maps/<date>.png): DeepState's occupied area, its grey zone and DIVGEN's claims
// beyond it, framed like the dashboard's MapsCard. No words, so one image serves uk/en/de (og:title carries the text).
import { ImageResponse } from "next/og";
import { geoConicConformal, geoPath, type GeoPermissibleObjects } from "d3";
import { getDates, getMaps, getMapsUrl } from "@/lib/data";
import type { MapsData } from "@/components/dash/Panels";
import { mp, type Rings } from "@/components/dash/mapParts";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = async () => (await getDates()).map((d) => ({ file: d + ".png" }));

const W = 1200, H = 630;

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const date = (await params).file.replace(/\.png$/, "");
  const M = await getMaps<MapsData>(await getMapsUrl(date), "uk");
  const pts = M.events.filter((e) => e.ds !== "out").map((e) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [e.lng, e.lat] } }));
  const proj = geoConicConformal().parallels([45, 52]).rotate([-31.5, 0])
    .fitExtent([[60, 60], [W - 60, H - 60]], { type: "FeatureCollection", features: pts } as GeoPermissibleObjects)
    .clipExtent([[-8, -8], [W + 8, H + 8]]);
  const path = geoPath(proj).digits(1);
  const P = (c: Rings | undefined, fill: string, op: number, stroke = "none", sw = 0) =>
    c?.length ? `<path d="${path(mp(c)) || ""}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="${sw}" fill-rule="evenodd"/>` : "";
  // colours: the light theme's --m-* in globals.css
  const L = M.layers;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#dfe6ea"/>`
    + M.base.map((b) => P(b.c, b.ua ? "#fbfcfb" : "#f3f4f2", 1, "#9aa5a8", b.ua ? 2 : 1)).join("")
    + P(L.ds_occ, "#b5443c", 0.38, "#b5443c", 1.5) + P(L.ds_grey, "#8a8f93", 0.45, "#8a8f93", 1) + P(L.dg_ds_a, "#e07b00", 0.75)
    + M.cities.map((c) => { const p = proj([c.lng, c.lat]); return p ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="#2b3338"/>` : ""; }).join("")
    + "</svg>";
  return new ImageResponse(
    <div style={{ display: "flex", width: W, height: H, position: "relative" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={"data:image/svg+xml;base64," + Buffer.from(svg).toString("base64")} width={W} height={H} alt="" />
      <div style={{ position: "absolute", left: 32, top: 28, padding: "8px 16px", background: "#151b1f", color: "#fafbfa", fontSize: 34 }}>
        {date.split("-").reverse().join(".")}
      </div>
    </div>,
    { width: W, height: H },
  );
}
