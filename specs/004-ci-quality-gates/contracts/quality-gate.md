# Contract: Quality gate

This is the interface the gate exposes to contributors, branch protection and local
development. Changing any name in it is a breaking change for branch protection.

## 1. Triggers (FR-001)

| Event | Filter | Purpose |
|-------|--------|---------|
| `pull_request` | branches: `main`; types: `opened`, `synchronize`, `reopened`, `ready_for_review` | the gate |
| `push` | branches: `main` | baseline on `main`, CodeQL history |
| `workflow_dispatch` | none | manual re-run |

There is no `paths` filter. `pull_request_target` is never used.

## 2. Status checks (FR-012, FR-013)

| Check (job id) | Steps, in order | Fails when |
|----------------|-----------------|-----------|
| `code` | `npm ci` → `npm test` → `npm run lint` → `npm run format:check` | any test fails (including `trace.test.js`, `privacy.test.js`, `workflow.test.js` and `html.test.js`), any ESLint error, or any unformatted file |
| `security` | gitleaks (PR commit range, `--redact`) → `npm ci` → `npm audit --audit-level=high` → dependency review (PRs only, `fail-on-severity: high`) → `npm run lint:security` → CodeQL init and analyze (`javascript`, `security-extended`) | any secret, any high or critical advisory, any unsanitized HTML sink, or a CodeQL alert of error level or high security-severity |
| `usability` | `npm ci` → `npx playwright install --with-deps chromium` → `npm run test:e2e` → upload the report on failure | any axe violation of `serious` or `critical` impact, any control without visible focus, any failing core-flow step, or any attempted request to a non-localhost origin |

Required checks in branch protection on `main`: `code`, `security` and `usability`, with "require
branches to be up to date" enabled.

## 3. Permissions (FR-014)

```yaml
permissions:
  contents: read          # workflow level
# security job only:
#   security-events: write   (CodeQL upload)
#   actions: read
```

Every `uses:` is pinned to a 40-character commit SHA with a `# vX.Y.Z` comment. Every checkout
uses `persist-credentials: false`.

## 4. npm scripts (local parity)

| Script | Command | Used by |
|--------|---------|---------|
| `test` | `node --test` | `code` |
| `lint` | `eslint . --format ./scripts/eslint-github-formatter.js` when `CI` is set, otherwise the default formatter | `code` |
| `lint:security` | `eslint --config eslint.security.config.js app.js logic.js html.js` | `security` |
| `format:check` | `prettier --check .` | `code` |
| `format` | `prettier --write .` | local |
| `test:e2e` | `playwright test` | `usability` |
| `start` | `python3 -m http.server 8000` (unchanged) | local, Playwright `webServer` |

A contributor can run each check locally with these scripts before pushing.

## 5. Exception formats (FR-016)

```text
# .gitleaksignore
# <reason>
<fingerprint>
```

```js
// eslint-disable-next-line <rule> -- <reason>
```

```yaml
# .github/codeql/codeql-config.yml
query-filters:
  - exclude:
      id: <query-id>   # <reason>
```

```js
// e2e/a11y-exceptions.js
export default [ /* { rule: 'color-contrast', selector: '#x', reason: '…' } */ ];
```

## 6. Core-flow test names (FR-011, traceability)

Every Playwright test title starts with the 001 requirement it checks. For example
`001:FR-008 filter Active shows only active tasks`, so a red test points straight back to the spec.

| Test | 001 source |
|------|-----------|
| add a task from the input | US5 / spec-01 |
| check off and un-check a task | FR-002 |
| filter All, Active, Completed | FR-008 |
| empty state when a filter has no tasks | FR-009 |
| open, edit, see the row update | FR-003, FR-005, FR-011 |
| close with the button and Escape, focus returns to Open | FR-012 |
| persist, reload, tasks remain | FR-010 |
| click an element, trace panel shows its spec | FR-006, FR-007 |
