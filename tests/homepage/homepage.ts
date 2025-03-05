import { expect, Locator, Page } from "@playwright/test";

export default class HomePage {
    private page: Page;
    shoppingCartIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.shoppingCartIcon = page.locator('[data-test="shopping-cart-link"]');
    }

    // Pridanie produktu podľa názvu (dynamic selector)
    async addProduct(productName: string) {
        await this.page.locator(`[data-test="add-to-cart-${productName}"]`).click();
    }

    // Pridanie všetkých produktov do košíka (postupne)
    async addAllProducts() {
        const productIds = [
            "sauce-labs-backpack",
            "sauce-labs-bike-light",
            "sauce-labs-bolt-t-shirt",
            "sauce-labs-fleece-jacket",
            "sauce-labs-onesie",
            "test\\.allthethings\\(\\)-t-shirt-\\(red\\)"
        ];

        for (const id of productIds) {
            await this.addProduct(id);
        }
    }

    // Kliknutie na košík
    async clickOnShoppingCart() {
        await this.shoppingCartIcon.click();
    }

    // Odstránenie produktu podľa názvu
    async removeProduct(productName: string) {
        await this.page.locator(`[data-test="remove-${productName}"]`).click();
    }

    // Odstránenie všetkých produktov (postupne)
    async removeAllProducts() {
        const removeButtons = await this.page.locator('[data-test^="remove-"]').all();
        for (const button of removeButtons) {
            await button.click();
        }
    }
}
