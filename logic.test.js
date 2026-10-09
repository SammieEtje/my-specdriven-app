import test from 'node:test';
import assert from 'node:assert/strict';
import { updateTask } from './logic.js';

// T014 (007) The four FEATURE_SPECS and buildTrace tests went with the hand-written trace

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
