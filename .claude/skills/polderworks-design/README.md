# Polderworks Design System

Polderworks is a European software venture building the enterprise and compliance layer that sits
on top of the sovereign European office stack (Nextcloud, openDesk, Open-Xchange, Matrix). Its
first product, **Loods**, is a free, open-source, self-hostable, read-only command-line scanner
that inspects a Microsoft 365 tenant and produces a migration-and-gap report for organisations
moving off US productivity clouds. Loods assesses and advises; it never performs the migration.

**Two brands, one house.** Polderworks is the masterbrand — corporate, enterprise, procurement-facing.
Loods is an endorsed product brand ("Loods, a Polderworks project"). The system is built to extend
to two further products in the house, working names **Plane** and **Fabric** — nothing here is
fitted to Loods alone.

**Audience:** heavily regulated organisations — public sector, energy, finance. Buyers are IT
leaders, compliance/procurement officers, and the MSPs who serve them. They value auditability,
sovereignty and total cost of ownership, and distrust hype.

**Geography:** Netherlands first, then Germany/Austria/Switzerland, then France. The identity reads
as European and cross-border — never parochial, never touristic (no windmills, tulips, clogs, or
orange tourism cues).

**Tone of the identity in three words: Engineered. Sovereign. Trustworthy.**

## Sources

This design system was built from a from-scratch brand identity brief (no existing codebase or
Figma file was attached). The full identity — logo rationale, colour system, type system, graphic
language, and application mockups (GitHub avatar, repo social card, CLI icon, PDF report cover) —
was developed and approved in `templates/polderworks-loods-brand-guide/PolderworksLoodsBrandGuide.dc.html`
in this same project (available as the "Polderworks-Loods Brand Guide" template). That file is the
single source of truth this design system was extracted from; consult it for the original rationale
and side-by-side option history.

## The two metaphors

- **Polder** (reclaimed land): territory won back from the sea and held by engineering — dykes,
  pumps, sluices, ordered fields. The Polderworks mark is a stepped trapezoid — four registers
  widening from a narrow engineered crown to a wide base, read as a dyke cross-section.
- **Loods** (nautical pilot / fairway): a loods boards the ship and guides it through hazardous
  water, but never sails it for the crew. The Loods mark is four gold fairway markers narrowing
  top-to-bottom on a deep-navy tile — a lit approach channel converging to the harbour entrance.

Two earlier directions were explored and rejected for Loods — the maritime signal flag "H" (Hotel,
"I have a pilot aboard") and a harbour-shed silhouette — both kept in `guidelines/brand/explored-alternates.html`
for context. Do not resurrect them without the user's direction.

## Content fundamentals

- **British/EU spelling throughout** (colour, licence, organisation).
- **No em dashes** in sample/marketing copy. Use commas, colons or full stops instead.
- **No buzzwords**: never "leverage", "seamless", "robust", "ecosystem", "game-changer". Sell
  outcomes and trust, not ideology or hype.
- **Declarative, short sentences.** Headlines state a fact or an outcome ("Sovereign infrastructure,
  engineered.") rather than asking a question or making a claim that needs proving.
- **Second person is rare; third person and imperative dominate.** Buttons are imperative verbs
  ("Run scan", "Talk to us"), not "Click here to...".
- **Numbers are real and specific**, never rounded for effect ("47 controls passing", "7 blockers"
  — not "dozens of checks").
- **No emoji anywhere.** This is procurement-facing infrastructure, not a consumer product.
- **The Loods/Polderworks relationship is always phrased "a Polderworks project"** — never "product"
  or "company". Loods leads in any co-branded line; Polderworks endorses, never the reverse.

## Visual foundations

- **Colour:** seven roles (see `tokens/colors.css`) anchored on navy ink, EU gold and ice, extended
  with a channel teal, a reclaimed-silt neutral, a deep-water dark base and a reserved pilot red.
  Gold and red are accents only — **never body text**. Full light/dark themes with AA-verified
  pairings live in `guidelines/colors/`.
- **Type:** one open-licensed superfamily, IBM Plex (Sans / Mono / Serif) — chosen because the
  brand's own typography carries the same no-lock-in, sovereignty story as the product. Sans
  carries Polderworks and all UI/running text; Mono carries Loods, the CLI, code and technical
  labels; Serif is reserved for long-form report body copy only.
- **Geometry:** flat, precise, vector-native. Corners are square almost everywhere; a 2–3px radius
  appears only on interactive controls for usability, never a pill — the one deliberate exception
  is the `Switch` track. No gradients, no glossy 3D, no drop-shadow-heavy cards.
- **Backgrounds:** solid flat colour or the graphic-language motifs below, used sparingly as
  structure (dividers, section markers, cover art) — never as decorative filler. No stock photography
  of people or offices; any photography must be sober and infrastructural (water works, dykes,
  engineered landscape).
- **Shadows:** cool, navy-tinted (`rgba(10,23,33,…)`), restrained — reserved for genuinely elevated
  surfaces (dialogs, toasts, floating cards), never applied to static content cards.
- **Borders:** 1px hairline, `reclaimed-silt` on light surfaces / `border-dark` on dark surfaces.
  Callouts use a 3px coloured left edge (never a full coloured background wash or a rounded
  coloured-border card — a named anti-pattern).
- **Animation:** none defined yet in this system — the identity is calm and static by disposition;
  if motion is added, keep it brief, linear-to-ease-out, and functional (state changes only, never
  decorative bounce).
- **Hover/press states:** hover darkens/shifts one step along the palette (e.g. navy → channel teal
  on primary buttons); press has no separate treatment defined yet — inherit hover.
- **Corner radii:** `--radius-none` (0, default), `--radius-xs` (2px, most controls), `--radius-sm`
  (3px, rare). See `tokens/effects.css`.
- **Cards:** square corners, either a hairline border (default, flat) or a soft shadow or an
  `elevated` prop (floating content only) — never both, never a coloured left border as decoration.

## Iconography

There is no existing icon font or SVG icon set in the source brief — this system does not use one.
Status is communicated by colour + a small dot (`StatusBadge`), never by pictogram icons. Where a
glyph is unavoidable (dialog close, CLI prompt), it is drawn as a minimal inline SVG stroke shape or
a mono-type character (`×`, `▸`, `$`), matching the flat/engineered geometry — never emoji, never a
third-party icon font. If a future screen genuinely needs a broader icon set, bring in an
open-licensed CDN set (e.g. Lucide) and document the substitution here rather than hand-drawing a
one-off library.

## Index

- `styles.css` — global stylesheet entry point (import list only).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css` (radius/shadow/border), `fonts.css`.
- `assets/logos/` — Polderworks mark (navy / ice / gold / favicon), Loods mark (default tile / mono),
  plus the two rejected explorations, kept for reference.
- `assets/graphic-language/` — polder grid, contour lines, water/land boundary, depth soundings,
  bearing, channel markers.
- `guidelines/colors/`, `guidelines/type/`, `guidelines/spacing/`, `guidelines/brand/`,
  `guidelines/graphic-language/` — foundation specimen cards (populate the Design System tab).
- `components/` — 15 reusable primitives grouped by concern:
  - `forms/` — Button, Input, Select, Checkbox, Radio, Switch
  - `feedback/` — StatusBadge, Tag, Callout, Toast, Tooltip
  - `navigation/` — Tabs
  - `overlay/` — Dialog
  - `data/` — Table, CodeBlock
  - `surfaces/` — Card
- `ui_kits/polderworks-site/` — masterbrand marketing site (header, hero, products, trust, footer).
- `ui_kits/loods-product/` — Loods' two real surfaces: the read-only CLI scan and the resulting
  report viewer (Summary / Findings / Export).
- `SKILL.md` — portable skill definition for use in Claude Code or elsewhere.

## Intentional additions

No component source was provided (brand-guidelines-only run), so a standard set was authored and
sized to the brand's needs, plus three additions specific to an audit-report product:
`StatusBadge` (blocker/advisory/clear finding status), `Callout` (left-rule report callouts) and
`CodeBlock` (CLI/code snippets) — all direct requirements of the Loods PDF report and CLI output
described in the brief.
