/**
 * LoginScreen - the O2 login screen (login.htm).
 *
 * Layout (matches the actual O2 login page):
 *   - Banner with link to /referenceapplication/home.page
 *   - "Login" group containing:
 *       - Username textbox (id="username")
 *       - Password textbox (id="password")
 *       - "Location for this session:" label + clickable list of locations
 *         (NOT a <select> — these are <li> items you tap to select)
 *       - "Log In" submit button (id="loginButton")
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { politeDelay } from '../utils/helpers';
import { env } from '../config/env.config';
import { O2_LOCATIONS } from '../constants';

export class LoginScreen extends BaseScreen {
  // O2 username / password / submit inputs all have stable IDs.
  public get usernameInput() { return $('#username'); }
  public get passwordInput() { return $('#password'); }
  public get loginButton() { return $('#loginButton'); }
  public get loginError() { return $('#error-message'); }
  public get sessionLocationInput() { return $('#sessionLocationInput'); }

  // Location picker is a `<ul id="sessionLocation">` with clickable `<li>` items.
  public get locationListItems() { return $$('#sessionLocation li'); }

  async open(): Promise<void> {
    await this.goto('login.htm');
  }

  /** Tap a location by display name. */
  async selectLocation(location: string): Promise<void> {
    const items = await this.locationListItems;
    let matched = false;
    for (const item of items) {
      const t = ((await item.getText()) ?? '').trim();
      if (t.includes(location)) {
        await item.click();
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Fallback for older skins
      const select = await $('select#sessionLocation');
      try {
        await select.selectByVisibleText(location);
      } catch {
        await select.selectByAttribute('value', location);
      }
    }
    await politeDelay();
  }

  /** Convenience: log in with the default O2 admin credentials. */
  async loginAsAdmin(location: string = env.o2.location): Promise<void> {
    await this.open();
    await this.selectLocation(location);
    await this.usernameInput.setValue(env.o2.username);
    await this.passwordInput.setValue(env.o2.password);
    await this.loginButton.click();
  }

  /** Log in with arbitrary credentials. */
  async login(username: string, password: string, location: string = env.o2.location): Promise<void> {
    await this.open();
    await this.selectLocation(location);
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  /** Read the visible error text after a failed login. */
  async getErrorMessage(): Promise<string> {
    if (await this.loginError.isDisplayed().catch(() => false)) {
      return ((await this.loginError.getText()) ?? '').trim();
    }
    return '';
  }

  /** Returns the currently-selected location name (reads the hidden input). */
  async getSelectedLocation(): Promise<string | null> {
    if (await this.sessionLocationInput.isDisplayed().catch(() => false)) {
      const v = await this.sessionLocationInput.getValue().catch(() => '');
      if (v) return v;
    }
    return null;
  }

  /** Returns the option labels available in the location picker. */
  async listAvailableLocations(): Promise<string[]> {
    const items = await this.locationListItems;
    const result: string[] = [];
    for (const item of items) {
      const t = ((await item.getText()) ?? '').trim();
      if (t) result.push(t);
    }
    return result;
  }

  /** Verify all common O2 locations are present. */
  async hasExpectedLocations(): Promise<boolean> {
    const available = await this.listAvailableLocations();
    return O2_LOCATIONS.some((loc) => available.some((a) => a.includes(loc)));
  }

  /** Form-level validation helpers (used by login.spec.ts). */
  async submitEmpty(): Promise<void> {
    await this.open();
    await this.loginButton.click();
  }

  async submitUsernameOnly(username: string): Promise<void> {
    await this.open();
    await this.usernameInput.setValue(username);
    await this.loginButton.click();
  }

  async submitPasswordOnly(password: string): Promise<void> {
    await this.open();
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  /** True when the URL is the login page (after a logout, for example). */
  async isVisible(): Promise<boolean> {
    return await this.usernameInput.isDisplayed().catch(() => false);
  }

  /** Get the input's `name` attribute (used by attribute tests). */
  async getUsernameNameAttribute(): Promise<string> {
    return (await this.usernameInput.getAttribute('name')) ?? '';
  }

  /** Get the password input's `type` attribute. */
  async getPasswordTypeAttribute(): Promise<string> {
    return (await this.passwordInput.getAttribute('type')) ?? '';
  }

  /** True when both login inputs are editable (not disabled / readonly). */
  async areLoginInputsEditable(): Promise<boolean> {
    const u = await this.usernameInput.isEnabled();
    const p = await this.passwordInput.isEnabled();
    return u && p;
  }

  /** Get the submit button's value attribute. */
  async getLoginButtonValue(): Promise<string> {
    return (await this.loginButton.getAttribute('value')) ?? '';
  }
}
