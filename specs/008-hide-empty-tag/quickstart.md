# Quickstart: validate the empty tag fix

## Automated checks

```bash
npm test              # incl. tag.test.js (hasTag, metaLine) and the trace check
npm run lint
npm run lint:security # the tag insert must pass no-unsanitized without exceptions
npm run format:check
npm run test:e2e      # incl. e2e/empty-tag-008.spec.js
```

## Manual scenarios

Start with `npm start` and open `http://localhost:8000`. Clear the saved state first (DevTools, Application, Local Storage) so the two example tasks are back.

| # | Do | Expect | Covers |
|---|----|--------|--------|
| 1 | Add "Review onboarding checklist". | No tag frame on the new card; no "·" under the title. Open is level with the other Open buttons. | US1-1, US2-1, FR-006 |
| 2 | Look at "Prepare launch recap". | Frame "Marketing"; "Ava · Marketing" under the title. | US1-2, US2-4 |
| 3 | Open the new task, type tag "Test". | The frame "Test" appears on the card while typing; the line reads "Test". | US1-3 |
| 4 | Clear the tag again. | The frame disappears at once. | US1-4 |
| 5 | Type a tag of only spaces. | No frame. | US1-5 |
| 6 | Set owner "Ava", close, check off the task. | Line reads "Ava · Completed". | US2-2, US2-3 |
| 7 | Reload. | Same result: no frame on the task without tag. | Edge case "Bewaarde taken" |
| 8 | Switch through All, Active and Completed. | Same behaviour in every filter. | Edge case "Filters" |

## Results

- **Baseline (T001, 2026-10-09)**: `npm test` 68 of 68; `npm run test:e2e -- --workers=1` 28 of 28.
- **Automated (T008, 2026-10-09)**: `npm test` 71 of 71 (3 new in `tag.test.js`); `npm run lint`, `npm run lint:security` and `npm run format:check` clean; `npm run test:e2e -- --workers=1` 39 of 39 (11 new in `e2e/empty-tag-008.spec.js`).
- **Parallel e2e locally**: unreliable while the owner's own `npm start` (Python `http.server`) holds port 8000, because Playwright reuses that server and it stalls under parallel load (the reason 005 added `scripts/serve.js`). CI starts its own server. Confirmed on 2026-10-09: with port 8000 free, three parallel runs in a row passed 39 of 39 (about 3 s each).
- **Manual scenarios (headless Chromium, 1280 × 900, fresh storage)**:

| # | Result |
|---|--------|
| 1 | Pass. New task: no tag frame, empty line under the title; Open right edges 698, 698, 698 px. |
| 2 | Pass. "Marketing" frame; "Ava · Marketing". |
| 3 | Pass. Typing "Test" shows the frame "Test" and the line "Test" at once. |
| 4 | Pass. Clearing the tag removes the frame. |
| 5 | Pass. Three spaces: no frame, empty line. |
| 6 | Pass. Owner "Ava" and checked off: "Ava · Completed". |
| 7 | Pass. After reload: still no frame, "Ava · Completed". |
| 8 | Pass. All: frames on the two example tasks only; Active and Completed the same. |
- **Quality gate (T010, 2026-10-09)**: PR [#14](https://github.com/SammieEtje/my-specdriven-app/pull/14), run [37933414542](https://github.com/SammieEtje/my-specdriven-app/actions/runs/37933414542): `code`, `security`, `usability` and CodeQL all pass. PR #13 (007) was still open, so no `docs.js` entry was needed.
