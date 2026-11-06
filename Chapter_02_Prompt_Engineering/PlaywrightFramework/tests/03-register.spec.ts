import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage, RegistrationDetails } from '../pages/RegisterPage';
import { DataGenerator } from '../utils/DataGenerator';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

const { messages, invalidUser, registration } = testData;

function validDetails(): RegistrationDetails {
    const password = DataGenerator.strongPassword();
    return {
        ...registration,
        email: DataGenerator.uniqueEmail(),
        password,
        confirmPassword: password,
        confirmAge: true,
    };
}

test.describe('Register', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    let loginPage: LoginPage;
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        await loginPage.open();
        await loginPage.registerHereLink.click();
        await registerPage.expectDisplayed();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('displays all register fields', async () => {
        await expect(registerPage.firstName).toBeVisible();
        await expect(registerPage.lastName).toBeVisible();
        await expect(registerPage.email).toBeVisible();
        await expect(registerPage.phone).toBeVisible();
        await expect(registerPage.occupation).toBeVisible();
        await expect(registerPage.maleRadio).toBeVisible();
        await expect(registerPage.femaleRadio).toBeVisible();
        await expect(registerPage.password).toBeVisible();
        await expect(registerPage.confirmPassword).toBeVisible();
        await expect(registerPage.ageCheckbox).toBeVisible();
        await expect(registerPage.registerButton).toBeVisible();
        await expect(registerPage.loginHereLink).toBeVisible();
    });

    test('registers with unique generated data', { tag: '@creates-account' }, async ({ page }) => {
        await registerPage.register(validDetails());
        await expect(page.getByRole('heading', { name: messages.accountCreated })).toBeVisible();
    });

    test('empty fields show required messages', async ({ page }) => {
        await registerPage.registerButton.click();
        await expect(page.getByText(messages.firstNameRequired)).toBeVisible();
        await expect(page.getByText(messages.emailRequired)).toBeVisible();
        await expect(page.getByText(messages.phoneRequired)).toBeVisible();
        await expect(page.getByText(messages.passwordRequired)).toBeVisible();
        await expect(page.getByText(messages.registerConfirmPasswordRequired, { exact: true })).toBeVisible();
    });

    test('malformed email shows a validation message', async ({ page }) => {
        await registerPage.email.fill(invalidUser.malformedEmail);
        await registerPage.registerButton.click();
        await expect(page.getByText(messages.invalidEmail)).toBeVisible();
    });

    test('first name shorter than 3 characters shows a validation message', async ({ page }) => {
        await registerPage.firstName.fill(invalidUser.shortFirstName);
        await registerPage.registerButton.click();
        await expect(page.getByText(messages.firstNameLength)).toBeVisible();
    });

    test('short phone number shows a validation message', async ({ page }) => {
        await registerPage.phone.fill(invalidUser.shortPhone);
        await registerPage.registerButton.click();
        await expect(page.getByText(messages.phoneLength)).toBeVisible();
    });

    test('mismatched passwords show a validation message', async ({ page }) => {
        await registerPage.password.fill(DataGenerator.strongPassword());
        await registerPage.confirmPassword.fill(invalidUser.mismatchPassword);
        await registerPage.registerButton.click();
        await expect(page.getByText(messages.passwordMismatch)).toBeVisible();
    });

    test('Login here link returns to the login page', async () => {
        await registerPage.loginHereLink.click();
        await loginPage.expectDisplayed();
    });
});
