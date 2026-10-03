# Implementation Plan: Polderworks-designsysteem adopteren

**Branch**: `003-adopt-polderworks-design` | **Date**: 2026-10-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-adopt-polderworks-design/spec.md`

## Summary

Restyle the todo demo and its decision-trace panel to the central Polderworks design system without
changing behaviour. `styles.css` imports the design system's colour, typography, spacing and effect
tokens directly from `.claude/skills/polderworks-design/tokens/` and rewrites every rule to use those
tokens only. The design system's React components are re-expressed as plain CSS classes (button
variants, input, tabs-style filters, tag, status dot, dialog, code block, callout), so no runtime
dependency is added. IBM Plex is self-hosted in `fonts/` so the app works offline. The app moves to
the light theme. No logo or endorsement line is shown (FR-014).

## Technical Context

**Language/Version**: Browser JavaScript ES modules, CSS (custom properties, `@import`, `:has()`)

**Primary Dependencies**: None at runtime. Design tokens come from the in-repo `polderworks-design`
skill. IBM Plex `woff2` files are vendored as static assets (SIL OFL).

**Storage**: Unchanged (in-memory and `localStorage` from 001 and 002). This feature adds no data.

**Testing**: `node --test`. The existing `logic.test.js` plus a new `design.test.js` for static
design-system checks and contrast calculation. Manual validation in `quickstart.md`.

**Target Platform**: Current evergreen browsers (Chrome, Firefox, Safari, Edge), served by
`python3 -m http.server`.

**Project Type**: Single-page static web app, no build step.

**Performance Goals**: The page is usable within 2 seconds offline (SC-005). Fonts add about 150 KB,
loaded with `font-display: swap`.

**Constraints**: Offline-capable, no third-party requests, WCAG 2.1 AA, no behaviour change (FR-012),
only design-system tokens in app CSS (FR-001).

**Scale/Scope**: 1 page, 2 panels, 1 dialog. About 390 lines of CSS rewritten, small markup and
`app.js` touches.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Eenvoud boven alles | Pass | No runtime dependency. The React bundle is not loaded (research R1). Fonts are static files, not a dependency (R2). |
| II. Elke requirement is testbaar | Pass with note | FR-001 to FR-004, FR-010, FR-011 and FR-013 are covered by `design.test.js`. FR-012 is covered by the existing `logic.test.js`. FR-005 to FR-009 and FR-014 are covered by static markup and CSS assertions in `design.test.js`, plus manual checks in the quickstart. The constitution names Vitest and Playwright, but the project runs `node --test` (an existing deviation since 001; see Complexity Tracking). |
| III. Traceerbaarheid | Pass | Changed elements get `003:FR-xxx` tokens in `data-spec` (space-separated alongside 001 tokens, R8). There's a `spec-10` trace entry, task IDs go in code comments, `prompts.md` is updated, and the phase ends with a commit and the `003-plan` tag. |
| IV. Toegankelijk | Pass | Contrast was checked per token pair (R4). Focus ring and traced-element outline are distinct without colour. Filters get `aria-pressed`. |
| V. Gebruikersdata blijft lokaal | Pass | Google Fonts is replaced by self-hosted fonts (R2). There are no new network requests. |

**Post-design re-check**: Still passes. The contracts and data model add no dependency, network call or
untraceable element.

## Project Structure

### Documentation (this feature)

```text
specs/003-adopt-polderworks-design/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── ui-styling.md    # Element-to-pattern contract
├── checklists/
│   └── requirements.md
├── prompts.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html               # light markup changes: aria-pressed, status dot, tag classes, data-spec tokens
styles.css               # rewritten on design-system tokens; @imports tokens + fonts/fonts.css
app.js                   # remove inline rgba outline (R5); aria-pressed sync; tag/status classes in task markup
logic.js                 # + spec-10 trace entry
design.test.js           # new: static design-system and contrast checks
logic.test.js            # unchanged, must keep passing
fonts/
├── fonts.css            # @font-face for IBM Plex Sans / Mono
├── IBMPlexSans-*.woff2
├── IBMPlexMono-*.woff2
└── OFL.txt
.claude/skills/polderworks-design/tokens/   # source of truth, read-only for this feature
```

**Structure Decision**: Keep the existing flat, no-build layout at the repository root. The only new
directory is `fonts/`. The design system stays under `.claude/skills/polderworks-design` and is
consumed, never edited.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Tests use `node --test`, not Vitest or Playwright (Techniekkader, II) | The project has run on `node --test` without a build since 001. Static CSS and HTML checks need no browser. | Adding Vitest, Playwright and browser binaries for a restyle adds more setup than the feature itself. Visual and keyboard checks stay manual in `quickstart.md`. |
| App is plain JS, not React and TypeScript (Techniekkader) | This is an existing deviation since 001. This feature keeps it. | Migrating to React just to use the design system's React components would turn a restyle into a rewrite. |
| UI text and the plan, research and tasks documents are in English, not Dutch (Techniekkader) | The UI has been English since 001, and the spec keeps the existing interface language. The design system and its docs are English, so the plan and tasks quote its terms directly. The spec stays in Dutch. | Translating the UI would be a content change, which this feature excludes. Translating the plan documents would add work without changing what gets built. |
| Form control borders use `--text-secondary`, not the design system's `--border-default`. The active filter underline uses navy, not gold. | WCAG 1.4.11 requires 3:1 for control boundaries and state cues. Silt (1.70) and gold (1.66) fail it (R4). | Following the design system literally would fail constitution IV and FR-010. Both values are still design-system tokens. |
