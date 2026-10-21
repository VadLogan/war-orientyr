"use client";
// Frame for a presentation page (same origin): grows to the height of its body, so there is no inner scroll.
import { useEffect, useRef, useState } from "react";

export default function EmbedFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [h, setH] = useState<number>();
  useEffect(() => {
    const f = ref.current!;
    let ro: ResizeObserver | undefined;
    const watch = () => {
      const body = f.contentDocument?.body;
      if (!body) return;
      const fit = () => setH(body.scrollHeight || undefined);
      fit();
      ro?.disconnect();
      ro = new ResizeObserver(fit);
      ro.observe(body);
    };
    // the frame may finish loading before hydration
    watch();
    f.addEventListener("load", watch);
    return () => { f.removeEventListener("load", watch); ro?.disconnect(); };
  }, []);
  return <iframe ref={ref} src={src} title={title} style={h ? { height: h } : undefined} allow="fullscreen" />;
}
