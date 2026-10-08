# Quickstart: validate the phase tabs

## Prerequisites

- Node 24 and a clean `npm ci`.
- Chromium for Playwright: `npx playwright install chromium`.

## Automated checks

```bash
npm test              # incl. markdown.test.js, docs.test.js (manifest + SC-001 fidelity), trace, privacy
npm run lint
npm run lint:security # markdown.js and docs.js must pass no-unsanitized without exceptions
npm run format:check
npm run test:e2e      # spec-tabs, keyboard, axe with every tab open, core flow
```

All must pass. These are the same steps as the three quality-gate checks from 004.

## Manual scenarios

Start the demo with `node scripts/serve.js` and open `http://localhost:8000`.

| # | Do | Expect | Covers |
|---|----|--------|--------|
| 1 | Load the page. | The panel shows the selection line for `add-task-button`, a switcher with `003` and `005`, six tabs with specify active, and the full `specs/003-adopt-polderworks-design/spec.md` rendered. | US1-1, US1-2, FR-001, FR-002 |
| 2 | Compare the specify tab with the file on GitHub. | Same headings, lists, tables and text. | SC-001, FR-006 |
| 3 | Click `005` in the switcher. | The specify tab now shows 005's `spec.md`. | US2-1, US2-2 |
| 4 | Open the plan tab. | `plan.md` with buttons for `research.md`, `data-model.md`, `quickstart.md`, `contracts/ui-behaviour.md`. Each opens. | US1-3, FR-004 |
| 5 | Open the tasks tab. | `tasks.md` with done and open boxes. | US1-4 |
| 6 | Open clarify, analyze and implement. | The `Clarifications` section of `spec.md`, and the `Phase: analyze` and `Phase: implement` sections of `prompts.md`, each with its source path. | US1-5, FR-005 |
| 7 | With the tasks tab open, click the app header. | Tasks tab stays open, now for feature 003. | US2-3, FR-008 |
| 8 | Select an element linked to 001 and open clarify. | Notice: the clarify phase has not been run for feature 001. | FR-009 |
| 9 | Keyboard only: Tab to the tabs, use Left, Right, Home, End, then Tab into the document and scroll with the arrow keys. | Focus is always visible. The document scrolls. | US3, FR-011, SC-005 |
| 10 | Make the window 375 px wide. | Tabs wrap; no horizontal page scroll. | Edge case "Smalle schermen" |
| 11 | In DevTools, block the URL pattern `*/specs/*` (Network request blocking), then click another tab. | Notice: the document could not be loaded, with its path. The board still works. | Edge case, SC-006 |
| 12 | Click quickly between several elements. | The panel ends on the last selection's document. | Research R8 |

## Results

- **Baseline (T001, 2026-10-07)**: `npm test` 68 of 68. `npm run test:e2e` 28 of 28 with one worker; with parallel workers, `004:FR-010 every control receives visible focus` failed intermittently on a cold start (`gotoApp` waits 5 s for Add task to be enabled). That flake exists on `main` and is not caused by 007.
- **Automated (T028, 2026-10-08)**: `npm test` 83 of 83 (68 − 4 removed trace tests + 19 new). `npm run lint`, `npm run lint:security` and `npm run format:check` clean. `npm run test:e2e` 46 of 46, five parallel runs in a row; the cold-start flake above can still appear on the first run after a pause.
- **Manual scenarios (headless Chromium, 1280 × 900)**:

| # | Result |
|---|--------|
| 1 | Pass. Selection "Element add-task-button · Feature 003 Polderworks-designsysteem adopteren", switcher `003 005`, `specs/003-adopt-polderworks-design/spec.md` rendered. |
| 2 | Pass. Headings, lists, inline code and bold match the file; SC-001 is also proven word for word by `docs.test.js` for all documents. |
| 3 | Pass. `specs/005-complete-core-flow/spec.md`. |
| 4 | Pass. `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/ui-behaviour.md`; each opens with its own path. |
| 5 | Pass. 32 done boxes, 0 open in 005 `tasks.md`. |
| 6 | Pass. "spec.md · section Clarifications", "prompts.md · section Phase: analyze" and "Phase: implement". |
| 7 | Pass. Tasks tab stays selected; now `specs/003-adopt-polderworks-design/tasks.md`. |
| 8 | Pass. "The clarify phase has not been run for feature 001 yet. Expected at specs/001-spec-driven-todo-demo/spec.md." |
| 9 | Pass. Home, Right and End move the selection and the visible focus; Tab reaches the panel. Scrolling a long document with the keyboard is proven by the T022 test. |
| 10 | Pass. 375 px: tabs wrap onto two lines, horizontal overflow 0. |
| 11 | Pass. With `**/specs/**` blocked: "This document could not be loaded. Check that the demo server is running, or read it at …"; adding a task still works. |
| 12 | Pass. After five quick clicks the panel shows the last selection (`task-input`, feature 003). |
