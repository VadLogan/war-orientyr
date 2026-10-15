// Server component: the Digest tab.
import type { Digest as DigestT, Section, Source } from "@/types/digest";
import { noFlag, secTitle } from "@/lib/text";
import { secIcon } from "@/lib/icons";
import type { Strikes } from "@/lib/strikes";
import ChkToggle from "./ChkToggle";
import Item, { SrcChip, type RC } from "./Item";

export function SecIco({ id, s }: { id: string; s?: Section }) {
  const ic = secIcon(id, s);
  if (!ic) return null;
  if (ic.img) return <span className={ic.cls} aria-hidden="true"><img src={ic.img.src} alt="" width={ic.img.size} height={ic.img.size} /></span>;
  return <span className={ic.cls} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic.svg! }} />;
}

/** Flags of the countries named in the section (excluding Ukraine), shown under the "reactions" heading. */
function FlagSub({ s }: { s: Section }) {
  const seen: string[] = [];
  s.items.forEach((i) => (String(i.text || "").match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu) || []).forEach((x) => { if (x !== "🇺🇦" && !seen.includes(x)) seen.push(x); }));
  return seen.length ? <p className="sec-sub"><span className="emo" aria-hidden="true">{seen.join(" ")}</span></p> : null;
}

const SRC_ORD: Record<string, number> = { ok: 0, partial: 1, unavailable: 2 };
export function countSources(S: Source[]) {
  const c = { ok: 0, partial: 0, unavailable: 0 };
  S.forEach((s) => c[s.status in c ? s.status : "ok"]++);
  return c;
}

function Sources({ D, t }: Omit<RC, "lang"> & { D: DigestT }) {
  const S = D.sources || [];
  const c = countSources(S), tot = Math.max(1, S.length), line = t.covLine(c.ok, c.partial, c.unavailable);
  const sorted = S.map((s, n) => [s, n] as const).sort((a, b) => (SRC_ORD[a[0].status] ?? 0) - (SRC_ORD[b[0].status] ?? 0) || a[1] - b[1]).map((x) => x[0]);
  return (
    <section className="sec" id="sec-sources">
      <div className="sech"><h2><SecIco id="sources" /><span>{t.sources}</span></h2><span>{S.length}</span></div>
      <div className="cov-sum">
        <p className="sub" style={{ margin: "0 0 6px" }}>{line}</p>
        <div className="cov" role="img" aria-label={line}>
          <div className="c-ok" style={{ width: (c.ok / tot) * 100 + "%" }} />
          <div className="c-part" style={{ width: (c.partial / tot) * 100 + "%" }} />
          <div className="c-unv" style={{ width: (c.unavailable / tot) * 100 + "%" }} />
        </div>
        <div className="legend" style={{ margin: "8px 0 10px" }}>
          <span><i style={{ background: "var(--ok)" }} />{t.st.ok} {c.ok}</span>
          <span><i style={{ background: "var(--part)" }} />{t.st.partial} {c.partial}</span>
          <span><i style={{ background: "var(--unv)" }} />{t.st.unavailable} {c.unavailable}</span>
        </div>
      </div>
      <ChkToggle more={t.chkMore} less={t.chkLess}>
        <div className="chk-body srcw" id="chkBody">
          <ul className="srcs">
            {sorted.map((s, k) => (
              <li key={k}><a href={s.url} target="_blank" rel="noopener">{s.title}</a><SrcChip s={s} t={t} />
                {(s.kind === "ru" || s.note) && <em>{s.kind === "ru" ? t.kindRu : s.note}</em>}</li>
            ))}
          </ul>
        </div>
      </ChkToggle>
      <p className="note">{D.assumption}</p>
      <p className="note">{(D.since[0] || {}).note || ""}. {t.countNote}</p>
    </section>
  );
}

export default function Digest({ D, lang, t, strikes }: RC & { D: DigestT; strikes: Strikes | null }) {
  const secs = (D.sections || []).filter((s) => s.items && s.items.length);
  return (
    <div className="col digest">
      {t.langNote && <p className="lang-note">{t.langNote}</p>}
      {secs.map((s) => (
        <section className="sec" id={"sec-" + s.id} key={s.id}>
          <div className="sech"><h2><SecIco id={s.id} s={s} /><span>{noFlag(secTitle(s, lang))}</span></h2><span>{t.items(s.items.length)}</span></div>
          {s.id === "react" && <FlagSub s={s} />}
          {s.items.map((i, k) => <Item i={i} key={i.id || k} lang={lang} t={t} strikes={strikes} />)}
        </section>
      ))}
      <section className="diverge" id="sec-diverge">
        <div className="sech"><h2><SecIco id="diverge" /><span>{t.diverge}</span></h2><span>{t.items(D.divergences.items.length)}</span></div>
        <p className="intro">{D.divergences.intro}</p>
        {D.divergences.items.map((x, k) => (
          <div className="dv" key={k}>
            <h3>{x.title}</h3>
            <div className="vs">
              <div><small>{x.a.source}</small><strong>{x.a.claim}</strong></div>
              <i>{t.vs}</i>
              <div><small>{x.b.source}</small><strong>{x.b.claim}</strong></div>
            </div>
            <p>{x.why}</p>
          </div>
        ))}
      </section>
      <Sources D={D} t={t} />
      <footer className="foot">{D.footer}</footer>
    </div>
  );
}
