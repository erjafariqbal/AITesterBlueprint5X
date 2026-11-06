import { chromium, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Env } from './Env';

async function globalSetup(): Promise<void> {
    if (!Env.hasCredentials) {
        console.warn('USER_USERNAME and USER_PASSWORD are empty in testdata/qa.env; skipping auth.json generation.');
        return;
    }

    const browser = await chromium.launch();
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page);

        await loginPage.launchUrl(Env.baseUrl);
        await loginPage.loginToApplication(Env.userName, Env.userPassword);
        await expect(page).not.toHaveURL(/login/, { timeout: 30_000 });
        await context.storageState({ path: 'auth.json' });
    } catch (error) {
        throw new Error(`Global setup could not log in and save auth.json: ${String(error)}`);
    } finally {
        await browser.close();
    }
}

export default globalSetup;
