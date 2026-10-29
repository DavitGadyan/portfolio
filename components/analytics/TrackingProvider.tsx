'use client';
import { useEffect } from 'react';
import { CONSENT_EVENT } from '@/lib/consent';
import { captureClickIds, fireLead, track, type EventName } from '@/lib/track';

/** One delegated click listener + Calendly message listener + click-id capture. Renders nothing. */
export function TrackingProvider() {
  useEffect(() => {
    captureClickIds();
    const onConsent = () => captureClickIds();
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest?.('a, button') as HTMLElement | null;
      if (!el) return;
      const href = el.getAttribute('href') ?? '';
      const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
      const named = el.dataset.track as EventName | undefined;
      if (named === 'book_call_click') { track('book_call_click', { method: 'link', link_text: text }); return; }
      if (named === 'language_switch') { track('language_switch', { from: el.dataset.trackFrom ?? '', to: el.dataset.trackTo ?? '' }); return; }
      if (named === 'hire_me_click' || /#contact$/.test(href)) { track('hire_me_click', { link_text: text, link_url: href }); return; }
      if (/linkedin\.com/i.test(href)) { track('linkedin_click', { link_url: href, link_text: text }); return; }
      if (/\.pdf($|\?)/i.test(href)) { track('cv_download', { file_name: href.split('/').pop() ?? href, link_text: text }); return; }
      if (/^https?:\/\//i.test(href) && !href.includes(location.hostname)) {
        let host = '';
        try { host = new URL(href).hostname; } catch { /* ignore */ }
        track('outbound_click', { link_url: href, link_domain: host, link_text: text });
      }
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      const ev = (e.data as { event?: unknown } | null)?.event;
      if (typeof ev !== 'string') return;
      switch (ev) {
        case 'calendly.event_type_viewed': track('book_call_view', { method: 'calendly' }); break;
        case 'calendly.date_and_time_selected': track('book_call_click', { method: 'calendly', step: 'time_selected' }); break;
        case 'calendly.event_scheduled':
          track('book_call_click', { method: 'calendly', step: 'scheduled' });
          track('book_call_scheduled', { method: 'calendly' });
          fireLead('calendly_booking');
          break;
      }
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMessage);
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMessage);
      window.removeEventListener(CONSENT_EVENT, onConsent);
    };
  }, []);
  return null;
}
