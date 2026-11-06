import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ThankYouPage } from '../pages/ThankYouPage';
import { Env } from '../utils/Env';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

const { payment, orders } = testData;

test.describe('Order page', { tag: '@requires-account' }, () => {
    let ordersPage: OrdersPage;
    let orderId: string;
    let productName: string;

    test.beforeEach(async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const thankYouPage = new ThankYouPage(page);
        ordersPage = new OrdersPage(page);

        await cartPage.clear();
        await dashboardPage.open();
        productName = await dashboardPage.addFirstProductToCart();
        await dashboardPage.openCart();
        await cartPage.checkout();
        await checkoutPage.fillShippingEmail(Env.userEmail);
        await checkoutPage.selectCountry(payment.countryQuery, payment.country);
        await checkoutPage.placeOrder();
        await thankYouPage.expectDisplayed();
        orderId = await thankYouPage.getOrderId();
        await thankYouPage.openOrdersHistory();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('displays every column of the Your Orders table', async () => {
        await expect(ordersPage.heading).toBeVisible();
        for (const column of orders.columns) {
            await expect(ordersPage.column(column)).toBeVisible();
        }
    });

    test('lists the order id from the thank you page', async () => {
        await expect(ordersPage.row(orderId)).toBeVisible();
        await expect(ordersPage.row(orderId)).toContainText(productName, { ignoreCase: true });
    });

    test('View opens the order details', async ({ page }) => {
        const orderDetailsPage = new OrderDetailsPage(page);
        await ordersPage.viewOrder(orderId);
        await expect(orderDetailsPage.thankYouText).toBeVisible();
        await expect(orderDetailsPage.orderSummary).toBeVisible();
        await expect(orderDetailsPage.orderId(orderId)).toBeVisible();
    });

    test('Delete removes the order from the table', async () => {
        await ordersPage.deleteOrder(orderId);
        await expect(ordersPage.row(orderId)).toBeHidden();
    });

    test('Go Back to Shop opens the dashboard', async ({ page }) => {
        await ordersPage.goBackToShopButton.click();
        await expect(page).toHaveURL(/dashboard/);
        await expect(new DashboardPage(page).productCards.first()).toBeVisible();
    });

    test('Go Back to Cart opens the cart', async ({ page }) => {
        await ordersPage.goBackToCartButton.click();
        await expect(page).toHaveURL(/dashboard\/cart/);
    });
});
