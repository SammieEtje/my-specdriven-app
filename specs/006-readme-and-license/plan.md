# Implementation Plan: README en licentie

**Branch**: `006-readme-and-license` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-readme-and-license/spec.md`

## Summary

Add three documents at the repository root:

- **`LICENSE`**: the standard MIT text, with Sander Ettema as copyright holder.
- **`THIRD_PARTY_NOTICES.md`**:
  - IBM Plex under OFL 1.1;
  - Spec Kit under MIT (Copyright GitHub, Inc.);
  - the Polderworks design system under the repo's MIT license, with the trademark exclusion;
  - a note that dev tools are not redistributed.
- **An English `README.md`** that explains what the repository is, why it exists, how it was built feature by feature, what was learned, how to run and test it, how the quality gate and contributing work, and the terms.

A new `readme.test.js` verifies the structure, links, writing rules and license facts offline. Nothing in the demo itself changes.

## Technical Context

**Language/Version**: Markdown (GitHub-flavoured). Node.js for the validation test, as in 004.

**Primary Dependencies**: none new.

**Storage**: N/A.

**Testing**: `node --test` (new `readme.test.js`), plus manual checks of GitHub's license detection and external links.

**Target Platform**: The repository front page on GitHub.

**Project Type**: Documentation for an existing static web app.

**Performance Goals**: A stranger understands the purpose within 3 minutes (SC-001).

**Constraints**:
- `LICENSE` must keep the exact MIT text, so GitHub detects it (R1).
- No em-dashes or emoji (FR-012).
- No personal data beyond the owner's name (spec edge case).
- The README is formatted by Prettier, as the `code` check requires.

**Scale/Scope**: 3 new root files and 1 test file.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Eenvoud boven alles | Pass | Plain files and no dependency. The test uses only node built-ins. |
| II. Elke requirement is testbaar | Pass | All FRs are covered by `readme.test.js`. FR-002, FR-003, FR-005 and FR-007 get content checks with required terms and links per section (analyze H1); FR-004 checks the features table, and FR-006 the commands. The quality of the writing is also checked by the SC-001 reader test (T017). |
| III. Traceerbaarheid | Pass | No UI elements. Task-ID comments go in the test, alongside `prompts.md` and the `006-<phase>` tags. |
| IV. Toegankelijk | Pass | The README uses a proper heading hierarchy, descriptive link text, and alt text for any image. |
| V. Gebruikersdata blijft lokaal | Pass | No change to the app. The README badge is an image on GitHub, not part of the demo. |

**Post-design re-check**: Still passes.

## Project Structure

### Documentation (this feature)

```text
specs/006-readme-and-license/
├── plan.md
├── research.md            # R1–R7
├── data-model.md          # the three documents and the notice entries
├── quickstart.md
├── contracts/
│   └── readme-outline.md  # required README sections and what each must say
├── checklists/requirements.md
└── prompts.md
```

### Source Code (repository root)

```text
LICENSE                    # MIT, unmodified text
THIRD_PARTY_NOTICES.md     # IBM Plex, Spec Kit, Polderworks design system, dev tools
README.md                  # English, sections per contracts/readme-outline.md
readme.test.js             # offline checks (R7)
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| The README is in English, while the constitution says documentation is in Dutch | The repository is public and meant for an international audience (clarification Q3). The UI, plans and design system are already English (plan 003, Complexity Tracking). | A Dutch README would shut out most visitors. A bilingual README would mean two texts to keep in sync for a small demo. The specs stay Dutch, and the README says so. |
