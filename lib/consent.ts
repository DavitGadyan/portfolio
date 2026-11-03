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
/**
 * davidgadyan.com and upwork.davidgadyan.com share one consent cookie, so a visitor who chose on either site is not
 * asked again on the other. Elsewhere (localhost, github.io) the cookie stays host-only.
 */
export function cookieDomain(hostname: string): string {
  const h = hostname.toLowerCase();
  return h === 'davidgadyan.com' || h.endsWith('.davidgadyan.com') ? '.davidgadyan.com' : '';
}
function writeCookie(value: string) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  const domain = cookieDomain(location.hostname);
  // drop an older host-only copy so it cannot shadow the shared one
  if (domain) document.cookie = `${CONSENT_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${domain ? `; Domain=${domain}` : ''}${secure}`;
}
function readLocal(): string | null {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
function writeLocal(v: string) {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* storage blocked */ }
}

/** The choice seen or made during this page load. Keeps a click working when the browser blocks cookies and storage. */
let memo: ConsentState | null = null;
/** Both stores are rewritten once per page load: the expiry slides (Safari caps script-written cookies at 7 days from the
 *  last write), a host-only cookie saved before the domain was shared moves onto the shared one, and a lost copy is restored. */
let refreshed = false;

/** Cookie first, localStorage second, then this page load's memory. */
export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const s = parse(readCookie()) ?? parse(readLocal()) ?? memo;
  if (!s) return null;
  memo = s;
  if (!refreshed) {
    refreshed = true;
    const v = serialize(s);
    writeCookie(v);
    writeLocal(v);
  }
  return s;
}

export function writeConsent(choice: ConsentChoice): ConsentState {
  const s: ConsentState = { version: CONSENT_VERSION, analytics: choice, ts: Math.floor(Date.now() / 1000) };
  const v = serialize(s);
  writeCookie(v);
  writeLocal(v);
  memo = s;
  refreshed = true;
  return s;
}

export function clearConsent() {
  memo = null;
  refreshed = false;
  document.cookie = `${CONSENT_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  const domain = cookieDomain(location.hostname);
  if (domain) document.cookie = `${CONSENT_KEY}=; Path=/; Max-Age=0; SameSite=Lax; Domain=${domain}`;
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
