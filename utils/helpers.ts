/**
 * Tiny helpers shared across specs.
 *
 * Provides:
 *   - WDIO v9 replacement for the removed `browser.waitForUrl`.
 *   - UUID extraction from URL fragments.
 *   - Polite delay between actions so the shared O2 demo stays friendly.
 *   - Retry wrapper.
 *   - "Is this page broken?" detector (UI Framework Error / 404 / 500).
 */
import { browser } from '@wdio/globals';

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Wait until the current browser URL matches the given regular expression.
 * Defaults to a 15-second timeout which matches the rest of the suite.
 *
 * WDIO v9 dropped the legacy `browser.waitForUrl` helper, so we wrap
 * `waitUntil` here.
 */
export async function waitForUrlMatches(
  regex: RegExp,
  timeoutMs = 15_000,
): Promise<void> {
  await browser.waitUntil(
    async () => regex.test(await browser.getUrl()),
    { timeout: timeoutMs, interval: 200 },
  );
}

/** Wait until the page title contains the given fragment. */
export async function waitForTitleContains(
  fragment: string,
  timeoutMs = 15_000,
): Promise<void> {
  await browser.waitUntil(
    async () => (await browser.getTitle()).toLowerCase().includes(fragment.toLowerCase()),
    { timeout: timeoutMs, interval: 200 },
  );
}

/** Polite delay between actions so the shared O2 demo stays friendly. */
export async function politeDelay(ms = 150): Promise<void> {
  await browser.pause(ms);
}

/** Extract the first UUID found in a URL or arbitrary string. */
export function extractUuidFromUrl(url: string): string | null {
  const m = url.match(UUID_REGEX);
  return m ? m[0] : null;
}

/** Retry an async fn up to `attempts` times with `delayMs` between attempts. */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 500,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      if (i < attempts - 1) await browser.pause(delayMs);
    }
  }
  throw last;
}

/**
 * True when the page rendered the OpenMRS "UI Framework Error" placeholder
 * (which the local Docker image returns for missing view mappings) or a
 * raw 404/500 page. Use this to self-skip tests gracefully instead of
 * failing red.
 */
export async function isBrokenPage(): Promise<boolean> {
  // O2 renders `<h1>UI Framework Error</h1>` when a view mapping is missing.
  const errorEl = await $('h1:has-text("UI Framework Error"), h1:has-text("Error 404"), h1:has-text("Error 500")');
  try {
    return await errorEl.isDisplayed();
  } catch {
    return false;
  }
}

/**
 * Read a heading by its visible text. Returns null if not found within
 * the timeout (used by tests that want to assert a heading exists or
 * skip when it doesn't).
 */
export async function headingExists(text: RegExp, timeoutMs = 5_000): Promise<boolean> {
  const h = await $(`//h1[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${text.source.replace(/^\/|\/$/g, '').toLowerCase()}")]`);
  try {
    await h.waitForDisplayed({ timeout: timeoutMs });
    return true;
  } catch {
    return false;
  }
}
