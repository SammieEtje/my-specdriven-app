import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, extractSection } from './markdown.js';

// T003 (007) Markdown subset renderer (contracts/markdown-subset.md)

const render = (source, baseDir = 'specs/003-x/') => renderMarkdown(source, { baseDir });

test('007:FR-006 headings shift two levels and cap at h6', () => {
  assert.equal(render('# Title'), '<h3>Title</h3>');
  assert.equal(render('#### Deep'), '<h6>Deep</h6>');
  assert.equal(render('###### Deepest'), '<h6>Deepest</h6>');
});

test('007:FR-006 paragraphs join their lines with a space', () => {
  assert.equal(render('one\ntwo\n\nthree'), '<p>one two</p><p>three</p>');
});

test('007:FR-006 nested bullet and numbered lists', () => {
  assert.equal(render('- a\n  - b\n- c'), '<ul><li>a<ul><li>b</li></ul></li><li>c</li></ul>');
  assert.equal(render('1. a\n2. b'), '<ol><li>a</li><li>b</li></ol>');
  assert.equal(render('3. c\n4. d'), '<ol start="3"><li>c</li><li>d</li></ol>');
});

test('007:FR-006 task items', () => {
  const output = render('- [ ] a\n- [x] b\n- [X] c');
  assert.equal(
    output,
    '<ul>' +
      '<li class="md-task"><span class="md-check" role="img" aria-label="Open"></span>a</li>' +
      '<li class="md-task"><span class="md-check" role="img" aria-label="Done"></span>b</li>' +
      '<li class="md-task"><span class="md-check" role="img" aria-label="Done"></span>c</li>' +
      '</ul>'
  );
  assert.ok(!output.includes('<input'));
});

test('007:FR-006 GFM tables', () => {
  assert.equal(
    render('| A | B |\n|:--|--:|\n| a \\| b | `x|y` |'),
    '<table><thead><tr><th>A</th><th>B</th></tr></thead>' +
      '<tbody><tr><td>a | b</td><td><code>x|y</code></td></tr></tbody></table>'
  );
});

test('007:FR-006 fenced code, block quote and rule', () => {
  assert.equal(render('```html\n<b>\n  x\n```'), '<pre><code>&lt;b&gt;\n  x</code></pre>');
  assert.equal(render('> quoted\n> text'), '<blockquote><p>quoted text</p></blockquote>');
  assert.equal(render('---'), '<hr>');
});

test('007:FR-006 inline code, bold and italic', () => {
  assert.equal(
    render('`a*b*` **bold** *it* _it_ snake_case'),
    '<p><code>a*b*</code> <strong>bold</strong> <em>it</em> <em>it</em> snake_case</p>'
  );
});

test('007:FR-010 links', () => {
  assert.equal(
    render('[site](https://example.org/a)'),
    '<p><a href="https://example.org/a" target="_blank" rel="noopener noreferrer">site</a></p>'
  );
  assert.equal(render('[spec](spec.md)'), '<p><a href="specs/003-x/spec.md">spec</a></p>');
  assert.equal(render('[up](../004-y/plan.md)'), '<p><a href="specs/004-y/plan.md">up</a></p>');
  for (const href of ['javascript:alert(1)', 'data:text/html,x', 'http://example.org']) {
    assert.equal(render(`[x](${href})`), '<p>x</p>', href);
  }
  assert.equal(render('see https://example.org'), '<p>see https://example.org</p>');
});

test('007:FR-010 raw HTML is shown as text', () => {
  const image = render('<img src=x onerror=alert(1)>');
  assert.equal(image, '<p>&lt;img src=x onerror=alert(1)&gt;</p>');
  const comment = render('<!-- note -->');
  assert.equal(comment, '<p>&lt;!-- note --&gt;</p>');
  assert.ok(!image.includes('<img') && !comment.includes('<!--'));
});

test('007:FR-005 extractSection', () => {
  const source = '# T\n\n## Clarifications\n\n- a\n\n### Session\n\nb\n\n## Next\n\nc\n';
  assert.equal(extractSection(source, 'Clarifications'), '## Clarifications\n\n- a\n\n### Session\n\nb\n');
  assert.equal(extractSection(source, 'Missing'), null);
  assert.equal(extractSection('## Phase: analyze extra\n\nx', 'Phase: analyze'), null);
  assert.equal(extractSection('### Phase: analyze\n\nx', 'Phase: analyze'), null);
});
