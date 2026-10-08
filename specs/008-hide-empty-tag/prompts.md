# Prompt trace for feature: 008-hide-empty-tag

## Phase: specify

- Date: 2026-10-08
- Branch: `008-hide-empty-tag` (from `main`; PR #13 for 007 is still open)
- Trigger: `/speckit-specify als een taak nu geen tag bevat, zie je wel een leeg kader voor het tag. Zie taak 4 van boven in het screenshot. Verwijder dit kader als er geen tage is.` (with a screenshot of the board)
- Clarifications: none needed. User Story 2 (stray "·" under the title) was added from the same screenshot and is marked as droppable.

## Phase: plan

- Date: 2026-10-08
- Trigger: `/speckit-plan`
- Design:
  - `hasTag` and `metaLine` as pure functions in `logic.js`.
  - The card is inserted without the tag; the tag gets its own `html` insert only when present, because `no-unsanitized` rejects conditional HTML fragments (verified).
  - No CSS change: the Open button keeps its right edge through the existing flex layout.

## Phase: tasks

- Date: 2026-10-08
- Trigger: `/speckit-tasks`
- Result: 10 tasks. Foundational adds `hasTag` and `metaLine` test-first; US1 has 2 tasks, US2 has 2.
- T010 (push and PR) needs owner confirmation.
