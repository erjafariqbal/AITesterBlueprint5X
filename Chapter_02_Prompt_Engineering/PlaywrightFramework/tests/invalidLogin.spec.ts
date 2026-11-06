import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

let lp: LoginPage;

test.beforeEach(async ({ page }) => {
    lp = new LoginPage(page);
    await lp.launchUrl(process.env.BASE_URL!);
});

test('login with incorrect Username', async () => {
    await lp.loginToApplication(process.env.INCORRECT_USERNAME!, process.env.USER_PASSWORD!);
    await lp.loginErrorMessage();
});

test('login with incorrect Password', async () => {
    await lp.loginToApplication(process.env.USER_USERNAME!, process.env.INCORRECT_PASSWORD!);
    await lp.loginErrorMessage();
});
