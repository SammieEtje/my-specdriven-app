import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

// T011 Trace check (004:FR-004, constitution III): every data-spec ID must exist in its feature's spec.md

const SOURCES = ['index.html', 'app.js'];

function collectSpecTokens(source, file) {
  const tokens = [];
  for (const match of source.matchAll(/data-spec="([^"]*)"/g)) {
    const line = source.slice(0, match.index).split('\n').length;
    for (const token of match[1].split(/\s+/).filter(Boolean)) {
      const [feature, id] = token.split(':');
      tokens.push({ token, feature, id, file, line });
    }
  }
  return tokens;
}

function specPath(feature) {
  const specsDir = new URL('./specs/', import.meta.url);
  const dir = readdirSync(specsDir).find((name) => name.startsWith(`${feature}-`));
  return dir ? new URL(`./specs/${dir}/spec.md`, import.meta.url) : null;
}

function knownIds(feature) {
  const path = specPath(feature);
  if (!path || !existsSync(path)) return null;
  const spec = readFileSync(path, 'utf8');
  return new Set([...spec.matchAll(/\*\*((?:FR|SC)-\d{3})\*\*/g)].map((match) => match[1]));
}

function unknownTokens(tokens) {
  return tokens.filter(({ feature, id }) => {
    const ids = knownIds(feature);
    return !ids || !ids.has(id);
  });
}

test('004:FR-004 every data-spec ID exists in its feature spec', () => {
  const tokens = SOURCES.flatMap((file) =>
    collectSpecTokens(readFileSync(new URL(`./${file}`, import.meta.url), 'utf8'), file)
  );
  assert.ok(tokens.length > 0, 'no data-spec tokens found');
  const unknown = unknownTokens(tokens);
  assert.deepEqual(
    unknown.map(({ token, file, line }) => `${token} (${file}:${line})`),
    [],
    'unknown data-spec IDs'
  );
});

test('004:FR-004 self-check: an unknown ID is reported with file and line', () => {
  const tokens = collectSpecTokens('<div>\n<p data-spec="003:FR-001 003:FR-099">', 'fixture.html');
  assert.deepEqual(
    unknownTokens(tokens).map(({ token, file, line }) => `${token} (${file}:${line})`),
    ['003:FR-099 (fixture.html:2)']
  );
});

test('004:FR-004 self-check: a token for a feature without a spec is reported', () => {
  const tokens = collectSpecTokens('<p data-spec="999:FR-001">', 'fixture.html');
  assert.equal(knownIds('999'), null);
  assert.equal(unknownTokens(tokens).length, 1);
});

// 007 The spec panel reads the trace of the selected element, so every selectable element needs one (007:FR-002)
test('007:FR-002 every feature-target in index.html carries a data-spec trace', () => {
  const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  const missing = [...html.matchAll(/<[a-z]+[^>]*\bfeature-target\b[^>]*>/gs)]
    .map(([tag]) => tag)
    .filter((tag) => !/data-spec="[^"]+"/.test(tag))
    .map((tag) => tag.match(/data-target="([^"]+)"/)?.[1] ?? tag.slice(0, 40));
  assert.deepEqual(missing, []);
});
