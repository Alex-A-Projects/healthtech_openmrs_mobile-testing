/**
 * FindPatientScreen - legacy O2 "Find Patient" page (findPatient.htm).
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { politeDelay } from '../utils/helpers';

export class FindPatientScreen extends BaseScreen {
  public get heading() { return $('h1=Find Patient'); }
  public get searchInput() { return $('#patient-search'); }
  public get searchButton() { return $('input[type="submit"][value*="Search"]'); }
  public get createNewPatientLink() { return $('a=Create New Patient'); }
  public get resultsTable() { return $('table'); }
  public get rows() { return $$('table tbody tr'); }

  async open(): Promise<void> {
    await this.goto('findPatient.htm');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.setValue(term);
    await this.searchButton.click();
    await politeDelay();
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

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }
}
