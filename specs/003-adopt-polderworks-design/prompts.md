# Prompt trace for feature: 003-adopt-polderworks-design

## Phase: specify

- Date: 2026-10-03
- Branch: `main` (no branch hook is configured)
- Spec: `specs/003-adopt-polderworks-design/spec.md`
- Trigger: `/speckit-specify adopt it` (refers to the central Polderworks design system, installed as the `polderworks-design` skill)
- Goal: Restyle the todo demo and its decision-trace panel to the Polderworks design system (tokens, IBM Plex, flat square geometry, component patterns) without changing behaviour.
- Clarifications: FR-014 asked whether the demo carries visible Polderworks branding. Answer: A, visual foundations only, no logo or "a Polderworks project" line.

## Phase: plan

- Date: 2026-10-03
- Branch: `003-adopt-polderworks-design`
- Plan: `specs/003-adopt-polderworks-design/plan.md`, `research.md`
- Trigger: `/speckit-plan`
- Goal: Restyle on design-system tokens imported from `.claude/skills/polderworks-design/tokens/`, re-express the component patterns as plain CSS classes, self-host IBM Plex for offline use, and switch to the light theme.
- Decisions: R1 to R8 in `research.md`. Contrast-driven deviations from the design system (slate control borders, navy filter underline) are justified in Complexity Tracking.

## Phase: tasks

- Date: 2026-10-03
- Branch: `003-adopt-polderworks-design`
- Tasks: `specs/003-adopt-polderworks-design/tasks.md`
- Trigger: `/speckit-tasks`
- Goal: 43 tasks across Setup, Foundational, US1 to US3 and Polish, with `design.test.js` tests written first per constitution II.
- Note: `data-model.md` and `contracts/ui-styling.md` were never generated. The element-to-pattern mapping is written into the tasks instead.

## Phase: analyze

- Date: 2026-10-03
- Branch: `003-adopt-polderworks-design`
- Trigger: `/speckit-analyze`, followed by remediation of actions 2 and 3
- Findings: 2 CRITICAL (missing phase tags and prompt entries; header trace not keyboard-operable), 1 HIGH (FR-012 had no automated test), plus medium and low items.
- Remediation:
  - T021 now handles Enter and Space on the header. T044 adds an FR-012 test.
  - The spec allows the "Completed" status text and `aria-pressed` on the filters as accessibility exceptions.
  - FR-008 names `--shadow-lg`.
  - `plan.md` justifies the English UI and docs in Complexity Tracking.
  - Plan and tasks tags were added on `f39cfb5`.

## Phase: implement

- Date: 2026-10-03
- Branch: `003-adopt-polderworks-design`
- Trigger: `/speckit-implement`
- Goal: Execute T001 to T044. Restyle the demo on design-system tokens with self-hosted IBM Plex, without changing behaviour.
- Notable decisions:
  - Fonts are the Latin-1 split `woff2` files from the official `@ibm/plex-sans` 1.1.0 and `@ibm/plex-mono` 2.5.0 packages, with their OFL licence. The packages were not added as dependencies.
  - Buttons follow the design-system variants but without its 120ms transition, per US2/AC2.
  - The traced-element outline (dashed navy) and the focus ring (solid teal) are distinct without colour.
  - At 360px the task actions wrap below the title.
- Validation: `npm test` (17 tests: 5 in `logic.test.js`, 12 in `design.test.js`) and the quickstart checks run in headless Chrome (see `quickstart.md`).

## Phase: converge

- Date: 2026-10-04
- Branch: `003-adopt-polderworks-design`
- Trigger: `/speckit-converge`, then `/speckit-implement` on the appended Phase 7
- Findings:
  - The task checkbox had no `data-spec` (Constitution III, FR-006).
  - The badge and tag were rounded although they are not controls (FR-003).
- Resolution:
  - T045 adds `003:FR-006` to the checkbox.
  - T046 squares `.badge` and `.tag`, limits rounding to controls in the FR-003 test, and gives the badge `003:FR-003`.
  - `npm test` passes all 17 tests.
