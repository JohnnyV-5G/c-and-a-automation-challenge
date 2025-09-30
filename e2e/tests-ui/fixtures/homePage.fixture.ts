// fixtures/homePage.fixture.ts
import { test as base, Page, BrowserContext } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

type HomePageFixtures = {
  handleCountryPopup: (page: Page, country: string) => Promise<void>;
  handleCookieBanner: (page: Page) => Promise<void>;
  setCookieConsent: (context: BrowserContext) => Promise<void>;
  user: {
    email: string;
    password: string;
  };
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

      if (await cookieBanner.isVisible({ timeout: 5000 }).catch(() => false)) {
        await acceptBtn.click();
        await Promise.all([
          cookieBanner.waitFor({ state: 'hidden', timeout: 5000 }),
          overlay.waitFor({ state: 'hidden', timeout: 5000 }),
        ]);
      }
    });
  },

  setCookieConsent: async ({}, use) => {
    await use(async (context: BrowserContext) => {
      await context.addCookies([{
        name: 'OptanonConsent',
        value: 'true',
        domain: '.c-and-a.com',
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'Lax',
      }]);
    });
  },

  user: async ({ browserName }, use) => {
    let email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;

    if (browserName === 'firefox' && process.env.USER_FIREFOX) {
      email = process.env.USER_FIREFOX;
    } else if (browserName === 'webkit' && process.env.USER_WEBKIT) {
      email = process.env.USER_WEBKIT;
    }

    await use({ email, password });
  },
});

export { expect } from '@playwright/test';