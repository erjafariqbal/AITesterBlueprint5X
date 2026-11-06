import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

let lp: LoginPage;

test.beforeEach(async ({ page }) => {
    lp = new LoginPage(page);
    await lp.launchUrl(process.env.BASE_URL!);
});

test('login into Wingify', async () => {
    await lp.verifyLoginPage();
    await lp.loginToApplication(process.env.USER_USERNAME!, process.env.USER_PASSWORD!);
    await expect(lp.dashboardIdentifier).toBeVisible();
});

test('login into Wingify with Remember me selected', async () => {
    await lp.rememberMe.click();
    await lp.loginToApplication(process.env.USER_USERNAME!, process.env.USER_PASSWORD!);
    await expect(lp.dashboardIdentifier).toBeVisible();
});
