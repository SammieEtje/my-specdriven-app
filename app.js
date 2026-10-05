import {
  FEATURE_SPECS,
  buildTrace,
  updateTask,
  createTask,
  filterTasks,
  emptyStateText,
  STORAGE_KEY,
  serializeState,
  parseState
} from './logic.js';
import { html } from './html.js';

const titleEl = document.getElementById('trace-title');
const featureIdEl = document.getElementById('trace-feature-id');
const elementEl = document.getElementById('trace-element');
const descriptionEl = document.getElementById('trace-description');
const traceObjectEl = document.getElementById('trace-object');
const phaseListEl = document.getElementById('phase-list');
const taskListEl = document.getElementById('task-list');
const taskTitleField = document.getElementById('task-title-field');
const taskDescriptionField = document.getElementById('task-description-field');
const taskTagField = document.getElementById('task-tag-field');
const taskOwnerField = document.getElementById('task-owner-field');
const taskModalEl = document.getElementById('task-modal');
const taskModalTitleEl = document.getElementById('task-modal-title');
const composerEl = document.querySelector('form.composer');
const taskInputEl = document.getElementById('task-input');
const taskInputErrorEl = document.getElementById('task-input-error');
const appStatusEl = document.getElementById('app-status');
const emptyStateEl = document.getElementById('empty-state');
let statusTimer = null;

// T025 (005) The example tasks are only used when nothing valid is saved yet (FR-009)
const exampleTasks = [
  {
    id: 'task-1',
    title: 'Prepare launch recap',
    description: 'Summarize the sprint highlights, blockers, and the next communication steps.',
    tag: 'Marketing',
    owner: 'Ava',
    completed: false
  },
  {
    id: 'task-2',
    title: 'Share spec checklist',
    description: 'Send the final checklist to the product team and confirm all open questions are closed.',
    tag: 'Product',
    owner: 'Leo',
    completed: true
  }
];

// T025 (005) Storage can be blocked (private mode, policies); the demo then runs in memory
function readStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Not saved, but the demo keeps working (spec edge case "Opslag niet beschikbaar")
  }
}

const taskState = parseState(readStorage(), exampleTasks);

let selectedTaskId = taskState[0]?.id;
// T002 (005) One place that every change goes through; US2 filters and US4 saves here
let currentFilter = 'all';
let titleOnOpen = '';

function refresh() {
  renderTaskList();
  // T025 (005) Every change is saved immediately (FR-008)
  writeStorage(serializeState(taskState));
}

function renderPhaseList(trace) {
  phaseListEl.innerHTML = '';

  trace.phases.forEach((phase) => {
    // T038 The implement phase produced the on-screen element, so it gets the Callout left rule
    const item = document.createElement('li');
    item.className = phase.phase === 'implement' ? 'phase-item callout' : 'phase-item';
    // T017 Escape trace text before it becomes markup (004:FR-007)
    item.innerHTML = html`
      <strong class="phase-name">${phase.phase}</strong>
      <div class="phase-decision">${phase.decision}</div>
    `;
    phaseListEl.appendChild(item);
  });
}

function renderTrace(target) {
  const selectedSpec = FEATURE_SPECS.find((spec) => spec.elementIds.includes(target)) ?? FEATURE_SPECS[0];
  const trace = buildTrace(target, selectedSpec);

  const traceData = {
    selectedElement: trace.selectedElement,
    featureId: trace.featureId,
    title: trace.title,
    description: trace.description,
    source: trace.source,
    phases: trace.phases
  };

  titleEl.textContent = trace.title;
  featureIdEl.textContent = trace.featureId;
  elementEl.textContent = trace.selectedElement;
  descriptionEl.textContent = trace.description;
  traceObjectEl.textContent = JSON.stringify(traceData, null, 2);
  renderPhaseList(trace);

  document.querySelectorAll('.feature-target').forEach((element) => {
    const isSelected = element.dataset.target === target;
    // T007 The traced outline comes from .feature-target.active in styles.css (R5)
    element.classList.toggle('active', isSelected);
  });
}

function getSelectedTask() {
  return taskState.find((task) => task.id === selectedTaskId) ?? taskState[0];
}

function renderTaskModal() {
  const task = getSelectedTask();
  // T009 (005) Remember the title so a cleared title can be restored on close (FR-011)
  titleOnOpen = task.title;

  taskModalTitleEl.textContent = task.title;
  taskTitleField.value = task.title;
  taskDescriptionField.value = task.description;
  taskTagField.value = task.tag;
  taskOwnerField.value = task.owner;
  taskModalEl.showModal();
  taskTitleField.focus();
}

function closeTaskModal() {
  if (taskModalEl.open) taskModalEl.close();
}

function renderTaskList() {
  // T027 Open button uses the secondary Button pattern
  // T045 Task checkbox carries its 003:FR-006 trace token
  // T018 Completed class and status text, Tag pattern for the task tag
  // T017 Task fields are user-editable, so every row is escaped with html`` (004:FR-007, XSS fix)
  taskListEl.innerHTML = '';
  // T015 (005) Render only the tasks in the current filter
  filterTasks(taskState, currentFilter).forEach((task) => {
    const isSelected = task.id === selectedTaskId;
    taskListEl.insertAdjacentHTML(
      'beforeend',
      html`
        <li class="task-card ${isSelected ? 'selected' : ''} ${task.completed ? 'completed' : ''}" data-spec="003:FR-003">
          <label class="task-main">
            <input class="feature-target" data-target="task-toggle-${task.id}" data-spec="003:FR-006" type="checkbox" ${task.completed ? 'checked' : ''} />
            <span class="task-content">
              <span class="task-title">${task.title}</span>
              <span class="meta">${task.owner} · ${task.tag}${task.completed ? ' · Completed' : ''}</span>
            </span>
          </label>
          <div class="task-meta-actions">
            <span class="tag" data-spec="003:FR-003">${task.tag}</span>
            <button class="task-open-button feature-target btn btn-secondary ${isSelected ? 'selected' : ''}" data-target="task-open" data-task-id="${task.id}" data-spec="003:FR-005">Open</button>
          </div>
        </li>
      `
    );
  });

  // T020 (005) Show the empty state instead of an empty list, with text for the current filter (FR-007)
  const isEmpty = taskListEl.children.length === 0;
  taskListEl.hidden = isEmpty;
  emptyStateEl.hidden = !isEmpty;
  if (isEmpty) {
    const { heading, text } = emptyStateText(currentFilter, taskState.length);
    emptyStateEl.querySelector('h3').textContent = heading;
    emptyStateEl.querySelector('p').textContent = text;
  }
}

function openTask(taskId) {
  selectedTaskId = taskId;
  refresh();
  renderTaskModal();
  renderTrace('task-open');
}

function updateSelectedTask(field, value) {
  // T034
  if (updateTask(taskState, selectedTaskId, field, value)) {
    refresh();
    taskModalTitleEl.textContent = getSelectedTask().title || 'Task details';
  }
}

// T035
document.addEventListener('click', (event) => {
  const target = event.target.closest('.feature-target');
  if (!target) return;

  const dataTarget = target.dataset.target;

  if (dataTarget === 'task-open') {
    openTask(target.dataset.taskId || selectedTaskId);
    return;
  }

  if (dataTarget === 'task-modal-close') {
    closeTaskModal();
    return;
  }

  if (target === taskModalEl && event.target === taskModalEl) {
    closeTaskModal();
    return;
  }

  if (dataTarget && dataTarget.startsWith('task-toggle-')) {
    const task = taskState.find((item) => item.id === dataTarget.replace('task-toggle-', ''));
    if (task) {
      task.completed = !task.completed;
      refresh();
      renderTrace(dataTarget);
    }
    return;
  }

  // T030 Reflect the selected filter for assistive technology
  if (dataTarget && dataTarget.startsWith('filter-')) {
    document.querySelectorAll('.filter-btn').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === target));
    });
    // T015 (005) The filter now actually limits the list (FR-005)
    currentFilter = dataTarget.replace('filter-', '');
    refresh();
  }

  if (dataTarget === 'task-modal') {
    renderTrace(dataTarget);
    return;
  }

  // T026 (005) Persist saves explicitly and confirms; the trace still shows spec-07 below (FR-010)
  if (dataTarget === 'save-state') {
    writeStorage(serializeState(taskState));
    showStatus('Demo state saved');
  }

  renderTrace(dataTarget);
});

// T036
taskModalEl.addEventListener('close', () => {
  // T009 (005) A title cleared in the dialog falls back to the title it had when opened (FR-011)
  const task = getSelectedTask();
  if (task && task.title.trim() === '') {
    task.title = titleOnOpen;
    refresh();
  }

  const openButton = [...taskListEl.querySelectorAll('[data-target="task-open"]')].find(
    (button) => button.dataset.taskId === selectedTaskId
  );
  openButton?.focus();
});

taskModalEl.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeTaskModal();
  }
});

// T021 Non-native trace targets (the header) respond to Enter and Space, like a click
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target.closest('.feature-target[tabindex="0"]');
  if (!target || target !== event.target) return;

  event.preventDefault();
  renderTrace(target.dataset.target);
});

document.addEventListener('input', (event) => {
  const target = event.target.closest('.feature-target');
  if (!target) return;

  const dataTarget = target.dataset.target;
  if (!dataTarget) return;

  // T008 (005) Typing clears the add error
  if (dataTarget === 'task-input') clearInputError();

  if (dataTarget === 'task-title-field') {
    updateSelectedTask('title', target.value);
  }

  if (dataTarget === 'task-description-field') {
    updateSelectedTask('description', target.value);
  }

  if (dataTarget === 'task-tag-field') {
    updateSelectedTask('tag', target.value);
  }

  if (dataTarget === 'task-owner-field') {
    updateSelectedTask('owner', target.value);
  }

  renderTrace(dataTarget);
});

// T015 (005) Short, politely announced status message (role="status"), cleared after 4 seconds
function showStatus(text) {
  clearTimeout(statusTimer);
  appStatusEl.textContent = text;
  statusTimer = setTimeout(() => {
    appStatusEl.textContent = '';
  }, 4000);
}

// T008 (005) Add a task by click or Enter (FR-001 to FR-004)
function showInputError() {
  taskInputEl.setAttribute('aria-invalid', 'true');
  taskInputEl.setAttribute('aria-describedby', 'task-input-error');
  taskInputErrorEl.textContent = 'Enter a task title.';
}

function clearInputError() {
  taskInputEl.removeAttribute('aria-invalid');
  taskInputErrorEl.textContent = '';
}

composerEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const task = createTask(taskState, taskInputEl.value);
  if (!task) {
    showInputError();
    return;
  }
  taskState.push(task);
  clearInputError();
  refresh();
  // T015 (005) The new task is active, so tell the user where it went (FR-005)
  if (currentFilter === 'completed') showStatus('Task added to Active');
  taskInputEl.value = '';
  taskInputEl.focus();
});

renderTaskList();
renderTrace('add-task-button');
// T008 (005) Enable adding only once the submit handler is attached, so the form never submits natively
composerEl.querySelector('#add-task-button').disabled = false;
