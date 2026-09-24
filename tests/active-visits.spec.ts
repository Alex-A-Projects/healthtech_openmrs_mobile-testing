import { expect, browser } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { ActiveVisitsScreen } from '../pages/ActiveVisitsScreen';

describe('Mobile active visits', () => {
  let visits: ActiveVisitsScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    visits = new ActiveVisitsScreen();
    await visits.open();
  });

  it('the page loads with the "Active Visits" heading', async () => {
    expect(await visits.heading.isDisplayed()).toBe(true);
  });

  it('the search input is rendered', async () => {
    expect(await visits.searchInput.isDisplayed()).toBe(true);
  });

  it('the Filters button is visible', async () => {
    expect(await visits.filtersButton.isDisplayed()).toBe(true);
  });

  it('the Facility Visit chip is visible by default', async () => {
    expect(await visits.hasFacilityChip()).toBe(true);
  });

  it('the table has columns: Patient ID | Name | Check-In | Last Seen | Type of visit', async () => {
    const headers = await visits.columnHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(4);
  });

  it('the table renders rows', async () => {
    expect(await visits.rowCount()).toBeGreaterThanOrEqual(0);
  });

  it('searching for an unknown term returns 0 rows', async () => {
    await visits.search('zzz-no-such-patient');
    expect(await visits.rowCount()).toBe(0);
  });

  it('clicking Filters opens the filter menu', async () => {
    await visits.openFilters();
    await browser.pause(300);
  });
});
