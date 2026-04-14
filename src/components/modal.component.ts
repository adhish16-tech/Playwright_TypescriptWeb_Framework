import { Page, Locator, expect } from '@playwright/test';

/**
 * Reusable Modal component — wrap any modal dialog on the page
 */
export class ModalComponent {
  private readonly root:          Locator;
  private readonly title:         Locator;
  private readonly closeButton:   Locator;
  private readonly confirmButton: Locator;
  private readonly cancelButton:  Locator;

  constructor(page: Page, testId = 'modal') {
    this.root          = page.getByTestId(testId);
    this.title         = this.root.getByRole('heading');
    this.closeButton   = this.root.getByRole('button', { name: 'Close' });
    this.confirmButton = this.root.getByRole('button', { name: /confirm|ok|yes/i });
    this.cancelButton  = this.root.getByRole('button', { name: /cancel|no/i });
  }

  async waitForOpen(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  async waitForClose(): Promise<void> {
    await this.root.waitFor({ state: 'hidden' });
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) ?? '';
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
    await this.waitForClose();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForClose();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.waitForClose();
  }

  async assertVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async assertTitle(expected: string): Promise<void> {
    await expect(this.title).toHaveText(expected);
  }
}
