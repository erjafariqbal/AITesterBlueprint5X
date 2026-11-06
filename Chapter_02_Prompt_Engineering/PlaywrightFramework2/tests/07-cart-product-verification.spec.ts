import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ReportHelper } from '../utils/ReportHelper';

test.describe('Add to cart and product verification', { tag: '@requires-account' }, () => {
    let dashboardPage: DashboardPage;
    let cartPage: CartPage;
    let productName: string;
    let productPrice: number;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        cartPage = new CartPage(page);
        await cartPage.clear();
        await dashboardPage.open();
        productPrice = await dashboardPage.firstProductPrice();
        productName = await dashboardPage.addFirstProductToCart();
        await dashboardPage.openCart();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
        await cartPage.clear();
    });

    test('shows the product name, price, MRP and stock status', async () => {
        const item = cartPage.item(productName);
        await expect(cartPage.heading).toBeVisible();
        await expect(cartPage.itemName(item)).toHaveText(productName, { ignoreCase: true });
        await expect(cartPage.itemMrp(item)).toContainText(String(productPrice));
        await expect(cartPage.itemStock(item)).toBeVisible();
        expect(await cartPage.itemPriceValue(item)).toBe(productPrice);
    });

    test('Subtotal and Total match the product price', async () => {
        await expect(cartPage.subtotalValue).toBeVisible();
        expect(await cartPage.subtotal()).toBe(productPrice);
        expect(await cartPage.total()).toBe(productPrice);
    });

    test('Continue Shopping returns to the dashboard', async ({ page }) => {
        await cartPage.continueShoppingButton.click();
        await expect(page).toHaveURL(/dashboard/);
        await expect(dashboardPage.productCards.first()).toBeVisible();
    });

    test('Buy Now opens checkout', async ({ page }) => {
        await cartPage.itemBuyNow(cartPage.item(productName)).click();
        await new CheckoutPage(page).expectDisplayed();
    });

    test('Checkout opens checkout', async ({ page }) => {
        await cartPage.checkout();
        await new CheckoutPage(page).expectDisplayed();
    });

    test('deleting the product empties the cart', async () => {
        await cartPage.itemDelete(cartPage.item(productName)).click();
        await expect(cartPage.items).toHaveCount(0);
        await expect(cartPage.emptyMessage).toBeVisible();
        await expect(cartPage.checkoutButton).toBeHidden();
        await cartPage.expectCartCount(0);
    });
});
