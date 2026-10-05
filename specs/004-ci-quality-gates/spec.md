# Feature Specification: Kwaliteitspoort voor pull requests

**Feature Branch**: `004-ci-quality-gates`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "Let's first create a pull request to close the present branch. Create a github actions pipeline to identify any security, useability and code issues before merging to main. Can you build this?"

## Clarifications

### Session 2026-10-05

- Q: Welke stappen vormen de kernflow, en blokkeren stappen die nu al niet werken de merge? → A: De volledige flow uit feature 001. De bekende gaten worden niet uitgezonderd, dus de controle faalt totdat ze zijn hersteld.
- Q: Welke controles blokkeren een merge naar `main`? → A: Alle drie: code, beveiliging en bruikbaarheid.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Codeproblemen blokkeren een merge (Priority: P1)

Als maintainer wil ik dat elke pull request naar `main` automatisch wordt gecontroleerd op falende tests, codefouten en schendingen van de projectafspraken, zodat er geen werk in `main` belandt dat de demo breekt of de traceerbaarheid aantast.

**Why this priority**: Dit is de basis van de kwaliteitspoort. Zonder automatische codecontrole hangt kwaliteit af van wat een reviewer toevallig ziet, zoals de ontbrekende functies uit feature 001 lieten zien.

**Independent Test**: Open een pull request met een bewust falende test of een `data-spec`-attribuut met een onbekend requirement-ID, en controleer dat de controle faalt en de merge geblokkeerd wordt. Herstel het en controleer dat de controle slaagt.

**Acceptance Scenarios**:

1. **Given** een pull request naar `main`, **When** de pull request wordt geopend of bijgewerkt, **Then** start de controle automatisch zonder handmatige actie.
2. **Given** een pull request waarin een geautomatiseerde test faalt, **When** de controle klaar is, **Then** staat de controle op "gefaald" en noemt het resultaat de falende test.
3. **Given** een pull request waarin een `data-spec`-ID verwijst naar een requirement dat niet in de bijbehorende `spec.md` bestaat, **When** de controle klaar is, **Then** faalt de controle met het onbekende ID en het bestand waarin het staat.
4. **Given** een pull request waarin code inconsistent is opgemaakt of bekende foutpatronen bevat (bijvoorbeeld ongebruikte variabelen of onbereikbare code), **When** de controle klaar is, **Then** faalt de controle met bestand en regel van elke bevinding.
5. **Given** alle controles slagen, **When** de maintainer de pull request bekijkt, **Then** kan hij mergen.

---

### User Story 2 - Beveiligingsproblemen worden gevonden vóór de merge (Priority: P1)

Als maintainer wil ik dat elke pull request wordt gescand op beveiligingsproblemen (gelekte geheimen, kwetsbare afhankelijkheden, onveilige codepatronen en strijdigheid met de privacyprincipes), zodat de demo veilig blijft en de constitution-regel "gebruikersdata blijft lokaal" afdwingbaar is.

**Why this priority**: Beveiligingsproblemen zijn duur om achteraf te herstellen en een gelekt geheim is na een merge publiek. Dit weegt even zwaar als codekwaliteit.

**Independent Test**: Open een pull request met een nep-API-sleutel in een bestand, of met code die gebruikersdata naar een externe URL stuurt, en controleer dat de beveiligingscontrole faalt.

**Acceptance Scenarios**:

1. **Given** een pull request die iets bevat dat op een geheim lijkt (API-sleutel, token, wachtwoord), **When** de controle klaar is, **Then** faalt de controle met bestand en regel, zonder het geheim zelf volledig te tonen.
2. **Given** een pull request die een afhankelijkheid toevoegt met een bekende kwetsbaarheid van hoog of kritiek niveau, **When** de controle klaar is, **Then** faalt de controle met de naam van het pakket en de kwetsbaarheid.
3. **Given** een pull request met een bekend onveilig codepatroon (bijvoorbeeld ongefilterde gebruikersinvoer die als HTML wordt ingevoegd), **When** de controle klaar is, **Then** wordt de bevinding gemeld met bestand, regel en uitleg.
4. **Given** een pull request die een netwerkverzoek naar een extern domein, een tracker of een analytics-script toevoegt, **When** de controle klaar is, **Then** faalt de controle met een verwijzing naar constitution-principe V.
5. **Given** de controle zelf, **When** hij draait, **Then** heeft hij alleen leesrechten op de code en kan een pull request uit een fork geen geheimen van de repository uitlezen.

---

### User Story 3 - Bruikbaarheid en toegankelijkheid worden gecontroleerd (Priority: P2)

Als maintainer wil ik dat elke pull request de demo in een echte browser opent en controleert op toegankelijkheid en op de werking van de kernflow, zodat regressies in bruikbaarheid zichtbaar worden voordat ze `main` bereiken.

**Why this priority**: De statische controles uit US1 en US2 vangen niet op dat knoppen in de browser niets doen. Dit is precies het type probleem dat in feature 001 onopgemerkt bleef. Het staat op P2 omdat het meer opzet vraagt dan de statische controles.

**Independent Test**: Open een pull request die een label van een invoerveld verwijdert of een knop zijn klikgedrag laat verliezen, en controleer dat de bruikbaarheidscontrole faalt.

**Acceptance Scenarios**:

1. **Given** een pull request, **When** de controle de demo in een browser laadt, **Then** worden automatische toegankelijkheidscontroles op WCAG 2.1 AA uitgevoerd en faalt de controle bij elke overtreding van ernstig of kritiek niveau.
2. **Given** de demo is geladen, **When** de controle de kernflow alleen met het toetsenbord doorloopt, **Then** krijgt elk bedieningselement zichtbaar focus en is elke stap bereikbaar.
3. **Given** de demo is geladen, **When** de controle de kernflow uit feature 001 doorloopt (taak toevoegen, afvinken, filteren op alle, actieve en voltooide taken, lege staat, taak openen en bewerken, sluiten met de sluitknop en met Escape met focus terug op de Open-knop, bewaren en herladen, en het spoor bekijken), **Then** heeft elke stap het verwachte zichtbare resultaat, en faalt de controle bij elke stap die dat niet heeft.
4. **Given** de demo wordt geladen met geblokkeerd netwerk naar externe domeinen, **When** de pagina klaar is, **Then** is de demo volledig bruikbaar (constitution V, offline-eis uit 003).

---

### User Story 4 - Duidelijke uitkomst in de pull request (Priority: P3)

Als bijdrager wil ik in de pull request in één oogopslag zien welke controle faalde en waarom, zodat ik het probleem kan herstellen zonder de logs door te spitten.

**Why this priority**: Verbetert de snelheid van herstel, maar de poort werkt ook zonder.

**Independent Test**: Laat één controle falen en controleer dat de pull request per controle een aparte status toont met een samenvatting van de bevindingen.

**Acceptance Scenarios**:

1. **Given** een pull request, **When** de controles klaar zijn, **Then** toont de pull request een aparte status per categorie (code, beveiliging, bruikbaarheid).
2. **Given** een controle faalt, **When** de bijdrager de status opent, **Then** ziet hij een samenvatting met per bevinding het bestand, de regel (waar van toepassing) en de reden.

---

### Edge Cases

- **Pull request uit een fork**: de controles draaien, maar zonder toegang tot geheimen van de repository en zonder schrijfrechten.
- **Alleen documentatie gewijzigd** (bijvoorbeeld alleen `specs/`): de verplichte controles moeten toch een status rapporteren, zodat de merge niet blijft hangen op een ontbrekende status.
- **Bestaande problemen in `main`**: bekende gaten uit feature 001 (taak toevoegen, filteren, bewaren en lege staat) bestaan al vóór deze feature. De bruikbaarheidscontrole test ze gewoon mee en faalt daarop, totdat ze in een vervolg op feature 001 zijn hersteld. Merges naar `main` zijn tot dan geblokkeerd. Dat is bewust: de poort maakt zichtbaar wat de specificatie belooft maar de code niet doet.
- **Externe dienst onbereikbaar** (bijvoorbeeld de bron van kwetsbaarheidsgegevens): de controle faalt zichtbaar met de oorzaak, in plaats van stilzwijgend te slagen.
- **Vals-positieve bevinding**: een bijdrager moet een bevinding expliciet en zichtbaar kunnen uitzonderen, met een reden die in de repository wordt vastgelegd.
- **Controle duurt te lang of blijft hangen**: elke controle heeft een tijdslimiet en faalt bij overschrijding.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Het systeem MOET bij elke pull request naar `main`, en bij elke nieuwe commit in die pull request, automatisch alle controles starten.
- **FR-002**: Het systeem MOET de bestaande geautomatiseerde tests uitvoeren en falen als één test faalt.
- **FR-003**: Het systeem MOET de code controleren op bekende foutpatronen en inconsistente opmaak, en elke bevinding melden met bestand en regel.
- **FR-004**: Het systeem MOET controleren dat elk `data-spec`-ID verwijst naar een bestaand requirement in de `spec.md` van de genoemde feature (constitution III, trace-controle).
- **FR-005**: Het systeem MOET de wijzigingen scannen op gelekte geheimen en falen bij een vondst. Het geheim zelf MAG NIET volledig in de uitvoer verschijnen.
- **FR-006**: Het systeem MOET afhankelijkheden controleren op bekende kwetsbaarheden en falen bij een kwetsbaarheid van hoog of kritiek niveau.
- **FR-007**: Het systeem MOET de code statisch analyseren op onveilige patronen en de bevindingen in de pull request tonen.
- **FR-008**: Het systeem MOET falen als de wijzigingen netwerkverzoeken naar externe domeinen, trackers of analytics toevoegen (constitution V).
- **FR-009**: Het systeem MOET de demo in een browser laden en automatische toegankelijkheidscontroles op WCAG 2.1 AA uitvoeren. Overtredingen van ernstig of kritiek niveau laten de controle falen.
- **FR-010**: Het systeem MOET de kernflow alleen met het toetsenbord doorlopen en controleren dat elk bedieningselement zichtbaar focus krijgt (constitution IV).
- **FR-011**: Het systeem MOET de volledige kernflow uit feature 001 in de browser doorlopen (zie US3, scenario 3) en falen bij elke stap zonder het verwachte resultaat. Bekende gaten worden niet uitgezonderd.
- **FR-012**: Het systeem MOET per categorie (code, beveiliging, bruikbaarheid) een aparte status in de pull request tonen, met per bevinding bestand, regel en reden.
- **FR-013**: Een merge naar `main` MOET geblokkeerd zijn zolang niet alle drie de categorieën (code, beveiliging en bruikbaarheid) geslaagd zijn.
- **FR-014**: De controles MOGEN alleen leesrechten op de code hebben. Alleen de beveiligingscontrole mag meldingen van de statische analyse publiceren. Pull requests uit forks MOGEN GEEN toegang krijgen tot geheimen van de repository.
- **FR-015**: Elke controle MOET een tijdslimiet hebben en bij overschrijding of bij een onbereikbare externe bron falen met een duidelijke oorzaak.
- **FR-016**: Een uitzondering op een bevinding MOET in de repository worden vastgelegd met een reden, zodat hij in review zichtbaar is.
- **FR-017**: De controles MOGEN GEEN nieuwe runtime-afhankelijkheid aan de demo toevoegen. Hulpmiddelen voor de controles zelf zijn alleen ontwikkelafhankelijkheden (constitution I).

### Key Entities

- **Controle**: een benoemde stap in de kwaliteitspoort, met categorie (code, beveiliging, bruikbaarheid), status (geslaagd, gefaald, bezig) en een lijst bevindingen.
- **Bevinding**: één gemeld probleem met categorie, ernst, bestand, regel (indien van toepassing) en reden.
- **Uitzondering**: een in de repository vastgelegde, gemotiveerde vrijstelling van een specifieke bevinding.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% van de pull requests naar `main` krijgt automatisch een uitkomst van alle controles, zonder handmatige stap.
- **SC-002**: Alle controles samen zijn binnen 10 minuten na een push klaar.
- **SC-003**: Elk van de vijf bewust ingebrachte problemen uit de onafhankelijke tests (falende test, onbekend `data-spec`-ID, nep-geheim, externe tracker, verwijderd veldlabel) wordt gedetecteerd en laat de bijbehorende controle falen.
- **SC-004**: Code en beveiliging geven 0 vals-positieve fouten op de huidige code. De bruikbaarheidscontrole faalt op de huidige code op precies de vier bekende gaten uit feature 001 (taak toevoegen, filteren, lege staat, bewaren) en op niets anders; na het herstel daarvan slaagt een pull request zonder problemen voor alle controles.
- **SC-005**: Een bijdrager kan uit de statusmelding in de pull request binnen 1 minuut bepalen welke controle faalde en in welk bestand het probleem zit.
- **SC-006**: Geen enkele controle heeft schrijfrechten op code, instellingen of geheimen van de repository, en een pull request uit een fork krijgt geen toegang tot geheimen. De enige schrijfbevoegdheid is het publiceren van meldingen van de statische analyse in de beveiligingscontrole.

## Assumptions

- **Platform**: de repository staat op GitHub en de controles draaien als GitHub Actions, zoals gevraagd. Een andere CI-dienst valt buiten de scope.
- **Merge-blokkade**: een merge echt blokkeren vereist een branch-beschermingsregel op `main`. Die instelling vraagt beheerrechten op de repository. De feature levert de controles en een beschrijving van de benodigde regel; de maintainer zet de regel aan of geeft daar expliciet toestemming voor.
- **Bestaande pull request**: pull request #1 (feature 003) staat al open. De controles gelden voor nieuwe en bijgewerkte pull requests nadat deze feature in `main` is gemerged.
- **Kosten**: de repository is publiek of heeft voldoende Actions-minuten. Er worden alleen gratis te gebruiken scanners ingezet.
- **Bestaande projectafspraken**: de controles toetsen aan de constitution (principes I tot en met V) en aan de bestaande tests; ze voegen geen nieuwe kwaliteitsregels toe die daar niet uit volgen, behalve gangbare foutpatronen en opmaak.
- **Afhankelijkheid van de bestaande testopzet**: het project draait vandaag op `node --test`. Browsercontroles vragen extra ontwikkelgereedschap; die afweging hoort in het plan (zie Complexity Tracking in plan 003).
