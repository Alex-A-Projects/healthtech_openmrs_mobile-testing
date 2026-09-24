import { test, expect } from '../../pw-fixtures/testFixtures';

/**
 * Mobile find-patient-record tests via Playwright mobile-emulation.
 */
test.describe('Mobile find patient record (Playwright emulation)', () => {
  test('the page loads with the heading', async ({ findPatientRecordPage }) => {
    await expect(findPatientRecordPage.heading).toBeVisible();
  });

  test('the search input is rendered', async ({ findPatientRecordPage }) => {
    await expect(findPatientRecordPage.searchInput).toBeVisible();
  });

  test('the table has 5 columns: Identifier | Name | Gender | Age | Birthdate', async ({ findPatientRecordPage }) => {
    const headers = await findPatientRecordPage.columnHeaders();
    expect(headers).toContain('Identifier');
    expect(headers).toContain('Name');
    expect(headers).toContain('Gender');
    expect(headers).toContain('Age');
    expect(headers).toContain('Birthdate');
  });

  test('the recent patients table renders rows', async ({ findPatientRecordPage }) => {
    const count = await findPatientRecordPage.rowCount();
    expect(count).toBeGreaterThan(0);
  });

  test('searching for "Susan" returns rows', async ({ findPatientRecordPage }) => {
    await findPatientRecordPage.search('Susan');
    expect(await findPatientRecordPage.rowCount()).toBeGreaterThan(0);
  });

  test('searching for an unknown term returns 0 rows', async ({ findPatientRecordPage }) => {
    await findPatientRecordPage.search('zzz-no-such-patient');
    expect(await findPatientRecordPage.rowCount()).toBe(0);
  });
});
