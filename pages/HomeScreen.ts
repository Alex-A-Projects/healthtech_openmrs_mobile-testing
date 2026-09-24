/**
 * HomeScreen - O2's post-login "Home" screen.
 *
 * Renders a grid of app tiles: Find Patient Record, Awaiting Admission,
 * Active Visits, Register a patient, Capture Vitals, Appointment
 * Scheduling, Reports, Data Management, Configure Metadata,
 * System Administration.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class HomeScreen extends BaseScreen {
  public get heading() { return $('h1=Home'); }
  public get openmrsLogo() { return $('a.navbar-brand'); }
  public get userMenu() { return $('#user-menu'); }
  public get logoutLink() { return $('a=Logout'); }
  public get locationBanner() { return $('#session-location'); }
  public get breadcrumbHome() { return $('.breadcrumb a=Home'); }

  private tile(name: string) { return $(`a=${name}`); }

  get findPatientRecordApp() { return this.tile('Find Patient Record'); }
  get activeVisitsApp() { return this.tile('Active Visits'); }
  get registerPatientApp() { return this.tile('Register a patient'); }
  get captureVitalsApp() { return this.tile('Capture Vitals'); }
  get appointmentSchedulingApp() { return this.tile('Appointment Scheduling'); }
  get reportsApp() { return this.tile('Reports'); }
  get dataManagementApp() { return this.tile('Data Management'); }
  get configureMetadataApp() { return this.tile('Configure Metadata'); }
  get systemAdministrationApp() { return this.tile('System Administration'); }

  /** Open the home page after authentication. */
  async open(): Promise<void> {
    await this.goto('referenceapplication/home.page');
    await this.waitForReady();
  }

  /** Wait until the home app grid has loaded. */
  async waitForReady(): Promise<void> {
    await this.findPatientRecordApp.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  /** Open any of the app tiles by display name. */
  async openApp(appName: string): Promise<void> {
    await this.tile(appName).click();
  }

  async clickFindPatientRecord(): Promise<void> { await this.findPatientRecordApp.click(); }
  async clickActiveVisits(): Promise<void> { await this.activeVisitsApp.click(); }
  async clickRegisterPatient(): Promise<void> { await this.registerPatientApp.click(); }
  async clickCaptureVitals(): Promise<void> { await this.captureVitalsApp.click(); }
  async clickAppointmentScheduling(): Promise<void> { await this.appointmentSchedulingApp.click(); }
  async clickReports(): Promise<void> { await this.reportsApp.click(); }
  async clickDataManagement(): Promise<void> { await this.dataManagementApp.click(); }
  async clickConfigureMetadata(): Promise<void> { await this.configureMetadataApp.click(); }
  async clickSystemAdministration(): Promise<void> { await this.systemAdministrationApp.click(); }

  /** All visible app-tile labels. */
  async listAllAppTiles(): Promise<string[]> {
    const tiles = await $$('main a');
    const result: string[] = [];
    for (const t of tiles) {
      const txt = ((await t.getText()) ?? '').trim();
      if (txt) result.push(txt);
    }
    return result;
  }

  async hasUserMenu(): Promise<boolean> {
    return this.userMenu.isDisplayed().catch(() => false);
  }
  async hasLogoutLink(): Promise<boolean> {
    return this.logoutLink.isDisplayed().catch(() => false);
  }
  async hasLogo(): Promise<boolean> {
    return this.openmrsLogo.isDisplayed().catch(() => false);
  }
  async hasLocationBanner(): Promise<boolean> {
    return this.locationBanner.isDisplayed().catch(() => false);
  }
  async hasBreadcrumbHome(): Promise<boolean> {
    return this.breadcrumbHome.isDisplayed().catch(() => false);
  }

  async clickUserMenu(): Promise<void> {
    await this.userMenu.click().catch(() => undefined);
  }
}
