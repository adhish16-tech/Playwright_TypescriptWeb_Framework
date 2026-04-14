import { test } from '../../src/fixtures/page.fixtures';

test.describe('Dashboard - E2E Tests @regression', () => {
  // These tests use the saved auth state (logged-in user)
  test.use({ storageState: 'config/.auth/user.json' });

  test('should display dashboard after login', async ({ dashboardPage }) => {
    await dashboardPage.navigate();
    await dashboardPage.assertDashboardLoaded();
  });

  test('should navigate to a section via sidebar', async ({ dashboardPage }) => {
    await dashboardPage.navigate();
    await dashboardPage.navigateToSection('Admin');
    await dashboardPage.assertURL(/.*admin.*/);
  });

  test('should log out successfully', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.navigate();
    await dashboardPage.assertDashboardLoaded();
    await dashboardPage.logout();
    await loginPage.assertLoginPageLoaded();
  });
});
