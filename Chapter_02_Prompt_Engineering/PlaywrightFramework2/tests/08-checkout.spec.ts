import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ThankYouPage } from '../pages/ThankYouPage';
import { Env } from '../utils/Env';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

const { payment, messages } = testData;

test.describe('Checkout', { tag: '@requires-account' }, () => {
    let dashboardPage: DashboardPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let thankYouPage: ThankYouPage;
    let productName: string;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        thankYouPage = new ThankYouPage(page);
        await cartPage.clear();
        await dashboardPage.open();
        productName = await dashboardPage.addFirstProductToCart();
        await dashboardPage.openCart();
        await cartPage.checkout();
        await checkoutPage.expectDisplayed();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
        await cartPage.clear();
    });

    test('displays the payment methods', async () => {
        for (const method of payment.methods) {
            await expect(checkoutPage.paymentMethod(method)).toBeVisible();
        }
    });

    test('displays personal information fields', async () => {
        await expect(checkoutPage.personalInfoTitle).toBeVisible();
        await expect(checkoutPage.cardNumber).toBeVisible();
        await expect(checkoutPage.expiryMonth).toBeVisible();
        await expect(checkoutPage.expiryYear).toBeVisible();
        await expect(checkoutPage.cvv).toBeVisible();
        await expect(checkoutPage.nameOnCard).toBeVisible();
        await expect(checkoutPage.couponInput).toBeVisible();
        await expect(checkoutPage.applyCouponButton).toBeVisible();
    });

    test('displays shipping information fields', async () => {
        await expect(checkoutPage.shippingInfoTitle).toBeVisible();
        await expect(checkoutPage.shippingEmailLabel).toBeVisible();
        await expect(checkoutPage.shippingEmail).toBeVisible();
        await expect(checkoutPage.countryInput).toBeVisible();
        await expect(checkoutPage.placeOrderButton).toBeVisible();
    });

    test('valid coupon is applied', async () => {
        await checkoutPage.applyCoupon(payment.validCoupon);
        await expect(checkoutPage.couponAppliedMessage).toBeVisible();
    });

    test('invalid coupon shows an error', async () => {
        await checkoutPage.applyCoupon(payment.invalidCoupon);
        await expect(checkoutPage.invalidCouponMessage).toBeVisible();
    });

    test('empty coupon shows an error toast', async () => {
        await checkoutPage.applyCouponButton.click();
        await checkoutPage.expectToast(messages.emptyCoupon);
    });

    test('placing an order without a country shows an error toast', async ({ page }) => {
        await checkoutPage.fillShippingEmail(Env.userEmail);
        await checkoutPage.placeOrder();
        await checkoutPage.expectToast(messages.missingShipping);
        await expect(page).toHaveURL(/dashboard\/order/);
    });

    test('placing an order shows the thank you page', async ({ page }) => {
        await test.step('Fill in the order', async () => {
            await checkoutPage.fillPersonalInformation();
            await checkoutPage.fillShippingEmail(Env.userEmail);
            await checkoutPage.selectCountry(payment.countryQuery, payment.country);
        });

        await test.step('Place the order', async () => {
            await checkoutPage.placeOrder();
            await thankYouPage.expectDisplayed();
        });

        await test.step('Verify the order summary', async () => {
            await thankYouPage.getOrderId();
            await expect(thankYouPage.productName(productName)).toBeVisible();
            await expect(thankYouPage.quantity).toBeVisible();
        });

        await test.step('Download the CSV', async () => {
            const download = await thankYouPage.downloadCsv();
            expect(download.suggestedFilename()).toMatch(/\.csv$/);
        });

        await test.step('Open the orders history', async () => {
            await thankYouPage.openOrdersHistory();
            await expect(new OrdersPage(page).heading).toBeVisible();
        });
    });
});
