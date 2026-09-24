/**
 * CaptureVitalsScreen - vitals/patient.page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { politeDelay } from '../utils/helpers';
import { scrollIntoView, hideKeyboard } from '../utils/mobile-actions';
import type { VitalsCapture } from '../types/ui.types';

export class CaptureVitalsScreen extends BaseScreen {
  public get heading() { return $('h1=Capture Vitals'); }
  public get searchInput() { return $('input[placeholder*="Search by ID or Name"]'); }
  public get clearSearchButton() { return $('button[aria-label*="clear" i]'); }
  public get rows() { return $$('table tbody tr'); }
  public get weightInput() { return $('input#weight'); }
  public get heightInput() { return $('input#height'); }
  public get temperatureInput() { return $('input#temperature'); }
  public get systolicInput() { return $('input#systolic'); }
  public get diastolicInput() { return $('input#diastolic'); }
  public get pulseInput() { return $('input#pulse'); }
  public get oxygenInput() { return $('input#oxygen'); }
  public get respiratoryInput() { return $('input#respiratory'); }
  public get saveButton() { return $('button=Save'); }

  async open(patientId?: string): Promise<void> {
    if (patientId) {
      await this.goto(`vitals/patient.page?patientId=${patientId}`);
    } else {
      await this.goto('vitals/patient.page');
    }
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

  async fillAndSave(v: VitalsCapture): Promise<void> {
    if (v.weight !== undefined)            await this.weightInput.setValue(String(v.weight));
    if (v.height !== undefined)            await this.heightInput.setValue(String(v.height));
    if (v.temperature !== undefined)       await this.temperatureInput.setValue(String(v.temperature));
    if (v.systolicBloodPressure !== undefined) await this.systolicInput.setValue(String(v.systolicBloodPressure));
    if (v.diastolicBloodPressure !== undefined) await this.diastolicInput.setValue(String(v.diastolicBloodPressure));
    if (v.pulse !== undefined)             await this.pulseInput.setValue(String(v.pulse));
    if (v.oxygenSaturation !== undefined)  await this.oxygenInput.setValue(String(v.oxygenSaturation));
    if (v.respiratoryRate !== undefined)   await this.respiratoryInput.setValue(String(v.respiratoryRate));
    await hideKeyboard();
    await this.saveButton.click();
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }
}
