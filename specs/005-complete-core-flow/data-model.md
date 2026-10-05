# Data Model: Kernflow uit feature 001 voltooien

## Task (existing, from 001)

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Unique. Format `task-N`. New ids use (highest N + 1) (R2) |
| `title` | string | Non-empty after trimming. Leading and trailing spaces are removed on add. An empty title from the dialog is restored on close (FR-011) |
| `description` | string | Default `''` |
| `tag` | string | Default `''` |
| `owner` | string | Default `''` |
| `completed` | boolean | `false` for new tasks |

**Transitions**: active ⇄ completed via the checkbox. There is no delete (clarification Q2).

## DemoState (new, persisted)

```json
{ "version": 1, "tasks": [ { "id": "task-1", "title": "…", "description": "", "tag": "", "owner": "", "completed": false } ] }
```

- Stored under the `localStorage` key `spec-driven-todo-demo`.
- Written after every add, toggle and edit (FR-008), and on Persist (FR-010).
- **Rejected as a whole** (fall back to the example tasks, FR-009) when:
  - the key is missing;
  - the JSON is invalid;
  - `version !== 1`;
  - `tasks` is not an array;
  - any entry lacks a string `id`, a string `title` or a boolean `completed`.
- Optional string fields that are missing or not strings become `''`.
- **Repaired, not rejected**: a task whose `title` is empty after trimming gets the title `Untitled task`. This can happen when the page is reloaded while a title is cleared in the dialog, because every edit is saved (analyze U1).

## Filter (new, in memory only)

`'all' | 'active' | 'completed'`. It starts as `'all'` and is not persisted.

When `totalCount === 0` (no tasks at all), the heading is always "No tasks yet" with the 'all' text, whatever the filter (analyze A1). Otherwise:

| Filter | Visible tasks | Empty-state heading | Empty-state text |
|--------|---------------|--------------------|------------------|
| all, with 0 tasks in total | none | No tasks yet | Start by adding the first item to your spec-driven workflow. (the current copy) |
| active | `!completed` | No active tasks | Everything is done. Add a new task to keep going. |
| completed | `completed` | No completed tasks | Check off a task to see it here. |
