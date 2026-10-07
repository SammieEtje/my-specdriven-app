# Research: README en licentie

## R1. License file

- **Decision**: `LICENSE` at the repository root with the unmodified standard MIT text, with the copyright line `Copyright (c) 2026 Sander Ettema`.
- **Rationale**: GitHub detects the license from an exact standard text. Any extra clause in the same file (for example the trademark exclusion) can stop it from detecting MIT (SC-003). The trademark exclusion therefore lives in the README and the notices file (R3).
- **Alternatives considered**: `LICENSE.md` with added terms. Rejected, because detection becomes unreliable.

## R2. Third-party notices (FR-009, SC-004)

- **Decision**: `THIRD_PARTY_NOTICES.md` at the root, with one section per external component:
  - **IBM Plex** (`fonts/*.woff2`): SIL Open Font License 1.1, Copyright © 2017 IBM Corp. with Reserved Font Name "Plex". The full text is in `fonts/OFL.txt`.
  - **Spec Kit** generated files (`.specify/`, `.claude/skills/speckit-*`): MIT, Copyright GitHub, Inc. Verified on 2026-10-06 with `gh api repos/github/spec-kit/license` (SPDX `MIT`). The full MIT text is reproduced, because MIT requires its notice to stay with substantial portions. The Spec Kit version comes from `.specify/init-options.json` (1.0.11).
  - **Polderworks design system** (`.claude/skills/polderworks-design/`): covered by the repository's MIT license (clarification Q2), with the trademark exclusion from R3. The bundle calls React as an external global and contains no React code (checked: no license headers or vendored React).
  - **Development tools** (ESLint, Prettier, Playwright, axe-core and so on): installed from npm into the git-ignored `node_modules/`. They are not distributed with the repository, so they are listed as a short "not redistributed" note with their licenses.
- **Rationale**: One file is the conventional place reviewers and tools look for notices. It keeps the README short.

## R3. Trademark exclusion (FR-010, spec edge case "Merknamen")

- **Decision**: A short "Trademarks" paragraph in the README and the notices file: "Polderworks" and "Loods" are names of the owner's ventures. The MIT license covers the code, tokens and documentation, but grants no right to use these names or the brand identity (logos, name-based endorsement) to suggest affiliation.
- **Rationale**: This is the common pattern in open-source projects that ship a brand (license for the code, separate trademark policy). It avoids changing the MIT text (R1).

## R4. README language and constitution (FR-001, clarification Q3)

- **Decision**: English. This deviates from the constitution's "Taal van UI en documentatie: Nederlands" and is recorded in plan Complexity Tracking. The specs stay Dutch, so the README says so and links to them.

## R5. README structure

- **Decision**, in this order (contract: `contracts/readme-outline.md`):
  1. title and summary;
  2. a quality-gate status badge;
  3. why this exists;
  4. what you can see;
  5. how it was built (the Spec Kit phases, tags, `prompts.md`);
  6. a features table;
  7. lessons learned;
  8. run it;
  9. test it;
  10. quality gate and contributing;
  11. known issues;
  12. license, notices and trademarks;
  13. acknowledgements (Spec Kit, IBM Plex, and the AI assistant, FR-011).
- **Rationale**: A visitor first needs what and why (US1). A developer then needs how (US2) and the terms (US3).

## R6. Keeping facts current (spec edge case "Verouderde getallen")

- **Decision**: The README names no exact test counts. It names the commands and the check categories, and links to each feature's `quickstart.md` "Results" for numbers at a point in time. The features table says "planned" for 002.

## R7. Validation (constitution II)

- **Decision**: Add `readme.test.js` (node:test). It checks:
  - the README exists with every section heading from the contract (FR-001);
  - it has no em-dashes or emoji (FR-012);
  - every relative Markdown link and image path resolves to an existing file (SC-005, local part);
  - `LICENSE` starts with `MIT License` and contains `Sander Ettema` (FR-008);
  - `THIRD_PARTY_NOTICES.md` names IBM Plex with `fonts/OFL.txt`, Spec Kit with `Copyright GitHub, Inc.`, and Polderworks with the trademark exclusion (FR-009, FR-010);
  - every command the README shows in its "Run it" and "Test it" code blocks is an `npm run`/`npm` script that exists in `package.json`, or one of `npm ci` and `npx playwright install chromium` (FR-006).

  External links and GitHub's license detection are checked manually (quickstart).
- **Rationale**: The checks are deterministic and offline, the same style as `design.test.js` and `trace.test.js`.
