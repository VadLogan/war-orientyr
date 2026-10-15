"use client";
import { useEffect } from "react";

/** Client island: marks the rail link of the section being read (aria-current), on the server-rendered `.toc`. */
export default function TocSpy() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".toc a")];
    const secs = links.map((a) => document.getElementById(a.hash.slice(1))).filter((s): s is HTMLElement => !!s);
    const update = () => {
      // the last section whose top has passed the upper third of the window
      let cur = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top < innerHeight / 3) cur = s;
      links.forEach((a) => (a.hash === "#" + cur?.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return null;
}
