import { GA_ID } from './site';

/**
 * Runs synchronously in <head>, before any Next chunk and before gtag.js.
 * ES5 only, dependency-free. Mirrors the read logic in lib/consent.ts.
 */
export const CONSENT_HEAD_SCRIPT = `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  if (!window.gtag) window.gtag = gtag;
  gtag('consent','default',{
    ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
    analytics_storage:'denied', functionality_storage:'granted', security_storage:'granted',
    wait_for_update: 500
  });
  var v = null;
  var m = document.cookie.match(/(?:^|; )dg_consent=([^;]*)/);
  if (m) v = decodeURIComponent(m[1]);
  if (!v) { try { v = window.localStorage.getItem('dg_consent'); } catch (e) {} }
  var ok = v && /^v1\\.analytics=(granted|denied)\\.ts=\\d+$/.test(v);
  if (ok) {
    var g = v.indexOf('analytics=granted') !== -1 ? 'granted' : 'denied';
    gtag('consent','update',{ analytics_storage:g, ad_storage:g, ad_user_data:g, ad_personalization:g });
    window['ga-disable-${GA_ID}'] = (g !== 'granted');
  }
})();`;
