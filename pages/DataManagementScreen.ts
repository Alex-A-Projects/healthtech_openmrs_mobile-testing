/**
 * DataManagementScreen - datamanagement/home.page.
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class DataManagementScreen extends BaseScreen {
  public get heading() { return $('h1=Data Management'); }
  public get mergePatientsCard() { return $('a=Merge Patient Electronic Records'); }

  async open(): Promise<void> {
    await this.goto('datamanagement/home.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }

  async hasMergePatientsCard(): Promise<boolean> {
    return this.mergePatientsCard.isDisplayed().catch(() => false);
  }

  async clickMergePatients(): Promise<void> {
    await this.mergePatientsCard.click();
  }
}
