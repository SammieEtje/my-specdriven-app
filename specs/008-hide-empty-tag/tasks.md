---

description: "Task list for hiding the empty tag frame"
---

# Tasks: Geen leeg tagkader bij taken zonder tag

**Input**: Design documents from `/specs/008-hide-empty-tag/`

**Prerequisites**: plan.md, spec.md, research.md (R1 to R5), data-model.md, contracts/ui-card.md, quickstart.md

**Tests**: Included (constitution II). Write the tests first and confirm they fail.

**Organization**: Foundational adds the two pure functions. Then US1 (tag frame) and US2 (line under the title).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Conventions for every task

- **Contract is binding**: classes and `data-spec` tokens exactly as in `contracts/ui-card.md`.
- **Keep what exists**: no id, `data-target` or existing `data-spec` token is removed or renamed.
- **Escaping (004 FR-007)**: every insert of task data uses the `html` tagged template directly. No conditional HTML fragments: `npm run lint:security` rejects them (research R1).
- **Traceability**: a task-ID comment by each change (`// T006`). New test titles start with the `008:FR-xxx` or `008:SC-xxx` they cover.
- **Formatting**: run `npm run format` after editing; `npm run lint` and `npm run format:check` must pass.

---

## Phase 1: Setup

- [ ] T001 Record the baseline: `npm test` (expect 68 of 68) and `npm run test:e2e -- --workers=1` (expect 28 of 28; the `--` passes the flag on to Playwright). Create a "Results" heading in `specs/008-hide-empty-tag/quickstart.md` and write both numbers there

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: US1 needs `hasTag`, US2 needs `metaLine`.

- [ ] T002 [P] Create `tag.test.js` (node:test) for `hasTag(task)` and `metaLine(task)` from `logic.js`, per `data-model.md`:
  - `'008:FR-001 hasTag'`: `true` for `'Marketing'` and `' Marketing '`; `false` for `''`, `'   '`, `undefined` and `null` ("`true` when `task.tag` is a string that is not empty after `trim()`");
  - `'008:FR-004 metaLine'`: every row of the `metaLine` examples table in `data-model.md`, for example owner `Ava`, tag `''`, not completed gives `Ava`; owner `''`, tag `''`, completed gives `Completed`; owner `'  '`, tag `'  '` gives `''`;
  - `'008:SC-003 metaLine never has a stray separator'`: for all 8 combinations of owner (`''` or `Ava`), tag (`''` or `Tag`) and completed, the result does not start or end with `·` and does not contain `·  ·` or `· ·`
- [ ] T003 Add `hasTag(task)` and `metaLine(task)` to `logic.js`, with a `// T003 (008)` comment, exactly per `data-model.md`: `metaLine` returns "The trimmed owner, the trimmed tag and `Completed` (only when `task.completed`), leaving out empty parts, joined with ` · `". Make T002 pass

**Checkpoint**: `npm test` passes; nothing visible changed yet.

---

## Phase 3: User Story 1 - Geen leeg tagkader (Priority: P1) 🎯 MVP

**Goal**: A task without a tag has no tag frame; a task with a tag looks as before.

**Independent Test**: Add a task through the input: no `.tag` on its card. The example tasks keep their frames (quickstart scenarios 1 to 5, 7 and 8).

### Tests for User Story 1 ⚠️

- [ ] T004 [P] [US1] Create `e2e/empty-tag-008.spec.js` (import `{ test, expect, gotoApp }` from `./fixtures.js`, `beforeEach` calls `gotoApp(page)`; every test gets a fresh context, so the two example tasks are there). Helper: `card(page, title)` returns `page.locator('.task-card', { hasText: title })`. Tests:
  - `'008:FR-001 FR-002 a task without a tag has no tag frame'`: add "No tag here"; its card has `.tag` count 0;
  - `'008:FR-005 tagged tasks keep their frame'`: "Prepare launch recap" has one `.tag` with text "Marketing" and `data-spec` containing `003:FR-003`;
  - `'008:FR-003 adding and clearing a tag in the dialog updates the card'`: add "Tag me", open it, fill `#task-tag-field` with "Test": the card's `.tag` reads "Test"; fill it with "": `.tag` count 0;
  - `'008:FR-001 a tag of only spaces counts as empty'`: open "Tag me", fill the tag with three spaces: `.tag` count 0;
  - `'008:FR-006 Open buttons share one right edge'`: add "No tag here"; the `boundingBox()` right edges (`x + width`) of the Open buttons of all three cards are equal within 1 px;
  - `'008:FR-002 a card without a tag passes axe'`: add "No tag here", then run axe with the WCAG 2.1 AA tags as in `e2e/a11y.spec.js` (import `AxeBuilder` from `@axe-core/playwright`) and expect no serious or critical violations (constitution IV);
  - `'008:FR-001 same in every filter and after reload'`: add "No tag here"; for `filter-all` and `filter-active` its card has no `.tag`; check it off, then `filter-completed`: still no `.tag`; reload: still no `.tag`

### Implementation for User Story 1

- [ ] T005 [US1] In `renderTaskList` in `app.js`, remove the `<span class="tag" ...>` from the card template. After inserting the card, when `hasTag(task)` (import from `logic.js`), insert the tag into that card's `.task-meta-actions` with `insertAdjacentHTML('afterbegin', html`<span class="tag" data-spec="003:FR-003 008:FR-001">${task.tag}</span>`)` (research R1). Leave the checkbox line (its 003 test matches it literally) and the Open button unchanged. Make T004 pass and run `npm run lint:security`

**Checkpoint**: US1 works on its own; quickstart scenarios 1 to 5, 7 and 8 (tag frame parts).

---

## Phase 4: User Story 2 - Geen losse scheidingstekens (Priority: P2)

**Goal**: The line under the title shows only the parts that exist.

**Independent Test**: Add a task without owner and tag: no "·" under the title; check it off: "Completed" only (quickstart scenarios 1, 2 and 6).

### Tests for User Story 2 ⚠️

- [ ] T006 [US2] Add to `e2e/empty-tag-008.spec.js`:
  - `'008:FR-004 no separators when owner and tag are empty'`: add "Bare task"; its `.meta` text, trimmed, is `''`; check it off: `.meta` reads `Completed`;
  - `'008:FR-004 owner only'`: open "Bare task", set `#task-owner-field` to "Ava", close: `.meta` reads `Ava`;
  - `'008:FR-004 unchanged for full metadata'`: "Prepare launch recap" `.meta` reads `Ava · Marketing`; "Share spec checklist" reads `Leo · Product · Completed`;
  - `'008:FR-004 meta line carries its trace'`: the `.meta` of any card has `data-spec` containing `008:FR-004`

### Implementation for User Story 2

- [ ] T007 [US2] In `renderTaskList` in `app.js`, replace the meta text `${task.owner} · ${task.tag}${task.completed ? ' · Completed' : ''}` with `${metaLine(task)}` and add `data-spec="008:FR-004"` to that `span.meta`. Make T006 pass

**Checkpoint**: US1 and US2 work; all quickstart scenarios.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T008 Run the full gate: `npm test`, `npm run lint`, `npm run lint:security`, `npm run format:check`, `npm run test:e2e`. Walk through the 8 manual scenarios in `specs/008-hide-empty-tag/quickstart.md` (headless Chromium is fine) and record the results under "Results"
- [ ] T009 Append `## Phase: implement` to `specs/008-hide-empty-tag/prompts.md`, commit, and tag `008-implement`
- [ ] T010 **After confirmation**: push `008-hide-empty-tag` and its tags and open a PR to `main`. Make sure `code`, `security`, `usability` and CodeQL are green, and record the run in `quickstart.md`. If PR #13 (007) has merged by then, first update from `main`, add the 008 entry to `FEATURE_DOCS` in `docs.js` (plan, Complexity Tracking) and run `node --test docs.test.js`: both the manifest test and the SC-001 word-for-word test of 007 now cover the 008 documents. If the word-for-word test fails on a 008 document (for example nested backticks), simplify that document

---

## Dependencies & Execution Order

- **Setup**: T001.
- **Foundational**: T002 → T003. Blocks both stories.
- **US1 (P1)**: after T003. T004 → T005. It is the MVP.
- **US2 (P2)**: after T003. T006 can be written alongside T004 (same file, so one after the other in practice); T007 edits `renderTaskList` too, so it runs after T005.
- **Polish**: after both stories. T010 needs the owner's confirmation.

### Parallel Opportunities

- T002 (`tag.test.js`) and T004 (`e2e/empty-tag-008.spec.js`) are different files and can be written together. The other tasks share `e2e/empty-tag-008.spec.js` or `renderTaskList` and run one after the other.

## Parallel Example: start

```bash
Task: "hasTag and metaLine unit tests in tag.test.js"      # T002
Task: "US1 browser tests in e2e/empty-tag-008.spec.js"     # T004
```

## Implementation Strategy

1. **MVP**: Setup, Foundational and US1. The empty frame from the screenshot is gone.
2. US2 removes the stray "·".
3. Polish ends with the PR.

## Notes

- No CSS or `index.html` change (research R3).
- Not in scope: the 007 panel message for `task-list` (no `data-spec`); that belongs in PR #13.
