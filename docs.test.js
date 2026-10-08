import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { FEATURE_DOCS, PHASES, featuresFor, phaseDocuments, docUrl } from './docs.js';
import { renderMarkdown, extractSection } from './markdown.js';

// T004 (007) Feature document manifest and phase mapping (research R2, R4)

const SPECS = new URL('./specs/', import.meta.url);
const ALLOWED = ['spec.md', 'plan.md', 'research.md', 'data-model.md', 'quickstart.md', 'tasks.md', 'prompts.md'];

function filesOnDisk(dir) {
  const root = new URL(`${dir}/`, SPECS);
  const files = readdirSync(root).filter((name) => ALLOWED.includes(name));
  try {
    for (const name of readdirSync(new URL('contracts/', root))) {
      if (name.endsWith('.md')) files.push(`contracts/${name}`);
    }
  } catch {
    // No contracts folder
  }
  return files.sort();
}

function expectedEntry(dir) {
  const heading = readFileSync(new URL(`${dir}/spec.md`, SPECS), 'utf8').split('\n')[0];
  return {
    id: dir.slice(0, 3),
    dir,
    title: heading.replace(/^#\s+Feature Specification:\s*/, '').trim(),
    files: filesOnDisk(dir)
  };
}

test('007:FR-002 manifest matches specs/', () => {
  const dirs = readdirSync(SPECS)
    .filter((name) => statSync(new URL(name, SPECS)).isDirectory())
    .sort();
  const expected = dirs.map(expectedEntry);
  for (const entry of expected) {
    const actual = FEATURE_DOCS.find((candidate) => candidate.dir === entry.dir);
    const paste = JSON.stringify(entry);
    assert.ok(actual, `FEATURE_DOCS in docs.js lacks ${entry.dir}. Add: ${paste}`);
    assert.match(actual.id, /^\d{3}$/);
    assert.ok(actual.dir.startsWith(`${actual.id}-`), `${actual.dir} does not start with ${actual.id}-`);
    assert.deepEqual({ ...actual, files: [...actual.files].sort() }, entry, `Out of date. Replace with: ${paste}`);
  }
  assert.equal(FEATURE_DOCS.length, expected.length, 'FEATURE_DOCS lists a folder that is not in specs/');
});

test('007:FR-002 featuresFor', () => {
  assert.deepEqual(featuresFor('003:FR-006 005:FR-004 003:FR-005'), ['003', '005']);
  assert.deepEqual(featuresFor(''), []);
  assert.deepEqual(featuresFor(undefined), []);
});

test('007:FR-001 FR-004 FR-005 phaseDocuments', () => {
  assert.deepEqual(PHASES, ['specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement']);
  const entry = FEATURE_DOCS.find((candidate) => candidate.id === '005');
  assert.deepEqual(
    phaseDocuments(entry, 'plan').map((ref) => ref.file),
    ['plan.md', 'research.md', 'data-model.md', 'quickstart.md', 'contracts/ui-behaviour.md']
  );
  assert.deepEqual(phaseDocuments(entry, 'specify'), [{ label: 'spec.md', file: 'spec.md', section: null }]);
  assert.deepEqual(phaseDocuments(entry, 'clarify'), [
    { label: 'spec.md', file: 'spec.md', section: 'Clarifications' }
  ]);
  assert.deepEqual(phaseDocuments(entry, 'analyze'), [
    { label: 'prompts.md', file: 'prompts.md', section: 'Phase: analyze' }
  ]);
  assert.deepEqual(phaseDocuments(entry, 'implement'), [
    { label: 'prompts.md', file: 'prompts.md', section: 'Phase: implement' }
  ]);
  const only = FEATURE_DOCS.find((candidate) => candidate.id === '002');
  assert.deepEqual(
    phaseDocuments(only, 'plan').map((ref) => ref.file),
    ['plan.md']
  );
});

test('007:FR-014 docUrl', () => {
  assert.equal(docUrl('003-adopt-polderworks-design', 'spec.md'), 'specs/003-adopt-polderworks-design/spec.md');
  assert.equal(
    docUrl('005-complete-core-flow', 'contracts/ui-behaviour.md'),
    'specs/005-complete-core-flow/contracts/ui-behaviour.md'
  );
  for (const [dir, file] of [
    ['999-nothing', 'spec.md'],
    ['002-priority-task-order', 'plan.md'],
    ['003-adopt-polderworks-design', '../004-ci-quality-gates/spec.md'],
    ['/etc', 'passwd'],
    ['003-adopt-polderworks-design', 'https://example.org/x.md']
  ]) {
    assert.throws(() => docUrl(dir, file), undefined, `${dir} ${file}`);
  }
});

// T009 (007) SC-001: the rendered text is the document's text, word for word (research R10)

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
// Both sides lose the same syntax characters and backslash escapes, so code like feature_numbering compares
// (a backslash before punctuation or at a word end; inside code spans it is literal, as in CommonMark)
const symmetric = (text) => text.replace(/\\(?=[!-/:-@[-`{-~]|\s|$)/g, '').replace(/[#*_`|>[\]]/g, ' ');

function sourceWords(source) {
  let inFence = false;
  const lines = [];
  for (const line of source.split('\n')) {
    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence; // fence lines are syntax; their content is kept as it is
      continue;
    }
    if (inFence) {
      lines.push(line);
      continue;
    }
    if (/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(line) && line.includes('-')) continue; // separators
    if (/^ {0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) continue; // rules
    lines.push(line.replace(/^(\s*)([-*+]|\d{1,9}[.)])\s+(\[[ xX]\]\s+)?/, '$1')); // list and task markers
  }
  // Link targets go, except inside code spans
  const text = lines
    .join('\n')
    .replace(/(`+)[\s\S]*?\1|\]\((?:[^\s()]|\([^\s()]*\))*\)/g, (match) => (match.startsWith('`') ? match : ']'));
  return symmetric(text).split(/\s+/).filter(Boolean);
}

function renderedWords(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity]);
  return symmetric(text).split(/\s+/).filter(Boolean);
}

function firstDifference(expected, actual) {
  const index = expected.findIndex((word, i) => word !== actual[i]);
  const at = index === -1 ? expected.length : index;
  if (at === expected.length && actual.length === expected.length) return null;
  const context = (words) => words.slice(Math.max(0, at - 5), at + 5).join(' ');
  return `word ${at}: expected "${context(expected)}" but got "${context(actual)}"`;
}

test('007:SC-001 every document renders word for word', () => {
  const failures = [];
  for (const entry of FEATURE_DOCS) {
    const baseDir = `specs/${entry.dir}/`;
    const docs = entry.files.map((file) => ({ name: file, file, section: null }));
    for (const section of ['Clarifications', 'Phase: analyze', 'Phase: implement']) {
      const file = section === 'Clarifications' ? 'spec.md' : 'prompts.md';
      if (entry.files.includes(file)) docs.push({ name: `${file}#${section}`, file, section });
    }
    for (const { name, file, section } of docs) {
      const full = readFileSync(new URL(`${entry.dir}/${file}`, SPECS), 'utf8');
      const source = section ? extractSection(full, section) : full;
      if (source === null) continue;
      const difference = firstDifference(sourceWords(source), renderedWords(renderMarkdown(source, { baseDir })));
      if (difference) failures.push(`${entry.dir}/${name} ${difference}`);
    }
  }
  assert.deepEqual(failures, []);
});
