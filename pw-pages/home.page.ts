/**
 * HomePage - mirrors the WDIO HomeScreen using Playwright Locators.
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private tile(name: string): Locator {
    return this.page.locator(`a:has-text("${name}"), [role="button"]:has-text("${name}")`).first();
  }

  readonly heading: Locator;
  readonly findPatientRecordApp: Locator;
  readonly registerPatientApp: Locator;
  readonly captureVitalsApp: Locator;
  readonly activeVisitsApp: Locator;
  readonly appointmentSchedulingApp: Locator;
  readonly dataManagementApp: Locator;
  readonly configureMetadataApp: Locator;
  readonly systemAdministrationApp: Locator;
  readonly reportsApp: Locator;
  readonly userMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Home"), h2:has-text("Home")').first();
    this.findPatientRecordApp = this.tile('Find Patient Record');
    this.registerPatientApp = this.tile('Register a patient');
    this.captureVitalsApp = this.tile('Capture Vitals');
    this.activeVisitsApp = this.tile('Active Visits');
    this.appointmentSchedulingApp = this.tile('Appointment Scheduling');
    this.reportsApp = this.tile('Reports');
    this.dataManagementApp = this.tile('Data Management');
    this.configureMetadataApp = this.tile('Configure Metadata');
    this.systemAdministrationApp = this.tile('System Administration');
    this.userMenu = page.locator('li:has-text("admin"), button:has-text("admin"), a:has-text("admin")').first();
    this.logoutLink = page.locator('a:has-text("Logout"), button:has-text("Logout")').first();
  }

  async waitForReady(): Promise<void> {
    await this.findPatientRecordApp.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
  }

  async hasAllAppTiles(): Promise<boolean> {
    const names = [
      'Find Patient Record',
      'Active Visits',
      'Register a patient',
      'Capture Vitals',
      'Appointment Scheduling',
      'Reports',
      'Data Management',
      'Configure Metadata',
      'System Administration',
    ];
    const visibilities = await Promise.all(
      names.map(async (n) => await this.tile(n).isVisible().catch(() => false))
    );
    return visibilities.every(Boolean);
  }
}
