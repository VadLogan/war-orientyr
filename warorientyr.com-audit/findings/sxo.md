# SXO: warorientyr.com/en (English edition)

**SXO Gap Score: 53/100** (this is separate from the SEO Health Score)
Date: 2026-10-17. Pages checked: `/en` (latest issue), `/en/dashboard`, `/en/articles/2026-10-17/geran4`. All three were rendered with `render_page.py --mode always` and parsed with `parse_html.py`.

## Main finding: the format is right, but the pages are not packaged the way Google ranks them

The digest is the same kind of page that ranks for daily-update queries: a dated news roundup, like Al Jazeera's "List of key events, day N", Kyiv Post's live thread and ISW's daily assessments. The problem is how it is packaged, not what it says.

| Query | SERP dominant type (consensus) | Target page | Mismatch |
|---|---|---|---|
| ukraine war daily update / key events today | News roundup / live blog = Blog Post type (≈90%; Kyiv Post live, Al Jazeera "day N", ISW) | `/en`: Blog Post type (daily roundup) | **MEDIUM**: same format, but the URL changes content every day, there is no dated URL for today's issue, no schema, and the title does not contain "Ukraine" or "russia" |
| russia strikes ukraine today | One news article per attack (≈100%; Kyiv Independent, Liga, NV, Deccan Herald "Air Force says N drones") | One H2 section ("Strikes & air defence") inside a 3,576-word page | **HIGH**: a section cannot outrank a dedicated article. Do not target the head term |
| russian losses today | Daily General Staff news posts (≈80%; UNN, bukvy, Pravda, Kyiv Independent) plus trackers (≈20%; Looker Studio, Observable, r/RussianLosses) | `/en/dashboard`: Tool/Interactive | **MEDIUM**: the type is the SERP minority. The title and meta never say "losses", and the meta description is the sanctions headline |
| shahed geran drone | Reference/explainer (Wikipedia ×3, CSIS, Euromaidan, migflug) | Geran-4 article: news analysis | **HIGH** for the head term (not winnable) |
| geran-4 texas instruments / components | News analysis (≈90%; Militarnyi, DroneXL, RFE/RL via migflug, defence24, Janes, GUR War&Sanctions catalogue) | Geran-4 article: Blog Post type | **ALIGNED**, but 528 words against 800+ in competitors, and it reworks the Militarnyi/InformNapalm story, which also ranks |

**Indexation check:** a search for "warorientyr" returned no site results. `/sitemap.xml` and `/robots.txt` both return 404. The site appears to be unknown to the index (Google itself was not checked; see Limitations), and that has to be fixed before any SXO work pays off.

**URL design issue:** `/en/2026-10-17` returns 404 today. The latest issue exists only at `/en` and gets a dated URL only after the next issue is published. Links and citations to "today" therefore point at a URL whose content changes the next day. Google never sees a stable, dated URL while the issue is fresh, which is exactly when daily queries peak.

## Target page facts
- `/en`: title "State of the war, 17 October 2026 · Daily war digest" (no Ukraine/russia, no brand). The H1 and meta description are both the day's sanctions headline. 1 H1, 12 H2. 3,576 extracted words. 61 external source links. "Source divergences" section. "In this issue" table of contents. Day counters (day 1,697). **0 JSON-LD, 0 og:/twitter tags** (the article page has them, the homepage does not). Canonical `/en`. hreflang uk/en is correct.
- `/en/dashboard`: title "State of the war, 17 October 2026 · Dashboard · …". The meta description is the same sanctions headline (not relevant to the page). 8 H2s: civilian casualties by month (UN HRMMU), night-attack cost, timeline, losses claims, **price of a km²**, **recruitment vs losses**, attacks by direction, fire per day. 0 schema. The rendered HTML shows "Loading prices…". It has a methodology block ("How the figures are counted"), which is good.
- `/en/articles/2026-10-17/geran4`: 528 words, 4 H2s, chip table, country chart, og image and summary_large_image card, sources section. 0 schema. No author or byline was detected.

## Queries it can realistically win
Head terms ("ukraine war daily update", "russia strikes ukraine today", "russian losses today", "shahed drone") are held by wires and national media with Top Stories eligibility. They are not realistic goals for a new domain with no indexation. These are winnable:
1. Date-specific digest queries: "ukraine war 17 october 2026", "russia ukraine war day 1697", "what happened in ukraine [date]". This needs stable dated URLs, with the day number in the title.
2. Data queries the dashboard answers and news sites don't: "russian losses per square km", "cost of a kilometre russia ukraine", "russian recruitment vs losses 2026", "UN civilian casualties ukraine by month 2026", "cost of russian drone attack estimate".
3. Source-comparison long tail: "general staff vs russian MoD claims [date]". This is unique content ("Source divergences") that no competitor has.
4. Specific angles on the Geran-4 story: "geran-4 flight controller components", "geran-4 texas instruments TMS320F28335", "geran-4 US chips export controls".

## User stories (each tied to a SERP signal)
1. **Awareness.** As an English-speaking follower, I want one page with everything that happened in the war yesterday, because news is scattered across Telegram and wires, but I'm blocked by a title that doesn't say "Ukraine" and a URL I can't bookmark for a given day. *Signal: Al Jazeera "List of key events, day N" ranks with dated permalinks and the day number in the title.*
2. **Awareness.** As someone who just heard about a night attack, I want the Air Force numbers (launched vs downed) right away, because I'm worried, but I'm blocked by that data sitting in the 4th H2 of a page whose H1 is about US sanctions. *Signal: every "strikes today" result has a headline in the form "Russia launched N drones and M missiles overnight, Air Force says".*
3. **Consideration.** As a data-minded analyst, I want daily russian-loss figures as a chart with averages, because single-day posts don't show trends, but I'm blocked by a dashboard whose title and description never say "losses". *Signal: Looker Studio dashboards, Observable notebooks and r/RussianLosses rank with 7/14/30-day averages.*
4. **Consideration.** As a fact-checker, I want to know which claims are verified and where sources disagree, because General Staff figures are "not independently verified", but I'm blocked by having no stable URL or author/organisation to cite. *Signal: the AI-style summaries in the SERP repeatedly add "Ukrainian estimates, not independently verified" caveats.*
5. **Decision/use.** As a sanctions or defence-tech researcher, I want part numbers and how they relate to export controls, because I'm building a case for policymakers, but I'm blocked by the article giving 105 components while GUR's War&Sanctions catalogue (which ranks alongside it) lists about 55 foreign parts, with nothing explaining the difference. *Signal: war-sanctions.gur.gov.ua, Janes and Militarnyi all rank with component lists.*

## Gap analysis (`/en`, primary page)
| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 9/15 | Format matches the daily-roundup SERP. Loses points for the rolling URL, no dated URL for the current issue, and an entity-less title |
| Content Depth | 14/15 | 3,576 words, 11 sections, source divergences: deeper than Al Jazeera's key-events list |
| UX Signals | 10/15 | Table of contents, issue picker, day counter. No "key numbers in 24h" summary block above the fold; the lede is about sanctions, not the war day |
| Schema | 0/15 | No NewsArticle, LiveBlogPosting, Organization or WebSite schema on any page |
| Media | 8/15 | 26 images, mostly icons. One feature image. No map or chart in the digest (they exist on the dashboard) |
| Authority | 5/15 | Many cited sources (strong). No About/editorial/organisation page, no byline, brand not indexed, no sitemap |
| Freshness | 7/10 | Daily issue, `publication_date` detected. No visible "updated HH:MM" or dateModified; the URL changes content daily |
| **Total** | **53/100** | |

Secondary pages: `/en/dashboard` **51/100** (Type 8, Depth 7, UX 9, Schema 0, Media 13, Authority 7, Fresh 7); `/en/articles/.../geran4` **53/100** (Type 13, Depth 7, UX 11, Schema 0, Media 9, Authority 6, Fresh 7).

## Persona scores (weakest first)
| Persona (SERP evidence) | Rel | Clar | Trust | Act | Total | Fix |
|---|---|---|---|---|---|---|
| "Strikes today" checker (Air Force headline pattern) | 16 | 10 | 16 | 8 | **50** | Add a "Last night" stat strip at the top of `/en` (launched / downed / killed / injured, with source and time). Add the `#sec-strikes` anchor to the title/meta on heavy-attack days |
| Sanctions/policy watcher (Graham Act, Diplomacy section) | 18 | 15 | 14 | 9 | **56** | Link the headline to primary documents (the executive order). Add "What changed / what didn't" bullets |
| Journalist / fact-checker ("not independently verified" caveats) | 20 | 15 | 17 | 6 | **58** | Publish today's issue at `/en/YYYY-MM-DD` right away, with `/en` pointing to it. Add a "Cite this" line, an About/methodology page and an Organization schema |
| Defence-tech / sanctions researcher (GUR catalogue, Janes, Militarnyi) | 20 | 18 | 12 | 9 | **59** | Grow the article to 900+ words. Explain the 105 vs ~55 figures. Link the GUR War&Sanctions entry. Add a byline and Article schema with a datePublished |
| Data/OSINT analyst (Looker, Observable, r/RussianLosses) | 18 | 14 | 18 | 10 | **60** | Retitle the dashboard: "russian losses & war data dashboard: daily chart, per-km² cost, recruitment". Write its own meta description. Add CSV/JSON download links and a Dataset schema |
| Daily-briefing reader (Al Jazeera day-N, Kyiv Post live) | 22 | 17 | 15 | 12 | **66** | Title: "Ukraine war, day 1,697 (17 Oct 2026): key events · WAR·Orientyr". Add an email/RSS/Telegram subscribe call to action (none found) |

## Priority actions
1. **Get indexed:** add `app/sitemap.ts` (all issues, articles, both languages) and `app/robots.ts`, then submit to Search Console. Without this, no other fix matters.
2. **Stable dated URLs:** serve the current issue at `/en/2026-10-17` on the day it is published. `/en` stays the latest-issue page and either canonicals to it or acts as a hub.
3. **Titles and metas built from entities:** put "Ukraine war", the day number, the date and the brand in the title, and write a summary-style meta description instead of reusing the headline (in `lib/page.ts` `pageMeta()`).
4. **Schema:** NewsArticle on issues (headline, datePublished/dateModified, publisher Organization), Article plus author on articles, Dataset on the dashboard, and Organization/WebSite site-wide. Add the og:/twitter tags missing from `/en` and `/en/dashboard`. Run `/seo schema`.
5. **Above-the-fold "24h in numbers" strip** on the digest (strikes, casualties, General Staff losses, clashes), linking to the sections.
6. **Trust:** an About/methodology page naming the editors or organisation, plus a corrections policy. Run `/seo content` for an E-E-A-T review.

Cross-skill: `/seo schema` (missing types), `/seo content` (E-E-A-T), `/seo page` (Geran-4 article depth). Local intent was not detected, so `/seo local` is not needed.

## Limitations
- WebSearch is not a live Google SERP. Rankings, Top Stories, AI Overviews, PAA and ads could not be seen directly. The SERP findings use the result sets returned (Kyiv Post, Al Jazeera, UNN, Kyiv Independent, Militarnyi, GUR and others), and many were stale or spam-scraper results.
- There is no Search Console or analytics data, so impressions and indexation status were inferred, not confirmed.
- Personas come from SERP patterns, not user research. Mobile above-the-fold and Core Web Vitals were not measured in this pass.
- The 105 vs ~55 component figures were not checked against the primary InformNapalm source.

Want a PDF report? Use `/seo google report`.

## Structured findings (audit-data.json, category "Search Experience")
```json
{"category":"Search Experience","score":53,"pages":{"/en":53,"/en/dashboard":51,"/en/articles/2026-10-17/geran4":53},
"findings":[
{"id":"sxo-index","severity":"critical","title":"Site not discoverable: no sitemap.xml/robots.txt (404), brand search returns nothing"},
{"id":"sxo-rolling-url","severity":"high","title":"Current issue has no dated URL (/en/2026-10-17 = 404); /en content changes daily"},
{"id":"sxo-strikes-mismatch","severity":"high","title":"'russia strikes ukraine today' SERP = per-attack news articles; site offers a buried section"},
{"id":"sxo-title-entities","severity":"high","title":"Titles lack 'Ukraine'/'russia'/brand; meta description = daily headline, reused on dashboard"},
{"id":"sxo-schema","severity":"high","title":"0 JSON-LD on all pages; no og/twitter on /en and /en/dashboard"},
{"id":"sxo-dashboard-type","severity":"medium","title":"Dashboard (Tool) vs news-dominant 'russian losses today' SERP; target data long-tail instead"},
{"id":"sxo-article-depth","severity":"medium","title":"Geran-4 article 528 words, no byline/schema, 105 vs ~55 component discrepancy unexplained"},
{"id":"sxo-trust","severity":"medium","title":"No About/editorial/organisation identity; strong source citation not leveraged"}]}
```
