import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';

export class DashboardPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  private readonly sidebar            = this.page.locator('nav.sidebar-nav');
  private readonly customerMenu       = this.page.locator('[title="Customer"]');
  private readonly manageCustomersLink = this.page.locator('a[href="/Customer/ManageCustomers"]');
  private readonly addCustomerButton  = this.page.locator('#addCustomerbtn');

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  async navigate(): Promise<void> {
    await this.navigateTo(Routes.dashboard);
  }

  async openCustomerMenu(): Promise<void> {
    this.logger.info('Opening Customer menu');
    await this.clickElement(this.customerMenu);
  }

  async goToManageCustomers(): Promise<void> {
    this.logger.info('Clicking Manage Customers');
    await this.clickElement(this.manageCustomersLink);
    await this.page.waitForURL(/ManageCustomers/);
  }

  async clickAddCustomer(): Promise<void> {
    this.logger.info('Clicking Add Customer');
    await this.clickElement(this.addCustomerButton);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────
  async assertDashboardLoaded(): Promise<void> {
    await expect(this.sidebar).toBeVisible();
  }
}
