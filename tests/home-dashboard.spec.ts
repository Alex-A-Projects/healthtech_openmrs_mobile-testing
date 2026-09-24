import { expect } from '@wdio/globals';
import { HomeScreen } from '../pages/HomeScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { ValidAdmin } from '../data/testData';

/**
 * Mobile home dashboard tests.
 *
 * Mirrors `tests/ui/home-dashboard.spec.ts` from the O2 web project.
 * The mobile grid stacks the 10 app tiles into a single column on a
 * 393×852 viewport; the same selectors work because the DOM is shared.
 */
describe('Mobile home dashboard', () => {
  let home: HomeScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    home = new HomeScreen();
    await home.open();
  });

  it('the home page is reachable after login', async () => {
    expect(await browser.getUrl()).not.toContain('login.htm');
  });

  it('the home page shows the OpenMRS branding', async () => {
    expect(await home.hasLogo()).toBe(true);
  });

  it('the home page shows a user menu in the header', async () => {
    expect(await home.hasUserMenu()).toBe(true);
  });

  it('the home page shows the location banner', async () => {
    expect(await home.hasLocationBanner()).toBe(true);
  });

  it('the home page shows the breadcrumb', async () => {
    expect(await home.hasBreadcrumbHome()).toBe(true);
  });

  // The 10 O2 app tiles

  it('exposes Find Patient Record tile', async () => {
    expect(await home.findPatientRecordApp.isDisplayed()).toBe(true);
  });

  it('exposes Active Visits tile', async () => {
    expect(await home.activeVisitsApp.isDisplayed()).toBe(true);
  });

  it('exposes Register a patient tile', async () => {
    expect(await home.registerPatientApp.isDisplayed()).toBe(true);
  });

  it('exposes Capture Vitals tile', async () => {
    expect(await home.captureVitalsApp.isDisplayed()).toBe(true);
  });

  it('exposes Appointment Scheduling tile', async () => {
    expect(await home.appointmentSchedulingApp.isDisplayed()).toBe(true);
  });

  it('exposes Reports tile', async () => {
    expect(await home.reportsApp.isDisplayed()).toBe(true);
  });

  it('exposes Data Management tile', async () => {
    expect(await home.dataManagementApp.isDisplayed()).toBe(true);
  });

  it('exposes Configure Metadata tile', async () => {
    expect(await home.configureMetadataApp.isDisplayed()).toBe(true);
  });

  it('exposes System Administration tile', async () => {
    expect(await home.systemAdministrationApp.isDisplayed()).toBe(true);
  });

  it('clicking Find Patient Record navigates to the search page', async () => {
    await home.clickFindPatientRecord();
    expect(await browser.getUrl()).toMatch(/findPatient/i);
  });

  it('clicking Register a patient opens the registration wizard', async () => {
    await home.clickRegisterPatient();
    expect(await browser.getUrl()).toMatch(/registrationapp/i);
  });

  it('clicking Appointment Scheduling opens the scheduling page', async () => {
    await home.clickAppointmentScheduling();
    expect(await browser.getUrl()).toMatch(/appointmentschedulingui/i);
  });

  it('clicking System Administration opens the admin page', async () => {
    await home.clickSystemAdministration();
    expect(await browser.getUrl()).toMatch(/systemadministration|adminui/i);
  });
});
