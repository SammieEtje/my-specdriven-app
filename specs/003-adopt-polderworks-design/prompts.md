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
