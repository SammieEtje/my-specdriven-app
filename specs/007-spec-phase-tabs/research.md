# Research: Fasetabs met de echte Spec Kit-documenten

All decisions below resolve the open points in the plan's Technical Context. Spec references are to
[spec.md](spec.md).

## R1. How the browser gets the documents (FR-002, FR-003, FR-014)

- **Decision**: Fetch the Markdown files from the same origin at run time, by relative path
  (`specs/<dir>/<file>`). Only one function may call `fetch`: `loadDocument(dir, file)` in `docs.js`,
  and its only call is `fetch(docUrl(dir, file))`. `docUrl` checks both segments against the
  manifest (R2), so no user input or document text can steer a request. Responses are cached per URL
  for the session.
- **Rationale**: The spec requires that the tabs show the files as they are in the repository and
  that no separate copy is kept. A same-origin fetch reads exactly those files. Both servers in use
  (`scripts/serve.js` for the tests, `python3 -m http.server` for `npm start`) already serve them.
- **Privacy guard**: `privacy.test.js` now bans every `fetch(` that is not `fetch(docUrl(`. The
  runtime guard in `e2e/fixtures.js` keeps failing any request that leaves `localhost`. Together they
  keep constitution V intact: the requests are same-origin and carry no user data.
- **Alternatives considered**:
  - A build step that embeds every document into a generated JS module. Rejected: it is a copy that
    can drift (the spec rules that out), and the project has no build step today.
  - Inline `<script type="text/markdown">` blocks in `index.html`. Rejected for the same reason.

## R2. Finding a feature's folder and files (FR-002, FR-004)

- **Decision**: A hand-maintained manifest `FEATURE_DOCS` in `docs.js`, one entry per folder in
  `specs/`: number, folder name, title (from the spec's first heading) and the list of files that
  exist (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `tasks.md`,
  `prompts.md`, `contracts/*.md`). A node test (`docs.test.js`) compares it with the file system and
  fails, with the exact entry to add, when they differ.
- **Rationale**: A static server cannot list a folder, and `data-spec` gives only the number
  (`003`), not the folder name. The manifest is small and the test keeps it honest, the same way
  `trace.test.js` keeps `data-spec` IDs honest. It also lets the plan tab list the `contracts/`
  files, whose names differ per feature.
- **Alternatives considered**: a generator script that writes the manifest. Rejected for now
  (principle I): the test already says what to add, and features are added a few times a month.

## R3. Rendering Markdown without a dependency (FR-006, FR-010)

- **Decision**: A small renderer, `markdown.js`, for the subset the documents use (see
  [contracts/markdown-subset.md](contracts/markdown-subset.md)): ATX headings, paragraphs, bullet and
  numbered lists with nesting, task items, GFM tables, fenced code, block quotes, horizontal rules,
  and inline code, bold, italic and links. Anything the renderer does not know, including raw HTML and HTML comments,
  appears as visible text.
- **Escaping and composition** (analyze U1): the existing `html` template escapes every value,
  including markup built earlier, so it cannot nest blocks. `html.js` therefore gets a second tagged
  template, `markup`. It escapes values exactly like `html`, except values that `markup` itself
  produced (a `SafeHtml` object) and arrays of them, which it inserts as they are. Only `markup` can
  create a `SafeHtml`, so document text can never reach the output unescaped. `renderMarkdown`
  builds everything with `markup` and returns a string. `html` stays unchanged, so its 004 tests and
  callers are untouched.
- **Lint**: `app.js` assigns the result with `innerHTML = renderMarkdown(...)`. The
  `no-unsanitized` configuration lists `markup` under `escape.taggedTemplates` and `renderMarkdown`
  under `escape.methods`, as approved escapers next to `html`. That is configuration, not an
  exception: no disable comments.
- **Rationale**: Principle I allows a runtime dependency only when the standard platform does not
  suffice. A subset renderer is about 200 lines and fully testable with `node --test`.
- **Scheme check without literals**: the link check uses `new URL(href, base).protocol === 'https:'`,
  so no literal `https://` appears in the source (the privacy rule "remote URL" would flag it).
- **Alternatives considered**:
  - `marked` or `markdown-it` with DOMPurify: two runtime dependencies, a CDN or vendored copy, and a
    sanitiser to configure. Rejected under principle I.
  - Showing the raw source: rejected by clarification Q2.
- **Note**: HTML comments occur in four documents (`001/plan.md`, `003/tasks.md`, `005/tasks.md`
  and this plan). Showing them as text follows FR-010 literally; GitHub hides them. Accepted: it is
  1-op-1 and harmless.

## R4. Phase-to-document mapping (FR-003, FR-004, FR-005)

- **Decision**:

  | Tab | Content | Source |
  |-----|---------|--------|
  | specify | whole file | `spec.md` |
  | clarify | section `## Clarifications` up to the next `## ` heading | `spec.md` |
  | plan | whole file, with sub-choices for `research.md`, `data-model.md`, `quickstart.md`, `contracts/*.md` (only those in the manifest) | `plan.md` |
  | tasks | whole file | `tasks.md` |
  | analyze | section `## Phase: analyze` up to the next `## ` heading | `prompts.md` |
  | implement | section `## Phase: implement` up to the next `## ` heading | `prompts.md` |

- A section is found by an exact heading match, so `## Phase: T036 (repository settings)` (004) or
  `## Phase: converge` (003) never land in a tab.
- A missing file or section gives the FR-009 notice. Known cases today: 001 has no
  `## Clarifications` and no analyze or implement section; 002 has only `spec.md` and `prompts.md`.
- **Alternatives considered**: matching headings loosely (case, prefix). Rejected: it would pull in
  the converge section for 003 and hide the real gap.

## R5. Which feature a selection shows (FR-002, FR-007, FR-008)

- **Decision**: On selection, read the `data-spec` of the selected element, keep the feature numbers
  in order of first appearance and drop duplicates (`003:FR-006 005:FR-004 003:FR-005` gives
  `003, 005`). The first one is chosen. If the element has no `data-spec`, use its closest ancestor
  that has one. Numbers without a manifest entry still get a switcher button and show the
  "unknown feature" notice.
- The active phase tab survives a new selection (FR-008). The plan sub-choice resets to `plan.md`
  whenever the feature changes.
- **Rationale**: The `data-spec` trace is the project's real source of truth (constitution III). The
  hand-written `FEATURE_SPECS` map (`spec-01` to `spec-10`) duplicated it and was wrong for the task
  checkbox (README, Known issues).
- **Side effect**: elements show only the features in their tokens. Most carry `003` (restyle) and
  sometimes `005`; few carry their `001` origin. Adding missing `001` tokens is useful but out of
  scope; it is a follow-up note in the README.

## R6. Tab pattern and keyboard (FR-011, constitution IV)

- **Decision**: The WAI-ARIA Tabs pattern with automatic activation: `role="tablist"` with six
  `<button role="tab">`, `aria-selected`, `aria-controls`, and a roving `tabindex` (only the active
  tab is in the Tab order). Left and Right move and activate, Home and End jump to the ends. One
  shared `role="tabpanel"` with `tabindex="0"` and `aria-labelledby` pointing at the active tab.
- The feature switcher and the plan sub-choices are plain button groups with `aria-pressed`, like
  the existing filters.
- **Rationale**: This is the pattern screen readers expect, and automatic activation suits cheap,
  cached content.
- **Test impact**: `e2e/keyboard.spec.js` collects every `button` and expects Tab to reach it. With
  a roving `tabindex` the inactive tabs are deliberately not reachable by Tab. The test excludes
  `[role="tab"][tabindex="-1"]`, and a new test covers the arrow keys.

## R7. Scrolling and layout (edge cases "Zeer lange documenten", "Smalle schermen")

- **Decision**: The tab panel is the only scroll container for the document (`max-height` tied to
  the viewport, `overflow: auto` on both axes) and is focusable (R6). Code blocks wrap
  (`white-space: pre-wrap`) and tables are not wrapped in their own scroll box, so there are no
  nested scroll regions. The tab list wraps onto a second line on narrow screens.
- **Rationale**: Every scroll region must be keyboard-focusable (axe `scrollable-region-focusable`,
  fixed once already in 004). One region means one Tab stop, and the keyboard test's 40-press loop
  stays well within range.
- **Panel width**: unchanged (`1.5fr` / `1fr`). Widening the panel changes 003's layout and is not
  asked for.

## R8. Stale responses and errors (FR-009, SC-006)

- **Decision**: Each render gets an increasing request number; a response that arrives after a
  newer request is dropped. A `404` gives "not produced yet" ("The plan phase has not been run for feature 002 yet"). A network error (the server stopped, or the request blocked) gives "could
  not be loaded" with the repository path. Opening `index.html` via `file://` is not a case: Chrome
  does not load the `type="module"` script from `file://`, so the whole demo stays inert (analyze
  I2). Both use the callout style and never throw.
- **Rationale**: Quick clicking must not show the document of a previous selection. The two notices
  differ because the advice differs: one is a fact about the process, the other about how the demo
  was opened.

## R9. What happens to the old panel and its trace tokens (FR-012)

- **Decision**: Remove `#trace-title`, `.trace-summary`, `#trace-description`, `#trace-object`,
  `#phase-list`, `FEATURE_SPECS` and `buildTrace`, and the CSS for them. Keep one line with the
  selected element and the chosen feature, in mono (FR-012, 003 FR-002).
- Where the removed elements' requirements go:

  | Requirement | Was on | Now on |
  |-------------|--------|--------|
  | 001 FR-007 (trace shows the phases) | trace panel (e2e test) | the tab list |
  | 003 FR-002 (mono for IDs) | `.trace-summary` | the selection line |
  | 003 FR-009 (code block and callout style) | `#trace-object`, `#phase-list` | code blocks in the document (`.md-body pre`) and the notice (`.callout`) |
  | 004 FR-009 (axe) | `#trace-object` | the tab panel, checked with each tab open |

- **Tests that change**: `logic.test.js` (four `FEATURE_SPECS`/`buildTrace` tests go),
  `design.test.js` (the FR-009 test moves to the new selectors), `e2e/core-flow.spec.js` (the
  `spec-01`/`spec-10` assertion becomes a feature/tab assertion), `e2e/keyboard.spec.js` (R6) and
  `e2e/a11y.spec.js` (one more case, every tab open).
- **README**: the panel description and the checkbox known issue are updated in the same change, so
  `readme.test.js` and the README stay true.

## R10. Proving "1-op-1" (SC-001)

- **Decision**: `docs.test.js` renders every document and section in the manifest, strips the tags
  from the output and decodes entities, and compares the word sequence with the word sequence of the
  source. Before splitting into words, both sides lose the same characters: `#`, `*`, `_`,
  `` ` ``, `|`, `>` and `[`, `]`. From the source only, link targets `(url)`, list and task markers
  and table separator rows are removed. Treating both sides the same keeps code such as
  `feature_numbering` or `'**/*'` comparable (analyze A1). Any dropped, added or reordered word fails the test with the file and the
  first difference.
- **Rationale**: This is exactly the claim in SC-001 (same text, without the Markdown syntax), and
  it runs on all real documents, so a new document with unsupported syntax fails CI instead of
  quietly losing text.
