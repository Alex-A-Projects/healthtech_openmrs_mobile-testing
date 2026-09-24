/**
 * PatientDashboardScreen - clinicianfacing/patient.page?patientId=<uuid>.
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { scrollIntoView } from '../utils/mobile-actions';

export class PatientDashboardScreen extends BaseScreen {
  public get patientHeader() { return $('.patient-header'); }
  public get patientName() { return $('.patient-header .name'); }
  public get patientIdentifier() { return $('.patient-header .identifier'); }
  public get startVisitLink() { return $('a=Start Visit'); }
  public get captureVitalsLink() { return $('a=Capture Vitals'); }
  public get addPastVisitLink() { return $('a=Add Past Visit'); }
  public get visitNoteLink() { return $('a=Visit Note'); }
  public get recentVisitsPanel() { return $('.recent-visits'); }

  async open(patientId: string): Promise<void> {
    await this.goto(`coreapps/clinicianfacing/patient.page?patientId=${patientId}`);
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await this.patientHeader.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async hasPatientHeader(): Promise<boolean> {
    return this.patientHeader.isDisplayed().catch(() => false);
  }

  async getPatientName(): Promise<string> {
    return ((await this.patientName.getText().catch(() => '')) ?? '').trim();
  }

  async getPatientIdentifier(): Promise<string> {
    return ((await this.patientIdentifier.getText().catch(() => '')) ?? '').trim();
  }

  async hasStartVisit(): Promise<boolean> {
    await scrollIntoView('a=Start Visit');
    return this.startVisitLink.isDisplayed().catch(() => false);
  }

  async hasCaptureVitals(): Promise<boolean> {
    await scrollIntoView('a=Capture Vitals');
    return this.captureVitalsLink.isDisplayed().catch(() => false);
  }

  async hasAddPastVisit(): Promise<boolean> {
    await scrollIntoView('a=Add Past Visit');
    return this.addPastVisitLink.isDisplayed().catch(() => false);
  }

  async clickStartVisit(): Promise<void> {
    await this.hasStartVisit();
    await this.startVisitLink.click();
  }
}
