import { expect, $$ } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { CaptureVitalsScreen } from '../pages/CaptureVitalsScreen';

describe('Mobile capture vitals', () => {
  let vitals: CaptureVitalsScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    vitals = new CaptureVitalsScreen();
    await vitals.open();
  });

  it('the page loads with the "Capture Vitals" heading', async () => {
    expect(await vitals.isLoaded()).toBe(true);
  });

  it('the search input is rendered', async () => {
    expect(await vitals.searchInput.isDisplayed()).toBe(true);
  });

  it('the table has 5 columns: Identifier | Name | Gender | Age | Birthdate', async () => {
    const ths = await $$('thead th');
    const headers: string[] = [];
    for (const t of ths) {
      const txt = ((await t.getText()) ?? '').trim();
      if (txt) headers.push(txt);
    }
    expect(headers).toContain('Identifier');
    expect(headers).toContain('Name');
    expect(headers).toContain('Gender');
    expect(headers).toContain('Age');
    expect(headers).toContain('Birthdate');
  });

  it('the recent patients table renders rows', async () => {
    expect(await vitals.rowCount()).toBeGreaterThan(0);
  });

  it('searching for "Maria" returns rows', async () => {
    await vitals.search('Maria');
    expect(await vitals.rowCount()).toBeGreaterThan(0);
  });

  it('searching for an unknown term returns 0 rows', async () => {
    await vitals.search('zzz-no-such-patient');
    expect(await vitals.rowCount()).toBe(0);
  });

  it('clearing search restores the recent list', async () => {
    await vitals.search('Maria');
    await vitals.clearSearch();
    expect(await vitals.rowCount()).toBeGreaterThan(0);
  });
});
