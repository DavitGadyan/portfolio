import type { Metadata, Viewport } from 'next';
import { SITE_NAME, SITE_URL, TWITTER_HANDLE, withBasePath } from '@/lib/site';
import { ogLocale, otherLocale, type Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { localizePath } from '@/lib/locale-path';
import { site } from '@/data/site';

export const rootViewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function rootMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.meta.homeTitle, template: m.meta.titleTemplate },
    description: m.meta.homeDescription,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    manifest: withBasePath('/manifest.webmanifest'), // explicit metadata paths are not basePath-aware
    formatDetection: { telephone: false },
    icons: { icon: withBasePath('/icon.png'), apple: withBasePath('/apple-icon.png') },
  };
}

export interface PageMeta {
  locale: Locale;
  /** Locale-less path with trailing slash, e.g. '/portfolio/x/' */
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  published?: string;
  modified?: string;
  /** When true, the title is used verbatim (no template). */
  absoluteTitle?: boolean;
}

export function buildMetadata(o: PageMeta): Metadata {
  const m = getMessages(o.locale);
  const canonical = localizePath(o.path, o.locale);
  const image = o.image ?? site.shareCard[o.locale];
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: {
      canonical,
      languages: {
        en: localizePath(o.path, 'en'),
        es: localizePath(o.path, 'es'),
        'x-default': localizePath(o.path, 'en'),
      },
    },
    robots: o.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type: o.type ?? 'website',
      locale: ogLocale[o.locale],
      alternateLocale: [ogLocale[otherLocale(o.locale)]],
      url: canonical,
      siteName: SITE_NAME,
      title: o.title,
      description: o.description,
      images: [{ url: image, width: 1200, height: 630, alt: o.imageAlt ?? m.meta.ogAlt }],
      ...(o.type === 'article' ? { publishedTime: o.published, modifiedTime: o.modified, authors: [SITE_NAME] } : {}),
    },
    twitter: { card: 'summary_large_image', creator: TWITTER_HANDLE, title: o.title, description: o.description, images: [image] },
  };
}
