# Prompt trace for feature: 006-readme-and-license

## Phase: specify

- Date: 2026-10-06
- Branch: `006-readme-and-license` (from `main`)
- Trigger: `/speckit-specify we need a license and a readme to explain to interested parties what this repo is all about and why it has been created.`
- Clarifications:
  - MIT license.
  - The Polderworks design system falls under MIT; the brand names and identity are excluded.
  - The README is in English.

## Phase: plan

- Date: 2026-10-06
- Trigger: `/speckit-plan`. The owner had merged the spec as PR #10; work continues on the same branch.
- Design:
  - `LICENSE` keeps the exact MIT text, so GitHub detects it.
  - `THIRD_PARTY_NOTICES.md` covers IBM Plex (OFL-1.1), Spec Kit (MIT, verified with `gh api`), the design system (MIT plus a trademark exclusion) and the dev tools (not redistributed).
  - An English `README.md` per `contracts/readme-outline.md`.
  - `readme.test.js` for offline checks.
- The English language deviates from the constitution; this is recorded in Complexity Tracking.
