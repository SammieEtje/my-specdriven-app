---

description: "Task list for adopting the Polderworks design system in the todo demo"
---

# Tasks: Polderworks-designsysteem adopteren

**Input**: Design documents from `/specs/003-adopt-polderworks-design/`

**Prerequisites**: plan.md, spec.md, research.md (R1 to R8). The plan also names `data-model.md`,
`quickstart.md` and `contracts/ui-styling.md`, but those were never generated. `quickstart.md` is
created in T004. The element-to-pattern mapping that `contracts/ui-styling.md` would hold is written
out in the tasks below. This feature adds no data, so there is no data model.

**Tests**: Included. Constitution II requires every FR to be covered by an automated test, and the
plan (R7) defines `design.test.js` (run with `node --test`). Write each story's tests first and
confirm they fail before implementing.

**Organization**: Tasks are grouped by user story so each story can be built and checked on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Conventions for every task

- **Paths**: The app is a flat, no-build static site at the repository root: `index.html`,
  `styles.css`, `app.js`, `logic.js`, `logic.test.js`, plus the new `design.test.js` and `fonts/`.
- **Design system source**: `.claude/skills/polderworks-design/` is read-only. Token names come from
  `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` and `tokens/effects.css`.
  Component patterns come from `_ds_bundle.js` (Button line 346, Checkbox 393, Input 444, Tabs 660,
  Dialog 696, CodeBlock 13, Callout 94, StatusBadge 148, Tag 182).
- **Tokens only (FR-001, FR-004)**: App CSS may only use `var(--...)` for colours, font families,
  font sizes, spacing, radii and shadows. The values `0`, `100%`, `auto`, `1fr`, `transparent`,
  `currentColor`, `inherit` and `none` are allowed. Where a design-system component uses a raw pixel
  value (for example `fontSize: 13` or `padding: '10px 18px'`), use the nearest token.
- **Spec over design-system code**: The design-system Button has a 120ms transition and the Tabs
  underline is gold. The spec rules: no animation on hover (US2/AC2) and a navy underline (R4).
- **Traceability (Constitution III)**: Put the task ID in a code comment next to each change, for
  example `/* T012 */` in CSS, `// T020` in JS and `<!-- T018 -->` in HTML. When an element already
  has a 001 token, add the 003 token to the same `data-spec` attribute, separated by a space, for
  example `data-spec="001:FR-004 003:FR-008"` (R8). Never remove or rename an existing `data-spec`
  or `data-target` value (FR-012).
- **Writing rules (FR-013)**: Do not add emoji or em-dashes to any visible text. Button labels stay
  imperative. Do not change existing visible text, except where a task says so explicitly.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Offline fonts, the test harness and the manual validation guide

- [ ] T001 [P] Download IBM Plex `woff2` files (Latin subset) from IBM's official open-source release (github.com/IBM/plex) into `fonts/`: `IBMPlexSans-Regular.woff2`, `IBMPlexSans-Medium.woff2`, `IBMPlexSans-SemiBold.woff2`, `IBMPlexMono-Regular.woff2` and `IBMPlexMono-Medium.woff2`. Add the release's SIL Open Font License as `fonts/OFL.txt` (R2)
- [ ] T002 [P] Create `fonts/fonts.css` with one `@font-face` rule per file from T001: family `'IBM Plex Sans'` (weights 400, 500, 600) and family `'IBM Plex Mono'` (weights 400, 500), `font-style: normal`, `font-display: swap`, and relative `src: url('./<file>.woff2') format('woff2')`. The family names must match `--font-sans` and `--font-mono` in `tokens/typography.css`. Do not include any `http(s)://` URL (R2, FR-011)
- [ ] T003 [P] Create `design.test.js` (with `node:test` and `node:assert/strict`, like `logic.test.js`) containing only shared helpers and one sanity test: `readFile(path)` for `styles.css`, `index.html`, `app.js`, `logic.js` and `fonts/fonts.css`; `cssRules(css)` that strips comments and `@import` lines and returns `{ selector, declarations }` pairs; `loadPalette()` that parses `--pw-*: #RRGGBB` from `.claude/skills/polderworks-design/tokens/colors.css` and resolves the light-theme semantic aliases in `:root` (`--text-primary`, `--surface-card` and so on) to hex; `contrastRatio(hexA, hexB)` using the WCAG 2.1 relative-luminance formula. Sanity test: `contrastRatio(navy-ink, ice)` rounds to 12.62 (R4)
- [ ] T004 [P] Create `specs/003-adopt-polderworks-design/quickstart.md` with manual validation steps: start with `npm start` and open `http://localhost:8000`; the keyboard-only core flow from SC-004 (add, check off, filter, open, edit, close, view the trace), confirming a visible focus ring at each step; offline load in DevTools with network "Offline" and a hard reload, usable within 2 s (SC-005), and no requests to a non-localhost origin in the Network tab (FR-011); a 360px-wide viewport with stacked panels and no horizontal scroll; an OS dark-mode preference with the page still light and readable (R3); a long task title and owner (80+ characters) that wrap without overflow; a side-by-side comparison of every control with the matching `_ds_bundle.js` component (SC-006)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Replace the old dark theme foundation with design-system tokens. Every story builds on this.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Replace the top of `styles.css`, from the `:root` block through the base `button, input` rule. Start the file with `@import` statements, in this order: `./.claude/skills/polderworks-design/tokens/colors.css`, `typography.css`, `spacing.css`, `effects.css`, then `./fonts/fonts.css`. Do NOT import the design system's `tokens/fonts.css`, because it loads Google Fonts (R1, R2). Delete the old custom properties (`--bg`, `--panel`, `--panel-alt`, `--primary`, `--primary-strong`, `--accent`, `--text`, `--muted`, `--border`, `--shadow`). Add `:root { color-scheme: light; }` (R3). Set `body` to `font-family: var(--font-sans)`, `font-size: var(--text-body-sm-size)`, `line-height: var(--text-body-sm-lh)`, `background: var(--surface-page)`, `color: var(--text-primary)` and `margin: 0`, with no gradient. Keep `button, input, textarea { font: inherit; }`
- [ ] T006 Add the shared interaction foundation to `styles.css`, right after the base rules. A global `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }` (FR-007). A traced-element rule `.feature-target.active { outline: 2px dashed var(--border-strong); outline-offset: 3px; }`, so a dashed navy outline marks the traced element and a solid teal ring marks focus (R4). If the element has both, `:focus-visible` must win, so add `.feature-target.active:focus-visible { outline-style: solid; outline-color: var(--focus-ring); }`. Remove any `outline: none` that has no replacement
- [ ] T007 In `renderTrace()` in `app.js`, delete the two lines that set `element.style.outline` (the `rgba(124, 58, 237, 0.8)` literal) and `element.style.outlineOffset`. Keep the `classList.toggle('active', isSelected)` line unchanged and add `// T007` (R5, FR-001)
- [ ] T008 Make sure `npm start` (`python3 -m http.server 8000`) serves the imported token files from the hidden `.claude/` directory. Load `http://localhost:8000/.claude/skills/polderworks-design/tokens/colors.css` and confirm HTTP 200. If it fails, record that in `specs/003-adopt-polderworks-design/research.md` under R1 and stop for a decision instead of copying the tokens

**Checkpoint**: The page loads with design-system tokens and self-hosted fonts. `npm test` (the existing `logic.test.js`) still passes.

---

## Phase 3: User Story 1 - De takenlijst in de huisstijl zien (Priority: P1) 🎯 MVP

**Goal**: The task panel (header, list, task rows, empty state, layout) uses only design-system colours, IBM Plex, square geometry and the spacing and type scales.

**Independent Test**: Open the demo and compare the task panel with the design-system foundations. Add, check off, filter and edit a task, and confirm that each one behaves exactly as before.

### Tests for User Story 1 ⚠️

> Write these in `design.test.js` FIRST and make sure they fail against the old `styles.css`

- [ ] T009 [US1] Add test "FR-001 only design-system colours" to `design.test.js`: in `styles.css` (excluding `@import` lines and comments), `index.html` and `app.js`, there is no hex colour (`#[0-9a-f]{3,8}\b`), no `rgb(`/`rgba(`/`hsl(`/`hsla(` and no named CSS colour in a `color`, `background`, `border*`, `outline*`, `box-shadow`, `fill`, `stroke` or `accent-color` declaration. The value must be `var(--…)`, `color-mix(…)` containing only `var(--…)` and keywords, or one of `transparent`, `currentColor`, `inherit` or `none`. `index.html` and `app.js` contain no `style="` attribute and no `.style.` assignment with a colour
- [ ] T010 [US1] Add test "FR-002 IBM Plex only" to `design.test.js`: every `font-family` declaration in `styles.css` is exactly `var(--font-sans)`, `var(--font-mono)` or `inherit`, and the string `Inter` does not occur. In `fonts/fonts.css`, the families are only `'IBM Plex Sans'` and `'IBM Plex Mono'`, and each referenced `.woff2` file exists on disk
- [ ] T011 [US1] Add test "FR-003 square geometry, no gradients" to `design.test.js`: `styles.css` contains no `gradient(`, no `999px` and no `text-shadow`. Every `border-radius` value is `0`, `var(--radius-none)`, `var(--radius-xs)` or `var(--radius-sm)`, except selectors containing `status-dot` (the design system's StatusBadge dot is `50%`, see `_ds_bundle.js` line 172). Every `box-shadow` is `none`, `var(--shadow-sm|md|lg)`, or appears only in selectors for `.task-modal` or `.callout`
- [ ] T012 [US1] Add test "FR-004 spacing and type scale" to `design.test.js`: every `padding*`, `margin*`, `gap`, `row-gap`, `column-gap`, `top/right/bottom/left` and `inset` value in `styles.css` is built only from `var(--space-N)`, `0`, `auto` and `calc(…)` over those. Every `font-size` is `var(--text-*-size)` or `inherit`, and every `font-weight` is `var(--weight-*)` or `inherit`. Allowed exceptions: `outline-offset` and `border-width` in plain px of 3px or less
- [ ] T013 [US1] Add test "FR-010 contrast and forbidden text colours" to `design.test.js` using the `loadPalette()` and `contrastRatio()` helpers from T003. Assert ≥ 4.5 for `--text-primary` and `--text-secondary` on `--surface-page` and `--surface-card`, for `--text-inverse` on `--pw-navy-ink` and `--pw-channel-teal`, and for `--text-link` on `--surface-card`. Assert ≥ 3.0 for `--focus-ring` and `--border-strong` on `--surface-page` and `--surface-card`. Also assert that no `color:` declaration in `styles.css` uses `--pw-eu-gold`, `--accent-gold`, `--pw-pilot-red`, `--status-blocker-fg`, `--pw-success-green` or `--status-clear-fg` (R4, SC-002)
- [ ] T014 [US1] Add test "FR-011, FR-013, FR-014 offline, copy and branding" to `design.test.js`: `styles.css`, `fonts/fonts.css` and `index.html` contain no `http://` or `https://` and no `googleapis`/`gstatic`. `index.html`, `app.js` and `logic.js` contain no em-dash (`—`) and no emoji (`/\p{Extended_Pictographic}/u`). `index.html` does not contain `Polderworks`, `Loods` or `a Polderworks project`, and has no `<img>` or `<svg>`. The `<h1>` text is still `To-do board` and the `<title>` is still `Spec-Driven To-Do Demo`
- [ ] T044 [US1] Add test "FR-012 existing hooks preserved" to `design.test.js` (numbered T044 because it was added after analysis; it runs here, before T015). `index.html` still contains every `data-target` value from 001: `task-input`, `add-task-button`, `filter-all`, `filter-active`, `filter-completed`, `task-list`, `empty-state`, `save-state`, `task-modal`, `task-modal-close`, `task-title-field`, `task-description-field`, `task-tag-field` and `task-owner-field`. `app.js` still renders `data-target="task-toggle-${task.id}"` and `data-target="task-open"`. Every 001 `data-spec` token is still on its element, as one of the space-separated values: `001:FR-004` on `#task-modal`, `001:FR-012` on `.task-modal-close`, and `001:FR-005` on each of the four dialog fields. Keyboard behaviour: none of these elements has `tabindex="-1"`, and `app.js` still contains the `'Escape'` keydown handler and the focus return to the Open button on `close`. Write the expected lists as fixed arrays in the test, not by reading `git show main`

### Implementation for User Story 1

- [ ] T015 [US1] Restyle the layout in `styles.css`: `.app-shell` is a two-column grid with `gap: var(--space-6)`, `padding: var(--space-7)` and `max-width` from a `calc` over space tokens. Below a 900px viewport it becomes one column with `padding: var(--space-4)`, and at 360px there is no horizontal scroll (`min-width: 0` on grid children). `.demo-panel` and `.inspector-panel` use `background: var(--surface-card)`, `border: var(--border-width-hairline) solid var(--border-default)`, `border-radius: var(--radius-none)`, `box-shadow: none` and `padding: var(--space-6)` (FR-003)
- [ ] T016 [US1] Restyle the header in `styles.css`. `.eyebrow` follows the label style: `font-family: var(--font-mono)`, `font-size: var(--text-label-size)`, `letter-spacing: var(--text-label-tracking)`, `text-transform: uppercase`, `color: var(--text-secondary)`, `font-weight: var(--weight-medium)`. `h1` uses `--text-h2-size`, `--text-h2-lh`, `--text-h2-tracking` and `--weight-semibold`. `h2` uses the `--text-h3-*` tokens. `.badge` ("7 specs") follows the neutral Tag pattern (`_ds_bundle.js` line 182): `font-family: var(--font-mono)`, `font-size: var(--text-caption-size)`, `background: var(--surface-sunken)`, `color: var(--text-secondary)`, a hairline `var(--border-default)` border, `border-radius: var(--radius-xs)` and no pill shape
- [ ] T017 [US1] Restyle the task list in `styles.css`. `.task-list` has no gap between cards, and each `.task-card` is a square row with only `border-bottom: var(--border-width-hairline) solid var(--border-default)`, `padding: var(--space-3) var(--space-4)` and no background tint. `.task-card.selected` gets `border-left: var(--border-width-accent) solid var(--border-strong)` instead of an inset shadow or coloured fill. `.task-content` is `min-width: 0` with `overflow-wrap: anywhere`, so long titles and owners wrap. `.meta` uses `--text-caption-size` and `--text-secondary`. `.tag` follows the neutral Tag pattern from T016. `.task-card.completed .task-title` gets `text-decoration: line-through` and `color: var(--text-secondary)` (R6)
- [ ] T018 [US1] In `renderTaskList()` in `app.js`, add `completed` to the `<li class="task-card">` classes when `task.completed`. Wrap the title in `<span class="task-title">`. Replace `class="task-pill"` with `class="tag" data-spec="003:FR-003"`. When `task.completed`, add the text `Completed` to the `.meta` line (for example `Ava · Marketing · Completed`) so the status is not shown by colour or strike-through alone (spec edge case "Statuskleuren"). Add `data-spec="003:FR-003"` to the `<li>`. Do not change any `data-target`, checkbox or click behaviour. Add `// T018`
- [ ] T019 [US1] Restyle `.empty-state` in `styles.css`: `border: var(--border-width-hairline) solid var(--border-default)`, `border-radius: var(--radius-none)`, `padding: var(--space-7) var(--space-6)`, `background: var(--surface-card)`. `h3` uses the `--text-h3-*` tokens and `p` uses `--text-secondary`. Add `data-spec="003:FR-003"` to `#empty-state` in `index.html` (keep `data-target="empty-state"`)
- [ ] T020 [US1] Add a `spec-10` entry at the end of `FEATURE_SPECS` in `logic.js`, with title `Polderworks design system`, a description saying the demo uses only the visual foundations of the central design system, `source: 'specify: "Adopt the central Polderworks design system in the todo app UI"'` (straight or curly quotes, no em-dash) and `elementIds: ['app-header']`. Give it a `phaseMap` with exactly five keys (specify, clarify, plan, tasks, implement) that summarise the spec, the FR-014 clarification, R1/R2, this task list and the token-based restyle (R8). Add `// T020`
- [ ] T021 [US1] In `index.html`, make `<header class="app-header">` traceable: add `class="app-header feature-target"`, `data-target="app-header"`, `tabindex="0"` and `data-spec="003:FR-001 003:FR-002 003:FR-014"`, so clicking the header shows the `spec-10` trace. Keep the existing header text unchanged (FR-014). Because a `<header>` is not natively interactive, add a `keydown` listener in `app.js`: when Enter or Space is pressed on an element matching `.feature-target[tabindex="0"]`, call `event.preventDefault()` and `renderTrace(target.dataset.target)`, so the trace is reachable by keyboard as well as by mouse (Constitution IV, SC-004). Add `<!-- T021 -->` and `// T021`
- [ ] T022 [US1] Remove every remaining old rule and value in `styles.css` that the new tests flag (old variable names, `#`/`rgba` literals, `linear-gradient`, `border-radius` 10/12/14/16/20/999px, `var(--shadow)`). Then run `npm test` and make sure T009 to T014 and T044 pass, along with every `logic.test.js` test (SC-001, SC-003, FR-012)

**Checkpoint**: The task panel matches the design-system foundations. `npm test` is green, and all task actions behave as before.

---

## Phase 4: User Story 2 - Status en interactie volgens het designsysteem (Priority: P1)

**Goal**: Buttons, inputs, the textarea, the checkbox, filters, the live indicator and the dialog follow the design-system component patterns, with clear hover, focus and active states.

**Independent Test**: Use the whole demo with only the keyboard, then with only the mouse. For each control, check its hover, focus and active state against the design system.

### Tests for User Story 2 ⚠️

- [ ] T023 [US2] Add test "FR-005 button variants" to `design.test.js`. In `index.html`, `#add-task-button` has the classes `btn btn-primary`, `#save-state` has `btn btn-ghost` and `.task-modal-close` has `btn btn-secondary`. In `app.js`, the task `Open` button markup has `btn btn-secondary`. In `styles.css`, `.btn-primary:hover` sets `background` to `var(--accent-teal)` or `var(--pw-channel-teal)`, and no rule whose selector contains `.btn` declares `transition`, `animation` or a `box-shadow` other than `none`
- [ ] T024 [US2] Add test "FR-006 form controls and filters" to `design.test.js`. Every `input` and `textarea` in `index.html` has an `aria-label` or a `<label for>`. The three `.filter-btn` buttons each have `aria-pressed`, exactly one of which is `"true"` (`filter-all`). In `styles.css`, the input/textarea rule uses `border-color` or `border` with `var(--text-secondary)` (R4). The rule `.filter-btn[aria-pressed="true"]` sets a bottom border of `var(--border-strong)` and does not use gold. `input[type="checkbox"]` sets `accent-color: var(--pw-navy-ink)` (R6)
- [ ] T025 [US2] Add test "FR-007 and FR-008 focus and dialog" to `design.test.js`. `styles.css` has a `:focus-visible` rule with `outline` using `var(--focus-ring)`, and no rule sets `outline: none` or `outline: 0` without `:focus-visible` in the same selector. The `.task-modal` rule has `border-radius` of `0` or `var(--radius-none)`, `background: var(--surface-card)` and `box-shadow: var(--shadow-lg)` (the Dialog pattern, `_ds_bundle.js` line 721). `.task-modal::backdrop` uses only tokens. `#task-modal` in `index.html` has a `data-spec` containing both `001:FR-004` and `003:FR-008`

### Implementation for User Story 2

- [ ] T026 [US2] Add the Button pattern to `styles.css` (`_ds_bundle.js` line 346). `.btn` uses `font-family: var(--font-mono)`, `font-weight: var(--weight-medium)`, `text-transform: uppercase`, `letter-spacing` with a small em value, `font-size: var(--text-caption-size)`, `padding: var(--space-2) var(--space-4)`, `border-radius: var(--radius-xs)`, `border: var(--border-width-hairline) solid transparent` and `cursor: pointer`, with no transition. `.btn-primary` uses `background: var(--surface-inverse)` and `color: var(--text-inverse)`, and on `:hover` it uses `background: var(--accent-teal)`. `.btn-secondary` uses `background: transparent`, `color: var(--text-primary)` and `border-color: var(--text-secondary)`, and on `:hover` it uses `background: var(--surface-sunken)` and `border-color: var(--border-strong)`. `.btn-ghost` uses `background: transparent` and `color: var(--text-link)`, and on `:hover` it uses `color: var(--text-link-hover)`. Do not add a hover shadow (FR-005, US2/AC2). Delete the old `.primary`, `.ghost`, `.task-open-button` and `.task-modal-close` visual rules (keep any layout-only rules)
- [ ] T027 [US2] Update button markup in `index.html`. `#add-task-button` changes from `class="feature-target primary"` to `class="feature-target btn btn-primary"` and gets `data-spec="003:FR-005"`. `#save-state` changes from `class="feature-target ghost"` to `class="feature-target btn btn-ghost"` and gets `data-spec="003:FR-005"`. `.task-modal-close` gets the added classes `btn btn-secondary`, and its `data-spec` becomes `"001:FR-012 003:FR-005"`. In `renderTaskList()` in `app.js`, the Open button class becomes `task-open-button feature-target btn btn-secondary`, keeping the conditional `selected`, and gets `data-spec="003:FR-005"`. Keep all `id`, `data-target` and `aria-*` values. Add the T027 comments
- [ ] T028 [US2] Add the Input pattern to `styles.css` (`_ds_bundle.js` line 444). `input[type="text"]` and `textarea` use `background: var(--surface-card)`, `color: var(--text-primary)`, `border: var(--border-width-hairline) solid var(--text-secondary)` (R4: silt fails 3:1 for control boundaries), `border-radius: var(--radius-xs)`, `padding: var(--space-2) var(--space-3)`, `font-family: var(--font-sans)`, `font-size: var(--text-body-sm-size)`, `width: 100%` and `resize: vertical` for textarea. Dialog `label` elements use the label style from T016. `input[type="checkbox"]` uses `accent-color: var(--pw-navy-ink)` and `width`/`height: var(--space-4)` (R6). Add `data-spec="003:FR-006"` to `#task-input` in `index.html`. For the four dialog fields, extend the existing `data-spec="001:FR-005"` to `"001:FR-005 003:FR-006"`
- [ ] T029 [US2] Add the Tabs pattern for filters to `styles.css` (`_ds_bundle.js` line 660). `.filters` uses `display: flex` and `border-bottom: var(--border-width-hairline) solid var(--border-default)`. `.filter-btn` uses `background: none`, `border: none`, `border-bottom: 2px solid transparent`, `margin-bottom: calc(-1 * var(--border-width-hairline))`, `padding: var(--space-2) var(--space-4)`, `font-family: var(--font-mono)`, `font-size: var(--text-caption-size)`, `text-transform: uppercase` and `color: var(--text-secondary)`. `.filter-btn[aria-pressed="true"]` uses `color: var(--text-primary)`, `font-weight: var(--weight-semibold)` and `border-bottom-color: var(--border-strong)` (navy, not gold, per R4 and US2/AC3). Style the selected filter only through `aria-pressed`, never through `.active`, because `.active` marks the traced element (T006)
- [ ] T030 [US2] Update the filters in `index.html`: give `filter-all` `aria-pressed="true"`, and `filter-active` and `filter-completed` `aria-pressed="false"`. Remove the static `active` class from `filter-all` (that class is the traced-element marker set by `renderTrace`). Give each filter `data-spec="003:FR-006"`. In the click handler in `app.js`, when `dataTarget` starts with `filter-`, set `aria-pressed="true"` on the clicked `.filter-btn` and `"false"` on the others, then continue to `renderTrace(dataTarget)` as before. Do not add any filtering of the task list (FR-012, no behaviour change). Add `// T030`
- [ ] T031 [US2] Replace the live indicator in the footer of `index.html` with the StatusBadge pattern (`_ds_bundle.js` line 148): `<span class="status-badge" data-spec="003:FR-010"><span class="status-dot" aria-hidden="true"></span>Live trace enabled</span>`. In `styles.css`, `.status-badge` uses `display: inline-flex`, `gap: var(--space-2)`, `font-family: var(--font-mono)`, `font-size: var(--text-caption-size)`, `text-transform: uppercase` and `color: var(--text-primary)`. The text never uses green, because success-green is 3.81:1 (R4). `.status-dot` uses `width`/`height: 6px`, `border-radius: 50%` and `background: var(--status-clear-fg)`. Restyle `.meta-row` with hairline top border, `padding-top: var(--space-4)` and `justify-content: space-between`
- [ ] T032 [US2] Add the Dialog pattern to `styles.css` (`_ds_bundle.js` line 696). `.task-modal` uses `background: var(--surface-card)`, `color: var(--text-primary)`, `border: var(--border-width-hairline) solid var(--border-default)`, `border-radius: var(--radius-none)`, `box-shadow: var(--shadow-lg)`, `padding: 0`, `width: min(…)` built from space tokens with `max-width: 90vw`. `.task-modal::backdrop` uses `background: color-mix(in oklch, var(--pw-deep-water) 55%, transparent)`. `.task-modal-header` uses `padding: var(--space-5) var(--space-6)` and `border-bottom: var(--border-width-hairline) solid var(--border-default)`. `#task-modal-title` uses `--text-h3-size` and `--weight-semibold`, with `overflow-wrap: anywhere` for long titles. `.task-modal-fields` uses `padding: var(--space-6)` and `gap: var(--space-4)`. `.split-fields` becomes one column below 480px. Extend the `data-spec` of `#task-modal` in `index.html` to `"001:FR-004 003:FR-008"`
- [ ] T033 [US2] Run `npm test` and make sure T023 to T025 pass and every earlier test still passes. Then check manually, from `quickstart.md`, that the keyboard-only flow shows a teal focus ring on every control, that hovering the primary button moves it from navy to teal with no shadow or animation, and that Escape and Close still return focus to the Open button (SC-004, FR-012)

**Checkpoint**: Every control matches its design-system pattern. Keyboard and mouse use work, with visible states.

---

## Phase 5: User Story 3 - Het beslissingsspoor in de huisstijl (Priority: P2)

**Goal**: The trace panel shows the trace object as a design-system code block, the summary in the technical mono style, and the phases separated by hairlines with a 3px left-rule callout for emphasis.

**Independent Test**: Click any element. The trace panel shows the right data, the trace object looks like a CodeBlock and the phase list follows the Callout and hairline pattern.

### Tests for User Story 3 ⚠️

- [ ] T034 [US3] Add test "FR-009 code block and callout" to `design.test.js`. The `.trace-object` rule in `styles.css` uses `font-family: var(--font-mono)`, `background: var(--surface-sunken)`, a hairline `var(--border-default)` border, `border-radius` of `0` or `var(--radius-none)` and `overflow-x: auto`. `.phase-item` uses a hairline `border-bottom` with `var(--border-default)` and no `background` other than `transparent` or `none`. A `.callout` rule exists with `border-left: var(--border-width-accent) solid …` and no full background colour other than `var(--surface-card)`. `#trace-object` and `#phase-list` in `index.html` carry `data-spec` containing `003:FR-009`

### Implementation for User Story 3

- [ ] T035 [US3] Restyle the trace summary in `styles.css`. `.trace-summary` is a two-column grid with `gap: var(--space-4)`, `padding: var(--space-4) 0` and hairline top and bottom borders in `var(--border-default)`. `.trace-summary .label` uses the label style from T016. `#trace-feature-id` and `#trace-element` (the `strong` elements) use `font-family: var(--font-mono)`, `font-size: var(--text-mono-size)`, `font-weight: var(--weight-medium)` and `overflow-wrap: anywhere` (technical IDs, FR-002). `.trace-description` uses `--text-body-sm-size` and `--text-secondary`. Add `data-spec="003:FR-002"` to `.trace-summary` in `index.html`
- [ ] T036 [US3] Add the CodeBlock pattern (light variant, `_ds_bundle.js` line 13) to `.trace-object` in `styles.css`: `font-family: var(--font-mono)`, `font-size: var(--text-caption-size)`, `line-height: var(--text-mono-lh)`, `background: var(--surface-sunken)`, `color: var(--text-primary)`, `border: var(--border-width-hairline) solid var(--border-default)`, `border-radius: var(--radius-none)`, `padding: var(--space-4)`, `margin: 0`, `overflow-x: auto` and `white-space: pre`. Add `data-spec="003:FR-009"` to `#trace-object` in `index.html`
- [ ] T037 [US3] Restyle the phase list in `styles.css`. `.phase-list` uses `list-style: none`, `padding: 0` and `margin: 0`. `.phase-item` uses `padding: var(--space-3) 0`, `border-bottom: var(--border-width-hairline) solid var(--border-default)` and no background. `.phase-item strong` uses `font-family: var(--font-mono)`, `font-size: var(--text-label-size)`, `letter-spacing: var(--text-label-tracking)`, `text-transform: uppercase` and `color: var(--text-secondary)`. Add `.callout` (`_ds_bundle.js` line 94): `background: var(--surface-card)`, `border-left: var(--border-width-accent) solid var(--accent-teal)`, `padding: var(--space-3) var(--space-4)` and `box-shadow: none`. On the panel the left rule carries the emphasis, so drop the design system's `--shadow-sm` here, in line with FR-003's "no decorative shadows on static content". Add `data-spec="003:FR-009"` to `#phase-list` in `index.html`
- [ ] T038 [US3] In `renderPhaseList()` in `app.js`, add the class `callout` to the `<li class="phase-item">` whose `phase.phase === 'implement'`, so the phase that produced the on-screen element is emphasised with the 3px left rule (US3/AC2). Replace the `<strong>` and `<div>` inner markup with `<strong class="phase-name">` and `<div class="phase-decision">`, keeping the same text. Do not change `aria-live` or the order. Add `// T038`
- [ ] T039 [US3] Run `npm test` and make sure T034 passes and every earlier test still passes. Click the header, a task row, a filter and a dialog field, and check that the trace panel shows the right `spec-NN` data (the header shows `spec-10`) and that the styling matches CodeBlock and Callout

**Checkpoint**: All three stories are done. The whole UI follows the design system.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, traceability and workflow bookkeeping

- [ ] T040 Run the full `specs/003-adopt-polderworks-design/quickstart.md` checklist (offline, 360px, dark OS preference, long titles, SC-006 side-by-side). Record each result as a checked line in `quickstart.md` and fix any regression in the file it comes from
- [ ] T041 [P] Grep `index.html` and `app.js` for every `data-spec` token. Confirm that each `003:FR-xxx` ID exists in `spec.md` (FR-001 to FR-014) and that no 001 token was removed compared to `git show main:index.html` and `git show main:app.js` (the trace check from the constitution's Ontwikkelworkflow)
- [ ] T042 [P] Check `styles.css`, `index.html`, `app.js` and `logic.js` for leftover dead selectors or classes from the old theme (`.primary`, `.ghost`, `.task-pill`, `.live-indicator`, `--panel-alt` and so on) and remove them. Make sure every changed block has its task-ID comment (Constitution III)
- [ ] T043 Append an `## Phase: implement` entry to `specs/003-adopt-polderworks-design/prompts.md` (date, branch, trigger command, goal, notable decisions). Then run `npm test` a last time, commit, and create the tag `003-implement` (Constitution III)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. T001 to T004 can all run in parallel.
- **Foundational (Phase 2)**: T005 needs T002 (the `fonts.css` import). T006 follows T005 (same file). T007 is independent of T005 and T006 but listed here because it blocks the FR-001 test. T008 needs T005. Phase 2 blocks every story.
- **US1 (Phase 3)**: Needs Phase 2. This is the MVP.
- **US2 (Phase 4)**: Needs Phase 2. It can technically start in parallel with US1, but both edit `styles.css`, `index.html` and `app.js`, so in practice it runs after US1.
- **US3 (Phase 5)**: Needs Phase 2. It touches separate CSS selectors, `renderPhaseList()` and separate `index.html` elements, so it can run alongside US2 with care.
- **Polish (Phase 6)**: Needs all stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories. T020 (`spec-10`) and T021 (traceable header) also give US3 a new element to trace, but US3 does not need them.
- **US2 (P1)**: Uses the label style from T016 (US1). If US2 runs first, define the label style in T028 instead.
- **US3 (P2)**: Uses the label style from T016 (US1), with the same fallback.

### Within Each User Story

- Tests come first (they are all in `design.test.js`, so they run in sequence). They must fail before implementation.
- Do CSS rules before the markup and `app.js` changes that rely on them, then run the story's final `npm test` and manual check task.

### Parallel Opportunities

- Phase 1: T001, T002, T003 and T004 can all run in parallel (different files).
- Phase 2: T007 (`app.js`) can run in parallel with T005 and T006 (`styles.css`).
- Within each story, the CSS work in `styles.css` and the markup work in `index.html` or `app.js` can be split between two people. They are not marked [P] because they share selectors and class names.
- Phase 6: T041 and T042 can run in parallel.

---

## Parallel Example: Setup

```bash
Task: "Download IBM Plex woff2 files and OFL.txt into fonts/"                         # T001
Task: "Create fonts/fonts.css with @font-face rules"                                  # T002
Task: "Create design.test.js helpers (readFile, cssRules, loadPalette, contrastRatio)" # T003
Task: "Create specs/003-adopt-polderworks-design/quickstart.md"                       # T004
```

## Parallel Example: User Story 3 alongside User Story 2

```bash
# Developer A (US2): T026–T032 in .btn / input / .filter-btn / .status-badge / .task-modal selectors
# Developer B (US3): T035–T038 in .trace-summary / .trace-object / .phase-list / .callout selectors and renderPhaseList()
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (US1): the task panel is in the house style and `npm test` is green.
3. **STOP and VALIDATE**: compare the panel with the design-system foundations and check that every task action still works.

### Incremental Delivery

1. Setup and Foundational give a token-based base with offline fonts.
2. US1 gives a recognisable house style (MVP).
3. US2 brings interactive states and component patterns to design-system level.
4. US3 puts the trace panel in the technical house style.
5. Polish covers the quickstart validation, the trace check, the prompt log and the `003-implement` tag.

---

## Notes

- [P] tasks touch different files and have no dependencies.
- The [Story] label maps each task to its user story for traceability.
- `logic.test.js` must never be edited to make it pass (SC-003).
- The design system under `.claude/skills/polderworks-design/` is never edited.
- Commit after each phase and tag per the constitution.
