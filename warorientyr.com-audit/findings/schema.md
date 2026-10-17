# Schema.org audit: warorientyr.com (checked 2026-10-17)

**Score: 8/100** (no structured data; only canonical + hreflang metadata exist).

## Detection
- Rendered (Playwright, `--mode always`) https://warorientyr.com/en/articles/2026-10-17/geran4: 0 JSON-LD, 0 Microdata, 0 RDFa. Repo grep for `ld+json` also empty. Same for all page types (templates are shared).
- Present: `<title>`, meta description, canonical, hreflang (lib/page.ts, ArticlePage.tsx). Article pages set openGraph image only.

## Gaps (priority)
1. Critical: no Organization/NewsMediaOrganization + WebSite (entity, sitelinks, name).
2. High: Article pages lack NewsArticle (headline, datePublished, image, author, publisher).
3. High: Digest issue pages lack typed markup (use CollectionPage/WebPage + about, or NewsArticle for the issue).
4. Medium: no BreadcrumbList anywhere.
5. Info: dashboard = WebPage only. Do NOT add FAQPage/HowTo/Dataset-as-rich-result expectations.

Notes: publish real values only. Author/publisher name, logo URL, sameAs are placeholders to fill from the owner. Google requires no specific props for NewsArticle but recommends headline, image, datePublished, author. Do not use `dateModified` unless tracked. Site origin: use constant `https://warorientyr.com`, not the VERCEL env var used for metadataBase (preview URLs would leak into JSON-LD).

## Implementation (no repo changes made)
Add one helper, e.g. `lib/jsonld.tsx`:
```tsx
const SITE = "https://warorientyr.com";
export const abs = (p: string) => SITE + (p === "/" ? "" : p);
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
```
(`<` escape is mandatory since text comes from JSON data.) Render inside the page component (server components), so it's in raw HTML.

### 1. Site-wide graph (render in Shell.tsx or DigestPage/ArticlePage/DashPage; at minimum on `/` and `/en`)
```json
{
 "@context": "https://schema.org",
 "@graph": [
  {"@type": "NewsMediaOrganization", "@id": "https://warorientyr.com/#org",
   "name": "WAR·Орієнтир", "alternateName": "WAR Orientyr",
   "url": "https://warorientyr.com/",
   "logo": {"@type": "ImageObject", "url": "https://warorientyr.com/<LOGO_PATH>.png"},
   "inLanguage": ["uk", "en"]},
  {"@type": "WebSite", "@id": "https://warorientyr.com/#website",
   "url": "https://warorientyr.com/", "name": "WAR·Орієнтир",
   "description": "Daily war digest",
   "publisher": {"@id": "https://warorientyr.com/#org"},
   "inLanguage": ["uk", "en"]}
 ]
}
```
No SearchAction (site has no search). Add `sameAs` only for real profiles. Logo: need a >=112px square-ish PNG (check /public; `dash/apple-icon.png` exists and could serve).

### 2. Article page: ArticlePage.tsx (NewsArticle + BreadcrumbList)
Inside component, using `a`, `A`, `lang`, `img`, `inIssue`, `latest`:
```tsx
const url = abs(articleHref(lang, a.date, a.name));
const graph = {
 "@context": "https://schema.org",
 "@graph": [
  { "@type": "NewsArticle", "@id": url + "#article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: (A.title || a.preview.title).slice(0, 110),
    description: A.lead || a.preview.lead,
    inLanguage: a.contentLang,                     // honest: EN falls back to UK
    datePublished: a.date,                         // YYYY-MM-DD is valid ISO 8601; better add T..+03:00 if known
    image: a.img ? [abs(a.img)] : undefined,
    author: { "@id": abs("/") + "#org" },          // or Person if byline exists
    publisher: { "@id": abs("/") + "#org" },
    isPartOf: inIssue ? { "@id": abs(href(lang, "digest", a.date, latest.date)) } : undefined,
    citation: A.sources?.map(s => s.url),
    articleSection: "War" },
  { "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: t.title /* site name */, item: abs(href(lang, "digest", null, latest.date)) },
    { "@type": "ListItem", position: 2, name: `${t.art.issue} ${longDate(a.date, lang)}`, item: abs(href(lang, "digest", a.date, latest.date)) },
    { "@type": "ListItem", position: 3, name: A.title || a.preview.title } ] }
 ]
};
// <JsonLd data={graph} />  (JSON.stringify drops undefined)
```
Gaps in types: ArticleBody has no `author`, `datePublished` time, `dateModified`; optionally add `author?: string; published?: string; modified?: string` to `ArticleBody` (types/digest.ts). If `inIssue` is false, skip the middle breadcrumb. Image hero is `/articles/<date>/<name>/<file>`; check `a.img` is root-relative (preload shows `/articles/2026-10-17/geran4/geran4.jpg`), so `abs()` works.
Verify the 110 char headline cap is fine (Google guideline, not a hard limit).

### 3. Digest issue pages: DigestPage.tsx (CollectionPage... or WebPage + BreadcrumbList)
Daily digest is a recurring report, not a single news story: prefer `CollectionPage`/`WebPage`; `NewsArticle` is acceptable only if the page is reworded as a story (headline is `D.headline.title`).
```tsx
const url = abs(href(lang, "digest", D.date, latest.date));
{ "@context":"https://schema.org", "@graph":[
  { "@type":"WebPage", "@id": url, url, name: dateTitle(D, lang).h,
    description: (D.headline?.title || D.lede || "").slice(0,200),
    inLanguage: D.contentLang ?? lang, datePublished: D.date,
    isPartOf: {"@id": abs("/") + "#website"},
    publisher: {"@id": abs("/") + "#org"},
    primaryImageOfPage: undefined /* add if issue has an image */,
    hasPart: articles.map(x => ({"@type":"NewsArticle", url: abs(x.href), headline: x.preview.title})) },
  { "@type":"BreadcrumbList", itemListElement:[
    {"@type":"ListItem",position:1,name:"WAR·Орієнтир",item: abs(href(lang,"digest",null,latest.date))},
    {"@type":"ListItem",position:2,name: dateTitle(D, lang).h} ] } ]}
```
For the latest issue (`/` and `/en`) breadcrumb is a single item: omit it there. `x.href` may be an external `url` (card links out): only include `hasPart` for internal article pages, or drop `hasPart`.

### 4. Dashboard: `WebPage` with `isPartOf` WebSite and `name = pageMeta title`; BreadcrumbList (Site > Issue date > Dashboard). Low value; do last. Include in `app/**/dashboard` wrapper, not DashProvider (client tree).

## Rules checklist
- @context https://schema.org, absolute URLs, ISO dates: yes in templates.
- No HowTo, no FAQPage, no deprecated types.
- Multilingual: emit JSON-LD in each language's page with its own canonical URL; `@id` of org/site shared.
- Validate after deploy with Rich Results Test (Article/Breadcrumb eligible; Organization/WebSite are non-rich but useful) and validator.schema.org.

## Expected score after fix: ~85-90 (remainder: author/Person, dateModified, logo).
