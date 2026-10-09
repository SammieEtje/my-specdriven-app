// T004 (008) No tag frame on tasks without a tag (contracts/ui-card.md)
import AxeBuilder from '@axe-core/playwright';
import { test, expect, gotoApp } from './fixtures.js';

const card = (page, title) => page.locator('.task-card', { hasText: title });

async function addTask(page, title) {
  await page.fill('#task-input', title);
  await page.click('#add-task-button');
  await expect(card(page, title)).toBeVisible();
}

async function openTask(page, title) {
  await card(page, title).locator('[data-target="task-open"]').click();
  await expect(page.locator('#task-modal')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await gotoApp(page);
});

test('008:FR-001 FR-002 a task without a tag has no tag frame', async ({ page }) => {
  await addTask(page, 'No tag here');
  await expect(card(page, 'No tag here').locator('.tag')).toHaveCount(0);
});

test('008:FR-005 tagged tasks keep their frame', async ({ page }) => {
  const tag = card(page, 'Prepare launch recap').locator('.tag');
  await expect(tag).toHaveCount(1);
  await expect(tag).toHaveText('Marketing');
  await expect(tag).toHaveAttribute('data-spec', /003:FR-003/);
});

test('008:FR-003 adding and clearing a tag in the dialog updates the card', async ({ page }) => {
  await addTask(page, 'Tag me');
  await openTask(page, 'Tag me');
  await page.fill('#task-tag-field', 'Test');
  await expect(card(page, 'Tag me').locator('.tag')).toHaveText('Test');
  await page.fill('#task-tag-field', '');
  await expect(card(page, 'Tag me').locator('.tag')).toHaveCount(0);
});

test('008:FR-001 a tag of only spaces counts as empty', async ({ page }) => {
  await addTask(page, 'Tag me');
  await openTask(page, 'Tag me');
  await page.fill('#task-tag-field', '   ');
  await expect(card(page, 'Tag me').locator('.tag')).toHaveCount(0);
});

test('008:FR-006 Open buttons share one right edge', async ({ page }) => {
  await addTask(page, 'No tag here');
  const edges = [];
  for (const title of ['Prepare launch recap', 'Share spec checklist', 'No tag here']) {
    const box = await card(page, title).locator('[data-target="task-open"]').boundingBox();
    edges.push(box.x + box.width);
  }
  expect(Math.max(...edges) - Math.min(...edges)).toBeLessThanOrEqual(1);
});

test('008:FR-002 a card without a tag passes axe', async ({ page }) => {
  await addTask(page, 'No tag here');
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});

test('008:FR-001 same in every filter and after reload', async ({ page }) => {
  await addTask(page, 'No tag here');
  for (const filter of ['filter-all', 'filter-active']) {
    await page.click(`[data-target="${filter}"]`);
    await expect(card(page, 'No tag here').locator('.tag')).toHaveCount(0);
  }
  // Under Active a checked-off task leaves the list, so check it off under All
  await page.click('[data-target="filter-all"]');
  await card(page, 'No tag here').locator('input[type="checkbox"]').click();
  await page.click('[data-target="filter-completed"]');
  await expect(card(page, 'No tag here')).toBeVisible();
  await expect(card(page, 'No tag here').locator('.tag')).toHaveCount(0);
  await page.reload();
  // A missing card would also have no .tag, so prove the card is there first
  await expect(card(page, 'No tag here')).toBeVisible();
  await expect(card(page, 'No tag here').locator('.tag')).toHaveCount(0);
});

// T006 (008) US2: the line under the title shows only the parts that exist
test('008:FR-004 no separators when owner and tag are empty', async ({ page }) => {
  await addTask(page, 'Bare task');
  await expect(card(page, 'Bare task').locator('.meta')).toHaveText('');
  await card(page, 'Bare task').locator('input[type="checkbox"]').click();
  await expect(card(page, 'Bare task').locator('.meta')).toHaveText('Completed');
});

test('008:FR-004 owner only', async ({ page }) => {
  await addTask(page, 'Bare task');
  await openTask(page, 'Bare task');
  await page.fill('#task-owner-field', 'Ava');
  await page.keyboard.press('Escape');
  await expect(card(page, 'Bare task').locator('.meta')).toHaveText('Ava');
});

test('008:FR-004 unchanged for full metadata', async ({ page }) => {
  await expect(card(page, 'Prepare launch recap').locator('.meta')).toHaveText('Ava · Marketing');
  await expect(card(page, 'Share spec checklist').locator('.meta')).toHaveText('Leo · Product · Completed');
});

test('008:FR-004 meta line carries its trace', async ({ page }) => {
  await expect(card(page, 'Prepare launch recap').locator('.meta')).toHaveAttribute('data-spec', /008:FR-004/);
});
