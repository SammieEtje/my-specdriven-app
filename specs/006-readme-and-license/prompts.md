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

## Phase: tasks

- Date: 2026-10-06
- Trigger: `/speckit-tasks`
- Result: 16 tasks, with `readme.test.js` checks first per story.
- T015 (push and PR) needs owner confirmation. T016 checks GitHub's license detection after the merge.

## Phase: analyze

- Date: 2026-10-06
- Trigger: `/speckit-analyze`, then the owner asked to pick up all issues
- Findings: 0 CRITICAL, 1 HIGH, 1 MEDIUM and 4 LOW.
- Remediation:
  - H1: content checks for FR-002, FR-003, FR-005 and FR-007 (T002, T005).
  - G1: a reader test, T017.
  - G2: a no-email check.
  - I1: FR-004 now covers 001 to 006.
  - I2: converge is described as a check step after implement.
  - U1: T016's result is recorded on the next feature branch, because `main` is protected.

## Phase: implement

- Date: 2026-10-06 and 2026-10-07
- Trigger: `/speckit-implement`
- Result:
  - `LICENSE`: the MIT text identical to upstream, apart from `Copyright (c) 2026 Sander Ettema`.
  - `THIRD_PARTY_NOTICES.md`: IBM Plex, Spec Kit (full upstream MIT text), the Polderworks design system with the trademark exclusion, and the dev tools.
  - `README.md` in English, with 11 sections.
  - `readme.test.js` with 14 checks.
- Corrections found by the fact check:
  - Converge was only used for 003.
  - eslint-plugin-no-unsanitized is MPL-2.0.
- Test fixes: ©, ® and ™ are allowed as text symbols, and the section term match is case-insensitive.
- A fresh clone passes all README steps. External links return 200.
- Reader test: the owner stood in and judged the README fine. This is weaker evidence; see the quickstart.
