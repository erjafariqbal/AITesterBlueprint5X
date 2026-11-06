import { expect, Locator, Page } from '@playwright/test';
import { Env } from '../utils/Env';
import { testData } from '../utils/TestData';
import { TextParser } from '../utils/TextParser';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    readonly filterPanel: Locator;
    readonly filtersHeading: Locator;
    readonly searchBox: Locator;
    readonly minPrice: Locator;
    readonly maxPrice: Locator;
    readonly resultsText: Locator;
    readonly maxProductsMessage: Locator;
    readonly productCards: Locator;
    readonly paginationPrevious: Locator;
    readonly paginationNext: Locator;
    readonly paginationCurrentPage: Locator;

    constructor(page: Page) {
        super(page);
        this.filterPanel = page.locator('#sidebar');
        this.filtersHeading = this.filterPanel.getByRole('heading', { name: 'Filters' });
        this.searchBox = this.filterPanel.getByPlaceholder('search');
        this.minPrice = this.filterPanel.getByPlaceholder('Min Price');
        this.maxPrice = this.filterPanel.getByPlaceholder('Max Price');
        this.resultsText = page.getByText(/Showing \d+ results/);
        this.maxProductsMessage = page.getByText(testData.messages.maxProducts);
        this.productCards = page.locator('.card-body');
        this.paginationPrevious = page.locator('.pagination-previous');
        this.paginationNext = page.locator('.pagination-next');
        this.paginationCurrentPage = page.locator('.ngx-pagination .current');
    }

    async open() {
        await this.page.goto(Env.route(testData.routes.dashboard));
        await expect(this.productCards.first()).toBeVisible();
    }

    card(index: number): Locator {
        return this.productCards.nth(index);
    }

    cardName(card: Locator): Locator {
        return card.getByRole('heading', { level: 5 });
    }

    cardPrice(card: Locator): Locator {
        return card.getByText(/^\s*\$/);
    }

    cardViewButton(card: Locator): Locator {
        return card.getByRole('button', { name: 'View' });
    }

    cardAddToCartButton(card: Locator): Locator {
        return card.getByRole('button', { name: 'Add To Cart' });
    }

    filterCheckbox(label: string): Locator {
        return this.filterPanel
            .locator('.form-group')
            .filter({ hasText: new RegExp(`^\\s*${label}\\s*$`, 'i') })
            .getByRole('checkbox');
    }

    async firstProductName(): Promise<string> {
        const name = await this.cardName(this.card(0)).textContent();
        if (!name) {
            throw new Error('The first product card has no name.');
        }
        return name.trim();
    }

    async firstProductPrice(): Promise<number> {
        return TextParser.price(await this.cardPrice(this.card(0)).textContent());
    }

    async resultCount(): Promise<number> {
        return TextParser.resultCount(await this.resultsText.textContent());
    }

    async addFirstProductToCart(): Promise<string> {
        const name = await this.firstProductName();
        await this.cardAddToCartButton(this.card(0)).click();
        await this.expectToast(testData.messages.addToCart);
        return name;
    }

    private async applyFilter(action: () => Promise<void>) {
        const response = this.page.waitForResponse((res) => res.url().includes(testData.api.products));
        await action();
        await response;
    }

    async search(term: string) {
        await this.applyFilter(async () => {
            await this.searchBox.fill(term);
            await this.searchBox.blur();
        });
    }

    async setMinPrice(value: string) {
        await this.applyFilter(async () => {
            await this.minPrice.fill(value);
            await this.minPrice.blur();
        });
    }

    async setMaxPrice(value: string) {
        await this.applyFilter(async () => {
            await this.maxPrice.fill(value);
            await this.maxPrice.blur();
        });
    }

    async toggleFilter(label: string) {
        await this.applyFilter(async () => {
            await this.filterCheckbox(label).click();
        });
    }

    async expectResultCountMatchesCards() {
        await expect(async () => {
            const total = await this.resultCount();
            const expectedCards = Math.min(total, testData.maxProductsPerPage);
            expect(await this.productCards.count()).toBe(expectedCards);
        }).toPass();
    }
}
