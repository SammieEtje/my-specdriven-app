import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTrace, FEATURE_SPECS, updateTask } from './logic.js';

test('buildTrace returns phase-by-phase spec decisions for a selected element', () => {
  const spec = FEATURE_SPECS[0];
  const trace = buildTrace('add-task-button', spec);

  assert.equal(trace.selectedElement, 'add-task-button');
  assert.equal(trace.featureId, 'spec-01');
  assert.ok(Array.isArray(trace.phases));
  assert.equal(trace.phases.length, 5);
  assert.ok(trace.phases.every((phase) => phase.decision && phase.phase));
  assert.equal(trace.phases[0].phase, 'specify');
});

test('all feature specs carry a valid source and phase map', () => {
  assert.ok(FEATURE_SPECS.length >= 5);

  for (const spec of FEATURE_SPECS) {
    assert.ok(spec.id);
    assert.ok(spec.source);
    assert.ok(spec.phaseMap);
    assert.equal(Object.keys(spec.phaseMap).length, 5);
  }
});

test('task detail fields are covered by the spec trace model', () => {
  const taskFields = ['task-open', 'task-title-field', 'task-description-field', 'task-tag-field', 'task-owner-field'];
  const matching = FEATURE_SPECS.filter((spec) =>
    taskFields.some((field) => spec.elementIds.includes(field))
  );

  assert.ok(matching.length >= 2);
  assert.ok(FEATURE_SPECS.some((spec) => spec.title.includes('Task detail')));
});

test('task open action exposes a dedicated modal target for the popup workflow', () => {
  const modalTargetIds = ['task-modal', 'task-modal-close'];

  const matching = FEATURE_SPECS.filter((spec) =>
    modalTargetIds.some((field) => spec.elementIds.includes(field))
  );

  assert.ok(matching.length >= 1, 'The modal target should be traceable in the spec map.');
});

test('updateTask applies editable task fields and rejects unsupported fields', () => {
  const tasks = [{ id: 'task-1', title: 'Old title', description: 'Old note', tag: 'Old tag', owner: 'Old owner' }];

  updateTask(tasks, 'task-1', 'title', 'New title');
  updateTask(tasks, 'task-1', 'description', 'New note');
  updateTask(tasks, 'task-1', 'tag', 'New tag');
  updateTask(tasks, 'task-1', 'owner', 'New owner');

  assert.deepEqual(tasks[0], {
    id: 'task-1',
    title: 'New title',
    description: 'New note',
    tag: 'New tag',
    owner: 'New owner'
  });
  assert.equal(updateTask(tasks, 'task-1', 'completed', 'yes'), null);
  assert.equal(updateTask(tasks, 'missing', 'title', 'Ignored'), null);
});
