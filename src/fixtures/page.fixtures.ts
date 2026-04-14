import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { Logger } from '../helpers/logger.helper';

// ─── Define custom fixture types ──────────────────────────────────────────────
type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

type WorkerFixtures = {
  logger: Logger;
};

// ─── Extend base test with custom fixtures ────────────────────────────────────
export const test = base.extend<PageFixtures, WorkerFixtures>({
  // Worker-scoped logger (shared across tests in the same worker)
  logger: [
    async ({}, use) => {
      const logger = new Logger('TestRunner');
      await use(logger);
    },
    { scope: 'worker' },
  ],

  // Page-scoped page object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
