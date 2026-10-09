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
      clarify:
        'The team agrees that browser persistence is enough for this demo while keeping the implementation lean.',
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
      specify:
        'The product requirement is that a task should have enough context to be understood without leaving the board.',
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
      tasks:
        'Acceptance criteria cover editing title, description, tag, and owner while keeping the selected task in sync.',
      implement: 'The modal inputs write changes to the selected task and refresh its task card immediately.'
    }
  },
  // T020
  {
    id: 'spec-10',
    title: 'Polderworks design system',
    description:
      'The demo uses only the visual foundations of the central design system: colour tokens, IBM Plex, square geometry and its component patterns.',
    source: 'specify: “Adopt the central Polderworks design system in the todo app UI.”',
    elementIds: ['app-header'],
    phaseMap: {
      specify:
        'The demo should look like part of the house instead of a loose proof of concept, without changing any behaviour.',
      clarify: 'Only the visual foundations are adopted: no logo and no endorsement line in the interface.',
      plan: 'Design tokens are imported straight from the design system, components become plain CSS classes and IBM Plex is self-hosted for offline use.',
      tasks:
        'Static tests check tokens, fonts, geometry, contrast and preserved hooks before each part of the restyle is built.',
      implement:
        'The stylesheet uses only design-system tokens, and the markup gained pattern classes and 003 trace tokens.'
    }
  }
];

export function buildTrace(selectedElement, spec = null) {
  const selectedSpec =
    spec ?? FEATURE_SPECS.find((entry) => entry.elementIds.includes(selectedElement)) ?? FEATURE_SPECS[0];

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

// T005 Create a task from a typed title (005:FR-002, FR-004). Returns null for an empty title.
export function createTask(tasks, title) {
  const trimmed = String(title ?? '').trim();
  if (trimmed === '') return null;
  const highest = tasks.reduce((max, task) => {
    const match = /^task-(\d+)$/.exec(task.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return { id: `task-${highest + 1}`, title: trimmed, description: '', tag: '', owner: '', completed: false };
}

// T013 Tasks visible under a filter (005:FR-005). Unknown filters show everything.
export function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter((task) => !task.completed);
  if (filter === 'completed') return tasks.filter((task) => task.completed);
  return tasks;
}

// T019 Empty-state copy (005:FR-007). With no tasks at all the generic text wins, whatever the filter.
const EMPTY_STATE = {
  all: { heading: 'No tasks yet', text: 'Start by adding the first item to your spec-driven workflow.' },
  active: { heading: 'No active tasks', text: 'Everything is done. Add a new task to keep going.' },
  completed: { heading: 'No completed tasks', text: 'Check off a task to see it here.' }
};

export function emptyStateText(filter, totalCount) {
  if (totalCount === 0) return { ...EMPTY_STATE.all };
  return { ...(EMPTY_STATE[filter] ?? EMPTY_STATE.all) };
}

// T024 Saved demo state (005:FR-008, FR-009, FR-011). Format: { version: 1, tasks: [...] }
export const STORAGE_KEY = 'spec-driven-todo-demo';
const STORAGE_VERSION = 1;

export function serializeState(tasks) {
  return JSON.stringify({ version: STORAGE_VERSION, tasks });
}

function copyTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

export function parseState(raw, fallbackTasks) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return copyTasks(fallbackTasks);
  }

  const valid =
    data !== null &&
    typeof data === 'object' &&
    data.version === STORAGE_VERSION &&
    Array.isArray(data.tasks) &&
    data.tasks.every(
      (task) =>
        task !== null &&
        typeof task === 'object' &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.completed === 'boolean'
    );
  if (!valid) return copyTasks(fallbackTasks);

  return data.tasks.map((task) => {
    const text = (field) => (typeof task[field] === 'string' ? task[field] : '');
    return {
      id: task.id,
      title: task.title.trim() === '' ? 'Untitled task' : task.title,
      description: text('description'),
      tag: text('tag'),
      owner: text('owner'),
      completed: task.completed
    };
  });
}

// T003 (008) A tag only counts when it has text after trimming (FR-001)
export function hasTag(task) {
  return typeof task?.tag === 'string' && task.tag.trim() !== '';
}

// T003 (008) The line under the title: only the parts that exist, joined by " · " (FR-004)
export function metaLine(task) {
  const text = (value) => (typeof value === 'string' ? value.trim() : '');
  return [text(task.owner), text(task.tag), task.completed ? 'Completed' : ''].filter(Boolean).join(' · ');
}
