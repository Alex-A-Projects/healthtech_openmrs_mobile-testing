/**
 * RegisterPatientScreen - O2 "Register a patient" wizard (patient-registration app).
 *
 * 7-step wizard with a left sidebar (Name, Gender, Birthdate, Address,
 * Phone Number, Relatives, Confirm). On a 393×852 mobile viewport the
 * wizard scrolls below the fold; helpers in `utils/mobile-actions.ts`
 * (`scrollIntoView`, `swipe`, `hideKeyboard`) handle the mobile UI.
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { scrollIntoView, hideKeyboard } from '../utils/mobile-actions';
import type { PatientRegistration } from '../types/ui.types';

export class RegisterPatientScreen extends BaseScreen {
  public get heading() { return $('h1=Register a patient'); }

  // Sidebar nav links
  private sidebar(name: string) { return $(`aside a=${name}`); }
  get sidebarName()        { return this.sidebar('Name'); }
  get sidebarGender()      { return this.sidebar('Gender'); }
  get sidebarBirthdate()   { return this.sidebar('Birthdate'); }
  get sidebarAddress()     { return this.sidebar('Address'); }
  get sidebarPhoneNumber() { return this.sidebar('Phone Number'); }
  get sidebarRelatives()   { return this.sidebar('Relatives'); }
  get sidebarConfirm()     { return this.sidebar('Confirm'); }

  // Demographics - Name
  get givenNameInput()        { return $('#givenName'); }
  get middleNameInput()       { return $('#middleName'); }
  get familyNameInput()       { return $('#familyName'); }
  get unidentifiedCheckbox()  { return $('input[type="checkbox"][name*="unidentified"]'); }
  get nameAutocompleteDropdown() { return $('[role="listbox"]'); }
  get nextFromNameButton()    { return $('button=Next'); }

  // Demographics - Gender
  get genderSelect()          { return $('#gender'); }
  get nextFromGenderButton()  { return this.nextFromNameButton; }

  // Demographics - Birthdate
  get birthdateInput()        { return $('#birthdate'); }
  get birthdateEstimatedCheckbox() { return $('input[type="checkbox"][name*="birthdateEstimated"]'); }
  get nextFromBirthdateButton() { return this.nextFromNameButton; }

  // Contact Info - Address
  get address1Input()         { return $('input[name="address1"]'); }
  get address2Input()         { return $('input[name="address2"]'); }
  get cityInput()             { return $('input[name="cityVillage"]'); }
  get stateInput()            { return $('input[name="stateProvince"]'); }
  get countryInput()          { return $('input[name="country"]'); }
  get postalCodeInput()       { return $('input[name="postalCode"]'); }
  get nextFromAddressButton() { return this.nextFromNameButton; }

  // Contact Info - Phone Number
  get phoneInput()            { return $('input[type="tel"]'); }
  get nextFromPhoneButton()   { return this.nextFromNameButton; }

  // Relationships
  get addRelativeButton()     { return $('button=Add Relative'); }
  get relativeNameInput()     { return $('input[name*="relativeName"]'); }
  get relativeTypeSelect()    { return $('select[name*="relationship"]'); }
  get nextFromRelativesButton() { return this.nextFromNameButton; }

  // Confirm
  get submitButton()          { return $('button[type="submit"]'); }
  get confirmButton()         { return $('button=Confirm'); }

  // Generic nav
  get nextButton()            { return this.nextFromNameButton; }
  get backButton()            { return $('button=Back'); }
  get cancelButton()          { return $('button=Cancel'); }

  async open(): Promise<void> {
    await this.goto('registrationapp/registerPatient.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  /** Fill the entire wizard end-to-end and submit. */
  async fillAndSubmit(p: PatientRegistration): Promise<void> {
    // Name
    await scrollIntoView('#givenName');
    await this.givenNameInput.setValue(p.demographics.givenName);
    if (p.demographics.middleName) {
      await this.middleNameInput.setValue(p.demographics.middleName);
    }
    await this.familyNameInput.setValue(p.demographics.familyName);
    await hideKeyboard();
    await this.nextFromNameButton.click();

    // Gender
    await this.genderSelect.selectByAttribute('value', p.demographics.gender);
    await this.nextFromGenderButton.click();

    // Birthdate
    await this.birthdateInput.setValue(p.demographics.birthdate);
    if (p.demographics.birthdateEstimated) {
      await this.birthdateEstimatedCheckbox.click();
    }
    await this.nextFromBirthdateButton.click();

    // Address
    if (p.address.address1) await this.address1Input.setValue(p.address.address1);
    if (p.address.city)     await this.cityInput.setValue(p.address.city);
    if (p.address.state)    await this.stateInput.setValue(p.address.state);
    if (p.address.country)  await this.countryInput.setValue(p.address.country);
    if (p.address.postalCode) await this.postalCodeInput.setValue(p.address.postalCode);
    await hideKeyboard();
    await this.nextFromAddressButton.click();

    // Phone
    if (p.contact?.phone) await this.phoneInput.setValue(p.contact.phone);
    await hideKeyboard();
    await this.nextFromPhoneButton.click();

    // Confirm
    await this.confirmButton.click();
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }
}
