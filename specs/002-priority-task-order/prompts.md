# Prompt trace for feature: 002-priority-task-order

## Phase: specify

- Date: 2026-10-02
- Branch: `main` (no branch hook is configured)
- Spec: `specs/002-priority-task-order/spec.md`
- Trigger: User request: "Voeg voor de demo twee extra taken toe. Ik wil de taken in volgorde van prioriteit kunnen slepen in staat. Deze volgorde moet persistent zijn en dus bewaard blijven bij volgende sessies."
- Goal: Specify two additional demo tasks, mouse and keyboard task reordering by priority, and persistence of the full order across later visits.
- Clarifications: Example-task titles remain open for implementation; Clarify resolved how ordering behaves under filters.

## Phase: clarify

- Date: 2026-10-02
- Trigger: `/speckit-clarify`
- Question: Wat moet er met de volledige prioriteitsvolgorde gebeuren als je taken herschikt terwijl een statusfilter actief is?
- Answer: A — Herschikken kan alleen in `All`; bij `Active` of `Completed` zijn sleep- en toetsenbordacties voor volgorde uitgeschakeld.
- Result: Updated the task-reordering acceptance scenario, FR-003, FR-005, and SC-002; no checklist markers changed.
