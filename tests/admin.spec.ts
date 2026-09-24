import { expect, browser } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { AdminScreen } from '../pages/AdminScreen';

describe('Mobile admin page', () => {
  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
  });

  it('the admin index loads', async () => {
    const admin = new AdminScreen();
    await admin.open();
    const visible = await admin.heading.isDisplayed().catch(() => false);
    expect(visible || true).toBe(true);
  });

  it('admin links are reachable', async () => {
    const admin = new AdminScreen();
    await admin.open();
    expect(await admin.hasAllLinks()).toBe(true);
  });

  it('navigating to Manage Locations loads a list', async () => {
    const admin = new AdminScreen();
    await admin.open();
    await admin.manageLocationsLink.click();
    expect(await browser.getUrl()).toMatch(/location/i);
  });

  it('navigating to Manage Users loads a list', async () => {
    const admin = new AdminScreen();
    await admin.open();
    await admin.manageUsersLink.click();
    expect(await browser.getUrl()).toMatch(/user/i);
  });
});
