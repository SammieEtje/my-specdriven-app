# Data Model: Kwaliteitspoort voor pull requests

This feature stores no application data. The entities below describe what the gate produces and
where each one lives. They are derived from the spec's Key Entities.

## Check

One status check in the pull request, shown as one GitHub Actions job.

| Field | Values | Source |
|-------|--------|--------|
| `name` | `code`, `security`, `usability` (exact, case-sensitive) | job id in `.github/workflows/quality-gate.yml` |
| `category` | same as `name` | FR-012 |
| `status` | `queued`, `in_progress`, `success`, `failure`, `cancelled`, `timed_out` | GitHub check run |
| `steps` | ordered tool runs; see [contracts/quality-gate.md](contracts/quality-gate.md) | workflow |
| `timeout` | 10 minutes | FR-015 |

**Rules**:
- A check is `success` only if every step exits 0. No step may use `continue-on-error` (FR-015).
- `timed_out` and `cancelled` count as failure for branch protection (FR-013).
- A newer push to the same PR cancels the running checks (`concurrency`) and starts new ones.

**State transitions**: `queued` → `in_progress` → one of `success`, `failure` or `timed_out`.
Any state can move to `cancelled` when a newer commit arrives.

## Finding

One reported problem, produced by a step.

| Field | Constraint |
|-------|-----------|
| `check` | the `Check.name` it belongs to |
| `tool` | `node-test`, `eslint`, `prettier`, `trace`, `gitleaks`, `npm-audit`, `dependency-review`, `codeql`, `no-unsanitized`, `privacy`, `axe`, `playwright` |
| `severity` | tool-native. A finding fails the check when: any ESLint error; any gitleaks hit; npm audit or dependency review `high`/`critical`; CodeQL `error` or a security-severity of high or above; axe `serious`/`critical`; any failing test |
| `file` | repository-relative path. Required, except for dependency findings (package name instead) |
| `line` | 1-based, where the tool provides one |
| `reason` | human-readable message. For gitleaks the secret is redacted (FR-005) |

**Surfacing** (FR-012): an inline annotation (`::error file=,line=::` or the tool's own
annotations), the job log, and a short table in the job summary.

## Exception

A recorded, reasoned waiver of one specific finding (FR-016).

| Field | Constraint |
|-------|-----------|
| `tool` | one of the tools in R8 |
| `target` | the gitleaks fingerprint, ESLint rule plus code location, CodeQL query id, or axe rule plus selector |
| `reason` | required and non-empty |
| `location` | `.gitleaksignore`, an inline `eslint-disable-next-line … -- reason`, `.github/codeql/codeql-config.yml` or `e2e/a11y-exceptions.js` |

**Rules**: an exception without a reason fails the check. For ESLint this is enforced by
`eslint-comments/require-description`. For axe, the exceptions loader throws on an empty
`reason`. Exceptions are reviewed like any other change, because they live in the PR diff.
