---

description: "Task list for the phase tabs with the real Spec Kit documents"
---

# Tasks: Fasetabs met de echte Spec Kit-documenten

**Input**: Design documents from `/specs/007-spec-phase-tabs/`

**Prerequisites**: plan.md, spec.md, research.md (R1 to R10), data-model.md, contracts/ui-panel.md, contracts/markdown-subset.md, quickstart.md

**Tests**: Included (constitution II). For each part, write the tests first and confirm they fail.

**Organization**: Foundational builds the two pure modules (`markdown.js`, `docs.js`). Then one phase per user story: US1 phase tabs, US2 feature switcher, US3 keyboard and accessibility.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Conventions for every task

- **Contract is binding**: element ids, roles, `data-spec` tokens and message texts are exactly as in `contracts/ui-panel.md`. Markdown output is exactly as in `contracts/markdown-subset.md`.
- **Escaping (004 FR-007)**: every piece of document text becomes markup only through the `html` or `markup` tagged template from `html.js` (research R3). `npm run lint:security` must pass with no disable comments; the only configuration change is the one in T008.
- **One fetch**: `fetch` appears only in `loadDocument(dir, file)` in `docs.js`, and only as `fetch(docUrl(dir, file))` (research R1).
- **No literal remote URLs** in app sources (privacy rule "remote URL"): check schemes with `new URL(...).protocol`.
- **Styles**: design-system tokens only (003 FR-001 to FR-004). No em-dashes or emoji in UI text (003 FR-013). `design.test.js` must stay green.
- **Traceability**: put a task-ID comment by each change (`// T012`, `<!-- T012 -->`, `/* T012 */`). Every new test title starts with the `007:FR-xxx` or `007:SC-xxx` it covers.
- **Formatting**: run `npm run format` after editing. `npm run lint` and `npm run format:check` must pass.

---

## Phase 1: Setup

- [ ] T001 Record the baseline: `npm test` (expect 68 of 68 to pass) and `npm run test:e2e` (expect 28 of 28 to pass). Write both numbers in a "Baseline" line at the top of the "Results" heading you create in `specs/007-spec-phase-tabs/quickstart.md`
- [ ] T002 [P] In `scripts/serve.js`, add `'.md': 'text/markdown; charset=utf-8'` to `TYPES`, so the test server serves the documents as text (research R1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: All three stories need `markdown.js` and `docs.js`.

### Tests for the foundation ⚠️

- [ ] T003 [P] Create `markdown.test.js` (node:test) for `renderMarkdown(source, { baseDir })` and `extractSection(source, heading)` from `markdown.js`, one test per row of `contracts/markdown-subset.md`:
  - `'007:FR-006 headings shift two levels and cap at h6'`: `#` gives `<h3>`, `####` gives `<h6>`, `######` gives `<h6>`;
  - paragraphs join lines with a space; nested bullet and numbered lists (2-space indent); `<ol start="3">` for a list that starts at 3;
  - `'007:FR-006 task items'`: `- [ ] a` and `- [x] b` give `<li class="md-task">` with `<span class="md-check" role="img" aria-label="Open">` and `aria-label="Done"`; `[X]` counts as done; no `<input>` in the output;
  - a GFM table with alignment colons gives `<thead>` and `<tbody>`, and `a \| b` stays one cell;
  - fenced code with a language keeps its content verbatim and escaped inside `<pre><code>`; block quote; `---` gives `<hr>`;
  - inline code, `**bold**`, `*italic*`, `_italic_`;
  - `'007:FR-010 links'`: `https:` gets `target="_blank" rel="noopener noreferrer"`; `[spec](spec.md)` with `baseDir: 'specs/003-x/'` gives `href="specs/003-x/spec.md"`; `javascript:`, `data:` and `http:` give text without `<a>`; a bare `https://` URL stays text;
  - `'007:FR-010 raw HTML is shown as text'`: `<img src=x onerror=alert(1)>` and `<!-- note -->` come back escaped (`&lt;img`) inside `<p>`, with no `<img` or `<!--` in the output;
  - `'007:FR-005 extractSection'`: returns the text from `## Clarifications` up to the next `## ` line; `null` when absent; `## Phase: analyze` does not match `## Phase: analyze extra` or `### Phase: analyze`
- [ ] T004 [P] Create `docs.test.js` (node:test) for `docs.js`:
  - `'007:FR-002 manifest matches specs/'`: for every folder in `specs/`, `FEATURE_DOCS` has one entry where `id` is "Three digits", `dir` "Starts with `id` + `-`", `title` is "The text after `Feature Specification:` in the first heading of `spec.md`", and `files` equals the set of files on disk from the allowed set (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `tasks.md`, `prompts.md`, `contracts/<name>.md`; `checklists/` excluded). On a mismatch, the message prints the exact entry to paste;
  - `'007:FR-002 featuresFor'`: `'003:FR-006 005:FR-004 003:FR-005'` gives `['003', '005']`; an empty string gives `[]`;
  - `'007:FR-004 phaseDocuments'`: per research R4. For 005 `plan` gives `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/ui-behaviour.md` in that order; `clarify` gives `{ file: 'spec.md', section: 'Clarifications' }`; `analyze` and `implement` give `prompts.md` with `Phase: analyze` and `Phase: implement`; `PHASES` is `['specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement']` (FR-001);
  - `'007:FR-014 docUrl'`: `docUrl('003-adopt-polderworks-design', 'spec.md')` gives `specs/003-adopt-polderworks-design/spec.md`; a dir or file outside the manifest, `../`, an absolute path or a URL throws
- [ ] T005 [P] Update `privacy.test.js`: add `docs.js` and `markdown.js` to `FILES`. Replace the `fetch()` rule with `/\bfetch\s*\((?!docUrl\()/` named `fetch() outside docUrl()`. Add self-checks: `fetch('https://x')` and `fetch(url)` are reported, `fetch(docUrl(dir, file))` is not. Title the new tests `'007:FR-014 ...'`

- [ ] T031 [P] Add tests to `html.test.js` for a new `markup` tagged template (research R3):
  - `'007:FR-010 markup escapes like html'`: the same five characters are escaped, and `null` and `undefined` are dropped;
  - `'007:FR-010 markup inserts its own fragments unescaped'`: a `markup` fragment `<b>` around the text `<x>`, inserted into a `markup` fragment `<p>`, gives `<p><b>&lt;x&gt;</b></p>`; an array of `markup` fragments is joined without separators;
  - `'007:FR-010 a plain string or String object is never trusted'`: inserting the string `<b>`, or `new String('<b>')`, gives `&lt;b&gt;`; converting a fragment with `String()` gives its markup;
  - the four existing `html` tests stay unchanged

### Implementation for the foundation

- [ ] T032 Add `markup` and the `SafeHtml` class (not exported; values carry the instance) to `html.js`, per research R3. `html` stays unchanged. Make T031 pass

- [ ] T006 Create `markdown.js` exporting `renderMarkdown(source, { baseDir })` and `extractSection(source, heading)`, exactly per `contracts/markdown-subset.md`. Build all output with `markup` from `html.js` (T032) and return `String(...)`; the only attribute that takes document text is `href`, after the check `new URL(href, base).protocol === 'https:'` (no literal `https://` in the file). Make T003 pass
- [ ] T007 Create `docs.js` exporting `PHASES`, `FEATURE_DOCS` (entries for 001 to 007 from the file system), `featuresFor(dataSpec)`, `phaseDocuments(entry, phase)`, `docUrl(dir, file)` and `async loadDocument(dir, file)`, whose only request is `fetch(docUrl(dir, file))`. `loadDocument` returns `{ state: 'ok', text }`, `{ state: 'not-produced' }` for a 404, or `{ state: 'unavailable' }` when `fetch` throws, and caches the promise per path (data-model LoadResult, research R8). Make T004 and T005 pass
- [ ] T008 In `eslint.security.config.js`, add `docs.js` and `markdown.js` to `files`, add `markup` to `escape.taggedTemplates` and add `escape.methods: ['renderMarkdown']` (research R3). Run `npm run lint:security`
- [ ] T009 Add `'007:SC-001 every document renders word for word'` to `docs.test.js` (research R10): for every file in the manifest, and for each clarify, analyze and implement section that exists, render it, strip tags and decode entities, and compare the word list with the source's word list. Remove the characters `# * _ \` | > [ ]` from **both** sides; from the source only, also remove link targets `(url)`, list and task markers and table separator rows (research R10, analyze A1). On failure, report the file and the first differing word with 5 words of context. Fix `markdown.js` until it passes

**Checkpoint**: `npm test`, `npm run lint` and `npm run lint:security` pass. Nothing in the UI changed yet.

---

## Phase 3: User Story 1 - Per fase het echte document lezen (Priority: P1) 🎯 MVP

**Goal**: The panel shows six phase tabs with the rendered documents of the first feature in the selected element's `data-spec`. The old trace is gone.

**Independent Test**: Select an element, open each tab, and compare the text with the file in `specs/<feature>/` (quickstart scenarios 1, 2, 4, 5, 6, 8).

### Tests for User Story 1 ⚠️

- [ ] T010 [P] [US1] Create `e2e/spec-tabs.spec.js` (import `{ test, expect, gotoApp }` from `./fixtures.js`):
  - `'007:FR-001 six phase tabs in order'`: `#phase-tabs [role="tab"]` texts are `specify, clarify, plan, tasks, analyze, implement`; `#tab-specify` has `aria-selected="true"`;
  - `'007:FR-002 FR-003 specify shows spec.md of the first linked feature'`: on load, `#spec-selection` contains `add-task-button` and `003`; `#phase-panel .doc-source` reads `specs/003-adopt-polderworks-design/spec.md`; `#phase-panel .md-body h3` contains the spec title;
  - `'007:FR-004 plan tab lists supporting documents'`: with the initial selection (feature 003), open the plan tab; `#doc-switcher` shows the buttons `plan.md`, `research.md` and `quickstart.md` in that order (003 has no `data-model.md` or `contracts/`), and clicking `research.md` changes `.doc-source` to `specs/003-adopt-polderworks-design/research.md`;
  - `'007:FR-005 clarify, analyze, implement show their sections'`: for 003, clarify shows `.doc-source` ending in `spec.md` with a section note and an `h4` "Clarifications"; analyze and implement show `prompts.md` sections;
  - `'007:FR-009 missing phase shows a notice'`: open the task dialog (first token `001`), close it, open the clarify tab: `.doc-notice` reads "The clarify phase has not been run for feature 001 yet." and names `specs/001-spec-driven-todo-demo/spec.md`;
  - `'007:FR-010 document HTML is not executed'`: route `**/specs/003-adopt-polderworks-design/spec.md` to return `# T\n\n<img src=x onerror="window.__xss=1">`; the panel shows the text and `window.__xss` stays undefined;
  - `'007:FR-009 SC-006 unreachable document'`: route the same file to `route.abort()`; `.doc-notice` reads "This document could not be loaded." and the Add task button still works;
  - `'007:FR-012 old trace is gone'`: `#trace-object`, `#phase-list` and `#trace-feature-id` do not exist;
  - `'007:FR-009 unknown feature in a trace'`: with `page.evaluate`, set `data-spec="999:FR-001"` on `[data-target="app-header"]`, then click it; `.doc-notice` reads "There is no folder for feature 999 in specs/." and the page shows no error;
  - `'007:SC-003 a tab shows its document within 1 second'`: after load, click `#tab-tasks` and measure until `.doc-source` reads `specs/003-adopt-polderworks-design/tasks.md` and `.md-body` is visible; expect at most 1000 ms
- [ ] T011 [P] [US1] In `e2e/core-flow.spec.js`, rewrite `'001:FR-006 FR-007 click an element, trace panel shows its spec'`: after clicking `#add-task-button`, `#spec-selection` contains `add-task-button` and the six tabs are visible; after clicking `[data-target="app-header"]`, `#spec-selection` contains `app-header` and `003`
- [ ] T012 [P] [US1] In `design.test.js`, rewrite `'FR-009 code block and callout'` (T034 of 003) for the new selectors: `.md-body pre` gets the CodeBlock checks that `.trace-object` had, except `overflow-x` (code wraps, research R7: `white-space: pre-wrap`, no own scroll); `app.js` must contain the markup `class="callout doc-notice"` with `data-spec="007:FR-009 003:FR-009"` and `class="md-body"` with `data-spec="003:FR-009"`; `#phase-panel` in `index.html` must carry `004:FR-009`. Keep the `.callout` assertions

### Implementation for User Story 1

- [ ] T013 [US1] In `index.html`, replace `section.trace-panel` with `section.spec-panel` per `contracts/ui-panel.md`: eyebrow, `h2#spec-panel-title` "Specification", `p#spec-selection`, an empty `div#feature-switcher` (hidden), `div#phase-tabs` with the six `button#tab-<phase>` tabs (`role="tab"`, `aria-controls="phase-panel"`, `aria-selected` and `tabindex` 0 for specify, -1 for the others), an empty hidden `div#doc-switcher`, and `div#phase-panel` (`role="tabpanel"`, `tabindex="0"`, `aria-labelledby="tab-specify"`). All `data-spec` tokens exactly as in the contract table
- [ ] T014 [US1] In `logic.js`, remove `FEATURE_SPECS` and `buildTrace`. In `logic.test.js`, remove the four tests that use them. In `app.js`, remove the old trace elements, `renderPhaseList` and the trace part of `renderTrace`
- [ ] T015 [US1] In `app.js`, implement the panel per `data-model.md` PanelState: `renderTrace(target)` keeps setting `.active` and now reads `data-spec` from the `.feature-target` with that `data-target` (or its closest ancestor with `data-spec`), sets `features` with `featuresFor`, `featureId = features[0]`, `docIndex = 0`, fills `#spec-selection` (element and feature in `<code>`, title from the manifest) and calls `loadPanel()`. Clicking a tab sets `phase`, `aria-selected` and roving `tabindex`, `aria-labelledby` on the panel, and calls `loadPanel()`
- [ ] T016 [US1] In `app.js`, implement `loadPanel()`: get the DocumentRef from `phaseDocuments`, increment `requestId`, set `aria-busy`, call `loadDocument(entry.dir, ref.file)`, drop the result if `requestId` changed (research R8), cut the section with `extractSection` if needed, and render `p.doc-source` plus `div.md-body` (`data-spec="003:FR-009"`) or `div.callout.doc-notice` (`data-spec="007:FR-009 003:FR-009"`) with the texts from the contract's Messages table; `unknown-feature` when the id has no manifest entry. Scroll the panel to the top; do not move focus
- [ ] T017 [US1] In `app.js`, render `#doc-switcher` in the plan tab when `phaseDocuments` returns more than one document: one `button.filter-btn` per document with `aria-pressed`; a click sets `docIndex` and calls `loadPanel()`. Hide it in other tabs (FR-004)
- [ ] T018 [P] [US1] In `styles.css`, remove the `.trace-summary`, `.trace-description`, `.trace-object` and `.phase-*` rules. Add: `#spec-selection` in mono (003 FR-002); `#phase-tabs` as a wrapping flex row with the filter underline style for `[aria-selected="true"]`; `#phase-panel` with `max-height` tied to the viewport and `overflow: auto` (research R7); `.doc-source` as a label; `.md-body` typography for headings, lists, tables (hairline borders), `blockquote`, `code`, `.md-check` (a square box, filled when `aria-label="Done"`), and `.md-body pre` in the CodeBlock style with `white-space: pre-wrap`. Make T012 pass
- [ ] T019 [US1] In `e2e/keyboard.spec.js`, exclude `[role="tab"][tabindex="-1"]` from `expected` (research R6), so the suite matches the roving `tabindex`. Run `npm run test:e2e`: T010 and T011 pass, and the baseline tests that remain still pass

**Checkpoint**: US1 is usable on its own. Quickstart scenarios 1, 2, 4, 5, 6, 8 and 11 work.

---

## Phase 4: User Story 2 - Wisselen tussen gekoppelde features (Priority: P2)

**Goal**: Elements linked to several features get a switcher. The chosen phase tab survives a new selection.

**Independent Test**: Select the task input (003 and 005), switch to 005, and check that every tab shows 005's documents (quickstart scenarios 3 and 7).

### Tests for User Story 2 ⚠️

- [ ] T020 [P] [US2] Add to `e2e/spec-tabs.spec.js`:
  - `'007:FR-007 switcher shows linked features, first is chosen'`: on load (`add-task-button`: `003 005`), `#feature-switcher` is visible with buttons `003` and `005`, and `003` has `aria-pressed="true"`;
  - `'007:FR-007 choosing 005 loads its documents'`: click `005`; `.doc-source` reads `specs/005-complete-core-flow/spec.md`; open the plan tab and `#doc-switcher` lists `contracts/ui-behaviour.md`;
  - `'007:FR-007 single feature hides the switcher'`: click `[data-target="app-header"]` (only `003`); `#feature-switcher` is hidden;
  - `'007:FR-008 phase tab survives a new selection'`: open the tasks tab, click the app header; `#tab-tasks` is still selected and `.doc-source` reads `specs/003-adopt-polderworks-design/tasks.md`;
  - `'007:FR-008 plan sub-choice resets on feature change'`: in the plan tab choose `research.md`, then switch feature; `.doc-source` ends in `plan.md`

### Implementation for User Story 2

- [ ] T021 [US2] In `app.js`, render `#feature-switcher` on every selection: one `button.filter-btn` per id in `features`, text = id, `title` = manifest title (or "Unknown feature"), `aria-pressed`; hidden when `features.length < 2`. A click sets `featureId`, resets `docIndex` to 0, updates `#spec-selection` and calls `loadPanel()`. Make sure `renderTrace` does not reset `phase` (FR-008). Make T020 pass

**Checkpoint**: US1 and US2 work together. Quickstart scenarios 3 and 7 work.

---

## Phase 5: User Story 3 - Lezen en navigeren met het toetsenbord (Priority: P2)

**Goal**: The tabs follow the WAI-ARIA Tabs pattern and axe finds nothing with any tab open.

**Independent Test**: Keyboard only: reach the tabs, move with the arrow keys, Home and End, Tab into the document and scroll it. Axe passes with each tab open (quickstart scenarios 9 and 10).

### Tests for User Story 3 ⚠️

- [ ] T022 [P] [US3] Add `'007:FR-011 arrow keys, Home and End move between tabs'` to `e2e/keyboard.spec.js`: focus `#tab-specify`; Right selects and focuses `#tab-clarify`; End goes to `#tab-implement`; Right wraps to `#tab-specify`; Left wraps to `#tab-implement`; Home goes to `#tab-specify`. After each step exactly one tab has `tabindex="0"` and it is the focused one. Then Tab moves focus to `#phase-panel`, ArrowDown changes its `scrollTop`, and `window.scrollY` stays the same (edge case "Zeer lange documenten")
- [ ] T023 [P] [US3] Add `'007:SC-004 every phase tab has no serious/critical WCAG 2.1 AA violations'` to `e2e/a11y.spec.js`: for each of the six tabs, click it, wait until `#phase-panel` has no `aria-busy="true"`, and expect `seriousViolations(page)` to be `[]`. Do the same with feature `005` chosen
- [ ] T024 [P] [US3] Add `'007:FR-011 narrow screen has no horizontal page scroll'` to `e2e/spec-tabs.spec.js`: at a 375 × 800 viewport, all six tabs are visible and `document.documentElement.scrollWidth` is at most `clientWidth`

### Implementation for User Story 3

- [ ] T025 [US3] In `app.js`, add a `keydown` handler on `#phase-tabs` for ArrowLeft, ArrowRight (both wrap), Home and End: select the target tab as a click would (automatic activation, research R6) and focus it. Make T022 pass
- [ ] T026 [US3] Fix whatever T023 and T024 report, in `styles.css` or `app.js`, without adding entries to `e2e/a11y-exceptions.js`

**Checkpoint**: All three stories work. `npm run test:e2e` passes in full.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T027 [P] In `README.md`, rewrite the "The decision trace" bullet under "What you can see" to describe the phase tabs and the real documents, and remove the known issue about the task checkbox trace. Add the note from plan Complexity Tracking: elements show only the features in their own `data-spec` tokens. Run `node --test readme.test.js`
- [ ] T028 Run the full gate locally: `npm test`, `npm run lint`, `npm run lint:security`, `npm run format:check`, `npm run test:e2e`. Then walk through the 12 manual scenarios in `specs/007-spec-phase-tabs/quickstart.md` (headless Chromium is fine; scenario 11 with request blocking for `*/specs/*`) and record the results under "Results", next to the T001 baseline
- [ ] T029 Append `## Phase: implement` to `specs/007-spec-phase-tabs/prompts.md`, commit, and tag `007-implement`
- [ ] T030 **After confirmation**: push `007-spec-phase-tabs` and its tags and open a PR to `main`. Make sure `code`, `security`, `usability` and CodeQL are green, and record the run URL in `quickstart.md`

---

## Dependencies & Execution Order

- **Setup**: T001, then T002 (any time before the e2e tests run).
- **Foundational**: T003, T004, T005 and T031 in parallel → T032 → T006 and T007 → T008 → T009. Blocks every story. T031 and T032 were added by analyze (U1) and keep their IDs.
- **US1 (P1)**: after Foundational. Tests T010 to T012 first, then T013 → T014 → T015 → T016 → T017; T018 in parallel with T015 to T017; T019 last. It is the MVP.
- **US2 (P2)**: after US1 (it extends `renderTrace` and the panel in `app.js`).
- **US3 (P2)**: after US1. Its tests can be written alongside US2; T025 and T026 touch `app.js`, so run them after T021.
- **Polish**: after all stories. T030 needs the owner's confirmation.

### Parallel Opportunities

- T003, T004, T005 and T031: four different test files.
- T010, T011 and T012: three different test files.
- T018 (`styles.css`) next to T015 to T017 (`app.js`).
- T022, T023 and T024: three different test files.
- T027 (`README.md`) at any time after US1.

## Parallel Example: Foundational

```bash
Task: "markdown.test.js for the subset and the safety rules"       # T003
Task: "docs.test.js for the manifest, mapping and docUrl"          # T004
Task: "privacy.test.js: new files and the fetch(docUrl( rule"      # T005
```

## Parallel Example: User Story 1

```bash
Task: "e2e/spec-tabs.spec.js US1 tests"                           # T010
Task: "core-flow.spec.js 001:FR-006 FR-007 rewrite"                # T011
Task: "design.test.js FR-009 on .md-body pre and .doc-notice"      # T012
```

## Implementation Strategy

1. **MVP**: Setup, Foundational and US1. The panel shows the real documents per phase for the element's first feature, and the old trace is gone.
2. US2 adds the switcher and keeps the tab across selections. US3 completes the keyboard pattern and the axe checks.
3. Polish updates the README, runs the quickstart and ends with the PR. All three gate checks must be green.

## Notes

- The definition of done is the green `usability` check on the PR, with SC-001 proven by T009 on all real documents.
- Out of scope (plan, Complexity Tracking): adding the missing `001` tokens to elements.
