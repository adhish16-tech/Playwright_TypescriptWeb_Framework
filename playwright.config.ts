import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: `.env.${process.env.ENV || 'dev'}` });

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 4 : 1,

  // Global timeout per test
  timeout: 60_000,

  // Expect timeout
  expect: {
    timeout: 10_000,
  },

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }],
    ['./reporters/custom-reporter.ts'],
    ...(process.env.CI ? [['github'] as ['github']] : [['list'] as ['list']]),
  ],

  // Shared settings for all projects
  use: {
    // Base URL from environment
    baseURL: process.env.BASE_URL || 'https://example.com',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // Action timeout
    actionTimeout: 15_000,

    // Navigation timeout
    navigationTimeout: 60_000,

    // Run headed locally, headless on CI
    headless: !!process.env.CI,

    // Viewport
    viewport: { width: 1280, height: 720 },

    // Locale
    locale: 'en-US',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'x-test-framework': 'playwright-org-framework',
    },
  },

  // Output folder for test artifacts
  outputDir: 'test-results',

  // Browser projects
  projects: [
    // Setup project (auth state)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Chromium
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'config/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'config/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // WebKit (Safari)
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'config/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },

    // Mobile Safari
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },

    // API tests — no browser, no setup dependency
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
