import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { homePath } from '@/lib/locale-path';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { ThankYouTracker } from '@/components/analytics/ThankYouTracker';

export function thankYouMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: '/thank-you/', title: m.meta.thankYouTitle, description: m.thankYou.body, noindex: true });
}

export function ThankYouPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <SiteFrame locale={locale}>
      <ThankYouTracker />
      <section className="section">
        <div className="container-dg">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="section-title section-title--center">{m.thankYou.title}</h1>
            <p className="lead mt-6">{m.thankYou.body}</p>
            <h2 className="eyebrow mt-10">{m.thankYou.stepsTitle}</h2>
            <ol className="mx-auto mt-4 max-w-xl space-y-3 text-left" role="list">
              {m.thankYou.steps.map((s, i) => (
                <li key={s} className="flex gap-3"><span className="capmap__num shrink-0" aria-hidden="true">{i + 1}</span><span className="pt-2">{s}</span></li>
              ))}
            </ol>
            <p className="mt-10"><Link href={homePath(locale)} className="btn btn-outline-dark">{m.thankYou.back}</Link></p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
