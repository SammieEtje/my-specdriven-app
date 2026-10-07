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
