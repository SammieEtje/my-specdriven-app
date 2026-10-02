# Tasks

**Input**: Design documents from `/specs/001-spec-driven-todo-demo/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks because the task model and trace logic are core to the feature, and the project already includes explicit logic validation work.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Browser app scaffold and shared feature plumbing

- [X] T001 Create the initial demo structure and static page shell in `index.html`, `styles.css`, and `app.js`
- [X] T002 [P] Add the shared task trace model and feature spec registry in `logic.js`
- [X] T003 [P] Add baseline Node validation coverage for the trace logic in `logic.test.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data model and task rendering infrastructure that all stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define the task data model and selected-task state in `app.js` and `logic.js`
- [X] T005 [P] Render the task list from the task state and keep the selected task state in sync with the UI in `app.js`
- [X] T006 [P] Implement the shared task card styling, tag pill, and button layout in `styles.css`
- [X] T007 Configure the browser persistence pattern for task state using `localStorage` in `app.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - To-do overzicht bekijken (Priority: P1) 🎯 MVP

**Goal**: Show a clear, working list of tasks with status metadata and a stable task card layout.

**Independent Test**: A user can load the app and verify that multiple tasks are visible with their titles, owners, and tags.

### Implementation for User Story 1

- [X] T008 [P] [US1] Render the initial task list with title, owner, and tag values in `app.js`
- [X] T009 [US1] Add the completion-state checkbox behavior and visual styling in `app.js` and `styles.css`
- [X] T010 [US1] Ensure the task card layout remains readable and accessible with clear labels and hierarchy in `index.html` and `styles.css`
- [X] T011 [US1] Add a fallback empty-state presentation when the task list is empty in `app.js` and `index.html`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Een taak openen en details bewerken (Priority: P1)

**Goal**: Let the user open a task modal and edit its title, description, tag, and owner.

**Independent Test**: A user can click Open, edit all four fields in the modal, close and reopen it, and verify the task card reflects the edits.

### Implementation for User Story 2

- [X] T012 [P] [US2] Add the selected-task modal shell in `index.html`
- [X] T013 [P] [US2] Bind the task title, description, tag, and owner inputs to the selected task model in `app.js`
- [X] T014 [US2] Write the task updates back to the task object and refresh the list and detail form in `app.js`
- [X] T015 [US2] Style the detail panel and form layout for readability and keyboard-friendly editing in `styles.css`
- [X] T016 [US2] Add task selection highlighting so the active task is visually clear in the list and detail panel in `app.js` and `styles.css`

**Checkpoint**: At this point, User Story 2 should work independently and satisfy the task detail requirement.

### Follow-up: Editable Task Modal

- [X] T033 [US2] Add a regression test for updating a selected task's title, description, tag, and owner in `logic.test.js`
- [X] T034 [US2] Add a task update helper that applies validated field changes to a selected task in `logic.js`
- [X] T035 [US2] Replace read-only modal content with labeled editable task fields and native dialog behavior in `index.html` and `app.js`
- [X] T036 [US2] Keep task cards synchronized while editing and restore focus after close or Escape in `app.js` and `styles.css`
- [X] T037 [US2] Verify editing, close, reopen, Escape, and focus behavior in `quickstart.md`

---

## Phase 5: User Story 3 - Spec-trace bekijken per element (Priority: P1)

**Goal**: Display the Spec Kit decision trace for any selected UI element in a dynamic object view.

**Independent Test**: A user can click an element and see its feature identity, source, and the ordered phase decisions.

### Implementation for User Story 3

- [X] T017 [P] [US3] Extend the feature spec map with a task-detail feature and element-to-feature resolution in `logic.js`
- [X] T018 [US3] Build the trace object and ordered phase list for the selected element in `app.js`
- [X] T019 [US3] Render the feature metadata, source description, and phase list in the right-hand trace panel in `app.js`
- [X] T020 [US3] Add UI highlight behavior for the clicked element and show the trace panel state in `app.js` and `styles.css`
- [X] T021 [P] [US3] Validate the trace model and feature mapping with logic tests in `logic.test.js`

**Checkpoint**: At this point, User Story 3 should be independently testable and demonstrate the core Spec Kit concept.

---

## Phase 6: User Story 4 - Filters gebruiken (Priority: P2)

**Goal**: Allow users to switch between all, active, and completed tasks.

**Independent Test**: A user can filter the visible task list by state without changing the underlying task data.

### Implementation for User Story 4

- [X] T022 [P] [US4] Add filter buttons for All, Active, and Completed in `index.html`
- [X] T023 [US4] Implement filter logic that derives the visible task list from the current status selection in `app.js`
- [X] T024 [US4] Style the active filter state and ensure it remains keyboard-accessible in `styles.css`
- [X] T025 [P] [US4] Add a regression check for filter logic in `logic.test.js`

**Checkpoint**: At this point, User Story 4 should work independently and support realistic task browsing.

---

## Phase 7: User Story 5 - Lege state afhandelen (Priority: P3)

**Goal**: Present a clear empty-state message when no tasks match the current view.

**Independent Test**: A user sees a helpful empty-state message instead of a blank list when no tasks remain.

### Implementation for User Story 5

- [X] T026 [P] [US5] Add the empty-state section markup in `index.html`
- [X] T027 [US5] Show or hide the empty-state panel based on the current filtered list in `app.js`
- [X] T028 [US5] Style the empty-state message so it remains readable and consistent with the rest of the demo in `styles.css`

**Checkpoint**: At this point, User Story 5 is complete and the demo remains polished in empty-view states.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, accessibility pass, and demo consistency

- [X] T029 [P] Review task card spacing, contrast, and focus states across `styles.css`
- [X] T030 [P] Verify the app works with keyboard navigation and labels on the task detail form in `index.html` and `styles.css`
- [X] T031 [P] Validate local persistence and reload behavior through the quickstart flow in `quickstart.md` and `app.js`
- [X] T032 Run the end-to-end demo review and confirm the selected element trace remains consistent with the spec-driven flow in `app.js` and `logic.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories.
- **User Story 2 (P1)**: Can start after Foundational - independent from filtering or empty states.
- **User Story 3 (P1)**: Can start after Foundational and depends on the feature map and selected element model.
- **User Story 4 (P2)**: Can start after User Story 1 and the shared data model are complete.
- **User Story 5 (P3)**: Can start as soon as the list rendering and empty-state logic are ready.

### Within Each User Story

- Models before services/logic
- Shared task state before UI rendering and detail interactions
- Trace logic after the feature map structure is in place
- Story complete before moving to the next priority area

### Parallel Opportunities

- Setup tasks T001-T003 can run in parallel.
- Foundational tasks T004-T007 can run in parallel where files are independent.
- User Story 1 tasks T008-T011 can be implemented in parallel after the foundation is ready.
- User Story 2 tasks T012-T016 can be implemented in parallel once the task model and form shell exist.
- User Story 3 tasks T017-T021 can be handled in parallel with the trace logic and test validation.
- User Story 4 tasks T022-T025 can run alongside the empty-state polish once the shared list logic is ready.

---

## Parallel Example: User Story 2

```bash
# Launch task modal structure and state wiring together
Task: "Add the selected-task modal shell in index.html"
Task: "Bind the task title, description, tag, and owner inputs to the selected task model in app.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Complete Phase 5: User Story 3
5. **STOP and VALIDATE**: Confirm the core board and trace demo work in isolation

### Incremental Delivery

1. Complete Setup + Foundational → stable base app ready
2. Add User Story 1 → working task list demo
3. Add User Story 2 → editable task details
4. Add User Story 3 → live trace evidence
5. Add User Story 4 and User Story 5 → complete demo polish and browsing behaviors
6. Final polish and accessibility pass

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 + User Story 3
   - Developer C: User Story 4 + User Story 5
3. Final polish and regression review complete after all stories finish.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] labels map each task to a specific user story for traceability.
- Each user story should be independently completable and testable.
- The logic tests already cover the dynamic Spec Kit trace object and feature map and should remain the minimum automated safety net.
- Keep commit boundaries aligned with the story phases to support the demo narrative.
- Avoid broad cross-story dependencies that would reduce the independent value of each story.
