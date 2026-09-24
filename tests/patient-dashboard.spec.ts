import { expect } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { PatientDashboardScreen } from '../pages/PatientDashboardScreen';

/**
 * Mobile patient-dashboard tests.
 *
 * Mirrors `tests/ui/patient-dashboard.spec.ts` from the O2 web project.
 */
describe('Mobile patient dashboard', () => {
  let dash: PatientDashboardScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    dash = new PatientDashboardScreen();
  });

  it('opening by patientId loads the dashboard', async () => {
    // The O2 demo ships a patient with the well-known UUID below.
    await dash.open('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
    expect(await dash.hasPatientHeader()).toBe(true);
  });

  it('the patient header shows a name', async () => {
    await dash.open('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
    const name = await dash.getPatientName();
    expect(typeof name).toBe('string');
  });

  it('the patient header shows an identifier', async () => {
    await dash.open('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
    const id = await dash.getPatientIdentifier();
    expect(typeof id).toBe('string');
  });

  it('the dashboard exposes a Start Visit action', async () => {
    await dash.open('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
    expect(await dash.hasStartVisit()).toBe(true);
  });

  it('the dashboard exposes a Capture Vitals action', async () => {
    await dash.open('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
    expect(await dash.hasCaptureVitals()).toBe(true);
  });

  it('the dashboard exposes an Add Past Visit action', async () => {
    await dash.open('c1c0c1c0-c1c0-c1c0-c1c0-c1c0c1c0c1c0');
    expect(await dash.hasAddPastVisit()).toBe(true);
  });
});
