import type { ReactNode } from 'react';
import '@/app/globals.css';
import { rubik } from '@/lib/fonts';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { pagePath } from '@/lib/locale-path';
import { CONSENT_HEAD_SCRIPT } from '@/lib/consent-head-script';
import { CookieBanner } from '@/components/consent/CookieBanner';
import { Analytics } from '@/components/analytics/Analytics';
import { TrackingProvider } from '@/components/analytics/TrackingProvider';

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const m = getMessages(locale);
  return (
    <html lang={locale} className={rubik.variable} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout may render <head> for the inline consent script */}
      <head>
        <script id="dg-consent-default" dangerouslySetInnerHTML={{ __html: CONSENT_HEAD_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">{m.nav.skipToContent}</a>
        <CookieBanner policyHref={pagePath(locale, '/cookies/')} t={m.consent} />
        {children}
        <Analytics />
        <TrackingProvider />
      </body>
    </html>
  );
}
