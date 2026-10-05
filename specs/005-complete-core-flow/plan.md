# Implementation Plan: Kernflow uit feature 001 voltooien

**Branch**: `005-complete-core-flow` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-complete-core-flow/spec.md`

## Summary

Build the four 001 behaviours that were specified but never implemented.

- **Add a task:** a form submit handles both the click and Enter. A blank title is refused, with
  an error linked to the field.
- **Filters:** they actually filter the list.
- **Empty state:** shown when a filter has no tasks, with text that fits the situation.
- **Persistence:** automatic `localStorage` save on every change, with a versioned format and a
  fallback to the example tasks. "Persist demo state" saves on demand and confirms in a
  `role="status"` region.

A cleared title in the dialog is restored on close. The pure logic goes in `logic.js` with unit
tests; `app.js` keeps the DOM wiring. Acceptance is the 004 quality gate: the four red core-flow
tests turn green and everything else stays green.

## Technical Context

**Language/Version**: Browser JavaScript ES modules, HTML and CSS, as in 001, 003 and 004.

**Primary Dependencies**: None at runtime. Dev tooling is the 004 set (node test, ESLint,
Prettier, Playwright and axe).

**Storage**: `localStorage`, one key, `spec-driven-todo-demo`, holding JSON with `version: 1` (R3).

**Testing**: `node --test` (new `core-flow.test.js`) and Playwright (the four existing 004
core-flow tests plus the new `e2e/core-flow-005.spec.js`). The 004 gate runs on the PR.

**Target Platform**: Current evergreen browsers, served by `python3 -m http.server`.

**Project Type**: Single-page static web app, no build step.

**Performance Goals**: Adding, filtering and saving feel instant. The list holds a few tasks, so a
full re-render per change is fine.

**Constraints**:
- No runtime dependency (constitution I).
- Storage stays local (V).
- Keyboard operable, with errors linked by `aria-describedby` (IV).
- 001, 003 and 004 behaviour and attributes unchanged (FR-012).
- User input stays escaped (004 R6).

**Scale/Scope**: About 5 pure functions, small edits to `index.html`, `app.js` and `styles.css`,
one unit test file and one e2e spec.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Eenvoud boven alles | Pass | No dependencies. A native form for Enter (R4), one live region (R6), full re-render (R5). |
| II. Elke requirement is testbaar | Pass | FR-001 to FR-011 each have a unit or e2e test (R10). FR-012 and FR-013 are covered by the existing 003 and 004 tests (`design.test.js`, `trace.test.js`, axe, keyboard). |
| III. Traceerbaarheid | Pass | `005:FR-xxx` tokens on new and changed elements, validated by `trace.test.js`. Task-ID comments, `prompts.md`, and `005-<phase>` tags. |
| IV. Toegankelijk | Pass | Field error via `aria-invalid` and `aria-describedby`, status via `role="status"`, focus kept in the input after adding. axe and keyboard tests run on the PR. |
| V. Gebruikersdata blijft lokaal | Pass | `localStorage` only, with no network. The 004 privacy checks keep guarding this. |

**Post-design re-check**: Still passes.

## Project Structure

### Documentation (this feature)

```text
specs/005-complete-core-flow/
├── plan.md
├── research.md          # R1–R10
├── data-model.md        # Task, DemoState, Filter
├── quickstart.md
├── contracts/
│   └── ui-behaviour.md  # element ids, events, messages, storage key
├── checklists/requirements.md
├── prompts.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
logic.js                 # + createTask, filterTasks, emptyStateText, serializeState, parseState
core-flow.test.js        # new: unit tests for the above
app.js                   # submit handler, currentFilter, render filtered list and empty state, auto-save, status, title restore
index.html               # form.composer, #task-input-error, #app-status, 005 data-spec tokens
styles.css               # error and status text styles (design-system tokens only, 003 rules)
e2e/core-flow-005.spec.js  # new: Enter, focus, blank title, notice, storage fallback, persist confirmation, title restore
```

**Structure Decision**: Unchanged flat layout. The branch is stacked on `004-ci-quality-gates`
(R9).

## Complexity Tracking

No constitution violations to justify. One process note: the PR temporarily targets `main` to get
quality-gate feedback, then is retargeted to `004-ci-quality-gates` before merging (R9).
