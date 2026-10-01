# OpenMRS Mobile Test Suite

End-to-end mobile tests for **OpenMRS O2** (the same web app rendered in mobile browsers), driving **iPhone 17 Pro (iOS 26)** and **Samsung Galaxy S25 (Android 15)** through **WebdriverIO + Appium**.

## Stack

- **WebdriverIO 9** + **Appium 2** + **XCUITest** (iOS) + **UiAutomator2** (Android).
- **TypeScript 5** (strict, ESM).
- **Node 20+**.
- **Mocha** (BDD) for specs.
- **expect-webdriverio**.
- **Spec reporter** + **Allure reporter** (on failure: PNG screenshot to `allure-results/<name>.png`).
- **ts-node** for running TypeScript configs directly.

## Quick start

```bash
npm install
cp .env.example .env              # edit O2_BASE_URL if pointing at local Docker
npm run lint                      # tsc --noEmit, validates all TS
```

### iPhone 17 Pro (after Xcode install)

```bash
xcrun simctl boot "iPhone 17 Pro"
npx appium &
npm run test:ios
npx allure serve allure-results
```

### Samsung Galaxy S25 (after Android Studio install)

```bash
$ANDROID_HOME/emulator/emulator -avd Galaxy_S25_API_34 &
adb devices                       # note ANDROID_UDID
npx appium &
ANDROID_UDID=emulator-5554 npm run test:android
npx allure serve allure-results
```

Override the Appium endpoint:

```bash
APPIUM_HOST=... APPIUM_PORT=... IOS_UDID=... ANDROID_UDID=... npm run test:ios
```

## Project layout

```
.
├── wdio.shared.conf.ts             # Common WDIO config (timeouts, screenshot-on-failure)
├── wdio.android.conf.ts            # Galaxy S25 / UiAutomator2 / Chrome-mobile
├── wdio.ios.conf.ts                # iPhone 17 Pro / XCUITest / Safari-mobile
├── docker-compose.yml              # local OpenMRS + MySQL
├── scripts/wait-for-openmrs.sh     # polls until ready
│
├── config/                         # env reads (env.config.ts)
├── constants/                      # O2 UUIDs (location, encounter, identifier, concept)
├── types/                          # UI form types
├── data/testData.ts                # ValidAdmin + generatePatient()
│
├── utils/
│   ├── helpers.ts                  # waitForUrlMatches, politeDelay, retry, isBrokenPage
│   ├── mobile-actions.ts           # scrollIntoView, swipe, hideKeyboard, tap (WDIO)
│   ├── cloudflare.ts               # CF cookie injection
│   ├── logger.ts                   # tiny env-aware logger
│   └── data-generator.ts           # generatePatient(), randomGender()
│
├── pages/                          # 16 WDIO Screen Objects
│   ├── BaseScreen                  # abstract base with goto/waitForUrlMatches
│   ├── LoginScreen, HomeScreen, DashboardScreen
│   ├── FindPatientRecordScreen, FindPatientScreen
│   ├── RegisterPatientScreen (7-step wizard), PatientDashboardScreen
│   ├── CaptureVitalsScreen, ActiveVisitsScreen
│   ├── AppointmentSchedulingScreen, VisitScreen
│   ├── MergePatientsScreen, DataManagementScreen
│   └── SystemAdministrationScreen, ConfigureMetadataScreen, AdminScreen
│
└── tests/                          # 17 WDIO Mocha-BDD specs
    ├── login.spec.ts               (25 tests)
    ├── home-dashboard.spec.ts      (24)
    ├── dashboard.spec.ts           (8)
    ├── navigation.spec.ts          (9)
    ├── find-patient.spec.ts        (9)
    ├── find-patient-record.spec.ts (11)
    ├── register-patient.spec.ts    (34)
    ├── patient-dashboard.spec.ts   (8)
    ├── visit.spec.ts               (5)
    ├── capture-vitals.spec.ts      (8)
    ├── active-visits.spec.ts       (12)
    ├── appointment-scheduling.spec.ts (15)
    ├── merge-patients.spec.ts      (14)
    ├── data-management.spec.ts     (4)
    ├── admin.spec.ts               (10)
    ├── system-administration.spec.ts (19)
    └── configure-metadata.spec.ts  (39)
```

## Coverage

| Track | Tests | Files | Runner |
|---|---|---|---|
| WDIO mobile (iOS + Android) | ~254 | 17 | Appium (true emulators) |

## npm scripts

```bash
npm run test:android       # WDIO + Galaxy S25 / UiAutomator2
npm run test:ios           # WDIO + iPhone 17 Pro / XCUITest
npm run test:both          # both WDIO tracks sequentially
npm run test               # alias for test:both
npm run lint               # tsc --noEmit
npm run start:openmrs      # docker compose up + wait until ready
npm run stop:openmrs       # docker compose down
npm run logs:openmrs       # docker compose logs -f
npm run reset:openmrs      # destroy volume + fresh start
```

## Environment variables

See [`.env.example`](.env.example). The most important:

```env
O2_BASE_URL=https://o2.openmrs.org/openmrs      # public demo (default)
# O2_BASE_URL=http://localhost:8088/openmrs     # local Docker

O2_USERNAME=admin
O2_PASSWORD=Admin123
O2_LOCATION=Inpatient Ward

APPIUM_HOST=localhost
APPIUM_PORT=4723
IOS_DEVICE=iPhone 17 Pro
IOS_VERSION=26.0
ANDROID_DEVICE=Samsung Galaxy S25
ANDROID_OS=15

ACTION_DELAY_MS=150      # delay between WDIO actions
LOG_LEVEL=info

CF_CLEARANCE=            # copy from Chrome → DevTools → Application → Cookies
CF_BM=
```

## Demo credentials

```
URL:      http://localhost:8088/openmrs (Docker) or https://o2.openmrs.org/openmrs (public)
Username: admin
Password: Admin123
Location: Inpatient Ward
```

## Mobile-specific helpers

The O2 web app is a desktop UI forced into a 393×852 mobile viewport. Several desktop affordances break:

- **5-column tables** wrap or extend below the fold → use `scrollIntoView()` from `utils/mobile-actions.ts`.
- **Long forms** (registration wizard, 7 steps) extend below the fold → use `scrollIntoView()` + `swipe('up')`.
- **iOS Safari on-screen keyboard** covers submit buttons → call `hideKeyboard()` after text input.
- **Tap on `<li>` location picker** works on Android tap targets; the iOS Safari `select` shim sometimes needs `tap()`.

The helpers in `utils/mobile-actions.ts` wrap the Appium `mobile: scroll`, `mobile: swipe`, `mobile: hideKeyboard`, and `mobile: touchAndHold` commands.

## Cloudflare bypass

The public O2 demo is Cloudflare-fronted and returns a 403 challenge unless the browser presents a valid `cf_clearance` cookie. Copy the cookie value from your browser's DevTools into `CF_CLEARANCE` in `.env` and `utils/cloudflare.ts` will inject it for every WDIO page.

When unset, tests still run but may hit the 403 challenge — useful for verifying the cookie bypass actually works.

## Notes

- **Mobile web, not native app.** OpenMRS has no official iOS / Android native build, so both drivers load the same HTML the desktop serves.
- **Same selectors across platforms** — no `if (isAndroid)` branching.
- **No Xcode / Android Studio needed for `lint`.** Those are only required to actually execute the iOS / Android WDIO suites.
- **Failure screenshots** land in `allure-results/<name>.png`. View with `npx allure serve allure-results`.
