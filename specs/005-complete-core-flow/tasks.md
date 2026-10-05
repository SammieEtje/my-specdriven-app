---

description: "Task list for completing the 001 core flow"
---

# Tasks: Kernflow uit feature 001 voltooien

**Input**: Design documents from `/specs/005-complete-core-flow/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R10), data-model.md, contracts/ui-behaviour.md, quickstart.md

**Tests**: Included (constitution II). For each story, write the unit and e2e tests first and confirm they fail.

**Organization**: One phase per user story (US1 add, US2 filters, US3 empty state, US4 persistence).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Conventions for every task

- **Contract is binding**: element ids, `data-spec` tokens, message texts and the storage key are exactly as in `contracts/ui-behaviour.md` and `data-model.md`.
- **Keep what exists (FR-012)**: never remove or rename an existing `id`, `data-target` or `data-spec` token. Add new tokens to the same attribute, separated by a space.
- **Escaping (004 R6)**: markup that contains task data is built with the `html` tagged template. `npm run lint:security` must stay clean.
- **Styles**: design-system tokens only (003 FR-001 to FR-004). `design.test.js` must stay green.
- **Traceability**: put a task-ID comment by each change (`// T012`, `<!-- T012 -->`, `/* T012 */`). Every new test title starts with the `005:FR-xxx` it covers.
- **Formatting**: run `npm run format` after editing. `npm run lint` and `npm run format:check` must pass.

---

## Phase 1: Setup

- [X] T001 Record the baseline: run `npm test` (expect 40 of 40 to pass) and `npm run test:e2e` (expect exactly 4 failures: "001:US5 add a task from the input", "001:FR-008 filter All, Active, Completed", "001:FR-009 empty state when a filter has no tasks" and "001:FR-010 persist, reload, tasks remain"). Create `e2e/core-flow-005.spec.js` importing `{ test, expect }` from `./fixtures.js` with a `beforeEach` that only calls `page.goto('/')`. Playwright gives every test a fresh browser context, so `localStorage` starts empty and needs no clearing (analyze S1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: US2 to US4 build on this refactor.

- [X] T002 In `app.js`, add a module-level `let currentFilter = 'all';` and a `refresh()` function that calls `renderTaskList()`. Make every mutation call `refresh()` instead of `renderTaskList()` directly: the checkbox toggle, `updateSelectedTask` and `openTask`. US4 adds saving inside `refresh()`. There is no behaviour change. Run `npm test` and `npm run test:e2e` and make sure the T001 baseline is unchanged

**Checkpoint**: Same results as T001.

---

## Phase 3: User Story 1 - Een taak toevoegen (Priority: P1) 🎯 MVP

**Goal**: Add a task with the button or Enter. A blank title is refused with an error linked to the field. A cleared dialog title is restored.

**Independent Test**: The 004 test "001:US5 add a task from the input" passes, and so do the new US1 tests in `e2e/core-flow-005.spec.js`.

### Tests for User Story 1 ⚠️

- [X] T003 [P] [US1] Create `core-flow.test.js` (node:test). Tests for `createTask(tasks, title)` from `logic.js`:
  - `'005:FR-002 creates an active task with a trimmed title'`: input `'  Buy milk '` gives `{ title: 'Buy milk', description: '', tag: '', owner: '', completed: false }`;
  - `'005:FR-002 next id is highest task-N plus one'`: with ids `task-1` and `task-7`, the new id is `task-8`; with an empty list it is `task-1`;
  - `'005:FR-004 empty or whitespace-only title returns null'`: `''` and `'   '` both give `null`;
  - `createTask` does not mutate the input array.

  Confirm the tests fail, because `createTask` isn't exported yet
- [X] T004 [P] [US1] Add US1 tests to `e2e/core-flow-005.spec.js`:
  - `005:FR-001 Enter in the input adds a task`;
  - `005:FR-003 input is cleared and keeps focus after adding`: `#task-input` has value `''` and `toBeFocused()`;
  - `005:FR-004 blank title is refused with a linked error`: fill `'   '`, press Add task. The task count is unchanged, `#task-input` has `aria-invalid="true"` and `aria-describedby="task-input-error"`, and `#task-input-error` has the text "Enter a task title.". After typing a letter the error text is empty and `aria-invalid` is gone;
  - `005:FR-011 a cleared title in the dialog is restored on close`: open task-1, fill the title with `''`, press Escape. The row title is "Prepare launch recap" again;
  - `005:FR-012 a title with HTML renders as text`: add `<b>x</b>`; the row text is literally `<b>x</b>` and there is no `b` element inside `#task-list`.

  Run them and confirm they fail

### Implementation for User Story 1

- [X] T005 [US1] In `logic.js`, export `createTask(tasks, title)`, implementing data-model "Task": the title is "Non-empty after trimming"; the new id is "(highest N + 1)"; `description`, `tag` and `owner` "Default `''`"; `completed` is "`false` for new tasks". It returns `null` for an empty trimmed title. Make sure T003 passes
- [X] T006 [US1] In `index.html`, change `<section class="composer">` to `<form class="composer" novalidate data-spec="005:FR-001">` (and the closing tag). Give `#add-task-button` `type="submit"` and add `005:FR-001` to its `data-spec`. Add `005:FR-004` to `#task-input`'s `data-spec`. After the button, add `<p id="task-input-error" class="field-error" data-spec="005:FR-004"></p>`, placed so that it spans the full composer width. Keep every existing attribute
- [X] T007 [P] [US1] In `styles.css`, add `.field-error`:
  - `grid-column: 1 / -1`, `margin: 0`;
  - `font-size: var(--text-caption-size)`, `line-height: var(--text-caption-lh)`, `color: var(--text-primary)`;
  - a leading marker: `::before` with `content: "Error: "` and `font-weight: var(--weight-semibold)`, shown only when the element isn't empty (`.field-error:empty { display: none; }`);
  - `#task-input[aria-invalid="true"]` gets `border-color: var(--border-strong)` and `border-width: 2px`.

  Never use red as the text colour (003 FR-010). The state is shown by text and border weight
- [X] T008 [US1] In `app.js`:
  - add a `submit` listener on `form.composer`. It calls `event.preventDefault()`, then `createTask(taskState, input.value)`. On `null` it calls `showInputError()`. Otherwise it pushes the task, calls `refresh()`, sets `input.value = ''` and `input.focus()`;
  - `showInputError()` sets `aria-invalid="true"` and `aria-describedby="task-input-error"` on `#task-input`, and the text "Enter a task title." on `#task-input-error`;
  - an `input` listener on `#task-input` clears both.

  The existing click delegation keeps calling `renderTrace('add-task-button')` (US1/AC6). Add `// T008`
- [X] T009 [US1] In `app.js`, implement FR-011 (research R7): `renderTaskModal()` stores `titleOnOpen = task.title`, and the dialog's `close` listener first checks the selected task. If its trimmed title is `''`, it sets the title back to `titleOnOpen` and calls `refresh()`. Then the existing focus return runs. Add `// T009`
- [X] T010 [US1] Run `npm test`, `npm run lint`, `npm run lint:security`, `npm run format:check` and `npm run test:e2e`. T003, T004 and the 004 test "001:US5 add a task" pass. The other three 004 gaps may still fail

---

## Phase 4: User Story 2 - Filteren op status (Priority: P1)

**Goal**: The filters actually filter. The list updates on every change. Adding under Completed shows a notice.

**Independent Test**: The 004 test "001:FR-008 filter All, Active, Completed" passes, and so do the new US2 tests.

### Tests for User Story 2 ⚠️

- [X] T011 [P] [US2] Add `filterTasks` tests to `core-flow.test.js`: `'005:FR-005 all/active/completed return the right subsets'` (with a mixed list of 3) and `'005:FR-005 unknown filter falls back to all'`. Confirm they fail
- [X] T012 [P] [US2] Add to `e2e/core-flow-005.spec.js`:
  - `005:FR-005 checking off under Active hides the task immediately`;
  - `005:FR-005 adding under Completed adds it to Active and announces it`: Completed is selected and you add "X". `#app-status` has `role="status"` and the text "Task added to Active", "X" is not visible, and after choosing Active, "X" is visible;
  - `005:FR-006 selected filter is exposed with aria-pressed`;
  - `005:SC-003 keyboard-only: add, check off, and find under Completed within 10 seconds` (analyze G2). It uses only `page.keyboard` (type, Enter, Tab or Shift+Tab, Space) after focusing `#task-input`. It measures the elapsed time with `Date.now()`, asserts that the new task is visible under Completed, and that the time is under 10000 ms.

  Confirm they fail

### Implementation for User Story 2

- [X] T013 [US2] In `logic.js`, export `filterTasks(tasks, filter)` per data-model "Filter": `'all'` returns everything, `'active'` returns `!completed`, `'completed'` returns `completed`, and anything else is treated as `'all'`. Make sure T011 passes
- [X] T014 [US2] In `index.html`, wrap `#save-state` in `<div class="meta-actions">` inside `footer.meta-row` and add `<p id="app-status" class="app-status" role="status" data-spec="005:FR-005 005:FR-010"></p>` after it in the same wrapper, so the footer keeps two items (analyze L1, I1). Add `005:FR-005` to the `data-spec` of the three `.filter-btn`s. In `styles.css`:
  - add `.meta-actions` (`display: flex`, `align-items: center`, `gap: var(--space-3)`, `flex-wrap: wrap`);
  - add `.app-status` (caption size, `--text-secondary`, `margin: 0`).

  Make sure `design.test.js` (which matches `#save-state`'s classes) still passes
- [X] T015 [US2] In `app.js`:
  - in the existing filter branch of the click handler (T030 from 003), also set `currentFilter` to `all`, `active` or `completed` (from `dataTarget`), then call `refresh()`;
  - `renderTaskList()` iterates over `filterTasks(taskState, currentFilter)` instead of `taskState`;
  - add `showStatus(text)`, which sets `#app-status` text and clears it after 4000 ms; a new call cancels the previous timer;
  - in the submit handler (T008), when `currentFilter === 'completed'`, call `showStatus('Task added to Active')`.

  Add `// T015`
- [X] T016 [US2] Run the full suite as in T010. The 004 test "001:FR-008 filter" and the T011 and T012 tests pass

---

## Phase 5: User Story 3 - Lege staat (Priority: P2)

**Goal**: When the filtered list is empty, the empty state shows text that fits the situation.

**Independent Test**: The 004 test "001:FR-009 empty state when a filter has no tasks" passes, and so do the new US3 tests.

### Tests for User Story 3 ⚠️

- [X] T017 [P] [US3] Add `emptyStateText(filter, totalCount)` tests to `core-flow.test.js`. Each case returns exactly the heading and text from the data-model table:
  - `('all', 0)` gives "No tasks yet" / "Start by adding the first item to your spec-driven workflow.";
  - `('active', 2)` gives "No active tasks" / "Everything is done. Add a new task to keep going.";
  - `('completed', 2)` gives "No completed tasks" / "Check off a task to see it here.";
  - `('active', 0)` and `('completed', 0)` give "No tasks yet" with the 'all' text (analyze A1).

  Confirm they fail
- [X] T018 [P] [US3] Add to `e2e/core-flow-005.spec.js`: `005:FR-007 empty state shows filter-specific text and hides the list` (Active with every task done: heading "No active tasks", `#task-list` hidden) and `005:FR-007 empty state disappears when a task matches again` (un-check a task under Completed until the list is empty, then choose Active). Confirm they fail

### Implementation for User Story 3

- [X] T019 [US3] In `logic.js`, export `emptyStateText(filter, totalCount)`, returning `{ heading, text }` per the data-model table, including the rule "When `totalCount === 0` … the heading is always 'No tasks yet'". Make sure T017 passes
- [X] T020 [US3] In `app.js`, at the end of `renderTaskList()`: when the filtered list is empty, set `taskListEl.hidden = true`, `emptyStateEl.hidden = false` and fill its `h3` and `p` with `textContent` from `emptyStateText(currentFilter, taskState.length)`; otherwise do the reverse. In `index.html`, add `005:FR-007` to `#empty-state`'s `data-spec`. Add `// T020`
- [X] T021 [US3] Run the full suite. The 004 test "001:FR-009 empty state" and the T017 and T018 tests pass

---

## Phase 6: User Story 4 - Taken blijven bewaard na herladen (Priority: P2)

**Goal**: Every change is saved automatically under a versioned key, with a fallback to the example tasks. Persist confirms.

**Independent Test**: The 004 test "001:FR-010 persist, reload, tasks remain" passes, and so do the new US4 tests.

### Tests for User Story 4 ⚠️

- [X] T022 [P] [US4] Add to `core-flow.test.js`:
  - `'005:FR-008 serializeState writes version 1'`;
  - `'005:FR-008 parseState round-trips serializeState'`;
  - `'005:FR-009 parseState falls back'`, one case per data-model rule: `null`, `'{broken'`, `{version:2,…}`, `{version:1,tasks:{}}`, and a task missing a string `id`, a string `title` or a boolean `completed`. Each returns the fallback array;
  - `'005:FR-009 missing optional fields become empty strings'`;
  - `'005:FR-011 a blank stored title is repaired to Untitled task'`: a stored task with title `'  '` is loaded with title `Untitled task`, and the other tasks are unchanged (analyze U1).

  Confirm they fail
- [X] T023 [P] [US4] Add to `e2e/core-flow-005.spec.js`:
  - `005:FR-008 add, check off and edit survive a reload` (no Persist click);
  - `005:FR-009 corrupt stored state falls back to the example tasks`: `addInitScript` sets the key to `'{broken'`, and after load the two example titles are visible;
  - `005:FR-010 Persist announces "Demo state saved"`;
  - `005:FR-008 the demo keeps working when storage is blocked` (analyze G3): `addInitScript` replaces `Storage.prototype.setItem` and `getItem` with functions that throw. The example tasks load, adding a task works, filtering works, and the page has no uncaught errors (`page.on('pageerror')` collects none).

  Confirm they fail

### Implementation for User Story 4

- [X] T024 [US4] In `logic.js`, export `STORAGE_KEY = 'spec-driven-todo-demo'`, `serializeState(tasks)` (JSON with `{ version: 1, tasks }`) and `parseState(raw, fallbackTasks)`. `parseState` implements every "Rejected as a whole" rule from data-model "DemoState" verbatim, and makes "Optional string fields that are missing or not strings become `''`". It also applies "Repaired, not rejected: a task whose `title` is empty after trimming gets the title `Untitled task`". It returns a fresh copy of the fallback. Make sure T022 passes
- [X] T025 [US4] In `app.js`, rename the inline `taskState` literal to `exampleTasks`, and initialise `const taskState = parseState(readStorage(), exampleTasks)`. Add `readStorage()` and `writeStorage(value)`, each wrapping `localStorage` in `try/catch` and returning `null` or doing nothing on error (spec edge case "Opslag niet beschikbaar"). `refresh()` now also calls `writeStorage(serializeState(taskState))`. Keep `selectedTaskId` pointing at `taskState[0]?.id`. Add `// T025`
- [X] T026 [US4] In `app.js`, add to the click handler for `dataTarget === 'save-state'`: `writeStorage(serializeState(taskState))`, then `showStatus('Demo state saved')`. Leave the existing `renderTrace('save-state')` call as it is. In `index.html`, add `005:FR-010` to `#save-state`'s `data-spec`. Add `// T026`
- [X] T027 [US4] Run the full suite. All 13 original browser tests and every 005 e2e test pass. `npm test`, `lint`, `lint:security` and `format:check` are clean

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T028 Remove the `// T032 Known 001 gap …` comment from `logic.js`, because the gap is closed. Run `npm test`
- [X] T029 Walk through the seven manual checks in `specs/005-complete-core-flow/quickstart.md` (headless Chromium is fine) and record the results under a new "Results" heading in that file
- [X] T030 Append `## Phase: implement` to `specs/005-complete-core-flow/prompts.md`, commit, and tag `005-implement`
- [X] T031 **After confirmation**: push `005-complete-core-flow` and its tags, and open a PR to `main`, so the 004 quality gate runs on 005's code. Make sure `code`, `security`, `usability` and `CodeQL` are all green. Record the run URL in `quickstart.md`
- [X] T032 **After confirmation**: retarget the PR to `004-ci-quality-gates` (`gh pr edit --base 004-ci-quality-gates`) and merge it. Make sure PR #2's checks re-run and are all green. Then hand back to 004 T036 (merge #1, then #2, into `main`, then branch protection)

---

## Dependencies & Execution Order

- **Setup → Foundational**: T001 → T002.
- **US1 (P1)**: after T002. It is the MVP.
- **US2 (P1)**: after T002. It uses the submit handler from T008 for the Completed notice, so in practice it follows US1.
- **US3 (P2)**: needs US2 (`currentFilter` and the filtered render).
- **US4 (P2)**: after T002. It can run in parallel with US2 and US3 in `logic.js` and its tests, but `app.js` edits are sequential: T008 → T009 → T015 → T020 → T025 → T026.
- **Polish**: after all stories. T031 and T032 need the owner's confirmation.

### Parallel Opportunities

- The test tasks for each story (unit in `core-flow.test.js`, e2e in `e2e/core-flow-005.spec.js`) are marked [P] against each other. They are different files.
- T007 (`styles.css`) can run in parallel with T006 and T008.

## Parallel Example: User Story 1

```bash
Task: "createTask unit tests in core-flow.test.js"            # T003
Task: "US1 e2e tests in e2e/core-flow-005.spec.js"           # T004
Task: ".field-error styles in styles.css"                     # T007 (after T006 defines the element)
```

## Implementation Strategy

1. **MVP**: Setup, Foundational and US1. Adding works, and one of the four red 004 tests turns green.
2. US2 brings filters, US3 the empty state and US4 persistence. Each turns one more 004 test green.
3. Polish ends with the PR. All three gate checks must be green before it merges into `004-ci-quality-gates`.

## Notes

- The definition of done is 004 SC-004 together with 005 SC-001: the `usability` check is green on the PR.
- Out of scope, recorded in research R8: the spec-03 trace `elementIds` don't match the checkbox `data-target`s.
