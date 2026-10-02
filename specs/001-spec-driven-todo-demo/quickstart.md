# Quickstart: Spec-driven todo demo

## Prerequisites

- Modern browser
- Python 3 or any local static file server
- Node.js available for test validation

## Run locally

```bash
cd /Users/sanderettema/Documents/Code/my-specdriven-app
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Validation scenarios

1. Open the page and confirm the task list renders with task cards and metadata.
2. Click a task's Open button to confirm a modal loads editable title, description, tag, and owner fields.
3. Edit each field and confirm the corresponding task card updates immediately.
4. Close and reopen the modal to confirm edited values remain; also verify Escape closes it and restores focus to the invoking Open button.
5. Click a filter button to confirm tasks are filtered by state.
6. Click any UI element to confirm the trace panel updates with the relevant Spec Kit phase summary.
7. Refresh the page and confirm task data still remains available from browser local storage.

## Automated checks

```bash
cd /Users/sanderettema/Documents/Code/my-specdriven-app
npm test
```
