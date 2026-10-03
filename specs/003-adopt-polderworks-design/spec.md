# Feature Specification: Polderworks-designsysteem adopteren

**Feature Branch**: `003-adopt-polderworks-design`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "Adopt the central Polderworks design system (installed as the polderworks-design skill) in the todo app UI"

## Clarifications

### Session 2026-10-03

- Q: Moet de demo zichtbaar als Polderworks-onderdeel worden gebrandmerkt, of neemt hij alleen de visuele foundations over? → A: Alleen de visuele foundations (kleuren, typografie, vormen); geen logo en geen endorsement-regel.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - De takenlijst in de huisstijl zien (Priority: P1)

Als demo-gebruiker wil ik dat het takenpaneel (koptekst, invoerveld, knoppen, filters, takenlijst en lege staat) eruitziet volgens het centrale Polderworks-designsysteem, zodat de demo herkenbaar past bij de rest van het huis en niet als losse proof-of-concept oogt.

**Why this priority**: Het takenpaneel is het eerste en meest gebruikte deel van de demo. Als alleen dit deel is omgezet, levert dat al een zichtbaar en demonstreerbaar resultaat.

**Independent Test**: Open de demo en vergelijk het takenpaneel met de foundations van het designsysteem (kleuren, typografie, hoeken, randen, schaduwen). Alle bestaande taakacties werken nog precies zoals voorheen.

**Acceptance Scenarios**:

1. **Given** de demo is geladen, **When** de gebruiker het takenpaneel bekijkt, **Then** gebruiken achtergrond, tekst, randen en accenten uitsluitend kleuren uit het designsysteem en is er geen verloop (gradient) zichtbaar.
2. **Given** de demo is geladen, **When** de gebruiker de tekst bekijkt, **Then** staat alle interface- en lopende tekst in IBM Plex Sans en staan technische labels en ID's in IBM Plex Mono.
3. **Given** de demo is geladen, **When** de gebruiker panelen, kaarten en taakrijen bekijkt, **Then** hebben die rechte hoeken en een dunne lijnrand, en hebben alleen bedieningselementen een kleine afronding van hooguit 3px (nooit pilvormig).
4. **Given** de gebruiker voegt een taak toe, vinkt er een af, filtert of bewerkt er een, **When** de actie is uitgevoerd, **Then** is het resultaat identiek aan het gedrag van vóór deze feature.

---

### User Story 2 - Status en interactie volgens het designsysteem (Priority: P1)

Als gebruiker wil ik dat knoppen, invoervelden, filters, het selectievakje van een taak en de taakdialoog de componentpatronen van het designsysteem volgen (primaire, secundaire en ghost-knop, hover- en focusstaten), zodat ik direct zie wat klikbaar is en waar de focus staat.

**Why this priority**: Interactieve staten bepalen de bruikbaarheid en toegankelijkheid. Een mooie maar onduidelijke interface schiet het doel voorbij.

**Independent Test**: Bedien de hele demo alleen met het toetsenbord en met de muis, en controleer per bedieningselement de hover-, focus- en actieve staat tegen het designsysteem.

**Acceptance Scenarios**:

1. **Given** een bedieningselement heeft toetsenbordfocus, **When** de gebruiker ernaar kijkt, **Then** is een zichtbare focusring in de focuskleur van het designsysteem te zien.
2. **Given** de gebruiker beweegt de muis over de primaire knop, **When** de hoverstaat actief is, **Then** verschuift de knopkleur één stap in het palet (van marine naar kanaalteal) en verschijnt er geen schaduw of animatie.
3. **Given** een filter is actief, **When** de gebruiker de filterbalk bekijkt, **Then** is de actieve filter te onderscheiden op een manier die niet alleen van kleur afhangt.
4. **Given** de taakdialoog is geopend, **When** de gebruiker hem bekijkt, **Then** volgt de dialoog het patroon van het designsysteem: verhoogd oppervlak met een terughoudende schaduw en rechte hoeken.

---

### User Story 3 - Het beslissingsspoor in de huisstijl (Priority: P2)

Als demo-presentator wil ik dat het paneel met het beslissingsspoor (fasen, feature-ID, element en het trace-object) de technische stijl van het designsysteem volgt, zodat de traceerbaarheid er even verzorgd uitziet als de app zelf en technische gegevens herkenbaar als technisch worden getoond.

**Why this priority**: Het spoorpaneel is het onderscheidende deel van de demo, maar het werkt functioneel al. De stijl ervan is minder kritisch dan die van het takenpaneel.

**Independent Test**: Klik op een willekeurig element, controleer dat het spoorpaneel de juiste gegevens toont en dat de opmaak het code- en calloutpatroon van het designsysteem volgt.

**Acceptance Scenarios**:

1. **Given** de gebruiker klikt op een element, **When** het spoorpaneel wordt bijgewerkt, **Then** staat het trace-object in de codeblokstijl van het designsysteem (monospace, vlak oppervlak, geen afgeronde hoeken).
2. **Given** het spoorpaneel toont de fasen, **When** de gebruiker de lijst bekijkt, **Then** zijn de fasen gescheiden met dunne lijnranden, en waar een fase wordt uitgelicht gebeurt dat met een linkerrand van 3px, niet met een gekleurd vlak.

---

### Edge Cases

- **Geen internetverbinding**: de demo moet ook offline werken (constitution V). Als de lettertypen niet geladen kunnen worden, blijft de app leesbaar en bruikbaar met een systeemlettertype als terugvaloptie.
- **Systeem in donkere modus**: de app toont het lichte thema als standaard. Een donkere systeemvoorkeur mag het contrast niet breken: alle tekst blijft binnen het gekozen thema leesbaar.
- **Lange taaktitels en eigenaarsnamen**: die moeten netjes afbreken of worden afgekapt, zonder dat ze de lijst of de dialoog laten overlopen.
- **Smalle schermen (vanaf 360px breed)**: de twee panelen komen onder elkaar te staan, zonder horizontaal scrollen.
- **Statuskleuren**: goud en rood worden nooit als tekstkleur gebruikt. Waar een status (bijvoorbeeld voltooid) wordt getoond, staat die er ook in tekst bij.
- **Elementen uit feature 002** (sleepgrepen, herschikacties): als die al bestaan wanneer deze feature wordt gebouwd, volgen ze dezelfde stijlregels.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: De app MOET alle kleuren uitsluitend ontlenen aan de kleurtokens van het Polderworks-designsysteem. Er MOGEN geen losse kleurwaarden buiten die tokens worden gebruikt.
- **FR-002**: De app MOET IBM Plex Sans gebruiken voor interface- en lopende tekst en IBM Plex Mono voor technische labels, ID's en het trace-object. Andere lettertypen MOGEN alleen als terugvaloptie voorkomen.
- **FR-003**: Panelen, kaarten, taakrijen en de dialoog MOETEN rechte hoeken hebben. Alleen bedieningselementen MOGEN een afronding van 2 of 3px hebben. Pilvormen, verlopen, glanzende effecten en decoratieve schaduwen op statische inhoud MOGEN NIET voorkomen.
- **FR-004**: Afstanden en tekstgroottes MOETEN de spacing- en typografieschaal van het designsysteem volgen.
- **FR-005**: Knoppen MOETEN de knopvarianten van het designsysteem volgen: "Add task" als primaire knop, "Persist demo state" en "Close" als ghost- of secundaire knop. Hover verschuift één stap in het palet.
- **FR-006**: Invoervelden, het tekstvak, het selectievakje van een taak en de filters MOETEN de bijbehorende componentpatronen van het designsysteem volgen, met zichtbare labels of toegankelijke namen zoals nu.
- **FR-007**: Elk bedieningselement MOET bij toetsenbordfocus een zichtbare focusring in de focuskleur van het designsysteem tonen.
- **FR-008**: De taakdialoog MOET het dialoogpatroon van het designsysteem volgen: verhoogd oppervlak, terughoudende schaduw en rechte hoeken.
- **FR-009**: Het trace-object MOET in de codeblokstijl van het designsysteem worden getoond, en uitgelichte fasen of meldingen MOETEN de calloutstijl met een linkerrand van 3px gebruiken.
- **FR-010**: Alle combinaties van tekst en achtergrond MOETEN aan WCAG 2.1 AA-contrast voldoen. Goud en rood MOGEN NIET als tekstkleur worden gebruikt.
- **FR-011**: De app MOET volledig werken zonder netwerkverbinding. De lettertypen moeten dus offline beschikbaar zijn of terugvallen op een leesbaar systeemlettertype, en er MOGEN geen trackers of extra netwerkverzoeken met gebruikersdata bijkomen.
- **FR-012**: Alle bestaande functionaliteit, `data-spec`-attributen, `data-target`-attributen en toetsenbordbediening uit features 001 en 002 MOETEN ongewijzigd blijven werken.
- **FR-013**: Zichtbare interfaceteksten MOETEN de schrijfregels van het designsysteem volgen: geen emoji, geen em-dashes en knoppen als gebiedende wijs.
- **FR-014**: De app MOET alleen de visuele foundations van het designsysteem overnemen en MAG GEEN Polderworks-logo, Loods-logo of endorsement-regel ("a Polderworks project") tonen. De bestaande titel en koptekst blijven inhoudelijk gelijk.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Een controle van de opmaak vindt 0 kleurwaarden, lettertypen of afrondingen die niet uit het designsysteem komen (de terugvallettertypen niet meegerekend).
- **SC-002**: 100% van de tekst-achtergrondcombinaties haalt WCAG 2.1 AA-contrast (4,5:1 voor normale tekst, 3:1 voor grote tekst en focusringen).
- **SC-003**: Alle bestaande geautomatiseerde tests van features 001 en 002 slagen zonder dat er gedrag is aangepast.
- **SC-004**: Een gebruiker kan de hele kernflow (taak toevoegen, afvinken, filteren, openen en bewerken, spoor bekijken) alleen met het toetsenbord doorlopen en ziet bij elke stap waar de focus staat.
- **SC-005**: Met de netwerkverbinding uitgeschakeld laadt de demo volledig, en zijn alle functies binnen 2 seconden bruikbaar.
- **SC-006**: Een reviewer die het designsysteem kent, herkent in een vergelijking naast de componentvoorbeelden van het designsysteem elk bedieningselement als het bijbehorende designsysteempatroon.

## Assumptions

- **Licht thema als standaard**: het designsysteem gebruikt een licht thema als standaard en een donker thema voor terminal- en CLI-oppervlakken. De app stapt daarom over van het huidige donkere uiterlijk naar het lichte thema. Een themaschakelaar valt buiten de scope.
- **Taal van de interface**: de bestaande taal van de interfaceteksten blijft zoals die is. Deze feature verandert de vormgeving, niet de inhoud. De Britse spelling van het designsysteem geldt alleen voor Engelstalige teksten.
- **Alleen visueel**: er komen geen nieuwe functies, geen nieuwe gegevens en geen gedragswijzigingen bij. De trace-gegevens (fasen en beschrijvingen) blijven hetzelfde, al komen er wel trace-items voor feature 003 bij.
- **Bron van waarheid**: het in deze repository geïnstalleerde designsysteem (`.claude/skills/polderworks-design`) is leidend. Waar de huidige app afwijkt, volgt de app het designsysteem.
- **Geen iconenset**: het designsysteem gebruikt geen iconenset. Status wordt getoond met kleur, een kleine stip en tekst. Waar een glyph nodig is, wordt een minimaal teken gebruikt.
- **Merkregels**: de verboden van het designsysteem gelden (geen molens, tulpen of oranje toeristische beelden, geen wolk-, hangslot- of schildclichés en geen verwijzingen naar concurrenten).
