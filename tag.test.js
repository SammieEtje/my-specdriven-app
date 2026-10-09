import test from 'node:test';
import assert from 'node:assert/strict';
import { hasTag, metaLine } from './logic.js';

// T002 (008) Which tags count as present, and the line under the task title (data-model.md)

const task = (owner, tag, completed = false) => ({ owner, tag, completed });

test('008:FR-001 hasTag', () => {
  assert.equal(hasTag({ tag: 'Marketing' }), true);
  assert.equal(hasTag({ tag: ' Marketing ' }), true);
  for (const tag of ['', '   ', undefined, null]) {
    assert.equal(hasTag({ tag }), false, JSON.stringify(tag));
  }
});

test('008:FR-004 metaLine', () => {
  const rows = [
    [task('Ava', 'Marketing'), 'Ava · Marketing'],
    [task('Ava', ''), 'Ava'],
    [task('', 'Marketing'), 'Marketing'],
    [task('', ''), ''],
    [task('', '', true), 'Completed'],
    [task('Leo', 'Product', true), 'Leo · Product · Completed'],
    [task('  ', '  '), '']
  ];
  for (const [input, expected] of rows) {
    assert.equal(metaLine(input), expected, JSON.stringify(input));
  }
});

test('008:SC-003 metaLine never has a stray separator', () => {
  for (const owner of ['', 'Ava']) {
    for (const tag of ['', 'Tag']) {
      for (const completed of [false, true]) {
        const line = metaLine(task(owner, tag, completed));
        assert.doesNotMatch(line, /^\s*·|·\s*$|·\s*·/, JSON.stringify({ owner, tag, completed, line }));
      }
    }
  }
});
