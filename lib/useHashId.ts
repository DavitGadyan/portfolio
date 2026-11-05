import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); };
const read = () => (window.location.hash.startsWith('#c-') ? window.location.hash.slice(3) : '');
const none = () => '';

/** The card id in a `#c-<id>` URL fragment (the Materials search links to cards this way); '' on the server and until hydration, so the markup matches. */
export const useHashId = () => useSyncExternalStore(subscribe, read, none);
