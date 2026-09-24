/**
 * SystemAdministrationScreen - adminui/systemadministration/systemAdministration.page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class SystemAdministrationScreen extends BaseScreen {
  public get heading() { return $('h1=System Administration'); }
  public get breadcrumb() { return $('.breadcrumb'); }
  private tile(name: string) { return $(`a=${name}`); }

  get manageExtensionsTile()         { return this.tile('Manage Extensions'); }
  get manageAppsTile()               { return this.tile('Manage Apps'); }
  get manageGlobalPropertiesTile()   { return this.tile('Manage Global Properties'); }
  get manageAccountsTile()           { return this.tile('Manage Accounts'); }
  get styleGuideTile()               { return this.tile('Style Guide'); }
  get advancedAdministrationTile()   { return this.tile('Advanced Administration'); }

  async open(): Promise<void> {
    await this.goto('adminui/systemadministration/systemAdministration.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }

  async hasBreadcrumb(): Promise<boolean> {
    return this.breadcrumb.isDisplayed().catch(() => false);
  }

  async cardCount(): Promise<number> {
    const cards = await $$('main a');
    return cards.length;
  }
}
