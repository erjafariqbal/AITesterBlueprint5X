import { expect, Locator, Page } from '@playwright/test';
import { Env } from '../utils/Env';
import { testData } from '../utils/TestData';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly heading: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly registerButton: Locator;
    readonly registerHereLink: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Log in' });
        this.email = page.getByPlaceholder('email@example.com');
        this.password = page.getByPlaceholder('enter your passsword');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
        this.registerButton = page.getByRole('link', { name: 'Register', exact: true });
        this.registerHereLink = page.getByText('Register here');
    }

    async open() {
        await this.page.goto(Env.route(testData.routes.login));
        await expect(this.loginButton).toBeVisible();
    }

    async doLogin(user: string, pass: string) {
        await this.email.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }

    async expectDisplayed() {
        await expect(this.page).toHaveURL(/auth\/login/);
        await expect(this.loginButton).toBeVisible();
    }
}
