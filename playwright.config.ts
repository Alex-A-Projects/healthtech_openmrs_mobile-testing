import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright configuration for the OpenMRS mobile-emulation suite.
 *
 * Two projects emulate the iPhone 17 Pro and Pixel 9 viewports in
 * headless Chromium. They use the same O2 page objects as the WDIO
 * mobile track — only the runner differs. CI-friendly: no Xcode or
 * Android Studio required.
 */
export default defineConfig({
  testDir: './pw-tests',
  testMatch: '**/*.spec.ts',
  testIgnore: ['**/node_modules/**', '**/.git/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  reportSlowTests: { max: 5, threshold: 15_000 },
  use: {
    baseURL: process.env.O2_BASE_URL ?? 'https://o2.openmrs.org/openmrs',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 8_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium-web-mobile-iphone',
      testMatch: 'ui-mobile/**/*.spec.ts',
      use: { ...devices['iPhone 17'] },
    },
    {
      name: 'chromium-web-mobile-pixel',
      testMatch: 'ui-mobile/**/*.spec.ts',
      use: { ...devices['Pixel 9'] },
    },
  ],
});
