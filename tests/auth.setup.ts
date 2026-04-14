import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../config/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps
  await page.goto('/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME ?? '');
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Login' }).click({ force: true });

  // Wait for successful login
  await page.waitForURL(/dashboard/);
  await expect(page.getByRole('navigation', { name: 'Sidepanel' })).toBeVisible();

  // Save the authentication state
  await page.context().storageState({ path: authFile });
});
