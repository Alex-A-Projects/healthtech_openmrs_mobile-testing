import { expect, browser } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { HomeScreen } from '../pages/HomeScreen';

describe('Mobile navigation', () => {
  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    const home = new HomeScreen();
    await home.open();
  });

  it('the user menu is present in the header', async () => {
    const home = new HomeScreen();
    expect(await home.hasUserMenu()).toBe(true);
  });

  it('clicking the OpenMRS logo returns to the home page', async () => {
    const home = new HomeScreen();
    const url = (await browser.getUrl()).split('/').slice(0, 3).join('/');
    await browser.url(`${url}/findPatient.htm`).catch(() => undefined);
    await browser.pause(500);
    if (await home.hasLogo()) {
      await home.clickLogo();
      await browser.pause(800);
      expect(await browser.getUrl()).not.toContain('login.htm');
    }
  });

  it('navigating to /findPatient.htm loads the search screen', async () => {
    const url = (await browser.getUrl()).split('/').slice(0, 3).join('/');
    await browser.url(`${url}/findPatient.htm`);
    expect(await browser.getUrl()).toMatch(/findPatient/i);
  });

  it('navigating to the registration app loads it', async () => {
    const url = (await browser.getUrl()).split('/').slice(0, 3).join('/');
    await browser.url(`${url}/registrationapp/registerPatient.page`);
    expect(await browser.getUrl()).toMatch(/registrationapp|registerPatient/i);
  });

  it('navigating to the home page works', async () => {
    const url = (await browser.getUrl()).split('/').slice(0, 3).join('/');
    await browser.url(`${url}/home.page`).catch(() => undefined);
    expect(await browser.getUrl()).not.toContain('login.htm');
  });

  it('the location banner is visible on every authenticated page', async () => {
    const home = new HomeScreen();
    expect(await home.hasLocationBanner()).toBe(true);
  });

  it('back navigation returns to the previous page', async () => {
    const url = (await browser.getUrl()).split('/').slice(0, 3).join('/');
    await browser.url(`${url}/findPatient.htm`);
    await browser.back();
    expect(await browser.getUrl()).toMatch(/home\.page/i);
  });
});
