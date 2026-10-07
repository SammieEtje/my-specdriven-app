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

## Phase: analyze

- Date: 2026-10-07
- Trigger: `/speckit-analyze`, then the owner asked to fix all findings
- Findings: 0 CRITICAL, 2 HIGH, 5 MEDIUM and 3 LOW.
- Remediation:
  - U1: `html` escapes nested markup too, and `innerHTML = renderMarkdown(...)` failed `no-unsanitized`. New `markup` template with a `SafeHtml` fragment type in `html.js`, `markup` and `renderMarkdown` registered as approved escapers (new T031, T032; T006, T008).
  - I1: `loadDocument(dir, file)` with `fetch(docUrl(dir, file))` inside, so it passes its own privacy rule.
  - C1: an e2e test for an unknown feature in a trace.
  - C2: an e2e timing test for SC-003.
  - A1: the SC-001 fidelity test strips the same characters on both sides.
  - I2: `file://` dropped as a scenario, because module scripts do not load there; scenario 11 uses request blocking.
  - I3: the spec's example message is English; the English UI is recorded in Complexity Tracking.
  - I4: SC-004 now says serious or critical violations.
  - A2: US3 scenario 1 fixes automatic activation.
  - C3: T022 checks that the page itself does not scroll.
