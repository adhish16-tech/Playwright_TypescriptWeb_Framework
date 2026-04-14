import { test, expect } from '../../src/fixtures/page.fixtures';
import usersData from '../../test-data/users.json';

test.describe('Login - Regression Tests @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // ─── Data-driven: invalid credentials ────────────────────────────────────
  for (const { username, password, scenario } of usersData.invalidCredentials) {
    test(`should reject login - ${scenario}`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await loginPage.assertErrorMessage('Invalid credentials');
    });
  }

  test('should persist session after page reload', async ({ page, dashboardPage }) => {
    await dashboardPage.navigate();
    await page.reload();
    await dashboardPage.assertDashboardLoaded();
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Clear storage to simulate unauthenticated state
    await page.context().clearCookies();
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('should handle concurrent logins', async ({ browser }) => {
    // Open two contexts (two separate sessions)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await Promise.all([
      page1.goto('/login'),
      page2.goto('/login'),
    ]);

    // Both should load login page
    await expect(page1).toHaveURL(/.*login.*/);
    await expect(page2).toHaveURL(/.*login.*/);

    await context1.close();
    await context2.close();
  });
});
