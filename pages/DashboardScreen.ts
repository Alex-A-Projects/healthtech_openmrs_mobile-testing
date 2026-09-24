/**
 * DashboardScreen - alias for the post-login home grid (home.page).
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class DashboardScreen extends BaseScreen {
  public get openmrsLogo() { return $('a.navbar-brand'); }
  public get userMenu() { return $('li=admin'); }
  public get locationBanner() { return $('#session-location'); }
  public get findPatientRecordShortcut() { return $('a=Find Patient Record'); }
  public get logoutLink() { return $('a=Logout'); }

  async open(): Promise<void> {
    await this.goto('referenceapplication/home.page');
  }

  async hasLogo(): Promise<boolean> {
    return this.openmrsLogo.isDisplayed().catch(() => false);
  }

  async hasUserMenu(): Promise<boolean> {
    return this.userMenu.isDisplayed().catch(() => false);
  }

  async hasFindPatientRecordShortcut(): Promise<boolean> {
    return this.findPatientRecordShortcut.isDisplayed().catch(() => false);
  }

  async hasLogoutLink(): Promise<boolean> {
    return this.logoutLink.isDisplayed().catch(() => false);
  }

  async hasLocationBanner(): Promise<boolean> {
    return this.locationBanner.isDisplayed().catch(() => false);
  }
}
