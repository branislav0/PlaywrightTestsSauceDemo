import { test, expect } from '@playwright/test';
import { LoginPage } from '../login/loginpage';
import HomePage from './homepage';

test.describe('Homepage test as standard user', () => {
    let homepage: HomePage;
    let loginpage: LoginPage;

    test.beforeEach(async ({ page }) => {
        homepage = new HomePage(page);
        loginpage = new LoginPage(page);

        await test.step('Navigate to login page and log in', async () => {
            await loginpage.gotoLoginPage();
            await loginpage.loginWithGoodCredentials();
            await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        });
    });

    test('Add product to cart', async ({ page }) => {
        await test.step('Add a product to the cart', async () => {
            await homepage.addProduct('sauce-labs-backpack'); // Oprava
            await homepage.clickOnShoppingCart();
        });

        await test.step('Verify product is in the cart', async () => {
            await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
        });
    });

    test('Remove product from cart', async ({ page }) => {
        await test.step('Add a product to the cart', async () => {
            await homepage.addProduct('sauce-labs-backpack'); // Oprava
            await homepage.clickOnShoppingCart();
        });

        await test.step('Verify product is in the cart', async () => {
            await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
        });

        await test.step('Remove product and verify it is no longer visible', async () => {
            await homepage.removeProduct('sauce-labs-backpack'); // Oprava
            await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();
        });
    });

    test('Counting products in shopping cart', async ({ page }) => {
        let productCountBefore: number;

        await test.step('Add all products to cart', async () => {
            await homepage.addAllProducts();
            await homepage.clickOnShoppingCart();
        });

        await test.step('Check number of products before removal', async () => {
            productCountBefore = await page.locator(".cart_item").count();
            expect(productCountBefore).toBeGreaterThan(0); // Oprava
        });

        await test.step('Remove one product and verify count decreases', async () => {
            await homepage.removeProduct('sauce-labs-backpack'); // Oprava
            const productCountAfter = await page.locator(".cart_item").count();
            expect(productCountAfter).toBe(productCountBefore - 1);
        });
    });

    test('Sorting products by price (low to high)', async ({ page }) => {
        await test.step('Select sorting option: Price (low to high)', async () => {
            await page.locator('.product_sort_container').selectOption('lohi');
        });

        await test.step('Verify sorting option is correctly applied', async () => {
            await expect(page.locator('.product_sort_container')).toHaveValue('lohi');
        });

        await test.step('Check if products are sorted correctly', async () => {
            const prices = await page.locator('.inventory_item_price').allInnerTexts();
            const priceValues = prices.map(price => parseFloat(price.replace('$', '')));
            const sortedPrices = [...priceValues].sort((a, b) => a - b);
            expect(priceValues).toEqual(sortedPrices);
        });
    });
});
