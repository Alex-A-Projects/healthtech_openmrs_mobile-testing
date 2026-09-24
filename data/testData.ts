/**
 * Shared test data for the OpenMRS mobile suite.
 *
 * The O2 demo accepts the credentials below for both the public demo
 * and a local Docker instance. The mobile UI sends the same credentials
 * whether the test is running on iPhone 17 Pro (Safari) or Galaxy S25
 * (Chrome) — the DOM is identical.
 */
export const ValidAdmin = {
  username: 'admin',
  password: 'Admin123',
  location: 'Inpatient Ward',
} as const;

/** Alias for symmetry with the ParaBank mobile template. */
export const O2Admin = ValidAdmin;

/** Cross-location smoke-test data. */
export const O2Locations = [
  'Inpatient Ward',
  'Outpatient Clinic',
  'Pharmacy',
  'Laboratory',
  'Registration Desk',
] as const;

// Re-export generators for ergonomic spec-level imports.
export { generatePatient, randomGender, type GeneratedPatient } from '../utils/data-generator';
