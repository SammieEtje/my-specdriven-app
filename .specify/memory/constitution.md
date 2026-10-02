<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: n.v.t. (eerste invulling)
- Added sections: Kernprincipes I–V, Techniekkader, Ontwikkelworkflow, Governance
- Removed sections: geen
- Deferred TODOs: geen
-->
# Takenlijst Constitution

## Core Principles

### I. Eenvoud boven alles

- Er MOET altijd gekozen worden voor de eenvoudigste oplossing die de spec vervult (YAGNI).
- Er is GEEN backend: de app draait volledig in de browser.
- Een nieuwe runtime-dependency MAG alleen worden toegevoegd als `plan.md` onderbouwt waarom
  de standaard-API van browser, React of TypeScript niet volstaat.

**Rationale**: de app is een demo; elke extra laag leidt de aandacht af van het proces dat we
willen laten zien.

### II. Elke requirement is testbaar

- Elke functionele requirement (`FR-xxx`) MOET door minstens één geautomatiseerde test worden
  gedekt (Vitest voor logica en componenten, Playwright voor end-to-end flows).
- Tests worden waar redelijk vóór de implementatie geschreven en moeten eerst falen.
- Een requirement die niet testbaar geformuleerd is, MOET in `/speckit-clarify` worden
  aangescherpt voordat er gepland wordt.

**Rationale**: een spec die je niet kunt verifiëren, is een wens, geen afspraak.

### III. Traceerbaarheid (NON-NEGOTIABLE)

- Elk UI-element dat een requirement implementeert, MOET een attribuut
  `data-spec="<feature>:<ID>"` dragen, bijv. `data-spec="001:FR-002"`.
- Code die een taak implementeert, MOET in commentaar naar het taak-ID verwijzen, bijv.
  `// T012`.
- Elke workflowfase MOET eindigen met een commit en een git-tag `<feature>-<fase>`,
  bijv. `001-plan`.
- De prompt die voor elke fase is gebruikt, MOET worden vastgelegd in
  `specs/<feature>/prompts.md`.

**Rationale**: in de demo moet je vanaf elk element op het scherm terug kunnen redeneren naar
de beslissing en het document waar het uit voortkwam.

### IV. Toegankelijk en toetsenbord-bedienbaar

- Alle functionaliteit MOET volledig met het toetsenbord bedienbaar zijn.
- WCAG 2.1 AA is de richtlijn: labels op invoervelden, zichtbare focus, voldoende contrast en
  foutmeldingen die aan het veld gekoppeld zijn (`aria-describedby`).

**Rationale**: toegankelijkheid is goedkoop als je het in de spec meeneemt en duur als je het
achteraf moet repareren.

### V. Gebruikersdata blijft lokaal

- Taken worden uitsluitend opgeslagen in `localStorage` van de browser.
- De app MAG GEEN netwerkverzoeken doen met gebruikersdata en GEEN analytics of trackers bevatten.

**Rationale**: privacy by design, en de demo werkt ook zonder internet.

## Techniekkader

- Taal: TypeScript (strict mode).
- UI: React met Vite als build-tool.
- Tests: Vitest en Testing Library voor unit/component-tests, Playwright voor end-to-end-tests.
- Taal van UI en documentatie: Nederlands.

## Ontwikkelworkflow

- Volgorde per feature: `specify` → `clarify` → `plan` → `tasks` → `analyze` → `implement`.
- Elke feature krijgt een eigen branch `<NNN>-<korte-naam>` die na afronding in `main` wordt
  gemerged.
- Een feature is pas af als alle tests slagen en de trace-controle geen onbekende
  `data-spec`-ID's meldt.

## Governance

- Deze constitution gaat boven andere werkafspraken. `/speckit-plan` en `/speckit-analyze`
  toetsen elk plan aan de principes; een afwijking MOET in `plan.md` onder
  "Complexity Tracking" worden verantwoord.
- Wijzigingen verlopen via `/speckit-constitution` en krijgen een eigen commit.
- Versiebeheer volgt semver: MAJOR bij het schrappen of herdefiniëren van een principe, MINOR
  bij een nieuw principe of een wezenlijke uitbreiding, PATCH bij verduidelijkingen.

**Version**: 1.0.0 | **Ratified**: 2026-09-30 | **Last Amended**: 2026-09-30
