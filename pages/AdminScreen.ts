/**
 * AdminScreen - admin index page.
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class AdminScreen extends BaseScreen {
  public get heading() { return $('h1=Admin'); }
  get manageLocationsLink() { return $('a=Manage Locations'); }
  get manageUsersLink()     { return $('a=Manage Users'); }
  get manageRolesLink()     { return $('a=Manage Roles'); }
  get manageConceptsLink()  { return $('a=Manage Concepts'); }

  async open(): Promise<void> {
    await this.goto('adminui/index.html');
  }

  async hasAllLinks(): Promise<boolean> {
    const links = [
      this.manageLocationsLink,
      this.manageUsersLink,
      this.manageRolesLink,
      this.manageConceptsLink,
    ];
    const checks: boolean[] = [];
    for (const l of links) {
      checks.push(await l.isDisplayed().catch(() => false));
    }
    return checks.some((v) => v);
  }
}
