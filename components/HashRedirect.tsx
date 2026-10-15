"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { href } from "@/lib/routes";

/** Keeps old shared links working: /#2026-10-07, /#dashboard, /#dashboard-2026-10-07 → path URLs. */
export default function HashRedirect({ latest, dates }: { latest: string; dates: string[] }) {
  const router = useRouter();
  useEffect(() => {
    const m = location.hash.match(/^#(dashboard)?-?(\d{4}-\d{2}-\d{2})?$/);
    if (!m || (!m[1] && !m[2])) return;
    const date = m[2] && dates.includes(m[2]) ? m[2] : null;
    router.replace(href("uk", m[1] ? "dashboard" : "digest", date, latest));
  }, [router, latest, dates]);
  return null;
}
