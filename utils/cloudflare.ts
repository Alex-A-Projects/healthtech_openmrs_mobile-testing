/**
 * Cloudflare bypass cookie injection helpers.
 *
 * The public O2 demo (o2.openmrs.org) is Cloudflare-fronted and returns
 * a 403 challenge unless the browser presents a valid `cf_clearance`
 * cookie. Copy the cookie value from your browser's DevTools into
 * `CF_CLEARANCE` in `.env` and these helpers will inject it for every
 * WDIO test page and Playwright fixture.
 */
import { env } from '../config/env.config';

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path?: string;
}

/** True when at least one CF bypass cookie is set. */
export function hasCloudflareBypass(): boolean {
  return Boolean(env.cfClearance || env.cfBm);
}

/** Build the cookie payloads for the given hostname. */
export function cloudflareCookies(hostname: string): Cookie[] {
  const cookies: Cookie[] = [];
  if (env.cfClearance) {
    cookies.push({ name: 'cf_clearance', value: env.cfClearance, domain: hostname, path: '/' });
  }
  if (env.cfBm) {
    cookies.push({ name: '__cf_bm', value: env.cfBm, domain: hostname, path: '/' });
  }
  return cookies;
}

/** Build a Cookie header string for HTTP requests. */
export function cfCookieHeader(hostname: string): string {
  return cloudflareCookies(hostname)
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

/**
 * Playwright beforeEach equivalent. Takes a Playwright test module so
 * it can register a global beforeEach that injects CF cookies.
 *
 * Typed loosely because Playwright's `TestType` is too complex to
 * reproduce here — the actual beforeEach fn receives a context object
 * with `addCookies()`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectCloudflareCookieOnEveryPage(test: any): void {
  if (!hasCloudflareBypass()) return;
  test.beforeEach(async ({ context }: { context: { addCookies?: (cookies: unknown[]) => Promise<void> } }) => {
    const host = new URL(env.o2.baseUrl).hostname;
    const cookies = cloudflareCookies(host);
    if (cookies.length > 0 && context.addCookies) {
      await context.addCookies(cookies as unknown[]);
    }
  });
}
