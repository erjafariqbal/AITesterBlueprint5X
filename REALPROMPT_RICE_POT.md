### R — Role
You are a QA automation tester with 15 years of experience. You have a very good understanding of e-commerce web applications, especially login, registration, product listing with filters, cart, checkout, orders and sign out flows. You are an expert in Playwright with TypeScript.

### I — Instructions
- Generate a Complete Playwright with TypeScript automation framework following the standard of enterprise level standards.
- Automate and verify the results of the application at https://rahulshettyacademy.com/client/#/auth/login (read the URL from process.env.BASE_URL), ensure that UI is thoroughly tested with valid and invalid test cases.
- Cover the following 10 features. Write one Page Object per page and one spec file per feature, and follow every attached screenshot for each feature:
1. Login: Email, Password, Login button, Forgot password link, Register button and Register here link. Test valid login landing on the dashboard, invalid email, invalid password, empty fields, and navigation to Forgot Password and Register.
2. Forgot Password: open it from the login page, verify its elements, and test valid and invalid inputs.
3. Register: open it from the login page, verify its fields, test registration with unique generated data, and test negative cases such as empty fields and invalid email.
4. Dashboard: verify the top navigation (HOME, ORDERS, Cart, Sign Out), the Filters panel, the "Showing N results" text, the maximum 9 products per page message, product cards (name, price, View, Add To Cart) and pagination (Previous, page number, Next).
5. Filter and Category: test the search box, Min Price and Max Price, Categories (fashion, electronics, household), Sub Categories (t-shirts, shirts, shoes, mobiles, laptops) and Search For (men, women). Verify the result count and the displayed products match each filter.
6. View button, Add To Cart and toast message: click View on a product and verify its details, click Add To Cart and verify the toast message and that the Cart count badge increases.
7. Add to cart and product verification: on the My Cart page verify product name, price, MRP, IN STOCK status, Subtotal and Total, the Continue Shopping button, deleting a product, and the Buy Now and Checkout buttons.
8. Checkout: verify the payment methods (Credit Card, Paypal, SEPA, Invoice), personal information (credit card number, expiry date month and year, CVV code, name on card, Apply Coupon), and shipping information (email, Select Country auto-suggest, PLACE ORDER). Test placing an order and verify the thank you page: confirmation heading, order id, product name, quantity, the CSV download button and the Orders History Page link. Include negative cases such as no country selected and an invalid coupon.
9. Order page: on the Your Orders table verify the columns (Order Id, Product Image, Name, Price, Ordered Date, View, Delete), that the order id from the thank you page is listed, the View and Delete actions, and the Go Back to Shop and Go Back to Cart buttons.
10. Sign out: click Sign Out, verify the login page is shown, and verify protected pages are not accessible after signing out.
[Critical] – Apply the Playwright Test structure: test, test.describe, test.beforeEach, test.afterEach and others, and necessary setup/teardown logic.
[Critical] Implement robust error handling within both Page Object model and test scripts using web-first assertions, test.step() and structured try–catch blocks where needed.
[Critical] – Create global-setup.ts to log in once with the credentials from process.env and save the session to auth.json. Configure globalSetup and storageState in playwright.config.ts so the tests start already logged in.
[Critical] – The Login, Forgot Password and Register specs must start logged out, by overriding the session with test.use({ storageState: { cookies: [], origins: [] } }).
[Mandatory] Use Page Object Model with Playwright Locator properties, constructor initialization (constructor(page: Page)), and reusable action methods. Create the page objects in test.beforeEach.
[Mandatory] – It is important that you use locators in this order of priority: 1. Playwright-specific locators (getByRole, getByLabel, getByPlaceholder, getByText, getByAltText, getByTitle, getByTestId) 2. CSS selectors 3. XPath.
[Mandatory] – Read test data from the testdata folder.
[Mandatory] – Please add an Allure report using the allure-playwright reporter in playwright.config.ts.
[Mandatory] – After building the framework, run all tests with npx playwright test --headed and fix any failures.
[Output] – Output only runnable code—no explanations, comments, installation instructions, or extra text.
[Don't] – Don't use CSS selectors or XPath when a Playwright-specific locator is available.
[Don't] – Don't add comments, page.waitForTimeout() and other bad coding practice.
[Don't] – Don't hardcode credentials, URLs or test data inside the scripts.
[Generate] – Generate the 10 spec files, one per feature, each with valid and invalid test cases.
[DoNOTUse] page.waitForTimeout() anywhere; rely on Playwright auto-waiting and web-first assertions such as expect(locator).toBeVisible().

Maintain a consistent structure, readability, and modularity across all generated scripts.

C — Context
You are creating a Playwright TypeScript framework in the PlaywrightFramework folder for an e-commerce practice application. The flow is: login page (Email, Password, Login button, Forgot password link, Register button, Register here link), dashboard (Filters panel with search, price range, categories, sub categories and search for; product cards with View and Add To Cart; top navigation HOME, ORDERS, Cart with item count, Sign Out), cart page (My Cart, Continue Shopping, product details, Buy Now, delete, Subtotal, Total, Checkout), checkout page (payment methods, personal information, shipping information with country auto-suggest, Apply Coupon, PLACE ORDER), thank you page (order confirmation with order id and CSV download), and orders page (Your Orders table with View and Delete, Go Back to Shop, Go Back to Cart).
The Forgot Password screen, the Register screen, the product details screen opened by View and the Add To Cart toast message are not in the screenshots. Inspect them on the live site before writing locators and assertions.
The dashboard shows a maximum of 9 products per page. The application keeps at most 7 orders and deletes an order when this is exceeded, so tests must not depend on the total order count.
Credentials and URLs come from testdata/qa.env through process.env (BASE_URL, USER_EMAIL, USER_PASSWORD).
Follow exactly this folder structure:
.github/workflows/
allure-results/
pages/
testdata/
tests/
utils/
.gitignore
auth.json
global-setup.ts
package-lock.json
package.json
playwright.config.ts

E — Example
Example structure for Page Object Model:

import { Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = page.getByLabel('Email');
        this.password = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async doLogin(user: string, pass: string) {
        await this.email.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }
}

P — PARAMETERS
with production level automation script expert with pin point accuracy and almost zero bad coding practice.

O — Output
Provide only:
Page Object files (one per page) in pages/
10 Playwright test spec files (one per feature) in tests/
global-setup.ts
Test data files in testdata/
Helper classes in utils/
Playwright TypeScript project (playwright.config.ts, package.json, .gitignore)
No explanations or additional content.

## Safety Rules, Guardrails, Anti Hallucination Rules

Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
```