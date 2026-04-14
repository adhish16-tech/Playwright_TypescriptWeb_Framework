import { test, expect } from '../../src/fixtures/page.fixtures';
import { DataFactory } from '../../src/helpers/data-factory.helper';
import { epic, feature, story, severity, owner, description } from 'allure-js-commons';

test.describe('Login - Smoke Tests @smoke @auth @login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Authentication');
    await feature('Login');
    await owner('QA Team');
    await loginPage.navigate();
    await loginPage.assertLoginPageLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('should display login page correctly', async ({ loginPage }) => {
    await story('Login Page Display');
    await severity('normal');
    await description('Verifies the login page renders with all required elements and correct title');
    await loginPage.assertPageTitle('OrangeHRM');
    await loginPage.assertLoginPageLoaded();
  });

  test('should login with valid credentials', async ({ loginPage, dashboardPage }) => {
    await story('Valid Login');
    await severity('critical');
    await description('Verifies a user can successfully log in with valid credentials and reach the dashboard');
    const credentials = DataFactory.getValidCredentials();
    await loginPage.login(credentials.username, credentials.password);
    await dashboardPage.assertDashboardLoaded();
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    await story('Invalid Login');
    await severity('critical');
    await description('Verifies the correct error message is shown when invalid credentials are entered');
    const invalid = DataFactory.getInvalidCredentials();
    await loginPage.login(invalid.username, invalid.password);
    await loginPage.assertErrorMessage('Invalid credentials');
  });
});
