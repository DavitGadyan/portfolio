/** Site-wide constants. SITE_URL includes the basePath (interim github.io phase) so every absolute URL is correct. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://davidgadyan.com').replace(/\/+$/, '');
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const SITE_NAME = 'David Gadyan';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-VVQQRF2LWE'; // GA4 property "davidgadyan.com" (the old Hugo site keeps G-KYHRZEKV8R); used without a GTM container and for the ga-disable flag
/** Optional Google Tag Manager container (GTM-XXXXXXX). When set it replaces the direct gtag.js load: GA4, Google Ads and any other tag are configured inside the container, with the site's dataLayer events as triggers. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';
export const FORMSPREE_ID = 'xknkzpge';
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;
export const CALENDLY_URL = 'https://calendly.com/davidgadyan/15min';
export const CV_PATH = '/David_Gadyan_Resume4.pdf';
export const TWITTER_HANDLE = '@Dave18381384';

export const SOCIAL = {
  twitter: 'https://twitter.com/Dave18381384',
  github: 'https://github.com/DavitGadyan',
  linkedin: 'https://www.linkedin.com/in/davidgadyan/',
  upwork: 'https://www.upwork.com/freelancers/davidgadyan',
} as const;

/** Prefix a public-folder path with the basePath for raw <a>/<img>/fetch usage (next/link and next/image do it themselves). */
export function withBasePath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}

/** Absolute URL for a site path that does NOT include the basePath (e.g. '/es/portfolio/x/'). */
export function absUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
