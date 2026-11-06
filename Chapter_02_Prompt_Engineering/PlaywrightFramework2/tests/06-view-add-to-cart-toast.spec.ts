import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

test.describe('View button, Add To Cart and toast message', { tag: '@requires-account' }, () => {
    let dashboardPage: DashboardPage;
    let cartPage: CartPage;
    let detailsPage: ProductDetailsPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        cartPage = new CartPage(page);
        detailsPage = new ProductDetailsPage(page);
        await cartPage.clear();
        await dashboardPage.open();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
        await cartPage.clear();
    });

    test('View opens the details of the selected product', async () => {
        const name = await dashboardPage.firstProductName();
        const price = await dashboardPage.firstProductPrice();

        await dashboardPage.cardViewButton(dashboardPage.card(0)).click();

        await detailsPage.expectDisplayed(name);
        await expect(detailsPage.productPrice).toContainText(String(price));
        await expect(detailsPage.addToCartButton).toBeVisible();
        await expect(detailsPage.continueShopping).toBeVisible();
        await expect(detailsPage.detailsHeading).toBeVisible();
        await expect(detailsPage.shareHeading).toBeVisible();
    });

    test('Add To Cart on a card shows the toast and increases the badge', async () => {
        await dashboardPage.expectCartCount(0);
        await dashboardPage.addFirstProductToCart();
        await dashboardPage.expectCartCount(1);
    });

    test('Add to Cart on the details page shows the toast and increases the badge', async () => {
        const name = await dashboardPage.firstProductName();
        await dashboardPage.cardViewButton(dashboardPage.card(0)).click();
        await detailsPage.expectDisplayed(name);

        await detailsPage.addToCartButton.click();

        await detailsPage.expectToast(testData.messages.addToCart);
        await detailsPage.expectCartCount(1);
    });

    test('viewing a product without adding it leaves the badge unchanged', async () => {
        const name = await dashboardPage.firstProductName();
        await dashboardPage.cardViewButton(dashboardPage.card(0)).click();
        await detailsPage.expectDisplayed(name);
        await detailsPage.expectCartCount(0);
    });
});
