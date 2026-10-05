# Feature Specification: Kernflow uit feature 001 voltooien

**Feature Branch**: `005-complete-core-flow`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "/speckit-specify" without a description. Taken from the agreed next step: complete the four 001 core-flow behaviours that were specified but never built (add a task, filters, empty state, persist and reload). They were found by the 004 quality gate.

## Clarifications

### Session 2026-10-05

- Q: Wordt er automatisch bij elke wijziging bewaard, of alleen via "Persist demo state"? → A: Automatisch bij elke wijziging. De knop bewaart expliciet en toont een bevestiging.
- Q: Moeten gebruikers taken kunnen verwijderen? → A: Nee, dat valt buiten de scope. De lege staat is bereikbaar via een filter.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Een taak toevoegen (Priority: P1)

Als demo-gebruiker wil ik een nieuwe taak toevoegen via het invoerveld en de knop "Add task", zodat ik de demo met eigen taken kan gebruiken in plaats van alleen de voorbeeldtaken.

**Why this priority**: Toevoegen is de eerste handeling in elke takenlijst. De knop staat al op het scherm en belooft het, maar doet niets. Ook het spoor (spec-01) beschrijft dat de taak wordt toegevoegd.

**Independent Test**: Typ een titel, druk op "Add task" of Enter, en controleer dat de taak onderaan de lijst verschijnt, als actief, en dat het invoerveld leeg is.

**Acceptance Scenarios**:

1. **Given** het invoerveld bevat een titel, **When** de gebruiker op "Add task" klikt, **Then** verschijnt onderaan de lijst een nieuwe, actieve taak met die titel.
2. **Given** het invoerveld heeft focus en bevat een titel, **When** de gebruiker op Enter drukt, **Then** wordt de taak op dezelfde manier toegevoegd.
3. **Given** een taak is net toegevoegd, **When** de gebruiker naar het invoerveld kijkt, **Then** is het leeg en heeft het nog steeds de focus, zodat direct een volgende taak kan worden getypt.
4. **Given** het invoerveld is leeg of bevat alleen spaties, **When** de gebruiker op "Add task" klikt, **Then** wordt er geen taak toegevoegd en ziet de gebruiker een melding bij het veld dat een titel nodig is.
5. **Given** een taak is toegevoegd, **When** de gebruiker op "Open" bij die taak klikt, **Then** kan hij titel, toelichting, tag en eigenaar bewerken zoals bij elke andere taak.
6. **Given** de gebruiker klikt op "Add task", **When** het spoorpaneel wordt bijgewerkt, **Then** toont het nog steeds spec-01, zoals nu.

---

### User Story 2 - Filteren op status (Priority: P1)

Als gebruiker wil ik met de filters "All", "Active" en "Completed" de lijst beperken tot de taken met die status, zodat ik kan zien wat nog moet en wat klaar is.

**Why this priority**: De filters staan op het scherm en reageren al visueel (de geselecteerde tab wisselt), maar de lijst verandert niet. Dat is misleidend.

**Independent Test**: Kies elk filter om de beurt en controleer dat precies de juiste taken zichtbaar zijn. Vink daarna een taak af terwijl "Active" gekozen is en controleer dat die direct verdwijnt.

**Acceptance Scenarios**:

1. **Given** het filter staat op "All", **When** de gebruiker de lijst bekijkt, **Then** ziet hij alle taken.
2. **Given** het filter staat op "Active", **When** de gebruiker de lijst bekijkt, **Then** ziet hij alleen taken die niet voltooid zijn.
3. **Given** het filter staat op "Completed", **When** de gebruiker de lijst bekijkt, **Then** ziet hij alleen voltooide taken.
4. **Given** het filter staat op "Active", **When** de gebruiker een taak afvinkt, **Then** verdwijnt die taak direct uit de lijst.
5. **Given** het filter staat op "Completed", **When** de gebruiker een nieuwe taak toevoegt, **Then** wordt de taak wel toegevoegd maar is hij in dit filter niet zichtbaar, en meldt de app kort dat de taak is toegevoegd aan "Active".

---

### User Story 3 - Lege staat (Priority: P2)

Als gebruiker wil ik een duidelijke melding zien wanneer er in de huidige weergave geen taken zijn, zodat ik weet dat dit klopt en wat ik kan doen.

**Why this priority**: Zonder lege staat lijkt een leeg filter op een fout. Het hangt af van US2, omdat de lijst nu alleen via een filter leeg kan worden.

**Independent Test**: Vink alle taken af en kies "Active". Controleer dat de lege staat verschijnt en verdwijnt zodra er weer een actieve taak is.

**Acceptance Scenarios**:

1. **Given** het gekozen filter levert geen taken op, **When** de lijst wordt weergegeven, **Then** verschijnt de lege staat in plaats van de lijst.
2. **Given** de lege staat is zichtbaar, **When** de gebruiker de tekst leest, **Then** past die bij de situatie: geen taken in dit filter, of helemaal geen taken, met de uitnodiging om een taak toe te voegen.
3. **Given** de lege staat is zichtbaar, **When** er weer een taak in het filter komt (toegevoegd of van status veranderd), **Then** verdwijnt de lege staat en verschijnt de lijst.

---

### User Story 4 - Taken blijven bewaard na herladen (Priority: P2)

Als demo-gebruiker wil ik dat mijn taken en wijzigingen na het herladen van de pagina nog bestaan, zodat de demo werkt als een echte takenlijst.

**Why this priority**: Persistentie is in 001 beloofd (FR-010). De knop "Persist demo state" bestaat al, maar bewaart niets.

**Independent Test**: Voeg een taak toe, vink een andere af en wijzig een titel. Herlaad de pagina en controleer dat alle drie de wijzigingen er nog zijn.

**Acceptance Scenarios**:

1. **Given** de gebruiker heeft taken toegevoegd, afgevinkt of bewerkt, **When** hij de pagina herlaadt, **Then** ziet hij dezelfde taken in dezelfde staat.
2. **Given** er is nog nooit iets bewaard, **When** de demo wordt geladen, **Then** ziet de gebruiker de twee voorbeeldtaken zoals nu.
3. **Given** de bewaarde gegevens zijn onleesbaar of beschadigd, **When** de demo wordt geladen, **Then** start de demo met de voorbeeldtaken en blijft hij bruikbaar, zonder foutmelding voor de gebruiker.
4. **Given** de gebruiker drukt op "Persist demo state", **When** het bewaren gelukt is, **Then** ziet hij een korte bevestiging die ook voor schermlezers wordt voorgelezen.

---

### Edge Cases

- **Lege of alleen-spaties-titel bij toevoegen**: wordt geweigerd met een melding bij het veld (US1, scenario 4). Spaties aan begin en eind van een geldige titel worden verwijderd.
- **Zeer lange titel**: wordt toegevoegd en breekt netjes af in de lijst, zoals in 003 al voor bestaande taken geldt.
- **Titel met HTML-tekens** (bijvoorbeeld `<b>`): wordt als tekst getoond, niet als opmaak (de XSS-bescherming uit 004 blijft gelden).
- **Titel leegmaken in de taakdialoog** (001 edge case): de taak behoudt een titel. Een lege titel wordt bij het sluiten niet geaccepteerd en de vorige titel komt terug.
- **Opslag niet beschikbaar** (bijvoorbeeld privévenster met geblokkeerde opslag): de demo werkt gewoon in het geheugen; alleen het bewaren na herladen ontbreekt.
- **Geselecteerd filter na herladen**: het filter start altijd op "All". Alleen de taken worden bewaard.
- **Verwijderen van taken**: valt buiten deze feature (clarification Q2). De lege staat is daardoor alleen via een filter bereikbaar. De tekst voor "helemaal geen taken" bestaat wel (US3, scenario 2), zodat een latere verwijderfunctie hem direct kan gebruiken.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: De gebruiker MOET een taak kunnen toevoegen door een titel in te voeren en op "Add task" te klikken of op Enter te drukken in het invoerveld.
- **FR-002**: Een nieuwe taak MOET actief zijn, de ingevoerde titel hebben (zonder spaties aan begin en eind), lege toelichting, tag en eigenaar hebben, en onderaan de lijst verschijnen.
- **FR-003**: Na toevoegen MOET het invoerveld leeg zijn en de focus houden.
- **FR-004**: Een lege titel of een titel van alleen spaties MOET worden geweigerd. De melding MOET aan het invoerveld gekoppeld zijn (constitution IV) en verdwijnen zodra de gebruiker begint te typen.
- **FR-005**: De filters "All", "Active" en "Completed" MOETEN de zichtbare taken beperken tot respectievelijk alle, niet-voltooide en voltooide taken. De lijst MOET direct bijwerken bij elke statuswijziging en elke nieuwe taak.
- **FR-006**: Het geselecteerde filter MOET via de bestaande `aria-pressed`-staat aan hulptechnologie worden doorgegeven (zoals in 003).
- **FR-007**: Wanneer de zichtbare lijst leeg is, MOET de lege staat worden getoond in plaats van de lijst, met een tekst die past bij het filter.
- **FR-008**: Elke wijziging aan de taken (toevoegen, afvinken, bewerken) MOET direct automatisch worden bewaard, zodat titel, toelichting, tag, eigenaar en status na herladen behouden blijven. Er wordt uitsluitend in de lokale opslag van de browser bewaard (constitution V).
- **FR-009**: Bij ontbrekende of onleesbare bewaarde gegevens MOET de demo starten met de voorbeeldtaken, zonder fout voor de gebruiker.
- **FR-010**: "Persist demo state" MOET de huidige staat expliciet bewaren en een korte, voor schermlezers aangekondigde bevestiging tonen. Omdat er al automatisch wordt bewaard, is de knop een geruststelling en geen vereiste stap.
- **FR-011**: Een titel die in de taakdialoog wordt leeggemaakt, MOET bij het sluiten worden teruggezet naar de laatste niet-lege titel.
- **FR-012**: Bestaand gedrag uit 001, 003 en 004 MOET ongewijzigd blijven: afvinken, openen en bewerken, sluiten met focus terug op Open, het spoorpaneel, `data-spec`- en `data-target`-attributen, de huisstijl en de escaping van gebruikersinvoer.
- **FR-013**: Nieuwe en gewijzigde elementen MOETEN een `data-spec`-attribuut voor 005 dragen en vindbaar zijn in het spoorpaneel (constitution III).

### Key Entities

- **Taak**: id (uniek, ook voor nieuwe taken), titel (niet leeg), toelichting, tag, eigenaar, voltooid (ja/nee).
- **Bewaarde demostaat**: de lijst taken met een versie-aanduiding, zodat een oud of beschadigd formaat herkend en genegeerd kan worden.
- **Filter**: één van All, Active of Completed. Niet bewaard.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: De vier kernflowtests uit 004 die nu falen (taak toevoegen, filteren, lege staat, bewaren en herladen) slagen, en de bruikbaarheidscontrole in de pull request is groen.
- **SC-002**: Alle overige controles uit 004 (code, beveiliging, toegankelijkheid en toetsenbord) blijven groen.
- **SC-003**: Een gebruiker kan in minder dan 10 seconden een taak toevoegen, afvinken en via "Completed" terugvinden, alleen met het toetsenbord.
- **SC-004**: Na herladen is 100% van de toegevoegde, afgevinkte en bewerkte taken in dezelfde staat terug.
- **SC-005**: Met beschadigde bewaarde gegevens laadt de demo in 100% van de gevallen met de voorbeeldtaken en zonder zichtbare fout.

## Assumptions

- **Herkomst**: de vier gedragingen staan al in de spec van 001 (US4, US5, FR-010 en het spoor van spec-01) maar zijn nooit gebouwd. Deze feature bouwt ze alsnog, zonder de specificatie van 001 te wijzigen.
- **Basis**: de feature bouwt voort op de huidige code van branch `004-ci-quality-gates`, inclusief de huisstijl uit 003 en de escaping en browsertests uit 004.
- **Volgorde van mergen**: na deze feature worden PR #1 (003), deze feature en PR #2 (004) naar `main` gemerged, en daarna gaat de branch-beveiliging aan (004 T036). Hoe de branches precies samenkomen, hoort in het plan.
- **Geen nieuwe functies buiten 001**: geen verwijderen, sorteren of prioriteit. Prioriteit is feature 002.
- **Taal van de interface**: blijft Engels, zoals de bestaande knoppen en teksten (zie plan 003, Complexity Tracking).
