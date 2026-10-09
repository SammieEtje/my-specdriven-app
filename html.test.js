import test from 'node:test';
import assert from 'node:assert/strict';
import { html, markup } from './html.js';

// T014 Escaping tagged template (004:FR-007, research R6)

test('004:FR-007 html escapes interpolated markup', () => {
  assert.equal(html`<b>${'<img src=x onerror=alert(1)>'}</b>`, '<b>&lt;img src=x onerror=alert(1)&gt;</b>');
});

test('004:FR-007 html escapes all five special characters', () => {
  assert.equal(html`${`& < > " '`}`, '&amp; &lt; &gt; &quot; &#39;');
});

test('004:FR-007 html stringifies numbers and booleans and drops null and undefined', () => {
  assert.equal(html`${1}|${true}|${null}|${undefined}`, '1|true||');
});

test('004:FR-007 html leaves static template parts unchanged', () => {
  assert.equal(html`<li class="a" data-x="${'y'}">`, '<li class="a" data-x="y">');
});

// T031 (007) markup composes escaped fragments for the Markdown renderer (research R3)

test('007:FR-010 markup escapes like html', () => {
  assert.equal(String(markup`<b>${`& < > " '`}</b>`), '<b>&amp; &lt; &gt; &quot; &#39;</b>');
  assert.equal(String(markup`${null}|${undefined}|${1}`), '||1');
});

test('007:FR-010 markup inserts its own fragments unescaped', () => {
  const inner = markup`<b>${'<x>'}</b>`;
  assert.equal(String(markup`<p>${inner}</p>`), '<p><b>&lt;x&gt;</b></p>');
  assert.equal(
    String(markup`<ul>${[markup`<li>a</li>`, markup`<li>${'<'}</li>`]}</ul>`),
    '<ul><li>a</li><li>&lt;</li></ul>'
  );
});

test('007:FR-010 a plain string or String object is never trusted', () => {
  assert.equal(String(markup`${'<b>'}`), '&lt;b&gt;');
  assert.equal(String(markup`${new String('<b>')}`), '&lt;b&gt;');
  assert.equal(String(markup`${{ value: '<b>', toString: () => '<b>' }}`), '&lt;b&gt;');
  assert.equal(String(markup`<i>`), '<i>');
});
