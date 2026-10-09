import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// T015 Privacy check (004:FR-008, constitution V): the app makes no external requests

// T005 (007) docs.js and markdown.js are app sources too
const FILES = [
  'index.html',
  'app.js',
  'logic.js',
  'html.js',
  'docs.js',
  'markdown.js',
  'styles.css',
  'fonts/fonts.css'
];

const RULES = [
  { name: 'remote URL', pattern: /https?:\/\//i },
  // T005 (007) The only allowed request is fetch(docUrl(...)) in docs.js (research R1)
  { name: 'fetch() outside docUrl()', pattern: /\bfetch\s*\((?!docUrl\()/ },
  { name: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { name: 'sendBeacon', pattern: /\bsendBeacon\b/ },
  { name: 'WebSocket', pattern: /\bnew\s+WebSocket\b/ },
  { name: 'EventSource', pattern: /\bnew\s+EventSource\b/ },
  { name: 'external script', pattern: /<script\b[^>]*\bsrc\s*=\s*["'](?!\.?\/|[\w-]+\.js)/i },
  { name: 'external link', pattern: /<link\b[^>]*\bhref\s*=\s*["'](?!\.?\/|[\w-]+\.css)/i },
  {
    name: 'analytics host',
    pattern: /googletagmanager|google-analytics|plausible|segment\.(io|com)|hotjar|doubleclick/i
  }
];

function stripComments(source, file) {
  const blank = (match) => match.replace(/[^\n]/g, ' ');
  let text = source.replace(/\/\*[\s\S]*?\*\//g, blank);
  if (file.endsWith('.html')) text = text.replace(/<!--[\s\S]*?-->/g, blank);
  if (file.endsWith('.js'))
    text = text.replace(/(^|[^:\\])\/\/[^\n]*/g, (match, lead) => lead + blank(match.slice(lead.length)));
  return text;
}

function findViolations(source, file) {
  const lines = stripComments(source, file).split('\n');
  const violations = [];
  lines.forEach((line, index) => {
    for (const { name, pattern } of RULES) {
      const match = line.match(pattern);
      if (match) violations.push(`${file}:${index + 1} ${name} "${match[0]}" (constitution V)`);
    }
  });
  return violations;
}

test('004:FR-008 app sources make no external requests', () => {
  const violations = FILES.flatMap((file) =>
    findViolations(readFileSync(new URL(`./${file}`, import.meta.url), 'utf8'), file)
  );
  assert.deepEqual(violations, []);
});

test('004:FR-008 self-check: an analytics script tag is reported', () => {
  const fixture = '<head>\n<script src="https://www.googletagmanager.com/gtag/js"></script>\n</head>';
  const violations = findViolations(fixture, 'fixture.html');
  assert.ok(violations.some((v) => v.startsWith('fixture.html:2 remote URL')));
  assert.ok(violations.some((v) => v.includes('external script')));
  assert.ok(violations.some((v) => v.includes('analytics host')));
});

test('004:FR-008 self-check: commented-out URLs are ignored', () => {
  assert.deepEqual(findViolations('// see https://example.com\nconst a = 1;', 'fixture.js'), []);
});

test('007:FR-014 self-check: fetch is only allowed as fetch(docUrl(...))', () => {
  assert.ok(findViolations("fetch('https://x');", 'fixture.js').some((v) => v.includes('fetch() outside docUrl()')));
  assert.ok(findViolations('fetch(url);', 'fixture.js').some((v) => v.includes('fetch() outside docUrl()')));
  assert.deepEqual(findViolations('fetch(docUrl(dir, file));', 'fixture.js'), []);
});
