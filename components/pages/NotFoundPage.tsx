import Link from 'next/link';
import { getMessages } from '@/lib/i18n/messages';
import { SiteFrame } from '@/components/layout/SiteFrame';

/** Single bilingual 404 (GitHub Pages serves one 404.html for every missing path). */
export function NotFoundPage() {
  const en = getMessages('en');
  const es = getMessages('es');
  return (
    <SiteFrame locale="en">
      <section className="section">
        <div className="container-dg">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">404</p>
            <h1 className="section-title section-title--center mt-2">{en.notFound.title}</h1>
            <p className="lead mt-6">{en.notFound.body}</p>
            <p className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn btn-solid">{en.notFound.home}</Link>
              <Link href="/portfolio/" className="btn btn-outline-dark">{en.notFound.portfolio}</Link>
            </p>
            <div className="mt-14 border-t border-ink-100 pt-10" lang="es">
              <h2 className="text-xl font-semibold uppercase tracking-[0.1em] text-ink-700">{es.notFound.title}</h2>
              <p className="mt-3">{es.notFound.body}</p>
              <p className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/es/" className="btn btn-solid btn-sm">{es.notFound.home}</Link>
                <Link href="/es/portfolio/" className="btn btn-outline-dark btn-sm">{es.notFound.portfolio}</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
