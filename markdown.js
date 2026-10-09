import { markup } from './html.js';

// T006 (007) Renderer for the Markdown subset the Spec Kit documents use (contracts/markdown-subset.md).
// Every piece of document text goes through markup``, so raw HTML in a document stays visible text (FR-010).

const FENCE = /^(\s*)(`{3,}|~{3,})(.*)$/;
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const RULE = /^ {0,3}([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^ {0,3}>\s?/;
const ITEM = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const TASK = /^\[([ xX])\]\s+(.*)$/;

const indentOf = (line) => line.match(/^\s*/)[0].length;
const isBlank = (line) => line.trim() === '';
const isTableStart = (lines, i) =>
  lines[i].includes('|') && i + 1 < lines.length && TABLE_SEPARATOR.test(lines[i + 1]) && lines[i + 1].includes('-');

function startsBlock(lines, i) {
  const line = lines[i];
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    RULE.test(line) ||
    QUOTE.test(line) ||
    ITEM.test(line) ||
    isTableStart(lines, i)
  );
}

// Links: https opens in a new tab, relative paths resolve against the document's folder, anything else is text.
function resolveLink(href, baseDir) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    try {
      return new URL(href).protocol === 'https:' ? { href, external: true } : null;
    } catch {
      return null;
    }
  }
  if (href === '' || href.startsWith('#') || href.startsWith('/') || href.includes('\\')) return null;
  const parts = [];
  for (const segment of `${baseDir}${href}`.split('/')) {
    if (segment === '..') parts.pop();
    else if (segment !== '.') parts.push(segment);
  }
  return { href: parts.join('/'), external: false };
}

function closingBracket(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === '\\') i += 1;
    else if (text[i] === '[') depth += 1;
    else if (text[i] === ']' && --depth === 0) return i;
  }
  return -1;
}

const isWordChar = (char) => char !== undefined && /[\p{L}\p{N}]/u.test(char);

// Find a closing emphasis delimiter: preceded by a non-space, and for "_" not inside a word.
function closingDelimiter(text, delimiter, from) {
  for (let i = text.indexOf(delimiter, from); i !== -1; i = text.indexOf(delimiter, i + 1)) {
    if (text[i - 1] === '\\' || /\s/.test(text[i - 1])) continue;
    if (delimiter === '_' && isWordChar(text[i + 1])) continue;
    if (delimiter === '*' && (text[i + 1] === '*' || text[i - 1] === '*')) continue;
    return i;
  }
  return -1;
}

function inline(text, baseDir) {
  const parts = [];
  let plain = '';
  const flush = () => {
    if (plain) parts.push(plain);
    plain = '';
  };

  for (let i = 0; i < text.length;) {
    const char = text[i];

    if (char === '\\' && /[!-/:-@[-`{-~]/.test(text[i + 1] ?? '')) {
      plain += text[i + 1];
      i += 2;
      continue;
    }

    if (char === '`') {
      const run = text.slice(i).match(/^`+/)[0];
      const end = text.indexOf(run, i + run.length);
      if (end !== -1 && text[end + run.length] !== '`') {
        let code = text.slice(i + run.length, end);
        if (code.length > 2 && code.startsWith(' ') && code.endsWith(' ')) code = code.slice(1, -1);
        flush();
        parts.push(markup`<code>${code}</code>`);
        i = end + run.length;
        continue;
      }
      plain += run;
      i += run.length;
      continue;
    }

    if (char === '[') {
      const close = closingBracket(text, i);
      const target =
        close !== -1 && text[close + 1] === '(' ? text.slice(close + 2).match(/^((?:[^\s()]|\([^\s()]*\))*)\)/) : null;
      if (target) {
        const label = inline(text.slice(i + 1, close), baseDir);
        const link = resolveLink(target[1], baseDir);
        flush();
        if (!link) parts.push(label);
        else if (link.external)
          parts.push(markup`<a href="${link.href}" target="_blank" rel="noopener noreferrer">${label}</a>`);
        else parts.push(markup`<a href="${link.href}">${label}</a>`);
        i = close + 2 + target[0].length;
        continue;
      }
    }

    if (text.startsWith('**', i) && text[i + 2] && !/\s/.test(text[i + 2])) {
      const end = text.indexOf('**', i + 2);
      if (end > i + 2 && !/\s/.test(text[end - 1])) {
        flush();
        parts.push(markup`<strong>${inline(text.slice(i + 2, end), baseDir)}</strong>`);
        i = end + 2;
        continue;
      }
    }

    if ((char === '*' || (char === '_' && !isWordChar(text[i - 1]))) && text[i + 1] && !/\s/.test(text[i + 1])) {
      const end = closingDelimiter(text, char, i + 1);
      if (end > i + 1) {
        flush();
        parts.push(markup`<em>${inline(text.slice(i + 1, end), baseDir)}</em>`);
        i = end + 1;
        continue;
      }
    }

    plain += char;
    i += 1;
  }
  flush();
  return markup`${parts}`;
}

// Split a table row on unescaped pipes outside code spans.
function tableCells(line) {
  const cells = [];
  let cell = '';
  let inCode = false;
  const row = line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '');
  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    if (char === '\\' && row[i + 1] === '|') {
      cell += '\\|';
      i += 1;
    } else if (char === '`') {
      inCode = !inCode;
      cell += char;
    } else if (char === '|' && !inCode) {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function renderTable(lines, i, baseDir) {
  const header = tableCells(lines[i]);
  const rows = [];
  let j = i + 2;
  while (j < lines.length && !isBlank(lines[j]) && lines[j].includes('|')) {
    rows.push(tableCells(lines[j]));
    j += 1;
  }
  const head = header.map((cell) => markup`<th>${inline(cell, baseDir)}</th>`);
  const body = rows.map((row) => markup`<tr>${row.map((cell) => markup`<td>${inline(cell, baseDir)}</td>`)}</tr>`);
  return { html: markup`<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`, next: j };
}

function renderList(lines, i, baseDir) {
  const first = lines[i].match(ITEM);
  const indent = first[1].length;
  const ordered = /\d/.test(first[2]);
  const items = [];
  let j = i;

  while (j < lines.length) {
    const match = lines[j].match(ITEM);
    if (!match || match[1].length !== indent || /\d/.test(match[2]) !== ordered) break;
    const contentColumn = match[0].length - match[3].length;
    const body = [match[3]];
    j += 1;
    while (j < lines.length) {
      if (isBlank(lines[j])) {
        const next = lines.slice(j).findIndex((line) => !isBlank(line));
        if (next === -1 || indentOf(lines[j + next]) <= indent) break;
        body.push('');
        j += 1;
        continue;
      }
      const lineIndent = indentOf(lines[j]);
      if (lineIndent <= indent && startsBlock(lines, j)) break;
      if (lineIndent <= indent && isBlank(lines[j - 1])) break;
      body.push(lines[j].slice(Math.min(lineIndent, contentColumn)));
      j += 1;
    }
    items.push(renderItem(body, baseDir));
  }

  if (!ordered) return { html: markup`<ul>${items}</ul>`, next: j };
  const start = Number.parseInt(first[2], 10);
  return {
    html: start === 1 ? markup`<ol>${items}</ol>` : markup`<ol start="${start}">${items}</ol>`,
    next: j
  };
}

// The leading paragraph of an item is inline (tight lists), the rest are blocks.
function renderItem(body, baseDir) {
  let lead = 0;
  while (lead < body.length && !isBlank(body[lead]) && (lead === 0 || !startsBlock(body, lead))) lead += 1;
  let text = body.slice(0, lead).join(' ');
  const rest = renderBlocks(body.slice(lead), baseDir);
  const task = text.match(TASK);
  if (task) {
    text = task[2];
    const label = task[1] === ' ' ? 'Open' : 'Done';
    return markup`<li class="md-task"><span class="md-check" role="img" aria-label="${label}"></span>${inline(text, baseDir)}${rest}</li>`;
  }
  return markup`<li>${inline(text, baseDir)}${rest}</li>`;
}

function renderBlocks(lines, baseDir) {
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      i += 1;
      continue;
    }

    const fence = line.match(FENCE);
    if (fence) {
      const [, indent, marker] = fence;
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith(marker)) {
        code.push(lines[i].slice(Math.min(indentOf(lines[i]), indent.length)));
        i += 1;
      }
      i += 1;
      blocks.push(markup`<pre><code>${code.join('\n')}</code></pre>`);
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      const level = Math.min(heading[1].length + 2, 6);
      blocks.push(markup`<h${level}>${inline(heading[2], baseDir)}</h${level}>`);
      i += 1;
      continue;
    }

    if (RULE.test(line)) {
      blocks.push(markup`<hr>`);
      i += 1;
      continue;
    }

    if (isTableStart(lines, i)) {
      const table = renderTable(lines, i, baseDir);
      blocks.push(table.html);
      i = table.next;
      continue;
    }

    if (QUOTE.test(line)) {
      const quoted = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        quoted.push(lines[i].replace(QUOTE, ''));
        i += 1;
      }
      blocks.push(markup`<blockquote>${renderBlocks(quoted, baseDir)}</blockquote>`);
      continue;
    }

    if (ITEM.test(line)) {
      const list = renderList(lines, i, baseDir);
      blocks.push(list.html);
      i = list.next;
      continue;
    }

    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines, i)) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    blocks.push(markup`<p>${inline(paragraph.join(' '), baseDir)}</p>`);
  }

  return markup`${blocks}`;
}

export function renderMarkdown(source, { baseDir = '' } = {}) {
  return String(renderBlocks(String(source).replace(/\r\n?/g, '\n').split('\n'), baseDir));
}

// T006 (007) The text of one "## " section, from its heading up to the next "## " heading (research R4)
export function extractSection(source, heading) {
  const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((line) => line.trimEnd() === `## ${heading}`);
  if (start === -1) return null;
  let end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  if (end === -1) end = lines.length;
  return `${lines.slice(start, end).join('\n').trimEnd()}\n`;
}
