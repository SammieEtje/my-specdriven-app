# Quickstart: validate feature 006

## Automated

```bash
npm test               # includes readme.test.js
npm run format:check   # README.md and THIRD_PARTY_NOTICES.md are Prettier-formatted
```

## Manual

1. **Fresh clone (SC-002)**: clone into a temporary directory and follow only the README's "Run it"
   and "Test it" sections. Every step works.
2. **License detection (SC-003)**: after the PR is merged, the repository sidebar on GitHub shows
   "MIT license" (`gh api repos/SammieEtje/my-specdriven-app --jq .license.spdx_id` prints `MIT`).
3. **External links (SC-005)**: every `https://` link in `README.md` and `THIRD_PARTY_NOTICES.md`
   returns HTTP 200 (`curl -sIL -o /dev/null -w '%{http_code}'`).
4. **Reader test (SC-001)**: someone new to the repository reads only the README for 3 minutes and
   then states its purpose and why it exists in their own words.

## Fact check (T004, 2026-10-06)

| Claim in README | Source | Result |
|-----------------|--------|--------|
| Phases specify to implement | `.specify/memory/constitution.md`, Ontwikkelworkflow | matches |
| Converge used for feature 003 | git tag `003-converge` (no converge tag for 004 to 006) | corrected: the first draft said "from 003 on" |
| Tags `<feature>-<phase>` started with 003 | `git tag` (`000-setup`, then `003-*` onward) | matches |
| 001 tasks marked done but not built | `specs/001-…/tasks.md` (T007, T023, T027, T031 marked `[X]`); 004 e2e failures | matches |
| The gate found an XSS and two accessibility defects | `specs/004-…/quickstart.md` Results; `specs/005-…/quickstart.md` Results | matches |
| The Close-button focus measurement error, five gaps corrected to four | `specs/004-…/quickstart.md` Results; 004 spec SC-004 | matches |
| Flaky tests from the Python server and app readiness | `specs/005-…/quickstart.md` Results | matches |
| GitHub Actions outage and re-runs | `specs/005-…/quickstart.md` Results on GitHub | matches |
| Every analyze step found something | `prompts.md` of 003 to 006, Phase: analyze | matches |
| Feature outcomes 001 to 006 | each spec's user stories and plan Summary | matches |
| Development tool licenses | `node_modules/*/package.json` | corrected: eslint-plugin-no-unsanitized is MPL-2.0, not MIT |

## Fresh clone (T007, 2026-10-06)

Cloned into a temporary directory, following only "Run it" and "Test it":

| Step | Result |
|------|--------|
| `npm ci` | OK |
| `npm start`, then http://localhost:8000 | OK (HTTP 200) |
| `npm test` | OK |
| `npm run lint` | OK |
| `npm run format:check` | OK |
| `npm run lint:security` | OK |
| `npx playwright install chromium` | OK |
| `npm run test:e2e` | OK, 28 passed |

## Links (T013, 2026-10-06)

| URL | HTTP |
|-----|------|
| https://github.com/github/spec-kit | 200 |
| https://github.com/IBM/plex | 200 |
| quality-gate workflow page and badge | 200 |
| http://localhost:8000 | local only, by design |

## Reader test (T017, 2026-10-07)

- Reader: the owner, standing in for a new reader (as allowed by T017). The owner is not a first-time reader, so this is weaker evidence for SC-001 than a test with someone new.
- Result: the owner opened `README.md` in the editor and judged it fine ("T017 is oke"). There was no paraphrase of the purpose in the reader's own words.
- Follow-up: a test with someone new to the repository, recording their own words, would make SC-001 conclusive.
