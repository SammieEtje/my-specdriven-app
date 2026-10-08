// T010 (007) Phase tabs with the real Spec Kit documents (contracts/ui-panel.md)
import { test, expect, gotoApp } from './fixtures.js';

const panel = '#phase-panel';
const source = `${panel} .doc-source`;

async function openTab(page, phase) {
  await page.click(`#tab-${phase}`);
  await expect(page.locator(panel)).not.toHaveAttribute('aria-busy', 'true');
}

test.beforeEach(async ({ page }) => {
  await gotoApp(page);
});

test('007:FR-001 six phase tabs in order', async ({ page }) => {
  await expect(page.locator('#phase-tabs [role="tab"]')).toHaveText([
    'specify',
    'clarify',
    'plan',
    'tasks',
    'analyze',
    'implement'
  ]);
  await expect(page.locator('#tab-specify')).toHaveAttribute('aria-selected', 'true');
});

test('007:FR-002 FR-003 specify shows spec.md of the first linked feature', async ({ page }) => {
  await expect(page.locator('#spec-selection')).toContainText('add-task-button');
  await expect(page.locator('#spec-selection')).toContainText('003');
  await expect(page.locator(source)).toHaveText('specs/003-adopt-polderworks-design/spec.md');
  await expect(page.locator(`${panel} .md-body h3`).first()).toContainText('Polderworks-designsysteem adopteren');
});

test('007:FR-004 plan tab lists supporting documents', async ({ page }) => {
  await openTab(page, 'plan');
  await expect(page.locator('#doc-switcher button')).toHaveText(['plan.md', 'research.md', 'quickstart.md']);
  await page.click('#doc-switcher button:has-text("research.md")');
  await expect(page.locator(source)).toHaveText('specs/003-adopt-polderworks-design/research.md');
});

test('007:FR-005 clarify, analyze, implement show their sections', async ({ page }) => {
  await openTab(page, 'clarify');
  await expect(page.locator(source)).toContainText('specs/003-adopt-polderworks-design/spec.md');
  await expect(page.locator(source)).toContainText('Clarifications');
  await expect(page.locator(`${panel} .md-body h4`).first()).toHaveText('Clarifications');
  for (const phase of ['analyze', 'implement']) {
    await openTab(page, phase);
    await expect(page.locator(source)).toContainText('specs/003-adopt-polderworks-design/prompts.md');
    await expect(page.locator(`${panel} .md-body h4`).first()).toHaveText(`Phase: ${phase}`);
  }
});

test('007:FR-009 missing phase shows a notice', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-1"]');
  await page.click('#task-title-field'); // carries 001:FR-005 first
  await page.keyboard.press('Escape');
  await expect(page.locator('#spec-selection')).toContainText('001');
  await openTab(page, 'clarify');
  const notice = page.locator(`${panel} .doc-notice`);
  await expect(notice).toContainText('The clarify phase has not been run for feature 001 yet.');
  await expect(notice).toContainText('specs/001-spec-driven-todo-demo/spec.md');
});

test('007:FR-010 document HTML is not executed', async ({ page }) => {
  await page.route('**/specs/003-adopt-polderworks-design/tasks.md', (route) =>
    route.fulfill({ contentType: 'text/markdown', body: '# T\n\n<img src=x onerror="window.__xss=1">' })
  );
  await openTab(page, 'tasks');
  await expect(page.locator(`${panel} .md-body`)).toContainText('<img src=x onerror="window.__xss=1">');
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  await expect(page.locator(`${panel} .md-body img`)).toHaveCount(0);
});

test('007:FR-009 SC-006 unreachable document', async ({ page }) => {
  await page.route('**/specs/003-adopt-polderworks-design/tasks.md', (route) => route.abort());
  await openTab(page, 'tasks');
  await expect(page.locator(`${panel} .doc-notice`)).toContainText('This document could not be loaded.');
  await expect(page.locator(`${panel} .doc-notice`)).toContainText('specs/003-adopt-polderworks-design/tasks.md');
  await page.fill('#task-input', 'Still works');
  await page.click('#add-task-button');
  await expect(page.locator('#task-list .task-title', { hasText: 'Still works' })).toBeVisible();
});

test('007:FR-012 old trace is gone', async ({ page }) => {
  for (const selector of ['#trace-object', '#phase-list', '#trace-feature-id']) {
    await expect(page.locator(selector)).toHaveCount(0);
  }
});

test('007:FR-009 unknown feature in a trace', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.evaluate(() =>
    document.querySelector('[data-target="app-header"]').setAttribute('data-spec', '999:FR-001')
  );
  await page.click('[data-target="app-header"]');
  await expect(page.locator(`${panel} .doc-notice`)).toHaveText('There is no folder for feature 999 in specs/.');
  expect(errors).toEqual([]);
});

test('007:SC-003 a tab shows its document within 1 second', async ({ page }) => {
  const started = Date.now();
  await page.click('#tab-tasks');
  await expect(page.locator(source)).toHaveText('specs/003-adopt-polderworks-design/tasks.md');
  await expect(page.locator(`${panel} .md-body`)).toBeVisible();
  expect(Date.now() - started).toBeLessThanOrEqual(1000);
});

// T020 (007) US2: switching between linked features
test('007:FR-007 switcher shows linked features, first is chosen', async ({ page }) => {
  await expect(page.locator('#feature-switcher')).toBeVisible();
  await expect(page.locator('#feature-switcher button')).toHaveText(['003', '005']);
  await expect(page.locator('#feature-switcher button', { hasText: '003' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#feature-switcher button', { hasText: '005' })).toHaveAttribute('aria-pressed', 'false');
});

test('007:FR-007 choosing 005 loads its documents', async ({ page }) => {
  await page.click('#feature-switcher button:has-text("005")');
  await expect(page.locator(source)).toHaveText('specs/005-complete-core-flow/spec.md');
  await expect(page.locator('#spec-selection')).toContainText('005');
  await openTab(page, 'plan');
  await expect(page.locator('#doc-switcher button', { hasText: 'contracts/ui-behaviour.md' })).toBeVisible();
});

test('007:FR-007 single feature hides the switcher', async ({ page }) => {
  await page.click('[data-target="app-header"]');
  await expect(page.locator('#feature-switcher')).toBeHidden();
});

test('007:FR-008 phase tab survives a new selection', async ({ page }) => {
  await openTab(page, 'tasks');
  await page.click('[data-target="app-header"]');
  await expect(page.locator('#tab-tasks')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator(source)).toHaveText('specs/003-adopt-polderworks-design/tasks.md');
});

test('007:FR-008 plan sub-choice resets on feature change', async ({ page }) => {
  await openTab(page, 'plan');
  await page.click('#doc-switcher button:has-text("research.md")');
  await expect(page.locator(source)).toHaveText('specs/003-adopt-polderworks-design/research.md');
  await page.click('#feature-switcher button:has-text("005")');
  await expect(page.locator(source)).toHaveText('specs/005-complete-core-flow/plan.md');
});

// T024 (007) Narrow screens: tabs wrap, no horizontal page scroll (edge case "Smalle schermen")
test('007:FR-011 narrow screen has no horizontal page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const phase of ['specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement']) {
    await expect(page.locator(`#tab-${phase}`)).toBeVisible();
  }
  await openTab(page, 'tasks');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
