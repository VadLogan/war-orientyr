"use client";
// A dashboard panel opened in full: a side drawer on wide screens, a bottom sheet on phones (CSS). The URL hash is the
// panel's id (#losses, #landcost, #potential…), so old links still open it, links can be shared and Back closes it.
import { useEffect, useRef, useState } from "react";
import { useApp } from "../ctx";
import { pick } from "./Panels";
import type { PanelItem } from "./Overview";

export default function PanelSheet({ items }: { items: PanelItem[] }) {
  const { lang } = useApp();
  const tr = pick(lang);
  const ref = useRef<HTMLDialogElement>(null);
  const [id, setId] = useState<string | null>(null);
  const ids = items.map((x) => x.id).join();
  useEffect(() => {
    const read = () => { const h = decodeURIComponent(location.hash.slice(1)); setId(items.some((x) => x.id === h) ? h : null); };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, [ids]); // items change identity every render; their ids are what matters
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (id && !d.open) d.showModal();
    if (!id && d.open) d.close();
    if (id) d.querySelector(".ps-body")?.scrollTo(0, 0);
  }, [id]);

  const close = () => { if (location.hash) history.replaceState(null, "", location.pathname + location.search); setId(null); };
  const go = (k: number) => { const n = items[k]; if (n) { history.replaceState(null, "", "#" + n.id); setId(n.id); } };
  const i = items.findIndex((x) => x.id === id), cur = items[i];

  return (
    <dialog ref={ref} className="ps" aria-label={cur?.title} onClose={close}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("input,select,textarea,[role=group]")) return;
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}>
      {cur && <div className="ps-in">
        <div className="ps-bar">
          <span className="ps-grip" aria-hidden="true" />
          <button type="button" className="linkbtn" disabled={i < 1} onClick={() => go(i - 1)}>‹ {items[i - 1]?.title ?? ""}</button>
          <span className="ps-n">{i + 1} / {items.length}</span>
          <button type="button" className="linkbtn" disabled={i >= items.length - 1} onClick={() => go(i + 1)}>{items[i + 1]?.title ?? ""} ›</button>
          <button type="button" className="ps-x" aria-label={tr("Закрити", "Close", "Schließen", "Fermer")} onClick={close}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg></button>
        </div>
        <div className="ps-body">{cur.node}</div>
      </div>}
    </dialog>
  );
}
