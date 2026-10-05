# Quickstart: validate feature 004 (Kwaliteitspoort voor pull requests)

## Prerequisites

- Node 24 or newer, Python 3, and `gh` logged in with admin rights on the repository.
- `npm ci` and `npx playwright install chromium` (once).

## 1. Run every check locally

```bash
npm test               # node tests, including trace, privacy, workflow and html checks
npm run lint           # ESLint code rules
npm run format:check   # Prettier
npm run lint:security  # unsanitized-HTML rules
npm audit --audit-level=high
npm run test:e2e       # Playwright + axe: a11y, keyboard, 001 core flow
```

**Expected on today's code** (after the R6 fix): everything passes except `npm run test:e2e`,
which fails on exactly five core-flow tests: add a task, filters, empty state, Close-button focus
and persist and reload. Those are the known 001 gaps (spec SC-004).

## 2. Seeded violations (SC-003)

Open a throwaway PR per row from a branch off `004-ci-quality-gates` and check that the named check
turns red with the expected annotation. Close the PR without merging.

| # | Change | Expected red check | Expected annotation |
|---|--------|-------------------|---------------------|
| 1 | Change an assertion in `logic.test.js` so it fails | `code` | failing test name |
| 2 | Add `data-spec="003:FR-099"` to any element in `index.html` | `code` | `trace.test.js`: unknown ID `003:FR-099` in `index.html` |
| 3 | Add a file containing a realistic-looking fake API key | `security` | gitleaks rule, file and line, with the secret redacted |
| 4 | Add `<script src="https://www.googletagmanager.com/gtag/js"></script>` to `index.html` | `security` and `usability` | `privacy.test.js` (constitution V); runtime guard: external request attempted |
| 5 | Remove `aria-label` from `#task-input` | `usability` | axe `label` (critical) |

Also check FR-014 from a fork: a PR from a fork runs all three checks, and the logs show
`GITHUB_TOKEN` permissions `Contents: read` with no repository secrets available.

## 3. Timing (SC-002)

On a clean PR, check in the Actions tab that the slowest of the three jobs finishes within
10 minutes of the push.

## 4. Repository settings (FR-013, R11)

Run these only after explicit confirmation from the owner. Each one changes visibility or
settings.

```bash
# 1. Make the repository public (owner decision 2026-10-05)
gh repo edit SammieEtje/my-specdriven-app --visibility public --accept-visibility-change-consequences

# 2. Require the three checks on main
gh api -X PUT repos/SammieEtje/my-specdriven-app/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["code", "security", "usability"] },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
JSON

# 3. Dependabot alerts and secret scanning
gh api -X PUT repos/SammieEtje/my-specdriven-app/vulnerability-alerts
gh repo edit SammieEtje/my-specdriven-app --enable-secret-scanning --enable-secret-scanning-push-protection
```

**Order matters**:
1. Merge this feature's PR before protection is on, otherwise it blocks itself.
2. Then switch protection on.
3. From then on `main` accepts nothing until the 001 gaps are fixed (clarification Q1).
4. Decide whether PR #1 (003) merges before step 2.

Verify with:

```bash
gh api repos/SammieEtje/my-specdriven-app/branches/main/protection --jq '.required_status_checks.contexts'
```

It should print `["code","security","usability"]`.
