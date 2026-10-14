"use client";
import { useEffect } from "react";

const D3 = "/legacy/d3.min.js"; // vendored from npm d3@7.9.0 (see postinstall)

function load(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("failed to load " + src));
    document.body.appendChild(s);
  });
}

declare global {
  interface Window { __warDigestBooted?: boolean }
}

export default function LegacyApp() {
  useEffect(() => {
    if (window.__warDigestBooted) return; // React StrictMode runs effects twice in dev
    window.__warDigestBooted = true;
    (async () => {
      if (!("d3" in window)) await load(D3);
      await load("/legacy/app.js");
    })().catch((e) => console.error(e));
  }, []);
  return null;
}
