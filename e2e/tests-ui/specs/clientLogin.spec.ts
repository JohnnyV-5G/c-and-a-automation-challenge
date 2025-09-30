import { test, expect } from '../fixtures/homePage.fixture';
import { CnA_URLS } from '../utils/constants';
import { Countries } from '../utils/countries';
import { HomePage } from '../poms/homePage.page';
import { MyAccountPage } from '../poms/myAccount.page';
import { AccountOverview } from '../poms/accountOverview.page';
import { Messages } from '../utils/languageManager/messages';
import { AccountOverviewMessages } from '../utils/languageManager/accountOverviewMessages';
import * as dotenv from 'dotenv';

dotenv.config();
const CLIENT_EMAIL = process.env.USER_EMAIL!;
const CLIENT_PASSWORD = process.env.USER_PASSWORD!;
const MISSING_EMAIL = "";

test.describe("Test Suite: Spanish Client LogIn - C&A Web", () => {
  test.beforeEach(async ({ page, handleCountryPopup, handleCookieBanner, setCookieConsent, context }) => {
    await page.goto(CnA_URLS.HOME);
    await handleCountryPopup(page, Countries.list.spain);

    // // Setup the handler to dismiss the cookie banner automatically
    // await page.addLocatorHandler(page.locator('#onetrust-banner-sdk'), async (locator) => {
    //   const acceptBtn = page.locator('#onetrust-accept-btn-handler');
    //   if (await acceptBtn.isVisible()) {
    //     await acceptBtn.click();
    //   }
    // });

    //await handleCookieBanner(page);
  });

  test("Test Case: Login step - missing email", {
    tag: '@unhappy-path', }, async ({ page }) => {
      const homePage = new HomePage(page);
      const myAccount = new MyAccountPage(page);

      await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
      });

      await test.step('Client attept log in with missing email', async() => {
        await myAccount.login(MISSING_EMAIL, CLIENT_PASSWORD); 
      });

      await test.step('Verifies that the email error message is displayed', async() => {
        await expect(myAccount.errorNotification).toBeVisible();
        await expect(myAccount.errorNotification).toHaveText(Messages.list.spain.invalidEmailFormat);
      });
  });

  test("Test Case: Login step - invalid email format", {tag: '@unhappy-path', }, async ({ page }) => {
    const homePage = new HomePage(page);
    const myAccount = new MyAccountPage(page);

    await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
    });

    await test.step('Client attept log in with wrong email', async() => {
        await myAccount.login(CLIENT_EMAIL + "@@@", CLIENT_PASSWORD); 
    });

    await test.step('Verifies that the email error message is displayed', async() => {
        await expect(myAccount.errorNotification).toBeVisible();
        await expect(myAccount.errorNotification).toHaveText(Messages.list.spain.invalidEmailFormat);
    });
  });

  test("Test Case: Login step - non Exsistent client", {tag: '@unhappy-path', }, async ({ page }) => {
      const homePage = new HomePage(page);
      const myAccount = new MyAccountPage(page);

      await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
      });

      await test.step('Client attepts log in with non exsistent email', async() => {
        await myAccount.login("idontexsist@idontexsist.com", CLIENT_PASSWORD); 
      });

      await test.step('Verifies that the email error message is displayed', async() => {
        await expect(myAccount.invalidAuthMessage).toBeVisible();
        await expect(myAccount.invalidAuthMessage).toHaveText(Messages.list.spain.invalidAuthentication);
      });
  });

  test("Test Case: Login step - invalid password", {tag: '@unhappy-path', }, async ({ page }) => {
      const homePage = new HomePage(page);
      const myAccount = new MyAccountPage(page);

      await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
      });

      await test.step('Client attepts log in with non exsistent email', async() => {
        await myAccount.login(CLIENT_EMAIL, CLIENT_PASSWORD + CLIENT_PASSWORD); 
      });

      await test.step('Verifies that the email error message is displayed', async() => {
        await expect(myAccount.invalidAuthMessage).toBeVisible();
        await expect(myAccount.invalidAuthMessage).toHaveText(Messages.list.spain.invalidAuthentication);
      });
  });
 
  test("Test Case: Spanish client successful Login and log out", {tag: '@happy-path', }, async ({ page }) => {
    const homePage = new HomePage(page);
    const myAccount = new MyAccountPage(page);
    const accountOverview = new AccountOverview(page);
    const lang = 'es';

    await test.step('Client clicks on the my account button', async() => {
        await homePage.clickAccountButton();
        await expect(myAccount.dialog).toBeVisible();
    });

    await test.step('Client logs in with correct exsisting credentials and account page is loaded', async() => {
        await myAccount.login(CLIENT_EMAIL, CLIENT_PASSWORD); 

        // Setup the handler to dismiss the cookie banner automatically
        await page.addLocatorHandler(page.locator('#onetrust-banner-sdk'), async (locator) => {
            const acceptBtn = page.locator('#onetrust-accept-btn-handler');
            if (await acceptBtn.isVisible()) {
                await acceptBtn.click();
            }
        });
        //await expect(page).toHaveURL(/https:\/\/www\.c-and-a\.com\/(es\/)?shop\/account\/overview/);
    });

    await test.step('Ensure we are on Account Overview', async () => {
        const overviewUrl = '/shop/account/overview';

        if (!page.url().includes(overviewUrl)) {
            const accountButton = page.locator('[data-qa="HeaderAccountButton"]');
            await accountButton.waitFor({ state: 'visible', timeout: 5000 });
            await accountButton.click();
            console.log('Navigated to Account Overview by clicking account button');
            } else {
                console.log('Already on Account Overview, no need to click account button');
            }
    });

    await test.step('Assert Account Overview tab selection', async() => {
        await expect(accountOverview.welcomeTab).toBeVisible();
        await expect(accountOverview.ordersTab).toBeVisible();
        await expect(accountOverview.couponsTab).toBeVisible();
        await expect(accountOverview.settingsTab).toBeVisible();
        await expect(accountOverview.helpTab).toBeVisible();
        await expect(accountOverview.contactTab).toBeVisible();
        await expect(accountOverview.logoutButton).toBeVisible();
    });

    await test.step('Assert Spanish tab texts and logout button', async () => {
        await expect(accountOverview.welcomeTab).toHaveText(AccountOverviewMessages.list[lang].welcome);
        await expect(accountOverview.ordersTab).toHaveText(AccountOverviewMessages.list[lang].orders);
        await expect(accountOverview.couponsTab).toHaveText(AccountOverviewMessages.list[lang].coupons);
        await expect(accountOverview.settingsTab).toHaveText(AccountOverviewMessages.list[lang].settings);
        await expect(accountOverview.helpTab).toHaveText(AccountOverviewMessages.list[lang].help);
        await expect(accountOverview.contactTab).toHaveText(AccountOverviewMessages.list[lang].contact);
        await expect(accountOverview.logoutButton).toHaveText(AccountOverviewMessages.list[lang].logout);
    });

    await test.step('Client logs out', async() => {
        await accountOverview.clickLogout();
        await expect(myAccount.dialog).toBeVisible();
        await expect(myAccount.loginButton).toBeVisible();
        await expect(myAccount.joinMembershipButton).toBeVisible();
    });
  });
});
