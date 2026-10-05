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
