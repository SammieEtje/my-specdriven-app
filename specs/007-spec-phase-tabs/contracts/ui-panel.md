# Contract: Spec panel (feature 007)

This is the binding interface for the new e2e tests (`e2e/spec-tabs.spec.js`), the changed tests in
`e2e/core-flow.spec.js`, `e2e/keyboard.spec.js` and `e2e/a11y.spec.js`, and the static checks in
`design.test.js`.

## Elements (inside `aside.inspector-panel`)

| Element | Role and attributes | `data-spec` |
|---------|---------------------|-------------|
| `section.spec-panel` (was `section.trace-panel`) | `aria-labelledby="spec-panel-title"` | none |
| `p.eyebrow` + `h2#spec-panel-title` | Text "Specification" | none |
| `p#spec-selection` | "Element `<target>` · Feature `<NNN> <title>`", IDs in mono | `007:FR-012 003:FR-002` |
| `div#feature-switcher` | `role="group"`, `aria-label="Linked features"`. One `button.filter-btn` per linked feature, `aria-pressed`, text = number, `title` = feature title. Hidden when there is only one feature. | `007:FR-007` |
| `div#phase-tabs` | `role="tablist"`, `aria-label="Workflow phases"` | `007:FR-001 001:FR-007` |
| `button#tab-<phase>` × 6 | `role="tab"`, `aria-selected`, `aria-controls="phase-panel"`, `tabindex` 0 when selected, -1 otherwise. Text = phase name. | none (covered by the tab list) |
| `div#doc-switcher` | `role="group"`, `aria-label="Plan documents"`. Only in the plan tab when more than `plan.md` exists. One `button.filter-btn` per document, `aria-pressed`. | `007:FR-004` |
| `div#phase-panel` | `role="tabpanel"`, `tabindex="0"`, `aria-labelledby="tab-<phase>"`, `aria-busy` while loading | `007:FR-003 007:FR-005 007:FR-006 007:FR-010 004:FR-009` |
| `p.doc-source` (inside the panel) | The repository path, for example `specs/003-adopt-polderworks-design/spec.md` (section: `#Clarifications`) | none |
| `div.md-body` (inside the panel) | The rendered document | `003:FR-009` |
| `div.callout.doc-notice` (inside the panel, instead of `.md-body`) | The LoadResult notice (data-model) | `007:FR-009 003:FR-009` |

Removed: `#trace-title`, `.trace-summary`, `#trace-feature-id`, `#trace-element`,
`#trace-description`, `#trace-object`, `#phase-list`.

## Events

| Trigger | Result |
|---------|--------|
| Any selection that calls `renderTrace(target)` today (click, Enter or Space on the header, input in a field, checkbox, filter, persist, dialog) | Update `#spec-selection` and the feature switcher. Keep the phase. Load the document. The `.active` outline on the target stays as in 003. |
| Click on a feature button | Set that feature, set `aria-pressed`, load. |
| Click on a tab, or Left / Right / Home / End while a tab has focus | Select that tab (`aria-selected`, roving `tabindex`), move focus to it, load. Left on the first tab wraps to the last and back. |
| Click on a plan document button | Load that document. |
| Document loaded | Replace the panel content. Scroll the panel to the top. Focus stays where it was. |

## Messages (UI text, English like the rest of the interface)

| Case | Text |
|------|------|
| `not-produced` | "The {phase} phase has not been run for feature {NNN} yet." + "Expected at {path}." |
| `unavailable` | "This document could not be loaded." + "Open the demo through a local web server, or read it at {path}." |
| `unknown-feature` | "There is no folder for feature {NNN} in specs/." |
| loading | "Loading {path}" (only visible if loading takes longer than one frame) |
