import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface RegistrationDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    occupation: string;
    gender: string;
    password: string;
    confirmPassword: string;
    confirmAge: boolean;
}

export class RegisterPage extends BasePage {
    readonly heading: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly occupation: Locator;
    readonly maleRadio: Locator;
    readonly femaleRadio: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly ageCheckbox: Locator;
    readonly registerButton: Locator;
    readonly loginHereLink: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Register' });
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.email = page.getByPlaceholder('email@example.com');
        this.phone = page.getByPlaceholder('enter your number');
        this.occupation = page.getByRole('combobox');
        this.maleRadio = page.getByRole('radio', { name: 'Male', exact: true });
        this.femaleRadio = page.getByRole('radio', { name: 'Female', exact: true });
        this.password = page.getByPlaceholder('Passsword', { exact: true });
        this.confirmPassword = page.getByPlaceholder('Confirm Passsword');
        this.ageCheckbox = page.getByRole('checkbox');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.loginHereLink = page.getByText('Login here');
    }

    async expectDisplayed() {
        await expect(this.page).toHaveURL(/auth\/register/);
        await expect(this.heading).toBeVisible();
    }

    async register(details: RegistrationDetails) {
        await this.firstName.fill(details.firstName);
        await this.lastName.fill(details.lastName);
        await this.email.fill(details.email);
        await this.phone.fill(details.phone);
        await this.occupation.selectOption(details.occupation);
        await this.page.getByRole('radio', { name: details.gender, exact: true }).check();
        await this.password.fill(details.password);
        await this.confirmPassword.fill(details.confirmPassword);
        if (details.confirmAge) {
            await this.ageCheckbox.check();
        }
        await this.registerButton.click();
    }
}
