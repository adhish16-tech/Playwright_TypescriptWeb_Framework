import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  private readonly welcomeHeading  = this.page.getByRole('heading', { level: 1 });
  private readonly navMenu         = this.page.locator('ul.oxd-main-menu');
  private readonly userAvatar      = this.page.locator('.oxd-userdropdown-tab');
  private readonly logoutButton    = this.page.getByRole('link', { name: 'Logout' });
  private readonly notificationBell = this.page.locator('.oxd-topbar-header-notification');
  private readonly sidebarToggle   = this.page.locator('.oxd-icon-button.oxd-main-menu-button');

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  async navigate(): Promise<void> {
    await this.navigateTo('/web/index.php/dashboard/index');
  }

  async logout(): Promise<void> {
    this.logger.info('Logging out');
    await this.clickElement(this.userAvatar);
    await this.clickElement(this.logoutButton);
  }

  async openNotifications(): Promise<void> {
    await this.clickElement(this.notificationBell);
  }

  async toggleSidebar(): Promise<void> {
    await this.clickElement(this.sidebarToggle);
  }

  async navigateToSection(sectionName: string): Promise<void> {
    this.logger.info(`Navigating to section: ${sectionName}`);
    await this.navMenu.getByRole('link', { name: sectionName }).click();
  }

  // ─── Assertions ───────────────────────────────────────────────────────────
  async assertDashboardLoaded(): Promise<void> {
    // Soft assertions — all three are checked even if one fails
    await expect.soft(this.page).toHaveURL(/.*dashboard.*/);
    await expect.soft(this.navMenu).toBeVisible();
    await expect.soft(this.userAvatar).toBeVisible();
  }

  async assertWelcomeMessage(username: string): Promise<void> {
    await this.assertElementText(this.welcomeHeading, `Welcome, ${username}`);
  }
}
