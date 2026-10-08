# Research: Geen leeg tagkader bij taken zonder tag

## R1. How to leave the tag element out (FR-001, FR-002)

- **Decision**: Insert the task card as today, but without the tag `<span>`. Only when the tag is not empty, insert the tag into that card's `.task-meta-actions` with a separate `insertAdjacentHTML('afterbegin', html`...`)`. The emptiness check is a pure function, `hasTag(task)`, in `logic.js`.
- **Rationale**: The `no-unsanitized` rule from 004 accepts `html`-tagged templates and literals, but not a conditional fragment such as `cond ? html`...` : ''`, also not through a `const` (verified against the installed plugin). A second insert with its own `html` template is accepted as it is. The tag text stays escaped (004 FR-007).
- **Alternatives considered**:
  - Two full card templates, with and without tag: duplicated markup that will drift.
  - Always render the tag and hide it with CSS or `hidden`: FR-002 forbids a hidden element.
  - `markup` from 007, which can nest fragments: not on `main` yet (PR #13 is open). When 007 lands, this can be simplified, but it does not have to be.
  - Creating the element with `document.createElement`: works, but the `data-spec` token would no longer be a literal in `app.js`, so `trace.test.js` could not see it.

## R2. The line under the title (FR-004)

- **Decision**: A pure function `metaLine(task)` in `logic.js` returns the non-empty parts out of owner, tag and "Completed" (when completed), trimmed and joined with " · ". The card shows that text in the existing `span.meta`; for a task without any part the span is empty.
- **Rationale**: One place that is unit-testable for all eight combinations (SC-003). An empty span takes no visible room and keeps the card's structure unchanged for the existing styles.

## R3. Open button position (FR-006)

- **Decision**: No CSS change. `.task-card` already uses `justify-content: space-between` and `.task-meta-actions` does not shrink, so without a tag the actions group is narrower but still ends at the right edge, and every Open button keeps the same right edge. An e2e test compares the right edges.

## R4. Live update from the dialog (FR-003)

- **Decision**: No change needed. Every edit in the dialog already calls `refresh()`, which re-renders the list from the task data. The e2e test proves it for adding and clearing a tag.

## R5. Traceability

- **Decision**: The tag span keeps `003:FR-003` and gains `008:FR-001`. The meta span gains `008:FR-004`. Task-ID comments go in `app.js` and `logic.js`.
