export const FEATURE_SPECS = [
  {
    id: 'spec-01',
    title: 'Add task CTA',
    description: 'A user can create a new task from the main input field.',
    source: 'specify: “Users must be able to add a task without leaving the screen.”',
    elementIds: ['add-task-button', 'task-input'],
    phaseMap: {
      specify: 'The user need is clear: a quick and obvious way to capture a task in the app.',
      clarify: 'The demo confirms the action happens from the main dashboard without a separate workflow.',
      plan: 'The simplest solution is a single input and a primary button, with no extra navigation.',
      tasks: 'Acceptance criteria cover adding a task, showing it immediately, and preventing blank entries.',
      implement: 'The button dispatches a task creation action and appends it to the in-memory task list.'
    }
  },
  {
    id: 'spec-02',
    title: 'Task card rendering',
    description: 'Each task is displayed as a visible list item with a title and status.',
    source: 'clarify: “Tasks must be visible as independent cards with a clear state.”',
    elementIds: ['task-card-1', 'task-card-2', 'task-list'],
    phaseMap: {
      specify: 'The product requirement is that tasks appear as separate, scannable records.',
      clarify: 'The team asks whether each item needs metadata like status, date, and completion state.',
      plan: 'The design uses a compact card with title and badge so the item feels readable and consistent.',
      tasks: 'The task card is treated as a unit of work with visible completion state and label semantics.',
      implement: 'The app maps each task object to a card element and renders the relevant fields in the list.'
    }
  },
  {
    id: 'spec-03',
    title: 'Complete task toggle',
    description: 'Users can mark tasks as done or active from the task card.',
    source: 'plan: “Completion state should be visible and reversible.”',
    elementIds: ['task-toggle-1', 'task-toggle-2'],
    phaseMap: {
      specify: 'The user needs a clear way to reflect progress and completion.',
      clarify: 'The interaction must be simple, reversible, and instantly visible in the list.',
      plan: 'A checkbox or toggle is chosen because it communicates the state with minimal cognitive load.',
      tasks: 'The task story includes toggling completion and updating appearance without reloading the page.',
      implement: 'The toggle mutates the task object state and re-renders the card with the completed styling.'
    }
  },
  {
    id: 'spec-04',
    title: 'Filter controls',
    description: 'Users can switch between all, active, and completed views.',
    source: 'tasks: “Filtering is required to keep the list manageable for larger task sets.”',
    elementIds: ['filter-all', 'filter-active', 'filter-completed'],
    phaseMap: {
      specify: 'The experience must support multiple task views without changing the underlying data model.',
      clarify: 'The team confirms the filters are for quick browsing rather than deep task management.',
      plan: 'A lightweight filter bar will deliver immediate behavior with a small UI footprint.',
      tasks: 'The filter story includes state changes and corresponding task visibility rules.',
      implement: 'The app calculates a filtered list based on the selected status and updates the view reactively.'
    }
  },
  {
    id: 'spec-05',
    title: 'Due date field',
    description: 'Tasks can include a due date so prioritization is visible at a glance.',
    source: 'specify: “Users should be able to plan tasks by date.”',
    elementIds: ['due-date'],
    phaseMap: {
      specify: 'The product need is to help users distinguish urgent tasks from optional work.',
      clarify: 'The date must be visible and optional so the entry flow remains fast.',
      plan: 'A lightweight date input is enough for this demo and avoids unnecessary complexity.',
      tasks: 'Acceptance criteria require the value to display in the card and be preserved in task state.',
      implement: 'The form captures the due date and stores it with the task object for rendering.'
    }
  },
  {
    id: 'spec-06',
    title: 'Empty state',
    description: 'When no tasks remain, the app shows a friendly empty state.',
    source: 'clarify: “The interface should remain reassuring when the list is empty.”',
    elementIds: ['empty-state'],
    phaseMap: {
      specify: 'The experience should not feel broken when there are no tasks to show.',
      clarify: 'Users need guidance that invites them to add their first task rather than encountering a blank block.',
      plan: 'A short message plus a call to action keeps the empty state helpful and intentional.',
      tasks: 'The empty state must appear whenever the current list is empty and the filter has no matches.',
      implement: 'The renderer checks the task array and swaps the list for the empty-state message.'
    }
  },
  {
    id: 'spec-07',
    title: 'Local persistence',
    description: 'The demo keeps tasks stored so the list survives refreshes.',
    source: 'plan: “A demo should behave like a realistic app and preserve user actions.”',
    elementIds: ['save-state'],
    phaseMap: {
      specify: 'The app should feel stable enough for a small real-world workflow, not only a mock.',
      clarify: 'The team agrees that browser persistence is enough for this demo while keeping the implementation lean.',
      plan: 'A localStorage adapter is a simple and reliable choice for storing the task data.',
      tasks: 'The persistence story covers save/load behavior and graceful handling of missing data.',
      implement: 'The app reads and writes the task list to localStorage whenever the model changes.'
    }
  },
  {
    id: 'spec-08',
    title: 'Open task detail',
    description: 'A user can open a task to inspect and edit the related details.',
    source: 'clarify: “Opening a task should reveal its metadata in one focused view.”',
    elementIds: ['task-open', 'task-modal', 'task-modal-close'],
    phaseMap: {
      specify: 'The product requirement is that a task should have enough context to be understood without leaving the board.',
      clarify: 'The team confirms the detail view should open from the task list without a separate page or redirect.',
        plan: 'A browser-native modal keeps task editing focused and provides standard dialog behavior.',
        tasks: 'The task story includes opening the selected item and editing its fields in the modal.',
        implement: 'The app binds the modal inputs to the selected task and updates its list card immediately.'
    }
  },
  {
    id: 'spec-09',
    title: 'Task detail fields',
    description: 'Title, description, tag, and owner are all captured for a task detail record.',
    source: 'specify: “The task modal should allow users to edit its title and metadata in one place.”',
    elementIds: ['task-title-field', 'task-description-field', 'task-tag-field', 'task-owner-field'],
    phaseMap: {
      specify: 'The user needs extra context beside the title so tasks can be grouped and assigned without ambiguity.',
      clarify: 'The metadata fields must be optional but useful so the workflow stays quick for demo scenarios.',
      plan: 'The modal uses labeled fields bound directly to the selected task data model.',
      tasks: 'Acceptance criteria cover editing title, description, tag, and owner while keeping the selected task in sync.',
      implement: 'The modal inputs write changes to the selected task and refresh its task card immediately.'
    }
  }
];

export function buildTrace(selectedElement, spec = null) {
  const selectedSpec = spec ?? FEATURE_SPECS.find((entry) => entry.elementIds.includes(selectedElement)) ?? FEATURE_SPECS[0];

  return {
    selectedElement,
    featureId: selectedSpec.id,
    title: selectedSpec.title,
    description: selectedSpec.description,
    source: selectedSpec.source,
    phases: Object.entries(selectedSpec.phaseMap).map(([phase, decision]) => ({
      phase,
      decision
    }))
  };
}

export function updateTask(tasks, taskId, field, value) {
  const editableFields = ['title', 'description', 'tag', 'owner'];
  const task = tasks.find((entry) => entry.id === taskId);

  if (!task || !editableFields.includes(field) || typeof value !== 'string') {
    return null;
  }

  task[field] = value;
  return task;
}
