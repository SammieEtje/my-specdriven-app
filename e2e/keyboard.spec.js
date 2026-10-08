// T024 Every control is reachable by keyboard and shows visible focus (004:FR-010, constitution IV)
import { test, expect, gotoApp } from './fixtures.js';

test('004:FR-010 every control receives visible focus', async ({ page }) => {
  await gotoApp(page);

  const expected = await page.$$eval('button, input, textarea, [tabindex="0"]', (elements) =>
    elements
      .filter((element) => !element.closest('dialog'))
      // T019 (007) Roving tabindex: only the active phase tab is in the Tab order (research R6)
      .filter((element) => !element.matches('[role="tab"][tabindex="-1"]'))
      .map((element) => [element.dataset.target || element.id, element.dataset.taskId].filter(Boolean).join('#'))
  );

  const reached = new Set();
  const invisible = [];
  for (let press = 0; press < 40; press += 1) {
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      const style = getComputedStyle(element);
      return {
        key: [element.dataset.target || element.id, element.dataset.taskId].filter(Boolean).join('#'),
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth)
      };
    });
    if (!focus) break;
    if (reached.has(focus.key)) break;
    reached.add(focus.key);
    if (focus.outlineStyle === 'none' || focus.outlineWidth < 2) invisible.push(focus.key);
  }

  expect(invisible, 'controls without a visible focus ring').toEqual([]);
  expect(
    expected.filter((key) => !reached.has(key)),
    'controls not reachable with Tab'
  ).toEqual([]);
});

// T022 (007) WAI-ARIA Tabs: arrow keys, Home and End, then into the document (research R6)
test('007:FR-011 arrow keys, Home and End move between tabs', async ({ page }) => {
  await gotoApp(page);
  await page.focus('#tab-specify');

  const steps = [
    ['ArrowRight', 'tab-clarify'],
    ['End', 'tab-implement'],
    ['ArrowRight', 'tab-specify'],
    ['ArrowLeft', 'tab-implement'],
    ['Home', 'tab-specify']
  ];
  for (const [key, expected] of steps) {
    await page.keyboard.press(key);
    const state = await page.evaluate(() => ({
      focused: document.activeElement.id,
      selected: [...document.querySelectorAll('[role="tab"][aria-selected="true"]')].map((tab) => tab.id),
      inOrder: [...document.querySelectorAll('[role="tab"][tabindex="0"]')].map((tab) => tab.id)
    }));
    expect(state, `after ${key}`).toEqual({ focused: expected, selected: [expected], inOrder: [expected] });
  }

  await expect(page.locator('#phase-panel')).not.toHaveAttribute('aria-busy', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#phase-panel')).toBeFocused();
  const pageScroll = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => page.locator('#phase-panel').evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
});
