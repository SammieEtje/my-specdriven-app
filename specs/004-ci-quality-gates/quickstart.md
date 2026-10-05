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
which fails on exactly four core-flow tests: add a task, filters, empty state, and persist and
reload. Those are the known 001 gaps (spec SC-004).

## 2. Seeded violations (SC-003)

Open a throwaway PR per row from a branch off `004-ci-quality-gates` and check that the named check
turns red with the expected annotation. Close the PR without merging.

| # | Change | Expected red check | Expected annotation |
|---|--------|-------------------|---------------------|
| 1 | Change an assertion in `logic.test.js` so it fails | `code` | failing test name |
| 2 | Add `data-spec="003:FR-099"` to any element in `index.html` | `code` | `trace.test.js`: unknown ID `003:FR-099` in `index.html` |
| 3 | Add a file containing a realistic-looking fake API key | `security` | gitleaks rule, file and line, with the secret redacted |
| 4 | Add `<script src="https://www.googletagmanager.com/gtag/js"></script>` to `index.html` | `security`, `code` and `usability` | `privacy.test.js` (constitution V), in its own security step and in `npm test`; runtime guard: external request attempted |
| 5 | Remove `aria-label` from `#task-input` | `usability` | axe `label` (critical) |

Also check FR-014 and SC-006 in a run log: the "Set up job" section lists `GITHUB_TOKEN Permissions`
with `Contents: read`, and `SecurityEvents: write` appears in the `security` job only. GitHub doesn't
allow forking your own repository, so a real fork PR needs a second account and is optional.

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

**Order** (owner decision, analyze C1):
1. The four 001 gaps are fixed in their own branch and PR, so `usability` turns green.
2. Make the repository public.
3. Merge PR #1 (003), then the 001 fix, then this feature's PR, each with all three checks green.
4. Then switch protection on. Every later change goes through the gate.

Verify with:

```bash
gh api repos/SammieEtje/my-specdriven-app/branches/main/protection --jq '.required_status_checks.contexts'
```

It should print `["code","security","usability"]`.

## Results (T031, 2026-10-05)

Run locally on macOS with Node 26 and Playwright Chromium 153.

| Command | Result |
|---------|--------|
| `npm test` | 40 of 40 pass: 17 from 001 and 003, plus the trace, privacy, workflow, html and a11y-exceptions tests |
| `npm run lint` | 0 errors, 0 warnings. A planted unused variable is reported as an `::error` annotation with file, line and rule |
| `npm run format:check` | clean, after the T009 baseline (commit `f04334a`) |
| `npm run lint:security` | clean after the R6 fix. Before it, 2 errors (unsafe `innerHTML` in `renderPhaseList` and `renderTaskList`) |
| `npm audit --audit-level=high` | 0 vulnerabilities |
| `npm run test:e2e` | 9 pass and 4 fail. The failures are exactly the 001 gaps: add a task, filters, empty state, and persist and reload |
| gitleaks | not run locally (no Docker daemon). It first runs in CI on the PR (T034) |

**Defects the gate found and this feature fixed:**
- XSS through a task title typed in the dialog (R4). The payload `<img src=x onerror=…>` now renders as text, checked in Chromium.
- axe `scrollable-region-focusable` (serious) on `#trace-object`: the scrollable trace code block couldn't be reached by keyboard (WCAG 2.1.1). It now has `tabindex="0"` and `aria-label="Trace object"`.

**Correction to the 2026-10-05 manual test:** that test reported "Close returns focus to the page" as a fifth 001 gap. Measured in headless and headed Chrome, the Close button does return focus to Open; the earlier check read focus too early. The baseline is therefore four gaps (spec SC-004 updated).

**Seen while testing, outside 001 FR-012:** closing the dialog by clicking its backdrop leaves focus on the closed `<dialog>` instead of the Open button. FR-012 only names the Close button and Escape, so this is noted, not tested.
