'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { applyConsent, CONSENT_OPEN_EVENT, writeConsent, type ConsentChoice } from '@/lib/consent';
import { useConsent } from '@/lib/use-consent';
import { track } from '@/lib/track';

export interface ConsentStrings { title: string; body: string; policyLink: string; acceptAll: string; essentialOnly: string; currentGranted: string; currentDenied: string }

export function CookieBanner({ policyHref, t }: { policyHref: string; t: ConsentStrings }) {
  const consent = useConsent();           // undefined until mounted → nothing renders on the server
  const [forced, setForced] = useState(false); // re-opened from "Manage cookies"
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = consent !== undefined && (consent === null || forced);

  useEffect(() => {
    const reopen = () => { opener.current = document.activeElement as HTMLElement | null; setForced(true); };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return;
    const set = () => document.documentElement.style.setProperty('--cc-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    if (opener.current) el.querySelector<HTMLButtonElement>('button')?.focus();
    return () => { ro.disconnect(); document.documentElement.style.removeProperty('--cc-h'); };
  }, [open]);

  function choose(c: ConsentChoice) {
    writeConsent(c);
    applyConsent(c); // dispatches dg:consent → useConsent updates
    setForced(false);
    track('consent_update', { analytics: c });
    opener.current?.focus();
    opener.current = null;
  }

  if (!open) return null;
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
