"use client";
import { useEffect, useRef } from "react";

/** One shared tooltip for every element with a data-tip attribute (hover and keyboard focus). */
export default function Tooltip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tip = ref.current!;
    const show = (el: HTMLElement, x: number, y: number) => {
      const rich = el.querySelector(":scope > .tipc"); // optional rich content (icons), data-tip stays the plain-text version
      if (rich) tip.replaceChildren(...[...rich.childNodes].map((n) => n.cloneNode(true)));
      else tip.textContent = el.dataset.tip || "";
      tip.hidden = false;
      const r = tip.getBoundingClientRect();
      tip.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, x + 12)) + "px";
      tip.style.top = Math.max(8, y - r.height - 10) + "px";
    };
    const find = (e: Event) => (e.target as Element | null)?.closest?.("[data-tip]") as HTMLElement | null;
    const move = (e: MouseEvent) => { const el = find(e); if (el) show(el, e.clientX, e.clientY); else tip.hidden = true; };
    const focus = (e: FocusEvent) => { const el = find(e); if (el) { const r = el.getBoundingClientRect(); show(el, r.left + r.width / 2, r.top); } };
    const hide = () => { tip.hidden = true; };
    document.addEventListener("mousemove", move);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", hide);
    document.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("scroll", hide);
    };
  }, []);
  return <div id="tip" ref={ref} hidden />;
}
