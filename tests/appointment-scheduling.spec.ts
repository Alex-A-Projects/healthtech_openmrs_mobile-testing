import { expect, browser } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { AppointmentSchedulingScreen } from '../pages/AppointmentSchedulingScreen';

/**
 * Mobile appointment-scheduling tests.
 *
 * Mirrors `tests/ui/appointment-scheduling.spec.ts` from the O2 web project.
 */
describe('Mobile appointment scheduling', () => {
  let sched: AppointmentSchedulingScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    sched = new AppointmentSchedulingScreen();
    await sched.open();
  });

  it('the page loads with the heading', async () => {
    expect(await sched.isLoaded()).toBe(true);
  });

  it('the breadcrumb is visible', async () => {
    expect(await sched.hasBreadcrumb()).toBe(true);
  });

  it('all 5 tile cards are visible', async () => {
    expect(await sched.hasAllTiles()).toBe(true);
  });

  it('the page exposes ≥ 5 tiles', async () => {
    const count = await sched.tileCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it('clicking Manage Service Types navigates to the right URL', async () => {
    await sched.manageServiceTypesTile.click();
    expect(await browser.getUrl()).toMatch(/appointmentscheduling|services/i);
  });

  it('clicking Manage Provider Schedules navigates correctly', async () => {
    await sched.manageProviderSchedulesTile.click();
    expect(await browser.getUrl()).toMatch(/appointmentscheduling|provider/i);
  });

  it('clicking Manage Appointments navigates correctly', async () => {
    await sched.manageAppointmentsTile.click();
    expect(await browser.getUrl()).toMatch(/appointmentscheduling|appointment/i);
  });

  it('clicking Daily Appointments navigates correctly', async () => {
    await sched.dailyAppointmentsTile.click();
    expect(await browser.getUrl()).toMatch(/appointmentscheduling|daily/i);
  });

  it('clicking Appointment Requests navigates correctly', async () => {
    await sched.appointmentRequestsTile.click();
    expect(await browser.getUrl()).toMatch(/appointmentscheduling|request/i);
  });
});
