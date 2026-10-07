# Feature Specification: README en licentie

**Feature Branch**: `006-readme-and-license`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "we need a license and a readme to explain to interested parties what this repo is all about and why it has been created."

## Clarifications

### Session 2026-10-06

- Q: Onder welke licentie valt de eigen code en documentatie? → A: MIT.
- Q: Valt het Polderworks-designsysteem onder de licentie van de repository? → A: Ja, onder dezelfde MIT-licentie. De merknamen Polderworks en Loods en de merkidentiteit blijven uitgezonderd.
- Q: In welke taal schrijven we de uitleg? → A: Engels.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Begrijpen wat dit is en waarom het bestaat (Priority: P1)

Als geïnteresseerde bezoeker (bijvoorbeeld een collega, een potentiële klant of een ontwikkelaar die de repository op GitHub tegenkomt) wil ik op de voorpagina van de repository in een paar minuten lezen wat deze repository is, waarom hij is gemaakt en wat ik ervan kan leren, zodat ik kan beslissen of hij voor mij relevant is.

**Why this priority**: De repository is sinds 2026-10-05 publiek, maar er staat nergens wat hij is. Zonder uitleg ziet een bezoeker alleen een kleine takenlijst-app en mist hij de eigenlijke boodschap: het spec-driven werkproces.

**Independent Test**: Laat iemand die de repository niet kent alleen de voorpagina lezen en vraag daarna wat het doel is en waarom hij is gemaakt. Het antwoord moet overeenkomen met het doel in deze spec.

**Acceptance Scenarios**:

1. **Given** een bezoeker opent de repository op GitHub, **When** hij de voorpagina bekijkt, **Then** ziet hij direct een uitleg met titel, een samenvatting van één tot drie zinnen en het doel van de repository.
2. **Given** de bezoeker leest de uitleg, **When** hij bij het waarom aankomt, **Then** leest hij dat de repository bestaat om spec-driven development met Spec Kit en een AI-assistent zichtbaar te maken: van specificatie via plan en taken naar code, met traceerbaarheid tot elk element op het scherm.
3. **Given** de bezoeker wil weten hoe het proces eruitzag, **When** hij verder leest, **Then** vindt hij een overzicht van de features (001 tot en met 005), wat elke feature opleverde en waar de bijbehorende specificaties staan.
4. **Given** de bezoeker wil de leerpunten kennen, **When** hij het betreffende deel leest, **Then** vindt hij een eerlijk verslag van wat het proces opleverde, inclusief wat misging: functies die in 001 als klaar gemarkeerd waren maar niet gebouwd, en hoe de kwaliteitspoort uit 004 dat zichtbaar maakte.

---

### User Story 2 - De demo zelf draaien en controleren (Priority: P1)

Als ontwikkelaar wil ik in de uitleg lezen hoe ik de demo lokaal start, de tests draai en de kwaliteitspoort begrijp, zodat ik het resultaat zelf kan controleren in plaats van het op gezag aan te nemen.

**Why this priority**: Een demo van een werkproces is pas overtuigend als iemand het kan nadoen. De stappen bestaan al; ze staan alleen verspreid over specs en quickstarts.

**Independent Test**: Volg op een schone machine alleen de stappen uit de uitleg. De demo moet openen en de tests moeten slagen, zonder andere documentatie te raadplegen.

**Acceptance Scenarios**:

1. **Given** een schone kopie van de repository, **When** de ontwikkelaar de beschreven installatiestap en startopdracht uitvoert, **Then** opent de demo in de browser.
2. **Given** de ontwikkelaar voert de beschreven testopdrachten uit, **When** ze klaar zijn, **Then** slagen alle tests, en de uitleg vertelt welke categorieën er zijn (unit, code, beveiliging, bruikbaarheid).
3. **Given** de ontwikkelaar wil bijdragen, **When** hij de uitleg leest, **Then** weet hij dat elke wijziging via een pull request moet en dat de drie controles (`code`, `security`, `usability`) groen moeten zijn.

---

### User Story 3 - Weten wat ik mag (Priority: P1)

Als bezoeker of ontwikkelaar wil ik weten onder welke voorwaarden ik de code mag gebruiken, aanpassen en delen, en welke onderdelen van anderen komen en onder hun eigen voorwaarden vallen, zodat ik de repository rechtmatig kan hergebruiken.

**Why this priority**: Een publieke repository zonder licentie mag juridisch gezien door niemand worden hergebruikt. Bovendien bevat de repository onderdelen van derden (lettertypen, Spec Kit, het designsysteem) die niet zonder meer onder dezelfde voorwaarden vallen.

**Independent Test**: Controleer dat GitHub de licentie herkent en toont op de voorpagina, en dat voor elk onderdeel van derden in de repository een vermelding van herkomst en licentie bestaat.

**Acceptance Scenarios**:

1. **Given** de repository op GitHub, **When** een bezoeker de voorpagina bekijkt, **Then** toont GitHub de licentie van de repository herkenbaar in de zijbalk. Dat is de MIT-licentie.
2. **Given** de repository bevat de IBM Plex-lettertypen, **When** de bezoeker de uitleg of de licentievermelding leest, **Then** staat erbij dat die onder de SIL Open Font License vallen, met verwijzing naar het meegeleverde licentiebestand.
3. **Given** de repository bevat bestanden die door Spec Kit zijn gegenereerd (sjablonen, scripts en assistentvaardigheden), **When** de bezoeker de vermelding leest, **Then** staat erbij waar ze vandaan komen en onder welke licentie ze vallen.
4. **Given** de repository bevat het Polderworks-designsysteem, **When** de bezoeker de vermelding leest, **Then** staat erbij dat het designsysteem (tokens, componenten en richtlijnen) ook onder de MIT-licentie valt, maar dat de merknamen Polderworks en Loods en de merkidentiteit daarvan zijn uitgezonderd.

---

### Edge Cases

- **Merknamen**: Polderworks en Loods zijn merknamen. Een open-source-licentie op code geeft geen recht om die namen of de merkuitstraling te gebruiken; de uitleg moet dat niet suggereren.
- **Gegenereerde bestanden**: bestanden die door Spec Kit of de AI-assistent zijn gemaakt, staan in dezelfde repository als handgeschreven code. De vermelding moet niet beweren dat alles door de eigenaar is geschreven.
- **Verouderde getallen**: aantallen tests en features veranderen. De uitleg noemt ze zo dat een volgende feature ze niet direct onjuist maakt, of verwijst naar de plek waar ze actueel staan.
- **Bekende open punten**: de README noemt de bekende open problemen (verkeerd spoor bij het selectievakje, focus na sluiten via de achtergrond, feature 002 nog niet gebouwd) of verwijst ernaar, zodat een bezoeker ze niet als nieuwe ontdekking meldt.
- **Persoonsgegevens**: de uitleg bevat geen privéadres, telefoonnummer of andere persoonsgegevens van de eigenaar, behalve wat de eigenaar zelf kiest te vermelden.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: De repository MOET een uitleg op de voorpagina hebben met: titel, samenvatting, waarom de repository bestaat, wat er te zien is, hoe je hem draait, hoe je de tests draait, hoe je bijdraagt, licentie en dankbetuigingen. De uitleg is in het Engels, voor een internationaal publiek; de afwijking van de constitution (documentatie in het Nederlands) wordt in het plan verantwoord.
- **FR-002**: De uitleg MOET het doel beschrijven: het zichtbaar en controleerbaar maken van spec-driven development met Spec Kit en een AI-assistent, met traceerbaarheid van elk scherm-element tot de beslissing waaruit het voortkomt.
- **FR-003**: De uitleg MOET de werkwijze per feature samenvatten: de fasen uit de constitution (specify, clarify, plan, tasks, analyze, implement), met converge als controlestap na implement zoals die in de praktijk is gebruikt, de bijbehorende fasetags, en de plek van de prompts en beslissingen.
- **FR-004**: De uitleg MOET een overzicht geven van de features 001 tot en met 006, met 002 als gespecificeerd maar nog niet gebouwd, elk met een zin over het resultaat en een link naar de specificatie.
- **FR-005**: De uitleg MOET een eerlijk leerpuntendeel bevatten: wat het proces opleverde, wat misging en hoe het werd ontdekt en hersteld.
- **FR-006**: De uitleg MOET werkende opdrachten geven voor installeren, starten en testen. Elke opdracht MOET op een schone kopie te volgen zijn.
- **FR-007**: De uitleg MOET de kwaliteitspoort beschrijven (de drie verplichte controles en de branch-beveiliging) en hoe je een bijdrage indient.
- **FR-008**: De repository MOET een MIT-licentiebestand bevatten dat GitHub herkent, met de eigenaar als auteursrechthebbende.
- **FR-009**: Elk onderdeel van derden in de repository MOET een vermelding van herkomst en licentie hebben: IBM Plex (SIL OFL 1.1) en de door Spec Kit gegenereerde bestanden. Het Polderworks-designsysteem valt onder de MIT-licentie van de repository, met uitzondering van de merknamen en merkidentiteit (FR-010).
- **FR-010**: De uitleg MOET duidelijk maken dat de licentie geen recht geeft op het gebruik van de merknamen Polderworks en Loods.
- **FR-011**: De uitleg MOET vermelden dat een groot deel van de specificaties, plannen en code met een AI-assistent tot stand kwam, onder regie en controle van de eigenaar.
- **FR-012**: Zichtbare teksten MOETEN de schrijfregels van het project volgen: geen em-dashes en geen emoji (zoals in 003 FR-013 voor de interface).

### Key Entities

- **Uitleg (README)**: het document op de voorpagina van de repository.
- **Licentie**: het licentiebestand voor de eigen code en documentatie.
- **Vermelding van derden**: per extern onderdeel de naam, herkomst, licentie en plek van het licentiebestand.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Een lezer die de repository niet kent, kan na hooguit 3 minuten lezen in eigen woorden zeggen wat de repository is en waarom hij is gemaakt.
- **SC-002**: Alle opdrachten in de uitleg werken op een schone kopie: 100% van de stappen leidt tot het beschreven resultaat.
- **SC-003**: GitHub toont de licentie van de repository in de zijbalk.
- **SC-004**: 100% van de onderdelen van derden in de repository heeft een vermelding met herkomst en licentie.
- **SC-005**: Alle links in de uitleg werken: 0 dode links naar specificaties, bestanden of externe bronnen.

## Assumptions

- **Eigenaar**: de auteursrechthebbende is de eigenaar van de repository, Sander Ettema, tenzij anders aangegeven. De eigenaar heeft het recht om het Polderworks-designsysteem onder MIT vrij te geven (clarification Q2).
- **Spec Kit**: de bestanden in `.specify/` en `.claude/skills/speckit-*` komen uit het open-source Spec Kit-project van GitHub, dat onder de MIT-licentie valt. Dat wordt in het plan geverifieerd.
- **IBM Plex**: de lettertypen in `fonts/` vallen onder de SIL Open Font License 1.1; het licentiebestand staat al in `fonts/OFL.txt`.
- **Geen gedragswijziging**: deze feature verandert niets aan de demo zelf.
- **Kwaliteitspoort**: de wijziging gaat als elke andere via een pull request langs de drie controles uit 004.
