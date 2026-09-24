/**
 * BaseScreen — every Screen Object in this project shares these helpers.
 *
 * The O2 mobile web renders the same HTML as the desktop site, just
 * viewport-scaled. Selectors are CSS / XPath / link text, mirrored from
 * the desktop site's static IDs and form names.
 */
import { browser, $ } from '@wdio/globals';
import { env } from '../config/env.config';

export abstract class BaseScreen {
  /** Canonical O2 URL. */
  static readonly BASE_URL = env.o2.baseUrl;

  /** Maximum retries for transient Cloudflare rate-limit responses. */
  static readonly MAX_NAV_RETRIES = 4;
  /** Initial wait between nav retries; doubled each attempt (10s, 20s, 40s, 80s). */
  static readonly NAV_RETRY_DELAY_MS = 10_000;

  constructor() {
    // No-op: subclasses may override open() / goto().
  }

  /** Open a relative path against the O2 base URL. */
  async open(path?: string): Promise<void> {
    await this.goto(path ?? 'login.htm');
  }

  /**
   * Navigate to the supplied path, retrying on Cloudflare rate-limit
   * responses with exponential back-off.
   */
  async goto(path = 'login.htm'): Promise<void> {
    const cleaned = path.startsWith('/') ? path.slice(1) : path;
    const absolute = new URL(
      cleaned,
      BaseScreen.BASE_URL.endsWith('/') ? BaseScreen.BASE_URL : BaseScreen.BASE_URL + '/',
    ).toString();

    for (let attempt = 0; attempt < BaseScreen.MAX_NAV_RETRIES; attempt++) {
      try {
        await browser.url(absolute);
      } catch {
        // fall through to the rate-limit / retry check below
      }
      if (!(await BaseScreen.isRateLimited())) return;
      const backoff = BaseScreen.NAV_RETRY_DELAY_MS * Math.pow(2, attempt);
      // eslint-disable-next-line no-console
      console.warn(
        `[BaseScreen] Rate-limited on attempt ${attempt + 1}/${BaseScreen.MAX_NAV_RETRIES}; backing off ${backoff / 1000}s`,
      );
      await browser.pause(backoff);
    }
  }

  /** True when the Cloudflare 1015 rate-limit page is visible. */
  static async isRateLimited(): Promise<boolean> {
    const blocked = await $('text=/Error 1015|being rate limited|attention required/i');
    try {
      return await blocked.isDisplayed();
    } catch {
      return false;
    }
  }

  /** Wait until the page title contains the given fragment. */
  async waitForTitleContains(fragment: string): Promise<void> {
    await browser.waitUntil(
      async () => (await browser.getTitle()).toLowerCase().includes(fragment.toLowerCase()),
      { timeout: 10_000, interval: 200 },
    );
  }

  /**
   * Wait until the current browser URL matches a regular expression.
   * WDIO v9 removed the `browser.waitForUrl` helper, so we poll via
   * `waitUntil` instead.
   */
  async waitForUrlMatches(regex: RegExp, timeoutMs = 15_000): Promise<void> {
    await browser.waitUntil(
      async () => regex.test(await browser.getUrl()),
      { timeout: timeoutMs, interval: 200 },
    );
  }

  /** Click the global OpenMRS logo to return to the home page. */
  async clickLogo(): Promise<void> {
    await $('a.navbar-brand').click();
  }

  /** Open the apps dropdown if present. */
  async openAppsMenu(): Promise<void> {
    const apps = await $('a[id="apps-menu"]');
    if (await apps.isDisplayed().catch(() => false)) {
      await apps.click();
    }
  }

  /** True when the header shows a user menu (i.e. we are authenticated). */
  async isAuthenticated(): Promise<boolean> {
    const userMenu = await $('a#user-menu');
    return await userMenu.isDisplayed().catch(() => false);
  }

  /** True when the current page is the O2 login page. */
  async isOnLoginPage(): Promise<boolean> {
    return (await browser.getUrl()).includes('login.htm');
  }

  /**
   * Returns true when the page rendered the OpenMRS "UI Framework Error"
   * placeholder (Docker image missing view mappings) or a raw 404/500
   * page. Use to self-skip tests gracefully.
   */
  async isBrokenPage(): Promise<boolean> {
    const errorEl = await $('h1');
    try {
      const text = (await errorEl.getText()) ?? '';
      return /UI Framework Error|Error 404|Error 500/.test(text);
    } catch {
      return false;
    }
  }

  /** Read the page <title>. */
  async getPageTitle(): Promise<string> {
    return browser.getTitle();
  }
}
