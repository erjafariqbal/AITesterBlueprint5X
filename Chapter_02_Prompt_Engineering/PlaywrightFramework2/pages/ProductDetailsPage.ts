import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly continueShopping: Locator;
    readonly detailsHeading: Locator;
    readonly shareHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.getByRole('heading', { level: 2 });
        this.productPrice = page.getByRole('heading', { level: 3 }).filter({ hasText: '$' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
        this.continueShopping = page.getByText('Continue Shopping');
        this.detailsHeading = page.getByRole('heading', { name: 'product details' });
        this.shareHeading = page.getByRole('heading', { name: 'Share It' });
    }

    async expectDisplayed(name: string) {
        await expect(this.page).toHaveURL(/dashboard\/product-details/);
        await expect(this.productName).toHaveText(name, { ignoreCase: true });
    }
}
