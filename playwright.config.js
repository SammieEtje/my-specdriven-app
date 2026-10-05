// T005 Browser checks for the usability gate (FR-009 to FR-011)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.spec.js',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://localhost:8000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve.js',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI
  }
});
