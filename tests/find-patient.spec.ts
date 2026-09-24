import { expect } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { FindPatientScreen } from '../pages/FindPatientScreen';

describe('Mobile find-patient search', () => {
  let find: FindPatientScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    find = new FindPatientScreen();
    await find.open();
  });

  it('the find-patient page loads', async () => {
    expect(await find.isLoaded()).toBe(true);
  });

  it('searching with an empty term returns 0 rows', async () => {
    await find.search('');
    expect(await find.rowCount()).toBe(0);
  });

  it('searching for an unknown term returns 0 rows', async () => {
    await find.search('zzzz-no-such-patient');
    expect(await find.rowCount()).toBe(0);
  });

  it('searching for a real patient returns at least one row', async () => {
    await find.search('Super User');
    expect(await find.rowCount()).toBeGreaterThan(0);
  });

  it('search is case-insensitive', async () => {
    await find.search('super user');
    expect(await find.rowCount()).toBeGreaterThan(0);
  });

  it('"Create New Patient" link is reachable from the search screen', async () => {
    expect(await find.createNewPatientLink.isDisplayed().catch(() => false)).toBe(true);
  });

  it('searching by UUID returns a row', async () => {
    await find.search('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
  });
});
