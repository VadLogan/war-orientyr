"use client";
import { useRef } from "react";
import { LANGS, type Lang } from "@/lib/ui";
import LangLink from "./LangLink";

/** Flag button + language list in a panel under it (placed on open).
 *  Native popover: open/close, Esc and click-outside come from the browser. */
export default function LangPicker({ lang, hrefs }: { lang: Lang; hrefs: Record<Lang, string> }) {
  const btn = useRef<HTMLButtonElement>(null);
  const cur = LANGS.find((l) => l.code === lang)!;
  const Mark = ({ l }: { l: (typeof LANGS)[number] }) =>
    l.flag ? <span className="lp-flag" aria-hidden="true">{l.flag}</span> : <span className="lp-code" aria-hidden="true">{l.code}</span>;

  const onToggle = (e: React.ToggleEvent<HTMLDivElement>) => {
    if (e.newState !== "open") return;
    const r = btn.current!.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lp-top", `${r.bottom + 6}px`);
    e.currentTarget.style.setProperty("--lp-right", `${innerWidth - r.right}px`);
  };

  return (
    <>
      <button ref={btn} type="button" className="lp-btn" popoverTarget="langPop" aria-label={`Мова / Language: ${cur.name}`}>
        <Mark l={cur} />{cur.short}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2 3.5l3 3 3-3" /></svg>
      </button>
      <div id="langPop" popover="auto" className="lp" role="dialog" aria-label="Мова / Language" onToggle={onToggle}>
        <div className="lp-list">
          {LANGS.map((l) => (
            <LangLink key={l.code} lang={l.code} href={hrefs[l.code]} current={l.code === lang}>
              <Mark l={l} /><span className="lp-n" lang={l.code}>{l.name}</span><span className="lp-e">{l.code === lang ? "✓" : l.en}</span>
            </LangLink>
          ))}
        </div>
      </div>
    </>
  );
}
