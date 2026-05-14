import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';

export class CustomerOnboardingPage extends BasePage {
  // ─── Application Details ──────────────────────────────────────────────────
  private readonly customerTypeDropdown    = this.page.locator('#CustomerTypeID');
  private readonly customerSubTypeDropdown = this.page.locator('#CustomerSubTypeID');
  private readonly stateDropdown           = this.page.locator('#CustStateID');
  private readonly divisionDropdown        = this.page.locator('#CustDivisionID');
  private readonly referralCodeInput       = this.page.locator('#SaveCustomerModel_ReferralCode');
  private readonly relatedPartyYes         = this.page.locator('#IsRelatedPartyYes');
  private readonly relatedPartyNo          = this.page.locator('#IsRelatedPartyNo');

  // ─── Business Details ─────────────────────────────────────────────────────
  private readonly businessNameInput       = this.page.locator('#SaveCustomerModel_BusinessName');
  private readonly businessEmailInput      = this.page.locator('#SaveCustomerModel_BusinessEmail');
  private readonly typeOfBusinessDropdown  = this.page.locator('#CustomerBusinessType');
  private readonly panDobInput             = this.page.locator('#SaveCustomerModel_PanDOB');
  private readonly panNumberInput          = this.page.locator('#SaveCustomerModel_PANNumber');
  private readonly idProofTypeDropdown     = this.page.locator('#CustomerIdProofType');
  private readonly idProofNoInput          = this.page.locator('#SaveCustomerModel_CustomerIdProofNo');

  // ─── Customer Details ─────────────────────────────────────────────────────
  private readonly customerNameInput       = this.page.locator('#SaveCustomerModel_CustomerName');
  private readonly languageDropdown        = this.page.locator('#CustomerLanguagePreference');
  private readonly customerEmailInput      = this.page.locator('#SaveCustomerModel_CustomerEmail');
  private readonly mobileNumberInput       = this.page.locator('#SaveCustomerModel_CustomerMobileNumber');
  private readonly generateOtpButton       = this.page.locator('button').filter({ hasText: /generate otp/i });
  private readonly mobileOtpInput          = this.page.locator('#MobileOTP');

  // ─── Customer Segmentation ────────────────────────────────────────────────
  private readonly customerSegmentDropdown = this.page.locator('#CustomerSegmentID');
  private readonly buyingPatternDropdown   = this.page.locator('#BuyingPatternID');

  // ─── Bank Account Details ─────────────────────────────────────────────────
  private readonly bankNameInput           = this.page.locator('#SaveCustomerModel_BankAccountDetails_BankName');
  private readonly accountHolderNameInput  = this.page.locator('#SaveCustomerModel_BankAccountDetails_BankAccountHolderName');
  private readonly accountNumberInput      = this.page.locator('#SaveCustomerModel_BankAccountDetails_BankAccountNumber');
  private readonly ifscCodeInput           = this.page.locator('#SaveCustomerModel_BankAccountDetails_IFSCCode');

  // ─── Form Actions ─────────────────────────────────────────────────────────
  private readonly saveAsDraftButton       = this.page.locator('#firstSavebtn');
  private readonly nextButton              = this.page.locator('button').filter({ hasText: /next/i });

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo(Routes.customerOnboarding);
  }

  // ─── Application Details ──────────────────────────────────────────────────
  async selectCustomerType(value: string): Promise<void> {
    this.logger.info(`Selecting Customer Type: ${value}`);
    await this.customerTypeDropdown.selectOption(value);
  }

  async selectCustomerSubType(value: string): Promise<void> {
    this.logger.info(`Selecting Customer Sub Type: ${value}`);
    await this.customerSubTypeDropdown.selectOption(value);
  }

  async selectState(value: string): Promise<void> {
    this.logger.info(`Selecting State: ${value}`);
    await this.stateDropdown.selectOption(value);
  }

  async selectDivision(value: string): Promise<void> {
    this.logger.info(`Selecting Division: ${value}`);
    await this.divisionDropdown.selectOption(value);
  }

  async fillReferralCode(value: string): Promise<void> {
    await this.fillInput(this.referralCodeInput, value);
  }

  async selectRelatedParty(isYes: boolean): Promise<void> {
    this.logger.info(`Selecting Related Party: ${isYes ? 'YES' : 'NO'}`);
    await this.clickElement(isYes ? this.relatedPartyYes : this.relatedPartyNo);
  }

  // ─── Business Details ─────────────────────────────────────────────────────
  async fillBusinessName(value: string): Promise<void> {
    await this.fillInput(this.businessNameInput, value);
  }

  async fillBusinessEmail(value: string): Promise<void> {
    await this.fillInput(this.businessEmailInput, value);
  }

  async selectTypeOfBusiness(value: string): Promise<void> {
    await this.typeOfBusinessDropdown.selectOption(value);
  }

  async fillPanDob(value: string): Promise<void> {
    await this.fillInput(this.panDobInput, value);
  }

  async fillPanNumber(value: string): Promise<void> {
    await this.fillInput(this.panNumberInput, value);
  }

  async selectIdProofType(value: string): Promise<void> {
    await this.idProofTypeDropdown.selectOption(value);
  }

  async fillIdProofNo(value: string): Promise<void> {
    await this.fillInput(this.idProofNoInput, value);
  }

  // ─── Customer Details ─────────────────────────────────────────────────────
  async fillCustomerName(value: string): Promise<void> {
    await this.fillInput(this.customerNameInput, value);
  }

  async selectLanguagePreference(value: string): Promise<void> {
    await this.languageDropdown.selectOption(value);
  }

  async fillCustomerEmail(value: string): Promise<void> {
    await this.fillInput(this.customerEmailInput, value);
  }

  async fillMobileNumber(value: string): Promise<void> {
    await this.fillInput(this.mobileNumberInput, value);
  }

  async clickGenerateOtp(): Promise<void> {
    this.logger.info('Clicking Generate OTP');
    await this.clickElement(this.generateOtpButton);
  }

  async enterMobileOtp(otp: string): Promise<void> {
    this.logger.info('Entering mobile OTP');
    await this.fillInput(this.mobileOtpInput, otp);
  }

  // ─── Customer Segmentation ────────────────────────────────────────────────
  async selectCustomerSegment(value: string): Promise<void> {
    await this.customerSegmentDropdown.selectOption(value);
  }

  async selectBuyingPattern(value: string): Promise<void> {
    await this.buyingPatternDropdown.selectOption(value);
  }

  // ─── Bank Account Details ─────────────────────────────────────────────────
  async fillBankName(value: string): Promise<void> {
    await this.fillInput(this.bankNameInput, value);
  }

  async fillAccountHolderName(value: string): Promise<void> {
    await this.fillInput(this.accountHolderNameInput, value);
  }

  async fillAccountNumber(value: string): Promise<void> {
    await this.fillInput(this.accountNumberInput, value);
  }

  async fillIfscCode(value: string): Promise<void> {
    await this.fillInput(this.ifscCodeInput, value);
  }

  async clickSaveAsDraft(): Promise<void> {
    this.logger.info('Clicking Save As Draft');
    await this.clickElement(this.saveAsDraftButton);
  }

  async clickNext(): Promise<void> {
    this.logger.info('Clicking Next');
    await this.clickElement(this.nextButton);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/AddCustomer/);
    await expect(this.page.locator('text=Application Details')).toBeVisible();
  }
}
