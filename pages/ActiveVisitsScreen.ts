/**
 * ActiveVisitsScreen - coreapps/activeVisits/activeVisits.page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { politeDelay } from '../utils/helpers';
import { scrollIntoView } from '../utils/mobile-actions';

export class ActiveVisitsScreen extends BaseScreen {
  public get heading() { return $('h1=Active Visits'); }
  public get searchInput() { return $('input[placeholder*="Search"]'); }
  public get filtersButton() { return $('button=Filters'); }
  public get facilityChip() { return $('span=Facility Visit'); }
  public get rows() { return $$('table tbody tr'); }

  async open(): Promise<void> {
    await this.goto('coreapps/activeVisits/activeVisits.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async search(term: string): Promise<void> {
    await scrollIntoView('input[placeholder*="Search"]');
    await this.searchInput.setValue(term);
    await politeDelay();
  }

  async openFilters(): Promise<void> {
    await this.filtersButton.click();
  }

  async hasFacilityChip(): Promise<boolean> {
    return this.facilityChip.isDisplayed().catch(() => false);
  }

  async rowCount(): Promise<number> {
    return (await this.rows).length;
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
}
