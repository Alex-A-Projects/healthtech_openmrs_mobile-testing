/**
 * AppointmentSchedulingScreen - appointmentschedulingui/home.page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class AppointmentSchedulingScreen extends BaseScreen {
  public get heading() { return $('h1=Appointment Scheduling'); }
  public get breadcrumb() { return $('.breadcrumb'); }
  private tile(name: string) { return $(`a=${name}`); }

  get manageServiceTypesTile()      { return this.tile('Manage Service Types'); }
  get manageProviderSchedulesTile() { return this.tile('Manage Provider Schedules'); }
  get manageAppointmentsTile()      { return this.tile('Manage Appointments'); }
  get dailyAppointmentsTile()       { return this.tile('Daily Appointments'); }
  get appointmentRequestsTile()     { return this.tile('Appointment Requests'); }

  async open(): Promise<void> {
    await this.goto('appointmentschedulingui/home.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }

  async hasBreadcrumb(): Promise<boolean> {
    return this.breadcrumb.isDisplayed().catch(() => false);
  }

  async hasAllTiles(): Promise<boolean> {
    const tiles = [
      this.manageServiceTypesTile,
      this.manageProviderSchedulesTile,
      this.manageAppointmentsTile,
      this.dailyAppointmentsTile,
      this.appointmentRequestsTile,
    ];
    const checks: boolean[] = [];
    for (const t of tiles) {
      checks.push(await t.isDisplayed().catch(() => false));
    }
    return checks.every(Boolean);
  }

  async tileCount(): Promise<number> {
    const cards = await $$('main a');
    return cards.length;
  }
}
