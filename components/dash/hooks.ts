"use client";
import { useEffect, useState, type RefObject } from "react";

/** useState whose value survives the dashboard unmounting (switching to the digest tab and back), like the legacy module globals. */
const STICKY = new Map<string, unknown>();
export function useSticky<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => (STICKY.has(key) ? (STICKY.get(key) as T) : init));
  return [v, (x: T) => { STICKY.set(key, x); setV(x); }];
}

/** Fetch a JSON file from public/ once per page load. */
const JSON_CACHE = new Map<string, Promise<any>>();
export function fetchJson<T>(url: string): Promise<T> {
  if (!JSON_CACHE.has(url))
    JSON_CACHE.set(url, fetch(url, { cache: "no-store" }).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }));
  return JSON_CACHE.get(url)!;
}
export function useJson<T>(url: string | null): { data: T | null; err: boolean } {
  const [s, setS] = useState<{ data: T | null; err: boolean }>({ data: null, err: false });
  useEffect(() => {
    if (!url) return;
    let live = true;
    fetchJson<T>(url).then((data) => live && setS({ data, err: false }), () => live && setS({ data: null, err: true }));
    return () => { live = false; };
  }, [url]);
  return s;
}

/** Chart width for the fixed-size SVG panels (civilians, attack cost, recruitment): window width minus page padding, 300..680. */
export function useChartW() {
  const calc = () => Math.round(Math.min(680, Math.max(300, (typeof innerWidth === "number" ? innerWidth : 700) - 70)));
  const [w, setW] = useState(calc);
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    const on = () => { clearTimeout(tm); tm = setTimeout(() => setW(calc()), 150); };
    addEventListener("resize", on);
    return () => { removeEventListener("resize", on); clearTimeout(tm); };
  }, []);
  return w;
}

/** Content width of an element, tracked with ResizeObserver (0 until measured). */
export function useElWidth(ref: RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}
