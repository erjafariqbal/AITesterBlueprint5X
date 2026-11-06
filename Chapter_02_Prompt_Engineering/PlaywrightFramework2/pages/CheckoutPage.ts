import { expect, Locator, Page } from '@playwright/test';
import { Env } from '../utils/Env';
import { testData } from '../utils/TestData';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    readonly paymentTitle: Locator;
    readonly personalInfoTitle: Locator;
    readonly shippingInfoTitle: Locator;
    readonly cardNumber: Locator;
    readonly expiryMonth: Locator;
    readonly expiryYear: Locator;
    readonly cvv: Locator;
    readonly nameOnCard: Locator;
    readonly couponInput: Locator;
    readonly applyCouponButton: Locator;
    readonly invalidCouponMessage: Locator;
    readonly couponAppliedMessage: Locator;
    readonly shippingEmailLabel: Locator;
    readonly shippingEmail: Locator;
    readonly countryInput: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        const field = (title: string) => page.locator('.field').filter({ hasText: title });
        this.paymentTitle = page.getByText('Payment Method');
        this.personalInfoTitle = page.getByText('Personal Information');
        this.shippingInfoTitle = page.getByText('Shipping Information');
        this.cardNumber = field('Credit Card Number').getByRole('textbox').first();
        this.expiryMonth = field('Expiry Date').getByRole('combobox').first();
        this.expiryYear = field('Expiry Date').getByRole('combobox').last();
        this.cvv = field('CVV Code').getByRole('textbox').first();
        this.nameOnCard = field('Name on Card').getByRole('textbox').first();
        this.couponInput = field('Apply Coupon').getByRole('textbox').first();
        this.applyCouponButton = page.getByRole('button', { name: 'Apply Coupon' });
        this.invalidCouponMessage = page.getByText(testData.messages.invalidCoupon);
        this.couponAppliedMessage = page.getByText(testData.messages.couponApplied);
        this.shippingEmailLabel = page.locator('.details__user').getByText(Env.userEmail);
        this.shippingEmail = page.locator('.user__name').getByRole('textbox').first();
        this.countryInput = page.getByPlaceholder('Select Country');
        this.placeOrderButton = page.getByText('Place Order');
    }

    paymentMethod(name: string): Locator {
        return this.page.locator('.payment__type').filter({ hasText: name });
    }

    async expectDisplayed() {
        await expect(this.page).toHaveURL(/dashboard\/order/);
        await expect(this.paymentTitle).toBeVisible();
    }

    async fillPersonalInformation() {
        const { cardNumber, expiryMonth, expiryYear, cvv, nameOnCard } = testData.payment;
        await this.cardNumber.fill(cardNumber);
        await this.expiryMonth.selectOption(expiryMonth);
        await this.expiryYear.selectOption(expiryYear);
        await this.cvv.fill(cvv);
        await this.nameOnCard.fill(nameOnCard);
    }

    async applyCoupon(coupon: string) {
        await this.couponInput.fill(coupon);
        await this.applyCouponButton.click();
    }

    async fillShippingEmail(email: string) {
        await this.shippingEmail.fill(email);
    }

    async selectCountry(query: string, country: string) {
        try {
            await this.countryInput.pressSequentially(query, { delay: 120 });
            await this.page.getByRole('button').filter({ hasText: new RegExp(`^\\s*${country}\\s*$`) }).click();
            await expect(this.countryInput).toHaveValue(country);
        } catch (error) {
            throw new Error(`Could not select country "${country}" from suggestions: ${String(error)}`);
        }
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }
}
