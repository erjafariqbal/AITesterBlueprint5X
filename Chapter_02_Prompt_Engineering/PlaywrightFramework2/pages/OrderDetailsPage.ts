import { Locator, Page } from '@playwright/test';
import { testData } from '../utils/TestData';
import { BasePage } from './BasePage';

export class OrderDetailsPage extends BasePage {
    readonly thankYouText: Locator;
    readonly orderSummary: Locator;

    constructor(page: Page) {
        super(page);
        this.thankYouText = page.getByText(testData.messages.orderDetails);
        this.orderSummary = page.getByText('order summary');
    }

    orderId(id: string): Locator {
        return this.page.getByText(id);
    }
}
