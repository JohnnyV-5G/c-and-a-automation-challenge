import { Countries } from '../utils/countries';
import { test, expect } from '../fixtures/homePage.fixture';

test.describe("Test Suite: Home page",() => {
    test('Test Case: C&A Home page loads successfully', {
        tag: '@happy-path', }, async  ({ page, handleCountryPopup, handleCookieBanner }) => {
            await test.step("User browses to the home url", async () => {
                await page.goto('https://www.c-and-a.com/');
                await handleCookieBanner(page);
                await handleCountryPopup(page, Countries.list.spain);
            });
            await test.step("Home page is displayed", async () => {
                // Assert home page main element is visible
                const mainContent = page.locator('main#main');
                await expect(mainContent).toBeVisible();
            });
    });
});
