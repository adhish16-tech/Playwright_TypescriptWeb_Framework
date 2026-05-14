import { test } from '../../src/fixtures/page.fixtures';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomPan(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rand = (n: number) => Math.floor(Math.random() * n);
  return (
    letters[rand(26)] +
    letters[rand(26)] +
    letters[rand(26)] +
    letters[rand(26)] +
    letters[rand(26)] +
    String(Math.floor(Math.random() * 9000 + 1000)) +
    letters[rand(26)]
  );
}

let mobileCounter = 9000000000;
function nextMobile(): string {
  return String(mobileCounter++);
}

// ─── Tests ────────────────────────────────────────────────────────────────────
test.describe('Login - Smoke Tests @smoke @auth @login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login page correctly', async ({ loginPage }) => {
    await loginPage.assertLoginPageLoaded();
  });

  test('Fleet customer onboarding - Save As Draft', async ({
    loginPage, dashboardPage, customerOnboardingPage, page,
  }) => {
    // Login
    await loginPage.login(process.env.TEST_USERNAME ?? '', process.env.TEST_PASSWORD ?? '');
    await page.waitForURL(/LoginOtpVerification/);
    await loginPage.enterOtp('123456');
    await loginPage.verifyOtp();

    // Navigate to Add Customer
    await page.waitForURL(/Dashboard/);
    await dashboardPage.openCustomerMenu();
    await dashboardPage.goToManageCustomers();
    await dashboardPage.clickAddCustomer();
    await page.waitForURL(/AddCustomer/);
    await customerOnboardingPage.assertPageLoaded();

    // Application Details — Fleet
    await customerOnboardingPage.selectCustomerType('1001');
    await customerOnboardingPage.selectState('1');

    // Business Details
    await customerOnboardingPage.fillBusinessName('Fleet Business');
    await customerOnboardingPage.fillBusinessEmail('fleet@example.com');
    await customerOnboardingPage.selectTypeOfBusiness('2');
    await customerOnboardingPage.fillPanDob('1990-01-01');
    await customerOnboardingPage.fillPanNumber(randomPan());
    await customerOnboardingPage.selectIdProofType('DL');
    await customerOnboardingPage.fillIdProofNo('DL1234567890');

    // Customer Details
    await customerOnboardingPage.fillCustomerName('Fleet Customer');
    await customerOnboardingPage.selectLanguagePreference('2');
    await customerOnboardingPage.fillCustomerEmail('fleetcustomer@example.com');
    await customerOnboardingPage.fillMobileNumber(nextMobile());
    await customerOnboardingPage.clickGenerateOtp();
    await customerOnboardingPage.enterMobileOtp('123456');

    // Customer Segmentation
    await customerOnboardingPage.selectCustomerSegment('1');
    await customerOnboardingPage.selectBuyingPattern('1');

    // Bank Account Details
    await customerOnboardingPage.fillBankName('Fleet Bank');
    await customerOnboardingPage.fillAccountHolderName('Fleet Customer');
    await customerOnboardingPage.fillAccountNumber('1234567890');
    await customerOnboardingPage.fillIfscCode('FLTE0001234');

    await customerOnboardingPage.clickSaveAsDraft();
  });

  test('Non Fleet customer onboarding - Save As Draft', async ({
    loginPage, dashboardPage, customerOnboardingPage, page,
  }) => {
    // Login
    await loginPage.login(process.env.TEST_USERNAME ?? '', process.env.TEST_PASSWORD ?? '');
    await page.waitForURL(/LoginOtpVerification/);
    await loginPage.enterOtp('123456');
    await loginPage.verifyOtp();

    // Navigate to Add Customer
    await page.waitForURL(/Dashboard/);
    await dashboardPage.openCustomerMenu();
    await dashboardPage.goToManageCustomers();
    await dashboardPage.clickAddCustomer();
    await page.waitForURL(/AddCustomer/);
    await customerOnboardingPage.assertPageLoaded();

    // Application Details — Non Fleet
    await customerOnboardingPage.selectCustomerType('1002');
    await customerOnboardingPage.selectState('8');

    // Business Details
    await customerOnboardingPage.fillBusinessName('NonFleet Business');
    await customerOnboardingPage.fillBusinessEmail('nonfleet@example.com');
    await customerOnboardingPage.selectTypeOfBusiness('1');
    await customerOnboardingPage.fillPanDob('1985-06-15');
    await customerOnboardingPage.fillPanNumber(randomPan());
    await customerOnboardingPage.selectIdProofType('PASSPORT');
    await customerOnboardingPage.fillIdProofNo('P1234567');

    // Customer Details
    await customerOnboardingPage.fillCustomerName('NonFleet Customer');
    await customerOnboardingPage.selectLanguagePreference('2');
    await customerOnboardingPage.fillCustomerEmail('nonfleetcustomer@example.com');
    await customerOnboardingPage.fillMobileNumber(nextMobile());
    await customerOnboardingPage.clickGenerateOtp();
    await customerOnboardingPage.enterMobileOtp('123456');

    // Customer Segmentation
    await customerOnboardingPage.selectCustomerSegment('5');
    await customerOnboardingPage.selectBuyingPattern('2');

    // Bank Account Details
    await customerOnboardingPage.fillBankName('NonFleet Bank');
    await customerOnboardingPage.fillAccountHolderName('NonFleet Customer');
    await customerOnboardingPage.fillAccountNumber('9876543210');
    await customerOnboardingPage.fillIfscCode('NFLT0009876');

    await customerOnboardingPage.clickSaveAsDraft();
  });
});
