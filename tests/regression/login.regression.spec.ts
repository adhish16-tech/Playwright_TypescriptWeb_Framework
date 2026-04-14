import { test, expect } from '../../src/fixtures/page.fixtures';
import { DataReader } from '../../src/helpers/data-reader.helper';
import { epic, feature, story, severity, description, owner } from 'allure-js-commons';

const invalidCredentials = DataReader.fromExcel<{ username: string; password: string; scenario: string }>(
  'test-data/login-data.xlsx',
  'InvalidCredentials'
);

test.describe('Login - Regression Tests @regression @auth @login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Authentication');
    await feature('Login');
    await owner('QA Team');
    await loginPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // ─── Data-driven: invalid credentials ────────────────────────────────────
  for (const { username, password, scenario } of invalidCredentials) {
    test(`should reject login - ${scenario}`, async ({ loginPage }) => {
      await story('Invalid Login');
      await severity('critical');
      await description(`Verifies login is rejected for scenario: ${scenario}`);
      await loginPage.login(username, password);
      await loginPage.assertErrorMessage('Invalid credentials');
    });
  }

  test('should persist session after page reload', async ({ page, dashboardPage }) => {
    await story('Session Persistence');
    await severity('normal');
    await description('Verifies the authenticated session is preserved after a page reload');
    await dashboardPage.navigate();
    await page.reload();
    await dashboardPage.assertDashboardLoaded();
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await story('Unauthenticated Redirect');
    await severity('critical');
    await description('Verifies unauthenticated users are redirected to the login page');
    await page.context().clearCookies();
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('should handle concurrent logins', async ({ browser }) => {
    await story('Concurrent Logins');
    await severity('minor');
    await description('Verifies the login page loads correctly in two simultaneous sessions');
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await Promise.all([
      page1.goto('/web/index.php/auth/login'),
      page2.goto('/web/index.php/auth/login'),
    ]);

    await expect(page1).toHaveURL(/.*login.*/);
    await expect(page2).toHaveURL(/.*login.*/);

    await context1.close();
    await context2.close();
  });

  // ─── Network mocking ──────────────────────────────────────────────────────
  test('should handle server error gracefully @network', async ({ page, loginPage }) => {
    await story('Network Error Handling');
    await severity('normal');
    await description('Verifies the app handles a 500 server error on login without crashing');
    await page.route('**/validateCredentials**', route =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error' }) })
    );
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await expect(page).not.toHaveURL(/.*dashboard.*/);
  });

  test('should handle API outage on dashboard @network', async ({ page, dashboardPage }) => {
    await story('API Outage Handling');
    await severity('minor');
    await description('Verifies the dashboard page remains navigable when API calls return errors');
    await page.route('**/api/v2/**', route =>
      route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Service Unavailable' }) })
    );
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/.*dashboard.*/);
  });
});
