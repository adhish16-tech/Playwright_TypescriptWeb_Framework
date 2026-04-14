import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  private readonly usernameInput = this.page.getByPlaceholder('Username');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly loginButton   = this.page.getByRole('button', { name: 'Login' });
  private readonly errorMessage  = this.page.locator('.oxd-alert-content-text');
  private readonly forgotPasswordLink = this.page.getByRole('link', { name: /forgot/i });

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  async navigate(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Logging in as: ${username}`);
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton, { force: true });
    await this.waitForPageLoad();
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.login(
      process.env.TEST_USERNAME ?? '',
      process.env.TEST_PASSWORD ?? ''
    );
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────
  async assertLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.usernameInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
  }

  async assertErrorMessage(message: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
    await this.assertElementText(this.errorMessage, message);
  }

  async assertLoginButtonEnabled(): Promise<void> {
    await this.assertElementVisible(this.loginButton);
  }
}
