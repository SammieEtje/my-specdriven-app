// T024 Every control is reachable by keyboard and shows visible focus (004:FR-010, constitution IV)
import { test, expect } from './fixtures.js';

test('004:FR-010 every control receives visible focus', async ({ page }) => {
  await page.goto('/');

  const expected = await page.$$eval('button, input, textarea, [tabindex="0"]', (elements) =>
    elements
      .filter((element) => !element.closest('dialog'))
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
