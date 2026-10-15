// Server component: day counters and the headline/lede.
import type { Digest } from "@/types/digest";
import { dateTitle, dayLabel, sinceList } from "@/lib/text";
import type { Lang } from "@/lib/ui";

export default function Mast({ D, lang, dashboard }: { D: Digest; lang: Lang; dashboard: boolean }) {
  const dt = dateTitle(D, lang);
  const H = D.headline && D.headline.title ? D.headline : null;
  const more = (item: string) => <a className="lede-more" href={"#it-" + item}>{lang === "en" ? "Read more ↓" : "Детальніше ↓"}</a>;
  const P = Array.isArray(D.ledeParts) && D.ledeParts.length ? D.ledeParts : null;
  const parts = P?.map((x, k) => <p key={k}>{x.label && <b>{x.label}</b>}{x.text}</p>);

  let body;
  if (dashboard) body = <h1>{dt.h}</h1>;
  else if (H) body = <><h1 className="hl">{H.title}</h1>{H.text && <p className="lede">{H.text}</p>}{H.item && more(H.item)}</>;
  else body = <><h1>{dt.h}</h1>{P ? <div className="lede lede-parts">{parts}</div> : <p className="lede">{D.lede}</p>}</>;

  return (
    <div>
      <div className="counters">
        {sinceList(D, lang).map((x) => (
          <div className="counter" title={x.span} key={x.fd}><b>{dayLabel(x.day, lang)}</b><span className="cl">{x.label} · {x.fd}</span></div>
        ))}
      </div>
      <section className="mast">
        <div style={{ minWidth: 0 }}>
          {!dashboard && <div className="dateline">{dt.line}</div>}
          {body}
        </div>
      </section>
    </div>
  );
}
