// T001 Browser tests for feature 005 (completing the 001 core flow). Each test gets a fresh context, so storage starts empty.
import { test, expect, gotoApp } from './fixtures.js';

const titles = (page) => page.locator('#task-list .task-title');

test.beforeEach(async ({ page }) => {
  await gotoApp(page);
});

// T004 User story 1: add a task

test('005:FR-001 Enter in the input adds a task', async ({ page }) => {
  await page.fill('#task-input', 'Pressed Enter');
  await page.press('#task-input', 'Enter');
  await expect(titles(page).last()).toHaveText('Pressed Enter');
});

test('005:FR-003 input is cleared and keeps focus after adding', async ({ page }) => {
  await page.fill('#task-input', 'Keep typing');
  await page.click('#add-task-button');
  await expect(page.locator('#task-input')).toHaveValue('');
  await expect(page.locator('#task-input')).toBeFocused();
});

test('005:FR-004 blank title is refused with a linked error', async ({ page }) => {
  const before = await titles(page).count();
  await page.fill('#task-input', '   ');
  await page.click('#add-task-button');
  await expect(titles(page)).toHaveCount(before);
  const input = page.locator('#task-input');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', 'task-input-error');
  await expect(page.locator('#task-input-error')).toHaveText('Enter a task title.');

  await input.press('a');
  await expect(page.locator('#task-input-error')).toHaveText('');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
});

test('005:FR-011 a cleared title in the dialog is restored on close', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-1"]');
  await page.fill('#task-title-field', '');
  await page.keyboard.press('Escape');
  await expect(titles(page).first()).toHaveText('Prepare launch recap');
});

test('005:FR-012 a title with HTML renders as text', async ({ page }) => {
  await page.fill('#task-input', '<b>x</b>');
  await page.click('#add-task-button');
  await expect(titles(page).last()).toHaveText('<b>x</b>');
  await expect(page.locator('#task-list b')).toHaveCount(0);
});

// T012 User story 2: filters

test('005:FR-005 checking off under Active hides the task immediately', async ({ page }) => {
  await page.click('[data-target="filter-active"]');
  await page.click('[data-target="task-toggle-task-1"]');
  await expect(titles(page).filter({ hasText: 'Prepare launch recap' })).toHaveCount(0);
});

test('005:FR-005 adding under Completed adds it to Active and announces it', async ({ page }) => {
  await page.click('[data-target="filter-completed"]');
  await page.fill('#task-input', 'X');
  await page.click('#add-task-button');
  const status = page.locator('#app-status');
  await expect(status).toHaveAttribute('role', 'status');
  await expect(status).toHaveText('Task added to Active');
  await expect(titles(page).filter({ hasText: /^X$/ })).toHaveCount(0);
  await page.click('[data-target="filter-active"]');
  await expect(titles(page).filter({ hasText: /^X$/ })).toHaveCount(1);
});

test('005:FR-006 selected filter is exposed with aria-pressed', async ({ page }) => {
  await page.click('[data-target="filter-completed"]');
  await expect(page.locator('[data-target="filter-completed"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-target="filter-all"]')).toHaveAttribute('aria-pressed', 'false');
});

test('005:SC-003 keyboard-only: add, check off, and find under Completed within 10 seconds', async ({ page }) => {
  const start = Date.now();
  await page.focus('#task-input');
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('Keyboard task');
  await page.keyboard.press('Enter');
  // From the input, Tab to the new task's checkbox: Add task, three filters, then each row's checkbox and Open button
  const checkbox = page
    .locator('#task-list .task-card', { hasText: 'Keyboard task' })
    .locator('input[type="checkbox"]');
  for (let press = 0; press < 20; press += 1) {
    await page.keyboard.press('Tab');
    if (await checkbox.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('Space');
  for (let press = 0; press < 20; press += 1) {
    await page.keyboard.press('Shift+Tab');
    if (await page.evaluate(() => document.activeElement?.dataset.target === 'filter-completed')) break;
  }
  await page.keyboard.press('Enter');
  await expect(titles(page).filter({ hasText: 'Keyboard task' })).toHaveCount(1);
  expect(Date.now() - start).toBeLessThan(10000);
});

// T018 User story 3: empty state

test('005:FR-007 empty state shows filter-specific text and hides the list', async ({ page }) => {
  await page.click('[data-target="task-toggle-task-1"]');
  await page.click('[data-target="filter-active"]');
  await expect(page.locator('#empty-state h3')).toHaveText('No active tasks');
  await expect(page.locator('#task-list')).toBeHidden();
});

test('005:FR-007 empty state disappears when a task matches again', async ({ page }) => {
  await page.click('[data-target="filter-completed"]');
  await page.click('[data-target="task-toggle-task-2"]');
  await expect(page.locator('#empty-state h3')).toHaveText('No completed tasks');
  await page.click('[data-target="filter-active"]');
  await expect(page.locator('#empty-state')).toBeHidden();
  await expect(page.locator('#task-list')).toBeVisible();
});

// T023 User story 4: persistence

test('005:FR-008 add, check off and edit survive a reload', async ({ page }) => {
  await page.fill('#task-input', 'Saved without Persist');
  await page.press('#task-input', 'Enter');
  await page.click('[data-target="task-toggle-task-1"]');
  await page.click('[data-target="task-open"][data-task-id="task-2"]');
  await page.fill('#task-title-field', 'Edited and saved');
  await page.keyboard.press('Escape');

  await page.reload();
  await expect(page.locator('#add-task-button')).toBeEnabled();
  await expect(titles(page)).toHaveText(['Prepare launch recap', 'Edited and saved', 'Saved without Persist']);
  await expect(page.locator('#task-list .task-card').first()).toHaveClass(/\bcompleted\b/);
});

test('005:FR-009 corrupt stored state falls back to the example tasks', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('spec-driven-todo-demo', '{broken'));
  await page.reload();
  await expect(titles(page)).toHaveText(['Prepare launch recap', 'Share spec checklist']);
});

test('005:FR-010 Persist announces "Demo state saved"', async ({ page }) => {
  await page.click('#save-state');
  await expect(page.locator('#app-status')).toHaveText('Demo state saved');
});

test('005:FR-008 the demo keeps working when storage is blocked', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
    Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
  });
  await gotoApp(page);
  await expect(titles(page)).toHaveText(['Prepare launch recap', 'Share spec checklist']);
  await page.fill('#task-input', 'In memory');
  await page.press('#task-input', 'Enter');
  await page.click('[data-target="filter-active"]');
  await expect(titles(page)).toHaveText(['Prepare launch recap', 'In memory']);
  expect(errors).toEqual([]);
});
