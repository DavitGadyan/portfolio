import { describe, expect, it } from 'vitest';
import { parse, serialize, CONSENT_VERSION } from '@/lib/consent';

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
