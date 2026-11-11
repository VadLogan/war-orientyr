// Tagged link for a Telegram post: npx tsx scripts/utm.ts <url> [campaign] [source]
// campaign defaults to today's date (one post a day); source defaults to telegram. Self-check: --test.
import assert from "node:assert";
import { utm } from "../lib/routes";

const [url, campaign = new Date().toISOString().slice(0, 10), source = "telegram"] = process.argv.slice(2);
if (url === "--test") {
  assert.equal(utm("https://x.ua/maps?utm_source=fb&a=1#v=ds", "telegram", "d1"), "https://x.ua/maps?a=1&utm_source=telegram&utm_medium=social&utm_campaign=d1#v=ds");
  console.log("ok");
} else if (!url) {
  console.error("usage: npm run utm -- <url> [campaign] [source]");
  process.exit(1);
} else console.log(utm(url, source, campaign));
