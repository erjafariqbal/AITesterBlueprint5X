import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
    readonly heading: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly saveButton: Locator;
    readonly loginLink: Locator;
    readonly registerLink: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Enter New Password' });
        this.email = page.getByPlaceholder('Enter your email address');
        this.password = page.getByPlaceholder('Passsword', { exact: true });
        this.confirmPassword = page.getByPlaceholder('Confirm Passsword');
        this.saveButton = page.getByRole('button', { name: 'Save New Password' });
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.registerLink = page.getByRole('link', { name: 'Register' });
    }

    async expectDisplayed() {
        await expect(this.page).toHaveURL(/auth\/password-new/);
        await expect(this.heading).toBeVisible();
    }

    async submit(email: string, password: string, confirmPassword: string) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
        await this.saveButton.click();
    }
}
