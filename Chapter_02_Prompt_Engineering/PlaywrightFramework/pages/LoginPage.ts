import { expect, Locator, Page, test } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly logo: Locator;
    readonly heading: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly rememberMe: Locator;
    readonly forgotPassword: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly dashboardIdentifier: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'Wingify', exact: true });
        this.heading = page.getByText('Sign in to Wingify platform');
        this.username = page.getByRole('textbox', { name: 'Email address' });
        this.password = page.getByRole('textbox', { name: 'Password', exact: true });
        this.rememberMe = page.getByText('Remember me');
        this.forgotPassword = page.getByRole('button', { name: 'Forgot Password?' });
        this.loginButton = page.getByRole('button', { name: 'Sign in', exact: true });
        this.errorMessage = page.getByText('Your email, password, IP address or location did not match');
        this.dashboardIdentifier = page.getByRole('navigation');
    }

    async launchUrl(url: string) {
        await test.step('Launch the login page', async () => {
            try {
                await this.page.goto(url);
                await expect(this.username).toBeVisible();
            } catch (error) {
                throw new Error(`Unable to launch ${url}: ${String(error)}`);
            }
        });
    }

    async verifyLoginPage() {
        await test.step('Verify the logo and fields on the login page', async () => {
            await expect(this.logo).toBeVisible();
            await expect(this.heading).toBeVisible();
            await expect(this.username).toBeVisible();
            await expect(this.password).toBeVisible();
            await expect(this.rememberMe).toBeVisible();
            await expect(this.forgotPassword).toBeVisible();
            await expect(this.loginButton).toBeEnabled();
        });
    }

    async loginToApplication(user: string, pass: string) {
        await test.step(`Login with ${user}`, async () => {
            try {
                await this.username.fill(user);
                await this.password.fill(pass);
                await this.loginButton.click();
            } catch (error) {
                throw new Error(`Login action failed for ${user}: ${String(error)}`);
            }
        });
    }

    async loginErrorMessage() {
        await test.step('Verify the login error message', async () => {
            await expect(this.errorMessage).toBeVisible();
        });
    }
}
