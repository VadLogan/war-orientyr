// next dev (16.4.3) updates .next/dev/prerender-manifest.json with an unlocked read → modify → write per route.
// Two routes compiling at once (dashboard → /maps, prefetches) interleave the writes: the file ends in a stale tail,
// and every request then fails with "Unexpected non-whitespace character after JSON". This serializes the update.
// Idempotent; run by predev and postinstall. Drop it once Next fixes the race upstream.
import fs from "node:fs";

const f = "node_modules/next/dist/server/dev/next-dev-server.js";
const MARK = "__nextPmLock";
const READ = "const rawExistingManifest = await _fs.default.promises.readFile(";
const WRITE = "await _fs.default.promises.writeFile((0, _path.join)(this.distDir, _constants1.PRERENDER_MANIFEST), updatedManifest);\n                }";

let s;
try { s = fs.readFileSync(f, "utf8"); } catch { process.exit(0); }
if (s.includes(MARK)) process.exit(0);
if (s.split(READ).length !== 2 || s.split(WRITE).length !== 2) {
  console.warn(`patch-next: ${f} changed, prerender-manifest lock not applied (check whether Next fixed the race)`);
  process.exit(0);
}
s = s
  .replace(READ, `let __pmUnlock; const __pmPrev = globalThis.${MARK} || Promise.resolve(); globalThis.${MARK} = new Promise((r) => (__pmUnlock = r)); await __pmPrev; try {\n                ` + READ)
  .replace(WRITE, WRITE + "\n                } finally { __pmUnlock(); }");
fs.writeFileSync(f, s);
console.log("patch-next: prerender-manifest writes serialized");
