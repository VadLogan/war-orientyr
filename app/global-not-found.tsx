// 404 for URLs no route matches (two root layouts, so there is no shared not-found). It gets no URL, so both languages
// are rendered and the inline script shows the English one on /en/… before paint; without JS it stays Ukrainian.
import Html from "@/components/Html";
import NotFound from "@/components/NotFound";
import { UI } from "@/lib/ui";
export { viewport } from "@/components/Html";

export const metadata = { title: `${UI.uk.nf.title} / ${UI.en.nf.title}` };

const pickLang = `if(/^\\/en(\\/|$)/.test(location.pathname)){document.documentElement.lang="en";document.documentElement.dataset.nf="en"}`;

export default function GlobalNotFound() {
  return (
    <Html lang="uk">
      <script dangerouslySetInnerHTML={{ __html: pickLang }} />
      <div className="nf-uk"><NotFound lang="uk" /></div>
      <div className="nf-en" lang="en"><NotFound lang="en" /></div>
    </Html>
  );
}
