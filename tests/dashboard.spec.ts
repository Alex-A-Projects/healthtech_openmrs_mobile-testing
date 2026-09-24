import { expect, browser } from '@wdio/globals';
import { DashboardScreen } from '../pages/DashboardScreen';
import { LoginScreen } from '../pages/LoginScreen';

describe('Mobile home dashboard (alias)', () => {
  let dash: DashboardScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    dash = new DashboardScreen();
    await dash.open();
  });

  it('the home page shows the OpenMRS branding', async () => {
    expect(await dash.hasLogo()).toBe(true);
  });

  it('the home page shows a user menu in the header', async () => {
    expect(await dash.hasUserMenu()).toBe(true);
  });

  it('the home page exposes the Find Patient Record shortcut', async () => {
    expect(await dash.hasFindPatientRecordShortcut()).toBe(true);
  });

  it('the home page shows a location banner', async () => {
    expect(await dash.hasLocationBanner()).toBe(true);
  });

  it('clicking user menu shows logout option', async () => {
    expect(await dash.hasLogoutLink()).toBe(true);
  });

  it('navigating to /home.page works', async () => {
    const url = (await browser.getUrl()).split('/').slice(0, 3).join('/');
    await browser.url(`${url}/referenceapplication/home.page`);
    expect(await browser.getUrl()).not.toContain('login.htm');
  });
});
