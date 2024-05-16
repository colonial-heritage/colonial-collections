import {defineConfig, devices} from '@playwright/test';
// @ts-expect-error: TS5097
import getBaseConfig from '@colonial-collections/playwright-config/index.ts';

//See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  ...getBaseConfig({devBaseUrl: 'http://localhost:3001'}),
  // Configure projects for major browsers
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],
});
