import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, 'testdata/qa.env'), quiet: true });

export default defineConfig({
    testDir: './tests',
    outputDir: './allure-results/test-artifacts',
    globalSetup: './global-setup.ts',
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    timeout: 60_000,
    expect: { timeout: 15_000 },
    reporter: [['list'], ['allure-playwright', { resultsDir: 'allure-results' }]],
    use: {
        baseURL: process.env.BASE_URL,
        storageState: 'auth.json',
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
