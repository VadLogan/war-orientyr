"use client";
import { useRouter } from "next/navigation";
import { href, type View } from "@/lib/routes";
import type { Lang } from "@/lib/ui";

/** Client island: the issue picker navigates to the chosen date. */
export default function IssueSelect({ lang, view, date, latest, options }: { lang: Lang; view: View; date: string; latest: string; options: [string, string][] }) {
  const router = useRouter();
  return (
    <select id="issueSel" value={date} onChange={(e) => router.push(href(lang, view, e.target.value, latest))}>
      {options.map(([d, label]) => <option key={d} value={d}>{label}</option>)}
    </select>
  );
}
