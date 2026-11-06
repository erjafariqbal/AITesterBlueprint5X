import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, 'testdata/qa.env'), quiet: true });

export default defineConfig({
    testDir: './tests',
    outputDir: './allure-results/test-artifacts',
    globalSetup: './utils/globalSetup.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 60_000,
    expect: { timeout: 15_000 },
    reporter: process.env.CI
        ? [['list'], ['github'], ['allure-playwright', { resultsDir: 'allure-results' }]]
        : [['list'], ['allure-playwright', { resultsDir: 'allure-results' }]],
    use: {
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
