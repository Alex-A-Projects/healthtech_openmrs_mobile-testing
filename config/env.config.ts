import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized access to every environment variable used by the suite.
 *
 * Keeping reads here means tests don't sprinkle process.env references
 * everywhere and makes it easy to fall back to sane defaults.
 */
export const env = {
  // UI / O2 demo
  o2: {
    baseUrl: process.env.O2_BASE_URL ?? 'https://o2.openmrs.org/openmrs',
    username: process.env.O2_USERNAME ?? 'admin',
    password: process.env.O2_PASSWORD ?? 'Admin123',
    location: process.env.O2_LOCATION ?? 'Inpatient Ward',
  },

  // Appium / device overrides (WDIO track only)
  appium: {
    host: process.env.APPIUM_HOST ?? 'localhost',
    port: Number(process.env.APPIUM_PORT ?? 4723),
  },

  device: {
    ios: {
      deviceName: process.env.IOS_DEVICE ?? 'iPhone 17 Pro',
      platformVersion: process.env.IOS_VERSION ?? '26.0',
      udid: process.env.IOS_UDID,
    },
    android: {
      deviceName: process.env.ANDROID_DEVICE ?? 'Samsung Galaxy S25',
      platformVersion: process.env.ANDROID_OS ?? '15',
      udid: process.env.ANDROID_UDID,
    },
  },

  // Tuning
  actionDelayMs: Number(process.env.ACTION_DELAY_MS ?? 150),
  logLevel: process.env.LOG_LEVEL ?? 'info',

  // Cloudflare bypass (copy cf_clearance cookie from your browser).
  // Open o2.openmrs.org in Chrome → DevTools → Application → Cookies →
  // copy the `cf_clearance` value into this env var. Valid ~24h.
  cfClearance: process.env.CF_CLEARANCE ?? '',
  cfBm: process.env.CF_BM ?? '',
} as const;
