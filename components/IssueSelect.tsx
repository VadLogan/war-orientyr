"use client";
import { useRouter } from "next/navigation";
import { href, type View } from "@/lib/routes";
import type { Lang } from "@/lib/ui";

/** Client island: the issue picker navigates to the chosen date. */
export default function IssueSelect({ lang, view, date, latest, options }: { lang: Lang; view: View; date: string; latest: string; options: [string, string][] }) {
  const router = useRouter();
  // The select is an invisible layer over the label, so the chevron sits right after the date, not at the box edge.
  return (
    <span className="isel">
      <svg className="isel-cal" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14.5" rx="2" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></svg>
      <span aria-hidden="true">{options.find(([d]) => d === date)?.[1] ?? date}</span>
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
      <select id="issueSel" value={date} onChange={(e) => router.push(href(lang, view, e.target.value, latest))}>
        {options.map(([d, label]) => <option key={d} value={d}>{label}</option>)}
      </select>
    </span>
  );
}
