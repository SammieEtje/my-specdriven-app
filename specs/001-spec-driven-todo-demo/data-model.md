# Data Model: Spec-driven todo demo

## Entities

### Task

Represents a single to-do item in the demo board.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Stable unique identifier for the task |
| title | string | Main visible label of the task |
| description | string | Longer note or explanation for the task |
| tag | string | Grouping label such as Marketing or Product |
| owner | string | Person responsible for the task |
| completed | boolean | Indicates whether the task is done |

**Relationships**
- One task belongs to the current filtered list view and may be selected by the user.
- A selected task drives the editable task detail modal.

### Task Detail Modal

Represents the modal editor state for the selected task.

| Field | Type | Description |
| --- | --- | --- |
| selectedTaskId | string | The task currently opened by the user |
| title | string | Editable title, written directly to the selected task |
| description | string | Editable description, written directly to the selected task |
| tag | string | Editable grouping tag, written directly to the selected task |
| owner | string | Editable owner, written directly to the selected task |

**Relationships**
- Bound to exactly one selected Task.
- Input changes write directly to that task and refresh its list card.
- Closing and reopening the modal shows the latest task values.
- The invoking Open button regains focus when the modal closes.

### Spec Trace

Represents the visible trace object displayed when a UI element is clicked.

| Field | Type | Description |
| --- | --- | --- |
| selectedElement | string | Target element ID clicked by user |
| featureId | string | Feature reference such as `spec-08` |
| title | string | Feature title associated with the element |
| description | string | Human-readable summary of the specific feature |
| source | string | Origin statement from the feature specification |
| phases | array | Ordered list of `phase` + `decision` objects |

**Relationships**
- Tied to the specific feature referenced by the selected UI element.
- Each phase maps to a Spec Kit decision stage: specify, clarify, plan, tasks, implement.

### Phase Decision

Represents one stage in the trace summary.

| Field | Type | Description |
| --- | --- | --- |
| phase | string | One of specify, clarify, plan, tasks, implement |
| decision | string | Human-readable explanation of the decision made in that phase |
