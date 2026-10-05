# Quickstart: validate feature 005

## Run

```bash
npm test             # includes core-flow.test.js
npm run test:e2e     # all browser tests must pass, including the four 004 core-flow tests
npm run lint && npm run format:check && npm run lint:security
```

**Expected**: everything is green. The four tests that failed on 004 now pass
("001:US5 add a task", "001:FR-008 filter", "001:FR-009 empty state", "001:FR-010 persist").

## Manual checks (`npm start`, then http://localhost:8000)

1. Type "Buy milk" and press Enter. It appears last, active. The input is empty and still focused.
2. Press Add task with an empty input. "Enter a task title." appears below the field, and a screen
   reader announces it with the field. Typing clears it.
3. Choose Active, then check off "Prepare launch recap". It disappears. Choose Active again with
   all tasks done, and "No active tasks" shows.
4. Choose Completed and add "X". "Task added to Active" is announced, and "X" isn't shown until you
   choose All or Active.
5. Edit a title, reload. The edit is still there. Press "Persist demo state", and "Demo state
   saved" appears and then fades.
6. In DevTools, set `localStorage['spec-driven-todo-demo'] = '{broken'` and reload. The two example
   tasks show, with no error.
7. Open a task, clear its title and press Escape. The previous title comes back.

## On GitHub

Open the PR against `main` first, so the quality gate runs (004). Expect `code`, `security` and
`usability` to be green. Then retarget the PR to `004-ci-quality-gates` and merge (research R9).
