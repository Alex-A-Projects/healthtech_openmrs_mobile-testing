/**
 * VisitScreen - the "Start Visit" dialog overlay.
 */
import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { hideKeyboard } from '../utils/mobile-actions';

export class VisitScreen extends BaseScreen {
  public get dialog() { return $('div[role="dialog"]'); }
  public get visitTypeSelect() { return $('#visitType'); }
  public get startDatetimeInput() { return $('#startDatetime'); }
  public get stopDatetimeInput() { return $('#stopDatetime'); }
  public get locationSelect() { return $('#location'); }
  public get startVisitButton() { return $('button=Start Visit'); }
  public get cancelButton() { return $('button=Cancel'); }

  async isVisible(): Promise<boolean> {
    return this.dialog.isDisplayed().catch(() => false);
  }

  async startVisit(opts: { visitType?: string; location?: string } = {}): Promise<void> {
    if (opts.visitType) {
      await this.visitTypeSelect.selectByVisibleText(opts.visitType);
    }
    if (opts.location) {
      await this.locationSelect.selectByVisibleText(opts.location);
    }
    await hideKeyboard();
    await this.startVisitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
