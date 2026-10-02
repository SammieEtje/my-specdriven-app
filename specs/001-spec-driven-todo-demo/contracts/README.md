# Contracts

This feature is implemented as a browser-only UI demo and does not expose an external API or remote service contract. The relevant "contract" is the local interaction model between the task list, the detail editor, and the trace inspector in the single-page app.

- Task list updates the selected task state.
- The task dialog opens with labeled, editable title, description, tag, and owner controls for the selected task.
- Each input change updates the selected task immediately and refreshes the corresponding task card.
- Closing and reopening the dialog retains the edited values; Escape and the close button dismiss it and return focus to the invoking Open button.
- Trace inspector reads the selected element and displays the relevant Spec Kit phase decisions.
