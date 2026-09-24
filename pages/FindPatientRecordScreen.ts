/**
 * FindPatientRecordScreen - O2 "Find Patient Record" search.
 *
 * Table with columns: Identifier | Name | Gender | Age | Birthdate.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { politeDelay } from '../utils/helpers';
import { scrollIntoView } from '../utils/mobile-actions';

export class FindPatientRecordScreen extends BaseScreen {
  public get heading() { return $('h1=Find Patient Record'); }
  public get searchInput() { return $('input[placeholder*="Search by ID or Name"]'); }
  public get clearSearchButton() { return $('button[aria-label*="clear" i]'); }
  public get recentBadge() { return $('span=Recent'); }
  public get table() { return $('table'); }
  public get rows() { return $$('table tbody tr'); }

  async open(): Promise<void> {
    await this.goto('coreapps/findpatient/findPatient.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async search(term: string): Promise<void> {
    await scrollIntoView('input[placeholder*="Search by ID or Name"]');
    await this.searchInput.setValue(term);
    await politeDelay();
  }

  async clearSearch(): Promise<void> {
    if (await this.clearSearchButton.isDisplayed().catch(() => false)) {
      await this.clearSearchButton.click();
    } else {
      await this.searchInput.setValue('');
    }
  }

  async rowCount(): Promise<number> {
    return (await this.rows).length;
  }

  async clickRowByName(name: string): Promise<void> {
    for (const row of await this.rows) {
      const t = ((await row.getText()) ?? '');
      if (t.includes(name)) {
        await row.$('a').click();
        return;
      }
    }
  }

  async clickRowByIdentifier(id: string): Promise<void> {
    for (const row of await this.rows) {
      const t = ((await row.getText()) ?? '');
      if (t.includes(id)) {
        await row.$('a').click();
        return;
      }
    }
  }

  async columnHeaders(): Promise<string[]> {
    const ths = await $$('thead th');
    const result: string[] = [];
    for (const th of ths) {
      const t = ((await th.getText()) ?? '').trim();
      if (t) result.push(t);
    }
    return result;
  }

  async hasRecentBadge(): Promise<boolean> {
    return this.recentBadge.isDisplayed().catch(() => false);
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }
}
