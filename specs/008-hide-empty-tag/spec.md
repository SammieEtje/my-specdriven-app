# Feature Specification: Geen leeg tagkader bij taken zonder tag

**Feature Branch**: `008-hide-empty-tag`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "als een taak nu geen tag bevat, zie je wel een leeg kader voor het tag. Zie taak 4 van boven in het screenshot. Verwijder dit kader als er geen tage is."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Geen leeg tagkader (Priority: P1)

Als gebruiker van het takenbord wil ik bij een taak zonder tag geen leeg kader zien waar de tag zou staan, zodat de lijst er verzorgd uitziet en ik niet denk dat er iets ontbreekt of kapot is.

**Why this priority**: Dit is precies wat de gebruiker meldt. Een nieuwe taak die via het invoerveld wordt toegevoegd heeft altijd een lege tag (005), dus het lege kader verschijnt bij elke nieuwe taak.

**Independent Test**: Voeg een taak toe via het invoerveld en kijk naar de kaart: er staat geen kader naast de Open-knop. Een taak met een tag toont het kader met de tagtekst zoals voorheen.

**Acceptance Scenarios**:

1. **Given** een taak zonder tag, **When** de lijst wordt getoond, **Then** staat er op die kaart geen tagkader, ook geen leeg of onzichtbaar kader dat ruimte inneemt.
2. **Given** een taak met de tag "Marketing", **When** de lijst wordt getoond, **Then** staat het tagkader met "Marketing" er zoals voorheen.
3. **Given** een taak zonder tag, **When** de gebruiker in de taakdialoog een tag invult, **Then** verschijnt het tagkader direct op de kaart.
4. **Given** een taak met een tag, **When** de gebruiker in de taakdialoog de tag leegmaakt, **Then** verdwijnt het tagkader direct van de kaart.
5. **Given** een taak waarvan de tag alleen uit spaties bestaat, **When** de lijst wordt getoond, **Then** geldt die tag als leeg en staat er geen kader.

---

### User Story 2 - Geen losse scheidingstekens in de regel onder de titel (Priority: P2)

Als gebruiker wil ik in de regel onder de taaktitel (eigenaar, tag en status) geen losse scheidingspunten zien als eigenaar of tag ontbreekt, zodat die regel alleen echte informatie toont.

**Why this priority**: Hetzelfde screenshot laat bij taak 4 onder de titel een losse "·" zien, omdat eigenaar en tag allebei leeg zijn. Het is hetzelfde soort fout op dezelfde kaart, maar de gebruiker noemde het niet expliciet.

**Independent Test**: Voeg een taak toe zonder eigenaar en tag: onder de titel staat geen losse "·". Vink hem af: de regel toont alleen "Completed".

**Acceptance Scenarios**:

1. **Given** een taak zonder eigenaar en zonder tag, **When** de lijst wordt getoond, **Then** staat er onder de titel geen scheidingsteken, en is de regel leeg of afwezig.
2. **Given** een taak met eigenaar "Ava" en zonder tag, **When** de lijst wordt getoond, **Then** staat er "Ava", zonder "·" erachter.
3. **Given** een voltooide taak zonder eigenaar en tag, **When** de lijst wordt getoond, **Then** staat er alleen "Completed".
4. **Given** een taak met eigenaar "Ava" en tag "Marketing", **When** de lijst wordt getoond, **Then** staat er "Ava · Marketing", zoals voorheen.

---

### Edge Cases

- **Tag alleen spaties**: geldt als leeg, voor het kader en voor de regel onder de titel.
- **Bewaarde taken**: taken die al in de browser zijn opgeslagen met een lege tag, tonen na herladen ook geen kader. Er verandert niets aan wat wordt opgeslagen.
- **Uitlijning**: zonder tagkader blijft de Open-knop rechts uitgelijnd, zodat de knoppen in de lijst onder elkaar blijven staan.
- **Filters**: in alle drie de filters (All, Active, Completed) geldt hetzelfde gedrag.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Een taakkaart MOET het tagkader alleen tonen als de tag na het weghalen van spaties aan begin en eind niet leeg is.
- **FR-002**: Een taak zonder tag MAG GEEN tagkader in de pagina hebben, ook geen verborgen of leeg element dat ruimte inneemt of door hulptechnologie wordt voorgelezen.
- **FR-003**: Een wijziging van de tag in de taakdialoog MOET direct zichtbaar zijn op de kaart: het kader verschijnt of verdwijnt zonder herladen.
- **FR-004**: De regel onder de titel MOET alleen de aanwezige onderdelen tonen (eigenaar, tag, "Completed"), gescheiden door " · ", zonder scheidingsteken aan het begin, aan het eind of dubbel.
- **FR-005**: Taken met een tag MOETEN er precies zo uitzien als nu: zelfde kader, zelfde tekst, zelfde `data-spec`-spoor naar 003 FR-003.
- **FR-006**: De Open-knop MOET bij taken met en zonder tag op dezelfde horizontale positie staan.

### Key Entities

- **Taak**: ongewijzigd (titel, toelichting, tag, eigenaar, voltooid). Een tag is "leeg" als hij na het weghalen van spaties aan begin en eind geen tekens bevat.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bij 100% van de taken zonder tag staat er geen tagkader op de kaart, in alle drie de filters.
- **SC-002**: Bij 100% van de taken met een tag is het kader met dezelfde tekst zichtbaar als vóór deze wijziging.
- **SC-003**: In geen enkele combinatie van lege of gevulde eigenaar, tag en status bevat de regel onder de titel een scheidingsteken aan het begin, aan het eind of twee achter elkaar.
- **SC-004**: Een tagwijziging in de dialoog is op de kaart zichtbaar zonder dat de gebruiker iets anders doet dan typen.

## Assumptions

- **Geen gegevenswijziging**: het opslagformaat uit 005 blijft gelijk; een lege tag blijft een lege tekst.
- **Geen nieuwe standaardtag**: taken zonder tag krijgen geen vervangende tekst zoals "Geen tag"; het kader verdwijnt gewoon.
- **Taal**: de interface blijft Engels, zoals sinds 001 ("Completed").
- **Los van 007**: deze feature wordt gebouwd vanaf `main` en is onafhankelijk van PR #13 (007). Wordt 007 eerst gemerged, dan moet 008 na het bijwerken vanaf `main` aan de documentenlijst van 007 (`docs.js`) worden toegevoegd, omdat de test van 007 elke map in `specs/` verwacht.
