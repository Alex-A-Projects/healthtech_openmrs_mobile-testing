import { expect } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { ConfigureMetadataScreen } from '../pages/ConfigureMetadataScreen';

describe('Mobile configure metadata', () => {
  let meta: ConfigureMetadataScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    meta = new ConfigureMetadataScreen();
    await meta.open();
  });

  it('the page loads with the heading', async () => {
    expect(await meta.isLoaded()).toBe(true);
  });

  it('the page has section headings', async () => {
    const headings = await meta.sectionHeadings();
    expect(headings.length).toBeGreaterThan(0);
  });

  it('the page has management links', async () => {
    const count = await meta.managementLinkCount();
    expect(count).toBeGreaterThan(0);
  });

  it('all 10 standard sections are present', async () => {
    const headings = (await meta.sectionHeadings()).join(' | ');
    const expected = [
      'Concepts',
      'Encounters',
      'Forms',
      'Locations',
      'Metadata Mappings',
      'Open Concept Lab',
      'Patients',
      'Providers',
      'Roles',
      'Visits',
    ];
    for (const word of expected) {
      expect(headings).toMatch(new RegExp(word, 'i'));
    }
  });
});
