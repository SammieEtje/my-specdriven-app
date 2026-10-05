import test from 'node:test';
import assert from 'node:assert/strict';
import * as logic from './logic.js';

// T003 createTask (005:FR-002, FR-004)

const sample = () => [
  { id: 'task-1', title: 'A', description: '', tag: '', owner: '', completed: false },
  { id: 'task-7', title: 'B', description: '', tag: '', owner: '', completed: true }
];

test('005:FR-002 creates an active task with a trimmed title', () => {
  const task = logic.createTask(sample(), '  Buy milk ');
  assert.deepEqual(
    { ...task, id: undefined },
    { id: undefined, title: 'Buy milk', description: '', tag: '', owner: '', completed: false }
  );
});

test('005:FR-002 next id is highest task-N plus one', () => {
  assert.equal(logic.createTask(sample(), 'x').id, 'task-8');
  assert.equal(logic.createTask([], 'x').id, 'task-1');
});

test('005:FR-004 empty or whitespace-only title returns null', () => {
  assert.equal(logic.createTask(sample(), ''), null);
  assert.equal(logic.createTask(sample(), '   '), null);
});

test('005:FR-002 createTask does not mutate the input array', () => {
  const tasks = sample();
  logic.createTask(tasks, 'x');
  assert.equal(tasks.length, 2);
});

// T011 filterTasks (005:FR-005)
const mixed = () => [
  { id: 'task-1', title: 'A', completed: false },
  { id: 'task-2', title: 'B', completed: true },
  { id: 'task-3', title: 'C', completed: false }
];

test('005:FR-005 all/active/completed return the right subsets', () => {
  const ids = (list) => list.map((task) => task.id);
  assert.deepEqual(ids(logic.filterTasks(mixed(), 'all')), ['task-1', 'task-2', 'task-3']);
  assert.deepEqual(ids(logic.filterTasks(mixed(), 'active')), ['task-1', 'task-3']);
  assert.deepEqual(ids(logic.filterTasks(mixed(), 'completed')), ['task-2']);
});

test('005:FR-005 unknown filter falls back to all', () => {
  assert.equal(logic.filterTasks(mixed(), 'nonsense').length, 3);
});

// T017 emptyStateText (005:FR-007)
const ALL_TEXT = { heading: 'No tasks yet', text: 'Start by adding the first item to your spec-driven workflow.' };

test('005:FR-007 empty-state text per filter', () => {
  assert.deepEqual(logic.emptyStateText('all', 0), ALL_TEXT);
  assert.deepEqual(logic.emptyStateText('active', 2), {
    heading: 'No active tasks',
    text: 'Everything is done. Add a new task to keep going.'
  });
  assert.deepEqual(logic.emptyStateText('completed', 2), {
    heading: 'No completed tasks',
    text: 'Check off a task to see it here.'
  });
});

test('005:FR-007 with no tasks at all the text is always "No tasks yet"', () => {
  assert.deepEqual(logic.emptyStateText('active', 0), ALL_TEXT);
  assert.deepEqual(logic.emptyStateText('completed', 0), ALL_TEXT);
});

// T022 serializeState / parseState (005:FR-008, FR-009, FR-011)
const fallback = () => [{ id: 'task-1', title: 'Example', description: 'd', tag: 't', owner: 'o', completed: false }];
const stored = (tasks) => JSON.stringify({ version: 1, tasks });

test('005:FR-008 serializeState writes version 1', () => {
  assert.deepEqual(JSON.parse(logic.serializeState(fallback())), { version: 1, tasks: fallback() });
});

test('005:FR-008 parseState round-trips serializeState', () => {
  const tasks = [...fallback(), { id: 'task-2', title: 'B', description: '', tag: '', owner: '', completed: true }];
  assert.deepEqual(logic.parseState(logic.serializeState(tasks), fallback()), tasks);
});

test('005:FR-009 parseState falls back on missing, broken or invalid data', () => {
  const cases = [
    null,
    '{broken',
    JSON.stringify({ version: 2, tasks: [] }),
    JSON.stringify({ version: 1, tasks: {} }),
    stored([{ title: 'no id', completed: false }]),
    stored([{ id: 'task-1', completed: false }]),
    stored([{ id: 'task-1', title: 'A', completed: 'yes' }])
  ];
  for (const raw of cases) assert.deepEqual(logic.parseState(raw, fallback()), fallback(), `case ${raw}`);
});

test('005:FR-009 parseState returns a fresh copy of the fallback', () => {
  const original = fallback();
  const result = logic.parseState(null, original);
  result[0].title = 'changed';
  assert.equal(original[0].title, 'Example');
});

test('005:FR-009 missing optional fields become empty strings', () => {
  assert.deepEqual(logic.parseState(stored([{ id: 'task-3', title: 'C', completed: true, tag: 5 }]), fallback()), [
    { id: 'task-3', title: 'C', description: '', tag: '', owner: '', completed: true }
  ]);
});

test('005:FR-011 a blank stored title is repaired to Untitled task', () => {
  const result = logic.parseState(
    stored([
      { id: 'task-1', title: '  ', completed: false },
      { id: 'task-2', title: 'Keep', completed: true }
    ]),
    fallback()
  );
  assert.equal(result[0].title, 'Untitled task');
  assert.equal(result[1].title, 'Keep');
});
