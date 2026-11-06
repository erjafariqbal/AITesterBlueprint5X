import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly homeNav: Locator;
    readonly ordersNav: Locator;
    readonly cartNav: Locator;
    readonly cartBadge: Locator;
    readonly signOutNav: Locator;

    constructor(page: Page) {
        this.page = page;
        const nav = page.getByRole('navigation');
        this.homeNav = nav.getByRole('button', { name: 'HOME' });
        this.ordersNav = nav.getByRole('button', { name: 'ORDERS' });
        this.cartNav = nav.getByRole('button', { name: 'Cart' });
        this.cartBadge = this.cartNav.locator('label');
        this.signOutNav = nav.getByRole('button', { name: 'Sign Out' });
    }

    async expectToast(message: string) {
        await expect(this.page.getByLabel(message).first()).toBeVisible();
    }

    async expectCartCount(count: number) {
        await expect(this.cartBadge).toHaveText(count === 0 ? /^\s*0?\s*$/ : String(count));
    }

    async openCart() {
        await this.cartNav.click();
        await expect(this.page).toHaveURL(/dashboard\/cart/);
    }

    async openOrders() {
        await this.ordersNav.click();
        await expect(this.page).toHaveURL(/dashboard\/myorders/);
    }

    async signOut() {
        await this.signOutNav.click();
    }
}
