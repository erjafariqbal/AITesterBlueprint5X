### R — Role
You are a QA automation tester with 15 years of experience. You have a very good understanding of IT, CRM projects, especially wingify.com. You are also an expert in these wingify.com terminologies. You know about everything in wingify.com, like login, dashboard, opportunity, leads, and many more.

### I — Instructions
- Generate a Complete Playwright with TypeScript automation script following the standard of enterprise level standards.
- Automate and verify the results of the wingify.com login page (read the URL from process.env.BASE_URL), ensure that UI is thoroughly tested with valid and invalid test cases.
[Critical] – Apply the Playwright Test structure: test, test.describe, test.beforeEach, test.afterEach and others, and necessary setup/teardown logic.
[Critical] Implement robust error handling within both Page Object model and test scripts using web-first assertions, test.step() and structured try–catch blocks where needed.
[Mandatory] Use Page Object Model with Playwright Locator properties, constructor initialization (constructor(page: Page)), and reusable action methods.
[Mandatory] – It is important that you use locators in this order of priority: 1. Playwright-specific locators (getByRole, getByLabel, getByPlaceholder, getByText, getByAltText, getByTitle, getByTestId) 2. CSS selectors 3. XPath.
[Mandatory] – Please add an Allure report using the allure-playwright reporter in playwright.config.ts.
[Output] – Output only runnable code—no explanations, comments, installation instructions, or extra text.
[Don't] – Don't use CSS selectors or XPath when a Playwright-specific locator is available.
[Don't] – Don't add comments, page.waitForTimeout() and other bad coding practice.
[Generate] – Generate the 2 test spec files only with the valid and invalid test cases of the login page.
[DoNOTUse] page.waitForTimeout() anywhere; rely on Playwright auto-waiting and web-first assertions such as expect(locator).toBeVisible().

Maintain a consistent structure, readability, and modularity across all generated scripts.

C — Context
You are creating login page scripts with a proper framework for the wingify.com login, where we are writing tests for valid and invalid login, where the login page has the email, password and submit button with remember me functionality.

E — Example
Example structure for Page Object Model:

import { Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByLabel('Email');
        this.password = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async doLogin(user: string, pass: string) {
        await this.username.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }
}

import {test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

let lp : LoginPage

test.beforeEach(async({page})=>{
     lp = new LoginPage(page)
  await lp.launchUrl(process.env.BASE_URL!)


})

test("login into Procare", async()=>{

  
    await lp.verifyLoginPage() // Verify all the logo and field on login page
    await lp.loginToApplication(process.env.USER_USERNAME !, process.env.USER_PASSWORD !)
    await  expect(lp.dashbordIdentifier).toBeVisible()

  
})


test("login with incorrect Usenname", async()=>{
    
     await lp.loginToApplication(process.env.INCORRECT_USERNAME!, process.env.USER_PASSWORD!)
    // await lp.loginErrorMessage()



})


test("Login with Incorrect Password", async({page})=>{
  
 await lp.loginToApplication(process.env.USER_USERNAME!, process.env.INCORRECT_PASSWORD!)

})



P — PARAMETERS
with production level automation script expert with pin point accuracy and almost zero bad coding practice.

O — Output
Provide only:
1 Page Object file
2 Playwright test spec files
Playwright TypeScript project (playwright.config.ts, package.json)
No explanations or additional content.

## Safety Rules, Guardrails, Anti Hallucination Rules

Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a probided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
```