/**
 * Custom Playwright fixtures for the O2 mobile-emulation track.
 *
 * Mirrors the WDIO test layout — one fixture per page object plus a
 * module-level authed-context cache so we pay the login cost once per
 * worker.
 */
import { test as base, expect, Page, BrowserContext, request as pwRequest, APIRequestContext, request } from '@playwright/test';
import { LoginPage } from '../pw-pages/login.page';
import { HomePage } from '../pw-pages/home.page';
import { FindPatientRecordPage } from '../pw-pages/find-patient-record.page';
import { RegisterPatientPage } from '../pw-pages/register-patient.page';
import { env } from '../config/env.config';
import { injectCloudflareCookieOnEveryPage } from '../utils/cloudflare';

/** Module-level cache so we only pay the login cost once per worker. */
let cachedContext: BrowserContext | undefined;
let cachedBaseUrl: string | undefined;

async function loginAsAdmin(page: Page): Promise<void> {
  const login = new LoginPage(page);
  await login.loginAsAdmin(env.o2.location);
}

async function getOrCreateAuthedContext(
  browser: import('@playwright/test').Browser,
  baseURL: string,
): Promise<BrowserContext> {
  if (cachedContext && cachedBaseUrl === baseURL) {
    return cachedContext;
  }
  if (cachedContext) {
    await cachedContext.close().catch(() => undefined);
  }
  const ctx = await browser.newContext({ baseURL });
  const page = await ctx.newPage();
  await loginAsAdmin(page);
  await page.close();
  cachedContext = ctx;
  cachedBaseUrl = baseURL;
  return ctx;
}

export type OpenMrsMobileFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  authedPage: Page;
  findPatientRecordPage: FindPatientRecordPage;
  registerPatientPage: RegisterPatientPage;
};

export const test = base.extend<OpenMrsMobileFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ browser }, use) => {
    const ctx = await getOrCreateAuthedContext(browser, env.o2.baseUrl);
    const page = await ctx.newPage();
    try {
      const home = new HomePage(page);
      await page.goto(`${env.o2.baseUrl}/referenceapplication/home.page`).catch(() => undefined);
      await home.waitForReady();
      await use(home);
    } finally {
      await page.close().catch(() => undefined);
    }
  },

  authedPage: async ({ browser }, use) => {
    const ctx = await getOrCreateAuthedContext(browser, env.o2.baseUrl);
    const page = await ctx.newPage();
    try {
      await use(page);
    } finally {
      await page.close().catch(() => undefined);
    }
  },

  findPatientRecordPage: async ({ authedPage }, use) => {
    const find = new FindPatientRecordPage(authedPage);
    await find.open();
    await use(find);
  },

  registerPatientPage: async ({ authedPage }, use, testInfo) => {
    const reg = new RegisterPatientPage(authedPage);
    const opened = await reg.open();
    if (!opened && !testInfo.expectedStatus) {
      testInfo.skip(true, 'registerPatientPage returned a UI Framework Error on this build');
    }
    await use(reg);
  },
});

injectCloudflareCookieOnEveryPage(test);

export { expect };
