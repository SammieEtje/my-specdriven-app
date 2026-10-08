# Implementation Plan: Geen leeg tagkader bij taken zonder tag

**Branch**: `008-hide-empty-tag` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-hide-empty-tag/spec.md`

## Summary

A task card shows its tag frame only when the tag has text, and the line under the title shows only the parts that exist (owner, tag, "Completed"), joined by " · ". Two pure functions in `logic.js` decide this (`hasTag`, `metaLine`). `app.js` inserts the card without the tag and adds the tag with its own escaped template only when there is one, because the 004 lint does not accept conditional HTML fragments (research R1).

## Technical Context

**Language/Version**: JavaScript ES modules in the browser, no build step, as in 001 to 007. Node.js 24 for the tests.

**Primary Dependencies**: none new.

**Storage**: unchanged (`localStorage`, format from 005).

**Testing**: `node --test` for `hasTag` and `metaLine`; Playwright for the card in the browser.

**Target Platform**: current browsers, served from `localhost`.

**Project Type**: static single-page web app.

**Performance Goals**: none beyond today; one extra insert per tagged card.

**Constraints**: `lint:security` passes with no exceptions; design tokens only; no em-dashes or emoji.

**Scale/Scope**: `logic.js`, `app.js`, one new unit test file, one new e2e file. No change to `index.html` or `styles.css`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Eenvoud boven alles | Pass | Two small pure functions and one conditional insert. No dependency, no CSS change. |
| II. Elke requirement is testbaar | Pass | FR-001, FR-002, FR-003, FR-005, FR-006: e2e. FR-001 and FR-004 also unit-tested (`hasTag`, `metaLine` for every combination). |
| III. Traceerbaarheid | Pass | `008:FR-001` on the tag, `008:FR-004` on the meta line; task-ID comments; `prompts.md`; tags `008-<phase>`. |
| IV. Toegankelijk | Pass | A task without a tag has no empty element for a screen reader to announce (FR-002). The axe checks from 004 keep running. |
| V. Gebruikersdata blijft lokaal | Pass | No change to storage or requests. |

**Post-design re-check**: Still passes.

## Project Structure

### Documentation (this feature)

```text
specs/008-hide-empty-tag/
├── plan.md
├── research.md          # R1 to R5
├── data-model.md        # hasTag, metaLine
├── quickstart.md
├── contracts/
│   └── ui-card.md
├── checklists/
│   └── requirements.md
├── prompts.md
└── tasks.md             # Next: /speckit-tasks
```

### Source Code (repository root)

```text
logic.js                     # hasTag(), metaLine()
app.js                       # renderTaskList: meta line from metaLine(), tag inserted only when hasTag()
tag.test.js                  # NEW: unit tests for hasTag and metaLine
e2e/empty-tag-008.spec.js    # NEW: browser checks for US1 and US2
```

**Structure Decision**: Flat files in the repository root, like the existing `logic.js` and `core-flow.test.js`.

## Complexity Tracking

No constitution violations to justify.

Merge note: if PR #13 (007) lands first, update this branch from `main` and add the 008 entry to `FEATURE_DOCS` in `docs.js`, or `docs.test.js` fails (spec Assumptions).
