'use client';
import Script from 'next/script';
import { GA_ID, GTM_ID } from '@/lib/site';
import { useConsent } from '@/lib/use-consent';

/**
 * Google tags load only after the visitor accepts analytics cookies (Consent Mode defaults are set in the head script
 * before either loads). With a GTM container id the container is loaded and owns GA4, Google Ads and anything else,
 * triggered by the site's dataLayer events; without one, gtag.js is loaded with the GA4 id.
 */
export function Analytics() {
  const consent = useConsent();
  if (consent?.analytics !== 'granted') return null;
  if (GTM_ID) {
    return (
      <>
        <Script id="gtm-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        `}</Script>
        <Script src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="afterInteractive" />
      </>
    );
  }
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
