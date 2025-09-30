import { test as base, Page, BrowserContext } from '@playwright/test';

type HomePageFixtures = {
  handleCountryPopup: (page: Page, country: string) => Promise<void>;
  handleCookieBanner: (page: Page) => Promise<void>;
  setCookieConsent: (context: BrowserContext) => Promise<void>;

};

export const test = base.extend<HomePageFixtures>({
  handleCountryPopup: async ({}, use) => {
    await use(async (page: Page, country: string) => {
      const popup = page.locator('[data-qa="OffCanvas"]');
      if (await popup.isVisible()) {
        const countrySelect = popup.locator('select[aria-label="Shipping to"]');
        await countrySelect.selectOption(country);
        const confirmButton = popup.locator('button[data-qa="LoadingButton"]');
        await confirmButton.click();
        await popup.waitFor({ state: 'hidden' });
      }
    });
  },

handleCookieBanner: async ({}, use) => {
  await use(async (page: Page) => {
    const cookieBanner = page.locator('#onetrust-banner-sdk');
    const acceptBtn = page.locator('#onetrust-accept-btn-handler');
    const overlay = page.locator('.onetrust-pc-dark-filter');

    // Check if banner is visible
    if (await cookieBanner.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptBtn.click();

      // Wait for banner and overlay to disappear
      await Promise.all([
        cookieBanner.waitFor({ state: 'hidden', timeout: 5000 }),
        overlay.waitFor({ state: 'hidden', timeout: 5000 }),
      ]);
    }
  });
},


setCookieConsent: async ({}, use) => {
    await use(async (context: BrowserContext) => {
      // Add the cookie that signals consent
      await context.addCookies([{
        name: 'OptanonConsent',
        value: 'true',                // Adjust this value if needed
        domain: '.c-and-a.com',       // Make sure the domain matches your site
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'Lax',
      }]);
    });
  },
});

export { expect } from '@playwright/test';
