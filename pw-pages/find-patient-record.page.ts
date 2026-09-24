/**
 * FindPatientRecordPage - mirrors the WDIO FindPatientRecordScreen.
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindPatientRecordPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly rows: Locator;
  readonly recentBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Find Patient Record"), h2:has-text("Find Patient Record")').first();
    this.searchInput = page.locator('input[placeholder*="Search by ID or Name"]').first();
    this.rows = page.locator('table tbody tr');
    this.recentBadge = page.locator(':text("Recent")').first();
  }

  async open(): Promise<boolean> {
    await this.goto('coreapps/findpatient/findPatient.page');
    if (await this.heading.isVisible({ timeout: 3_000 }).catch(() => false)) return true;
    return !(await this.isBrokenPage());
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async rowCount(): Promise<number> {
    return this.rows.count();
  }

  async columnHeaders(): Promise<string[]> {
    return (await this.page.locator('thead th').allTextContents()).map((t) => t.trim()).filter(Boolean);
  }
}
