import { Page, TestInfo } from '@playwright/test';

export class ReportHelper {
    static async attachPageState(page: Page, testInfo: TestInfo): Promise<void> {
        if (testInfo.status === testInfo.expectedStatus) {
            return;
        }
        try {
            await testInfo.attach('failed-page-url', { body: page.url(), contentType: 'text/plain' });
        } catch (error) {
            console.warn(`Could not attach page state: ${String(error)}`);
        }
    }
}
