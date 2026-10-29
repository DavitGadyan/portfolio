import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPolicyPage } from '@/lib/content/pages';
import { homePath } from '@/lib/locale-path';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { Markdown } from '@/components/content/Markdown';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';

type Slug = 'cookies' | 'privacy';

function fmtDate(d: string, locale: Locale) {
  return d ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T00:00:00Z`)) : '';
}

export function policyMetadata(locale: Locale, slug: Slug): Metadata {
  const m = getMessages(locale);
  const page = getPolicyPage(locale, slug);
  return buildMetadata({ locale, path: `/${slug}/`, title: page.title || (slug === 'cookies' ? m.meta.cookiesTitle : m.meta.privacyTitle), description: page.description || (slug === 'cookies' ? m.meta.cookiesDescription : m.meta.privacyDescription) });
}

export function PolicyPage({ locale, slug }: { locale: Locale; slug: Slug }) {
  const m = getMessages(locale);
  const page = getPolicyPage(locale, slug);
  return (
    <SiteFrame locale={locale}>
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: page.title }]} />
            <h1 className="mt-8 text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-ink-700">{page.title}</h1>
            {page.lastmod && <p className="mt-2 text-sm text-ink-400">{m.policy.updated}: <time dateTime={page.lastmod}>{fmtDate(page.lastmod, locale)}</time></p>}
            {slug === 'cookies' && <p className="mt-6"><CookieSettingsButton label={m.policy.changePreferences} className="btn btn-solid btn-sm" /></p>}
            <div className="prose-dg mt-8"><Markdown source={page.body} /></div>
            {slug === 'cookies' && <p className="mt-10"><CookieSettingsButton label={m.policy.changePreferences} className="btn btn-outline-dark btn-sm" /></p>}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
