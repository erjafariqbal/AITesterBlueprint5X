import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { Env } from '../utils/Env';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

test.describe('Dashboard', { tag: '@requires-account' }, () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.open();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('displays the top navigation', async () => {
        await expect(dashboardPage.homeNav).toBeVisible();
        await expect(dashboardPage.ordersNav).toBeVisible();
        await expect(dashboardPage.cartNav).toBeVisible();
        await expect(dashboardPage.signOutNav).toBeVisible();
    });

    test('displays the Filters panel', async () => {
        await expect(dashboardPage.filtersHeading).toBeVisible();
        await expect(dashboardPage.searchBox).toBeVisible();
        await expect(dashboardPage.minPrice).toBeVisible();
        await expect(dashboardPage.maxPrice).toBeVisible();
    });

    test('shows the results text and at most 9 products', async () => {
        await expect(dashboardPage.resultsText).toBeVisible();
        await expect(dashboardPage.maxProductsMessage).toBeVisible();
        await dashboardPage.expectResultCountMatchesCards();
    });

    test('every product card shows name, price, View and Add To Cart', async () => {
        const count = await dashboardPage.productCards.count();
        for (let index = 0; index < count; index += 1) {
            await test.step(`Verify product card ${index + 1}`, async () => {
                const card = dashboardPage.card(index);
                await expect(dashboardPage.cardName(card)).not.toBeEmpty();
                await expect(dashboardPage.cardPrice(card)).toBeVisible();
                await expect(dashboardPage.cardViewButton(card)).toBeVisible();
                await expect(dashboardPage.cardAddToCartButton(card)).toBeVisible();
            });
        }
    });

    test('displays pagination', async () => {
        await expect(dashboardPage.paginationPrevious).toContainText('Previous');
        await expect(dashboardPage.paginationCurrentPage).toContainText('1');
        await expect(dashboardPage.paginationNext).toContainText('Next');
    });
});

test.describe('Dashboard without a session', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('redirects to the login page', async ({ page }) => {
        await page.goto(Env.route(testData.routes.dashboard));
        await new LoginPage(page).expectDisplayed();
    });
});
