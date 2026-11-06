import { Download, expect, Locator, Page } from '@playwright/test';
import { testData } from '../utils/TestData';
import { TextParser } from '../utils/TextParser';
import { BasePage } from './BasePage';

export class ThankYouPage extends BasePage {
    readonly confirmationHeading: Locator;
    readonly orderId: Locator;
    readonly quantity: Locator;
    readonly csvButton: Locator;
    readonly ordersHistoryLink: Locator;

    constructor(page: Page) {
        super(page);
        this.confirmationHeading = page.getByRole('heading', { name: testData.messages.orderConfirmation });
        this.orderId = page.getByText(/[a-f0-9]{24}/).first();
        this.quantity = page.getByText('Qty: 1');
        this.csvButton = page.getByRole('button', { name: 'Click To Download Order Details in CSV' });
        this.ordersHistoryLink = page.getByText('Orders History Page');
    }

    productName(name: string): Locator {
        return this.page.getByText(name, { exact: true });
    }

    async expectDisplayed() {
        await expect(this.page).toHaveURL(/dashboard\/thanks/);
        await expect(this.confirmationHeading).toBeVisible();
    }

    async getOrderId(): Promise<string> {
        await expect(this.orderId).toBeVisible();
        return TextParser.orderId(await this.orderId.textContent());
    }

    async downloadCsv(): Promise<Download> {
        const download = this.page.waitForEvent('download');
        await this.csvButton.click();
        return download;
    }

    async openOrdersHistory() {
        await this.ordersHistoryLink.click();
        await expect(this.page).toHaveURL(/dashboard\/myorders/);
    }
}
