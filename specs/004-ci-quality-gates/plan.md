# Implementation Plan: Kwaliteitspoort voor pull requests

**Branch**: `004-ci-quality-gates` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-ci-quality-gates/spec.md`

## Summary

Add a GitHub Actions quality gate that runs on every pull request to `main` and reports three
status checks: `code`, `security` and `usability`.

- **`code`** runs the existing node tests, ESLint, a Prettier check and a new trace check for
  `data-spec` IDs.
- **`security`** runs gitleaks, npm audit with dependency review, CodeQL, an XSS lint and a static
  privacy check.
- **`usability`** runs Playwright with axe in Chromium. It covers WCAG 2.1 AA, keyboard focus,
  the full 001 core flow and a runtime block on external requests.

The workflow has read-only permissions and pinned actions. The repository becomes public, so
branch protection can enforce all three checks. The gate's own static checks find one real defect
in today's code (unescaped `innerHTML` with user-editable task fields), which this feature fixes.
By the owner's choice, the usability check stays red until the five 001 gaps are fixed.

## Technical Context

**Language/Version**: GitHub Actions workflow YAML. Node 24 LTS in CI (local development runs
Node 26). Browser JavaScript ES modules for the app.

**Primary Dependencies**: Dev only: `eslint`, `@eslint/js`, `globals`, `prettier`,
`eslint-plugin-no-unsanitized`, `@eslint-community/eslint-plugin-eslint-comments`,
`@playwright/test` and `@axe-core/playwright`. CI also uses the gitleaks container image, CodeQL
and `actions/dependency-review-action`, all pinned (R2, R4). There are no runtime dependencies.

**Storage**: N/A. Exceptions live as files in the repository (R8).

**Testing**: `node --test` for unit and static tests (existing, plus `trace.test.js`,
`privacy.test.js`, `workflow.test.js` and `html.test.js`). Playwright for `e2e/`. The
seeded-violation scenarios in `quickstart.md` prove the gate end to end (SC-003).

**Target Platform**: GitHub-hosted `ubuntu-latest` runners. Chromium for the browser checks.

**Project Type**: CI configuration plus test suites for an existing static web app.

**Performance Goals**: All three jobs finish within 10 minutes of a push (SC-002). They run in
parallel, each with `timeout-minutes: 10`.

**Constraints**: Read-only token and no secrets for PRs from forks (FR-014). Actions are pinned to
commit SHAs. No `continue-on-error`. Free tooling only, on a public repository. No runtime
dependency (FR-017).

**Scale/Scope**: One workflow with three jobs, about 4 new node test files, about 4 Playwright
spec files, plus config files and a one-time formatting baseline.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Eenvoud boven alles | Pass with note | No runtime dependency and no backend. Eight dev dependencies are justified per tool in R3 to R5 and R12, and recorded in Complexity Tracking. |
| II. Elke requirement is testbaar | Pass | FR-001, FR-012, FR-014 and FR-015 are covered by `workflow.test.js`. FR-004 by `trace.test.js`, FR-008 by `privacy.test.js`, FR-009 to FR-011 by Playwright. FR-002, FR-003, FR-005 to FR-007, FR-013 and FR-016 are proven by the seeded-violation scenarios (SC-003). This adopts Playwright as the constitution prescribes, which closes part of the 003 deviation. |
| III. Traceerbaarheid | Pass | No new UI elements. The workflow and tests carry `T0xx` comments. Each phase ends with a commit, a `004-<phase>` tag and a `prompts.md` entry. The new trace check automates the constitution's "trace-controle". |
| IV. Toegankelijk | Pass | The usability job enforces WCAG 2.1 AA (axe) and keyboard focus on every PR. |
| V. Gebruikersdata blijft lokaal | Pass | The static and runtime privacy checks enforce this principle. CI handles code only, never user data. Fixing the XSS (R6) also protects local data. |

**Post-design re-check**: Still passes. The contract and data model add no runtime dependency or
network call from the app.

## Project Structure

### Documentation (this feature)

```text
specs/004-ci-quality-gates/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R12)
├── data-model.md        # Phase 1: Check, Finding, Exception
├── quickstart.md        # Phase 1: local runs, seeded violations, repo settings
├── contracts/
│   └── quality-gate.md  # Status checks, triggers, npm scripts, exception formats
├── checklists/
│   └── requirements.md
├── prompts.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
.github/
├── workflows/quality-gate.yml   # jobs: code, security, usability
├── codeql/codeql-config.yml     # security-extended suite, query-filters for exceptions
└── dependabot.yml               # npm + github-actions, weekly
e2e/
├── a11y.spec.js                 # axe WCAG 2.1 AA (FR-009)
├── keyboard.spec.js             # focus on every control (FR-010)
├── core-flow.spec.js            # full 001 flow, one test per step (FR-011)
├── fixtures.js                  # external-request guard (constitution V)
└── a11y-exceptions.js           # recorded axe exceptions (FR-016), empty
scripts/
└── eslint-github-formatter.js   # ::error annotations (FR-012)
eslint.config.js                 # code rules + eslint-comments/require-description
eslint.security.config.js        # no-unsanitized with html tagged template
.prettierrc.json, .prettierignore
.gitleaksignore                  # empty, with header comment
playwright.config.js
html.js                          # escaping tagged template (R6)
app.js                           # uses html`…` in renderTaskList/renderPhaseList
trace.test.js, privacy.test.js, workflow.test.js, html.test.js
package.json, package-lock.json  # devDependencies + scripts (lint, format:check, test:e2e, …)
```

**Structure Decision**: Keep the flat root layout from 001 and 003. Browser tests go in `e2e/`, so
`node --test` doesn't pick them up (its default globs skip `*.spec.js`). CI config goes under
`.github/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Eight dev dependencies (Principle I asks for the simplest solution) | Each covers one spec category that the platform doesn't: lint and format (FR-003), XSS lint (FR-007), browser automation and axe (FR-009 to FR-011). | Hand-written checks would be less complete and harder to trust than standard tools. None of these ship to the browser, so FR-017 holds. |
| The `security` job has `security-events: write` (FR-014 says read-only on code) | CodeQL needs it to publish findings in the PR. | It grants writing code-scanning alerts, not repository contents. Dropping CodeQL would leave FR-007 to a single lint rule. |
| The usability check fails on today's code by design | The owner chose to test the full 001 flow without exceptions (clarification Q1), which makes the five 001 gaps visible and blocking. | Skipping those steps would hide known defects, which is the problem this gate exists to fix. |
| One-time reformat of existing files | `prettier --check` (FR-003) cannot pass otherwise. | Lint-only formatting rules are less complete. The churn is limited by matching the current style (R7). |
