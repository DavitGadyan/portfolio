'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Img } from '@/components/ui/Img';
import { CertDialog, type CertInfo, type CertStrings } from './CertDialog';
import brain from '@/assets/images/my-logo.png';

export type BrainSkill = { id: string; src: string; label: string; scale?: number; cert?: CertInfo };
export type BrainNode = { id: string; order: number; title: string; short: string; line: string; skills: BrainSkill[] };
export type BrainStrings = { label: string; close: string; tools: string; certHint: string } & CertStrings;

/**
 * Skills map: the brain in the centre, one node per area of expertise on a ring around it. Clicking a node glides it
 * to the centre, grows it, and fans its tool logos out on a ring around it as plain crisp icons. Pure CSS positioning
 * and transitions (positions derive from the index, so server and client markup match): no physics, no per-frame
 * script, light on any laptop. Icons that carry a certificate are buttons that open it in the certificate card.
 */
export function SkillsBrain({ nodes, locale, t }: { nodes: BrainNode[]; locale: string; t: BrainStrings }) {
  const [open, setOpen] = useState<string | null>(null);
  const [cert, setCert] = useState<BrainSkill | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const active = open ? nodes.find((n) => n.id === open) : undefined;
  const N = nodes.length;

  useEffect(() => {
    if (!open || cert) return; // while the certificate is open, Escape belongs to the dialog
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, cert]);

  const angle = (i: number, count: number) => -Math.PI / 2 + (i / count) * Math.PI * 2;
  const icons = active?.skills ?? [];
  return (
    <div className="brain" data-open={open ?? undefined} data-many={icons.length > 11 ? '' : undefined} role="group" aria-label={t.label}>
      <span className="brain__ring" aria-hidden="true" />
      {nodes.map((n, i) => <span key={n.id} className="brain__spoke" aria-hidden="true" style={{ transform: `rotate(${((angle(i, N) * 180) / Math.PI).toFixed(2)}deg)`, '--i': i } as CSSProperties} />)}
      <span className="brain__orbit" aria-hidden="true"><span /></span>
      <span className="brain__orbit brain__orbit--2" aria-hidden="true"><span /></span>
      <div className="brain__core" aria-hidden="true">
        <Img src={brain} alt="" width={160} height={156} sizes="80px" className="brain__logo" loading="lazy" />
      </div>
      {nodes.map((n, i) => {
        const size = n.short.length > 9 ? 'lg' : n.short.length > 6 ? 'md' : 'sm';
        return (
          <button
            key={n.id} type="button" className={`brain__node brain__node--${size}`} data-id={n.id}
            style={{ '--cx': Math.cos(angle(i, N)).toFixed(4), '--cy': Math.sin(angle(i, N)).toFixed(4), '--i': i } as CSSProperties}
            aria-expanded={open === n.id} aria-label={open === n.id ? `${n.title}. ${t.close}` : n.title}
            onClick={() => setOpen((o) => (o === n.id ? null : n.id))}
          >
            <span className="brain__lbl" aria-hidden="true">{n.short}</span>
          </button>
        );
      })}
      {icons.map((k, j) => {
        const style = { '--sx': Math.cos(angle(j, icons.length)).toFixed(4), '--sy': Math.sin(angle(j, icons.length)).toFixed(4), '--a': `${((angle(j, icons.length) * 180) / Math.PI).toFixed(2)}deg`, '--i': j, '--k': k.scale ?? 1 } as CSSProperties;
        /* eslint-disable-next-line @next/next/no-img-element -- crisp brand marks mounted on demand; kept out of the optimizer on purpose */
        const img = <img src={k.src} alt="" width={48} height={48} decoding="async" draggable={false} />;
        const tip = <span className="brain__tip" aria-hidden="true">{k.label}</span>;
        return k.cert ? (
          <button
            key={k.id} type="button" className="brain__icon brain__icon--cert" aria-haspopup="dialog" aria-label={`${k.label}. ${t.certHint}`} title={k.label} style={style}
            onClick={(e) => { opener.current = e.currentTarget; setCert(k); }}
          >
            {img}{tip}
          </button>
        ) : (
          <span key={k.id} className="brain__icon" role="img" aria-label={k.label} title={k.label} style={style}>{img}{tip}</span>
        );
      })}
      <p className="brain__hint" aria-live="polite">
        {active && <><strong>{active.title}</strong> · {active.line} <span className="brain__names">{icons.map((k) => k.label).join(' · ')}</span></>}
      </p>
      {cert?.cert && <CertDialog cert={cert.cert} locale={locale} t={t} returnFocusTo={opener} onClosed={() => setCert(null)} />}
    </div>
  );
}
