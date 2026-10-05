import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// T003 Shared helpers for static design-system checks (feature 003).

const TOKENS_DIR = './.claude/skills/polderworks-design/tokens';

function readFile(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function cssRules(css) {
  const source = stripComments(css).replace(/^\s*@import[^;]*;/gm, '');
  const rules = [];

  for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const declarations = match[2]
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf(':');
        return { property: part.slice(0, index).trim(), value: part.slice(index + 1).trim() };
      });
    rules.push({ selector: match[1].trim(), declarations });
  }

  return rules;
}

function declarations(css) {
  return cssRules(css).flatMap((rule) =>
    rule.declarations.map((declaration) => ({ selector: rule.selector, ...declaration }))
  );
}

function loadPalette() {
  const source = stripComments(readFile(`${TOKENS_DIR}/colors.css`));
  const rootBlock = source.match(/:root\s*\{([^}]*)\}/)[1];
  const raw = {};

  for (const match of rootBlock.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    raw[match[1]] = match[2].trim();
  }

  const resolve = (name, seen = new Set()) => {
    const value = raw[name];
    if (!value || seen.has(name)) return null;
    if (/^#[0-9a-f]{6}$/i.test(value)) return value;
    const alias = value.match(/^var\((--[\w-]+)\)$/);
    return alias ? resolve(alias[1], new Set([...seen, name])) : null;
  };

  return Object.fromEntries(
    Object.keys(raw)
      .map((name) => [name, resolve(name)])
      .filter(([, hex]) => hex)
  );
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const [light, dark] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

test('T003 contrast helper matches the WCAG reference value for navy-ink on ice', () => {
  const palette = loadPalette();
  assert.equal(contrastRatio(palette['--pw-navy-ink'], palette['--pw-ice']).toFixed(2), '12.62');
});

const NAMED_COLOURS =
  /\b(white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|navy|teal|gold|maroon|olive|lime|aqua|fuchsia|brown|violet|indigo|cyan|magenta)\b/i;
const COLOUR_PROPERTIES =
  /^(color|background|background-color|border|border-(top|right|bottom|left)(-color)?|border-color|outline|outline-color|box-shadow|fill|stroke|accent-color|text-decoration-color)$/;

function withoutVars(value) {
  return value.replace(/var\(--[\w-]+\)/g, '');
}

// T009
test('FR-001 only design-system colours', () => {
  for (const { selector, property, value } of declarations(readFile('./styles.css'))) {
    if (!COLOUR_PROPERTIES.test(property)) continue;
    const bare = withoutVars(value);
    assert.doesNotMatch(bare, /#[0-9a-f]{3,8}\b/i, `${selector} { ${property} } uses a hex colour`);
    assert.doesNotMatch(bare, /\b(rgba?|hsla?)\(/i, `${selector} { ${property} } uses a colour function`);
    assert.doesNotMatch(bare, NAMED_COLOURS, `${selector} { ${property} } uses a named colour`);
  }

  for (const file of ['./index.html', './app.js']) {
    const source = readFile(file);
    assert.doesNotMatch(source, /style="/, `${file} has an inline style attribute`);
    assert.doesNotMatch(source, /\.style\./, `${file} sets inline styles from script`);
    assert.doesNotMatch(source, /rgba?\(|#[0-9a-f]{6}\b/i, `${file} contains a colour literal`);
  }
});

// T010
test('FR-002 IBM Plex only', () => {
  for (const { selector, property, value } of declarations(readFile('./styles.css'))) {
    if (property !== 'font-family') continue;
    assert.ok(
      ['var(--font-sans)', 'var(--font-mono)', 'inherit'].includes(value),
      `${selector} uses font-family ${value}`
    );
  }
  assert.doesNotMatch(readFile('./styles.css'), /\bInter\b/);

  const fontsCss = readFile('./fonts/fonts.css');
  const families = new Set([...fontsCss.matchAll(/font-family:\s*'([^']+)'/g)].map((match) => match[1]));
  assert.deepEqual([...families].sort(), ['IBM Plex Mono', 'IBM Plex Sans']);
  for (const [, file] of fontsCss.matchAll(/url\('\.\/([^']+\.woff2)'\)/g)) {
    assert.doesNotThrow(() => readFileSync(new URL(`./fonts/${file}`, import.meta.url)), `missing font file ${file}`);
  }
});

// T011
test('FR-003 square geometry, no gradients', () => {
  const css = stripComments(readFile('./styles.css'));
  assert.doesNotMatch(css, /gradient\(/);
  assert.doesNotMatch(css, /999px/);
  assert.doesNotMatch(css, /text-shadow/);

  for (const { selector, property, value } of declarations(css)) {
    if (property === 'border-radius' && !selector.includes('status-dot')) {
      assert.ok(
        ['0', 'var(--radius-none)', 'var(--radius-xs)', 'var(--radius-sm)'].includes(value),
        `${selector} has border-radius ${value}`
      );
      // T046 Only controls may be rounded (FR-003)
      if (/--radius-(xs|sm)/.test(value)) {
        for (const part of selector.split(',')) {
          assert.match(part.trim(), /^(\.btn\b|input\b|textarea\b)/, `${part.trim()} is not a control but is rounded`);
        }
      }
    }
    if (property === 'box-shadow' && value !== 'none') {
      assert.match(value, /^var\(--shadow-(sm|md|lg)\)$/, `${selector} has box-shadow ${value}`);
      assert.match(selector, /\.task-modal\b|\.callout\b/, `${selector} has a shadow on static content`);
    }
  }

  // T046
  assert.ok(
    dataSpecTokens(elementTag(readFile('./index.html'), 'class', 'badge')).includes('003:FR-003'),
    'badge lacks 003:FR-003'
  );
});

// T012
test('FR-004 spacing and type scale', () => {
  const spacing =
    /^(padding|margin|gap|row-gap|column-gap|top|right|bottom|left|inset)(-(top|right|bottom|left|inline|block))?$/;

  for (const { selector, property, value } of declarations(readFile('./styles.css'))) {
    if (spacing.test(property)) {
      const rest = value
        .replace(/var\(--(space-\d+|border-width-[a-z]+)\)/g, '')
        .replace(/\b(calc|auto)\b/g, '')
        .split(/[\s()*+]+/)
        .filter(Boolean);
      assert.ok(
        rest.every((token) => token === '0' || token === '-1'),
        `${selector} { ${property}: ${value} } is off the spacing scale`
      );
    }
    if (property === 'font-size') {
      assert.match(value, /^(var\(--text-[\w-]+-size\)|inherit)$/, `${selector} has font-size ${value}`);
    }
    if (property === 'font-weight') {
      assert.match(value, /^(var\(--weight-[a-z]+\)|inherit)$/, `${selector} has font-weight ${value}`);
    }
  }
});

// T013
test('FR-010 contrast and forbidden text colours', () => {
  const palette = loadPalette();
  const ratio = (fg, bg) => contrastRatio(palette[fg], palette[bg]);

  for (const fg of ['--text-primary', '--text-secondary']) {
    for (const bg of ['--surface-page', '--surface-card']) {
      assert.ok(ratio(fg, bg) >= 4.5, `${fg} on ${bg} is ${ratio(fg, bg).toFixed(2)}`);
    }
  }
  for (const bg of ['--pw-navy-ink', '--pw-channel-teal']) {
    assert.ok(ratio('--text-inverse', bg) >= 4.5, `--text-inverse on ${bg}`);
  }
  assert.ok(ratio('--text-link', '--surface-card') >= 4.5, '--text-link on --surface-card');
  for (const fg of ['--focus-ring', '--border-strong']) {
    for (const bg of ['--surface-page', '--surface-card']) {
      assert.ok(ratio(fg, bg) >= 3, `${fg} on ${bg} is ${ratio(fg, bg).toFixed(2)}`);
    }
  }

  const forbidden = /--(pw-eu-gold|accent-gold|pw-pilot-red|status-blocker-fg|pw-success-green|status-clear-fg)\b/;
  for (const { selector, property, value } of declarations(readFile('./styles.css'))) {
    if (property === 'color') assert.doesNotMatch(value, forbidden, `${selector} uses a forbidden text colour`);
  }
});

// T014
test('FR-011, FR-013, FR-014 offline, copy and branding', () => {
  for (const file of ['./styles.css', './fonts/fonts.css', './index.html']) {
    const source = readFile(file);
    assert.doesNotMatch(source, /https?:\/\//, `${file} references a remote URL`);
    assert.doesNotMatch(source, /googleapis|gstatic/, `${file} references Google Fonts`);
  }

  for (const file of ['./index.html', './app.js', './logic.js']) {
    const source = readFile(file);
    assert.doesNotMatch(source, /—/, `${file} contains an em-dash`);
    assert.doesNotMatch(source, /\p{Extended_Pictographic}/u, `${file} contains an emoji`);
  }

  const html = readFile('./index.html');
  assert.doesNotMatch(html, /Polderworks|Loods/);
  assert.doesNotMatch(html, /<img|<svg/);
  assert.match(html, /<h1>To-do board<\/h1>/);
  assert.match(html, /<title>Spec-Driven To-Do Demo<\/title>/);
});

function elementTag(html, attribute, value) {
  const match = html.match(new RegExp(`<[a-z]+[^>]*${attribute}="${value}"[^>]*>`, 's'));
  assert.ok(match, `no element with ${attribute}="${value}"`);
  return match[0];
}

function dataSpecTokens(tag) {
  return (tag.match(/data-spec="([^"]*)"/)?.[1] ?? '').split(/\s+/).filter(Boolean);
}

// T044
test('FR-012 existing hooks preserved', () => {
  const html = readFile('./index.html');
  const app = readFile('./app.js');
  const targets = [
    'task-input',
    'add-task-button',
    'filter-all',
    'filter-active',
    'filter-completed',
    'task-list',
    'empty-state',
    'save-state',
    'task-modal',
    'task-modal-close',
    'task-title-field',
    'task-description-field',
    'task-tag-field',
    'task-owner-field'
  ];

  for (const target of targets) {
    assert.doesNotMatch(
      elementTag(html, 'data-target', target),
      /tabindex="-1"/,
      `${target} was removed from the tab order`
    );
  }
  assert.match(app, /data-target="task-toggle-\$\{task\.id\}"/);
  assert.match(app, /data-target="task-open"/);

  const specTokens = {
    'task-modal': '001:FR-004',
    'task-modal-close': '001:FR-012',
    'task-title-field': '001:FR-005',
    'task-description-field': '001:FR-005',
    'task-tag-field': '001:FR-005',
    'task-owner-field': '001:FR-005'
  };
  for (const [target, token] of Object.entries(specTokens)) {
    assert.ok(dataSpecTokens(elementTag(html, 'data-target', target)).includes(token), `${target} lost ${token}`);
  }

  assert.match(app, /event\.key === 'Escape'/);
  assert.match(app, /openButton\?\.focus\(\)/);
});

function cssRule(css, selector) {
  return cssRules(css).filter((rule) =>
    rule.selector
      .split(',')
      .map((part) => part.trim())
      .includes(selector)
  );
}

function cssValue(css, selector, property) {
  const values = cssRule(css, selector).flatMap((rule) =>
    rule.declarations.filter((d) => d.property === property).map((d) => d.value)
  );
  return values.at(-1);
}

// T023
test('FR-005 button variants', () => {
  const html = readFile('./index.html');
  const app = readFile('./app.js');
  const css = readFile('./styles.css');

  assert.match(elementTag(html, 'id', 'add-task-button'), /class="[^"]*\bbtn btn-primary\b/);
  assert.match(elementTag(html, 'id', 'save-state'), /class="[^"]*\bbtn btn-ghost\b/);
  assert.match(elementTag(html, 'data-target', 'task-modal-close'), /class="[^"]*\bbtn btn-secondary\b/);
  assert.match(app, /class="task-open-button feature-target btn btn-secondary/);

  assert.match(cssValue(css, '.btn-primary:hover', 'background') ?? '', /^var\(--(accent-teal|pw-channel-teal)\)$/);
  for (const { selector, property, value } of declarations(css)) {
    if (!selector.includes('.btn')) continue;
    assert.ok(!['transition', 'animation', 'transform'].includes(property), `${selector} animates (${property})`);
    if (property === 'box-shadow') assert.equal(value, 'none', `${selector} has a shadow`);
  }
});

// T024
test('FR-006 form controls and filters', () => {
  const html = readFile('./index.html');
  const css = readFile('./styles.css');

  for (const [tag, id] of html.matchAll(/<(?:input|textarea)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    assert.ok(/aria-label="/.test(tag) || html.includes(`for="${id}"`), `#${id} has no accessible name`);
  }

  const pressed = ['filter-all', 'filter-active', 'filter-completed'].map(
    (target) => elementTag(html, 'data-target', target).match(/aria-pressed="(true|false)"/)?.[1]
  );
  assert.deepEqual(pressed, ['true', 'false', 'false']);

  assert.match(cssValue(css, 'input[type="text"]', 'border') ?? '', /var\(--text-secondary\)/);
  assert.match(cssValue(css, 'textarea', 'border') ?? '', /var\(--text-secondary\)/);
  const underline = cssValue(css, '.filter-btn[aria-pressed="true"]', 'border-bottom-color');
  assert.equal(underline, 'var(--border-strong)');
  assert.equal(cssValue(css, 'input[type="checkbox"]', 'accent-color'), 'var(--pw-navy-ink)');
  // T045 The task checkbox carries its 003 trace token (Constitution III)
  assert.match(
    readFile('./app.js'),
    /<input class="feature-target" data-target="task-toggle-\$\{task\.id\}" data-spec="003:FR-006" type="checkbox"/
  );
});

// T025
test('FR-007 and FR-008 focus and dialog', () => {
  const css = readFile('./styles.css');
  const html = readFile('./index.html');

  assert.match(cssValue(css, ':focus-visible', 'outline') ?? '', /var\(--focus-ring\)/);
  for (const { selector, property, value } of declarations(css)) {
    if (property === 'outline' && /^(none|0)$/.test(value)) {
      assert.match(selector, /:focus-visible/, `${selector} removes the outline`);
    }
  }

  assert.ok(['0', 'var(--radius-none)'].includes(cssValue(css, '.task-modal', 'border-radius')));
  assert.equal(cssValue(css, '.task-modal', 'background'), 'var(--surface-card)');
  assert.equal(cssValue(css, '.task-modal', 'box-shadow'), 'var(--shadow-lg)');
  assert.ok(cssRule(css, '.task-modal::backdrop').length, 'missing .task-modal::backdrop');

  const tokens = dataSpecTokens(elementTag(html, 'data-target', 'task-modal'));
  assert.ok(tokens.includes('001:FR-004') && tokens.includes('003:FR-008'));
});

// T034
test('FR-009 code block and callout', () => {
  const css = readFile('./styles.css');
  const html = readFile('./index.html');

  assert.equal(cssValue(css, '.trace-object', 'font-family'), 'var(--font-mono)');
  assert.equal(cssValue(css, '.trace-object', 'background'), 'var(--surface-sunken)');
  assert.match(
    cssValue(css, '.trace-object', 'border') ?? '',
    /var\(--border-width-hairline\) solid var\(--border-default\)/
  );
  assert.ok(['0', 'var(--radius-none)'].includes(cssValue(css, '.trace-object', 'border-radius')));
  assert.equal(cssValue(css, '.trace-object', 'overflow-x'), 'auto');

  assert.match(
    cssValue(css, '.phase-item', 'border-bottom') ?? '',
    /var\(--border-width-hairline\) solid var\(--border-default\)/
  );
  assert.ok([undefined, 'none', 'transparent'].includes(cssValue(css, '.phase-item', 'background')));

  assert.match(cssValue(css, '.callout', 'border-left') ?? '', /^var\(--border-width-accent\) solid /);
  assert.ok([undefined, 'var(--surface-card)'].includes(cssValue(css, '.callout', 'background')));

  for (const id of ['trace-object', 'phase-list']) {
    assert.ok(dataSpecTokens(elementTag(html, 'id', id)).includes('003:FR-009'), `#${id} lacks 003:FR-009`);
  }
});
