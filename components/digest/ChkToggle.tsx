"use client";
import { useState, type ReactNode } from "react";

/** Client island: expands the (server-rendered) source list. */
export default function ChkToggle({ more, less, children }: { more: string; less: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"chk" + (open ? " open" : "")} id="sec-check">
      {children}
      <button type="button" className="linkbtn chk-btn" aria-expanded={open} aria-controls="chkBody" onClick={() => setOpen(!open)}>
        {open ? less + " ▴" : more + " ▾"}
      </button>
    </div>
  );
}
