// Plain geometry on [lng, lat] MultiPolygon rings (maps.json layers), for /maps: inside tests and distance to an edge.
export type Rings = number[][][][];
export type LL = [number, number];

/** Point inside the area (even–odd over every ring, so holes count). Planar in degrees: fine for a yes/no near the front. */
export function inRings(rings: Rings, [x, y]: LL) {
  let ins = false;
  for (const poly of rings) for (const r of poly)
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
    }
  return ins;
}

/** km from the point to the area (0 inside) and the nearest point of its edge. Local equirectangular frame around the
 *  point: under 0.5% off for the few hundred km that matter here. */
export function toArea(rings: Rings, p: LL): { km: number; at: LL } {
  const kx = 111.32 * Math.cos((p[1] * Math.PI) / 180), ky = 110.57;
  let best = Infinity, at: LL = p;
  for (const poly of rings) for (const r of poly)
    for (let i = 1; i < r.length; i++) {
      const ax = (r[i - 1][0] - p[0]) * kx, ay = (r[i - 1][1] - p[1]) * ky, bx = (r[i][0] - p[0]) * kx, by = (r[i][1] - p[1]) * ky;
      const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      const t = L ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L)) : 0, cx = ax + t * dx, cy = ay + t * dy, d = Math.hypot(cx, cy);
      if (d < best) { best = d; at = [p[0] + cx / kx, p[1] + cy / ky]; }
    }
  return { km: inRings(rings, p) ? 0 : best, at };
}

/** Self-check: `npx tsx lib/geo.ts` */
if (typeof process !== "undefined" && process.argv[1]?.endsWith("geo.ts")) {
  const sq: Rings = [[[[37, 48], [38, 48], [38, 49], [37, 49], [37, 48]], [[37.4, 48.4], [37.6, 48.4], [37.6, 48.6], [37.4, 48.6], [37.4, 48.4]]]];
  console.assert(inRings(sq, [37.2, 48.5]) && !inRings(sq, [37.5, 48.5]) && !inRings(sq, [36.5, 48.5]), "inside, hole, outside");
  const d = toArea(sq, [36, 48.5]);
  console.assert(Math.abs(d.km - 111.32 * Math.cos((48.5 * Math.PI) / 180)) < 0.01 && d.at[0] === 37 && Math.abs(d.at[1] - 48.5) < 1e-9, "west edge");
  console.assert(toArea(sq, [37.2, 48.5]).km === 0 && Math.abs(toArea(sq, [37.5, 48.5]).km - 0.1 * 111.32 * Math.cos((48.5 * Math.PI) / 180)) < 0.01, "inside = 0, hole edge");
  console.log("geo ok");
}
