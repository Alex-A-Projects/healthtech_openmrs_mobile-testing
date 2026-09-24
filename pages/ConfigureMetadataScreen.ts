/**
 * ConfigureMetadataScreen - adminui/metadata/configureMetaData.page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export class ConfigureMetadataScreen extends BaseScreen {
  public get heading() { return $('h1=Configure Metadata'); }

  async open(): Promise<void> {
    await this.goto('adminui/metadata/configureMetaData.page');
    await this.heading.waitForDisplayed({ timeout: 10_000 }).catch(() => undefined);
  }

  async isLoaded(): Promise<boolean> {
    return this.heading.isDisplayed().catch(() => false);
  }

  async sectionHeadings(): Promise<string[]> {
    const hs = await $$('main h1, main h2, main h3');
    const result: string[] = [];
    for (const h of hs) {
      const t = ((await h.getText()) ?? '').trim();
      if (t) result.push(t);
    }
    return result;
  }

  async managementLinkCount(): Promise<number> {
    const links = await $$('main a');
    return links.length;
  }
}
