// T014 (007) FEATURE_SPECS and buildTrace are gone: the spec panel reads the real documents (docs.js)

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
