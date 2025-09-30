import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly closeButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly joinMembershipButton: Locator;
  readonly errorNotification: Locator;
  readonly invalidAuthMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('dialog[data-qa="OffCanvas"]');
    this.emailInput = this.dialog.getByTestId('myaccount_login_email');
    this.passwordInput = this.dialog.getByTestId('myaccount_login_password');
    this.loginButton = this.dialog.locator('button[data-qa="LoadingButton"]');
    this.closeButton = this.dialog.locator('button#close_off_canvas');
    this.forgotPasswordButton = this.dialog.locator('button[data-qa="TextLink"]');
    this.joinMembershipButton = this.dialog.locator('button[aria-label="account.login_membership_button_aria_label"]');
    this.errorNotification = this. page.locator('[data-qa="TextFieldError"] [data-qa="Copy"]:not(:empty)');
    this.invalidAuthMessage = this.page.locator('div[data-qa="InlineNotification"] div[data-qa="Copy"]');
  }

  async isVisible() {
    return await this.dialog.isVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async close() {
    if (await this.dialog.isVisible()) {
      await this.closeButton.click();
      await this.dialog.waitFor({ state: 'hidden' });
    }
  }

  async openForgotPassword() {
    await this.forgotPasswordButton.click();
  }

  async joinMembership() {
    await this.joinMembershipButton.click();
  }
}
