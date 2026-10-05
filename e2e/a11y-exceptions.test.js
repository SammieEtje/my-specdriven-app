import test from 'node:test';
import assert from 'node:assert/strict';
import { loadExceptions } from './a11y-exceptions.js';

// T022 Exceptions without a reason are rejected (004:FR-016)

test('004:FR-016 an empty exception list loads', () => {
  assert.deepEqual(loadExceptions([]), []);
});

test('004:FR-016 an exception with a reason loads', () => {
  const entry = { rule: 'label', selector: '#x', reason: 'documented' };
  assert.deepEqual(loadExceptions([entry]), [entry]);
});

test('004:FR-016 an exception without a reason is rejected', () => {
  assert.throws(() => loadExceptions([{ rule: 'label', selector: '#x', reason: ' ' }]), /has no reason/);
});
