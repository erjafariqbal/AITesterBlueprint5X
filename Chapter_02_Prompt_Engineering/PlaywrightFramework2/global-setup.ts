import { chromium, expect, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { Env } from './utils/Env';

async function globalSetup(_config: FullConfig): Promise<void> {
    const email = Env.userEmail;
    const password = Env.userPassword;
    const browser = await chromium.launch();

    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.doLogin(email, password);
        await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
        await context.storageState({ path: 'auth.json' });
    } catch (error) {
        throw new Error(`Global setup could not log in and save auth.json: ${String(error)}`);
    } finally {
        await browser.close();
    }
}

export default globalSetup;
