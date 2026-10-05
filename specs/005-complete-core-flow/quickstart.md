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

## Results (T029, 2026-10-05)

Run locally on macOS, Node 26, Playwright Chromium.

| Check | Result |
|-------|--------|
| `npm test` | 54 of 54 pass. 14 of them are new unit tests in `core-flow.test.js` |
| `npm run lint`, `lint:security`, `format:check` | clean |
| `npm run test:e2e` | 28 of 28 pass, in three consecutive runs. The four former 004 gaps (add, filters, empty state, persist) are green |
| Manual 1, Enter adds | "Buy milk" appears last. The input is empty and focused |
| Manual 2, blank title | "Enter a task title.", with `aria-describedby="task-input-error"` |
| Manual 3, Active hides a checked-off task | covered by e2e `005:FR-005` and `005:FR-007` |
| Manual 4, add under Completed | "Task added to Active" appears and is empty again after 4.3 s |
| Manual 5, edit and reload, Persist | covered by e2e `005:FR-008`. Persist shows "Demo state saved" |
| Manual 6, broken storage | the two example tasks, with no error |
| Manual 7, cleared dialog title | covered by e2e `005:FR-011` |

**Found and fixed while implementing** (outside the task list, recorded here):

1. **axe `aria-prohibited-attr` (serious) on `#trace-object`.** The `aria-label` added in 004 isn't allowed on a plain `<pre>`. axe only reported it intermittently. It now has `role="region"`, which makes the label valid.
2. **A race in the browser tests.** `page.goto` sometimes returned before `app.js` had run, so pressing Enter submitted the form natively and reloaded `/?`.
   - In the app, "Add task" starts `disabled` and is enabled once the submit handler is attached, so a native submit can't happen.
   - In the tests, a shared `gotoApp(page)` helper in `e2e/fixtures.js` waits for that.
3. **Flaky local test server.** Under parallel workers, `python3 -m http.server` stalled or refused connections (its listen backlog is small). Playwright's `webServer` now runs `node scripts/serve.js`, a small dependency-free static server. `npm start` stays on Python, as the 004 contract specifies.

## Results on GitHub (T031, T032, 2026-10-05)

- PR #8 against `main`, run 37367040587: `code`, `security`, `usability` and `CodeQL` are all green. The first attempt and one re-run were cancelled without starting, because no runner was available during a GitHub Actions incident ("degraded performance" on githubstatus.com). A job-level re-run passed.
- PR #8 was retargeted to `004-ci-quality-gates` and merged on 2026-10-05 (merge commit). PR #2 then carries 004 and 005 together, and its checks re-run on that head.
