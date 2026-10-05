---

description: "Task list for the pull-request quality gate"
---

# Tasks: Kwaliteitspoort voor pull requests

**Input**: Design documents from `/specs/004-ci-quality-gates/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R12), data-model.md, contracts/quality-gate.md, quickstart.md

**Tests**: Included. Constitution II requires automated coverage for every FR. Write each story's tests before its implementation and confirm they fail first.

**Organization**: Tasks are grouped by user story (US1 code, US2 security, US3 usability, US4 reporting).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Conventions for every task

- **Paths**: flat repository root, as in 001 and 003. CI config goes under `.github/` and browser tests under `e2e/`.
- **Contract is binding**: job ids `code`, `security` and `usability`, and the npm script names, are exactly as in `contracts/quality-gate.md`. Renaming them breaks branch protection.
- **Pinning (R2)**: every `uses:` is a 40-character commit SHA with a trailing `# vX.Y.Z` comment, and the gitleaks image is pinned by `@sha256:` digest. Resolve SHAs with `gh api repos/<owner>/<repo>/commits/<tag> --jq .sha`, never from memory.
- **Traceability (Constitution III)**: put a task-ID comment by each change (`# T012` in YAML, `// T012` in JS). Every Playwright test title starts with the 001 or 004 requirement it covers (contract §6).
- **Outward-facing steps**: pushing, opening PRs and changing repository settings happen only after the owner confirms in chat. The tasks that need this say "after confirmation".
- **No runtime dependencies (FR-017)**: everything added to `package.json` goes in `devDependencies`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Tooling, configuration and npm scripts

- [ ] T001 Add to `package.json` the `devDependencies` from R12: `eslint`, `@eslint/js`, `globals`, `prettier`, `eslint-plugin-no-unsanitized`, `@eslint-community/eslint-plugin-eslint-comments`, `@playwright/test` and `@axe-core/playwright`. Use the latest stable versions, installed with `npm install -D`, which writes `package-lock.json`. Add the scripts from contract §4: `lint`, `lint:security`, `format:check`, `format` and `test:e2e`, keeping `test` and `start` unchanged. For `lint`, the CI annotation formatter is chosen by `scripts/lint.js`, which runs ESLint with `--format ./scripts/eslint-github-formatter.js` when `process.env.CI` is set and with the default formatter otherwise. Add `"engines": { "node": ">=24" }`
- [ ] T002 [P] Create `.prettierrc.json` with `{ "singleQuote": true, "printWidth": 120, "trailingComma": "none" }` and `.prettierignore` listing `specs/`, `.specify/`, `.claude/`, `fonts/`, `package-lock.json`, `node_modules/`, `playwright-report/` and `test-results/` (R7)
- [ ] T003 [P] Create `eslint.config.js` (flat config) using `@eslint/js` `recommended`, with `globals.browser` for `app.js`, `logic.js` and `html.js`, and `globals.node` for `*.test.js`, `scripts/**`, `e2e/**` and the config files. Add the `@eslint-community/eslint-comments` plugin with `require-description: 'error'` (R8, FR-016) and `linterOptions.reportUnusedDisableDirectives: 'error'`. Ignore `node_modules/`, `.claude/`, `.specify/`, `specs/`, `playwright-report/` and `test-results/`
- [ ] T004 [P] Create `scripts/eslint-github-formatter.js`, a CommonJS-compatible ESLint formatter that prints one `::error file=<relative path>,line=<line>,col=<column>,title=<ruleId>::<message>` line per error (and `::warning` per warning), plus a final count line (FR-012, data-model "Finding: Surfacing"). Also create `scripts/lint.js` as described in T001
- [ ] T005 [P] Create `playwright.config.js`: `testDir: 'e2e'`, a single project `chromium` (`devices['Desktop Chrome']`), `webServer: { command: 'python3 -m http.server 8000', url: 'http://localhost:8000', reuseExistingServer: !process.env.CI }`, `use.baseURL: 'http://localhost:8000'`, `forbidOnly: !!process.env.CI`, `retries: 0` (a flaky pass would hide a real gap), and `reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list'`
- [ ] T006 [P] Create `.github/dependabot.yml` (version 2) with weekly updates for the `npm` ecosystem at `/` and the `github-actions` ecosystem at `/`, so the SHA pins and dev dependencies stay current (R2)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The workflow skeleton and a clean lint and format baseline. Every story adds steps to this skeleton.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Write `workflow.test.js` (node:test, reading `.github/workflows/quality-gate.yml` as text, with no YAML library) per R10. It asserts:
  - the `pull_request` trigger on branch `main` with types `opened`, `synchronize`, `reopened` and `ready_for_review`; a `push` trigger on `main`; and `workflow_dispatch` (FR-001)
  - no `paths:` or `paths-ignore:` key (spec edge case "alleen documentatie")
  - workflow-level `permissions:` with only `contents: read`, and the string `pull_request_target` absent (FR-014)
  - jobs named exactly `code:`, `security:` and `usability:` (FR-012)
  - every job has `timeout-minutes: 10`, and `continue-on-error` is absent (FR-015)
  - every `uses:` value matches `/@[0-9a-f]{40}\b/` (R2)
  - every `actions/checkout` step sets `persist-credentials: false`
  - the check steps exist in the right job (constitution II, covering FR-002, FR-003 and FR-005 to FR-007):
    - `code`: `npm test`, `npm run lint` and `npm run format:check`;
    - `security`: a gitleaks run containing `--redact`, `npm audit --audit-level=high`, `dependency-review-action` with `fail-on-severity: high`, `npm run lint:security`, `node --test privacy.test.js`, and `codeql-action/init` with `config-file: ./.github/codeql/codeql-config.yml` (whose file contains `security-extended`);
    - `usability`: `npm run test:e2e`.

    Write the step assertions per job by slicing the file text between the `code:`, `security:` and `usability:` job keys. Steps added by later tasks (T012, T020, T027) make these assertions pass in turn

  Run it and confirm it fails, because the file doesn't exist yet
- [ ] T008 Create `.github/workflows/quality-gate.yml` with `name: Quality gate`, the triggers from contract §1, workflow-level `permissions: contents: read` and `concurrency: { group: quality-gate-${{ github.event.pull_request.number || github.ref }}, cancel-in-progress: true }`. Add three jobs `code`, `security` and `usability`, each on `ubuntu-latest` with `timeout-minutes: 10`, each starting with `actions/checkout` (`persist-credentials: false`) and `actions/setup-node` (`node-version: 24`, `cache: npm`) followed by `npm ci`. Pin both actions by SHA as the conventions require. Run `npm test` and make sure T007 passes
- [ ] T009 Formatting baseline (R7): run `npm run format` once and review the diff. It must only change whitespace, quotes and line breaks. Run `npm test` and make sure all 17 existing tests still pass, because the 003 tests match source text in `app.js` and `index.html`. If a 003 source-text assertion breaks, adjust `.prettierrc.json` rather than the test. Commit this baseline separately from the rest of the work
- [ ] T010 Lint baseline: run `npm run lint` and fix every error in the existing files (`app.js`, `logic.js`, `logic.test.js`, `design.test.js`). Make no behaviour changes. Use an inline `eslint-disable-next-line … -- <reason>` only when a finding is a deliberate pattern. Run `npm test` again

**Checkpoint**: `npm test`, `npm run lint` and `npm run format:check` pass locally. The workflow skeleton passes `workflow.test.js`.

---

## Phase 3: User Story 1 - Codeproblemen blokkeren een merge (Priority: P1) 🎯 MVP

**Goal**: The `code` check runs the tests, ESLint, Prettier and the trace check, and fails on any problem with file and line.

**Independent Test**: Seeded violations #1 (failing test) and #2 (`003:FR-099`) from `quickstart.md` turn `code` red. Reverting them turns it green.

### Tests for User Story 1 ⚠️

- [ ] T011 [US1] Create `trace.test.js` (FR-004, constitution III). Export-free helpers inside the file:
  - `collectSpecTokens(source, file)` returns `{ token, feature, id, file, line }` for every `data-spec="…"` value, split on whitespace, in `index.html` and in the template strings in `app.js`.
  - `knownIds(feature)` reads `specs/<feature>-*/spec.md` and collects every `**FR-NNN**` and `**SC-NNN**` definition.

  Tests:
  - every token in `index.html` and `app.js` is known, and the failure message names the token, file and line;
  - a self-check where `collectSpecTokens('<p data-spec="003:FR-099">', 'fixture.html')` yields a token that `knownIds('003')` does not contain;
  - a token whose feature directory doesn't exist fails with a clear message.

  It must pass on today's code (every 001 and 003 token resolves). Temporarily add `003:FR-099` to `index.html`, confirm the test fails with that token, then remove it

### Implementation for User Story 1

- [ ] T012 [US1] Add the `code` job steps to `.github/workflows/quality-gate.yml` after `npm ci`, in contract §2 order: `npm test` (name "Tests"), `npm run lint` with `env: CI: true` (name "Lint"), and `npm run format:check` (name "Formatting"). There is no `continue-on-error`. Add `# T012`
- [ ] T013 [US1] Run `npm test` and confirm that `workflow.test.js` and `trace.test.js` pass, along with all 17 earlier tests

**Checkpoint**: The `code` job is complete. It goes live once the PR runs (T034).

---

## Phase 4: User Story 2 - Beveiligingsproblemen worden gevonden vóór de merge (Priority: P1)

**Goal**: The `security` check catches secrets, vulnerable dependencies, unsafe code patterns and privacy breaches. The existing XSS defect (R4) is fixed.

**Independent Test**: Seeded violations #3 (fake key) and #4 (external tracker) turn `security` red. Today's code (after T018) passes `npm run lint:security` and `privacy.test.js`.

### Tests for User Story 2 ⚠️

- [ ] T014 [P] [US2] Create `html.test.js` for the tagged template from R6:
  - `` html`<b>${'<img src=x onerror=alert(1)>'}</b>` `` returns `<b>&lt;img src=x onerror=alert(1)&gt;</b>`;
  - each of `& < > " '` is escaped as `&amp; &lt; &gt; &quot; &#39;`;
  - numbers and booleans are stringified, and `null`/`undefined` become an empty string;
  - static template parts are left unchanged.

  Confirm it fails, because `html.js` doesn't exist yet
- [ ] T015 [P] [US2] Create `privacy.test.js` (FR-008, constitution V). It strips JS, CSS and HTML comments from `index.html`, `app.js`, `logic.js`, `html.js`, `styles.css` and `fonts/fonts.css`, then fails on:
  - `https?://`;
  - `fetch(`, `XMLHttpRequest`, `sendBeacon`, `new WebSocket` or `new EventSource`;
  - a `<script` with a `src` that isn't relative;
  - a `<link` with an `href` that isn't relative;
  - the hosts `googletagmanager`, `google-analytics`, `plausible`, `segment`, `hotjar` and `doubleclick`.

  Each failure message names the file, line, matched text and "constitution V". Add a self-check with an inline fixture containing the gtag script tag (quickstart seeded violation #4). It must pass on today's code

### Implementation for User Story 2

- [ ] T016 [US2] Create `html.js` exporting `function html(strings, ...values)`, which returns the static parts joined with each value HTML-escaped (`&`, `<`, `>`, `"` and `'`, mapped as in T014; `null`/`undefined` as `''`). Add `// T016`. Make sure T014 passes
- [ ] T017 [US2] In `app.js`, add `import { html } from './html.js';` and change the two `innerHTML` assignments: `item.innerHTML = html\`…\`` in `renderPhaseList()`, and `taskListEl.innerHTML = taskState.map((task) => { … return html\`…\`; }).join('')` in `renderTaskList()`. Leave the template contents unchanged, so `design.test.js` (003 FR-012, T044 and T045) still matches `data-target="task-toggle-${task.id}"` and the checkbox `data-spec`. The `phaseListEl.innerHTML = ''` reset stays as it is. Add `// T017`. Check in the browser that typing `<img src=x onerror=alert(1)>` as a task title shows it as text. Run `npm test`
- [ ] T018 [US2] Create `eslint.security.config.js` (flat config) that only enables `eslint-plugin-no-unsanitized` (`no-unsanitized/property` and `no-unsanitized/method` as `error`), with `escape: { taggedTemplates: ['html'] }` for both, applied to `app.js`, `logic.js` and `html.js`. Make sure `npm run lint:security` passes after T017, and fails if T017 is temporarily reverted. That is the R4 true positive
- [ ] T019 [P] [US2] Create `.github/codeql/codeql-config.yml` (`name: quality-gate`, `queries: [{ uses: security-extended }]`, `paths-ignore: [node_modules, playwright-report, test-results, specs, .specify, .claude]`, and an empty `query-filters` list with a comment that shows the exclusion format from contract §5). Create `.gitleaksignore` containing only the header comment `# One fingerprint per line, each preceded by a "# <reason>" comment (FR-016)`
- [ ] T020 [US2] Add the `security` job steps to `.github/workflows/quality-gate.yml`, following contract §2 and §3:
  - job-level `permissions: { contents: read, security-events: write, actions: read }`;
  - checkout with `fetch-depth: 0`;
  - "Secret scan": `docker run --rm -v "$PWD:/repo" ghcr.io/gitleaks/gitleaks:<version>@sha256:<digest> git /repo --redact --verbose --log-opts="<range>"`, where `<range>` is `${{ github.event.pull_request.base.sha }}..${{ github.event.pull_request.head.sha }}` on PRs and the pushed range on `push` (use `--log-opts` only when the range is set);
  - setup-node and `npm ci`;
  - "Dependency audit": `npm audit --audit-level=high`;
  - "Dependency review": `actions/dependency-review-action` with `fail-on-severity: high` and `if: github.event_name == 'pull_request'`;
  - "Unsafe HTML": `npm run lint:security` with `env: CI: true`;
  - "Privacy": `node --test privacy.test.js` (FR-008 belongs to the security category, spec US2/AC4);
  - "CodeQL": `github/codeql-action/init` with `languages: javascript-typescript` and `config-file: ./.github/codeql/codeql-config.yml`, then `github/codeql-action/analyze`.

  `privacy.test.js` also runs inside `npm test` in the `code` job, so a contributor sees it locally. The `security` job runs it on its own, so a privacy breach turns `security` red (quickstart seeded violation #4). Pin every action and the image by SHA or digest. Add `# T020`. Run `npm test` so `workflow.test.js` still passes

**Checkpoint**: Security checks are in place locally (`npm run lint:security`, `privacy.test.js`, `npm audit`). The XSS is fixed.

---

## Phase 5: User Story 3 - Bruikbaarheid en toegankelijkheid worden gecontroleerd (Priority: P2)

**Goal**: The `usability` check opens the demo in Chromium and enforces WCAG 2.1 AA, keyboard focus, the full 001 core flow and no external requests.

**Independent Test**: Seeded violation #5 (no `aria-label` on `#task-input`) turns `usability` red. On today's code, exactly the five known 001 core-flow tests fail and everything else passes (SC-004).

### Tests for User Story 3 ⚠️

> In this story the tests are the deliverable. Implementation is the CI wiring (T027).

- [ ] T021 [P] [US3] Create `e2e/fixtures.js`, which exports `test` (extended from `@playwright/test`) and `expect`. An auto fixture routes every request whose origin isn't `http://localhost:8000` to `route.abort()`, records the URLs, and after each test asserts that the list is empty, with the message `constitution V: external request(s) attempted: …` (FR-008 runtime, SC-005 of 003)
- [ ] T022 [P] [US3] Create `e2e/a11y-exceptions.js`, exporting a default empty array of `{ rule, selector, reason }`, and a named `loadExceptions(list = defaultList)` that throws when any entry has an empty or whitespace-only `reason` (FR-016, data-model "Exception"). Add `e2e/a11y-exceptions.test.js` (node:test, so it runs in `npm test`). It asserts that `loadExceptions([])` returns `[]`, that `loadExceptions([{ rule: 'label', selector: '#x', reason: 'documented' }])` returns the entry, and that `loadExceptions([{ rule: 'label', selector: '#x', reason: ' ' }])` throws
- [ ] T023 [US3] Create `e2e/a11y.spec.js` (FR-009), importing from `./fixtures.js`. Three tests, titled `004:FR-009 initial page has no serious/critical WCAG 2.1 AA violations`, `004:FR-009 open task dialog …` and `004:FR-009 after filtering …`. Each builds `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])`, excludes the selectors from `loadExceptions()` (disabling those rule ids), and asserts that no violation has impact `serious` or `critical`. The failure message lists rule id, impact, the first target selector and the help URL
- [ ] T024 [P] [US3] Create `e2e/keyboard.spec.js` (FR-010, constitution IV) with the test `004:FR-010 every control receives visible focus`. It presses Tab from the top until focus returns to `body` or 40 presses pass. For each focused element it records the tag, `data-target` and the computed `outlineStyle` and `outlineWidth`, and asserts that the style isn't `none` and the width is at least `2px`. It also asserts that every element matching `button, input, textarea, [tabindex="0"]` outside the closed dialog was reached at least once
- [ ] T025 [P] [US3] Create `e2e/core-flow.spec.js` (FR-011) with one test per row of contract §6, using the titles given there. Each test asserts the user-visible result 001 promises:
  - **add:** type "Write CI docs" and press Add task, and a new row with that title appears;
  - **check off:** toggle a checkbox and the row gets `.completed`, then toggle back;
  - **filters:** Active shows only rows without `.completed` and Completed only rows with it, and All shows both;
  - **empty state:** complete every task, choose Active, and `#empty-state` is visible;
  - **open and edit:** Open, change the title, and the row text updates;
  - **close:** click Close and then use Escape, and in both cases the dialog is closed and `document.activeElement` is the Open button of that task;
  - **persist:** add or change a task, press Persist demo state, reload, and the change is still there;
  - **trace:** click Add task and `#trace-feature-id` reads `spec-01`.

  Nothing is skipped or marked as expected-to-fail (clarification Q1)
- [ ] T026 [US3] Run `npm run test:e2e` locally. Record the result: every a11y and keyboard test must pass on today's code. If one fails, that is a real defect, so fix it in the app file it comes from, with a task-ID comment, and note it in `quickstart.md`. Exactly these core-flow tests must fail: add, filters, empty state, close-button focus, and persist. That is the SC-004 baseline. If any other core-flow test fails, fix the test or the defect before continuing

### Implementation for User Story 3

- [ ] T027 [US3] Add the `usability` job steps to `.github/workflows/quality-gate.yml` after `npm ci`: "Install browser" (`npx playwright install --with-deps chromium`), then "Browser checks" (`npm run test:e2e`). Add `# T027`. Run `npm test` so `workflow.test.js` still passes

**Checkpoint**: The `usability` job is complete. It is red on today's code by design, because of the five 001 gaps.

---

## Phase 6: User Story 4 - Duidelijke uitkomst in de pull request (Priority: P3)

**Goal**: For each check, the PR shows a short summary and inline annotations.

**Independent Test**: Make one check fail. The job summary lists the failed step and the annotations point at file and line.

- [ ] T028 [US4] Add a final step "Summary" with `if: always()` to each of the three jobs in `.github/workflows/quality-gate.yml`. It appends a Markdown table to `$GITHUB_STEP_SUMMARY` with one row per step (step name, `${{ steps.<id>.outcome }}`, and what to run locally from contract §4). Give every step an `id`. The `security` summary includes the "Privacy" step row (T020). Add `# T028`
- [ ] T029 [US4] In the `usability` job, add "Upload report" (`actions/upload-artifact`, pinned, `if: failure()`, `path: playwright-report/`, `retention-days: 7`). Check that `playwright.config.js` (T005) already gives `github` reporter annotations in CI
- [ ] T030 [US4] Extend `workflow.test.js`: every job ends with a step whose `if:` is `always()` and that writes to `GITHUB_STEP_SUMMARY`, and the `usability` job has an upload step with `if: failure()`. Run `npm test`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation on GitHub, repository settings, and bookkeeping

- [ ] T031 Run the full local list from `quickstart.md` §1 and record the actual results under a new "Results" heading in `specs/004-ci-quality-gates/quickstart.md`
- [ ] T032 Annotate the 001 trace text that claims behaviour which doesn't exist: in `logic.js`, `spec-01.phaseMap.implement` says the button "appends it to the in-memory task list". Leave it unchanged (001 owns it) but add a comment `// Known 001 gap, see 004 core-flow test "add a task"` so the trace and the failing test point at each other. Run `npm test`
- [ ] T033 Append an `## Phase: implement` entry to `specs/004-ci-quality-gates/prompts.md`, commit (with the formatting baseline from T009 as its own earlier commit) and tag `004-implement`
- [ ] T034 **After confirmation**: push `004-ci-quality-gates` and its tags, then open a PR to `main` with `gh pr create`. Confirm in the PR that the three checks `code`, `security` and `usability` appear, that `code` and `security` are green, and that `usability` is red on exactly the five known 001 tests. Check that the slowest job finishes within 10 minutes (SC-002). Record the run URL in `quickstart.md`
- [ ] T035 **After confirmation**: run seeded violations #1 to #5 from `quickstart.md` §2 as throwaway PRs from branches off `004-ci-quality-gates`. Record for each the red check and the annotation in `quickstart.md` (SC-003), then close each PR and delete its branch. For SC-006 and FR-014, open the "Set up job" section of one run's log and record that it lists `GITHUB_TOKEN Permissions` with `Contents: read`, plus `SecurityEvents: write` in the `security` job only. GitHub doesn't allow forking your own repository, so a real fork PR needs a second account and is optional. The static guarantees (no `pull_request_target`, read-only token) are covered by `workflow.test.js` (T007)
- [ ] T036 **Approved by the owner on 2026-10-05; blocked until the 001 gaps are fixed** (analyze C1, constitution "a feature is only done when all tests pass"). Prerequisite: the five 001 gaps are fixed in their own branch and PR, so `usability` is green on the 004 PR (rebased on that fix). Then, in this order:
  1. make the repository public;
  2. merge PR #1 (003), then the 001 fix, then this feature's PR into `main`, each with all three checks green;
  3. set branch protection on `main` requiring `code`, `security` and `usability`, with up-to-date branches;
  4. enable Dependabot alerts and secret scanning with push protection.

  Verify with the `gh api … --jq '.required_status_checks.contexts'` command, then record the outcome in `quickstart.md` and `prompts.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 first (the other configs need the packages to run), then T002 to T006 in parallel.
- **Foundational (Phase 2)**: T007 → T008 (the workflow test comes first), then T009 (format) → T010 (lint). This phase blocks every story.
- **US1 (Phase 3)**: after Phase 2.
- **US2 (Phase 4)**: after Phase 2. T016 → T017 → T018 in order. T014, T015 and T019 can run in parallel.
- **US3 (Phase 5)**: after Phase 2. T021, T022, T024 and T025 can run in parallel; T023 needs T022. If US2 runs in parallel, T026 needs T017, because the XSS fix changes rendering.
- **US4 (Phase 6)**: after US1 to US3, because it adds steps after theirs in the same workflow file.
- **Polish (Phase 7)**: after everything. The owner has confirmed T034 to T036. T036 also waits for the separate 001 fix (analyze C1).
- **Outside this feature**: fixing the five 001 gaps (add, filters, empty state, Close-button focus, persist) is its own spec-driven follow-up on `main`. It must land before 004 counts as done.

### Workflow file coordination

`.github/workflows/quality-gate.yml` is edited by T008, T012, T020, T027, T028 and T029. Those edits run in that order and are never parallel.

### Parallel Opportunities

- Setup: T002, T003, T004, T005 and T006.
- US2 tests and config: T014, T015 and T019.
- US3 tests: T021, T022, T024 and T025.

---

## Parallel Example: User Story 3

```bash
Task: "Create e2e/fixtures.js external-request guard"        # T021
Task: "Create e2e/a11y-exceptions.js with reason validation" # T022
Task: "Create e2e/keyboard.spec.js"                          # T024
Task: "Create e2e/core-flow.spec.js"                         # T025
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 and Phase 2 give the tooling, a clean baseline and the workflow skeleton.
2. Phase 3 completes the `code` check: tests, lint, format and the trace check.
3. **Validate**: seeded violations #1 and #2 turn it red.

### Incremental Delivery

1. US1 (`code`) is the MVP gate.
2. US2 (`security`) adds the scanners and fixes the XSS.
3. US3 (`usability`) adds browser, axe and the 001 flow. It is red by design until 001 is fixed.
4. US4 adds summaries and the report artifact.
5. Polish covers the PR, the seeded violations and the repository settings, each after confirmation.

---

## Notes

- Expected state after T034: `code` and `security` green, `usability` red on exactly the five 001 gaps. The feature is only done (constitution) once the 001 fix makes `usability` green. After that, T036 merges and protects `main`.
- `.claude/skills/polderworks-design/` and the 001 and 003 specs are never edited by this feature.
- Commit after each phase. The formatting baseline (T009) is its own commit.
