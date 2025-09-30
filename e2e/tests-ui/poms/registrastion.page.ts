// e2e/tests-ui/pom/myAccountPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
    readonly page: Page;
    //readonly dialog: Locator;

    //pre regiustration elements
    readonly emailInput: Locator;
    readonly emailError: Locator;
    readonly nextButton: Locator;

    //registration elements
    readonly emailField: Locator;
    readonly firstNameInput: Locator;
    readonly firstNameError: Locator;
    readonly lastNameInput: Locator;
    readonly lastNameError: Locator;
    readonly passwordInput: Locator;
    readonly passwordError: Locator;

    readonly consentCheckbox: Locator;

    readonly becomeMemberButton: Locator;

  constructor(page: Page) {
    this.page = page;
    //this.dialog = page.locator('dialog[data-qa="OffCanvas"]');
    //pre registration elements
    this.emailInput = page.getByTestId('emailAddress');
    this.emailError = page.locator('p[data-qa="TextFieldError"] span[data-qa="Copy"]');
    this.nextButton = page.locator('button[data-qa="LoadingButton"]'); 
    //registration elements
    this.emailField = page.locator('input[data-qa="ReadOnlyEmailFieldInput"]');
    this.firstNameInput = page.getByTestId('firstName');
    this.firstNameError = page.locator('p[data-qa="TextFieldError"] span[data-qa="Copy"]').first();
    this.lastNameInput = page.getByTestId('lastName'); 
    this.lastNameError = page.locator('p[data-qa="TextFieldError"] span[data-qa="Copy"]').nth(1);
    this.passwordInput = page.getByTestId('password');
    this.passwordError = page.locator('p[data-qa="TextFieldError"] span[data-qa="Copy"]').nth(2);

    this.consentCheckbox = page.locator('label[data-qa="Checkbox"]');

    this.becomeMemberButton = page.locator('button[data-qa="LoadingButton"]');

  }

  // Pre-registration methods
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickNext() {
    await this.nextButton.click();
  }
  
  // Registration methods
  async selectSalutation(salutation: 'MR' | 'MRS' | 'OTHER') {
    const locatorMap: Record<string, string> = {
        MR: '[data-qa="RadioButtonMR"] label',
        MRS: '[data-qa="RadioButtonMRS"] label',
        OTHER: '[data-qa="RadioButtonOTHER"] label',
    };

  const labelLocator = this.page.locator(locatorMap[salutation]);
  await labelLocator.click();
}

  async fillFirstName(name: string) {
    await this.firstNameInput.fill(name);
  }

  async fillLastName(name: string) {
    await this.lastNameInput.fill(name);  
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillPersonalInfo(firstName: string, lastName: string, password: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.passwordInput.fill(password);
    }

    async checkConsent() {
        await this.consentCheckbox.check();
    }

    async clickBecomeMember() {
        await this.becomeMemberButton.click();
    }




// Method to bypass Cloudflare (for testing purposes only)
    async bypassCloudflare() {
        await this.page.evaluate(() => {
            const input = document.querySelector<HTMLInputElement>('#cf-chl-widget-0jd0i_response');
            if (input) input.value = 'mock-valid-response';
        });
    }

}
