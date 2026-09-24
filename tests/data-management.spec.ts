import { expect, browser } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { DataManagementScreen } from '../pages/DataManagementScreen';

describe('Mobile data management', () => {
  let dm: DataManagementScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    dm = new DataManagementScreen();
    await dm.open();
  });

  it('the page loads with the "Data Management" heading', async () => {
    expect(await dm.isLoaded()).toBe(true);
  });

  it('the Merge Patient Electronic Records card is visible', async () => {
    expect(await dm.hasMergePatientsCard()).toBe(true);
  });

  it('clicking the Merge Patients card navigates to the merge form', async () => {
    await dm.clickMergePatients();
    expect(await browser.getUrl()).toMatch(/mergePatients/i);
  });
});
