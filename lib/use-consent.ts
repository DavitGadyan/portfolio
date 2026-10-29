'use client';
import { useSyncExternalStore } from 'react';
import { CONSENT_EVENT, parse, readConsent, serialize, type ConsentState } from './consent';

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
}
// Snapshots must be primitives so React can compare them by value.
function getSnapshot(): string {
  const s = readConsent();
  return s ? serialize(s) : 'none';
}
function getServerSnapshot(): string {
  return 'ssr';
}

/** undefined = not mounted yet (server + hydration), null = no choice, object = chosen */
export function useConsent(): ConsentState | null | undefined {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (snap === 'ssr') return undefined;
  if (snap === 'none') return null;
  return parse(snap);
}
