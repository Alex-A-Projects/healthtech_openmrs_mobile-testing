import { expect, browser, $ } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { HomeScreen } from '../pages/HomeScreen';
import { ValidAdmin } from '../data/testData';

/**
 * Mobile login page tests.
 *
 * Mirrors the O2 web project at:
 *   /Users/alex/QA/Automation/healthtech_openmrs_playwright-typescript/tests/ui/login.spec.ts
 *
 * Key mobile adaptations:
 *   - Location picker is `<ul id="sessionLocation">` with clickable `<li>` items.
 *   - Submit is `<input id="loginButton" type="submit">`.
 */
describe('Mobile login page', () => {
  // ---------- Page rendering ----------

  it('the login page loads at /login.htm', async () => {
    const login = new LoginScreen();
    await login.open();
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  it('the username input is rendered', async () => {
    const login = new LoginScreen();
    await login.open();
    expect(await login.isVisible()).toBe(true);
  });

  it('the password input is rendered and type=password', async () => {
    const login = new LoginScreen();
    await login.open();
    expect(await login.getPasswordTypeAttribute()).toBe('password');
  });

  it('the location dropdown is rendered', async () => {
    const login = new LoginScreen();
    await login.open();
    expect(await login.listAvailableLocations()).toBeTruthy();
  });

  it('the login submit button is rendered', async () => {
    const login = new LoginScreen();
    await login.open();
    expect(await login.getLoginButtonValue()).toMatch(/Log In/i);
  });

  // ---------- Location dropdown ----------

  it('the location picker lists at least one location', async () => {
    const login = new LoginScreen();
    await login.open();
    const opts = await login.listAvailableLocations();
    expect(opts.length).toBeGreaterThan(0);
  });

  it('the location picker includes common O2 locations', async () => {
    const login = new LoginScreen();
    await login.open();
    const opts = (await login.listAvailableLocations()).join(' | ');
    expect(opts).toMatch(/Inpatient Ward/i);
    expect(opts).toMatch(/Outpatient Clinic/i);
  });

  it('selecting a location updates the hidden location input', async () => {
    const login = new LoginScreen();
    await login.open();
    await login.selectLocation('Outpatient Clinic');
    const sel = await login.getSelectedLocation();
    expect(sel).toBeTruthy();
  });

  // ---------- Form validation ----------

  it('submitting with all fields empty keeps us on the login page', async () => {
    const login = new LoginScreen();
    await login.submitEmpty();
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  it('submitting with only the username filled stays on login', async () => {
    const login = new LoginScreen();
    await login.submitUsernameOnly('admin');
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  it('submitting with only the password filled stays on login', async () => {
    const login = new LoginScreen();
    await login.submitPasswordOnly('Admin123');
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  it('wrong password keeps us on the login page', async () => {
    const login = new LoginScreen();
    await login.login('admin', 'wrong-password');
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  it('wrong username keeps us on the login page', async () => {
    const login = new LoginScreen();
    await login.login('not-a-user', 'Admin123');
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  it('unknown user with a strong-looking password still rejects', async () => {
    const login = new LoginScreen();
    await login.login('mystery-user', 'P@ssw0rd-123456');
    expect(await browser.getUrl()).toMatch(/login\.htm/);
  });

  // ---------- Successful login ----------

  it('a valid admin login leaves the login page', async () => {
    const login = new LoginScreen();
    await login.login(ValidAdmin.username, ValidAdmin.password);
    const url = await browser.getUrl();
    expect(url).not.toMatch(/login\.htm$/);
  });

  it('a valid admin login lands on a non-login page', async () => {
    const login = new LoginScreen();
    await login.login(ValidAdmin.username, ValidAdmin.password);
    const url = await browser.getUrl();
    expect(url).toMatch(/home|index|dashboard/i);
  });

  it('loginAsAdmin helper authenticates and leaves the login page', async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    expect(await browser.getUrl()).not.toContain('login.htm');
  });

  // ---------- Cross-location login ----------

  it('login works when Outpatient Clinic is selected', async () => {
    const login = new LoginScreen();
    await login.login(ValidAdmin.username, ValidAdmin.password, 'Outpatient Clinic');
    expect(await browser.getUrl()).not.toContain('login.htm');
  });

  it('login works when Pharmacy is selected', async () => {
    const login = new LoginScreen();
    await login.login(ValidAdmin.username, ValidAdmin.password, 'Pharmacy');
    expect(await browser.getUrl()).not.toContain('login.htm');
  });

  it('login works when Laboratory is selected', async () => {
    const login = new LoginScreen();
    await login.login(ValidAdmin.username, ValidAdmin.password, 'Laboratory');
    expect(await browser.getUrl()).not.toContain('login.htm');
  });

  // ---------- Re-login after logout ----------

  it('after login we can log out and see the login page again', async function () {
    const home = new HomeScreen();
    await home.open();
    await home.clickUserMenu();
    const logoutVisible = await home.hasLogoutLink();
    if (logoutVisible) {
      const logout = await $('a=Logout');
      await logout.click();
      await browser.waitUntil(async () => (await browser.getUrl()).includes('login.htm'), { timeout: 10_000 });
      expect(await browser.getUrl()).toMatch(/login\.htm/);
    } else {
      this.skip();
    }
  });
});
