# Prompt trace for feature: 007-spec-phase-tabs

## Phase: specify

- Date: 2026-10-07
- Branch: `007-spec-phase-tabs` (from `main`)
- Trigger: `/speckit-specify Ik vind dat het rechter paneel met de specs nog te beperkt is. Is het mogelijk hier voor elke fase een apart tab te realiseren met daarin een 1-op-1 opname van de speckit markdown files?`
- Clarifications:
  - Clarify shows the "Clarifications" section of `spec.md`; analyze and implement show their own section of `prompts.md`.
  - Documents are shown as rendered markdown.
  - The existing summary, trace object and phase list are removed; the panel holds only the phase tabs.

## Phase: plan

- Date: 2026-10-07
- Trigger: `/speckit-plan`
- Design:
  - Documents are fetched from the same origin by one guarded function, `fetch(docUrl(...))`; the privacy test allows nothing else.
  - A hand-kept manifest in `docs.js`, checked against `specs/` by `docs.test.js`.
  - An in-house Markdown subset renderer that escapes through `html`; no new dependency (principle I).
  - The feature follows from the `data-spec` tokens of the selected element; `FEATURE_SPECS` and `buildTrace` are removed.
  - WAI-ARIA tabs with roving `tabindex`; one focusable scroll region.
  - SC-001 is proven by a word-for-word fidelity test over every real document.

## Phase: tasks

- Date: 2026-10-07
- Trigger: `/speckit-tasks`
- Result: 30 tasks. Foundational builds `markdown.js` and `docs.js` test-first, including the SC-001 fidelity test over every document. US1 has 10 tasks, US2 2 and US3 5.
- T030 (push and PR) needs owner confirmation.
