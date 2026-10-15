// Server component: 404 page of both route groups (app/(uk)/not-found.tsx, app/(en)/not-found.tsx).
import Link from "next/link";
import { href } from "@/lib/routes";
import { UI, type Lang } from "@/lib/ui";
import LangLink from "./LangLink";

export default function NotFound({ lang }: { lang: Lang }) {
  const t = UI[lang], nf = t.nf;
  const other: Lang = lang === "en" ? "uk" : "en";
  const path = (view: "digest" | "dashboard") => href(lang, view, nf.fmt, "");
  return (
    <div className="shell">
      <header className="topbar">
        <Link href={href(lang, "digest", null, "")} className="brand" style={{ textDecoration: "none" }} dangerouslySetInnerHTML={{ __html: t.brand }} />
        <span className="seg nf-lang"><LangLink lang={other} href={href(other, "digest", null, "")} current={false}>{other === "uk" ? "UA" : "EN"}</LangLink></span>
      </header>
      <section className="mast nf">
        <div style={{ minWidth: 0 }}>
          <div className="dateline">{nf.line}</div>
          <h1>{nf.h}</h1>
          <p className="lede">{nf.lede}</p>
        </div>
        <div className="nf-code" aria-hidden="true">404</div>
      </section>
      <div className="nf-actions">
        <Link className="btn" href={href(lang, "digest", null, "")}>{nf.toLatest}</Link>
        <Link className="btn ghost" href={href(lang, "dashboard", null, "")}>{t.dash}</Link>
      </div>
      <p className="nf-hint">{nf.hint} <code>{path("digest")}</code>{nf.dashHint} <code>{path("dashboard")}</code>.</p>
    </div>
  );
}
