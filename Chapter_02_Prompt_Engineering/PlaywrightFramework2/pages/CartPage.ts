import { expect, Locator, Page } from '@playwright/test';
import { Env } from '../utils/Env';
import { testData } from '../utils/TestData';
import { TextParser } from '../utils/TextParser';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly heading: Locator;
    readonly continueShoppingButton: Locator;
    readonly emptyMessage: Locator;
    readonly items: Locator;
    readonly subtotalValue: Locator;
    readonly totalValue: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'My Cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.emptyMessage = page.getByRole('heading', { name: testData.messages.emptyCart });
        this.items = page.locator('.cartWrap');
        this.subtotalValue = page.locator('.totalRow').filter({ hasText: 'Subtotal' }).locator('.value');
        this.totalValue = page.locator('.totalRow').filter({ hasText: /^\s*Total/ }).locator('.value');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async open() {
        await this.page.goto(Env.route(testData.routes.cart));
        await expect(this.heading).toBeVisible();
        await expect(this.items.first().or(this.emptyMessage).first()).toBeVisible();
    }

    item(name: string): Locator {
        return this.items.filter({ hasText: name });
    }

    itemName(item: Locator): Locator {
        return item.getByRole('heading', { level: 3 });
    }

    itemMrp(item: Locator): Locator {
        return item.getByText(/MRP \$/);
    }

    itemStock(item: Locator): Locator {
        return item.getByText('In Stock');
    }

    itemPrice(item: Locator): Locator {
        return item.locator('.prodTotal');
    }

    itemBuyNow(item: Locator): Locator {
        return item.getByRole('button', { name: 'Buy Now' });
    }

    itemDelete(item: Locator): Locator {
        return item.locator('.btn-danger');
    }

    async clear() {
        await this.open();
        let remaining = await this.items.count();
        while (remaining > 0) {
            await this.itemDelete(this.items.first()).click();
            remaining -= 1;
            await expect(this.items).toHaveCount(remaining);
        }
    }

    async itemPriceValue(item: Locator): Promise<number> {
        return TextParser.price(await this.itemPrice(item).textContent());
    }

    async subtotal(): Promise<number> {
        return TextParser.price(await this.subtotalValue.textContent());
    }

    async total(): Promise<number> {
        return TextParser.price(await this.totalValue.textContent());
    }

    async checkout() {
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL(/dashboard\/order/);
    }
}
