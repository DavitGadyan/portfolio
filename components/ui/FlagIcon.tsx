import type { Locale } from '@/lib/i18n/config';

export type FlagCode = Locale | 'ru';

/** Round flag glyphs (UK for English, Spain for Spanish, Russia). Decorative only. */
export function FlagIcon({ locale, code, size = 16, className = '' }: { locale?: Locale; code?: FlagCode; size?: number; className?: string }) {
  const which: FlagCode = code ?? locale ?? 'en';
  const common = { width: size, height: size, viewBox: '0 0 32 32', 'aria-hidden': true as const, focusable: false as const,
    className, style: { borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto' } };
  if (which === 'es') {
    return (
      <svg {...common}>
        <rect width="32" height="32" fill="#AA151B" />
        <rect y="8" width="32" height="16" fill="#F1BF00" />
      </svg>
    );
  }
  if (which === 'ru') {
    return (
      <svg {...common}>
        <rect width="32" height="32" fill="#fff" />
        <rect y="10.67" width="32" height="10.67" fill="#0039A6" />
        <rect y="21.33" width="32" height="10.67" fill="#D52B1E" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect width="32" height="32" fill="#012169" />
      <path d="M0 0L32 32M32 0L0 32" stroke="#fff" strokeWidth="6" />
      <path d="M0 0L32 32M32 0L0 32" stroke="#C8102E" strokeWidth="2.2" />
      <path d="M16 0V32M0 16H32" stroke="#fff" strokeWidth="9" />
      <path d="M16 0V32M0 16H32" stroke="#C8102E" strokeWidth="5" />
    </svg>
  );
}
