import {
  updateTask,
  createTask,
  filterTasks,
  emptyStateText,
  STORAGE_KEY,
  serializeState,
  parseState,
  hasTag,
  metaLine
} from './logic.js';
import { html, markup } from './html.js';
import { findFeature, featuresFor, phaseDocuments, loadDocument } from './docs.js';
import { renderMarkdown, extractSection } from './markdown.js';

// T014 (007) The hand-written trace elements are gone; the spec panel replaces them (contracts/ui-panel.md)
const selectionEl = document.getElementById('spec-selection');
const featureSwitcherEl = document.getElementById('feature-switcher');
const phaseTabsEl = document.getElementById('phase-tabs');
const docSwitcherEl = document.getElementById('doc-switcher');
const phasePanelEl = document.getElementById('phase-panel');
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

// T015 (007) Panel state (data-model PanelState). The phase survives a new selection (FR-008).
const panel = {
  selectedTarget: null,
  traceKey: null,
  features: [],
  featureId: null,
  phase: 'specify',
  docIndex: 0,
  requestId: 0
};

function renderTrace(target) {
  document.querySelectorAll('.feature-target').forEach((element) => {
    const isSelected = element.dataset.target === target;
    // T007 The traced outline comes from .feature-target.active in styles.css (R5)
    element.classList.toggle('active', isSelected);
  });

  // T015 (007) The features come from the data-spec trace of the element, or its closest traced ancestor (research R5)
  const element = [...document.querySelectorAll('.feature-target')].find((item) => item.dataset.target === target);
  const features = featuresFor(element?.closest('[data-spec]')?.dataset.spec);
  const traceKey = `${target}|${features.join(' ')}`;
  // Typing in a field selects the same element on every key; keep the panel and its scroll position then
  if (traceKey === panel.traceKey) return;

  panel.selectedTarget = target;
  panel.traceKey = traceKey;
  panel.features = features;
  panel.featureId = features[0] ?? null;
  panel.docIndex = 0;
  renderSelection();
  renderFeatureSwitcher();
  loadPanel();
}

function renderSelection() {
  const entry = findFeature(panel.featureId);
  const feature = panel.featureId ?? 'none';
  const title = entry ? entry.title : 'Unknown feature';
  selectionEl.innerHTML = html`Element <code>${panel.selectedTarget}</code> · Feature <code>${feature}</code> ${title}`;
}

// T021 (007) One button per linked feature, only when there is a choice (FR-007)
function renderFeatureSwitcher() {
  featureSwitcherEl.hidden = panel.features.length < 2;
  // markup`` joins the escaped buttons without turning them into an unchecked string (lint:security)
  featureSwitcherEl.innerHTML = markup`${panel.features.map(
    (id) =>
      markup`<button type="button" id="feature-option-${id}" class="filter-btn" data-feature="${id}" title="${findFeature(id)?.title ?? 'Unknown feature'}" aria-pressed="${String(id === panel.featureId)}">${id}</button>`
  )}`;
}

featureSwitcherEl.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-feature]');
  if (!button) return;
  panel.featureId = button.dataset.feature;
  panel.docIndex = 0;
  renderSelection();
  renderFeatureSwitcher();
  loadPanel();
});

// T015 (007) Select a tab: aria-selected, roving tabindex and the panel's label (research R6)
function selectPhase(phase, { focus = false } = {}) {
  phaseTabsEl.querySelectorAll('[role="tab"]').forEach((tab) => {
    const isActive = tab.id === `tab-${phase}`;
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && focus) tab.focus();
  });
  phasePanelEl.setAttribute('aria-labelledby', `tab-${phase}`);
  panel.phase = phase;
  panel.docIndex = 0;
  loadPanel();
}

// T017 (007) In the plan tab, a button per supporting document (FR-004)
function renderDocSwitcher(entry) {
  const refs = entry && panel.phase === 'plan' ? phaseDocuments(entry, 'plan') : [];
  docSwitcherEl.hidden = refs.length < 2;
  docSwitcherEl.innerHTML = markup`${(refs.length < 2 ? [] : refs).map(
    (ref, index) =>
      markup`<button type="button" id="plan-doc-${index}" class="filter-btn" data-doc-index="${index}" aria-pressed="${String(index === panel.docIndex)}">${ref.label}</button>`
  )}`;
}

function showNotice(lines) {
  phasePanelEl.removeAttribute('aria-busy');
  phasePanelEl.innerHTML = html`<div class="callout doc-notice" data-spec="007:FR-009 003:FR-009">${lines.join(' ')}</div>`;
  phasePanelEl.scrollTop = 0;
}

// T016 (007) Load and show the document for the current feature, phase and plan choice (data-model LoadResult)
async function loadPanel() {
  const requestId = ++panel.requestId;
  const entry = findFeature(panel.featureId);
  renderDocSwitcher(entry);

  if (!entry) {
    showNotice([
      panel.featureId
        ? `There is no folder for feature ${panel.featureId} in specs/.`
        : 'This element has no data-spec trace to a feature.'
    ]);
    return;
  }

  const refs = phaseDocuments(entry, panel.phase);
  const ref = refs[panel.docIndex] ?? refs[0];
  const path = `specs/${entry.dir}/${ref.file}`;
  const notProduced = [
    `The ${panel.phase} phase has not been run for feature ${entry.id} yet.`,
    `Expected at ${path}.`
  ];
  if (!entry.files.includes(ref.file)) {
    showNotice(notProduced);
    return;
  }

  phasePanelEl.setAttribute('aria-busy', 'true');
  const result = await loadDocument(entry.dir, ref.file);
  // R8 A newer selection or tab wins; drop this late answer
  if (requestId !== panel.requestId) return;

  if (result.state === 'unavailable') {
    showNotice(['This document could not be loaded.', `Check that the demo server is running, or read it at ${path}.`]);
    return;
  }
  const text = result.state === 'ok' && ref.section ? extractSection(result.text, ref.section) : result.text;
  if (result.state !== 'ok' || text === null) {
    showNotice(notProduced);
    return;
  }

  phasePanelEl.removeAttribute('aria-busy');
  const label = ref.section ? `${path} · section ${ref.section}` : path;
  phasePanelEl.innerHTML = html`<p class="doc-source">${label}</p><div class="md-body" data-spec="003:FR-009"></div>`;
  phasePanelEl.querySelector('.md-body').innerHTML = renderMarkdown(text, { baseDir: `specs/${entry.dir}/` });
  phasePanelEl.scrollTop = 0;
}

phaseTabsEl.addEventListener('click', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (tab) selectPhase(tab.id.replace('tab-', ''));
});

// T025 (007) Arrow keys (wrapping), Home and End select and focus a tab: automatic activation (research R6)
phaseTabsEl.addEventListener('keydown', (event) => {
  const tabs = [...phaseTabsEl.querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(event.target.closest('[role="tab"]'));
  if (current === -1) return;
  const targets = {
    ArrowRight: (current + 1) % tabs.length,
    ArrowLeft: (current - 1 + tabs.length) % tabs.length,
    Home: 0,
    End: tabs.length - 1
  };
  if (!(event.key in targets)) return;
  event.preventDefault();
  selectPhase(tabs[targets[event.key]].id.replace('tab-', ''), { focus: true });
});

docSwitcherEl.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-doc-index]');
  if (!button) return;
  panel.docIndex = Number(button.dataset.docIndex);
  loadPanel();
});

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
  // T007 (008) The meta line comes from metaLine(), so empty parts leave no stray separators
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
              <span class="meta" data-spec="008:FR-004">${metaLine(task)}</span>
            </span>
          </label>
          <div class="task-meta-actions">
            <button class="task-open-button feature-target btn btn-secondary ${isSelected ? 'selected' : ''}" data-target="task-open" data-task-id="${task.id}" data-spec="003:FR-005">Open</button>
          </div>
        </li>
      `
    );
    // T005 (008) Only a tag with text gets its frame; the lint rejects conditional fragments, so it is a second insert
    if (hasTag(task)) {
      taskListEl.lastElementChild
        .querySelector('.task-meta-actions')
        .insertAdjacentHTML('afterbegin', html`<span class="tag" data-spec="003:FR-003 008:FR-001">${task.tag}</span>`);
    }
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
