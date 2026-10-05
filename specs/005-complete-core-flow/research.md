# Research: Kernflow uit feature 001 voltooien

There were no open unknowns after the clarifications (auto-save; no delete). The decisions below
fix the approach.

## R1. Where the logic lives

- **Decision**: Pure functions in `logic.js`, all unit-tested with `node --test`:
  - `createTask(tasks, title)`: trims the title. Returns `null` when it is empty. Otherwise returns a new task with the next free id `task-N`, empty description, tag and owner, and `completed: false`.
  - `filterTasks(tasks, filter)` for `all`, `active` and `completed`.
  - `emptyStateText(filter, totalCount)`: the heading and body for the empty state.
  - `serializeState(tasks)` and `parseState(raw, fallbackTasks)`.

  `app.js` keeps the DOM wiring only.
- **Rationale**: This matches 001's split (`logic.js` for pure logic, `app.js` for the DOM) and makes
  every FR unit-testable without a browser (constitution II).
- **Alternatives considered**: putting the logic inline in `app.js`. It could then only be tested
  through Playwright, which is slower and less precise. Rejected.

## R2. Task ids

- **Decision**: The next id is `task-` followed by (the highest numeric suffix among existing ids,
  plus 1).
- **Rationale**: The ids are deterministic for tests and readable in the trace. They never collide,
  because there is no delete (clarification Q2). `crypto.randomUUID()` would work on `localhost`,
  but it makes assertions and the trace object harder to read.

## R3. Storage format and auto-save (FR-008, FR-009)

- **Decision**: One `localStorage` key, `spec-driven-todo-demo`, holding JSON
  `{ "version": 1, "tasks": [ … ] }`. `parseState` returns the fallback example tasks when:
  - the key is missing;
  - the JSON is invalid;
  - `version !== 1`;
  - `tasks` is not an array;
  - any task lacks a string `id` or `title`, or a boolean `completed`.

  Missing optional fields default to `''`. Saving runs after every mutation: add, toggle, and each
  edit in the dialog. Every `localStorage` access is wrapped in `try/catch`; if storage is blocked,
  the app runs in memory (spec edge case).
- **Rationale**: The version field lets a future format change be detected instead of crashing.
  The data is a few hundred bytes, so saving on every change is cheap. Constitution V allows
  `localStorage` only.

## R4. Add flow and keyboard (FR-001 to FR-004)

- **Decision**: `<section class="composer">` becomes `<form class="composer" novalidate>`, and the
  Add task button becomes `type="submit"`. A single `submit` handler with `preventDefault()` covers
  the click and Enter alike. On an invalid title, the input gets `aria-invalid="true"` and
  `aria-describedby="task-input-error"`, and the error paragraph `#task-input-error` gets its text.
  The error clears on the next `input` event. After a successful add, the input is cleared and keeps
  focus.
- **Rationale**: A native form gives Enter-to-submit without a custom key handler. The
  `aria-describedby` link is what constitution IV prescribes for field errors. `novalidate` keeps
  the browser's own popup out, so the message style matches the design system.
- **Compatibility**: The existing click delegation still calls `renderTrace('add-task-button')`, so
  the trace stays `spec-01` (US1, scenario 6). `id`, `data-target` and `data-spec` stay unchanged
  (FR-012, 003 tests).

## R5. Filtering and empty state (FR-005 to FR-007)

- **Decision**: A module-level `currentFilter` starts as `all`.
  - Clicking a filter sets it, then re-renders. The existing T030 code already syncs `aria-pressed`.
  - `renderTaskList()` renders `filterTasks(taskState, currentFilter)`.
  - If the result is empty, it hides `#task-list`, shows `#empty-state` and sets its heading and
    paragraph from `emptyStateText`. Otherwise it does the reverse.
  - Toggling a checkbox re-renders, so a task checked off under "Active" disappears at once.
- **Rationale**: The smallest change to the existing render path. The filter is not persisted
  (spec edge case).

## R6. Status messages (FR-010, US2 scenario 5)

- **Decision**: One live region next to the Persist button: `<p id="app-status" role="status">`,
  styled with the design-system caption style. It shows:
  - "Demo state saved" after Persist;
  - "Task added to Active" when a task is added while the Completed filter is on.

  The text clears after 4 seconds, or when the next message replaces it.
- **Rationale**: `role="status"` is announced politely by screen readers without stealing focus.
  One region keeps the UI quiet.

## R7. Empty title in the dialog (FR-011, 001 edge case)

- **Decision**: `renderTaskModal()` remembers the opening title. Live edits still update the row
  (001 FR-011). On the dialog's `close` event, if the trimmed title is empty, the remembered title
  is restored, the row re-renders and the state is saved. The existing focus return to Open stays
  as it is.

## R8. Traceability (constitution III)

- **Decision**:
  - New and changed elements get `005:FR-xxx` tokens:
    - the form: `005:FR-001`;
    - `#task-input-error`: `005:FR-004`;
    - the filters: add `005:FR-005`;
    - `#empty-state`: add `005:FR-007`;
    - `#save-state`: add `005:FR-010`;
    - `#app-status`: `005:FR-010`.
  - The existing `FEATURE_SPECS` entries (spec-01 add, spec-04 filters, spec-06 empty state,
    spec-07 persist) already describe these behaviours, so no new trace entry is needed.
  - The `T032` "Known 001 gap" comment in `logic.js` is removed, because the gap closes.
- **Observed, out of scope**: `FEATURE_SPECS` spec-03 lists `task-toggle-1` and `task-toggle-2`,
  but the checkboxes use `task-toggle-task-1` and `task-toggle-task-2`. Clicking a checkbox
  therefore shows the spec-01 trace instead of spec-03. This is a 001 trace defect. It is recorded
  here and should become its own small fix.

## R9. Branches and merge order

- **Decision**: `005-complete-core-flow` is based on `004-ci-quality-gates` (stacked). Its PR
  targets `004-ci-quality-gates`, so the diff shows only 005's changes, and the quality gate (which
  triggers on PRs to `main`) runs on PR #2 once 005 is merged into it.
  - To get CI feedback on 005 itself before that merge, the PR temporarily targets `main`, so the
    workflow runs with 005's head. After the checks pass, it is retargeted to
    `004-ci-quality-gates` and merged.
  - Then PR #1 (003) merges into `main`, then PR #2 (004 + 005) with all three checks green. After
    that, branch protection goes on (004 T036).
- **Rationale**: This keeps the analyze C1 order (no red merges into `main`). The gate is proven on
  the 005 code, and each PR stays reviewable.
- **Alternatives considered**: basing 005 on `main`. That conflicts heavily with the 003 restyle
  and the 004 escaping in `app.js`, and the e2e tests that prove 005 would not exist there.
  Rejected.

## R10. Tests

- **Decision**:
  - **Unit:** a new `core-flow.test.js` covers `createTask`, `filterTasks`, `emptyStateText`,
    `serializeState` and `parseState`, including every corruption case from R3.
  - **Browser:** the four existing 004 core-flow tests are the acceptance proof (SC-001). A new
    `e2e/core-flow-005.spec.js` covers what 004 doesn't:
    - Enter adds a task;
    - the input clears and keeps focus;
    - a blank title is refused with `aria-describedby`;
    - adding under Completed shows "Task added to Active";
    - checking off under Active hides the task;
    - corrupt storage falls back to the example tasks;
    - Persist shows a confirmation in `role="status"`;
    - an empty dialog title is restored on close;
    - an HTML title renders as text after a reload.
  - The existing axe and keyboard tests cover the new elements automatically.
