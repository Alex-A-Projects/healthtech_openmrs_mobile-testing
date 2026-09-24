/**
 * BasePage — shared behaviour for every OpenMRS Page Object on the
 * Playwright mobile-emulation track.
 *
 * Selectors mirror the O2 desktop site, just viewport-scaled.
 */
import { Page, Locator } from '@playwright/test';
import { env } from '../config/env.config';

export class BasePage {
  static readonly BASE_URL = env.o2.baseUrl;
  readonly page: Page;

  readonly openmrsLogo: Locator;
  readonly appsMenuButton: Locator;
  readonly userMenuButton: Locator;
  readonly locationBanner: Locator;
  readonly breadcrumb: Locator;

  loginButton: Locator;
  usernameInput: Locator;
  passwordInput: Locator;
  locationSelect: Locator;

  constructor(page: Page) {
    this.page = page;

    this.openmrsLogo = page.locator('a.navbar-brand, .logo a, .brand').first();
    this.appsMenuButton = page.locator('a[id="apps-menu"], #apps-menu, .apps').first();
    this.userMenuButton = page.locator('a#user-menu, #user-menu, li:has-text("admin"), a:has-text("admin")').first();
    this.locationBanner = page.locator('.location-banner, .current-location, #session-location').first();
    this.breadcrumb = page.locator('.breadcrumb, nav.breadcrumb').first();

    this.usernameInput = page.locator('input#username, input[name="username"]');
    this.passwordInput = page.locator('input#password, input[name="password"]');
    this.locationSelect = page.locator('#sessionLocation li, ul#sessionLocation li, ul.locations li, select#sessionLocation');
    this.loginButton = page.locator('input#loginButton, input[value="Log In"]');
  }

  async goto(path = ''): Promise<void> {
    const cleaned = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(`${BasePage.BASE_URL}${cleaned}`);
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('login.htm');
  }

  async isAuthenticated(): Promise<boolean> {
    return this.userMenuButton.isVisible().catch(() => false);
  }

  /** True when the page rendered the OpenMRS "UI Framework Error" placeholder. */
  async isBrokenPage(): Promise<boolean> {
    return this.page.locator('h1:has-text("UI Framework Error"), h1:has-text("Error 404"), h1:has-text("Error 500")').first().isVisible().catch(() => false);
  }
}
