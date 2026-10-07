import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// T001 Offline checks for the README, LICENSE and third-party notices (feature 006)

function read(path) {
  assert.ok(existsSync(new URL(`./${path}`, import.meta.url)), `${path} is missing`);
  return readFileSync(new URL(`./${path}`, import.meta.url), 'utf8');
}

function headings(markdown) {
  return markdown
    .split('\n')
    .filter((line) => /^#{1,2} /.test(line))
    .map((line) => line.trim());
}

function section(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  assert.ok(start >= 0, `section "${heading}" is missing`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^## /.test(line));
  return (end >= 0 ? rest.slice(0, end) : rest).join('\n');
}

function relativeLinks(markdown) {
  return [...markdown.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)]
    .map((match) => match[1])
    .filter((target) => !/^(https?:|mailto:|#)/.test(target))
    .map((target) => decodeURI(target.split('#')[0]))
    .filter(Boolean);
}

function codeBlocks(text) {
  return [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].flatMap((match) => match[1].split('\n')).filter(Boolean);
}

const REQUIRED_SECTIONS = [
  'Why this exists',
  'What you can see',
  'How it was built',
  'Features',
  'Lessons learned',
  'Run it',
  'Test it',
  'Quality gate and contributing',
  'Known issues',
  'License',
  'Acknowledgements'
];

test('006 helpers parse headings and links', () => {
  const fixture = '# T\n\n## A\nsee [x](docs/a.md#top) and [y](https://e.x)\n```bash\nnpm test\n```\n## B\n';
  assert.deepEqual(headings(fixture), ['# T', '## A', '## B']);
  assert.deepEqual(relativeLinks(fixture), ['docs/a.md']);
  assert.deepEqual(codeBlocks(section(fixture, 'A')), ['npm test']);
});

// T002 User story 1: what and why

test('006:FR-001 README has the required sections in order', () => {
  const readme = read('README.md');
  assert.equal(readme.split('\n')[0], '# Spec-driven to-do demo');
  assert.deepEqual(
    headings(readme)
      .filter((line) => line.startsWith('## '))
      .map((line) => line.slice(3)),
    REQUIRED_SECTIONS
  );
});

test('006:FR-012 README and notices follow the writing rules', () => {
  for (const file of ['README.md', 'THIRD_PARTY_NOTICES.md']) {
    const text = read(file);
    assert.doesNotMatch(text, /—/, `${file} contains an em-dash`);
    // ©, ® and ™ are ordinary text symbols in copyright lines, not emoji
    assert.doesNotMatch(
      text.replace(/[\u00a9\u00ae\u2122]/g, ''),
      /\p{Extended_Pictographic}/u,
      `${file} contains an emoji`
    );
  }
});

test('006:SC-005 every relative link resolves', () => {
  for (const file of ['README.md', 'THIRD_PARTY_NOTICES.md']) {
    for (const target of relativeLinks(read(file))) {
      assert.ok(existsSync(new URL(`./${target}`, import.meta.url)), `${file} links to missing ${target}`);
    }
  }
});

test('006:FR-004 Features lists 001 to 006 with links to their specs', () => {
  const features = section(read('README.md'), 'Features');
  for (let n = 1; n <= 6; n += 1) {
    assert.match(features, new RegExp(`\\(specs/00${n}-[\\w-]+/spec\\.md\\)`), `feature 00${n} spec link missing`);
  }
  const row002 = features.split('\n').find((line) => line.includes('specs/002-'));
  assert.match(row002, /not built/i);
});

test('006:FR-011 acknowledges AI assistance', () => {
  const acknowledgements = section(read('README.md'), 'Acknowledgements');
  assert.match(acknowledgements, /Claude Code/);
  assert.match(acknowledgements, /Spec Kit/);
});

test('006:FR-002 Why this exists states the purpose', () => {
  const why = section(read('README.md'), 'Why this exists');
  for (const term of ['Spec Kit', 'AI assistant', 'data-spec']) assert.ok(why.includes(term), `missing "${term}"`);
});

test('006:FR-003 How it was built explains the workflow', () => {
  const how = section(read('README.md'), 'How it was built');
  assert.match(how, /\(\.specify\/memory\/constitution\.md\)/);
  for (const phase of ['specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement', 'converge']) {
    assert.match(how, new RegExp(`\\b${phase}\\b`), `phase "${phase}" not named`);
  }
  assert.ok(how.includes('prompts.md'));
  assert.match(how, /\b00\d-(specify|plan|tasks|analyze|implement)\b/);
});

test('006:FR-005 Lessons learned is honest and specific', () => {
  const lessons = section(read('README.md'), 'Lessons learned').toLowerCase();
  for (const term of ['001', 'xss', 'accessibility', 'close', 'server', 'outage']) {
    assert.ok(lessons.includes(term), `lessons do not mention "${term}"`);
  }
});

test('006:edge no personal data', () => {
  for (const file of ['README.md', 'THIRD_PARTY_NOTICES.md']) {
    const text = read(file).replace(/https?:\/\/\S+/g, '');
    assert.doesNotMatch(text, /[\w.+-]+@[\w-]+\.[\w.]+/, `${file} contains an email address`);
  }
});

// T005 User story 2: run and verify

test('006:FR-006 every command in Run it and Test it exists', () => {
  const readme = read('README.md');
  const scripts = Object.keys(JSON.parse(read('package.json')).scripts);
  const allowed = new Set(['npm ci', 'npm start', 'npm test', 'npx playwright install chromium']);
  const commands = ['Run it', 'Test it']
    .flatMap((name) => codeBlocks(section(readme, name)))
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter((line) => /^(npm|npx) /.test(line));
  assert.ok(commands.length >= 6, 'expected the run and test commands in code blocks');
  for (const command of commands) {
    const run = command.match(/^npm run ([\w:-]+)$/);
    assert.ok(allowed.has(command) || (run && scripts.includes(run[1])), `unknown command: ${command}`);
  }
  assert.ok(section(readme, 'Run it').includes('http://localhost:8000'));
  const gate = section(readme, 'Quality gate and contributing');
  for (const term of ['`code`', '`security`', '`usability`', 'pull request', 'branch protection']) {
    assert.ok(gate.toLowerCase().includes(term.toLowerCase()), `quality gate section lacks "${term}"`);
  }
});

// T008 User story 3: terms

test('006:FR-008 LICENSE is the MIT license for Sander Ettema', () => {
  const license = read('LICENSE');
  assert.equal(license.split('\n')[0], 'MIT License');
  for (const text of [
    'Copyright (c) 2026 Sander Ettema',
    'Permission is hereby granted, free of charge',
    'THE SOFTWARE IS PROVIDED "AS IS"'
  ]) {
    assert.ok(license.includes(text), `LICENSE lacks "${text}"`);
  }
});

test('006:FR-009 third-party notices cover every external component', () => {
  const notices = read('THIRD_PARTY_NOTICES.md');
  for (const text of [
    'IBM Plex',
    'OFL-1.1',
    '(fonts/OFL.txt)',
    'Spec Kit',
    'Copyright GitHub, Inc.',
    '.specify/',
    'Polderworks design system'
  ]) {
    assert.ok(notices.includes(text), `notices lack "${text}"`);
  }
  const paths = [...notices.matchAll(/`((?:\.specify|\.claude|fonts)\/[^`]*)`/g)].map((match) => match[1]);
  for (const path of paths.filter((candidate) => !candidate.includes('*'))) {
    assert.ok(existsSync(new URL(`./${path}`, import.meta.url)), `notices name missing path ${path}`);
  }
});

test('006:FR-010 trademarks are excluded', () => {
  const trademarkSentence = /[^.]*\btrademark[^.]*\./gi;
  for (const [file, text] of [
    ['README.md', section(read('README.md'), 'License')],
    ['THIRD_PARTY_NOTICES.md', read('THIRD_PARTY_NOTICES.md')]
  ]) {
    const block = (text.match(trademarkSentence) ?? []).join(' ') + ' ' + text;
    assert.match(text, /trademark/i, `${file} has no trademark statement`);
    assert.ok(block.includes('Polderworks') && block.includes('Loods'), `${file} does not name Polderworks and Loods`);
  }
});
