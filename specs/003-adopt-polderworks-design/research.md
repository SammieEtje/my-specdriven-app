# Research: Polderworks-designsysteem adopteren

All Technical Context unknowns are resolved below. Contrast ratios were calculated with the WCAG 2.1
relative-luminance formula from the hex values in `.claude/skills/polderworks-design/tokens/colors.css`.

## R1. How the app consumes the design system

- **Decision**: Import the four token files (`colors.css`, `typography.css`, `spacing.css`,
  `effects.css`) directly from `.claude/skills/polderworks-design/tokens/` at the top of
  `styles.css`. Re-express the component patterns (Button, Input, Checkbox, Tabs, Tag, StatusBadge,
  Dialog, CodeBlock, Callout) as plain CSS classes that reference those tokens only.
  `fonts.css` is not imported (see R2).
- **Rationale**: The app is plain browser JavaScript without React or a build step (see 001
  research). The design system's components ship as React in `_ds_bundle.js`. Loading React only to
  render nine primitives would breach constitution I. The tokens are plain CSS and work as they are.
  A direct import keeps one source of truth, so updates to the central design system reach the app.
- **Alternatives considered**:
  - *Load `_ds_bundle.js` with React from a CDN*: adds a runtime dependency and network requests,
    and needs a rewrite of the DOM rendering in `app.js`. Rejected under constitution I and V.
  - *Copy the tokens into the app*: duplicates the source of truth and lets the copies drift.
    Rejected.

## R2. Fonts offline (FR-002, FR-011, SC-005)

- **Decision**: Self-host IBM Plex as `woff2` files in `fonts/` (Sans 400/500/600, Mono 400/500,
  Latin subset), taken once from IBM's official open-source release, with `OFL.txt` alongside.
  `fonts/fonts.css` declares `@font-face` with `font-display: swap`. The token stacks
  (`--font-sans`, `--font-mono`) already fall back to system fonts.
- **Rationale**: The design system's `fonts.css` loads from Google Fonts. That breaks offline use
  and sends a request with the visitor's IP to a third party, against the spirit of constitution V.
  The fonts are SIL OFL, so vendoring them is allowed. This is a static asset, not a runtime
  dependency (constitution I).
- **Alternatives considered**:
  - *Google Fonts CDN*: no offline use, and a third-party request. Rejected.
  - *System fallback only*: no extra files, but the app would never actually look like the design
    system (FR-002). Rejected.
  - *npm package (`@fontsource/*`)*: adds a dependency and a copy step, for files that never change.
    Rejected.

## R3. Theme

- **Decision**: Light theme only. Set `color-scheme: light` on `:root` and leave `data-theme`
  unset.
- **Rationale**: Light is the design system's default (spec assumption). `color-scheme` stops the
  browser from rendering native controls dark under a dark OS preference (spec edge case).
- **Alternatives considered**: following `prefers-color-scheme` with the dark tokens. Out of scope
  per the spec.

## R4. Contrast of token pairs (FR-010, SC-002)

| Pair | Ratio | Use |
|------|-------|-----|
| navy-ink on ice / app-bg | 12.62 / 11.40 | Primary text |
| slate on ice / app-bg | 6.57 / 5.93 | Secondary text, labels |
| ice on navy-ink | 12.62 | Primary button |
| ice on channel-teal | 5.14 | Primary button, hover |
| channel-teal on ice / app-bg | 5.14 / 4.64 | Ghost button text, focus ring |
| success-green on ice | 3.81 | **Fails for small text**: dot only, never text |
| eu-gold on ice / app-bg | 1.84 / 1.66 | **Fails 3:1**: decoration only, never the sole state cue |
| reclaimed-silt on ice | 1.70 | **Fails 3:1**: static dividers only |

Consequences:
- **Form control boundaries** (inputs, textarea, secondary buttons) use `--text-secondary` (slate,
  6.57:1) as border colour, not `--border-default`. WCAG 1.4.11 requires 3:1 for the boundary that
  identifies a control. Silt stays the colour for static dividers and panel hairlines.
- **The "Live trace enabled" indicator** follows the StatusBadge pattern: a green dot followed by
  the text in `--text-primary`.
- **The active filter** follows the Tabs pattern, except that the underline uses `--border-strong`
  (navy) instead of gold, because gold fails 3:1. The underline is a shape cue, not a colour cue.
  Each filter also gets `aria-pressed`.
- **The traced element** (the element whose trace is shown) gets a 2px dashed `--border-strong`
  outline. The focus ring is a 2px solid `--focus-ring` (teal), so dashed versus solid tells them
  apart without relying on colour.

## R5. Removing inline style values

- **Decision**: `app.js` stops setting `element.style.outline` with an rgba literal and relies on
  the `.active` class it already toggles. CSS styles `.feature-target.active`.
- **Rationale**: FR-001 forbids loose colour values. The class toggle already exists, so behaviour
  is unchanged (FR-012).

## R6. Completed tasks

- **Decision**: A completed task shows its title in `--text-secondary` with a line-through. The
  checkbox stays the native element with `accent-color: var(--pw-navy-ink)`.
- **Rationale**: Gives a non-colour cue for the state (spec edge case). The native checkbox keeps
  keyboard and screen-reader behaviour, and `accent-color` matches the design system's Checkbox
  fill without inline SVG or hex values.
- **Alternatives considered**: a custom `appearance: none` checkbox with a data-URI tick. It needs a
  hex value in the SVG, against FR-001. Rejected.

## R7. Testing approach

- **Decision**: Add `design.test.js` (node:test, like `logic.test.js`). It statically checks
  `styles.css` and `index.html`, and calculates contrast from `colors.css`.
- **Rationale**: The project already runs `node --test`, and there's no Vitest, Playwright or
  browser runner installed. Static checks cover FR-001 to FR-004, FR-010, FR-011 and FR-013
  deterministically. Visual and keyboard checks (SC-004, SC-006) go in `quickstart.md` as manual
  validation.
- **Alternatives considered**: Playwright visual regression. That needs a new dev dependency and
  browser binaries for a one-off restyle. Deferred, and recorded in Complexity Tracking.

## R8. Traceability for a cross-cutting restyle (constitution III)

- **Decision**: Elements whose markup changes for 003 get a `data-spec` token for 003. Where an
  element already carries a 001 token, the attribute becomes a space-separated list, for example
  `data-spec="001:FR-004 003:FR-008"`. `logic.js` gets a `spec-10` trace entry, "Polderworks design
  system", tied to the app header, so the trace panel can explain the restyle.
- **Rationale**: Constitution III requires every element that implements a requirement to be
  traceable. A token list keeps the earlier 001 trace intact.
