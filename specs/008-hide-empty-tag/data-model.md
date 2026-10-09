# Data model: Geen leeg tagkader bij taken zonder tag

No stored data changes. The task record and the storage format from 005 stay as they are.

## Derived values (pure functions in `logic.js`)

| Function | Input | Output | Rule |
|----------|-------|--------|------|
| `hasTag(task)` | a task | boolean | `true` when `task.tag` is a string that is not empty after `trim()`. |
| `metaLine(task)` | a task | string | The trimmed owner, the trimmed tag and `Completed` (only when `task.completed`), leaving out empty parts, joined with ` · `. No separator at the start, at the end or twice. |

### `metaLine` examples

| owner | tag | completed | result |
|-------|-----|-----------|--------|
| `Ava` | `Marketing` | false | `Ava · Marketing` |
| `Ava` | `` | false | `Ava` |
| `` | `Marketing` | false | `Marketing` |
| `` | `` | false | `` |
| `` | `` | true | `Completed` |
| `Leo` | `Product` | true | `Leo · Product · Completed` |
| `  ` | `  ` | false | `` |
