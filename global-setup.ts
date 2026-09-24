/**
 * Playwright global setup: probes the O2 demo before the suite starts.
 *
 * Set SKIP_GLOBAL_SETUP=true to skip this probe (faster local runs;
 * less-clean failures when O2 is down).
 *
 * WDIO configs do not consume this file directly — WDIO uses the
 * `connectionRetry*` settings in `wdio.shared.conf.ts` instead.
 */
import { request } from '@playwright/test';
import { env } from './config/env.config';
import { logger } from './utils/logger';

export default async function globalSetup(): Promise<void> {
  if (process.env.SKIP_GLOBAL_SETUP === 'true') {
    logger.info('SKIP_GLOBAL_SETUP=true — skipping O2 health probe');
    return;
  }

  const ctx = await request.newContext({
    baseURL: env.o2.baseUrl,
    extraHTTPHeaders: { Accept: 'application/json' },
  });

  try {
    const resp = await ctx.get('/ws/rest/v1/session', {
      headers: { Authorization: 'Basic ' + Buffer.from(`${env.o2.username}:${env.o2.password}`).toString('base64') },
      timeout: 30_000,
    });
    if (resp.ok()) {
      logger.info(`O2 health probe OK (${resp.status()}) at ${env.o2.baseUrl}`);
    } else if (resp.status() === 403) {
      logger.warn(`O2 health probe returned 403 — likely Cloudflare. Set CF_CLEARANCE in .env to bypass.`);
    } else {
      logger.warn(`O2 health probe returned ${resp.status()} — suite will continue but tests may skip.`);
    }
  } catch (err) {
    logger.warn(`O2 health probe failed: ${(err as Error).message} — suite will continue.`);
  } finally {
    await ctx.dispose();
  }
}
