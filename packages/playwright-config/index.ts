import {env} from 'node:process';

export default function getBaseConfig({devBaseUrl}: {devBaseUrl: string}) {
  return {
    testDir: './e2e',
    // Run tests in files in parallel
    fullyParallel: true,
    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!env.CI,
    // Retry on CI only
    retries: env.CI ? 2 : 0,
    // Opt out of parallel tests on CI.
    workers: env.CI ? 1 : undefined,
    // Reporter to use. See https://playwright.dev/docs/test-reporters
    reporter: 'html',
    // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
    use: {
      // Base URL to use in actions like `await page.goto('/')`.
      baseURL: env.PLAYWRIGHT_BASE_URL || devBaseUrl,

      // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
      trace: 'on-first-retry' as const,
      actionTimeout: 30 * 1000,
      navigationTimeout: 60 * 1000,
    },

    timeout: 60 * 1000,
    expect: {
      timeout: 30 * 1000,
    },
    testMatch: '*.test.ts',
  };
}
