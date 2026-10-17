// Server component: an image that opens full size in a native popover (Esc / click outside closes, no JS).
import type { UIStrings } from "@/lib/ui";

export default function ImgZoom({ id, src, alt, className = "", t }: { id: string; src: string; alt: string; className?: string; t: UIStrings }) {
  return (
    <>
      <button type="button" className={"zoom-btn " + className} popoverTarget={id} aria-label={t.art.zoom}>
        <img src={src} alt={alt} />
      </button>
      <div id={id} popover="auto" className="zoom" role="dialog" aria-label={alt || t.art.zoom}>
        <img src={src} alt={alt} />
        <button type="button" className="zoom-x" popoverTarget={id} popoverTargetAction="hide" aria-label={t.art.close}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
    </>
  );
}
