'use client';
import { useState } from 'react';

export function FacadeButton({ embedSrc, label, provider, children }: { embedSrc: string; label: string; provider: 'youtube' | 'loom'; children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  if (on) return <iframe src={embedSrc} title={label} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="eager" />;
  const origin = provider === 'youtube' ? 'https://www.youtube-nocookie.com' : 'https://www.loom.com';
  const preconnect = () => {
    if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;
    const l = document.createElement('link'); l.rel = 'preconnect'; l.href = origin; document.head.appendChild(l);
  };
  return (
    <button type="button" className="facade__btn" aria-label={label} onClick={() => setOn(true)} onPointerEnter={preconnect} onFocus={preconnect}>
      {children}
      <span className="facade__play" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </button>
  );
}
