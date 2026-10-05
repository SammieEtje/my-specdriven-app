// T021 Runtime privacy guard (004:FR-008, constitution V): any request leaving localhost fails the test
import { test as base, expect } from '@playwright/test';

const ORIGIN = 'http://localhost:8000';

export const test = base.extend({
  externalRequestGuard: [
    async ({ context }, use) => {
      const attempted = [];
      await context.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith(ORIGIN) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
        attempted.push(url);
        return route.abort();
      });
      await use(attempted);
      expect(attempted, `constitution V: external request(s) attempted: ${attempted.join(', ')}`).toEqual([]);
    },
    { auto: true }
  ]
});

export { expect };

// T008 (005) Open the app and wait until its script is ready (Add task is enabled once handlers are attached)
export async function gotoApp(page) {
  await page.goto('/');
  await expect(page.locator('#add-task-button')).toBeEnabled();
}
