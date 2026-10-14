import fs from "node:fs/promises";
import path from "node:path";
import App from "@/components/App";
import { styleData } from "@/lib/text";
import type { Digest } from "@/types/digest";

const read = async (p: string) => JSON.parse(await fs.readFile(path.join(process.cwd(), "public", p), "utf8"));

// The latest issue and the archive index are read at build time; older issues are fetched on demand in the browser.
export default async function Page() {
  const latest = styleData(await read("digest.json"), "") as Digest;
  let ds: string[] = [];
  try {
    const j = await read("issues/index.json");
    ds = (Array.isArray(j?.dates) ? j.dates : []).filter((d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  } catch {}
  const dates = [...new Set([...ds, latest.date])].filter((d) => d <= latest.date).sort();
  return <App latest={latest} dates={dates} />;
}
