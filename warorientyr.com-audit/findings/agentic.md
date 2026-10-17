# Agent readiness: https://warorientyr.com/en (checked 2026-10-17)

## Lighthouse Agentic Browsing
Not measurable: PSI returned HTTP 429 (daily quota, no API key) for mobile and desktop. Report as unavailable, not 0/N. Retry after configuring a Google API key.

## Agent-UX heuristic (separate from Lighthouse): 100/100, complete
- 5 real buttons, 80 anchors, 18 landmarks, 0 div-onclick widgets
- a11y tree: 1503 nodes, 83 interactive, 0 unnamed interactive, 0 unlabelled inputs
- Scope: /en only. The /en/dashboard (client-rendered maps, charts) was not tested; d3 maps/charts may be opaque to the tree, so check them manually.

## Findings
- P0 pass: server-rendered, 4115 words without JS.
- P0 warn: robots.txt 404. Everything is allowed and no AI-usage preference is declared. Publish one deliberately (fix: add public/robots.txt or app/robots.ts, with sitemap).
- P1 info: llms.txt 404 (and llms-full.txt). Lighthouse drops the audit from the fraction; a valid file (H1, `>` summary, Markdown links to issues) would add a counted pass.
- P1 info: Markdown delivery absent (no Accept: text/markdown, no rel=alternate, /en.md 404). Opportunity only.
- P1 pass: unknown URLs return a real 404.
- P2 info: WebMCP absent (0 registerTool, 0 forms). Nothing to expose; not a defect.
- P3 na: /.well-known api-catalog, oauth-protected-resource, oauth-authorization-server, ai-catalog.json, agent-card.json, ucp all 404. Not needed for a static read-only site.

## Access policy (robots.txt absent, so no declared rules)
- Training: not declared (implicitly allowed)
- Search: not declared (implicitly allowed)
- User-triggered agents: not declared (implicitly allowed)
- Content-Signal: none. Consider declaring deliberately.

## Standards notes (facts checked 2026-09-23)
WebMCP: W3C CG draft, not a standard. Content-Signal and ai-catalog.json (ARD 1.0): drafts/proposals. No ranking, citation or traffic effects are implied.

## Score
Agent readiness: Good. Crawlable and semantically solid (Agent-UX 100), with missing optional policy files. Lighthouse fraction unavailable.
