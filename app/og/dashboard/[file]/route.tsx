// Share image of a day's dashboard (/og/dashboard/<date>.png): the day's key numbers with pictograms, no words, so one
// image serves every language (og:title carries the text) — drones launched, share shot down, russian losses, price per km².
import { ImageResponse } from "next/og";
import { getAnalytics, getDates, getIssue, getLatest } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = async () => (await getDates()).map((d) => ({ file: d + ".png" }));

const W = 1200, H = 630, INK = "#151b1f", BG = "#eceeed", ACC = "#1d4b80", RED = "#97302c";
const sp = (n: number) => Math.round(n).toLocaleString("en").replace(/,/g, " ");
// stroke pictograms (24×24): drone, shield, person, area
const ICO: Record<string, string> = {
  drone: "M12 9v6M5 6l4 4M19 6l-4 4M5 18l4-4M19 18l-4-4M3 6h4M17 6h4M3 18h4M17 18h4",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12l2 2 4-4",
  person: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6",
  area: "M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z M9 4v13M15 7v13",
};
const icon = (k: string, c: string) => "data:image/svg+xml;base64," + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICO[k]}"/></svg>`).toString("base64");

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const date = (await params).file.replace(/\.png$/, "");
  const [D, latest] = await Promise.all([getIssue(date, "uk"), getLatest("uk")]);
  const an = date === latest.date ? await getAnalytics(D) : null;
  const A = D.airDefense || {}, ru = (D.losses?.series || []).find((e) => e.date === date)?.ru?.personnel;
  const tiles: [string, string, string][] = [];
  if (A.launched != null) tiles.push(["drone", sp(A.launched), INK]);
  if (A.launched) tiles.push(["shield", Math.round(((A.intercepted ?? 0) / A.launched) * 100) + "%", INK]);
  if (ru != null) tiles.push(["person", sp(ru), RED]);
  if (an?.km30) tiles.push(["area", sp(an.km30.pk) + "/km²", ACC]);
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: W, height: H, background: BG, padding: 56, fontFamily: "monospace" }}>
      <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 18px", background: INK, color: "#fafbfa", fontSize: 36 }}>{date.split("-").reverse().join(".")}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 44 }}>
        {tiles.map(([k, v, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 22, width: 520, height: 190, padding: "0 30px", background: "#fafbfa", border: `4px solid ${k === "area" ? ACC : "#c8cfcc"}`, borderRadius: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon(k, c)} width={78} height={78} alt="" />
            <div style={{ display: "flex", fontSize: k === "area" ? 64 : 84, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>
    </div>,
    { width: W, height: H },
  );
}
