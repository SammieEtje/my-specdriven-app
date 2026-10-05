# Contract: UI behaviour for feature 005

This is the binding interface for the e2e tests (`e2e/core-flow.spec.js` from 004 and the new
`e2e/core-flow-005.spec.js`) and for the 003 and 004 static tests.

## Elements

| Element | Change | `data-spec` |
|---------|--------|-------------|
| `form.composer` (was `section.composer`) | `novalidate`, submit handler | `005:FR-001` |
| `#task-input` | unchanged id, `data-target` and `aria-label`. Gets `aria-invalid` and `aria-describedby="task-input-error"` on error | keep `003:FR-006`, add `005:FR-004` |
| `#add-task-button` | becomes `type="submit"` | keep `003:FR-005`, add `005:FR-001` |
| `#task-input-error` (new `<p>`) | empty unless there is an error. Text: "Enter a task title." | `005:FR-004` |
| `.filter-btn` × 3 | clicking sets the filter and re-renders | keep `003:FR-006`, add `005:FR-005` |
| `#empty-state` | shown when the filtered list is empty. Heading and text per data-model table | keep `003:FR-003`, add `005:FR-007` |
| `div.meta-actions` (new wrapper) | groups `#save-state` and `#app-status` so the footer keeps two items (analyze L1) | none |
| `#save-state` | saves and announces | keep `003:FR-005`, add `005:FR-010` |
| `#app-status` (new `<p role="status">`) | "Demo state saved" / "Task added to Active". Clears after 4 s | `005:FR-005 005:FR-010` |

## Events

| Trigger | Result |
|---------|--------|
| form `submit` (click or Enter) | `createTask`. On success: append, save, clear and focus the input, re-render. If the filter is `completed`, show "Task added to Active". On failure: show the error |
| `input` on `#task-input` | clear the error and `aria-invalid` |
| checkbox click | toggle, save, re-render (filtered) |
| filter click | set `currentFilter`, sync `aria-pressed`, re-render |
| dialog field `input` | update the task (001), save |
| dialog `close` | if the title is empty, restore it, re-render and save. Focus returns to Open (unchanged) |
| `#save-state` click | save, then announce "Demo state saved" |
| page load | `parseState(localStorage[key], exampleTasks)` |

The trace behaviour is unchanged. Each click still calls `renderTrace(data-target)`.
