# Feature Specification: Prioriteitstaken Volgorde

**Feature Branch**: `002-priority-task-order`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Voeg voor de demo twee extra taken toe. Ik wil de taken in volgorde van prioriteit kunnen slepen in staat. Deze volgorde moet persistent zijn en dus bewaard blijven bij volgende sessies."

## Clarifications

### Session 2026-10-02

- Q: Wat moet er met de volledige prioriteitsvolgorde gebeuren als je taken herschikt terwijl een statusfilter actief is? → A: Herschikken kan alleen in `All`; bij `Active` of `Completed` zijn sleep- en toetsenbordacties voor volgorde uitgeschakeld.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Extra demotaken bekijken (Priority: P1)

Als demo-gebruiker wil ik twee extra voorbeeldtaken in het overzicht zien, zodat de prioriteitsfunctie met meerdere taken te demonstreren is.

**Why this priority**: De extra taken maken de lijst geschikt om een zinvolle prioriteitsvolgorde te tonen.

**Independent Test**: Start de demo met de standaardtaken en controleer dat er twee nieuwe voorbeeldtaken zichtbaar zijn naast de bestaande voorbeelden.

**Acceptance Scenarios**:

1. **Given** de demo start met de standaardlijst, **When** de gebruiker het takenoverzicht bekijkt, **Then** zijn er twee extra voorbeeldtaken aan de bestaande standaardtaken toegevoegd.
2. **Given** de extra voorbeeldtaken zijn zichtbaar, **When** de gebruiker de lijst bekijkt, **Then** heeft elke taak een eigen titel en behoudt deze de bestaande taakgegevens en status.

---

### User Story 2 - Prioriteit van taken wijzigen (Priority: P1)

Als demo-gebruiker wil ik taken naar een andere positie slepen om hun prioriteit aan te passen, zodat de volgorde overeenkomt met wat eerst moet gebeuren.

**Why this priority**: De volgorde is de zichtbare uitkomst van prioriteren en vormt de kern van deze wijziging.

**Independent Test**: Sleep een taak boven of onder een andere taak en controleer dat de lijst direct in de nieuwe prioriteitsvolgorde wordt weergegeven.

**Acceptance Scenarios**:

1. **Given** er staan meerdere taken in het overzicht, **When** de gebruiker een taak naar een andere positie sleept, **Then** verschijnt de taak op die positie en wordt de volledige lijstvolgorde bijgewerkt.
2. **Given** een taak wordt verplaatst, **When** de gebruiker de taakgegevens en status bekijkt, **Then** blijven titel, toelichting, tag, eigenaar en voltooid-status bij de juiste taak.
3. **Given** de gebruiker kan niet met een aanwijzer slepen, **When** hij de taak met toetsenbordbedienbare prioriteitsacties verplaatst, **Then** wordt dezelfde volgordewijziging toegepast en aangekondigd.
4. **Given** de gebruiker heeft `Active` of `Completed` geselecteerd, **When** hij het takenoverzicht bekijkt, **Then** zijn sleep- en toetsenbordacties voor herschikken uitgeschakeld.

---

### User Story 3 - Prioriteitsvolgorde behouden (Priority: P1)

Als demo-gebruiker wil ik dat mijn prioriteitsvolgorde bij een later bezoek behouden blijft, zodat ik de lijst niet telkens opnieuw hoef in te delen.

**Why this priority**: Een volgorde die na het verlaten van de demo verdwijnt, maakt prioriteren niet bruikbaar over meerdere sessies.

**Independent Test**: Verander de volgorde, herlaad de demo of open deze opnieuw in hetzelfde browserprofiel en controleer dat de exacte volgorde wordt hersteld.

**Acceptance Scenarios**:

1. **Given** de gebruiker heeft taken geordend, **When** hij de demo later opnieuw opent in hetzelfde browserprofiel, **Then** wordt exact dezelfde prioriteitsvolgorde getoond.
2. **Given** er is nog geen opgeslagen prioriteitsvolgorde of die kan niet worden gelezen, **When** de demo start, **Then** toont de app de geldige standaardvolgorde en blijft bruikbaar.
3. **Given** de volgorde wordt opgeslagen, **When** taken opnieuw worden geordend, **Then** wordt de nieuwste volgorde gebruikt bij het volgende bezoek.

### Edge Cases

- Wat gebeurt er wanneer een taak naar zijn huidige positie wordt gesleept?
- Hoe blijft de lijst bruikbaar wanneer een opgeslagen volgorde ontbreekt, ongeldig is of verwijst naar taken die niet meer bestaan?
- Hoe worden toetsenbordacties aangekondigd zodat de gebruiker de nieuwe positie kan vaststellen?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: De demo MUST twee extra voorbeeldtaken aan de bestaande standaardtaken toevoegen.
- **FR-002**: De app MUST voor elke taak een duidelijke positie in de prioriteitsvolgorde tonen.
- **FR-003**: De gebruiker MUST in de weergave `All` een taak met slepen naar een andere prioriteitspositie kunnen verplaatsen.
- **FR-004**: De app MUST na een verplaatsing de nieuwe volgorde direct tonen zonder taakgegevens of status aan een andere taak toe te wijzen.
- **FR-005**: De gebruiker MUST in de weergave `All` de prioriteitsvolgorde volledig met het toetsenbord kunnen wijzigen en de nieuwe positie kunnen waarnemen; in gefilterde weergaven zijn deze acties uitgeschakeld.
- **FR-006**: De app MUST de volledige prioriteitsvolgorde lokaal bewaren en deze bij een later bezoek in hetzelfde browserprofiel herstellen.
- **FR-007**: Als de opgeslagen volgorde ontbreekt of ongeldig is, MUST de app een geldige standaardvolgorde tonen zonder de takenlijst onbruikbaar te maken.
- **FR-008**: De app MUST gebruikersdata alleen op het apparaat van de gebruiker bewaren en niet delen met externe diensten.

### Key Entities *(include if feature involves data)*

- **Taak**: Een taak met een stabiele identiteit, titel, toelichting, tag, eigenaar en voltooid-status.
- **Prioriteitsvolgorde**: De geordende reeks taakidentiteiten die bepaalt welke taak eerder in de lijst verschijnt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: De standaarddemo toont precies twee extra voorbeeldtaken naast de al bestaande standaardtaken.
- **SC-002**: In `All` kan een gebruiker een taak met slepen of toetsenbordbediening verplaatsen en de nieuwe positie direct terugzien; in `Active` en `Completed` zijn deze acties uitgeschakeld.
- **SC-003**: In 100% van de heropeningscontroles in hetzelfde browserprofiel wordt de laatst opgeslagen taakvolgorde hersteld.
- **SC-004**: Het verplaatsen van een taak verandert geen titel, toelichting, tag, eigenaar of voltooid-status van de betrokken taken.
- **SC-005**: Een ontbrekende of ongeldige opgeslagen volgorde verhindert niet dat de standaardtakenlijst wordt gebruikt.

## Assumptions

- De demo blijft een browserapp zonder backend en gebruikt dezelfde browseropslaggrens als de bestaande taakdemo.
- Een later bezoek betekent herladen of opnieuw openen in hetzelfde browserprofiel.
- De twee extra taken zijn voorbeeldtaken; specifieke titels zijn niet door de gebruiker vastgelegd.
- Toetsenbordbediening is vereist naast slepen om de bestaande toegankelijkheidsprincipes te volgen.
- Prioriteit wordt weergegeven door de positie in de takenlijst; aparte prioriteitslabels of numerieke scores vallen buiten scope.
