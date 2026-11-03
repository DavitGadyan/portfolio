import { describe, expect, it } from 'vitest';
import { cookieDomain, parse, serialize, CONSENT_VERSION } from '@/lib/consent';

describe('consent serialisation', () => {
  it('round-trips', () => {
    const s = { version: CONSENT_VERSION, analytics: 'granted' as const, ts: 1700000000 };
    expect(parse(serialize(s))).toEqual(s);
  });
  it('rejects other versions and garbage', () => {
    expect(parse(`v${CONSENT_VERSION + 1}.analytics=granted.ts=1`)).toBeNull();
    expect(parse('nonsense')).toBeNull();
    expect(parse(null)).toBeNull();
  });
});

describe('consent cookie domain', () => {
  it('is shared by davidgadyan.com and its subdomains only', () => {
    expect(cookieDomain('davidgadyan.com')).toBe('.davidgadyan.com');
    expect(cookieDomain('upwork.davidgadyan.com')).toBe('.davidgadyan.com');
    expect(cookieDomain('www.davidgadyan.com')).toBe('.davidgadyan.com');
    expect(cookieDomain('notdavidgadyan.com')).toBe('');
    expect(cookieDomain('davitgadyan.github.io')).toBe('');
    expect(cookieDomain('localhost')).toBe('');
  });
});
