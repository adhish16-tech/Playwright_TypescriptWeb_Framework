# 🎭 Playwright TypeScript — Organization Framework

A production-ready, scalable Playwright testing framework built with TypeScript. Designed for teams that need consistency, maintainability, and CI/CD integration across all browsers.

---

## 📁 Project Structure

```
playwright-org-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline (GitHub Actions)
├── config/
│   └── .auth/
│       └── user.json               # Saved auth state (gitignored in prod)
├── docker/
│   ├── Dockerfile                  # Containerized test runner
│   └── docker-compose.yml          # Local & CI compose config
├── reporters/
│   └── custom-reporter.ts          # Custom console + JSON reporter
├── src/
│   ├── components/
│   │   ├── header.component.ts     # Reusable header component
│   │   └── modal.component.ts      # Reusable modal component
│   ├── fixtures/
│   │   └── page.fixtures.ts        # Extended Playwright fixtures
│   ├── helpers/
│   │   ├── data-factory.helper.ts  # Test data generators
│   │   ├── env.helper.ts           # Environment config
│   │   └── logger.helper.ts        # Winston logger
│   ├── pages/
│   │   ├── base.page.ts            # Abstract base page (all pages extend this)
│   │   ├── login.page.ts           # Login page object
│   │   └── dashboard.page.ts       # Dashboard page object
│   └── types/
│       └── user.types.ts           # TypeScript interfaces
├── test-data/
│   └── users.json                  # Static test data
├── tests/
│   ├── auth.setup.ts               # Auth setup (runs before test suites)
│   ├── e2e/
│   │   └── dashboard.e2e.spec.ts   # End-to-end tests
│   ├── smoke/
│   │   └── login.smoke.spec.ts     # Smoke tests
│   └── regression/
│       └── login.regression.spec.ts# Regression tests
├── utils/
│   └── common.utils.ts             # Shared utilities (retry, wait, etc.)
├── .env.example                    # Template — copy to .env.dev / .env.staging / .env.prod
├── .gitignore
├── eslint.config.js                # ESLint configuration
├── package.json
├── playwright.config.ts            # Main Playwright configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+

### Installation

```bash
# Clone and install
git clone <your-repo-url>
cd playwright-org-framework
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Set up environment variables
cp .env.example .env.dev
# Edit .env.dev with your app URL and test credentials
```

### Running Tests

```bash
# Run all tests (default: dev env)
npm test

# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression

# Run on specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run in headed mode (visible browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# Interactive Playwright UI
npm run test:ui
```

### Environment Selection

```bash
# Run against staging
ENV=staging npm test

# Run against production
ENV=prod npm test
```

---

## 🏗️ Architecture

### Page Object Model (POM)

Every page extends `BasePage`, which provides shared actions and assertions:

```typescript
// src/pages/my-page.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class MyPage extends BasePage {
  private readonly heading = this.page.getByRole('heading', { level: 1 });

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/my-page');
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.heading);
  }
}
```

### Custom Fixtures

Register your new page in `src/fixtures/page.fixtures.ts`:

```typescript
import { MyPage } from '../pages/my-page.page';

type PageFixtures = {
  myPage: MyPage;
  // ... other pages
};

export const test = base.extend<PageFixtures>({
  myPage: async ({ page }, use) => {
    await use(new MyPage(page));
  },
});
```

Use in tests:

```typescript
import { test, expect } from '../../src/fixtures/page.fixtures';

test('my test', async ({ myPage }) => {
  await myPage.navigate();
  await myPage.assertPageLoaded();
});
```

### Test Tags

Tag tests for selective execution:

| Tag          | Command                      | When it runs            |
|-------------|-------------------------------|------------------------|
| `@smoke`    | `npm run test:smoke`          | Every PR               |
| `@regression` | `npm run test:regression`   | Main branch + nightly  |

```typescript
test.describe('Feature X @smoke', () => { ... });
test.describe('Feature X @regression', () => { ... });
```

---

## ⚙️ Configuration

### Environment Variables

| Variable       | Description              | Default                  |
|---------------|--------------------------|--------------------------|
| `ENV`         | Target environment       | `dev`                   |
| `BASE_URL`    | App URL override         | From env file            |
| `TEST_USERNAME` | Login username         | From env file            |
| `TEST_PASSWORD` | Login password         | From env file            |
| `LOG_LEVEL`   | Logging verbosity        | `info` (debug in dev)   |

### Adding a New Environment

1. Create `.env.myenv`
2. Add config to `src/helpers/env.helper.ts`
3. Run with `ENV=myenv npm test`

---

## 🔐 Authentication

Auth is handled via Playwright's `storageState`. The `auth.setup.ts` file:
1. Logs in once before all tests
2. Saves cookies/tokens to `config/.auth/user.json`
3. All browser projects reuse this state

For tests that need a fresh unauthenticated state:

```typescript
test('unauthenticated test', async ({ page }) => {
  await page.context().clearCookies();
  // test proceeds without auth
});
```

---

## 📊 Reporters

The framework includes four reporters:

| Reporter | Output | Purpose |
|----------|--------|---------|
| HTML | `playwright-report/index.html` | Visual test report |
| JUnit | `test-results/junit.xml` | CI integration (Jenkins, GitHub Actions) |
| Allure | `allure-report/` | Rich interactive report with history |
| Custom | Console + `test-results/summary.json` | Readable terminal output |

```bash
# Open Playwright HTML report
npm run report

# Generate + open Allure report (requires Java)
npm run allure:report

# Generate only
npm run allure:generate

# Open already-generated report
npm run allure:open
```

---

## 🐳 Docker

Run tests in a containerized environment:

```bash
# Build and run all tests
cd docker
docker-compose up playwright

# Run smoke tests only
docker-compose up playwright-smoke
```

---

## 🔁 CI/CD (GitHub Actions)

The pipeline runs automatically on:

| Trigger         | Suite        | Browsers          |
|----------------|--------------|-------------------|
| Pull Request    | Smoke        | All browsers      |
| Push to `main` | Regression   | All browsers (sharded) |
| Nightly cron   | Regression   | All browsers (sharded) |
| Manual dispatch | Configurable | Configurable      |

### Required GitHub Secrets

```
TEST_USERNAME       — Test account username
TEST_PASSWORD       — Test account password
DEV_BASE_URL        — Dev environment URL
STAGING_BASE_URL    — Staging environment URL
PROD_BASE_URL       — Production URL
```

---

## 📏 Best Practices

1. **Use `data-testid` attributes** for stable selectors — prefer over CSS/XPath
2. **Never hardcode waits** — use `waitForElement()` or Playwright's auto-waiting
3. **Tag all tests** with `@smoke` or `@regression` for selective runs
4. **Keep tests independent** — each test should be able to run in isolation
5. **Use `DataFactory`** to generate unique test data and avoid collisions
6. **Add assertions after actions** — every test should verify its outcome
7. **Use fixtures** — avoid duplicating setup logic across test files

---

## 🛠️ Scripts Reference

```bash
npm test                  # Run all tests
npm run test:smoke        # Smoke suite
npm run test:regression   # Regression suite
npm run test:chrome       # Chromium only
npm run test:firefox      # Firefox only
npm run test:safari       # WebKit only
npm run test:headed       # Show browser
npm run test:debug        # Debug mode
npm run test:ui           # Playwright UI mode
npm run report            # Open Playwright HTML report
npm run allure:report     # Generate + open Allure report
npm run allure:generate   # Generate Allure HTML only
npm run allure:open       # Open existing Allure report
npm run lint              # Check linting
npm run lint:fix          # Auto-fix lint issues
npm run typecheck         # TypeScript check
npm run clean             # Clear all test output
```
