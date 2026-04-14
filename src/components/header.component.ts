import { Page, Locator } from '@playwright/test';

/**
 * Reusable Header component — used across multiple page objects
 */
export class HeaderComponent {
  private readonly page: Page;
  private readonly root: Locator;

  readonly logo:          Locator;
  readonly userMenu:      Locator;
  readonly notificationBell: Locator;
  readonly searchBar:     Locator;

  constructor(page: Page) {
    this.page              = page;
    this.root              = page.getByRole('banner');
    this.logo              = this.root.getByRole('link', { name: 'Home' });
    this.userMenu          = this.root.getByTestId('user-menu');
    this.notificationBell  = this.root.getByTestId('notification-bell');
    this.searchBar         = this.root.getByRole('searchbox');
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async search(query: string): Promise<void> {
    await this.searchBar.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async getNotificationCount(): Promise<number> {
    const badge = this.notificationBell.getByTestId('badge');
    const text  = await badge.textContent();
    return parseInt(text ?? '0', 10);
  }
}
