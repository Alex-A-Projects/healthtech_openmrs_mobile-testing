import { expect, browser } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { SystemAdministrationScreen } from '../pages/SystemAdministrationScreen';

describe('Mobile system administration', () => {
  let sys: SystemAdministrationScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    sys = new SystemAdministrationScreen();
    await sys.open();
  });

  it('the page loads with the heading', async () => {
    expect(await sys.isLoaded()).toBe(true);
  });

  it('the breadcrumb is visible', async () => {
    expect(await sys.hasBreadcrumb()).toBe(true);
  });

  it('all 6 tile cards are reachable', async () => {
    const count = await sys.cardCount();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  it('clicking Manage Apps navigates to the apps page', async () => {
    await sys.manageAppsTile.click();
    expect(await browser.getUrl()).toMatch(/apps|app/i);
  });

  it('clicking Manage Global Properties navigates correctly', async () => {
    await sys.manageGlobalPropertiesTile.click();
    expect(await browser.getUrl()).toMatch(/global|properties/i);
  });

  it('clicking Manage Accounts navigates correctly', async () => {
    await sys.manageAccountsTile.click();
    expect(await browser.getUrl()).toMatch(/account/i);
  });

  it('clicking Advanced Administration navigates correctly', async () => {
    await sys.advancedAdministrationTile.click();
    expect(await browser.getUrl()).toMatch(/advanced/i);
  });
});
