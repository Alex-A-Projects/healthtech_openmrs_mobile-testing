import { expect } from '@wdio/globals';
import { LoginScreen } from '../pages/LoginScreen';
import { MergePatientsScreen } from '../pages/MergePatientsScreen';

describe('Mobile merge patients', () => {
  let merge: MergePatientsScreen;

  beforeEach(async () => {
    const login = new LoginScreen();
    await login.loginAsAdmin();
    merge = new MergePatientsScreen();
    await merge.open();
  });

  it('the merge form loads', async () => {
    expect(await merge.isLoaded()).toBe(true);
  });

  it('"Select two patients to merge..." prompt is visible', async () => {
    expect(await merge.hasSelectPrompt()).toBe(true);
  });

  it('help text is visible', async () => {
    expect(await merge.hasHelpText()).toBe(true);
  });

  it('two Patient ID inputs are visible', async () => {
    expect(await merge.patientIdInput1.isDisplayed()).toBe(true);
    expect(await merge.patientIdInput2.isDisplayed()).toBe(true);
  });

  it('Cancel button is visible', async () => {
    expect(await merge.hasCancel()).toBe(true);
  });

  it('Continue button is visible', async () => {
    expect(await merge.hasContinue()).toBe(true);
  });

  it('Continue is disabled when both patient IDs are empty', async () => {
    expect(await merge.isContinueDisabled()).toBe(true);
  });

  it('each Patient ID input accepts text', async () => {
    await merge.patientIdInput1.setValue('100');
    await merge.patientIdInput2.setValue('200');
    expect(((await merge.patientIdInput1.getValue()) ?? '')).toBe('100');
    expect(((await merge.patientIdInput2.getValue()) ?? '')).toBe('200');
  });

  it('Continue becomes enabled when both patient IDs are filled', async () => {
    await merge.fillPatientIds('100', '200');
    expect(await merge.isContinueDisabled()).toBe(false);
  });
});
