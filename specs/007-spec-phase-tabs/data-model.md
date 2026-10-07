# Data model: Fasetabs met de echte Spec Kit-documenten

Everything here lives in memory in the browser. Nothing is saved, and the task storage format from
005 does not change.

## FeatureEntry (manifest, `FEATURE_DOCS` in `docs.js`)

| Field | Type | Rule |
|-------|------|------|
| `id` | string | Three digits, for example `003`. Unique. |
| `dir` | string | Folder name in `specs/`, for example `003-adopt-polderworks-design`. Starts with `id` + `-`. |
| `title` | string | The text after `Feature Specification:` in the first heading of `spec.md`. |
| `files` | string[] | Relative paths that exist in the folder, from the allowed set: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `tasks.md`, `prompts.md`, `contracts/<name>.md`. |

Validated by `docs.test.js` against the file system (research R2). `checklists/` is not listed (spec
assumption).

## Phase

A fixed, ordered list: `specify`, `clarify`, `plan`, `tasks`, `analyze`, `implement`. Each phase has
a label and one or more DocumentRefs per feature (research R4).

## DocumentRef

| Field | Type | Rule |
|-------|------|------|
| `label` | string | What the plan sub-choice shows, for example `research.md`. |
| `file` | string | One of the entry's allowed files. |
| `section` | string or null | Exact `## ` heading text to cut out (`Clarifications`, `Phase: analyze`, `Phase: implement`), or null for the whole file. |

`phaseDocuments(entry, phase)` returns the DocumentRefs for a phase. For `plan` it returns `plan.md`
first, then the supporting files that exist, in the order `research.md`, `data-model.md`,
`quickstart.md`, `contracts/*` (alphabetical).

## PanelState (module state in `app.js`)

| Field | Initial | Changes when |
|-------|---------|--------------|
| `selectedTarget` | `add-task-button` | An element is selected (click, keyboard, input), as `renderTrace` is called today. |
| `features` | from `data-spec` of the selected element | Every selection (research R5). |
| `featureId` | `features[0]` | Every selection, or a click on the feature switcher. |
| `phase` | `specify` | A tab is activated. Kept across selections (FR-008). |
| `docIndex` | `0` | A plan sub-choice is clicked. Reset to `0` when the feature or phase changes. |
| `requestId` | `0` | Incremented on every render that loads a document (research R8). |

## LoadResult

The outcome of loading one DocumentRef, which decides what the tab panel shows.

| State | When | Panel shows |
|-------|------|-------------|
| `ok` | File loaded and, if a section was asked for, found. | The rendered document, with the source path above it. |
| `not-produced` | The file is not in the manifest, the server returns 404, or the section is absent. | Callout: "This phase has not been run for feature NNN yet", with the expected path. |
| `unavailable` | The request fails (no server, `file://`). | Callout: "This document could not be loaded", with the repository path. |
| `unknown-feature` | The feature number has no manifest entry. | Callout naming the number and stating there is no folder for it in `specs/`. |

## State transitions

```text
select element ─▶ features := tokens(element); featureId := features[0]; docIndex := 0 ─▶ load
choose feature ─▶ featureId := chosen; docIndex := 0 ─▶ load
activate tab   ─▶ phase := tab; docIndex := 0 ─▶ load
choose sub-doc ─▶ docIndex := chosen ─▶ load
load           ─▶ requestId += 1 ─▶ (cached or fetched) ─▶ if requestId is still current: render LoadResult
```
