import { test, expect } from '../../src/fixtures/page.fixtures';
import { DataFactory } from '../../src/helpers/data-factory.helper';

test.describe('Login - Smoke Tests @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.assertLoginPageLoaded();
  });

  test('should display login page correctly', async ({ loginPage }) => {
    await loginPage.assertPageTitle('OrangeHRM');
    await loginPage.assertLoginPageLoaded();
  });

  test('should login with valid credentials', async ({ loginPage, dashboardPage }) => {
    const credentials = DataFactory.getValidCredentials();
    await loginPage.login(credentials.username, credentials.password);
    await dashboardPage.assertDashboardLoaded();
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    const invalid = DataFactory.getInvalidCredentials();
    await loginPage.login(invalid.username, invalid.password);
    await loginPage.assertErrorMessage('Invalid credentials');
  });
});
