import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  //declare fields
  readonly page: Page
  readonly headerAccountButton: Locator
  readonly headerWishlistButton: Locator
  readonly headerBasketButton: Locator
  readonly search: Locator


  // Here we define locators
  constructor(page: Page) {
    this.page = page;
    this.search = page.locator('#search');
    this.headerAccountButton = page.locator('[data-qa="HeaderAccountButton"]');
    this.headerWishlistButton = page.locator('[data-qa="HeaderWishlistButton"]');
    this.headerBasketButton = page.locator('[data-qa="HeaderBasketButton"]');

  };

  async clickAccountButton() {
    return await this.headerAccountButton.click(); 
  };


  async clickWishListButton() {
    return await this.headerAccountButton.click(); 
  };

  async clickShoppingBasket() {
    return await this.headerBasketButton.click(); 
  };  
};