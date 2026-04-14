import { test, expect } from '../../src/fixtures/page.fixtures';
import AxeBuilder from '@axe-core/playwright';
import { epic, feature, story, severity, description } from 'allure-js-commons';

test.describe('Accessibility Tests @smoke @a11y', () => {
  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('login page should have no accessibility violations', async ({ page, loginPage }) => {
    await epic('Accessibility');
    await feature('Login Page');
    await story('Login Page A11y');
    await severity('normal');
    await description('Scans the login page for WCAG accessibility violations using axe-core');

    await loginPage.navigate();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    if (results.violations.length > 0) {
      const summary = results.violations.map(v =>
        `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} element(s))`
      ).join('\n');
      console.log('Accessibility violations found:\n', summary);
    }

    expect(results.violations).toEqual([]);
  });

  test('login error state should have no accessibility violations', async ({ page, loginPage }) => {
    await epic('Accessibility');
    await feature('Login Page');
    await story('Login Error A11y');
    await severity('minor');
    await description('Scans the login error state for WCAG accessibility violations using axe-core');

    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
