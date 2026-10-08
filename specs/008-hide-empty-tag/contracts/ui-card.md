# Contract: Task card (feature 008)

Binding for `e2e/empty-tag-008.spec.js` and the unit tests in `tag.test.js`.

| Element | Change | `data-spec` |
|---------|--------|-------------|
| `span.tag` in `.task-meta-actions` | Present only when `hasTag(task)`. Text = the tag as entered (unchanged). | keep `003:FR-003`, add `008:FR-001` |
| `span.meta` under the title | Text = `metaLine(task)` | add `008:FR-004` |
| `button.task-open-button` | Unchanged. Same right edge with or without a tag. | keep `003:FR-005` |

Unchanged: ids, `data-target`s, the checkbox, the filters, the dialog, the storage format.
