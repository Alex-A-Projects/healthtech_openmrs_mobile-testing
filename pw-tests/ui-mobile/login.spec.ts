import { test, expect } from '../../pw-fixtures/testFixtures';
import { LoginPage } from '../../pw-pages/login.page';

/**
 * Mobile login tests via Playwright mobile-emulation (CI-friendly).
 *
 * This is the same DOM the WDIO tests drive through Appium, but rendered
 * via Playwright's built-in `devices['iPhone 17']` / `devices['Pixel 9']`
 * emulation in headless Chromium. No Xcode / Android Studio needed.
 */
test.describe('Mobile login (Playwright emulation)', () => {
  test('the login page loads at /login.htm', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('the username input is rendered', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('the password input is rendered and type=password', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('the login submit button is rendered', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('the location dropdown lists at least one location', async ({ loginPage }) => {
    await loginPage.open();
    const opts = await loginPage.listAvailableLocations();
    expect(opts.length).toBeGreaterThan(0);
  });

  test('the location dropdown includes common O2 locations', async ({ loginPage }) => {
    await loginPage.open();
    const opts = (await loginPage.listAvailableLocations()).join(' | ');
    expect(opts).toMatch(/Inpatient Ward/i);
    expect(opts).toMatch(/Outpatient Clinic/i);
  });

  test('submitting empty form keeps us on login', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('wrong password keeps us on login', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('admin', 'wrong-password');
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('a valid admin login leaves the login page', async ({ loginPage }) => {
    await loginPage.loginAsAdmin();
    expect(loginPage.page.url()).not.toMatch(/login\.htm$/);
  });

  test('a valid admin login lands on a non-login page', async ({ loginPage }) => {
    await loginPage.loginAsAdmin();
    expect(loginPage.page.url()).toMatch(/home|index|dashboard/i);
  });
});
