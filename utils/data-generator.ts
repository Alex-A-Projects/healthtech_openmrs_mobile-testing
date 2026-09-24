/**
 * Data generators used by Screen Objects and WDIO specs.
 *
 * Generates timestamped unique patient / user payloads so the suite
 * can run repeatedly without collisions.
 */
import { GENDERS, type Gender } from '../constants';

export interface GeneratedPatient {
  givenName: string;
  middleName?: string;
  familyName: string;
  gender: Gender;
  birthdate: string; // YYYY-MM-DD
  birthdateEstimated?: boolean;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
}

/** Pick a random element from a readonly array. */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

/** Random integer between min and max inclusive. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** YYYY-MM-DD birthdate for a person aged between minAge and maxAge. */
function birthdateForAge(minAge: number, maxAge: number): string {
  const now = new Date();
  const earliest = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
  const latest = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
  const span = latest.getTime() - earliest.getTime();
  const random = new Date(earliest.getTime() + Math.random() * span);
  const yyyy = random.getFullYear();
  const mm = String(random.getMonth() + 1).padStart(2, '0');
  const dd = String(random.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Generate a fresh patient payload using timestamped unique names. */
export function generatePatient(overrides: Partial<GeneratedPatient> = {}): GeneratedPatient {
  const ts = Date.now().toString(36);
  const base: GeneratedPatient = {
    givenName: `Auto${ts.slice(-4)}`,
    middleName: 'QA',
    familyName: `Tester${ts}`,
    gender: pick(GENDERS),
    birthdate: birthdateForAge(20, 60),
    address1: '123 Automation Lane',
    city: 'Testville',
    state: 'CA',
    country: 'USA',
    postalCode: '94000',
    phone: `5551${randInt(100000, 999999)}`,
    ...overrides,
  };
  return base;
}

/** Pick a random gender. */
export function randomGender(): Gender {
  return pick(GENDERS);
}
