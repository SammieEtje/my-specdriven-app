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
