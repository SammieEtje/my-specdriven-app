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
