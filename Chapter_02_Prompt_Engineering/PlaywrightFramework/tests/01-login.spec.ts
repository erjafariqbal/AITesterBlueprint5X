import { expect, test } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Env } from '../utils/Env';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

const { messages, invalidUser } = testData;

test.describe('Login', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('displays all login elements', async () => {
        await expect(loginPage.heading).toBeVisible();
        await expect(loginPage.email).toBeVisible();
        await expect(loginPage.password).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.registerButton).toBeVisible();
        await expect(loginPage.registerHereLink).toBeVisible();
    });

    test('valid login lands on the dashboard', { tag: '@requires-account' }, async ({ page }) => {
        await test.step('Log in with valid credentials', async () => {
            await loginPage.doLogin(Env.userEmail, Env.userPassword);
        });
        await test.step('Verify the dashboard is shown', async () => {
            await expect(page).toHaveURL(/dashboard/);
            await expect(loginPage.signOutNav).toBeVisible();
        });
    });

    test('malformed email shows a validation message', async () => {
        await loginPage.doLogin(invalidUser.malformedEmail, invalidUser.wrongPassword);
        await expect(loginPage.page.getByText(messages.invalidEmail)).toBeVisible();
        await loginPage.expectDisplayed();
    });

    test('unknown email shows an error toast', async () => {
        await loginPage.doLogin(invalidUser.unknownEmail, invalidUser.wrongPassword);
        await loginPage.expectToast(messages.incorrectLogin);
        await loginPage.expectDisplayed();
    });

    test('wrong password shows an error toast', { tag: '@requires-account' }, async () => {
        await loginPage.doLogin(Env.userEmail, invalidUser.wrongPassword);
        await loginPage.expectToast(messages.incorrectLogin);
        await loginPage.expectDisplayed();
    });

    test('empty fields show required messages', async ({ page }) => {
        await loginPage.loginButton.click();
        await expect(page.getByText(messages.emailRequired)).toBeVisible();
        await expect(page.getByText(messages.passwordRequired)).toBeVisible();
        await loginPage.expectDisplayed();
    });

    test('Forgot password link opens the Forgot Password page', async ({ page }) => {
        await loginPage.forgotPasswordLink.click();
        await new ForgotPasswordPage(page).expectDisplayed();
    });

    test('Register button opens the Register page', async ({ page }) => {
        await loginPage.registerButton.click();
        await new RegisterPage(page).expectDisplayed();
    });

    test('Register here link opens the Register page', async ({ page }) => {
        await loginPage.registerHereLink.click();
        await new RegisterPage(page).expectDisplayed();
    });
});
