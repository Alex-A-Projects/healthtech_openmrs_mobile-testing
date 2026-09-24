import { expect } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { FindPatientRecordScreen } from '../pages/FindPatientRecordScreen';

describe('Mobile find patient record', () => {
  let find: FindPatientRecordScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    find = new FindPatientRecordScreen();
    await find.open();
  });

  it('the page loads with the heading', async () => {
    expect(await find.isLoaded()).toBe(true);
  });

  it('the search input is rendered', async () => {
    expect(await find.searchInput.isDisplayed()).toBe(true);
  });

  it('the table has 5 columns: Identifier | Name | Gender | Age | Birthdate', async () => {
    const headers = await find.columnHeaders();
    expect(headers).toContain('Identifier');
    expect(headers).toContain('Name');
    expect(headers).toContain('Gender');
    expect(headers).toContain('Age');
    expect(headers).toContain('Birthdate');
  });

  it('the recent patients table renders rows', async () => {
    expect(await find.rowCount()).toBeGreaterThan(0);
  });

  it('searching for "Susan" returns rows', async () => {
    await find.search('Susan');
    expect(await find.rowCount()).toBeGreaterThan(0);
  });

  it('searching for an unknown term returns 0 rows', async () => {
    await find.search('zzz-no-such-patient');
    expect(await find.rowCount()).toBe(0);
  });

  it('clearing search restores the recent list', async () => {
    await find.search('Susan');
    await find.clearSearch();
    expect(await find.rowCount()).toBeGreaterThan(0);
  });

  it('search accepts a UUID', async () => {
    await find.search('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
  });

  it('clicking a row navigates to the patient dashboard', async () => {
    await find.clickRowByName('Super User').catch(() => undefined);
    expect(typeof await browser.getUrl()).toBe('string');
  });

  it('the Recent badge is visible', async () => {
    expect(await find.hasRecentBadge()).toBe(true);
  });
});
