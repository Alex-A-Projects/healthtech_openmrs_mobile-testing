/**
 * Lightweight UI-facing types used by Screen Objects.
 *
 * The mobile suite is UI-only, so this file intentionally stays small.
 * Form payloads describe what tests type into the O2 mobile UI.
 */

export interface UiLocationOption {
  uuid: string;
  display: string;
}

export interface UiAppTile {
  name: string;
  urlPattern: RegExp;
}

export interface UiTableHeader {
  index: number;
  text: string;
}

export interface UiNavItem {
  label: string;
  href?: string;
  urlPattern?: RegExp;
}
