'use client';
import { useState, type FormEvent } from 'react';
import { FORMSPREE_ENDPOINT } from '@/lib/site';
import { fireLead, storedClick, track } from '@/lib/track';

type FsReply = { ok?: boolean; errors?: { message?: string }[] };

export interface ContactStrings { name: string; email: string; message: string; submit: string; sending: string; successTitle: string; successBody: string; errorGeneric: string; errorNetwork: string; errorRateLimit: string; bookInstead: string }

export function ContactForm({ locale, t, nextUrl }: { locale: string; t: ContactStrings; nextUrl: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    if (!form.reportValidity()) { e.preventDefault(); return; }
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    const fd = new FormData(form);
    fd.set('_replyto', String(fd.get('email') ?? ''));
    const c = storedClick();
    if (c) { fd.set('ad_click_id', `${c.key}=${c.value}`); fd.set('ad_campaign', c.campaign); }
    try {
      const res = await fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      let body: FsReply | null = null;
      try { body = (await res.clone().json()) as FsReply; } catch { /* non-JSON reply */ }
      const errs = Array.isArray(body?.errors) ? body.errors : [];
      if (res.ok && body?.ok !== false && errs.length === 0) {
        setStatus('success');
        form.reset();
        track('contact_form', { status: 'success', language: locale });
        fireLead('contact_form');
        return;
      }
      let msg = res.status === 429 ? t.errorRateLimit : t.errorGeneric;
      if (errs.length) msg = errs.map((x) => x.message ?? '').filter(Boolean).join('. ') || msg;
      console.warn('[contact] Formspree rejected the submission', res.status, body);
      setStatus('error');
      setError(msg);
      track('contact_form', { status: 'error', language: locale });
    } catch (err) {
      // network/CORS failure: fall back to the classic POST, which lands on Formspree's own thank-you flow
      console.warn('[contact] fetch failed, submitting natively', err);
      setStatus('idle');
      form.submit();
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" tabIndex={-1} className="border border-white/40 bg-white/10 p-8 text-center text-white" data-testid="contact-success">
        <p className="m-0 text-xl font-semibold uppercase tracking-[0.1em]">{t.successTitle}</p>
        <p className="m-0 mt-2 text-ink-100">{t.successBody}</p>
        <a href="#book" className="btn btn-outline-light mt-6" data-track="book_call_click">{t.bookInstead}</a>
      </div>
    );
  }

  const field = 'w-full border border-white/40 bg-white/10 px-4 py-3 text-white placeholder:text-ink-300 focus:border-white focus:outline-none';
  return (
    <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={onSubmit} aria-busy={status === 'submitting'} className="grid gap-4" data-testid="contact-form">
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="hidden" name="_subject" value={`New enquiry from davidgadyan.com (${locale})`} />
      <input type="hidden" name="language" value={locale} />
      <input type="text" name="_gotcha" className="visually-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-ink-200">{t.name}</label>
          <input id="cf-name" name="name" type="text" required minLength={2} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-ink-200">{t.email}</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-ink-200">{t.message}</label>
        <textarea id="cf-message" name="message" required minLength={10} rows={8} className={field} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-outline-light" disabled={status === 'submitting'}>{status === 'submitting' ? t.sending : t.submit}</button>
        <p role="alert" className="m-0 text-sm text-ink-100">{status === 'error' ? error : null}</p>
      </div>
    </form>
  );
}
