import { test, expect } from '../fixtures/homePage.fixture';
import { CnA_URLS } from '../utils/constants';
import { Countries } from '../utils/countries';
import { faker } from '@faker-js/faker';
import { HomePage } from '../poms/homePage.page';
import { MyAccountPage } from '../poms/myAccount.page';
import { RegistrationPage } from '../poms/registrastion.page';
import { Messages } from '../utils/languageManager/messages';

const MEMBER_EMAIL = faker.internet.exampleEmail();
const FIRST_NAME = faker.person.firstName();
const LAST_NAME = faker.person.lastName();
const PASSWORD = faker.internet.password({ length: 10, pattern: /[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/ });
const salutations: ('MR' | 'MRS' | 'OTHER')[] = ['MR', 'MRS', 'OTHER'];

test.describe("Test Suite: Spanish Client Registration - C&A Web", () => {
  test.beforeEach(async ({ page, handleCountryPopup, handleCookieBanner, setCookieConsent, context }) => {
    await page.goto(CnA_URLS.HOME);

    // Setup the handler to dismiss the cookie banner automatically
    await page.addLocatorHandler(page.locator('#onetrust-banner-sdk'), async (locator) => {
      const acceptBtn = page.locator('#onetrust-accept-btn-handler');
      if (await acceptBtn.isVisible()) {
        await acceptBtn.click();
      }
    });
    //await handleCookieBanner(page);
    await handleCountryPopup(page, Countries.list.spain);
  });


  test("Test Case: registration step - invalid email", {
    tag: '@unhappy-path', }, async ({ page }) => {
      const homePage = new HomePage(page);
      const myAccount = new MyAccountPage(page);
      const preRegistration = new RegistrationPage(page);

      await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
      });

      await test.step('Client clicks to create and account and proceeds to write an invalid email address', async() => {
        await myAccount.joinMembership();
        await preRegistration.fillEmail(MEMBER_EMAIL + MEMBER_EMAIL);
        await preRegistration.clickNext();
      });

      await test.step('Verifies that the email error message is displayed', async() => {
        await expect(preRegistration.emailError).toBeVisible();
        await expect(preRegistration.emailError).toHaveText(Messages.list.spain.invalidEmail);
      });
  });

  test("Test Case: registration step - invalid personal information, password and email", {
    tag: '@unhappy-path', }, async ({ page }) => {
      const homePage = new HomePage(page);
      const myAccount = new MyAccountPage(page);
      const registration = new RegistrationPage(page);

      await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
      });

      await test.step('Client clicks to create and account and proceeds with valid email address', async() => {
        await myAccount.joinMembership();
        await registration.fillEmail(MEMBER_EMAIL);
        console.log("email" + MEMBER_EMAIL);
        await registration.clickNext();
      });

      await test.step('Missing First Name', async() => {
        await registration.fillFirstName("");
        await registration.clickNext();
        await expect(registration.firstNameError).toBeVisible();
        await expect(registration.firstNameError).toHaveText(Messages.list.spain.emptyFieldWarning);        
      });

      await test.step('Missing Last Name', async() => {
        await registration.fillFirstName(FIRST_NAME);
        await registration.fillLastName("");
        await registration.clickNext();
        await expect(registration.lastNameError).toBeVisible();
        await expect(registration.lastNameError).toHaveText(Messages.list.spain.emptyFieldWarning);        
      });

      await test.step('Missing Password', async() => {
        await registration.fillFirstName(FIRST_NAME);
        await registration.fillLastName(LAST_NAME);
        await registration.fillPassword("");
        await registration.clickBecomeMember();
        await expect(registration.passwordError).toBeVisible();
        await expect(registration.passwordError).toHaveText(Messages.list.spain.invalidPassword);        
      });
  });

  test("Test Case: Validate Registration functionality", {
    tag: '@happy-path', }, async ({ page }) => {
      const homePage = new HomePage(page);
      const myAccount = new MyAccountPage(page);
      const registration = new RegistrationPage(page);
      const randomSalutation = salutations[Math.floor(Math.random() * salutations.length)];
      
      await test.step('Client clicks on the "my account" button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
      });

      await test.step('Client proceeds with valid email address', async() => {
        await myAccount.joinMembership();
        await registration.fillEmail(MEMBER_EMAIL);
        await registration.clickNext();
      });

      await test.step('Client fills in the personal information form and submits it', async() => {
        await expect(registration.emailField).toBeVisible();
        await expect(registration.emailField).toHaveValue(MEMBER_EMAIL);
        await registration.selectSalutation(randomSalutation);

        await registration.fillPersonalInfo(FIRST_NAME, LAST_NAME, PASSWORD);
        await registration.checkConsent();
        //await registration.bypassTurnstile();
        await registration.clickBecomeMember();
      });
  });

  test.fixme("Test Case: Validate Login functionality with newly created client user", async ({ page }) => {
  });

  test.fixme("Test Case: Client deletes data", async ({ page }) => {
  });

});
