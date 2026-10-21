"use client";
// Presentation with phases: phase buttons → column-wide, viewport-tall map frame → legend → phase card.
// On a phone the frame hides its moves box, so the phase's moves open over the map from a button and the legend goes after the card.
// The frame (same origin) and the page keep the phase in sync with postMessage({phase: i}) both ways.
import { useEffect, useRef, useState } from "react";
import type { PresentationBody, PresPhase } from "@/types/digest";
import type { UIStrings } from "@/lib/ui";

type P = { src: string; title: string; phases: PresPhase[]; legend: PresentationBody["legend"]; note?: string; foot?: string; t: UIStrings["art"]; locale: string };

export default function PhaseExplorer({ src, title, phases, legend, note, foot, t, locale }: P) {
  const last = phases.length - 1, max = Math.max(...phases.map((p) => p.area), 1);
  const [i, setI] = useState(last);
  const [playing, setPlaying] = useState(false), [rotateOk, setRotateOk] = useState(false), [mvOpen, setMvOpen] = useState(false), [navSeen, setNavSeen] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null), box = useRef<HTMLElement>(null), nav = useRef<HTMLDivElement>(null), touched = useRef(false);
  // time for the frame to animate a phase's moves (as its own player did)
  const dur = (k: number) => 2600 + (phases[k].moves?.length ?? 0) * 1700;
  const fmt = (v?: number) => (v ? v.toLocaleString(locale) : "—");

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin === location.origin && e.source === ref.current?.contentWindow && Number.isInteger(e.data?.phase)) setI(e.data.phase);
    };
    addEventListener("message", on);
    return () => removeEventListener("message", on);
  }, []);
  // the frame may load after a click, or be the one that changed the phase (it ignores its current phase)
  const send = () => ref.current?.contentWindow?.postMessage({ phase: i }, location.origin);
  useEffect(send, [i]);

  // playing: hold each phase for its duration, then the next; stop after the last
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => (i < last ? setI(i + 1) : setPlaying(false)), dur(i));
    return () => clearTimeout(id);
  }, [playing, i]); // eslint-disable-line react-hooks/exhaustive-deps
  // play once from the start when the map first comes into view, unless the reader already chose a phase
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (!touched.current) { setI(0); setPlaying(true); }
    }, { threshold: 0.5 });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  // the sticky bar lets go once the card's prev/next buttons come into view (they take over navigation)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setNavSeen(e.isIntersecting));
    io.observe(nav.current!);
    return () => io.disconnect();
  }, []);

  const go = (k: number) => { touched.current = true; setPlaying(false); setI((k + phases.length) % phases.length); };
  const toggle = () => {
    touched.current = true;
    if (playing) return setPlaying(false);
    if (i === last) setI(0);
    setPlaying(true);
  };
  const p = phases[i], prev = phases[(i + last) % phases.length], next = phases[(i + 1) % phases.length];
  // one legend under the map (desktop) and one after the card (phone); CSS shows one
  const legendList = (cls: string) => legend?.length ? (
    <ul className={cls} aria-label={t.legend}>
      {legend.map((x, k) => <li key={k}><i className={"lg-" + x.kind} aria-hidden="true" />{x.text}</li>)}
      {note && <li className="ph-hint">{note}</li>}
    </ul>
  ) : null;
  return (
    <>
      {/* phase buttons and player stay on screen while the map and the phase card scroll by */}
      <div className={"ph-sticky" + (navSeen ? " off" : "")}>
      <div className="ph-rail" role="group" aria-label={t.phases}>
        {phases.map((x, k) => (
          <button key={k} type="button" aria-pressed={k === i} onClick={() => go(k)}>
            <b>{x.key}</b><small>{x.date}</small>
            <span className="ph-bar" aria-hidden="true"><i style={{ width: (x.area / max) * 100 + "%" }} /></span>
            <small>{x.area ? `${fmt(x.area)} ${t.km}` : "—"}</small>
          </button>
        ))}
      </div>
      <div className={"ph-player" + (playing ? " playing" : "")}>
        <button type="button" className="ph-play" onClick={toggle}>{playing ? t.pause : i === last ? t.again : t.play}</button>
        <div className="ph-prog" role="progressbar" aria-label={t.progress} aria-valuemin={1} aria-valuemax={phases.length} aria-valuenow={i + 1}>
          {phases.map((_, k) => (
            <span key={k} className={k < i ? "done" : k === i ? "on" : undefined}>
              <i key={k === i && playing ? "p" + i : "s"} style={k === i && playing ? { animationDuration: dur(i) + "ms" } : undefined} />
            </span>
          ))}
        </div>
        <span className="ph-count">{i + 1} / {phases.length} · {p.key}</span>
      </div>
      </div>
      {!rotateOk && (
        <p className="ph-rotate" role="note">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2" width="10" height="17" rx="2" /><path d="M3 15a9 9 0 0 0 7 7M3 15l-1 3M3 15l3 1" /></svg>
          <span>{t.rotate}</span>
          <button type="button" aria-label={t.close} onClick={() => setRotateOk(true)}>✕</button>
        </p>
      )}
      <figure className={"pres-map" + (mvOpen ? " mv-open" : "")} ref={box}>
        <iframe ref={ref} src={src} title={title} allow="fullscreen" onLoad={send} />
        {p.moves?.length ? (
          <>
            <button type="button" className="ph-mv-btn" aria-expanded={mvOpen} aria-controls="ph-mv" onClick={() => setMvOpen(!mvOpen)}>
              {mvOpen ? `✕ ${t.close}` : `${t.moves} · ${p.moves.length}`}
            </button>
            <ol className="ph-mv" id="ph-mv" aria-label={`${t.moves} · ${p.key}`}>
              {p.moves.map((m, k) => {
                const [d, ...rest] = m.split(": ");
                return <li key={k}><span className="n">{k + 1}</span>{rest.length ? <><time>{d}</time><span>{rest.join(": ")}</span></> : <span>{m}</span>}</li>;
              })}
            </ol>
          </>
        ) : null}
        {legendList("ph-legend in-map")}
      </figure>
      <article className="ph-card" aria-live="polite">
        <div className="ph-txt">
          <p className="art-kicker">{p.date}{p.meta && ` · ${p.meta}`}</p>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </div>
        <div className="ph-side">
          <dl className="ph-stats">
            <div><dt>{t.area}</dt><dd className="a">{fmt(p.area)}</dd></div>
            <div><dt>{t.sets}</dt><dd className="ok">{fmt(p.sets)}</dd></div>
            <div><dt>{t.loss}</dt><dd className="ru">{p.loss ? "≈" + fmt(p.loss) : "—"}</dd></div>
            <div><dt>{t.pow}</dt><dd>{p.pow ? fmt(p.pow) + "+" : "—"}</dd></div>
          </dl>
          <div className="ph-forces">
            <div className="ua"><b>{t.ua}</b>{(p.ua.length ? p.ua : [t.defence]).map((x, k) => <span key={k} className="chip">{x}</span>)}</div>
            <div className="ru"><b>{t.ru}</b>{p.ru.map((x, k) => <span key={k} className="chip">{x}</span>)}</div>
          </div>
        </div>
        <div className="ph-nav" ref={nav}>
          <button type="button" onClick={() => go(i - 1)}>← {prev.key}</button>
          <button type="button" className="next" onClick={() => go(i + 1)}>{next.key} →</button>
        </div>
      </article>
      {legendList("ph-legend after-card")}
      {foot && <p className="ph-foot">{foot}</p>}
    </>
  );
}
