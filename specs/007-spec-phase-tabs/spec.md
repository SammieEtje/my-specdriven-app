# Feature Specification: Fasetabs met de echte Spec Kit-documenten

**Feature Branch**: `007-spec-phase-tabs`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Ik vind dat het rechter paneel met de specs nog te beperkt is. Is het mogelijk hier voor elke fase een apart tab te realiseren met daarin een 1-op-1 opname van de speckit markdown files?"

## Clarifications

### Session 2026-10-07

- Q: Wat tonen de tabs clarify, analyze en implement, die geen eigen bestand hebben? → A: Clarify toont de sectie "Clarifications" uit `spec.md`; analyze en implement tonen hun eigen fasesectie uit `prompts.md`.
- Q: Worden de documenten opgemaakt of als brontekst getoond? → A: Opgemaakt: koppen, lijsten, tabellen, codeblokken en vinkjes worden als opmaak weergegeven.
- Q: Wat gebeurt er met de bestaande samenvatting en het trace-object? → A: Die verdwijnen; het paneel bestaat alleen nog uit de fasetabs.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Per fase het echte document lezen (Priority: P1)

Als bezoeker van de demo wil ik in het rechterpaneel per workflowfase een tab kunnen openen en daar de inhoud zien van het Spec Kit-document dat in die fase is gemaakt, precies zoals het in de repository staat, zodat ik niet een samenvatting lees maar het werkelijke resultaat van het proces.

**Why this priority**: Het paneel toont nu per element een korte, met de hand geschreven zin per fase. Die zinnen zijn een samenvatting en komen niet uit de echte documenten. De kern van de demo is dat je van een element op het scherm terug kunt naar de beslissing en het document waar het uit voortkwam (constitution, principe III). Zonder de echte documenten is dat spoor onvolledig.

**Independent Test**: Selecteer een element, open de tab van een fase en vergelijk de getoonde tekst met het bestand in `specs/<feature>/`. De inhoud moet volledig en ongewijzigd overeenkomen.

**Acceptance Scenarios**:

1. **Given** de demo is geopend en een element is geselecteerd, **When** de bezoeker naar het rechterpaneel kijkt, **Then** ziet hij een rij tabs, één per workflowfase, in de volgorde van de constitution: specify, clarify, plan, tasks, analyze, implement.
2. **Given** de bezoeker kiest de tab "specify", **When** de tab opent, **Then** ziet hij de volledige inhoud van `spec.md` van de feature waar het geselecteerde element bij hoort.
3. **Given** de bezoeker kiest de tab "plan", **When** de tab opent, **Then** ziet hij de volledige inhoud van `plan.md`, en kan hij binnen de tab ook de ondersteunende documenten van die fase openen (`research.md`, `data-model.md`, `quickstart.md`, de bestanden in `contracts/`), voor zover ze bestaan.
4. **Given** de bezoeker kiest de tab "tasks", **When** de tab opent, **Then** ziet hij de volledige inhoud van `tasks.md`, inclusief de afvinkstatus van elke taak.
5. **Given** de bezoeker kiest een fase zonder eigen document (clarify, analyze, implement), **When** de tab opent, **Then** ziet hij de vastlegging van die fase: bij clarify de volledige sectie "Clarifications" uit `spec.md`, bij analyze en implement de volledige sectie van die fase uit `prompts.md`, met daarbij het bronbestand vermeld.
6. **Given** een fasetab toont een document, **When** de bezoeker de inhoud leest, **Then** ziet hij koppen, lijsten, tabellen, codeblokken en vinkjes als opmaak, met dezelfde tekst als in het bestand.

---

### User Story 2 - Wisselen tussen gekoppelde features (Priority: P2)

Als bezoeker wil ik, wanneer een element bij meer dan één feature hoort, kunnen kiezen van welke feature ik de documenten lees, zodat ik zie hoe een element door opeenvolgende features is gevormd.

**Why this priority**: Veel elementen dragen sporen naar meerdere features, bijvoorbeeld het invoerveld naar 003 (vormgeving) en 005 (gedrag). Zonder keuze zou de bezoeker maar één kant van het verhaal zien.

**Independent Test**: Selecteer het taakinvoerveld (sporen naar 003 en 005), wissel van feature en controleer dat de tabs daarna de documenten van de gekozen feature tonen.

**Acceptance Scenarios**:

1. **Given** een element met sporen naar meerdere features, **When** het geselecteerd wordt, **Then** ziet de bezoeker welke features gekoppeld zijn, en is de eerste feature uit het spoor van het element standaard gekozen.
2. **Given** de bezoeker kiest een andere gekoppelde feature, **When** hij een fasetab opent, **Then** toont die tab het document van de gekozen feature.
3. **Given** de bezoeker heeft een fasetab open, **When** hij een ander element selecteert, **Then** blijft dezelfde fasetab open en wordt de inhoud vervangen door het document van de feature van het nieuwe element.

---

### User Story 3 - Lezen en navigeren met het toetsenbord (Priority: P2)

Als bezoeker die het toetsenbord of een schermlezer gebruikt, wil ik de tabs en de documentinhoud volledig kunnen bedienen en lezen, zodat het uitgebreide paneel even toegankelijk is als de rest van de demo.

**Why this priority**: De constitution (principe IV) eist volledige toetsenbordbediening en WCAG 2.1 AA. Een tabcomponent en lange scrollbare documenten zijn bekende bronnen van toegankelijkheidsfouten.

**Independent Test**: Bedien het paneel alleen met het toetsenbord: tabs wisselen, documentinhoud scrollen en terug naar de takenlijst, en laat de geautomatiseerde toegankelijkheidscontrole draaien.

**Acceptance Scenarios**:

1. **Given** de focus staat op de tabrij, **When** de bezoeker de pijltjestoetsen gebruikt, **Then** verplaatst de focus zich naar de vorige of volgende tab, en Enter of Spatie (of automatische activatie) toont die tab.
2. **Given** een document is langer dan het paneel, **When** de bezoeker met Tab naar de inhoud gaat, **Then** kan hij het document met het toetsenbord scrollen.
3. **Given** een schermlezer, **When** de bezoeker een tab kiest, **Then** wordt de naam van de fase en de actieve status voorgelezen.

---

### Edge Cases

- **Document ontbreekt**: feature 002 heeft alleen `spec.md` en `prompts.md`. Een tab voor een fase waarvan het document niet bestaat, toont een duidelijke melding ("Deze fase is voor feature 002 nog niet uitgevoerd") in plaats van een lege tab of een foutmelding.
- **Document kan niet geladen worden**: als een document niet beschikbaar is (bijvoorbeeld wanneer de demo als los bestand is geopend), toont de tab een melding met het pad van het bestand in de repository, en blijft de rest van de demo werken.
- **Zeer lange documenten**: `tasks.md` en `spec.md` kunnen honderden regels lang zijn. Het paneel blijft bruikbaar: de inhoud scrollt binnen de tab, de rest van de pagina verschuift niet.
- **Onbekende feature in een spoor**: een element met een spoor naar een feature zonder map in `specs/` toont een melding in plaats van een fout.
- **Onveilige inhoud**: de documenten bevatten codevoorbeelden en HTML-achtige tekst (zoals `data-spec="001:FR-002"`). Die tekst wordt als tekst getoond en nooit als opmaak of script uitgevoerd (004 FR-007).
- **Smalle schermen**: op een smal scherm passen zes tabs niet naast elkaar; de tabs blijven bereikbaar zonder dat de pagina horizontaal scrollt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Het rechterpaneel MOET een tab per workflowfase bieden, in de volgorde specify, clarify, plan, tasks, analyze, implement.
- **FR-002**: De tabs MOETEN de documenten tonen van de feature waar het geselecteerde element bij hoort, bepaald door de feature-nummers in het `data-spec`-spoor van dat element.
- **FR-003**: Een fasetab MOET de inhoud van het bijbehorende document volledig en ongewijzigd tonen: specify toont `spec.md`, plan toont `plan.md`, tasks toont `tasks.md`. Er wordt niets ingekort, samengevat of herschreven.
- **FR-004**: De plan-tab MOET de ondersteunende documenten van die fase bereikbaar maken (`research.md`, `data-model.md`, `quickstart.md` en de bestanden in `contracts/`), voor zover die voor de feature bestaan.
- **FR-005**: De tabs voor fasen zonder eigen bestand MOETEN de volledige, ongewijzigde sectie van die fase tonen: clarify de sectie "Clarifications" uit `spec.md`, analyze en implement de sectie "Phase: analyze" respectievelijk "Phase: implement" uit `prompts.md`. Het bronbestand MOET bij de inhoud vermeld staan. Ontbreekt de sectie, dan geldt FR-009.
- **FR-006**: Documenten MOETEN opgemaakt worden getoond: koppen, opsommingen en genummerde lijsten, tabellen, codeblokken en inline code, nadruk, links en afvinkbare taken (afgevinkt of niet) zijn als zodanig herkenbaar. De tekst zelf blijft gelijk aan het bestand.
- **FR-007**: Bij een element met sporen naar meerdere features MOET de bezoeker kunnen kiezen welke feature hij bekijkt; standaard is de eerste feature uit het spoor gekozen.
- **FR-008**: Bij het selecteren van een ander element MOET de gekozen fasetab open blijven en de inhoud bijwerken naar de feature van het nieuwe element.
- **FR-009**: Een tab waarvan het document niet bestaat of niet geladen kan worden, MOET een begrijpelijke melding tonen met de fase, de feature en het verwachte pad in de repository.
- **FR-010**: Alleen de markdown-opmaak uit FR-006 wordt weergegeven. HTML of script die in een document staat, MOET als zichtbare tekst worden getoond en mag nooit door de pagina worden uitgevoerd (004 FR-007).
- **FR-011**: De tabs MOETEN volledig met het toetsenbord bedienbaar zijn, de actieve tab MOET voor hulptechnologie herkenbaar zijn, en een scrollbare documentinhoud MOET met het toetsenbord bereikbaar zijn (WCAG 2.1 AA).
- **FR-012**: De bestaande inhoud van het paneel (titel, feature- en elementsamenvatting, beschrijving, trace-object en faselijst) en de met de hand geschreven indeling `spec-01` tot en met `spec-10` MOETEN verdwijnen; het paneel bestaat uit de feature-keuze (FR-007) en de fasetabs. Het paneel MOET wel tonen welk element geselecteerd is.
- **FR-013**: De tabs en hun inhoud MOETEN een `data-spec`-spoor naar deze feature dragen (`007:FR-xxx`), zodat de trace-controle uit 004 ze herkent.
- **FR-014**: Het laden van documenten MAG GEEN netwerkverzoeken buiten de eigen herkomst van de demo doen en GEEN gebruikersdata versturen (constitution, principe V).

### Key Entities

- **Fase**: een stap uit de workflow van de constitution (specify, clarify, plan, tasks, analyze, implement), met een naam en nul of meer documenten.
- **Featuredocument**: een markdownbestand in `specs/<feature>/`, met een feature-nummer, een pad en een fase waar het bij hoort.
- **Gekoppelde feature**: een feature-nummer uit het `data-spec`-spoor van het geselecteerde element.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Voor 100% van de bestaande documenten en secties die bij een fasetab horen (features 001 tot en met 006) is de getoonde tekst, zonder de markdown-opmaaktekens, identiek aan het bestand in de repository.
- **SC-002**: Een bezoeker kan vanaf elk element op het scherm in hooguit 2 handelingen (element kiezen, tab kiezen) het document van een fase lezen.
- **SC-003**: Na het kiezen van een tab staat de inhoud binnen 1 seconde in beeld bij lokaal draaien.
- **SC-004**: De geautomatiseerde toegankelijkheidscontrole uit 004 meldt 0 overtredingen voor het paneel, met elke tab geopend.
- **SC-005**: Alle fasetabs zijn met alleen het toetsenbord te bereiken en te openen.
- **SC-006**: Een document dat ontbreekt of niet laadt, leidt in 100% van de gevallen tot een melding in de tab en nooit tot een fout die de rest van de demo stopt.

## Assumptions

- **Bron van de documenten**: de tabs lezen de documenten zoals ze in `specs/` van dezelfde versie van de repository staan. Er wordt geen aparte kopie bijgehouden, zodat de tabs nooit achterlopen op de echte bestanden.
- **Feature-keuze**: de feature volgt uit het `data-spec`-spoor van het geselecteerde element (bijvoorbeeld `003:FR-006 005:FR-004` geeft 003 en 005). De bestaande, met de hand geschreven indeling in `spec-01` tot en met `spec-10` is daarvoor niet nodig.
- **Checklists en prompts**: `checklists/` krijgt geen eigen tab. Uit `prompts.md` worden alleen de secties van analyze en implement getoond (FR-005).
- **Vervallen sporen**: het trace-object en de faselijst dragen nu sporen naar 003 FR-009 en 004 FR-009. Het plan moet bepalen hoe die requirements na het verwijderen gedekt blijven of bewust worden vervangen door deze feature, en welke bestaande tests daardoor wijzigen.
- **Opmaak zonder nieuwe afhankelijkheid**: als het weergeven van markdown een nieuwe runtime-dependency vraagt, moet het plan dat volgens principe I onderbouwen.
- **Taal**: de documenten worden getoond in de taal waarin ze geschreven zijn (Nederlands of Engels); er wordt niets vertaald.
- **Alleen lezen**: de bezoeker kan de documenten bekijken, niet bewerken.
- **Draaien via een server**: de demo wordt, zoals in de README beschreven, via een lokale webserver geopend; openen als los bestand valt onder de edge case "Document kan niet geladen worden".
- **Kwaliteitspoort**: de wijziging gaat via een pull request langs de drie controles uit 004.
