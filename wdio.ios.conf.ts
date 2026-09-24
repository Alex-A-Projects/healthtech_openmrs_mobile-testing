/**
 * wdio.ios.conf.ts — runs the suite against iPhone 17 Pro on iOS 26
 * via XCUITest (Safari).
 *
 * Pre-requisites (not committed):
 *   - appium server reachable at http://localhost:4723
 *   - Xcode + an iPhone 17 simulator already booted
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
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:browserName': 'Safari',
      'appium:deviceName': env.device.ios.deviceName,
      'appium:platformVersion': env.device.ios.platformVersion,
      'appium:udid': env.device.ios.udid,
      'appium:newCommandTimeout': 240,
      'appium:autoWebview': true,
      'appium:ensureWebviewsHavePages': true,
      'appium:nativeWebScreenshot': true,
      'appium:processArguments': {
        args: [
          '-AppleLanguages',
          '(en-US)',
          '-AppleLocale',
          'en_US',
        ],
      },
      // Safari-mobile user agent for the iPhone 17 Pro.
      'safari:deviceUserAgent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 ' +
        'Mobile/23A350 Safari/604.1',
    },
  ],
};
