'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { applyConsent, CONSENT_OPEN_EVENT, writeConsent, type ConsentChoice } from '@/lib/consent';
import { useConsent } from '@/lib/use-consent';
import { track } from '@/lib/track';

export interface ConsentStrings { title: string; body: string; policyLink: string; acceptAll: string; essentialOnly: string; currentGranted: string; currentDenied: string; pill: string }

/** Page of this tab's session on which the full banner was first shown; later pages get the pill instead of the bar. */
const SEEN_KEY = 'dg_cc_seen';
const noSubscribe = () => () => {};
function readSeen(): string {
  try { return sessionStorage.getItem(SEEN_KEY) ?? ''; } catch { return ''; }
}

export function CookieBanner({ policyHref, t }: { policyHref: string; t: ConsentStrings }) {
  const consent = useConsent();           // undefined until mounted → nothing renders on the server
  const pathname = usePathname();
  const seenOn = useSyncExternalStore(noSubscribe, readSeen, () => '');
  const [forced, setForced] = useState(false); // re-opened from "Manage cookies" or the pill
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = consent !== undefined && (consent === null || forced);
  const collapsed = open && !forced && seenOn !== '' && seenOn !== pathname;

  useEffect(() => {
    const reopen = () => { opener.current = document.activeElement as HTMLElement | null; setForced(true); };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open || collapsed) return;
    try { sessionStorage.setItem(SEEN_KEY, pathname); } catch { /* storage blocked: the bar shows again on the next page */ }
  }, [open, collapsed, pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!open || collapsed || !el) return;
    const set = () => document.documentElement.style.setProperty('--cc-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    if (opener.current) el.querySelector<HTMLButtonElement>('button')?.focus();
    return () => { ro.disconnect(); document.documentElement.style.removeProperty('--cc-h'); };
  }, [open, collapsed]);

  function choose(c: ConsentChoice) {
    writeConsent(c);
    applyConsent(c); // dispatches dg:consent → useConsent updates
    setForced(false);
    track('consent_update', { analytics: c });
    opener.current?.focus();
    opener.current = null;
  }

  if (!open) return null;
  if (collapsed) {
    return (
      <button type="button" className="cc cc--pill" data-testid="cookie-pill" aria-haspopup="dialog" onClick={() => { opener.current = document.activeElement as HTMLElement | null; setForced(true); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" /><circle cx="8.5" cy="10.5" r="1" /><circle cx="12" cy="15.5" r="1" /><circle cx="16" cy="12.5" r="1" /></svg>
        {t.pill}
      </button>
    );
  }
  return (
    <div ref={ref} role="dialog" aria-modal="false" aria-live="polite" aria-labelledby="cc-title" aria-describedby="cc-desc" className="cc" data-testid="cookie-banner">
      <div>
        <h2 id="cc-title" className="cc__title">{t.title}</h2>
        <p id="cc-desc" className="cc__body m-0">
          {t.body} <Link href={policyHref} className="cc__link">{t.policyLink}</Link>
          {consent && <> · <span>{consent.analytics === 'granted' ? t.currentGranted : t.currentDenied}</span></>}
        </p>
      </div>
      <div className="cc__actions">
        <button type="button" className="cc__btn" onClick={() => choose('granted')}>{t.acceptAll}</button>
        <button type="button" className="cc__btn" onClick={() => choose('denied')}>{t.essentialOnly}</button>
      </div>
    </div>
  );
}
