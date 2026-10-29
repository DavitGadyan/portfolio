import type { Localized } from '@/lib/content/types';
import type { LogoId } from './skillLogos';

export interface Certificate {
  /** File under public/certs/ (made by scripts/prepare-certs.mjs from assets/certs/). */
  file: string;
  title: Localized<string>;
  /** ISO dates as printed on the certificate. */
  issued: string;
  expires: string;
  id: string;
}

/** Google Skillshop certificates behind the Google Ads badges in the skills map. Every value is read off the certificate itself. */
export const certs: Partial<Record<LogoId, Certificate>> = {
  adsmeasure: { file: 'google-ads-measurement.webp', title: { en: 'Google Ads Measurement Certification', es: 'Certificación Google Ads Measurement' }, issued: '2026-09-01', expires: '2027-09-01', id: '192918352' },
  adsconv: { file: 'google-ads-conversion-optimization.webp', title: { en: 'Conversion Optimization Certification', es: 'Certificación Conversion Optimization' }, issued: '2026-09-01', expires: '2027-09-01', id: '192962724' },
  adsvideo: { file: 'google-ads-video.webp', title: { en: 'Google Ads Video Certification', es: 'Certificación Google Ads Video' }, issued: '2026-09-01', expires: '2027-09-01', id: '192956475' },
};
export const certSrc = (c: Certificate) => '/certs/' + c.file;
