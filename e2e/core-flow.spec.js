// T025 The full 001 core flow in the browser (004:FR-011). Known 001 gaps are not skipped (clarification Q1).
import { test, expect, gotoApp } from './fixtures.js';

const rows = (page) => page.locator('#task-list .task-card');

test.beforeEach(async ({ page }) => {
  await gotoApp(page);
});

test('001:US5 add a task from the input', async ({ page }) => {
  await page.fill('#task-input', 'Write CI docs');
  await page.click('#add-task-button');
  await expect(page.locator('#task-list .task-title', { hasText: 'Write CI docs' })).toBeVisible();
});

test('001:FR-002 check off and un-check a task', async ({ page }) => {
  const row = rows(page).first();
  const checkbox = page.locator('[data-target="task-toggle-task-1"]');
  await checkbox.click();
  await expect(row).toHaveClass(/\bcompleted\b/);
  await page.locator('[data-target="task-toggle-task-1"]').click();
  await expect(rows(page).first()).not.toHaveClass(/\bcompleted\b/);
});

test('001:FR-008 filter All, Active, Completed', async ({ page }) => {
  await page.click('[data-target="filter-active"]');
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).not.toHaveClass(/\bcompleted\b/);

  await page.click('[data-target="filter-completed"]');
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toHaveClass(/\bcompleted\b/);

  await page.click('[data-target="filter-all"]');
  await expect(rows(page)).toHaveCount(2);
});

test('001:FR-009 empty state when a filter has no tasks', async ({ page }) => {
  await page.click('[data-target="task-toggle-task-1"]');
  await page.click('[data-target="filter-active"]');
  await expect(page.locator('#empty-state')).toBeVisible();
});

test('001:FR-003 FR-005 FR-011 open, edit, see the row update', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-2"]');
  await page.fill('#task-title-field', 'Edited in the dialog');
  await expect(page.locator('#task-list .task-title', { hasText: 'Edited in the dialog' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.click('[data-target="task-open"][data-task-id="task-2"]');
  await expect(page.locator('#task-title-field')).toHaveValue('Edited in the dialog');
});

test('001:FR-012 close with the Close button returns focus to Open', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-1"]');
  await page.click('[data-target="task-modal-close"]');
  await expect(page.locator('#task-modal')).not.toBeVisible();
  await expect(page.locator('[data-target="task-open"][data-task-id="task-1"]')).toBeFocused();
});

test('001:FR-012 close with Escape returns focus to Open', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-1"]');
  await page.keyboard.press('Escape');
  await expect(page.locator('#task-modal')).not.toBeVisible();
  await expect(page.locator('[data-target="task-open"][data-task-id="task-1"]')).toBeFocused();
});

test('001:FR-010 persist, reload, tasks remain', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-1"]');
  await page.fill('#task-title-field', 'Survives a reload');
  await page.keyboard.press('Escape');
  await page.click('#save-state');
  await page.reload();
  await expect(page.locator('#task-list .task-title', { hasText: 'Survives a reload' })).toBeVisible();
});

// T011 (007) The panel now shows the real documents of the element's features, one tab per phase
test('001:FR-006 FR-007 click an element, trace panel shows its spec', async ({ page }) => {
  await page.click('#add-task-button');
  await expect(page.locator('#spec-selection')).toContainText('add-task-button');
  await expect(page.locator('#phase-tabs [role="tab"]')).toHaveCount(6);
  await expect(page.locator('#phase-tabs')).toBeVisible();
  await page.click('[data-target="app-header"]');
  await expect(page.locator('#spec-selection')).toContainText('app-header');
  await expect(page.locator('#spec-selection')).toContainText('003');
});
