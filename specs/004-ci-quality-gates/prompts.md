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
