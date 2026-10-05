# Research: Kwaliteitspoort voor pull requests

All Technical Context unknowns are resolved below. Repository facts were checked on 2026-10-05 with
`gh`: the repository was private on a free personal plan, so branch protection, rulesets and
CodeQL code scanning returned HTTP 403. The owner chose to make the repository public (R11). The
default branch was `003-adopt-polderworks-design` and has been set to `main`.

## R1. Workflow layout and triggers (FR-001, FR-012, edge case "alleen documentatie")

- **Decision**: One workflow, `.github/workflows/quality-gate.yml`, with three jobs named exactly
  `code`, `security` and `usability`. Each job is one status check in the pull request, one per
  spec category. Triggers are `pull_request` on `main` (types `opened`, `synchronize`, `reopened`,
  `ready_for_review`), `push` on `main` (keeps a baseline and CodeQL results for `main`) and
  `workflow_dispatch`. There is no `paths` filter, so a docs-only PR still reports all three
  statuses. A `concurrency` group per PR cancels superseded runs.
- **Rationale**: Three stable job names map one-to-one to the three required checks in branch
  protection (FR-013) and to the three categories in FR-012. One file keeps the gate readable.
- **Alternatives considered**:
  - *One workflow per category*: the same statuses, but three files that drift. Rejected.
  - *`paths` filters to skip docs-only PRs*: required checks that never report would block the
    merge forever (spec edge case). Rejected.

## R2. Permissions and fork safety (FR-014, SC-006)

- **Decision**: The workflow-level `permissions` are `contents: read`. Only the `security` job
  adds `security-events: write` (to upload CodeQL results) and `actions: read`. The workflow uses
  `pull_request`, never `pull_request_target`, so PRs from forks run without repository secrets
  and with a read-only token. Every `actions/checkout` uses `persist-credentials: false`. Every
  third-party action is pinned to a full commit SHA with the version in a trailing comment, and
  Dependabot keeps those pins current.
- **Rationale**: These are GitHub's own hardening recommendations. `security-events: write` lets
  the job write code-scanning alerts, not code, so FR-014 ("alleen leesrechten op de code")
  holds. This is recorded in Complexity Tracking.
- **Alternatives considered**: tag pins (`@v4`). A moved tag can run different code without
  review. Rejected.

## R3. Code checks (FR-002, FR-003, FR-004)

- **Decision**:
  - Tests: the existing `npm test` (`node --test`).
  - Error patterns: ESLint 9 flat config (`eslint.config.js`) with `@eslint/js` recommended and
    browser and node globals. This covers unused variables, unreachable code and undefined
    names.
  - Formatting: `prettier --check`.
  - Trace check (constitution III): a new `trace.test.js` that reads every `data-spec` token in
    `index.html` and `app.js`, resolves `<feature>` to `specs/<feature>-*/spec.md`, and fails on
    an ID that is not defined there. Being a node test, it also runs locally with `npm test`.
  - Annotations: a small custom ESLint formatter (`scripts/eslint-github-formatter.js`) prints
    `::error file=…,line=…::` lines, so findings show inline in the PR diff.
- **Rationale**: ESLint and Prettier are the de-facto standard for JavaScript and run without a
  build. The trace check closes the gap that the constitution's "trace-controle" was only manual.
- **Alternatives considered**: Biome (lint and format in one binary) is faster, but less common
  and has no `no-unsanitized` equivalent (R4). Rejected for familiarity.

## R4. Security checks (FR-005 to FR-008)

- **Decision**:
  - **Secrets (FR-005)**: gitleaks, run from its official container image (pinned by digest) over
    the commits in the PR, with `--redact`, so findings show file, line and rule but never the
    full secret.
  - **Dependencies (FR-006)**: `npm audit --audit-level=high` over the lockfile, plus
    `actions/dependency-review-action` with `fail-on-severity: high` on PRs. The second also
    catches vulnerable actions and licences introduced by the PR.
  - **Static analysis (FR-007)**: CodeQL for JavaScript with the `security-extended` query suite.
    It is free on public repositories, and its findings appear as PR annotations. On top of that,
    ESLint with `eslint-plugin-no-unsanitized` runs through `eslint.security.config.js` and fails
    on unescaped `innerHTML`, `outerHTML` and `insertAdjacentHTML`.
  - **Privacy (FR-008, constitution V)**: a new `privacy.test.js` statically scans `index.html`,
    `app.js`, `logic.js`, `styles.css` and `fonts/fonts.css`. It fails on any `http(s)://` URL
    outside comments, `fetch(`, `XMLHttpRequest`, `navigator.sendBeacon`, `WebSocket`,
    `EventSource`, external `<script src>` or `<link href>`, and known analytics hosts. The
    `usability` job adds a runtime guard (R5).
- **Rationale**: Each tool is free on public repositories and well maintained. Running gitleaks
  as a container rather than through its action avoids the action's licence check and keeps the
  binary pinned.
- **Known true positive in current code**: `renderTaskList()` and `renderPhaseList()` in `app.js`
  assign template strings containing user-editable task fields to `innerHTML`. A task title such
  as `<img src=x onerror=…>` typed in the dialog executes. `no-unsanitized` and CodeQL
  (`js/xss-through-dom`) will both flag it. This is a real defect, not a false positive (SC-004),
  so the feature fixes it (R6).
- **Alternatives considered**:
  - *Semgrep CE*: good, but redundant next to CodeQL once the repository is public. Kept as the
    fallback if the repository has to go private again.
  - *`gitleaks-action`*: requires a licence key for organisation accounts and wraps the same
    binary. Rejected.

## R5. Usability checks (FR-009, FR-010, FR-011)

- **Decision**: Playwright (`@playwright/test`) with `@axe-core/playwright`, Chromium only, with
  tests in `e2e/`. Playwright's `webServer` starts `python3 -m http.server`, the same command as
  `npm start`.
  - **Accessibility (FR-009)**: axe with the tags `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa`,
    run on the initial page, with the dialog open, and after filtering. It fails on any violation
    of impact `serious` or `critical`.
  - **Keyboard (FR-010)**: tabs through every control. Each must receive focus with a computed
    outline that is not `none` and is at least 2px.
  - **Core flow (FR-011)**: one named test per 001 step (add, check off, filter all, active and
    completed, empty state, open and edit, close with the button and with Escape with focus
    returned to Open, persist and reload, and trace). Following the clarification, nothing is
    skipped or marked as expected-to-fail. Five tests will fail until the 001 gaps are fixed.
  - **Offline and privacy at runtime (constitution V)**: every test routes non-`localhost`
    requests to `abort` and records them. A fixture fails the test if any were attempted.
  - **Reporting**: the `github` reporter gives inline annotations. The HTML report is uploaded as
    an artifact on failure.
- **Rationale**: The constitution already names Playwright for end-to-end tests, so this closes
  the deviation recorded in plan 003. Testing the real browser behaviour is what would have
  caught the dead buttons from 001.
- **Alternatives considered**:
  - *Lighthouse CI*: scores performance and best practices, but its accessibility audit is axe
    underneath and it cannot drive a flow. Rejected as redundant.
  - *pa11y-ci*: accessibility only. Rejected for the same reason.

## R6. Fixing the innerHTML finding without breaking 003's tests

- **Decision**: Add `html.js`, which exports a tagged template `html` that HTML-escapes every
  interpolated value. `renderTaskList()` and `renderPhaseList()` switch from a plain template
  literal to `html\`…\``. `eslint-plugin-no-unsanitized` is configured with
  `escape.taggedTemplates: ['html']`, so the escaped form passes.
- **Rationale**: This is the smallest change that removes the XSS. The template source text stays
  the same, so the `design.test.js` assertions that match `data-target="task-toggle-${task.id}"`
  keep passing (003 FR-012). A unit test covers the escaping.
- **Alternatives considered**: rewriting the rendering with `createElement` and `textContent`.
  It is safer by construction, but a larger diff that breaks the 003 source-text tests.
  Rejected.

## R7. Formatting baseline

- **Decision**: `.prettierrc.json` is tuned to the current code style (`singleQuote`,
  `printWidth: 120`, `trailingComma: "none"`) to minimise churn. `.prettierignore` excludes
  `specs/`, `.specify/`, `.claude/`, `fonts/` and `package-lock.json`. The existing files get a
  one-time formatting commit.
- **Rationale**: `prettier --check` cannot pass on unformatted code. Doing the baseline in one
  isolated commit keeps the diff reviewable.

## R8. Exceptions recorded in the repository (FR-016)

| Tool | Exception mechanism | Reason required |
|------|--------------------|-----------------|
| gitleaks | `.gitleaksignore` fingerprints, with a comment line above each | yes, by convention and review |
| ESLint | `// eslint-disable-next-line <rule> -- <reason>` | yes, enforced by `@eslint-community/eslint-comments/require-description` |
| CodeQL | `query-filters` in `.github/codeql/codeql-config.yml`, with a YAML comment | yes, by review |
| axe | `e2e/a11y-exceptions.js`: an array of `{ rule, selector, reason }`, empty at start | yes, the type requires `reason` |
| npm audit | none. Fix with an upgrade or an `overrides` entry in `package.json` | n/a |

## R9. Timeouts and failing on unreachable services (FR-015)

- **Decision**: Each job sets `timeout-minutes: 10`. The tools exit non-zero when their data
  source is unreachable (`npm audit`, CodeQL, dependency review), and no step uses
  `continue-on-error`. The workflow test (R10) asserts both.

## R10. Testing the gate itself (constitution II)

- **Decision**: Add `workflow.test.js` (node:test, no YAML library). It checks the workflow source
  text for the triggers (FR-001), the three job names (FR-012), workflow-level
  `contents: read`, the absence of `pull_request_target` (FR-014), `timeout-minutes` on every job
  and no `continue-on-error` (FR-015), and that every `uses:` is pinned to a 40-character SHA
  (R2). The behavioural FRs are proven by the seeded-violation scenarios in `quickstart.md`
  (SC-003).

## R11. Repository settings (FR-013)

- **Decision**: The repository becomes public (owner's choice, 2026-10-05; the owner gives
  explicit confirmation before the switch). Then the branch protection on `main` requires the
  status checks `code`, `security` and `usability`, and that branches are up to date before
  merging. It is applied with `gh api` after confirmation, and the exact call is in
  `quickstart.md`. Dependabot alerts and secret scanning (free on public repositories) are
  enabled at the same time.
- **Rationale**: Without branch protection the gate only advises. On the free plan, enforcement
  needs a public repository.
- **Consequence and order** (analyze C1, owner decision 2026-10-05): The usability check tests the full
  001 flow (clarification Q1), and the constitution only calls a feature done when all tests pass.
  So 004 is built and its PR opened, the five 001 gaps are fixed in their own branch, and only
  then are PR #1, the 001 fix and 004 merged and protection switched on.

## R12. Node version and dependencies (constitution I)

- **Decision**: CI uses Node 24 (Active LTS), set with `actions/setup-node` and npm caching. Only
  dev dependencies are added: `eslint`, `@eslint/js`, `globals`, `prettier`,
  `eslint-plugin-no-unsanitized`, `@eslint-community/eslint-plugin-eslint-comments`,
  `@playwright/test` and `@axe-core/playwright`. `package-lock.json` is committed and CI uses
  `npm ci`.
- **Rationale**: Constitution I restricts runtime dependencies. The demo still ships no
  JavaScript besides its own files, and FR-017 holds.
