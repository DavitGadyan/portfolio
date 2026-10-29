'use client';
import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { X } from 'lucide-react';

export type CertInfo = { src: string; title: string; issued: string; expires: string; id: string };
export type CertStrings = { closeCert: string; issued: string; validUntil: string; certId: string };

const AUTO_CLOSE_MS = 3500; // "3-4 seconds and then back"; the countdown pauses while the pointer is on the card
const TILT_DEG = 28; // full swing edge to edge (±14°), like the Framer card
const CLOSE_FALLBACK_MS = 320;

type St = { t: number; closing: boolean; reduced: boolean; rect: DOMRect | null };
type Latest = { onClosed: () => void; returnFocusTo: RefObject<HTMLElement | null> };

/** Fade the dialog out, then close it, unlock the page, hand focus back to the badge and let the parent unmount. */
function closeDialog(d: HTMLDialogElement, s: St, latest: RefObject<Latest>) {
  if (s.closing) return;
  s.closing = true;
  clearTimeout(s.t);
  const finish = () => {
    if (d.open) d.close();
    document.body.style.overflow = '';
    latest.current.returnFocusTo.current?.focus();
    latest.current.onClosed();
  };
  d.removeAttribute('data-state');
  if (s.reduced) finish();
  else {
    const fb = window.setTimeout(finish, CLOSE_FALLBACK_MS);
    d.addEventListener('transitionend', () => { clearTimeout(fb); finish(); }, { once: true });
  }
}

function fmtDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Certificate card: a native modal dialog (page blurred behind) holding the certificate on a card that tilts in 3D
 * with the pointer. Mounted only while open, so the image loads on demand. Closes by itself after AUTO_CLOSE_MS, on
 * Escape, on the close button or on a click/tap outside the card; hovering the card holds it open.
 */
export function CertDialog({ cert, locale, t, returnFocusTo, onClosed }: { cert: CertInfo; locale: string; t: CertStrings; returnFocusTo: RefObject<HTMLElement | null>; onClosed: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const st = useRef<St>({ t: 0, closing: false, reduced: false, rect: null });
  const latest = useRef<Latest>({ onClosed, returnFocusTo });
  useEffect(() => { latest.current = { onClosed, returnFocusTo }; });

  useEffect(() => {
    const d = dlg.current, s = st.current;
    if (!d) return;
    s.closing = false;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!d.open) d.showModal();
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => d.setAttribute('data-state', 'open'));
    d.querySelector<HTMLElement>('.certdlg__close')?.focus();
    s.t = window.setTimeout(() => closeDialog(d, s, latest), AUTO_CLOSE_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(s.t);
      if (d.open) d.close();
      document.body.style.overflow = '';
    };
  }, []);

  const requestClose = () => { if (dlg.current) closeDialog(dlg.current, st.current, latest); };
  const arm = () => { const s = st.current; clearTimeout(s.t); s.t = window.setTimeout(requestClose, AUTO_CLOSE_MS); };

  const onEnter = (e: ReactPointerEvent<HTMLElement>) => {
    const s = st.current;
    clearTimeout(s.t); // hold while the pointer (or a finger) is on the card
    s.rect = e.currentTarget.getBoundingClientRect(); // cached: reading it per move on a rotated element jitters
    if (e.pointerType !== 'touch') e.currentTarget.setAttribute('data-live', '');
  };
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const s = st.current, r = s.rect, el = e.currentTarget;
    if (!r || s.reduced || e.pointerType === 'touch') return;
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(px * TILT_DEG).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-py * TILT_DEG).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = (e: ReactPointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.removeAttribute('data-live');
    for (const p of ['--rx', '--ry', '--gx', '--gy']) el.style.removeProperty(p);
    arm();
  };

  return (
    <dialog
      ref={dlg} className="certdlg" aria-labelledby="cert-title"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} /* inline on purpose: the CSS build keeps only the -webkit- form of backdrop-filter */
      onCancel={(e) => { e.preventDefault(); requestClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
    >
      <button type="button" className="certdlg__close" aria-label={t.closeCert} onClick={requestClose}><X size={22} aria-hidden="true" /></button>
      <figure className="certdlg__fig">
        <div className="certdlg__scene">
          <div className="certcard" onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
            {/* eslint-disable-next-line @next/next/no-img-element -- opened on demand; kept out of the optimizer like the logos */}
            <img src={cert.src} alt={cert.title} width={1200} height={900} decoding="async" draggable={false} />
            <span className="certcard__glare" aria-hidden="true" />
          </div>
        </div>
        <figcaption className="certdlg__cap">
          <strong id="cert-title">{cert.title}</strong>
          <span>{t.issued} {fmtDate(cert.issued, locale)} · {t.validUntil} {fmtDate(cert.expires, locale)} · {t.certId} {cert.id}</span>
        </figcaption>
      </figure>
    </dialog>
  );
}
