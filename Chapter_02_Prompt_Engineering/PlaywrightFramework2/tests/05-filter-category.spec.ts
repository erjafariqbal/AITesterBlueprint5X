import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';
import { TextParser } from '../utils/TextParser';

const { filters } = testData;

test.describe('Filter and Category', { tag: '@requires-account' }, () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.open();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('search box shows only the matching product', async () => {
        const name = await dashboardPage.firstProductName();
        await dashboardPage.search(name);
        await dashboardPage.expectResultCountMatchesCards();
        const names = await dashboardPage.productCards.getByRole('heading', { level: 5 }).allTextContents();
        expect(names.length).toBeGreaterThan(0);
        for (const productName of names) {
            expect(productName.toLowerCase()).toContain(name.toLowerCase());
        }
    });

    test('search with no match shows zero results', async () => {
        await dashboardPage.search(filters.noMatchSearch);
        await expect(dashboardPage.productCards).toHaveCount(0);
    });

    test('Min Price and Max Price keep products inside the range', async () => {
        const price = await dashboardPage.firstProductPrice();
        await dashboardPage.setMinPrice(String(price));
        await dashboardPage.setMaxPrice(String(price));
        await dashboardPage.expectResultCountMatchesCards();
        const prices = await dashboardPage.productCards.getByText(/^\s*\$/).allTextContents();
        expect(prices.length).toBeGreaterThan(0);
        for (const text of prices) {
            expect(TextParser.price(text)).toBe(price);
        }
    });

    test('a price range below every product shows zero results', async () => {
        await dashboardPage.setMinPrice(filters.belowLowestPrice);
        await dashboardPage.setMaxPrice(filters.belowLowestPrice);
        await expect(dashboardPage.productCards).toHaveCount(0);
    });

    for (const filter of [...filters.categories, ...filters.subCategories, ...filters.searchFor]) {
        test(`"${filter}" filter updates the results and can be cleared`, async () => {
            const baseline = await dashboardPage.resultCount();

            await test.step('Apply the filter', async () => {
                await dashboardPage.toggleFilter(filter);
                await expect(dashboardPage.filterCheckbox(filter)).toBeChecked();
                await dashboardPage.expectResultCountMatchesCards();
                expect(await dashboardPage.resultCount()).toBeLessThanOrEqual(baseline);
            });

            await test.step('Clear the filter', async () => {
                await dashboardPage.toggleFilter(filter);
                await expect(dashboardPage.filterCheckbox(filter)).not.toBeChecked();
                await expect(dashboardPage.resultsText).toContainText(`Showing ${baseline} results`);
            });
        });
    }
});
