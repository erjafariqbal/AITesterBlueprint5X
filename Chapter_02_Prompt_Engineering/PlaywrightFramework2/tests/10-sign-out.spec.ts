import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { Env } from '../utils/Env';
import { ReportHelper } from '../utils/ReportHelper';
import { testData } from '../utils/TestData';

const { routes, messages } = testData;
const protectedRoutes = [routes.dashboard, routes.cart, routes.orders];

test.describe('Sign out', { tag: '@requires-account' }, () => {
    let dashboardPage: DashboardPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        loginPage = new LoginPage(page);
        await dashboardPage.open();
    });

    test.afterEach(async ({ page }, testInfo) => {
        await ReportHelper.attachPageState(page, testInfo);
    });

    test('Sign Out shows the login page', async () => {
        await dashboardPage.signOut();
        await dashboardPage.expectToast(messages.logout);
        await loginPage.expectDisplayed();
    });

    for (const route of protectedRoutes) {
        test(`${route} is not accessible after signing out`, async ({ page }) => {
            await dashboardPage.signOut();
            await loginPage.expectDisplayed();
            await page.goto(Env.route(route));
            await loginPage.expectDisplayed();
        });
    }
});

test.describe('Protected pages without a session', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    for (const route of protectedRoutes) {
        test(`${route} redirects to the login page`, async ({ page }) => {
            await page.goto(Env.route(route));
            await new LoginPage(page).expectDisplayed();
        });
    }
});
