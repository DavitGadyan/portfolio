'use client';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GA_ID, GTM_ID, withBasePath } from '@/lib/site';
import { pageType } from '@/lib/page-type';
import { useConsent } from '@/lib/use-consent';

/**
 * Google tags load only after the visitor accepts analytics cookies (Consent Mode defaults are set in the head script
 * before either loads). With a GTM container id the container is loaded and owns GA4, Google Ads and anything else,
 * triggered by the site's dataLayer events; without one, gtag.js is loaded with the GA4 id.
 *
 * Pages are tracked individually: the first page_view comes from the tag itself, and because next/link switches pages
 * without reloading, every later route change sends its own page_view with the new title, path and content group
 * (home, portfolio, project, blog, post, page). Turn off "page changes based on browser history events" in the GA4
 * stream's enhanced measurement so those are not counted twice.
 */
export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();
  const granted = consent?.analytics === 'granted';
  const last = useRef<string | null>(null);
  const lastTitle = useRef('');

  useEffect(() => {
    if (!granted) return;
    if (last.current === null) { last.current = pathname; lastTitle.current = document.title; return; } // this view is reported by gtag('config') / the container
    if (last.current === pathname) return;
    last.current = pathname;
    const previous = lastTitle.current;
    let tries = 0;
    let t = 0;
    const send = () => {
      const title = document.title;
      // the new page's <title> is committed shortly after the route change; until then it is empty (between the old
      // and the new element) or still the old one, so wait for it, up to ~3 s, rather than report a blank title
      if ((title === '' || title === previous) && tries++ < 12) { t = window.setTimeout(send, 250); return; }
      lastTitle.current = title;
      const params = {
        page_title: title, page_location: location.href, page_path: withBasePath(pathname),
        content_group: pageType(pathname), language: document.documentElement.lang,
      };
      window.dataLayer = window.dataLayer || [];
      if (GTM_ID) window.dataLayer.push({ event: 'virtual_page_view', ...params });
      else window.gtag?.('event', 'page_view', params);
    };
    t = window.setTimeout(send, 250);
    return () => clearTimeout(t);
  }, [pathname, granted]);

  if (!granted) return null;
  const group = pageType(pathname);
  if (GTM_ID) {
    return (
      <>
        <Script id="gtm-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ content_group: '${group}', language: document.documentElement.lang });
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
        gtag('config', '${GA_ID}', { content_group: '${group}', language: document.documentElement.lang });
      `}</Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
