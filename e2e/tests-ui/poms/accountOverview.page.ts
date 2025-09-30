// tabNavigation.po.ts
import { Page, Locator } from '@playwright/test';

export class AccountOverview {
  readonly page: Page;
  readonly container: Locator;

  readonly tabs: Locator;
  readonly logoutButton: Locator;
  readonly welcomeTab: Locator;
  readonly ordersTab: Locator;
  readonly couponsTab: Locator;
  readonly settingsTab: Locator;
  readonly helpTab: Locator;
  readonly contactTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-testid="tab-navigation"]');
    // All tabs under the carousel
    this.tabs = this.container.locator('[data-qa="Tab"]');

    this.welcomeTab = this.container.locator('#navigation_account_overview');
    this.ordersTab = this.container.locator('#navigation_account_orders');
    this.couponsTab = this.container.locator('#navigation_account_coupons');
    this.settingsTab = this.container.locator('#navigation_account_settings');
    this.helpTab = this.container.locator('#navigation_account_help');
    this.contactTab = this.container.locator('#navigation_account_contact');
    this.logoutButton = this.container.locator('#navigation_account_logout');
  }

  // Optional helper to click a tab by text
  async clickTab(tabText: string) {
    await this.tabs.filter({ hasText: tabText }).first().click();
  }
  async clickLogout() {
    await this.logoutButton.scrollIntoViewIfNeeded();
    await this.logoutButton.click();
  }
}
