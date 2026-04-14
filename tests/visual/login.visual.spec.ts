import { test, expect } from '../../src/fixtures/page.fixtures';
import { epic, feature, story, severity, description } from 'allure-js-commons';

/**
 * Visual Regression Tests — @smoke @visual
 *
 * These tests compare screenshots against stored baselines.
 * To generate / update baselines run:
 *   npm run test:visual:update
 */
test.describe('Visual Regression @smoke @visual', () => {
  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('login page should match baseline', async ({ page, loginPage }) => {
    await epic('Visual Regression');
    await feature('Login Page');
    await story('Login Page Snapshot');
    await severity('normal');
    await description('Captures and compares the login page against a stored baseline screenshot');

    await loginPage.navigate();
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 200,
      animations: 'disabled',
    });
  });

  test('login error state should match baseline', async ({ page, loginPage }) => {
    await epic('Visual Regression');
    await feature('Login Page');
    await story('Login Error State Snapshot');
    await severity('minor');
    await description('Captures and compares the login error state against a stored baseline screenshot');

    await loginPage.navigate();
    await loginPage.login('wrong@user.com', 'wrongpassword');
    await expect(page).toHaveScreenshot('login-error.png', {
      maxDiffPixels: 200,
      animations: 'disabled',
    });
  });
});
