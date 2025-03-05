import { test, expect } from '@playwright/test';
import { LoginPage } from './loginpage'; 



test.describe('Login Tests standard', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.gotoLoginPage();
    });

    test('Login test good credentials', async ({ page }) => {
        await loginPage.loginWithGoodCredentials();
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    test('Login test bad credentials', async ({ page }) => {
        await loginPage.loginWithBadCredentials();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Login test case sensitive', async ({ page }) => {
        await loginPage.loginWithUpperCase();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });
});

test.describe('Login Tests users', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.gotoLoginPage();
    });

    test('Login test lockedOut user', async ({ page }) => {
        await loginPage.loginWithLockedOutUser();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Login test problem user', async ({ page }) => {
        await loginPage.loginWithProblemUser();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();//product
        await page.locator('[data-test="shopping-cart-link"]').click();//cart
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="lastName"]').fill("lastname")
        await expect(page.locator('[data-test="firstName"]')).toHaveValue("lastname");//asercia nefunguje pole v checkoute
    });
    
    test('Login test performance glitch user', async ({ page }) => {
        const startTime = Date.now(); // Začiatok merania času pred loginom
        await loginPage.loginWithPerformanceGlitchUser(); // Prihlásenie
        await page.waitForLoadState('load'); // Počkám na načítanie stránky
        const endTime = Date.now(); // Koniec merania času
        const loadTime = endTime - startTime; // Výpočet času načítania
        console.log(`Page load time after login: ${loadTime} ms`);
        expect(loadTime).toBeLessThanOrEqual(6000); // Očakávam max. 6 sekund
    });
    

});

