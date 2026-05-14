import { test } from '../../src/fixtures/page.fixtures';

test.describe('Login - Smoke Tests @smoke @auth @login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login page correctly', async ({ loginPage }) => {
    await loginPage.assertLoginPageLoaded();
  });

  test('should login, verify OTP, navigate to Add Customer and fill form', async ({
    loginPage,
    dashboardPage,
    customerOnboardingPage,
    page,
  }) => {
    // Login
    await loginPage.login(
      process.env.TEST_USERNAME ?? '',
      process.env.TEST_PASSWORD ?? ''
    );

    // OTP
    await page.waitForURL(/LoginOtpVerification/);
    await loginPage.enterOtp('123456');
    await loginPage.verifyOtp();

    // Navigate to Add Customer
    await page.waitForURL(/Dashboard/);
    await dashboardPage.openCustomerMenu();
    await dashboardPage.goToManageCustomers();
    await dashboardPage.clickAddCustomer();
    await page.waitForURL(/AddCustomer/);

    // Assert page loaded
    await customerOnboardingPage.assertPageLoaded();

    // Application Details
    await customerOnboardingPage.selectCustomerType('1001');   // Fleet
    await customerOnboardingPage.selectState('1');             // AP_TG

    // Business Details
    await customerOnboardingPage.fillBusinessName('Test Business');
    await customerOnboardingPage.fillBusinessEmail('testbusiness@example.com');
    await customerOnboardingPage.selectTypeOfBusiness('2');    // Sole Propreitorship
    await customerOnboardingPage.fillPanDob('1990-01-01');
    await customerOnboardingPage.fillPanNumber('ABCDE1234F');
    await customerOnboardingPage.selectIdProofType('DL');      // Driving License
    await customerOnboardingPage.fillIdProofNo('DL1234567890');

    // Customer Details
    await customerOnboardingPage.fillCustomerName('Test Customer');
    await customerOnboardingPage.selectLanguagePreference('2'); // English
    await customerOnboardingPage.fillCustomerEmail('testcustomer@example.com');
    await customerOnboardingPage.fillMobileNumber('9999999999');

    // Customer Segmentation
    await customerOnboardingPage.selectCustomerSegment('1');   // General goods Transportation
    await customerOnboardingPage.selectBuyingPattern('1');     // Pattern 1

    // Bank Account Details
    await customerOnboardingPage.fillBankName('Test Bank');
    await customerOnboardingPage.fillAccountHolderName('Test Customer');
    await customerOnboardingPage.fillAccountNumber('1234567890');
    await customerOnboardingPage.fillIfscCode('TEST0001234');

    // Save as draft
    await customerOnboardingPage.clickSaveAsDraft();
  });
});
