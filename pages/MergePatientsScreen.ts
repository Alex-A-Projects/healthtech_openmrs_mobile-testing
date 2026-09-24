/**
 * MergePatientsScreen - datamanagement/mergePatients.page.
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { scrollIntoView } from '../utils/mobile-actions';

export class MergePatientsScreen extends BaseScreen {
  public get heading() { return $('h1=Merge Patient Electronic Records'); }
  public get selectPrompt() { return $('p=Select two patients to merge'); }
  public get helpText() { return $('.help-text'); }
  public get patientIdInput1() { return $('#patient1'); }
  public get patientIdInput2() { return $('#patient2'); }
  public get dynamicSearch() { return $('input[placeholder*="Search"]'); }
  public get cancelButton() { return $('button=Cancel'); }
  public get continueButton() { return $('button=Continue'); }

  async open(): Promise<void> {
    await this.goto('datamanagement/mergePatients.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }

  async hasSelectPrompt(): Promise<boolean> {
    return this.selectPrompt.isDisplayed().catch(() => false);
  }

  async hasHelpText(): Promise<boolean> {
    return this.helpText.isDisplayed().catch(() => false);
  }

  async hasCancel(): Promise<boolean> {
    return this.cancelButton.isDisplayed().catch(() => false);
  }

  async hasContinue(): Promise<boolean> {
    await scrollIntoView('button=Continue');
    return this.continueButton.isDisplayed().catch(() => false);
  }

  async isContinueDisabled(): Promise<boolean> {
    await scrollIntoView('button=Continue');
    const disabled = await this.continueButton.getAttribute('disabled');
    return disabled !== null;
  }

  async fillPatientIds(id1: string, id2: string): Promise<void> {
    await this.patientIdInput1.setValue(id1);
    await this.patientIdInput2.setValue(id2);
  }
}
