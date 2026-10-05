import test from 'node:test';
import assert from 'node:assert/strict';
import { html } from './html.js';

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
