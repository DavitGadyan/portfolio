import { hasAnalyticsConsent } from './consent';
import { GTM_ID } from './site';

export type EventParams = {
  hire_me_click: { link_text: string; link_url: string };
  linkedin_click: { link_url: string; link_text: string };
  cv_download: { file_name: string; link_text: string };
  outbound_click: { link_url: string; link_domain: string; link_text: string };
  book_call_click: { method: 'calendly' | 'link'; step?: 'open_widget' | 'time_selected' | 'scheduled'; link_text?: string };
  book_call_view: { method: 'calendly' };
  book_call_scheduled: { method: 'calendly' };
  contact_form: { status: 'success' | 'error'; language: string };
  generate_lead: {
    method: 'contact_form' | 'calendly_booking' | 'thank_you_page';
    form_destination: string;
    value: number;
    currency: 'USD';
    click_id?: string;
    ads_campaign?: string;
  };
  language_switch: { from: string; to: string };
  consent_update: { analytics: 'granted' | 'denied' };
};
export type EventName = keyof EventParams;

/** Events before consent are dropped, not queued (no pre-consent data is processed). */
export function track<N extends EventName>(name: N, params: EventParams[N]) {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (!GTM_ID) window.gtag?.('event', name, params); // with a container the dataLayer push is the trigger; gtag would count twice
  } catch {
    /* measurement must never break the page */
  }
}

// ---- Google Ads click ids (90 days), consent-gated --------------------------------------------
const CLICK_KEY = 'dg_click';
const CLICK_TTL = 90 * 864e5;
const CLICK_PARAMS = ['gclid', 'gbraid', 'wbraid'] as const;
export type StoredClick = { key: string; value: string; at: number; landing: string; campaign: string; source: string };

export function captureClickIds() {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  const qs = new URLSearchParams(location.search);
  const k = CLICK_PARAMS.find((p) => qs.get(p));
  if (!k) return;
  const rec: StoredClick = {
    key: k,
    value: qs.get(k) as string,
    at: Date.now(),
    landing: location.pathname,
    campaign: qs.get('utm_campaign') ?? '',
    source: qs.get('utm_source') ?? '',
  };
  try { localStorage.setItem(CLICK_KEY, JSON.stringify(rec)); } catch { /* ignore */ }
}

export function storedClick(): StoredClick | null {
  try {
    const c = JSON.parse(localStorage.getItem(CLICK_KEY) ?? 'null') as StoredClick | null;
    return c && Date.now() - c.at < CLICK_TTL ? c : null;
  } catch {
    return null;
  }
}

// ---- generate_lead, once per enquiry (10-minute window) -----------------------------------------
const LEAD_KEY = 'dg_lead_fired_at';
const LEAD_WINDOW = 10 * 60e3;
const ADS = {
  id: process.env.NEXT_PUBLIC_ADS_ID ?? '',
  lead: process.env.NEXT_PUBLIC_ADS_LABEL_LEAD ?? '',
  book: process.env.NEXT_PUBLIC_ADS_LABEL_BOOKING ?? '',
};

export function fireLead(method: EventParams['generate_lead']['method']) {
  try {
    const t = sessionStorage.getItem(LEAD_KEY);
    if (t && Date.now() - Number(t) < LEAD_WINDOW) return;
    sessionStorage.setItem(LEAD_KEY, String(Date.now()));
  } catch { /* ignore */ }
  const c = storedClick();
  track('generate_lead', {
    method,
    form_destination: method === 'calendly_booking' ? 'calendly' : 'formspree',
    value: 45,
    currency: 'USD',
    ...(c ? { click_id: c.key, ads_campaign: c.campaign } : {}),
  });
  adsConversion(method === 'calendly_booking' ? ADS.book || ADS.lead : ADS.lead, { value: 45, currency: 'USD' });
}

export function adsConversion(label: string, p: { value: number; currency: string }) {
  if (GTM_ID) return; // the container owns the Google Ads conversion tags (trigger them on the generate_lead event)
  if (!ADS.id || !label || !hasAnalyticsConsent()) return;
  const c = storedClick();
  window.gtag?.('event', 'conversion', { send_to: `${ADS.id}/${label}`, ...p, ...(c?.key === 'gclid' ? { gclid: c.value } : {}) });
}
