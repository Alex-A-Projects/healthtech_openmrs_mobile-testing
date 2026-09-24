/**
 * wdio.android.conf.ts — runs the suite against a Samsung Galaxy S25
 * (or any recent Pixel / Galaxy running Android 15+) via UiAutomator2.
 *
 * Pre-requisites (not committed):
 *   - appium server reachable at http://localhost:4723
 *   - an Android emulator already booted (e.g. Galaxy S25 / API 35)
 *
 * Override the appium endpoint by setting APPIUM_HOST / APPIUM_PORT.
 */
import { env } from './config/env.config';
import { config as sharedConfig } from './wdio.shared.conf';

export const config = {
  ...sharedConfig,
  hostname: env.appium.host,
  port: env.appium.port,
  path: '/wd/hub',
  services: ['appium'],
  capabilities: [
    {
      //
      // ===================
      // Browser-side
      // ===================
      // We test O2's *mobile web* app (the same HTML rendered through
      // Chrome on the S25). To swap to a native app, change `browserName`
      // to 'Application' and provide an `app` capability.
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:browserName': 'Chrome',
      'appium:deviceName': env.device.android.deviceName,
      'appium:platformVersion': env.device.android.platformVersion,
      'appium:udid': env.device.android.udid,
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:ensureWebviewsHavePages': true,
      'appium:nativeWebScreenshot': true,
      //
      // Mobile-emulated viewport that matches the Galaxy S25
      // (393×852 CSS px ≈ ~6.2" diagonal at ~412dpi).
      'goog:chromeOptions': {
        args: [
          '--window-size=393,852',
          '--force-device-scale-factor=2.625',
        ],
        mobileEmulation: {
          deviceMetrics: {
            width: 393,
            height: 852,
            pixelRatio: 2.625,
            touch: true,
            mobile: true,
          },
          userAgent:
            'Mozilla/5.0 (Linux; Android 15; SM-S931) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
        },
      },
    },
  ],
};
