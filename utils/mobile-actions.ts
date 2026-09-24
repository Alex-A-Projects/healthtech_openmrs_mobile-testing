/**
 * Mobile-specific action helpers.
 *
 * The O2 web app is a desktop UI forced into a 393×852 mobile viewport,
 * which breaks several desktop affordances:
 *   - 5-column tables (Find Patient Record) extend below the fold
 *   - 7-step registration wizard scrolls below the fold
 *   - iOS Safari on-screen keyboard covers submit buttons
 *
 * These helpers wrap Appium `mobile:` commands so screen objects can
 * scroll, swipe, and hide the keyboard without re-implementing the
 * command payloads each time.
 */
import { browser, $ } from '@wdio/globals';
import { politeDelay } from './helpers';

/** Direction for swipes / scrolls. */
export type Direction = 'up' | 'down' | 'left' | 'right';

interface AppiumScrollOptions {
  strategy: 'mobile' | 'accessibility id' | 'id' | 'class name' | 'name' | 'xpath';
  selector: string;
}

interface AppiumSwipeOptions {
  direction: 'up' | 'down' | 'left' | 'right';
  duration?: number; // ms
}

/**
 * Scroll the page until the given selector is visible.
 * Uses the Appium `mobile: scroll` command supported by both XCUITest
 * and UiAutomator2 drivers. Loops up to N attempts with 800ms wait.
 */
export async function scrollIntoView(selector: string, maxAttempts = 5): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const el = await $(selector);
    if (await el.isDisplayed().catch(() => false)) {
      return;
    }
    try {
      await browser.execute('mobile: scroll', { strategy: '-android uiautomator', selector } satisfies Record<string, unknown> as unknown as AppiumScrollOptions);
    } catch {
      // ignore — fall back to a generic swipe-up
      await swipe('up', 400);
    }
    await politeDelay(400);
  }
}

/** Scroll the current page back to the top. */
export async function scrollToTop(maxAttempts = 5): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Appium supports a generic 'mobile: scroll' direction.
      await browser.execute('mobile: scroll', { direction: 'up' } satisfies Record<string, unknown> as unknown as AppiumSwipeOptions);
    } catch {
      // fall back to JS scroll
      await browser.execute(() => window.scrollTo(0, 0));
    }
    await politeDelay(150);
  }
}

/** Swipe the page in the given direction. */
export async function swipe(direction: Direction, durationMs = 800): Promise<void> {
  const duration = durationMs / 1000;
  try {
    await browser.execute('mobile: swipe', { direction, duration } satisfies Record<string, unknown> as unknown as AppiumSwipeOptions);
  } catch {
    // Some emulators don't support mobile: swipe; fall back to JS scroll
    const offset = direction === 'up' ? -300 : direction === 'down' ? 300 : 0;
    await browser.execute((y) => window.scrollBy(0, y as number), offset);
  }
  await politeDelay(200);
}

/** Wait until an element is clickable + displayed, then click. */
export async function tap(selector: string): Promise<void> {
  const el = await $(selector);
  await el.waitForDisplayed({ timeout: 10_000 });
  await el.waitForEnabled({ timeout: 5_000 });
  await el.click();
}

/**
 * Hide the on-screen keyboard. iOS Safari pops the keyboard over the
 * submit button after a text input, so tests that type into a field
 * should call this before clicking "Next"/"Submit".
 */
export async function hideKeyboard(): Promise<void> {
  try {
    await browser.execute('mobile: hideKeyboard', { strategy: 'pressKey', key: 'Done' } as Record<string, unknown>);
  } catch {
    try {
      await browser.keys(['Done', 'Return']);
    } catch {
      // ignore — keyboard may not be visible
    }
  }
}

/** Long-press an element for the given duration. */
export async function longPress(selector: string, durationMs = 1000): Promise<void> {
  const el = await $(selector);
  await el.waitForDisplayed({ timeout: 10_000 });
  try {
    await browser.execute('mobile: touchAndHold', { x: 0, y: 0, duration: durationMs / 1000 } as Record<string, unknown>);
  } catch {
    // Fallback: WDIO touchAction sequence (no `duration` option in v9 typings)
    await el.click();
    await browser.pause(durationMs);
  }
}

/** Detect whether the on-screen keyboard is currently shown. */
export async function isKeyboardShown(): Promise<boolean> {
  try {
    const result = await browser.execute('mobile: isKeyboardShown' as unknown as string);
    return Boolean(result);
  } catch {
    return false;
  }
}

/** Read the current device pixel ratio (test-only helper). */
export async function getPixelRatio(): Promise<number> {
  try {
    return await browser.execute(() => window.devicePixelRatio as number);
  } catch {
    return 1;
  }
}
