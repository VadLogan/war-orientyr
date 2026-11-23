"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { href, tgHref } from "@/lib/routes";
import type { Analytics } from "@/lib/data";
import { useApp } from "../ctx";
import { CrossLinks } from "./AnNotes";
import SeoHtml from "./SeoHtml";

// its own module (not in Dashboard.tsx), so /strikes doesn't load the dashboard's panels; the maps pull in d3, lazily
const StrikesMap = dynamic(() => import("./Maps").then((m) => m.StrikesMap), { ssr: false });
const TargetsMap = dynamic(() => import("./Maps").then((m) => m.TargetsMap), { ssr: false });

/** Strikes / potential targets: two pages (/strikes, /strikes/targets) switched by plain links. */
function StkSwitch({ tg }: { tg?: boolean }) {
  const { t, lang } = useApp();
  return (
    <nav className="stk-sw" aria-label={t.stk.swAria}>
      <Link href={href(lang, "strikes", null, "")} aria-current={tg ? undefined : "page"}>
        <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3v6M15 21v6M3 15h6M21 15h6" /><circle cx="15" cy="15" r="7" /><circle cx="15" cy="15" r="1.6" className="fl" /></svg>
        <span><b>{t.stk.swStk}</b><small>{t.stk.swStkSub}</small></span>
      </Link>
      <Link href={tgHref(lang)} aria-current={tg ? "page" : undefined}>
        <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 4l11 11-11 11L4 15z" /><path d="M15 10l5 5-5 5-5-5z" className="fl" /></svg>
        <span><b>{t.stk.swTg}</b><small>{t.stk.swTgSub}</small></span>
      </Link>
    </nav>
  );
}

/** The /strikes page: the server HTML (`seo`) until the interactive map with its filters, legend and list has its data.
 *  `tg`: /strikes/targets — the potential targets and what each weapon reaches instead (server HTML: TargetsSeo). */
export default function StrikesView({ seo, an, headline, tg }: { seo: ReactNode; an?: Analytics | null; headline?: { title?: string; item?: string } | null; tg?: boolean }) {
  const { t, lang, D } = useApp();
  const [ready, setReady] = useState(false);
  return (
    <div className="dash">
      {lang === "en" && D.contentLang !== "en" && <p className="lang-note">{t.langNote}</p>}
      <CrossLinks an={an} headline={headline} />
      <StkSwitch tg={tg} />
      {!ready && <SeoHtml seo={seo} loading={t.stk.loading} />}
      {tg ? <TargetsMap onReady={() => setReady(true)} /> : <StrikesMap an={an} onReady={() => setReady(true)} />}
    </div>
  );
}
