'use client';
import Script from 'next/script';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { CALENDLY_URL } from '@/lib/site';
import { track } from '@/lib/track';
import { SectionTitle } from '@/components/ui/SectionTitle';

export interface BookStrings { heading: string; intro: string; cardTitle: string; cardMeta: string; cta: string; openInNewTab: string; thirdPartyNote: string; loading: string }

const HEIGHT = 660;

/**
 * Click-to-load Calendly. Nothing from calendly.com is requested until the visitor presses the button.
 * Calendly's widget.js auto-initialises every `.calendly-inline-widget[data-url]` the moment it runs (and throws if
 * the attribute is missing), so the box carries `data-url`; `init` is only a fallback for a script that was already
 * loaded by an earlier mount.
 */
export function BookCall({ t, embedDomain }: { t: BookStrings; embedDomain: string }) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const embedUrl = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&embed_domain=${encodeURIComponent(embedDomain)}&embed_type=Inline`;

  const init = () => {
    if (box.current && window.Calendly && !box.current.querySelector('iframe')) {
      window.Calendly.initInlineWidget({ url: embedUrl, parentElement: box.current });
    }
  };

  useEffect(() => {
    if (!loaded) return;
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      const d = e.data as { event?: string; payload?: { height?: number | string } } | null;
      if (typeof d?.event !== 'string' || !d.event.startsWith('calendly.')) return;
      setReady(true);
      if (d.event !== 'calendly.page_height' || !box.current) return;
      const px = parseInt(String(d.payload?.height ?? ''), 10);
      if (px >= 300) { box.current.style.setProperty('--cal-inner', `${Math.max(px + 16, HEIGHT)}px`); box.current.scrollTop = 0; }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [loaded]);

  return (
    <section id="book" className="section bg-paper-100" aria-labelledby="book-title">
      <div className="container-dg">
        <div className="mx-auto max-w-3xl text-center">
          <SectionTitle id="book-title" align="center" reveal>{t.heading}</SectionTitle>
          <p className="mt-6 text-[1.02rem] leading-relaxed">{t.intro}</p>
        </div>
        <div className="mx-auto mt-10 max-w-[640px]">
          <div className="calbox border border-ink-200 bg-white shadow-sm">
            {!loaded ? (
              <div className="px-6 py-14 text-center" data-testid="book-placeholder">
                <button type="button" className="btn btn-solid" onClick={() => { setLoaded(true); track('book_call_click', { method: 'calendly', step: 'open_widget' }); }}>{t.cta}</button>
              </div>
            ) : (
              <>
                <div
                  ref={box}
                  className="calendly-inline-widget relative overflow-y-auto bg-white"
                  data-url={embedUrl}
                  data-ready={ready ? '' : undefined}
                  style={{ height: HEIGHT, '--cal-inner': `${HEIGHT}px` } as CSSProperties}
                  aria-busy={!ready}
                >
                  <p className="calbox__loading">{t.loading}</p>
                </div>
                <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={init} />
              </>
            )}
          </div>
          <noscript><a className="btn btn-solid mt-4" href={CALENDLY_URL}>{t.cta}</a></noscript>
        </div>
      </div>
    </section>
  );
}
