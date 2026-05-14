import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';

export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  private readonly usernameInput      = this.page.locator('#Username');
  private readonly passwordInput      = this.page.locator('input[type="password"]');
  private readonly captchaInput       = this.page.locator('input[placeholder="Enter code"]');
  private readonly loginButton        = this.page.locator('button[type="submit"], input[type="submit"], .btn-login, button').filter({ hasText: /login/i });
  private readonly errorMessage       = this.page.locator('.text-danger, .alert-danger, .error-message');
  private readonly forgotPasswordLink = this.page.getByRole('link', { name: /forgot password/i });
  private readonly pageHeading        = this.page.getByText('Welcome to Nayara Energy');
  private readonly otpBoxes           = this.page.locator('.otp-box');
  private readonly verifyButton       = this.page.locator('button').filter({ hasText: /verify/i });

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  async navigate(): Promise<void> {
    await this.navigateTo(Routes.login);
  }

  async login(username: string, password: string, captcha = 'test'): Promise<void> {
    this.logger.info(`Logging in as: ${username}`);
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.captchaInput, captcha);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.login(
      process.env.TEST_USERNAME ?? '',
      process.env.TEST_PASSWORD ?? ''
    );
  }

  async enterOtp(otp: string): Promise<void> {
    this.logger.info('Entering OTP');
    for (let i = 0; i < otp.length; i++) {
      await this.otpBoxes.nth(i).fill(otp[i]);
    }
  }

  async verifyOtp(): Promise<void> {
    this.logger.info('Clicking Verify');
    await this.clickElement(this.verifyButton);
    await this.waitForPageLoad();
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────
  async assertLoginPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await this.assertElementVisible(this.usernameInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.captchaInput);
    await this.assertElementVisible(this.loginButton);
  }

  async assertErrorMessage(message: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
    await this.assertElementText(this.errorMessage, message);
  }
}
