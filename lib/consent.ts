import { GA_ID } from './site';

export type ConsentChoice = 'granted' | 'denied';
export type ConsentState = { version: number; analytics: ConsentChoice; ts: number };

export const CONSENT_VERSION = 1;
export const CONSENT_KEY = 'dg_consent';
export const CONSENT_EVENT = 'dg:consent';
export const CONSENT_OPEN_EVENT = 'dg:consent-open';
const MAX_AGE = 60 * 60 * 24 * 365; // 12 months
const RE = /^v(\d+)\.analytics=(granted|denied)\.ts=(\d+)$/;

export function serialize(s: ConsentState): string {
  return `v${s.version}.analytics=${s.analytics}.ts=${s.ts}`;
}

export function parse(raw: string | null | undefined): ConsentState | null {
  const m = raw ? RE.exec(raw) : null;
  if (!m) return null;
  const s: ConsentState = { version: Number(m[1]), analytics: m[2] as ConsentChoice, ts: Number(m[3]) };
  return s.version === CONSENT_VERSION ? s : null; // version bump => re-prompt
}

function readCookie(): string | null {
  const m = document.cookie.match(/(?:^|; )dg_consent=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}
function writeCookie(value: string) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}
function readLocal(): string | null {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
function writeLocal(v: string) {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* storage blocked */ }
}

/** Cookie first, localStorage second; whichever is found re-hydrates the other (Safari caps JS cookies at 7 days). */
export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const fromCookie = parse(readCookie());
  if (fromCookie) { writeLocal(serialize(fromCookie)); return fromCookie; }
  const fromLocal = parse(readLocal());
  if (fromLocal) { writeCookie(serialize(fromLocal)); return fromLocal; }
  return null;
}

export function writeConsent(choice: ConsentChoice): ConsentState {
  const s: ConsentState = { version: CONSENT_VERSION, analytics: choice, ts: Math.floor(Date.now() / 1000) };
  const v = serialize(s);
  writeCookie(v);
  writeLocal(v);
  return s;
}

export function clearConsent() {
  document.cookie = `${CONSENT_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* ignore */ }
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === 'granted';
}

/** Push the choice to Google Consent Mode, purge GA cookies on withdrawal, notify the app. */
export function applyConsent(choice: ConsentChoice) {
  const g = choice;
  window.gtag?.('consent', 'update', { analytics_storage: g, ad_storage: g, ad_user_data: g, ad_personalization: g });
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = choice !== 'granted';
  if (choice === 'denied') {
    purgeGaCookies();
    try { localStorage.removeItem('dg_click'); } catch { /* ignore */ }
  }
  window.dispatchEvent(new CustomEvent<ConsentState | null>(CONSENT_EVENT, { detail: readConsent() }));
}

function purgeGaCookies() {
  const host = location.hostname.replace(/^www\./, '');
  document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid')
    .forEach((n) => {
      for (const d of [`; Domain=.${host}`, '']) document.cookie = `${n}=; Path=/; Max-Age=0${d}`;
    });
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
