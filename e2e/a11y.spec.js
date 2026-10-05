// T023 WCAG 2.1 AA checks with axe (004:FR-009, constitution IV)
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures.js';
import { loadExceptions } from './a11y-exceptions.js';

async function seriousViolations(page) {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  for (const { selector } of loadExceptions()) builder = builder.exclude(selector);
  const { violations } = await builder.analyze();
  return violations
    .filter((violation) => ['serious', 'critical'].includes(violation.impact))
    .map(
      (violation) =>
        `${violation.id} (${violation.impact}) at ${violation.nodes[0]?.target.join(' ')}: ${violation.helpUrl}`
    );
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('004:FR-009 initial page has no serious/critical WCAG 2.1 AA violations', async ({ page }) => {
  expect(await seriousViolations(page)).toEqual([]);
});

test('004:FR-009 open task dialog has no serious/critical WCAG 2.1 AA violations', async ({ page }) => {
  await page.click('[data-target="task-open"][data-task-id="task-1"]');
  await expect(page.locator('#task-modal')).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test('004:FR-009 after filtering there are no serious/critical WCAG 2.1 AA violations', async ({ page }) => {
  await page.click('[data-target="filter-active"]');
  expect(await seriousViolations(page)).toEqual([]);
});
