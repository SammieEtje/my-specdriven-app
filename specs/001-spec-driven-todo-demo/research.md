# Research: Spec-driven todo demo

## Decision

Use a single-page browser demo with a local task model, an editable task dialog, and a right-side trace inspector. Implement the dialog with the browser-native `<dialog>` element and keep the existing DOM-based application architecture.

## Rationale

- The goal is to demonstrate Spec Kit behavior, not to ship a full backend-backed product.
- A single-page layout is the simplest way to show task detail editing and decision trace in one view.
- Native `<dialog>` provides modal semantics, Escape dismissal, and focus handling without a new dependency.
- Local storage is enough for a demo and aligns with the privacy and simplicity principles.

## Alternatives considered

1. Full React + Vite TypeScript app
   - Pros: modern stack, component-based structure.
   - Cons: higher setup cost and extra abstraction for a small demo; not necessary to demonstrate the spec-driven process.

2. Server-backed persistent app
   - Pros: realistic multi-user state.
   - Cons: violates the "browser-only demo" constraint and adds unnecessary complexity.

3. Pure static mock UI without state
   - Pros: minimal implementation.
   - Cons: fails the requirement for task detail edits and dynamic trace behavior.

4. Custom `div` overlay with manually managed modal behavior
   - Pros: full control over markup and presentation.
   - Cons: requires recreating dialog semantics, Escape handling, and focus management already provided by `<dialog>`.

## Resolved unknowns

- No open product ambiguity remains. The minimum value is defined as: task list, task detail editor, filters, and live trace.
- The demo uses browser storage and form interactions rather than external APIs.
- The trace object will be derived from the feature map built around each UI element and the relevant Spec Kit phases.
