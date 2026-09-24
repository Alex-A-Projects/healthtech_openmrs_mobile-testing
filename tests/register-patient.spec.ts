import { expect } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { RegisterPatientScreen } from '../pages/RegisterPatientScreen';
import { generatePatient } from '../utils/data-generator';

/**
 * Mobile register-patient wizard tests.
 *
 * Mirrors `tests/ui/register-patient.spec.ts` from the O2 web project.
 * Mobile adaptations:
 *   - 7-step wizard scrolls below the 393×852 viewport
 *   - The iOS on-screen keyboard covers submit buttons (helpers in
 *     `RegisterPatientScreen.fillAndSubmit` call `hideKeyboard()`)
 */
describe('Mobile register patient', () => {
  let reg: RegisterPatientScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    reg = new RegisterPatientScreen();
    await reg.open();
  });

  it('the registration wizard opens', async () => {
    expect(await reg.isLoaded()).toBe(true);
  });

  it('the Name step is shown on first load', async () => {
    expect(await reg.givenNameInput.isDisplayed()).toBe(true);
    expect(await reg.familyNameInput.isDisplayed()).toBe(true);
  });

  it('the sidebar shows Name / Gender / Birthdate / Address / Phone Number / Confirm', async () => {
    for (const sidebar of [
      reg.sidebarName,
      reg.sidebarGender,
      reg.sidebarBirthdate,
      reg.sidebarAddress,
      reg.sidebarPhoneNumber,
      reg.sidebarConfirm,
    ]) {
      expect(await sidebar.isDisplayed().catch(() => false)).toBe(true);
    }
  });

  it('the given/family name inputs accept text', async () => {
    await reg.givenNameInput.setValue('Alice');
    await reg.familyNameInput.setValue('Tester');
    const v = (await reg.givenNameInput.getValue()) ?? '';
    expect(v).toBe('Alice');
  });

  it('the gender select accepts M / F', async () => {
    await reg.genderSelect.selectByAttribute('value', 'F');
    const v = (await reg.genderSelect.getValue()) ?? '';
    expect(v).toBe('F');
  });

  it('the birthdate input accepts a date', async () => {
    await reg.birthdateInput.setValue('1990-01-01');
    const v = (await reg.birthdateInput.getValue()) ?? '';
    expect(v).toBe('1990-01-01');
  });

  it('the address inputs accept text', async () => {
    await reg.address1Input.setValue('123 Test Lane');
    expect((await reg.address1Input.getValue()) ?? '').toBe('123 Test Lane');
  });

  it('the phone input accepts text', async () => {
    await reg.phoneInput.setValue('5551234567');
    expect((await reg.phoneInput.getValue()) ?? '').toBe('5551234567');
  });

  it('the birthdate estimated checkbox toggles', async () => {
    await reg.birthdateEstimatedCheckbox.click();
    const checked = await reg.birthdateEstimatedCheckbox.isSelected();
    expect(checked).toBe(true);
  });

  it('the Next button is reachable after filling the Name step', async () => {
    await reg.givenNameInput.setValue('Alice');
    await reg.familyNameInput.setValue('Tester');
    expect(await reg.nextButton.isDisplayed()).toBe(true);
  });

  // Happy-path end-to-end (mirrors the O2 web project's `register-patient.spec.ts`)

  it('registers a male patient end-to-end', async () => {
    const p = generatePatient({ gender: 'M' });
    await reg.fillAndSubmit({
      demographics: {
        givenName: p.givenName,
        familyName: p.familyName,
        gender: 'M',
        birthdate: p.birthdate,
      },
      address: {
        address1: p.address1,
        city: p.city,
        state: p.state,
        country: p.country,
        postalCode: p.postalCode,
      },
      contact: { phone: p.phone },
    });
    // After registration we should land on the patient dashboard
    expect(await browser.getUrl()).toMatch(/patient\.page/);
  });

  it('registers a female patient end-to-end', async () => {
    const p = generatePatient({ gender: 'F' });
    await reg.fillAndSubmit({
      demographics: {
        givenName: p.givenName,
        familyName: p.familyName,
        gender: 'F',
        birthdate: p.birthdate,
      },
      address: {
        address1: p.address1,
        city: p.city,
        state: p.state,
        country: p.country,
        postalCode: p.postalCode,
      },
      contact: { phone: p.phone },
    });
    expect(await browser.getUrl()).toMatch(/patient\.page/);
  });

  it('registers a patient with a middle name', async () => {
    const p = generatePatient();
    await reg.fillAndSubmit({
      demographics: {
        givenName: p.givenName,
        middleName: 'Mid',
        familyName: p.familyName,
        gender: p.gender,
        birthdate: p.birthdate,
      },
      address: {
        address1: p.address1,
        city: p.city,
        state: p.state,
        country: p.country,
        postalCode: p.postalCode,
      },
      contact: { phone: p.phone },
    });
    expect(await browser.getUrl()).toMatch(/patient\.page/);
  });

  it('registers a patient with an estimated birthdate', async () => {
    const p = generatePatient();
    await reg.fillAndSubmit({
      demographics: {
        givenName: p.givenName,
        familyName: p.familyName,
        gender: p.gender,
        birthdate: p.birthdate,
        birthdateEstimated: true,
      },
      address: {
        address1: p.address1,
        city: p.city,
        state: p.state,
        country: p.country,
        postalCode: p.postalCode,
      },
      contact: { phone: p.phone },
    });
    expect(await browser.getUrl()).toMatch(/patient\.page/);
  });
});
