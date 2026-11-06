import { expect, Locator, Page } from '@playwright/test';
import { Env } from '../utils/Env';
import { testData } from '../utils/TestData';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
    readonly heading: Locator;
    readonly goBackToShopButton: Locator;
    readonly goBackToCartButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Your Orders' });
        this.goBackToShopButton = page.getByRole('button', { name: 'Go Back to Shop' });
        this.goBackToCartButton = page.getByRole('button', { name: 'Go Back to Cart' });
    }

    async open() {
        await this.page.goto(Env.route(testData.routes.orders));
        await expect(this.heading).toBeVisible();
    }

    column(name: string): Locator {
        return this.page.getByRole('columnheader', { name, exact: true });
    }

    row(orderId: string): Locator {
        return this.page.getByRole('row').filter({ hasText: orderId });
    }

    async viewOrder(orderId: string) {
        await this.row(orderId).getByRole('button', { name: 'View' }).click();
        await expect(this.page).toHaveURL(/dashboard\/order-details/);
    }

    async deleteOrder(orderId: string) {
        await this.row(orderId).getByRole('button', { name: 'Delete' }).click();
        await expect(this.row(orderId)).toHaveCount(0);
    }
}
