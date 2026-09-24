/**
 * LoginPage - mirrors the WDIO LoginScreen using Playwright Locators.
 *
 * Same DOM, same selectors — only the runner differs.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../config/env.config';

export class LoginPage extends BasePage {
  readonly locationListItems: Locator;
  readonly sessionLocationInput: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"], input#username, input[placeholder="Enter your username"]').first();
    this.passwordInput = page.locator('input[name="password"], input#password, input[placeholder="Enter your password"]').first();
    this.locationSelect = page.locator('#sessionLocation li, ul#sessionLocation li').first();
    this.loginButton = page.locator('input#loginButton, input[value="Log In"], button:has-text("Log In")').first();

    this.locationListItems = page.locator('#sessionLocation li, ul#sessionLocation li, ul.locations li');
    this.sessionLocationInput = page.locator('#sessionLocationInput').first();
    this.loginError = page.locator('#error-message, .field-error, .login-error, .error, [role="alert"]').first();
  }

  async open(): Promise<void> {
    await this.goto('login.htm');
    await expect(this.usernameInput).toBeVisible();
  }

  async selectLocation(location: string): Promise<void> {
    const item = this.locationListItems.filter({ hasText: location }).first();
    if (await item.count() > 0) {
      await item.click();
    } else {
      await this.locationSelect.selectOption({ label: location });
    }
  }

  async loginAsAdmin(location: string = env.o2.location): Promise<void> {
    await this.open();
    await this.selectLocation(location);
    await this.usernameInput.fill(env.o2.username);
    await this.passwordInput.fill(env.o2.password);
    await this.loginButton.click();
  }

  async login(username: string, password: string, location: string = env.o2.location): Promise<void> {
    await this.open();
    await this.selectLocation(location);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async listAvailableLocations(): Promise<string[]> {
    const count = await this.locationListItems.count();
    if (count > 0) {
      return (await this.locationListItems.allTextContents()).map((s) => s.trim()).filter(Boolean);
    }
    return await this.locationSelect.locator('option').allTextContents();
  }
}
