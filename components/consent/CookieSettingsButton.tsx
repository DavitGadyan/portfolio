'use client';
import { openConsentSettings } from '@/lib/consent';

export function CookieSettingsButton({ label, className = '' }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>{label}</button>
  );
}
