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

## Phase: analyze

- Date: 2026-10-08
- Trigger: `/speckit-analyze`, then the owner asked to fix all findings
- Findings: 0 CRITICAL, 0 HIGH, 2 MEDIUM and 4 LOW.
- Remediation:
  - I1: T001 uses `npm run test:e2e -- --workers=1`, so the flag reaches Playwright.
  - I2: T010 also runs `docs.test.js` after a 007 merge, because the SC-001 word-for-word test then covers the 008 documents.
  - C1: an axe check with a card without a tag, in T004.
  - F1: `[P]` removed from T006.
  - A1: User Story 2 is kept; the owner answered "ja, graag" to the remediation offer that asked whether US2 stays.
  - T1: FR-005 says the trace to 003 FR-003 is kept, instead of "the same".

## Phase: implement

- Date: 2026-10-09
- Trigger: `/speckit-implement`
- Result:
  - `logic.js`: `hasTag` and `metaLine`. `app.js`: the tag is inserted only when `hasTag`, with `003:FR-003 008:FR-001`; the meta line uses `metaLine` and carries `008:FR-004`.
  - Tests: 71 unit (3 new) and 39 e2e (11 new), all green; lint, security lint and formatting clean. No CSS or `index.html` change.
- Found and fixed during the build (tests only):
  - Checking off a task under the Active filter removes it from the list, so the filter test now checks it off under All.
  - `toHaveCount(0)` on `.tag` also passes when the card is missing, so the test first asserts the card is visible.
