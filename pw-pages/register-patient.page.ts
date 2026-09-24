/**
 * RegisterPatientPage - mirrors the WDIO RegisterPatientScreen.
 *
 * The Playwright mobile-emulation track only exercises the happy-path
 * flows; the full 34-test coverage lives in the WDIO `tests/register-patient.spec.ts`.
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPatientPage extends BasePage {
  readonly heading: Locator;
  readonly givenNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly familyNameInput: Locator;
  readonly genderSelect: Locator;
  readonly birthdateInput: Locator;
  readonly nextButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Register a patient"), h2:has-text("Register a patient")').first();
    this.givenNameInput = page.locator('input[name*="givenName"], input#givenName').first();
    this.middleNameInput = page.locator('input[name*="middleName"], input#middleName').first();
    this.familyNameInput = page.locator('input[name*="familyName"], input#familyName').first();
    this.genderSelect = page.locator('select[name*="gender"], select#gender').first();
    this.birthdateInput = page.locator('input[name*="birthdate"], input#birthdate, input[type="date"]').first();
    this.nextButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();
    this.confirmButton = page.locator('button[type="submit"]:has-text("Confirm"), button[type="submit"]:has-text("Register")').first();
  }

  async open(): Promise<boolean> {
    await this.goto('registrationapp/registerPatient.page');
    if (await this.heading.isVisible({ timeout: 3_000 }).catch(() => false)) return true;
    return !(await this.isBrokenPage());
  }

  async fillName(given: string, middle: string, family: string): Promise<void> {
    await this.givenNameInput.fill(given);
    await this.middleNameInput.fill(middle);
    await this.familyNameInput.fill(family);
    await this.nextButton.click();
  }
}
