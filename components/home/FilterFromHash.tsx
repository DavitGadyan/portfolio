'use client';
import { useEffect } from 'react';

/** Lets links such as /portfolio/#f-security-compliance arrive with that capability filter already selected. */
export function FilterFromHash() {
  useEffect(() => {
    const apply = () => {
      const m = /^#(f-[a-z0-9-]+)$/.exec(window.location.hash);
      if (!m) return;
      const el = document.getElementById(m[1]);
      if (el instanceof HTMLInputElement && el.type === 'radio') el.checked = true;
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  return null;
}
