# Implementation Plan: Fasetabs met de echte Spec Kit-documenten

**Branch**: `007-spec-phase-tabs` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-spec-phase-tabs/spec.md`

## Summary

Replace the hand-written decision trace in the right panel with six phase tabs (specify, clarify,
plan, tasks, analyze, implement) that show the real Spec Kit documents of the feature behind the
selected element, rendered as Markdown.

- **Which feature**: read from the `data-spec` tokens of the selected element. A switcher appears
  when there is more than one (R5).
- **Where the text comes from**: the files in `specs/`, fetched from the same origin by one guarded
  function, with a manifest that a test keeps in step with the file system (R1, R2).
- **Phase mapping**: whole files for specify, plan (with its supporting documents) and tasks.
  Exact sections for clarify (`spec.md`) and analyze and implement (`prompts.md`) (R4).
- **Rendering**: a small in-house Markdown renderer that escapes everything through the existing
  `html` template. No new dependency (R3).
- **What goes**: `FEATURE_SPECS`, `buildTrace`, the trace object and the phase list. Their trace
  tokens move to the new elements (R9).

## Technical Context

**Language/Version**: JavaScript ES modules in the browser, without a build step, as in 001 to 006.
Node.js 24 for the tests.

**Primary Dependencies**: none new. Dev tools unchanged (Playwright, axe, ESLint, Prettier).

**Storage**: none. Documents are cached in memory for the session; the task storage from 005 is
unchanged.

**Testing**: `node --test` for the renderer, the manifest, fidelity (SC-001), privacy, trace and
design checks; Playwright for tabs, keyboard and axe.

**Target Platform**: current desktop and mobile browsers, served over HTTP from `localhost`
(`scripts/serve.js` or `python3 -m http.server`).

**Project Type**: static single-page web app.

**Performance Goals**: a tab shows its document within 1 second locally (SC-003). Files are at most
a few hundred lines and are cached after the first load.

**Constraints**:
- No request leaves the origin, and no user data is sent (FR-014, constitution V). Only
  `fetch(docUrl(...))` is allowed (R1).
- All document text is escaped before it becomes markup; `lint:security` passes without exceptions
  (FR-010, 004 FR-007).
- One keyboard-focusable scroll region in the panel (R7).
- No em-dashes or emoji in the UI text (003 FR-013).

**Scale/Scope**: 7 feature folders, about 45 Markdown files. 2 new modules (`docs.js`,
`markdown.js`), 2 new node test files, 1 new e2e file, changes to `index.html`, `app.js`,
`logic.js`, `styles.css`, `scripts/serve.js`, `README.md` and 6 existing test files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Eenvoud boven alles | Pass | No backend and no runtime dependency. The renderer covers only the syntax the documents use (R3). The manifest is hand-kept with a test instead of a generator (R2). |
| II. Elke requirement is testbaar | Pass | FR-001, FR-007, FR-008, FR-009, FR-011, FR-012: e2e. FR-002, FR-004, FR-005: unit tests on `docs.js` plus e2e. FR-003, FR-006, FR-010: unit tests on `markdown.js` and the fidelity test over all real documents (R10). FR-013: `trace.test.js`. FR-014: `privacy.test.js` and the runtime guard. |
| III. Traceerbaarheid | Pass | New elements carry `007:FR-xxx` tokens (contract). Removed elements' tokens move, per the table in R9. Task IDs go in comments, prompts in `prompts.md`, tags `007-<phase>`. |
| IV. Toegankelijk | Pass | WAI-ARIA Tabs with roving `tabindex`, `aria-pressed` groups, a focusable scroll region, and axe with every tab open (R6, R7). |
| V. Gebruikersdata blijft lokaal | Pass | Same-origin requests for repository files only, guarded statically and at run time (R1). |

**Techniekkader**: the constitution names TypeScript, React and Vite; the app has been plain
JavaScript without a build since 001. This feature keeps that, as features 003 to 006 did. No new
deviation.

**Post-design re-check**: Still passes. The design adds `fetch` to the app for the first time; R1
narrows it to one function and adapts the privacy test, so principle V stays enforced rather than
weakened.

## Project Structure

### Documentation (this feature)

```text
specs/007-spec-phase-tabs/
├── plan.md               # This file
├── research.md           # R1 to R10
├── data-model.md         # Manifest, phases, panel state, load results
├── quickstart.md         # Automated checks and 12 manual scenarios
├── contracts/
│   ├── ui-panel.md       # Elements, roles, data-spec, events, messages
│   └── markdown-subset.md
├── checklists/
│   └── requirements.md
├── prompts.md
└── tasks.md              # Next: /speckit-tasks
```

### Source Code (repository root)

```text
index.html               # aside: trace panel replaced by the spec panel (contract)
app.js                   # renderTrace(target) now drives the panel; tabs, switchers, loading
docs.js                  # NEW: FEATURE_DOCS, PHASES, featuresFor(), phaseDocuments(), docUrl(), loadDocument()
markdown.js              # NEW: renderMarkdown(), extractSection()
logic.js                 # FEATURE_SPECS and buildTrace removed
styles.css               # trace styles out; tabs, switchers, .md-body, notice in
scripts/serve.js         # '.md' content type
README.md                # panel description and the checkbox known issue
eslint.security.config.js# docs.js and markdown.js added
markdown.test.js         # NEW: syntax, escaping, links, sections
docs.test.js             # NEW: manifest vs file system, phase mapping, SC-001 fidelity
logic.test.js            # trace tests removed
design.test.js           # FR-009 check on the new selectors
privacy.test.js          # new files, fetch(docUrl( rule plus self-checks
e2e/spec-tabs.spec.js    # NEW: US1 to US3, edge cases
e2e/core-flow.spec.js    # 001:FR-006/FR-007 test on the new panel
e2e/keyboard.spec.js     # inactive tabs excluded; arrow-key test
e2e/a11y.spec.js         # axe with each tab open
```

**Structure Decision**: Flat files in the repository root, like the existing `logic.js` and
`html.js`. The pure modules (`docs.js` without `loadDocument`, `markdown.js`) are tested with
`node --test`; `app.js` stays the only module that touches the DOM.

## Complexity Tracking

No constitution violations to justify.

Risk noted for later: elements show only the features in their own `data-spec` tokens. Most point
to 003 and 005, few to their 001 origin (R5). Adding those tokens is a separate change.
