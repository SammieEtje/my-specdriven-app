import { FEATURE_SPECS, buildTrace, updateTask } from './logic.js';

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

const taskState = [
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

let selectedTaskId = taskState[0].id;

function renderPhaseList(trace) {
  phaseListEl.innerHTML = '';

  trace.phases.forEach((phase) => {
    const item = document.createElement('li');
    item.className = 'phase-item';
    item.innerHTML = `
      <strong>${phase.phase}</strong>
      <div>${phase.decision}</div>
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
    element.classList.toggle('active', isSelected);
    element.style.outline = isSelected ? '2px solid rgba(124, 58, 237, 0.8)' : '';
    element.style.outlineOffset = isSelected ? '3px' : '';
  });
}

function getSelectedTask() {
  return taskState.find((task) => task.id === selectedTaskId) ?? taskState[0];
}

function renderTaskModal() {
  const task = getSelectedTask();

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
  taskListEl.innerHTML = taskState
    .map((task) => {
      const isSelected = task.id === selectedTaskId;
      return `
        <li class="task-card ${isSelected ? 'selected' : ''}">
          <label class="task-main">
            <input class="feature-target" data-target="task-toggle-${task.id}" type="checkbox" ${task.completed ? 'checked' : ''} />
            <span class="task-content">
              <span>${task.title}</span>
              <span class="meta">${task.owner} · ${task.tag}</span>
            </span>
          </label>
          <div class="task-meta-actions">
            <span class="task-pill">${task.tag}</span>
            <button class="task-open-button feature-target ${isSelected ? 'selected' : ''}" data-target="task-open" data-task-id="${task.id}">Open</button>
          </div>
        </li>
      `;
    })
    .join('');
}

function openTask(taskId) {
  selectedTaskId = taskId;
  renderTaskList();
  renderTaskModal();
  renderTrace('task-open');
}

function updateSelectedTask(field, value) {
  // T034
  if (updateTask(taskState, selectedTaskId, field, value)) {
    renderTaskList();
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
      renderTaskList();
      renderTrace(dataTarget);
    }
    return;
  }

  if (dataTarget === 'task-modal') {
    renderTrace(dataTarget);
    return;
  }

  renderTrace(dataTarget);
});

// T036
taskModalEl.addEventListener('close', () => {
  const openButton = [...taskListEl.querySelectorAll('[data-target="task-open"]')]
    .find((button) => button.dataset.taskId === selectedTaskId);
  openButton?.focus();
});

taskModalEl.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeTaskModal();
  }
});

document.addEventListener('input', (event) => {
  const target = event.target.closest('.feature-target');
  if (!target) return;

  const dataTarget = target.dataset.target;
  if (!dataTarget) return;

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

renderTaskList();
renderTrace('add-task-button');
