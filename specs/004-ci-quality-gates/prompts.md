# Prompt trace for feature: 004-ci-quality-gates

## Phase: specify

- Date: 2026-10-05
- Branch: `004-ci-quality-gates` (branched from `003-adopt-polderworks-design`, whose PR #1 is open)
- Spec: `specs/004-ci-quality-gates/spec.md`
- Trigger: `/speckit-specify Let's first create a pull request to close the present branch. Create a github actions pipeline to identify any security, useability and code issues before merging to main. Can you build this?`
- Goal: A pull-request quality gate on GitHub Actions with three categories: code, security, and usability/accessibility.
- Clarifications:
  - The full 001 core flow is tested in the browser, with no exceptions for known gaps.
  - All three categories block a merge to `main`.
- Note: This means merges stay blocked until the five 001 gaps found on 2026-10-05 are fixed.

## Phase: plan

- Date: 2026-10-05
- Branch: `004-ci-quality-gates`
- Plan: `plan.md`, `research.md`, `data-model.md`, `contracts/quality-gate.md`, `quickstart.md`
- Trigger: `/speckit-plan`
- Repository facts found: the repository was private on a free plan, so branch protection, rulesets and CodeQL returned HTTP 403. The default branch was `003-adopt-polderworks-design`.
- Owner decisions:
  - Make the repository public. This is done in the implement phase, after explicit confirmation.
  - Set the default branch to `main`. This was done on 2026-10-05 with `gh repo edit`.
- Design:
  - One workflow with jobs `code`, `security` and `usability`.
  - ESLint, Prettier and a trace check; gitleaks, npm audit with dependency review, CodeQL, no-unsanitized and a privacy check; Playwright with axe.
  - Read-only token, SHA-pinned actions, a 10-minute timeout per job.
- Finding: the current `app.js` writes user-editable task fields to `innerHTML` (XSS). It is fixed with an escaping `html` tagged template (R6).

## Phase: tasks

- Date: 2026-10-05
- Branch: `004-ci-quality-gates`
- Tasks: `specs/004-ci-quality-gates/tasks.md`
- Trigger: `/speckit-tasks`
- Result: 36 tasks across Setup, Foundational, US1 to US4 and Polish, with tests first.
- Outward-facing steps need explicit owner confirmation: T034 (push and PR), T035 (seeded-violation PRs) and T036 (public repository and branch protection).

## Phase: analyze

- Date: 2026-10-05
- Branch: `004-ci-quality-gates`
- Trigger: `/speckit-analyze`, then remediation on request
- Findings: 2 CRITICAL, 1 HIGH, 3 MEDIUM and 4 LOW.
  - C1: the constitution says "a feature is only done when all tests pass", but 004 shipped red.
  - C2: six FRs had no automated test.
  - I1: the privacy check ran in the wrong job.
- Remediation:
  - T007 now asserts the check steps per job.
  - T022 adds `e2e/a11y-exceptions.test.js`.
  - T020 adds a Privacy step to `security`.
  - SC-006 and FR-014 now name the CodeQL alert upload as the only write permission.
  - The fork test is replaced by a token-permissions log check, because GitHub doesn't allow forking your own repository.
  - C1 (owner decision): fix the 001 gaps first. T036 waits for that fix; then PR #1, the 001 fix and 004 merge, and protection goes on.

## Phase: implement

- Date: 2026-10-05
- Branch: `004-ci-quality-gates`
- Trigger: `/speckit-implement`
- Result: `.github/workflows/quality-gate.yml` with jobs `code`, `security` and `usability`.
  - Actions are pinned by SHA: checkout v7.0.1, setup-node v7.0.0, dependency-review v5.0.0, codeql-action v4.38.2 and upload-artifact v7.0.1. gitleaks v8.30.1 is pinned by digest.
  - New tests: `trace.test.js`, `privacy.test.js`, `workflow.test.js`, `html.test.js`, `e2e/a11y-exceptions.test.js`, and Playwright specs for a11y, keyboard and the core flow.
- Decisions during implementation:
  - Prettier uses `embeddedLanguageFormatting: off` and double quotes in CSS, so the 003 source-text tests keep matching.
  - Task rows render via `insertAdjacentHTML` with the escaping `html` tag, because the lint rule cannot see through `.join('')`.
- The gate found two defects, both fixed: an XSS through task fields, and the trace block not being keyboard-scrollable.
- Correction: the Close-button focus "gap" was a measurement error. The baseline is four 001 gaps; spec SC-004 and related docs are updated.
- T036 waits for the 001 fix (analyze C1).
- CI results (2026-10-05): see `quickstart.md`, "Results on GitHub".
  - The owner approved making the repository public before the 001 fix, so that `security` could go green.
  - A history-wide secret scan found nothing before the switch.
  - Branch protection still waits (T036).
