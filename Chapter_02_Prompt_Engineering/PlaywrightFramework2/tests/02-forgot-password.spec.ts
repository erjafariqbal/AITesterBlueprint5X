import { expect, test } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DataGenerator } from '../utils/DataGenerator';
import { Env } from '../utils/Env';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

const { messages, invalidUser } = testData;

test.describe('Forgot Password', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    let loginPage: LoginPage;
    let forgotPasswordPage: ForgotPasswordPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        forgotPasswordPage = new ForgotPasswordPage(page);
        await loginPage.open();
        await loginPage.forgotPasswordLink.click();
        await forgotPasswordPage.expectDisplayed();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('displays all forgot password elements', async () => {
        await expect(forgotPasswordPage.heading).toBeVisible();
        await expect(forgotPasswordPage.email).toBeVisible();
        await expect(forgotPasswordPage.password).toBeVisible();
        await expect(forgotPasswordPage.confirmPassword).toBeVisible();
        await expect(forgotPasswordPage.saveButton).toBeVisible();
        await expect(forgotPasswordPage.loginLink).toBeVisible();
        await expect(forgotPasswordPage.registerLink).toBeVisible();
    });

    test('valid input saves the password and returns to login', { tag: '@requires-account' }, async () => {
        await forgotPasswordPage.submit(Env.userEmail, Env.userPassword, Env.userPassword);
        await loginPage.expectDisplayed();
    });

    test('empty fields show required messages', async ({ page }) => {
        await forgotPasswordPage.saveButton.click();
        await expect(page.getByText(messages.emailRequired)).toBeVisible();
        await expect(page.getByText(messages.passwordRequired)).toBeVisible();
        await expect(page.getByText(messages.confirmPasswordRequired)).toBeVisible();
    });

    test('malformed email shows a validation message', async ({ page }) => {
        const password = DataGenerator.strongPassword();
        await forgotPasswordPage.submit(invalidUser.malformedEmail, password, password);
        await expect(page.getByText(messages.invalidEmail)).toBeVisible();
    });

    test('mismatched passwords show a validation message', async ({ page }) => {
        await forgotPasswordPage.submit(invalidUser.unknownEmail, DataGenerator.strongPassword(), invalidUser.mismatchPassword);
        await expect(page.getByText(messages.passwordMismatch)).toBeVisible();
    });

    test('unknown email shows an error toast', async () => {
        const password = DataGenerator.strongPassword();
        await forgotPasswordPage.submit(invalidUser.unknownEmail, password, password);
        await forgotPasswordPage.expectToast(messages.userNotFound);
    });

    test('Login link returns to the login page', async () => {
        await forgotPasswordPage.loginLink.click();
        await loginPage.expectDisplayed();
    });

    test('Register link opens the Register page', async ({ page }) => {
        await forgotPasswordPage.registerLink.click();
        await new RegisterPage(page).expectDisplayed();
    });
});
